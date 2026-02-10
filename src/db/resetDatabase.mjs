// src/db/resetDatabase.mjs
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';

const SERVICE_ACCOUNT_PATH = './serviceAccountKey.json';
const DATA_FILE_PATH = './src/db/questions_clean.json'; // Ensure this points to your CLEAN file

// 1. Validation
if (!existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error("❌ Error: 'serviceAccountKey.json' not found in root.");
    process.exit(1);
}
if (!existsSync(DATA_FILE_PATH)) {
    console.error(`❌ Error: Data file '${DATA_FILE_PATH}' not found.`);
    process.exit(1);
}

// 2. Initialize
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
  if (batchSize === 0) {
    resolve(); // Collection is empty
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  console.log(`🗑️  Deleted ${batchSize} documents...`);

  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

// --- MAIN FUNCTION ---
async function resetDatabase() {
    console.log("⚠️  WARNING: This will DELETE all existing questions and re-upload.");
    console.log("⏳ Starting Clean Slate Protocol...");

    try {
        // 1. DELETE OLD DATA
        console.log("\n1️⃣  Deleting existing 'questions' collection...");
        await deleteCollection(db, 'questions', 500);
        console.log("✅ Collection cleared.");

        // 2. LOAD NEW DATA
        console.log(`\n2️⃣  Reading data from ${DATA_FILE_PATH}...`);
        const data = readFileSync(DATA_FILE_PATH, 'utf8');
        const questions = JSON.parse(data);
        console.log(`📦 Found ${questions.length} questions to upload.`);

        // 3. UPLOAD NEW DATA
        console.log("\n3️⃣  Uploading new data...");
        let batch = db.batch();
        let count = 0;
        let total = 0;

        for (const q of questions) {
            // Use question_id as the Doc ID. 
            // If ID is missing, create a random one (fallback)
            const docRef = q.question_id 
                ? db.collection('questions').doc(q.question_id)
                : db.collection('questions').doc();

            batch.set(docRef, q); // .set() replaces the doc completely
            count++;
            total++;

            if (count >= 400) { // Commit every 400 docs
                await batch.commit();
                console.log(`🚀 Uploaded ${total} questions...`);
                batch = db.batch();
                count = 0;
            }
        }

        if (count > 0) {
            await batch.commit();
        }

        console.log(`\n🎉 SUCCESS! Database reset complete. Total questions: ${total}`);

    } catch (error) {
        console.error("❌ Error during reset:", error);
    }
}

resetDatabase();