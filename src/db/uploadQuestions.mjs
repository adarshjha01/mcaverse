// uploadQuestions.mjs
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';

// --- 1. Service Account & Firestore Initialization ---
// Make sure 'serviceAccountKey.json' is in the same directory.
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf8')
);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// --- 2. Load Local Data Files ---
// This script will upload the questions from this file.
const questionsFilePath = './questions.json'; 
if (!existsSync(questionsFilePath)) {
  console.error(`❌ FATAL ERROR: Cannot find the questions file at ${questionsFilePath}. Please make sure the file exists.`);
  process.exit(1);
}
const questions = JSON.parse(readFileSync(questionsFilePath, 'utf8'));

// This section handles the optional LaTeX file.
// If the file doesn't exist, it simply skips it without error.
let latexData = {};
const latexFilePath = './questions.latex.json';
if (existsSync(latexFilePath)) {
  latexData = JSON.parse(readFileSync(latexFilePath, 'utf8'));
  console.log(`ℹ️  Found ${latexFilePath}. LaTeX data will be processed.`);
} else {
  console.log(`⚠️  No ${latexFilePath} file found. Skipping LaTeX processing.`);
}

// --- 3. Helper Functions ---

/**
 * Uploads the LaTeX mappings to Firestore if any were loaded.
 * This is designed to be run once at the start.
 */
async function uploadLatex(data) {
  if (!data || Object.keys(data).length === 0) return;
  const latexRef = db.collection("settings").doc("latex");
  await latexRef.set(data, { merge: true });
  console.log("✅ LaTeX mappings uploaded successfully to Firestore (settings/latex).");
}

/**
 * Fetches the complete LaTeX mappings from Firestore.
 * This ensures that even if the local file is partial, all mappings are used.
 */
async function getLatexMappings() {
  const doc = await db.collection("settings").doc("latex").get();
  if (!doc.exists) {
    console.log("⚠️ No LaTeX mappings found in Firestore. No replacements will be made.");
    return {};
  }
  console.log("✅ LaTeX data loaded from Firestore.");
  return doc.data();
}

/**
 * Recursively searches through an object or array to replace [L:key] placeholders.
 */
function injectLatex(data, latexSource) {
  if (typeof data === 'string') {
    return data.replace(/\[L:([\w_]+)\]/g, (match, key) => latexSource[key] || match);
  }
  if (Array.isArray(data)) {
    return data.map(item => injectLatex(item, latexSource));
  }
  if (typeof data === 'object' && data !== null) {
    const newData = {};
    for (const key in data) {
      newData[key] = injectLatex(data[key], latexSource);
    }
    return newData;
  }
  return data;
}

/**
 * **THE CORE FIX IS HERE.**
 * Recursively removes any 'undefined' values from objects and arrays before upload.
 * Firestore throws an error for 'undefined', so this function makes the script robust.
 * @param {*} data The object, array, or primitive to clean.
 * @returns {*} The cleaned data without any 'undefined' values.
 */
function sanitizeForFirestore(data) {
  if (Array.isArray(data)) {
    // If it's an array, filter out undefined items and sanitize the valid ones.
    return data
      .filter(item => item !== undefined)
      .map(item => sanitizeForFirestore(item));
  }
  if (typeof data === 'object' && data !== null) {
    // If it's an object, rebuild it, only including keys with defined values.
    const sanitizedObj = {};
    for (const key in data) {
      const value = data[key];
      if (value !== undefined) {
        sanitizedObj[key] = sanitizeForFirestore(value);
      }
    }
    return sanitizedObj;
  }
  // If it's a primitive (string, number, boolean, null), return it as is.
  return data;
}


// --- 4. Main Upload Logic ---
async function uploadQuestions() {
  // Step 1: Upload local LaTeX data (if any exists).
  await uploadLatex(latexData);

  // Step 2: Fetch all LaTeX data from Firestore to ensure complete mappings.
  const firestoreLatexData = await getLatexMappings();
  
  // Step 3: Begin the batch upload process for questions.
  const collectionRef = db.collection('questions');
  console.log(`\n🚀 Starting upload of ${questions.length} questions...`);

  let batch = db.batch();
  let operationCount = 0;

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    
    try {
      // Ensure the entry from the JSON file is a valid object.
      if (typeof question !== 'object' || question === null) {
        console.error(`\n❌ Skipping invalid entry at index ${i}. Item was not an object:`, question);
        continue;
      }
      
      // Step A: Inject LaTeX placeholders.
      let processedQuestion = injectLatex(question, firestoreLatexData);

      // Step B: Ensure `imageUrl` is not `null`, as some libraries prefer an empty string.
      if (processedQuestion.imageUrl === null) {
        processedQuestion.imageUrl = '';
      }

      // Step C: Validate the essential `question_id`.
      if (!processedQuestion.question_id) {
        console.error(`\n❌ Question at index ${i} is missing 'question_id', skipping item:`, processedQuestion);
        continue;
      }
      const docId = processedQuestion.question_id;

      // Step D: Sanitize the final object to prevent Firestore errors.
      const sanitizedQuestion = sanitizeForFirestore(processedQuestion);

      // Step E: Add the clean, valid object to the batch.
      const docRef = collectionRef.doc(docId);
      batch.set(docRef, sanitizedQuestion, { merge: true });
      operationCount++;

      // Commit the batch every 499 operations to stay within Firestore limits.
      if (operationCount >= 499) {
        await batch.commit();
        console.log(`✅ Committed a batch of ${operationCount} questions.`);
        batch = db.batch();
        operationCount = 0;
      }

    } catch (error) {
      console.error('======================================================');
      console.error(`❌ CRITICAL ERROR while processing question at index ${i}.`);
      console.error('Original Error Message:', error.message);
      console.error('======================================================');
      process.exit(1); // Stop the script on a critical failure.
    }
  }

  // Commit any remaining operations in the final batch.
  if (operationCount > 0) {
    await batch.commit();
    console.log(`✅ Committed the final batch of ${operationCount} questions.`);
  }

  console.log("\n🎉 Finished uploading questions successfully.");
}

// --- 5. Run the Script ---
uploadQuestions();