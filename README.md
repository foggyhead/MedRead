# MedRead — Medicine Label Reader

> Your medicine, in plain language. No medical degree required.

MedRead lets any Indian family upload a photo of a medicine strip, label, or prescription and instantly get a jargon-free explanation — in English or Hindi.

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| Backend | FastAPI (Python 3.11+) |
| AI | Google Gemini via OpenRouter (`gemini-2.0-flash-001`) |
| Storage | Browser `localStorage` only — no database, no auth |

---

## Project Structure

```
medread/
├── frontend/          # Next.js 14 app
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── scan/page.tsx      # Scanner page
│   │   ├── cabinet/page.tsx   # Medicine cabinet
│   │   ├── layout.tsx         # Root layout + metadata
│   │   ├── sitemap.ts         # Auto-generated sitemap
│   │   └── robots.ts          # robots.txt
│   ├── components/
│   │   ├── Scanner.tsx        # Upload + camera component
│   │   ├── ResultCard.tsx     # Medicine result display
│   │   ├── FollowUp.tsx       # Follow-up Q&A
│   │   ├── LanguageToggle.tsx # EN / हिंदी toggle
│   │   ├── ShareButton.tsx    # WhatsApp share
│   │   ├── Navbar.tsx
│   │   └── Disclaimer.tsx
│   └── lib/
│       └── api.ts             # API client + localStorage helpers
└── backend/
    ├── app/
    │   ├── main.py            # FastAPI app + CORS + rate limiting
    │   ├── config.py          # Environment config
    │   └── routers/
    │       └── scan.py        # /api/scan, /api/scan-hindi, /api/followup
    └── requirements.txt
```

---

## Getting Started

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run the server
uvicorn app.main:app --reload --port 8000
```

Get a free API key at [openrouter.ai](https://openrouter.ai).

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/scan` | Scan medicine image → JSON result (English) |
| `POST` | `/api/scan-hindi` | Scan medicine image → JSON result (Hindi) |
| `POST` | `/api/followup` | Ask a follow-up question about a medicine |
| `GET` | `/health` | Health check |

### POST /api/scan

**Request:** `multipart/form-data` with `file` field (image, max 10MB, JPG/PNG/WEBP/HEIC)

**Response:**
```json
{
  "medicine_name": "Paracetamol 500mg",
  "what_is_this": "A common painkiller and fever reducer",
  "used_for": ["Headache", "Fever", "Body pain"],
  "how_to_take": "1 tablet every 4-6 hours. Max 4 tablets per day.",
  "side_effects": ["Nausea", "Stomach upset"],
  "who_should_be_careful": ["Liver disease patients", "Heavy alcohol users"],
  "alcohol_safe": false,
  "alcohol_reason": "Can cause liver damage when combined with alcohol",
  "generic_name": "acetaminophen",
  "confidence": "high"
}
```

### POST /api/followup

**Request:**
```json
{
  "medicine_context": "Medicine: Paracetamol 500mg...",
  "question": "Can I take this with food?"
}
```

**Response:**
```json
{
  "answer": "Yes, you can take Paracetamol with or without food..."
}
```

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
vercel deploy
```

Set `NEXT_PUBLIC_API_URL` to your Railway backend URL in Vercel dashboard.

### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service** → connect repo
3. Set **Root Directory:** `backend`
4. **Build Command:** `pip install -r requirements.txt`
5. **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add env vars: `GEMINI_API_KEY` (your OpenRouter key) and `ALLOWED_ORIGINS` (your Vercel domain)

---

## Design System

- **Background:** `#0a0a0a` · **Surface:** `#111111` · **Card:** `#1a1a1a`
- **Accent:** `#7c6af7` (purple) · **Mint:** `#22d3a5`
- **Fonts:** Fraunces (display) · Inter (body) · JetBrains Mono (code)
- Glass morphism cards · Framer Motion page transitions · Mobile-first

---

## Privacy

- Images are sent to the backend for analysis and **immediately discarded**
- No images or results are stored on any server
- Saved medicines live only in your browser's `localStorage`

---

**Not a substitute for professional medical advice. Always consult your doctor or pharmacist.**
