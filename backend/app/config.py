import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables robustly
_env_path = Path(__file__).resolve().parent.parent / ".env"
if _env_path.exists():
    load_dotenv(dotenv_path=_env_path)
load_dotenv()

# Get Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")


# Check credentials
if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL is missing from .env")

if not SUPABASE_SECRET_KEY:
    raise ValueError("SUPABASE_SECRET_KEY is missing from .env")


# Create Supabase client
supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
)

# Razorpay credentials for Industry & Institution Billing
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_placeholder")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "test_secret_placeholder")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "webhook_secret_placeholder")

class Settings:
    SUPABASE_URL: str = SUPABASE_URL
    SUPABASE_SECRET_KEY: str = SUPABASE_SECRET_KEY
    RAZORPAY_KEY_ID: str = RAZORPAY_KEY_ID
    RAZORPAY_KEY_SECRET: str = RAZORPAY_KEY_SECRET
    RAZORPAY_WEBHOOK_SECRET: str = RAZORPAY_WEBHOOK_SECRET

settings = Settings()