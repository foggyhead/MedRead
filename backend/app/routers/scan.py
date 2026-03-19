import json
import re
import base64
import httpx
import urllib.parse
from fastapi import APIRouter, File, UploadFile, HTTPException, Request, Form
from pydantic import BaseModel
from typing import Optional

from app.config import GEMINI_API_KEY, MAX_FILE_SIZE, ALLOWED_MIME_TYPES, AFFILIATE_1MG, AFFILIATE_PHARMEASY, AFFILIATE_NETMEDS

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


def image_to_base64(image_bytes: bytes, content_type: str = "image/jpeg") -> tuple[str, str]:
    mime = content_type.lower().split(";")[0].strip()
    if mime not in ("image/jpeg", "image/png", "image/webp"):
        mime = "image/jpeg"
    b64 = base64.b64encode(image_bytes).decode()
    return b64, mime


async def call_openrouter(prompt: str, image_bytes: bytes | None = None, content_type: str = "image/jpeg") -> str:
    content = [{"type": "text", "text": prompt}]

    if image_bytes:
        b64, mime = image_to_base64(image_bytes, content_type)
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


async def run_scan(image_bytes: bytes, lang: str, content_type: str = "image/jpeg") -> dict:
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured.")

    language = LANGUAGE_NAMES.get(lang, "English")
    prompt = SCAN_PROMPT.format(language=language)

    try:
        print(f"Scanning in {language}...")
        text = await call_openrouter(prompt, image_bytes, content_type)
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
    return await run_scan(image_bytes, lang or "en", file.content_type or "image/jpeg")


# Keep old hindi endpoint for backward compat
@router.post("/api/scan-hindi")
async def scan_medicine_hindi(request: Request, file: UploadFile = File(...)):
    image_bytes = await validate_image(file)
    return await run_scan(image_bytes, "hi", file.content_type or "image/jpeg")


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


# ── Symptom-based medicine recommendation ──────────────────────────────────

SYMPTOMS_PROMPT = """You are a helpful medicine assistant for Indian users.
The user has these symptoms: "{symptoms}"

Recommend 3-4 appropriate over-the-counter (OTC) medicines commonly available in Indian pharmacies.
IMPORTANT: Only recommend OTC medicines. Never recommend prescription-only drugs.
If symptoms suggest a potentially serious condition (chest pain, difficulty breathing, high fever in infant, stroke signs), set needs_doctor to true.

Respond ONLY in valid JSON:

{{
  "needs_doctor": false,
  "doctor_note": null,
  "medicines": [
    {{
      "medicine_name": "Brand name commonly sold in India (e.g. Dolo 650, Crocin, Allegra)",
      "generic_name": "Generic/chemical name in English",
      "what_is_this": "One plain sentence in {language}",
      "used_for": ["2-3 bullet points in {language} — why it helps these symptoms"],
      "side_effects": ["2-3 most common side effects in {language}, plain language"],
      "who_should_be_careful": ["Key groups in {language}: pregnant, children, diabetics, etc."],
      "confidence": "high"
    }}
  ]
}}

Rules:
- medicine_name and generic_name must stay in English.
- All other text in {language}.
- Rank medicines from most recommended to least.
- If needs_doctor is true, doctor_note should be a short warning in {language}.
- Respond ONLY with the JSON object, no markdown, no extra text."""


def get_purchase_links(medicine_name: str) -> list[dict]:
    """
    Generate search-page URLs for major Indian online pharmacies.
    Set AFFILIATE_1MG, AFFILIATE_PHARMEASY, AFFILIATE_NETMEDS in .env
    to earn commissions on purchases. Links work without IDs too.
    """
    q = urllib.parse.quote(medicine_name)

    url_1mg = f"https://www.1mg.com/search/all?name={q}"
    if AFFILIATE_1MG:
        url_1mg += f"&utm_source=medread&utm_medium=affiliate&ref={AFFILIATE_1MG}"
    else:
        url_1mg += "&utm_source=medread&utm_medium=referral"

    url_pharmeasy = f"https://pharmeasy.in/search/all?name={q}"
    if AFFILIATE_PHARMEASY:
        url_pharmeasy += f"&utm_source=medread&utm_medium=affiliate&ref={AFFILIATE_PHARMEASY}"
    else:
        url_pharmeasy += "&utm_source=medread&utm_medium=referral"

    url_netmeds = f"https://www.netmeds.com/catalogsearch/result?q={q}"
    if AFFILIATE_NETMEDS:
        url_netmeds += f"&utm_source=medread&utm_medium=affiliate&ref={AFFILIATE_NETMEDS}"
    else:
        url_netmeds += "&utm_source=medread&utm_medium=referral"

    return [
        {"store": "1mg",       "url": url_1mg,       "color": "#e74c3c"},
        {"store": "PharmEasy", "url": url_pharmeasy,  "color": "#2ecc71"},
        {"store": "Netmeds",   "url": url_netmeds,    "color": "#3498db"},
    ]


class SymptomsRequest(BaseModel):
    symptoms: str
    lang: Optional[str] = "en"


@router.post("/api/symptoms")
async def recommend_by_symptoms(request: Request, body: SymptomsRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured.")
    if not body.symptoms.strip():
        raise HTTPException(status_code=400, detail="Symptoms are required.")
    if len(body.symptoms) > 500:
        raise HTTPException(status_code=400, detail="Symptoms text too long.")

    language = LANGUAGE_NAMES.get(body.lang or "en", "English")
    prompt = SYMPTOMS_PROMPT.format(symptoms=body.symptoms.strip(), language=language)

    try:
        print(f"Symptom search: {body.symptoms[:80]} in {language}")
        text = await call_openrouter(prompt)
        print("Response:", text[:200])
        result = extract_json(text)

        # Validate and attach purchase links to each medicine
        medicines = result.get("medicines", [])
        if not isinstance(medicines, list):
            medicines = []

        required_fields = ["medicine_name", "generic_name", "what_is_this",
                           "used_for", "side_effects", "who_should_be_careful", "confidence"]
        cleaned = []
        for med in medicines[:4]:
            for field in required_fields:
                if field not in med:
                    med[field] = None
            for list_field in ["used_for", "side_effects", "who_should_be_careful"]:
                if not isinstance(med.get(list_field), list):
                    med[list_field] = []
            if med.get("confidence") not in ("low", "medium", "high"):
                med["confidence"] = "high"
            # Attach purchase links
            med["purchase_links"] = get_purchase_links(med["medicine_name"] or "")
            cleaned.append(med)

        return {
            "needs_doctor": bool(result.get("needs_doctor", False)),
            "doctor_note": result.get("doctor_note"),
            "medicines": cleaned,
        }

    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="Could not process symptom information. Please try again.")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Symptom search error: {e}")
        raise HTTPException(status_code=500, detail=f"Symptom search failed: {str(e)}")
