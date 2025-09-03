const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const serviceAccountKeyPath = path.join(__dirname, 'serviceAccountKey.json');
const testDefinitionsPath = path.join(__dirname, 'test_definitions.json');
// --------------------

// Initialize Firebase
const serviceAccount = require(serviceAccountKeyPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Main function to create tests
const createMockTests = async () => {
  console.log('--- Starting Mock Test Creation Script ---');
  try {
    const fileContents = fs.readFileSync(testDefinitionsPath, 'utf8');
    const definitions = JSON.parse(fileContents);

    console.log(`Found ${definitions.length} test definitions to process.`);

    for (const testDef of definitions) {
      console.log(`\nProcessing test: "${testDef.title}"...`);

      // Build the Firestore query dynamically from the filters
      let query = db.collection('questions');
      testDef.filters.forEach(filter => {
        query = query.where(filter.field, filter.operator, filter.value);
      });

      // Execute the query to get matching question documents
      const questionsSnapshot = await query.get();
      
      if (questionsSnapshot.empty) {
        console.warn(`   ⚠️ Warning: No questions found for this test. Skipping.`);
        continue;
      }

      // Extract the document IDs from the query result
      const questionIds = questionsSnapshot.docs.map(doc => doc.id);
      console.log(`   Found ${questionIds.length} matching questions.`);

      // Prepare the new mock test document data
      const newTestData = {
        title: testDef.title,
        exam: testDef.exam,
        testType: testDef.testType,
        durationInMinutes: testDef.durationInMinutes,
        question_ids: questionIds,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      // Write the new document to the 'mockTests' collection
      await db.collection('mockTests').doc(testDef.id).set(newTestData);
      console.log(`   ✅ Successfully created test document with ID: ${testDef.id}`);
    }

    console.log('\n🚀 All mock tests have been created successfully!');
  } catch (error) {
    console.error('❌ An error occurred:', error);
  }
};

// Run the script
createMockTests();
