// Import the necessary Firebase and file system modules
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
// Path to your service account key file
const serviceAccountKeyPath = path.join(__dirname, 'serviceAccountKey.json');
const serviceAccount = require(serviceAccountKeyPath);

// The collection you want to upload to
const collectionName = 'questions';

// Path to your JSON data file
const dataPath = path.join(__dirname, 'questions_to_upload.json');
// --------------------

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get a reference to the Firestore database
const db = admin.firestore();

// The main function to upload data
const seedDatabase = async () => {
  console.log('--- Starting Database Seed ---');
  try {
    // Read the JSON file
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const questions = JSON.parse(fileContents);

    console.log(`📄 Found ${questions.length} questions to upload.`);

    // Loop through each question in the JSON array
    for (const [index, question] of questions.entries()) {
      // Create a unique, readable ID for each question
      const docId = `${question.exam_id}_${question.year}_q${index + 1}`;
      
      // Get a reference to the document and upload the data
      await db.collection(collectionName).doc(docId).set(question);
      console.log(`  -> ✅ Uploaded document: ${docId}`);
    }

    console.log('\n🚀 All tasks complete! Your questions are now in Firestore.');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Run the seeding function
seedDatabase();