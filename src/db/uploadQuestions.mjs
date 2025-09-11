// // uploadQuestions.mjs
// import { initializeApp, cert } from 'firebase-admin/app';
// import { getFirestore } from 'firebase-admin/firestore';
// import { readFileSync, existsSync } from 'fs';

// // --- 1. Service Account ---
// const serviceAccount = JSON.parse(
//   readFileSync('./serviceAccountKey.json', 'utf8')
// );

// initializeApp({
//   credential: cert(serviceAccount)
// });

// const db = getFirestore();

// // --- 2. Load Data Files ---
// const questions = JSON.parse(readFileSync('./questions.json', 'utf8'));
// let latexData = {};
// if (existsSync('./questions.latex.json')) {
//   latexData = JSON.parse(readFileSync('./questions.latex.json', 'utf8'));
// } else {
//   console.log("⚠️ No local questions.latex.json file found. Skipping LaTeX upload.");
// }

// // --- 3. Helper Functions ---

// // Upload LaTeX mappings into Firestore
// async function uploadLatex(latexData) {
//   if (!latexData || Object.keys(latexData).length === 0) return;

//   const latexRef = db.collection("settings").doc("latex");
//   await latexRef.set(latexData, { merge: true });
//   console.log("✅ LaTeX mappings uploaded to Firestore → settings/latex");
// }

// // Fetch LaTeX mappings from Firestore
// async function getLatexMappings() {
//   const doc = await db.collection("settings").doc("latex").get();
//   if (!doc.exists) {
//     console.log("⚠️ No LaTeX mappings found in Firestore.");
//     return {};
//   }
//   console.log("✅ LaTeX data loaded from Firestore.");
//   return doc.data();
// }

// // Recursively inject LaTeX into strings, arrays, and objects
// function injectLatex(data, latexSource) {
//   if (typeof data === 'string') {
//     return data.replace(/\[L:([\w_]+)\]/g, (match, key) => {
//       return latexSource[key] || match;
//     });
//   }
//   if (Array.isArray(data)) {
//     return data.map(item => injectLatex(item, latexSource));
//   }
//   if (typeof data === 'object' && data !== null) {
//     const newData = {};
//     for (const key in data) {
//       newData[key] = injectLatex(data[key], latexSource);
//     }
//     return newData;
//   }
//   return data;
// }

// // --- 4. Upload Logic ---
// async function uploadQuestions() {
//   // Step 1: Upload local LaTeX (if file exists)
//   await uploadLatex(latexData);

//   // Step 2: Fetch LaTeX from Firestore
//   const firestoreLatexData = await getLatexMappings();

//   // Step 3: Process and upload questions
//   const collectionRef = db.collection('questions');
//   console.log(`Starting upload of ${questions.length} questions...`);

//   let batch = db.batch();
//   let operationCount = 0;

//   for (const question of questions) {
//     try {
//       // Process question (inject LaTeX everywhere)
//       const processedQuestion = injectLatex(question, firestoreLatexData);

//       const docId = processedQuestion.question_id;
//       if (!docId) {
//         console.error(`❌ Question missing 'question_id', skipping: "${processedQuestion.question_text.substring(0, 30)}..."`);
//         continue;
//       }

//       const docRef = collectionRef.doc(docId);
//       batch.set(docRef, processedQuestion, { merge: true });
//       operationCount++;

//       // Commit batch if Firestore limit reached
//       if (operationCount >= 499) {
//         await batch.commit();
//         console.log(`✅ Committed a batch of ${operationCount} questions.`);
//         batch = db.batch();
//         operationCount = 0;
//       }

//     } catch (error) {
//       console.error(`❌ Error processing question: "${question.question_text.substring(0, 30)}..."`, error);
//     }
//   }

//   // Commit any remaining operations
//   if (operationCount > 0) {
//     await batch.commit();
//     console.log(`✅ Committed the final batch of ${operationCount} questions.`);
//   }

//   console.log("🎉 Finished uploading LaTeX + Questions.");
// }

// // --- Run ---
// uploadQuestions();
// uploadQuestions.mjs
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';

// --- 1. Service Account ---
// Make sure 'serviceAccountKey.json' is in the same directory
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf8')
);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// --- 2. Load Data Files ---
// IMPORTANT: Make sure this path points to your corrected JSON file.
const questionsFilePath = './questions.json';
if (!existsSync(questionsFilePath)) {
  console.error(`❌ Error: Cannot find the questions file at ${questionsFilePath}`);
  process.exit(1);
}
const questions = JSON.parse(readFileSync(questionsFilePath, 'utf8'));

let latexData = {};
const latexFilePath = './questions.latex.json';
if (existsSync(latexFilePath)) {
  latexData = JSON.parse(readFileSync(latexFilePath, 'utf8'));
} else {
  console.log(`⚠️ No local ${latexFilePath} file found. Skipping LaTeX upload.`);
}

// --- 3. Helper Functions ---

async function uploadLatex(latexData) {
  if (!latexData || Object.keys(latexData).length === 0) return;
  const latexRef = db.collection("settings").doc("latex");
  await latexRef.set(latexData, { merge: true });
  console.log("✅ LaTeX mappings uploaded to Firestore → settings/latex");
}

async function getLatexMappings() {
  const doc = await db.collection("settings").doc("latex").get();
  if (!doc.exists) {
    console.log("⚠️ No LaTeX mappings found in Firestore.");
    return {};
  }
  console.log("✅ LaTeX data loaded from Firestore.");
  return doc.data();
}

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

// --- 4. Upload Logic ---
async function uploadQuestions() {
  await uploadLatex(latexData);
  const firestoreLatexData = await getLatexMappings();
  const collectionRef = db.collection('questions');
  console.log(`Starting upload of ${questions.length} questions...`);

  let batch = db.batch();
  let operationCount = 0;

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    let processedQuestion; // Declare here to be accessible in catch block

    try {
      if (typeof question !== 'object' || question === null) {
        console.error(`❌ Skipping invalid entry at index ${i} in JSON file. Item was not an object:`, question);
        continue;
      }
      
      processedQuestion = injectLatex(question, firestoreLatexData);

      // Explicitly handle imageUrl to rule it out as a problem
      if (processedQuestion.imageUrl === null) {
        processedQuestion.imageUrl = ''; // Convert null to empty string for safety
      }

      if (!processedQuestion.question_id) {
        console.error(`❌ Question at index ${i} is missing 'question_id', skipping item:`, processedQuestion);
        continue;
      }
      const docId = processedQuestion.question_id;

      const docRef = collectionRef.doc(docId);
      batch.set(docRef, processedQuestion, { merge: true });
      operationCount++;

      if (operationCount >= 499) {
        await batch.commit();
        console.log(`✅ Committed a batch of ${operationCount} questions.`);
        batch = db.batch();
        operationCount = 0;
      }

    } catch (error) {
      // This new catch block provides much more detail to find the error.
      console.error('======================================================');
      console.error(`❌ CRITICAL ERROR while processing question at index ${i}. Script will now exit.`);
      console.error(`Original Question Object:`, JSON.stringify(question, null, 2));
      console.error(`Processed Object that caused crash:`, JSON.stringify(processedQuestion, null, 2));
      console.error('Original Error Message:', error.message);
      console.error('======================================================');
      process.exit(1); // Stop the script on a critical failure
    }
  }

  if (operationCount > 0) {
    await batch.commit();
    console.log(`✅ Committed the final batch of ${operationCount} questions.`);
  }

  console.log("🎉 Finished uploading questions successfully.");
}

// --- Run ---
uploadQuestions();

