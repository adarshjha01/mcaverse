// src/app/mock-tests/take/[testId]/results/[attemptId]/page.tsx
import { db } from "@/lib/firebaseAdmin";
import { notFound } from "next/navigation";
import { TestResults } from "@/components/mock-tests/TestResults"; // Ensure this path is correct
import { FieldPath, Timestamp } from 'firebase-admin/firestore';

// Force dynamic rendering so results are always fresh
export const dynamic = 'force-dynamic';

// --- Type Definitions ---
type Question = {
  id: string;
  question_text: string;
  options: string[];
  correct_answers: number[];
  explanation: string;
};

// Serializable type for Client Component
type SerializableUserAttempt = {
  id: string;
  userId: string;
  testId: string;
  score: number;
  correctCount: number;
  incorrectCount: number;
  totalAttempted: number;
  answers: { [key: string]: number };
  submittedAt: string; // ISO String
};

// --- HELPER: Split IDs into groups of 10 (Firebase Limit) ---
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// --- Data Fetching Function ---
async function getResultsData(testId: string, attemptId: string) {
  try {
    // 1. Fetch the Attempt
    const attemptDocRef = db.collection('userAttempts').doc(attemptId);
    const attemptDocSnap = await attemptDocRef.get();

    if (!attemptDocSnap.exists) {
      console.error(`Attempt ${attemptId} not found`);
      notFound();
    }
    
    const attemptData = attemptDocSnap.data()!;
    
    // Security/Consistency Check
    if (attemptData.testId !== testId) {
       console.error(`Mismatch: Attempt ${attemptId} belongs to test ${attemptData.testId}, not ${testId}`);
       notFound();
    }

    // 2. Fetch the Test (to get the list of Question IDs)
    const testDocRef = db.collection('mockTests').doc(testId);
    const testDocSnap = await testDocRef.get();
    
    if (!testDocSnap.exists) {
      console.error(`Test ${testId} not found`);
      notFound();
    }
    
    const questionIds: string[] = testDocSnap.data()?.question_ids || [];

    // 3. Fetch Questions in BATCHES (The Fix)
    const questionsMap = new Map<string, Question>();
    
    if (questionIds.length > 0) {
      const questionsRef = db.collection('questions');
      const batches = chunkArray(questionIds, 10); // Split 50 IDs into 5 batches of 10

      for (const batch of batches) {
        const querySnap = await questionsRef.where(FieldPath.documentId(), 'in', batch).get();
        querySnap.forEach(doc => {
          questionsMap.set(doc.id, { id: doc.id, ...doc.data() } as Question);
        });
      }
    }

    // 4. Re-order questions to match the test order
    const orderedQuestions = questionIds
      .map(id => questionsMap.get(id))
      .filter((q): q is Question => Boolean(q));

    // 5. Serialize Data (Convert Timestamps to Strings)
    const serializableAttempt: SerializableUserAttempt = {
      id: attemptDocSnap.id,
      userId: attemptData.userId,
      testId: attemptData.testId,
      score: attemptData.score,
      correctCount: attemptData.correctCount,
      incorrectCount: attemptData.incorrectCount,
      totalAttempted: attemptData.totalAttempted,
      answers: attemptData.answers || {},
      submittedAt: attemptData.submittedAt 
        ? (attemptData.submittedAt as Timestamp).toDate().toISOString() 
        : new Date().toISOString(),
    };

    return { attempt: serializableAttempt, questions: orderedQuestions };

  } catch (error) {
    console.error("Error fetching results:", error);
    notFound();
  }
}

export default async function ResultsPage({ params }: { params: { testId: string; attemptId: string } }) {
  const { attempt, questions } = await getResultsData(params.testId, params.attemptId);

  return (
    <main className="pt-16 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <TestResults attempt={attempt} questions={questions} />
      </div>
    </main>
  );
}