import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Load .env.local
dotenv_path = os.path.join(os.path.dirname(__file__), "../../.env.local")
print("DEBUG: loading from", dotenv_path)
load_dotenv(dotenv_path)

# Read key path from env
key_path = os.getenv("FIREBASE_KEY_PATH")

# Fallback if not set
if not key_path:
    key_path = os.path.join(os.path.dirname(__file__), "../../serviceAccountKey.json")
    print("DEBUG: FIREBASE_KEY_PATH missing, using fallback:", key_path)

if not os.path.exists(key_path):
    raise FileNotFoundError(f"Service account key not found at {key_path}")

print("DEBUG: Using service account key at:", key_path)

# Initialize Firebase
cred = credentials.Certificate(key_path)
firebase_admin.initialize_app(cred)

db = firestore.client()

# Example: seeding exams collection
exams_data = [
    {"id": "exam1", "name": "NIMCET 2024", "total_questions": 120},
    {"id": "exam2", "name": "CUET PG MCA 2024", "total_questions": 100},
]

for exam in exams_data:
    db.collection("exams").document(exam["id"]).set(exam)
    print(f"Seeded exam: {exam['name']}")

print("Firestore seeding complete ✅")