/**
 * Seed Script: Assign serial numbers to eligible questions for DPP
 * 
 * LOGIC:
 * 1. Fetch all questions with difficulty Easy/Medium that have valid correct_answers
 * 2. Assign each a sequential `dppSerialNumber` (0-indexed)
 * 3. Write a metadata doc `metadata/dppStats` with { totalCount: N }
 * 4. Now the daily-question API only needs:
 *    - 1 read for metadata/dppStats → get totalCount  
 *    - 1 read for questions where dppSerialNumber == (daySeed % totalCount)
 *    = 2 reads total instead of reading the ENTIRE questions collection
 *
 * Run: node src/db/seedDailyQuestions.mjs
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync(new URL('../../serviceAccountKey.json', import.meta.url), 'utf8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function seedDailyQuestions() {
  console.log('🔄 Fetching eligible questions (Easy/Medium with valid answers)...');

  const snapshot = await db.collection('questions')
    .where('difficulty', 'in', ['Easy', 'Medium', 'easy', 'medium'])
    .get();

  if (snapshot.empty) {
    console.log('❌ No questions found!');
    return;
  }

  // Filter to only questions with valid correct_answers
  const eligibleDocs = snapshot.docs.filter(doc => {
    const data = doc.data();
    return Array.isArray(data.correct_answers) && data.correct_answers.length > 0;
  });

  console.log(`✅ Found ${eligibleDocs.length} eligible questions out of ${snapshot.size} total`);

  // Batch write serial numbers (Firestore batch limit is 500)
  const BATCH_SIZE = 400;
  let serialNumber = 0;

  for (let i = 0; i < eligibleDocs.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = eligibleDocs.slice(i, i + BATCH_SIZE);

    for (const doc of chunk) {
      batch.update(doc.ref, { dppSerialNumber: serialNumber });
      serialNumber++;
    }

    await batch.commit();
    console.log(`  📝 Batch ${Math.floor(i / BATCH_SIZE) + 1}: assigned serial ${i} to ${i + chunk.length - 1}`);
  }

  // Write metadata document
  await db.collection('metadata').doc('dppStats').set({
    totalEligibleCount: eligibleDocs.length,
    lastSeeded: admin.firestore.Timestamp.now(),
  });

  console.log(`\n🎉 Done! Assigned serial numbers 0-${eligibleDocs.length - 1}`);
  console.log(`📊 Metadata doc 'metadata/dppStats' updated with totalEligibleCount: ${eligibleDocs.length}`);
  console.log('\n💡 Daily question API will now use just 2 reads instead of reading all questions!');
}

seedDailyQuestions().catch(console.error);
