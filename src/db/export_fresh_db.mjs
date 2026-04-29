import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin using your environment variables
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

async function exportLatestQuestions() {
  console.log("Fetching the absolute latest questions from live Firestore...");
  try {
    const snapshot = await db.collection("questions").get();
    const questions = [];

    snapshot.forEach((doc) => {
      // Keep the Firebase document ID so the intern can map updates later
      questions.push({ id: doc.id, ...doc.data() });
    });

    // Write to a brand new file
    const outputPath = './fresh_database_dump.json';
    fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));
    
    console.log(`✅ Success! Exported exactly ${questions.length} live questions to ${outputPath}`);
    
  } catch (error) {
    console.error("❌ Error exporting data:", error);
  }
}

exportLatestQuestions();