// src/db/uploadCleanData.mjs
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';

// --- CONFIGURATION ---
const SERVICE_ACCOUNT_PATH = './serviceAccountKey.json';
// Make sure this matches the actual file name in your folder
// You mentioned "questions-clean.json" in your prompt, but your file list shows "questions_clean.json"
const DATA_FILE = './src/db/questions_clean.json'; 
const COLLECTION_NAME = 'questions';

// --- INITIALIZATION ---
if (!existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error("❌ Error: 'serviceAccountKey.json' not found.");
    process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function uploadData() {
    console.log(`🚀 Starting upload to '${COLLECTION_NAME}'...`);

    try {
        // 1. READ FILE
        if (!existsSync(DATA_FILE)) {
            console.error(`❌ Error: Data file '${DATA_FILE}' not found.`);
            process.exit(1);
        }

        const questions = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
        console.log(`📖 Loaded ${questions.length} questions from file.`);

        if (questions.length === 0) {
            console.warn("⚠️ File is empty. Nothing to upload.");
            return;
        }

        // 2. UPLOAD LOOP
        let batch = db.batch();
        let count = 0;
        let total = 0;

        for (const q of questions) {
            // Use existing ID if present, otherwise generate new one
            const docRef = q.question_id 
                ? db.collection(COLLECTION_NAME).doc(String(q.question_id))
                : db.collection(COLLECTION_NAME).doc();

            // Add timestamps if missing
            const payload = {
                ...q,
                createdAt: new Date(),
                // Ensure correct_answers is an array of integers (fix common JSON issues)
                correct_answers: Array.isArray(q.correct_answers) ? q.correct_answers : [0] 
            };
            
            batch.set(docRef, payload);
            count++;
            total++;

            // Firestore limits batches to 500 operations
            if (count >= 400) {
                await batch.commit();
                console.log(`✅ Uploaded ${total} questions...`);
                batch = db.batch();
                count = 0;
            }
        }

        // Commit final batch
        if (count > 0) {
            await batch.commit();
        }

        console.log(`\n🎉 SUCCESS! Uploaded ${total} documents to '${COLLECTION_NAME}'.`);

    } catch (error) {
        console.error("❌ Upload Failed:", error);
    }
}

uploadData();