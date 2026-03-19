import json
import re
import io
import base64
import httpx
from fastapi import APIRouter, File, UploadFile, HTTPException, Request, Form
from pydantic import BaseModel
from PIL import Image
from typing import Optional

from app.config import GEMINI_API_KEY, MAX_FILE_SIZE, ALLOWED_MIME_TYPES

router = APIRouter()

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "google/gemini-2.0-flash-001"

LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi",
    "bn": "Bengali",
    "te": "Telugu",
    "mr": "Marathi",
    "ta": "Tamil",
    "gu": "Gujarati",
    "kn": "Kannada",
    "ml": "Malayalam",
    "pa": "Punjabi",
    "or": "Odia",
}

SCAN_PROMPT = """You are a medicine label reader assistant for Indian users.
Analyze this medicine label/strip/packaging image and extract information.
Respond ONLY in valid JSON format with these exact keys:

{{
  "medicine_name": "Brand name of the medicine (keep in English/original script)",
  "what_is_this": "One plain sentence in {language}. What this medicine is.",
  "used_for": ["3-5 bullet points in {language} about what it treats"],
  "how_to_take": "Dosage and timing in {language}",
  "side_effects": ["Top 3-4 only in {language}, plain language, not scary"],
  "who_should_be_careful": ["Specific groups in {language}: pregnant women, diabetics, children, kidney/liver patients, etc."],
  "alcohol_safe": true,
  "alcohol_reason": "One line in {language} about alcohol interaction",
  "generic_name": "Generic/chemical name (keep in English)",
  "confidence": "low, medium, or high"
}}

Rules:
- Respond entirely in {language} except medicine_name and generic_name which stay in English.
- Use plain, friendly language. Imagine explaining to a friend.
- confidence = "high" if label is clearly readable, "medium" if partially readable, "low" if unclear.
- NEVER make up information. If unsure about a field, use null.
- Respond ONLY with the JSON object, no markdown, no extra text."""

FOLLOWUP_PROMPT = """You are a helpful medicine assistant for Indian users.
The user is asking about the following medicine:

{medicine_context}

User's question: {question}

Rules:
- Answer ONLY if the question is about this medicine or medication in general.
- If off-topic, politely refuse.
- Plain, friendly language. No jargon. 2-4 sentences max.
- End with "Consult your doctor for personalized advice." if it involves health decisions.
- Respond in the same language as the user's question.

Respond with just the answer text, no JSON."""


def extract_json(text: str) -> dict:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return json.loads(text)


def image_to_base64(image_bytes: bytes) -> tuple[str, str]:
    img = Image.open(io.BytesIO(image_bytes))
    buf = io.BytesIO()
    fmt = img.format or "JPEG"
    if fmt not in ("JPEG", "PNG", "WEBP"):
        fmt = "JPEG"
    img.save(buf, format=fmt)
    b64 = base64.b64encode(buf.getvalue()).decode()
    mime = f"image/{fmt.lower()}"
    return b64, mime


