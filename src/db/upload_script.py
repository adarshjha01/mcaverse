import os
from dotenv import load_dotenv
from pathlib import Path

# Go two levels up from this file → mcaverse/.env.local
env_path = Path(__file__).resolve().parents[2] / ".env.local"
print("Loading env from:", env_path)

# Load environment variables
load_dotenv(dotenv_path=env_path)

# Debugging output
print("DEBUG PROJECT:", os.getenv("FIREBASE_PROJECT_ID"))
print("DEBUG EMAIL:", os.getenv("FIREBASE_CLIENT_EMAIL"))
print("DEBUG KEY:", os.getenv("FIREBASE_PRIVATE_KEY")[:50] if os.getenv("FIREBASE_PRIVATE_KEY") else None)

firebase_config = {
    "type": "service_account",
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "token_uri": "https://oauth2.googleapis.com/token",
}