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
  // 1. Fix the capitalization issue (Main Fix)
  {
    oldSubjects: ['General english'], 
    newSubject: 'General English'
  },
  // 2. Ensure consistency for other subjects (Optional but good practice)
  {
    oldSubjects: ['Analytical Reasoning', 'Analytical Ability & Logical Reasoning', 'logical reasoning', 'Logical reasoning'],
    newSubject: 'Logical Reasoning' // Ensure this matches your test generator config exactly
  },
  {
    oldSubjects: ['Computer Science', 'Computer Awareness', 'computer awareness'],
    newSubject: 'Computer Awareness'
  },
  {
    oldSubjects: ['Mathematics', 'mathematics', 'Maths'],
    newSubject: 'Mathematics'
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

      // Firestore batch limit is 500 operations. We chunk if needed.
      const BATCH_SIZE = 450;
      const chunks = [];
      const docs = snapshot.docs;

      for (let i = 0; i < docs.length; i += BATCH_SIZE) {
          chunks.push(docs.slice(i, i + BATCH_SIZE));
      }

      for (const chunk of chunks) {
          const batch = db.batch();
          chunk.forEach(doc => {
              // Only update if actually different to save writes
              if (doc.data().subject !== merge.newSubject) {
                  batch.update(doc.ref, { subject: merge.newSubject });
              }
          });
          await batch.commit();
          console.log(`  - Updated batch of ${chunk.length} questions to "${merge.newSubject}"`);
      }
      
      console.log(`Successfully merged questions from "${oldSubject}" into "${merge.newSubject}".\n`);
    }
  }

  console.log('✅ All subject merges complete!');
}

mergeSubjects().catch(error => {
  console.error('❌ An error occurred during the merge process:', error);
});