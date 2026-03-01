// src/db/upload.mjs
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';

// --- CONFIGURATION ---
const SERVICE_ACCOUNT_PATH = './serviceAccountKey.json';
const QUESTIONS_FILE = './src/db/formatted_allQuestions.json';       
const COLLECTION_NAME = 'questions';

// --- LATEX RULES ---
const REPLACEMENTS = [
    { regex: /\b(alpha)\b/gi, replace: "$\\alpha$" },
    { regex: /\b(beta)\b/gi, replace: "$\\beta$" },
    { regex: /\b(gamma)\b/gi, replace: "$\\gamma$" },
    { regex: /\b(theta)\b/gi, replace: "$\\theta$" },
    { regex: /\b(delta)\b/gi, replace: "$\\delta$" },
    { regex: /\b(pi)\b/gi, replace: "$\\pi$" },
    { regex: /\b(sigma)\b/gi, replace: "$\\sigma$" },
    { regex: /<=/g, replace: "$\\le$" },
    { regex: />=/g, replace: "$\\ge$" },
    { regex: /!=/g, replace: "$\\neq$" },
    { regex: /->/g, replace: "$\\rightarrow$" },
    { regex: /\b(sin|cos|tan|log|ln)\b/g, replace: "\\$1" },
    { regex: /([a-zA-Z])\^(\d+)/g, replace: "$$1^{$2}$" }, 
    { regex: /([a-zA-Z])_(\d+)/g, replace: "$$1_{$2}$" },
    { regex: /\binfinity\b/gi, replace: "$\\infty$" },
];

function formatText(text) {
    if (!text || typeof text !== 'string') return text;
    let formatted = text;
    REPLACEMENTS.forEach(rule => {
        formatted = formatted.replace(rule.regex, rule.replace);
    });
    return formatted;
}

// --- INITIALIZATION ---
if (!existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error("❌ Error: 'serviceAccountKey.json' not found.");
    process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// --- HELPER: Delete Collection ---
async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();
  const batchSize = snapshot.size;
  if (batchSize === 0) { resolve(); return; }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  console.log(`🗑️  Deleted ${batchSize} documents...`);
  process.nextTick(() => deleteQueryBatch(db, query, resolve));
}

// --- MAIN FORMAT & UPLOAD ---
async function formatAndUpload() {
    console.log("⚠️  Starting FORMAT & UPLOAD Protocol...");

    try {
        // 1. READ FILE
        if (!existsSync(QUESTIONS_FILE)) {
            console.error("❌ Error: questions.json not found!");
            process.exit(1);
        }
        
        const questions = JSON.parse(readFileSync(QUESTIONS_FILE, 'utf8'));
        console.log(`📖 Loaded ${questions.length} questions from questions.json`);

        // 2. FORMAT LOGIC
        console.log("🔄 Formatting content...");
        const finalData = questions.map(q => {
            if (q.question_text) {
                q.question_text = formatText(q.question_text);
            }
            if (q.options && Array.isArray(q.options)) {
                q.options = q.options.map(opt => formatText(opt));
            }
            if (q.explanation) {
                q.explanation = formatText(q.explanation);
            }
            return q;
        });

        // 3. DELETE OLD DB
        console.log(`\n1️⃣  Wiping '${COLLECTION_NAME}' collection...`);
        await deleteCollection(db, COLLECTION_NAME, 500);
        console.log("✅ Collection cleared.");

        // 4. UPLOAD FORMATTED DATA
        console.log("\n2️⃣  Uploading formatted data...");
        let batch = db.batch();
        let count = 0;
        let total = 0;

        for (const q of finalData) {
            const docRef = q.question_id 
                ? db.collection(COLLECTION_NAME).doc(String(q.question_id))
                : db.collection(COLLECTION_NAME).doc();

            // Sanitize data for Firestore
            const cleanQ = JSON.parse(JSON.stringify(q)); 
            
            batch.set(docRef, cleanQ);
            count++;
            total++;

            // Firestore limits batches to 500 writes. 400 is a safe threshold.
            if (count >= 400) {
                await batch.commit();
                console.log(`🚀 Uploaded ${total} questions...`);
                batch = db.batch();
                count = 0;
            }
        }

        // Commit any remaining documents in the final batch
        if (count > 0) {
            await batch.commit();
            console.log(`🚀 Uploaded ${total} questions...`);
        }

        console.log(`\n🎉 SUCCESS! Database updated with ${total} questions.`);

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

formatAndUpload();