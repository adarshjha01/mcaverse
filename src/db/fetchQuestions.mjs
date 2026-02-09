// src/db/fetchQuestions.mjs
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { writeFileSync, readFileSync } from 'fs';

// 1. Initialize Firebase (Uses the same key as your upload script)
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf8')
);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function fetchQuestions() {
  console.log("⏳ Connecting to Firestore and fetching questions...");

  try {
    // 2. Get all documents from the 'questions' collection
    const snapshot = await db.collection('questions').get();

    if (snapshot.empty) {
      console.log("⚠️ No questions found in the 'questions' collection.");
      return;
    }

    // 3. Convert Firestore documents back to a clean JSON array
    const questions = [];
    snapshot.forEach(doc => {
      // doc.data() retrieves the fields (question_text, options, etc.)
      questions.push(doc.data());
    });

    console.log(`✅ Retrieved ${questions.length} questions from Firestore.`);

    // 4. Write the data to questions.json
    const outputPath = './src/db/questions.json';
    
    // JSON.stringify with null, 2 makes it pretty-printed (easy to read)
    writeFileSync(outputPath, JSON.stringify(questions, null, 2));

    console.log(`🎉 Successfully saved data to ${outputPath}`);

  } catch (error) {
    console.error("❌ Error fetching data:", error);
  }
}

// Run the function
fetchQuestions();