async def call_openrouter(prompt: str, image_bytes: bytes | None = None) -> str:
    content = [{"type": "text", "text": prompt}]

    if image_bytes:
        b64, mime = image_to_base64(image_bytes)
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:{mime};base64,{b64}"},
        })

    payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": content}],
    }

    headers = {
        "Authorization": f"Bearer {GEMINI_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://medread.in",
        "X-Title": "MedRead",
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(OPENROUTER_URL, json=payload, headers=headers)
        if resp.status_code != 200:
            print(f"OpenRouter error {resp.status_code}: {resp.text[:400]}")
            raise HTTPException(status_code=502, detail=f"AI API error: {resp.status_code}")
        data = resp.json()
        return data["choices"][0]["message"]["content"]


async def validate_image(file: UploadFile) -> bytes:
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Max 10MB allowed.")
    mime = file.content_type or ""
    filename = file.filename or ""
    if mime not in ALLOWED_MIME_TYPES and not filename.lower().endswith(".heic"):
        raise HTTPException(status_code=415, detail="Unsupported file type. Please upload JPG, PNG, WEBP, or HEIC.")
    return content


async def run_scan(image_bytes: bytes, lang: str) -> dict:
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured.")

    language = LANGUAGE_NAMES.get(lang, "English")
    prompt = SCAN_PROMPT.format(language=language)

    try:
        print(f"Scanning in {language}...")
        text = await call_openrouter(prompt, image_bytes)
        print("Response:", text[:200])
        result = extract_json(text)

        required = ["medicine_name", "what_is_this", "used_for", "how_to_take",
                    "side_effects", "who_should_be_careful", "alcohol_safe",
                    "alcohol_reason", "generic_name", "confidence"]
        for field in required:
            if field not in result:
                result[field] = None

        for field in ["used_for", "side_effects", "who_should_be_careful"]:
            if not isinstance(result.get(field), list):
                result[field] = []

        if result.get("confidence") not in ("low", "medium", "high"):
            result["confidence"] = "low"

        return result

    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        raise HTTPException(status_code=422, detail="Could not parse medicine information. Please try a clearer image.")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/api/scan")
async def scan_medicine(
    request: Request,
    file: UploadFile = File(...),
    lang: Optional[str] = Form(default="en"),
):
    image_bytes = await validate_image(file)
    return await run_scan(image_bytes, lang or "en")


# Keep old hindi endpoint for backward compat
@router.post("/api/scan-hindi")
async def scan_medicine_hindi(request: Request, file: UploadFile = File(...)):
    image_bytes = await validate_image(file)
    return await run_scan(image_bytes, "hi")


class SearchRequest(BaseModel):
    name: str
    lang: Optional[str] = "en"


class FollowUpRequest(BaseModel):
    medicine_context: str
    question: str


@router.post("/api/search")
async def search_medicine(request: Request, body: SearchRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured.")
    if not body.name.strip():
        raise HTTPException(status_code=400, detail="Medicine name is required.")
    if len(body.name) > 200:
        raise HTTPException(status_code=400, detail="Medicine name too long.")

    language = LANGUAGE_NAMES.get(body.lang or "en", "English")
    prompt = f"""You are a medicine information assistant for Indian users.
The user wants to know about this medicine: "{body.name}"

Provide accurate information about this medicine. Respond ONLY in valid JSON with these exact keys:

{{
  "medicine_name": "Correct full brand/generic name",
  "what_is_this": "One plain sentence in {language}. What this medicine is.",
  "used_for": ["3-5 bullet points in {language} about what it treats"],
  "how_to_take": "Typical dosage and timing in {language}",
  "side_effects": ["Top 3-4 common side effects in {language}, plain language"],
  "who_should_be_careful": ["Specific groups in {language} who should be cautious"],
  "alcohol_safe": true or false,
  "alcohol_reason": "One line in {language} about alcohol interaction",
  "generic_name": "Generic/chemical name in English",
  "confidence": "high"
}}

Rules:
- Respond entirely in {language} except medicine_name and generic_name.
- Use plain, friendly language. No jargon.
- If the medicine name is unclear or unknown, set confidence to "low" and fill what you can.
- NEVER make up information. If unsure about a field, use null.
- Respond ONLY with the JSON object, no markdown, no extra text."""

    try:
        print(f"Searching medicine: {body.name} in {language}")
        text = await call_openrouter(prompt)
        print("Response:", text[:200])
        result = extract_json(text)

        required = ["medicine_name", "what_is_this", "used_for", "how_to_take",
                    "side_effects", "who_should_be_careful", "alcohol_safe",
                    "alcohol_reason", "generic_name", "confidence"]
        for field in required:
            if field not in result:
                result[field] = None

        for field in ["used_for", "side_effects", "who_should_be_careful"]:
            if not isinstance(result.get(field), list):
                result[field] = []

        if result.get("confidence") not in ("low", "medium", "high"):
            result["confidence"] = "high"

        return result

    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="Could not find information for this medicine.")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@router.post("/api/followup")
async def follow_up(request: Request, body: FollowUpRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured.")
    if len(body.question) > 500:
        raise HTTPException(status_code=400, detail="Question too long.")

    prompt = FOLLOWUP_PROMPT.format(
        medicine_context=body.medicine_context,
        question=body.question,
    )
    try:
        answer = await call_openrouter(prompt)
        return {"answer": answer.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get answer: {str(e)}")
