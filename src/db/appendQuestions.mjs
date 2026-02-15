// src/db/appendQuestions.mjs
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

// --- MAIN APPEND FUNCTION ---
async function appendQuestions() {
    console.log("⚠️  Starting APPEND Protocol (No Deletion)...");

    try {
        // 1. READ FILES
        let questions = [];
        let latexQuestions = [];

        if (existsSync(QUESTIONS_FILE)) {
            questions = JSON.parse(readFileSync(QUESTIONS_FILE, 'utf8'));
            console.log(`📖 Loaded ${questions.length} NEW questions from questions.json`);
        } else {
            console.error("❌ Error: questions.json not found!");
            process.exit(1);
        }

        if (existsSync(LATEX_FILE)) {
            latexQuestions = JSON.parse(readFileSync(LATEX_FILE, 'utf8'));
            console.log(`📖 Loaded ${latexQuestions.length} formatting objects from questions.latex.json`);
        }

        // 2. MERGE LOGIC
        console.log("🔄 Merging content with formatting...");
        
        const latexMap = new Map();
        latexQuestions.forEach(q => {
            const key = q.question_id || q.question_text; 
            latexMap.set(String(key), q);
        });

        const finalData = questions.map(q => {
            const key = String(q.question_id || q.question_text);
            const latexQ = latexMap.get(key);

            // Merge Text
            if (latexQ && latexQ.question_text) {
                q.question_text = latexQ.question_text;
            } else {
                q.question_text = formatText(q.question_text);
            }

            // Merge Options
            if (latexQ && latexQ.options) {
                q.options = latexQ.options;
            } else {
                q.options = q.options.map(opt => formatText(opt));
            }

            // Merge Explanation
            if (q.explanation) {
                q.explanation = formatText(q.explanation);
            }

            return q;
        });

        // 3. UPLOAD (UPSERT)
        console.log(`\n🚀 Uploading ${finalData.length} questions to database...`);
        console.log("   (Existing questions in DB will stay safe. IDs with match will update.)");

        let batch = db.batch();
        let count = 0;
        let total = 0;

        for (const q of finalData) {
            const docRef = q.question_id 
                ? db.collection(COLLECTION_NAME).doc(String(q.question_id))
                : db.collection(COLLECTION_NAME).doc();

            // Sanitize
            const cleanQ = JSON.parse(JSON.stringify(q)); 
            
            // { merge: true } ensures we don't accidentally wipe fields if we only upload partial data
            batch.set(docRef, cleanQ, { merge: true });
            
            count++;
            total++;

            if (count >= 400) {
                await batch.commit();
                console.log(`   Saved ${total} questions...`);
                batch = db.batch();
                count = 0;
            }
        }

        if (count > 0) {
            await batch.commit();
        }

        console.log(`\n🎉 SUCCESS! Appended/Updated ${total} questions.`);

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

appendQuestions();