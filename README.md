# MedRead — Medicine Assistant for Indian Families

> Scan a label. Search a name. Describe your symptoms. Understand your medicine in plain language.

**MedRead** helps any Indian family understand medicines instantly — no medical degree required. Upload a photo, type a name, or describe your symptoms and get a complete plain-language breakdown in **11 Indian languages**.

🌐 **Live:** [medread.in](https://medread.in)

---

## What it does

### Three ways to use it

| Mode | How it works |
|------|-------------|
| 📷 **Scan a Photo** | Upload or capture a medicine label, strip, or packaging — AI reads it and explains everything |
| 🔍 **Search by Name** | Type any brand or generic name (Dolo 650, Metformin, Amoxicillin) — get a full breakdown instantly |
| 🩺 **Search by Symptoms** | Describe what you feel — get 3–4 ranked OTC medicine recommendations with direct buy links |

### What you get for every medicine

- Plain-language explanation of what the medicine is
- What conditions it treats
- How and when to take it
- Top 3–4 side effects (plain words, not scary)
- Who should be careful (pregnant women, diabetics, kidney/liver patients, etc.)
- Alcohol safety — clear yes/no with reason
- **Buy links** to 1mg, PharmEasy, and Netmeds (with affiliate tracking support)
- **WhatsApp share** — share any result or symptom recommendation instantly
- **Ask follow-up questions** — chat-style Q&A, history saved per medicine

### Medicine Cabinet

- Save any result for quick reference later
- Search and filter saved medicines
- Export to JSON backup / import from backup
- All data stays in your browser — nothing sent to any server

### Home page

- Recently Searched pills — one click to re-open any past search with input pre-filled

---

## Languages

English · हिंदी · বাংলা · తెలుగు · मराठी · தமிழ் · ગુજરાતી · ಕನ್ನಡ · മലയാളം · ਪੰਜਾਬੀ · ଓଡ଼ିଆ

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| Backend | FastAPI (Python 3.11+) |
| AI | Google Gemini 2.0 Flash via OpenRouter |
| Storage | Browser `localStorage` only — no database, no auth |

---

## Project Structure

```
MedRead/
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Landing page with 3 mode cards + recently searched
│   │   ├── scan/page.tsx         # Medicine assistant page
│   │   ├── cabinet/page.tsx      # Medicine cabinet
│   │   ├── og/route.tsx          # Dynamic OG image for social sharing
│   │   ├── layout.tsx            # Root layout + SEO metadata
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── Scanner.tsx           # 3-tab scanner (photo / name / symptoms)
│   │   ├── ResultCard.tsx        # Medicine result with all sections
│   │   ├── SymptomResultCard.tsx # Ranked OTC recommendations + buy links
│   │   ├── FollowUp.tsx          # Chat-style Q&A, history persisted
│   │   ├── RecentSearches.tsx    # Recently searched pills on home page
│   │   ├── LanguageToggle.tsx    # 11-language scrollable selector
│   │   ├── ShareButton.tsx       # WhatsApp share (medicine results)
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── lib/
│       └── api.ts                # API client, localStorage helpers, formatters
└── backend/
    ├── app/
    │   ├── main.py               # FastAPI app + CORS + rate limiting
    │   ├── config.py             # Env config (API key, affiliate IDs, etc.)
    │   └── routers/
    │       └── scan.py           # All API endpoints + purchase link builder
    ├── requirements.txt
    └── .env.example
```

---

## Getting Started

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — add your GEMINI_API_KEY (get one free at openrouter.ai)

# Start server
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend

npm install

# Configure environment
cp .env.local.example .env.local
# Set: NEXT_PUBLIC_API_URL=http://localhost:8000

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/scan` | Scan medicine image → full result |
| `POST` | `/api/search` | Search medicine by name → full result |
| `POST` | `/api/symptoms` | Describe symptoms → 3–4 OTC recommendations with buy links |
| `POST` | `/api/followup` | Ask a follow-up question about a medicine |
| `GET` | `/health` | Health check |

### POST /api/scan · /api/search

`/api/scan` accepts `multipart/form-data` with `file` (image, max 10MB) and `lang` fields.
`/api/search` accepts `{ "name": "Dolo 650", "lang": "hi" }`.

**Response:**
```json
{
  "medicine_name": "Dolo 650",
  "generic_name": "paracetamol",
  "what_is_this": "A common painkiller and fever reducer",
  "used_for": ["Headache", "Fever", "Body pain"],
  "how_to_take": "1 tablet every 4–6 hours. Max 4 tablets per day.",
  "side_effects": ["Nausea", "Stomach upset"],
  "who_should_be_careful": ["Liver disease patients", "Heavy alcohol users"],
  "alcohol_safe": false,
  "alcohol_reason": "Can cause liver damage when combined with alcohol",
  "confidence": "high"
}
```

### POST /api/symptoms

**Request:** `{ "symptoms": "headache and mild fever since morning", "lang": "en" }`

**Response:**
```json
{
  "needs_doctor": false,
  "doctor_note": null,
  "medicines": [
    {
      "medicine_name": "Dolo 650",
      "generic_name": "paracetamol",
      "what_is_this": "A painkiller and fever reducer",
      "used_for": ["Relieves headache", "Reduces fever"],
      "side_effects": ["Nausea", "Stomach upset"],
      "who_should_be_careful": ["Liver patients"],
      "confidence": "high",
      "purchase_links": [
        { "store": "1mg", "url": "https://www.1mg.com/search/all?name=Dolo+650&utm_source=medread" },
        { "store": "PharmEasy", "url": "https://pharmeasy.in/search/all?name=Dolo+650&utm_source=medread" },
        { "store": "Netmeds", "url": "https://www.netmeds.com/catalogsearch/result?q=Dolo+650&utm_source=medread" }
      ]
    }
  ]
}
```

---

## Deployment

### Frontend → Vercel

```bash
cd frontend && vercel deploy
```

Set env var in Vercel dashboard:
```
NEXT_PUBLIC_API_URL = https://your-backend.onrender.com
```

### Backend → Render

1. Push to GitHub
2. [render.com](https://render.com) → **New Web Service** → connect repo
3. **Root Directory:** `backend`
4. **Build Command:** `pip install -r requirements.txt`
5. **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables:

| Variable | Value |
|----------|-------|
| `GEMINI_API_KEY` | Your OpenRouter API key |
| `ALLOWED_ORIGINS` | `https://medread.in,https://www.medread.in` |
| `AFFILIATE_1MG` | *(optional)* Your 1mg affiliate ID |
| `AFFILIATE_PHARMEASY` | *(optional)* Your PharmEasy affiliate ID |
| `AFFILIATE_NETMEDS` | *(optional)* Your Netmeds affiliate ID |

Affiliate links work without IDs — they still carry `utm_source=medread` for analytics. Add IDs when you join the programs to earn commission.

---

## Monetisation

MedRead has affiliate link support built in. Every "Buy online" button on symptom results links to the medicine's search page on 1mg, PharmEasy, and Netmeds. When users click and purchase, you earn a commission.

1. Join affiliate programs: [1mg](https://www.1mg.com/affiliate-marketing) · [PharmEasy](https://pharmeasy.in/affiliate) · [Netmeds](https://www.netmeds.com/affiliates)
2. Add your IDs to Render env vars (see above)
3. Done — all links automatically include your tracking

---

## Privacy

- Medicine photos are processed instantly and **never stored**
- No user accounts, no tracking, no analytics on user data
- Saved medicines and search history live only in the user's browser `localStorage`
- Backend exits at startup if `GEMINI_API_KEY` is missing — no silent failures

---

## Design

- **Background:** `#030d0a` · **Surface:** `#071a14` / `#0c2620`
- **Accent gradient:** `#34d399 → #22d3ee` (emerald → cyan)
- **Fonts:** Fraunces (display) · Inter (body) · JetBrains Mono (mono)
- Mobile-first · Framer Motion animations · Deep emerald dark theme

---

**Not a substitute for professional medical advice. Always consult your doctor or pharmacist.**
