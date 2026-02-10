// src/db/mergeAndUpload.mjs
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';

// --- CONFIGURATION ---
const SERVICE_ACCOUNT_PATH = './serviceAccountKey.json';
const QUESTIONS_FILE = './src/db/questions.json';       // Source of NEW content
const LATEX_FILE = './src/db/questions.latex.json';     // Source of EXISTING formatting
const COLLECTION_NAME = 'questions';

// --- LATEX RULES (For auto-formatting new explanations) ---
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
    if (!text) return text;
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

// --- MAIN MERGE & UPLOAD ---
async function mergeAndUpload() {
    console.log("⚠️  Starting MERGE & UPLOAD Protocol...");

    try {
        // 1. READ FILES
        let questions = [];
        let latexQuestions = [];

        if (existsSync(QUESTIONS_FILE)) {
            questions = JSON.parse(readFileSync(QUESTIONS_FILE, 'utf8'));
            console.log(`📖 Loaded ${questions.length} questions from questions.json (Content Source)`);
        } else {
            console.error("❌ Error: questions.json not found!");
            process.exit(1);
        }

        if (existsSync(LATEX_FILE)) {
            latexQuestions = JSON.parse(readFileSync(LATEX_FILE, 'utf8'));
            console.log(`📖 Loaded ${latexQuestions.length} questions from questions.latex.json (Format Source)`);
        } else {
            console.log("⚠️  questions.latex.json not found. Will auto-format everything.");
        }

        // 2. MERGE LOGIC
        console.log("🔄 Merging content with formatting...");
        
        // Create a map of LaTeX questions for fast lookup by ID (or Question Text)
        const latexMap = new Map();
        latexQuestions.forEach(q => {
            // Prefer ID if available, else use question text as key
            const key = q.question_id || q.question_text; 
            latexMap.set(String(key), q);
        });

        const finalData = questions.map(q => {
            const key = String(q.question_id || q.question_text);
            const latexQ = latexMap.get(key);

            // A. Question Text: Use LaTeX version if exists (presumes manual fixes), else Auto-Format
            if (latexQ && latexQ.question_text) {
                q.question_text = latexQ.question_text;
            } else {
                q.question_text = formatText(q.question_text);
            }

            // B. Options: Use LaTeX version if exists
            if (latexQ && latexQ.options) {
                q.options = latexQ.options;
            } else {
                q.options = q.options.map(opt => formatText(opt));
            }

            // C. Explanation: ALWAYS use 'questions.json' (User Edits) + Auto-Format
            // This ensures your new explanations are used, but we turn "alpha" into "$\alpha$"
            if (q.explanation) {
                q.explanation = formatText(q.explanation);
            }

            return q;
        });

        // 3. DELETE OLD DB
        console.log(`\n1️⃣  Wiping '${COLLECTION_NAME}' collection...`);
        await deleteCollection(db, COLLECTION_NAME, 500);
        console.log("✅ Collection cleared.");

        // 4. UPLOAD MERGED DATA
        console.log("\n2️⃣  Uploading merged data...");
        let batch = db.batch();
        let count = 0;
        let total = 0;

        for (const q of finalData) {
            const docRef = q.question_id 
                ? db.collection(COLLECTION_NAME).doc(String(q.question_id))
                : db.collection(COLLECTION_NAME).doc();

            // Sanitize data (remove undefined)
            const cleanQ = JSON.parse(JSON.stringify(q)); 
            
            batch.set(docRef, cleanQ);
            count++;
            total++;

            if (count >= 400) {
                await batch.commit();
                console.log(`🚀 Uploaded ${total} questions...`);
                batch = db.batch();
                count = 0;
            }
        }

        if (count > 0) {
            await batch.commit();
        }

        console.log(`\n🎉 SUCCESS! Database updated with ${total} questions.`);
        console.log("   - Preserved LaTeX formatting from file.");
        console.log("   - Included NEW explanations from questions.json.");
        console.log("   - Auto-formatted new explanations.");

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

mergeAndUpload();