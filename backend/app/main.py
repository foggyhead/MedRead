import sys
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.config import ALLOWED_ORIGINS, RATE_LIMIT, GEMINI_API_KEY
from app.routers import scan

# Fail fast if API key is missing
if not GEMINI_API_KEY:
    print("ERROR: GEMINI_API_KEY environment variable is not set. Set it in .env before starting.", file=sys.stderr)
    sys.exit(1)

# Rate limiter
limiter = Limiter(key_func=get_remote_address, default_limits=[RATE_LIMIT])

app = FastAPI(
    title="MedRead API",
    description="Medicine label reader API powered by Gemini Vision",
    version="1.0.0",
    docs_url="/docs",
    redoc_url=None,
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Routers
app.include_router(scan.router)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.exception_handler(404)
async def not_found(request: Request, exc):
    return JSONResponse({"detail": "Not found"}, status_code=404)


@app.exception_handler(500)
async def server_error(request: Request, exc):
    return JSONResponse({"detail": "Internal server error"}, status_code=500)
