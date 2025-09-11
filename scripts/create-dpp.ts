// scripts/create-dpp.ts
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local for local execution
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// --- Configuration for the Daily Practice Problem ---
const DPP_CONFIG = {
    // Total number of questions in the daily set
    totalQuestions: 5,
    // Points awarded for each correct answer
    pointsPerQuestion: 4,
    // Define how many questions to pick from each subject.
    // The sum should match `totalQuestions`.
    subjectDistribution: {
        "Mathematics": 2,
        "Logical Reasoning": 2,
        "Computer Science": 1,
    }
};

// --- Firebase Admin SDK Initialization ---
// Uses environment variables, which is safe for server-side execution and automation.
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// --- Helper Functions ---

/**
 * Generates a date string in YYYY-MM-DD format for UTC time.
 * This ensures the date is consistent regardless of where the script is run.
 */
function getTodayDateString(): string {
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = String(today.getUTCMonth() + 1).padStart(2, '0');
    const day = String(today.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Fetches a specified number of random question IDs for a given subject.
 * @param subject The subject to fetch questions for.
 * @param count The number of random questions to fetch.
 * @returns A promise that resolves to an array of question IDs.
 */
async function getRandomQuestions(subject: string, count: number): Promise<string[]> {
    const questions: string[] = [];
    // Query for all questions in the specified subject
    const snapshot = await db.collection('questions').where('subject', '==', subject).get();
    
    if (snapshot.empty) {
        console.warn(`Warning: No questions found for subject "${subject}".`);
        return [];
    }

    const allIds = snapshot.docs.map(doc => doc.id);
    
    // Shuffle the array and pick the required number of questions
    allIds.sort(() => 0.5 - Math.random());
    return allIds.slice(0, count);
}


// --- Main Script Logic ---
async function createDailyPracticeProblem() {
    console.log("Starting DPP creation script...");
    const dateString = getTodayDateString();
    const dppRef = db.collection('dpps').doc(dateString);

    // Check if a DPP for today already exists to prevent duplicates
    const doc = await dppRef.get();
    if (doc.exists) {
        console.log(`DPP for ${dateString} already exists. Exiting.`);
        return;
    }

    console.log(`Creating DPP for ${dateString}...`);
    let selectedQuestionIds: string[] = [];

    // Fetch random questions based on the subject distribution config
    for (const [subject, count] of Object.entries(DPP_CONFIG.subjectDistribution)) {
        console.log(`Fetching ${count} question(s) for ${subject}...`);
        const ids = await getRandomQuestions(subject, count);
        selectedQuestionIds.push(...ids);
    }

    // Verify if enough questions were found
    if (selectedQuestionIds.length < DPP_CONFIG.totalQuestions) {
        console.error(`Error: Not enough questions found across all subjects to create a full DPP. Found ${selectedQuestionIds.length}, need ${DPP_CONFIG.totalQuestions}. Aborting.`);
        return;
    }

    // Get today's date at midnight UTC for the timestamp
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Create the new DPP document in Firestore
    await dppRef.set({
        date: today,
        question_ids: selectedQuestionIds,
        pointsPerQuestion: DPP_CONFIG.pointsPerQuestion,
    });

    console.log(`Successfully created DPP for ${dateString} with ${selectedQuestionIds.length} questions.`);
}

// Execute the main function
createDailyPracticeProblem().catch(error => {
    console.error("Script failed:", error);
    process.exit(1);
});
