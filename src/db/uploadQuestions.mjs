// src/db/uploadQuestions.mjs
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// 1. Initialize Firebase
// Ensure serviceAccountKey.json is in your root folder
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf8')
);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function uploadQuestions() {
  console.log("🚀 Starting Database Replacement...");

  try {
    // 2. Read the CLEAN dataset
    // Make sure this matches your actual clean file name
    const data = readFileSync('./src/db/questions_clean.json', 'utf8');
    const questions = JSON.parse(data);

    console.log(`📦 Loaded ${questions.length} questions from file.`);

    if (questions.length === 0) {
      console.error("❌ Error: JSON file is empty.");
      return;
    }

    // 3. Prepare Batch Upload
    let batch = db.batch();
    let operationCount = 0;
    let totalUploaded = 0;

    for (const question of questions) {
      // Ensure we have a valid ID
      if (!question.question_id) {
        console.warn("⚠️ Skipping question without 'question_id':", question);
        continue;
      }

      const docRef = db.collection('questions').doc(question.question_id);

      // --- CRITICAL CHANGE ---
      // We use .set() WITHOUT { merge: true }
      // This completely replaces the document, removing any old/junk fields.
      batch.set(docRef, question); 
      
      operationCount++;
      totalUploaded++;

      // Firestore Batch Limit is 500
      if (operationCount >= 499) {
        await batch.commit();
        console.log(`✅ Committed batch of ${operationCount} questions...`);
        batch = db.batch(); // Reset batch
        operationCount = 0;
      }
    }

    // Commit final batch
    if (operationCount > 0) {
      await batch.commit();
      console.log(`✅ Committed final batch of ${operationCount} questions.`);
    }

    console.log(`\n🎉 Success! Replaced ${totalUploaded} questions in the database.`);

  } catch (error) {
    console.error("❌ Upload Failed:", error);
  }
}

uploadQuestions();