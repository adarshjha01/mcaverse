// src/db/auditTopics.mjs
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// 1. Initialize Firebase
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf8')
);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function auditTopics() {
  console.log("🔍 Starting Database Audit...");
  
  try {
    // 2. Fetch ALL questions
    const snapshot = await db.collection('questions').get();
    console.log(`📦 Total Documents in 'questions' collection: ${snapshot.size}`);

    const topicCounts = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      const subject = data.subject || "Unknown Subject";
      const topic = data.topic || "Unknown Topic";
      const key = `${subject} -> ${topic}`;

      if (!topicCounts[key]) {
        topicCounts[key] = 0;
      }
      topicCounts[key]++;
    });

    // 3. Print Results
    console.log("\n📊 TOPIC BREAKDOWN (from Firestore):");
    console.log("----------------------------------------");
    
    const sortedKeys = Object.keys(topicCounts).sort();
    
    sortedKeys.forEach(key => {
      console.log(`${key}: ${topicCounts[key]} questions`);
    });

    console.log("----------------------------------------");
    console.log("✅ Audit Complete.");

  } catch (error) {
    console.error("❌ Audit Failed:", error);
  }
}

auditTopics();