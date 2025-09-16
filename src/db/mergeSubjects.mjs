// src/db/mergeSubjects.mjs
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// --- Important: Make sure your serviceAccountKey.json is in the root directory ---
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf8')
);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// --- Define the subject merges ---
const subjectMerges = [
  {
    oldSubjects: ['Analytical Reasoning', 'Analytical Ability & Logical Reasoning'],
    newSubject: 'Analytical Ability & Logical Reasoning'
  },
  {
    oldSubjects: ['Computer Science', 'Computer Awareness'],
    newSubject: 'Computer Awareness'
  },
  {
    oldSubjects: ['English', 'General English'],
    newSubject: 'General English'
  }
];

async function mergeSubjects() {
  console.log('Starting subject merge process...');
  const questionsRef = db.collection('questions');

  for (const merge of subjectMerges) {
    for (const oldSubject of merge.oldSubjects) {
      console.log(`Querying for questions with subject: "${oldSubject}"...`);

      const snapshot = await questionsRef.where('subject', '==', oldSubject).get();

      if (snapshot.empty) {
        console.log(`No questions found for "${oldSubject}". Skipping.`);
        continue;
      }

      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        console.log(`  - Updating doc ${doc.id} to "${merge.newSubject}"`);
        batch.update(doc.ref, { subject: merge.newSubject });
      });

      await batch.commit();
      console.log(`Successfully merged ${snapshot.size} questions from "${oldSubject}" into "${merge.newSubject}".\n`);
    }
  }

  console.log('✅ All subject merges complete!');
}

mergeSubjects().catch(error => {
  console.error('❌ An error occurred during the merge process:', error);
});