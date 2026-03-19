import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENROUTER_API_KEY = os.getenv("GEMINI_API_KEY", "")  # reuses same env var
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://medread.in,https://www.medread.in",
).split(",")

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/heic"}
RATE_LIMIT = "10/hour"

# Affiliate IDs — set these in your .env once you join each program:
#   1mg:       https://www.1mg.com/affiliate-marketing
#   PharmEasy: https://pharmeasy.in/affiliate
#   Netmeds:   https://www.netmeds.com/affiliates
AFFILIATE_1MG = os.getenv("AFFILIATE_1MG", "")
AFFILIATE_PHARMEASY = os.getenv("AFFILIATE_PHARMEASY", "")
AFFILIATE_NETMEDS = os.getenv("AFFILIATE_NETMEDS", "")
