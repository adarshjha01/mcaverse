// src/app/mock-tests/take/[testId]/results/[attemptId]/page.tsx
import { db } from "@/lib/firebaseAdmin";
import { notFound } from "next/navigation";
import { TestResults } from "@/components/mock-tests/TestResults";
import { firestore } from 'firebase-admin';

// --- Type Definitions ---
type Question = {
  id: string;
  question_text: string;
  options: string[];
  correct_answers: number[];
  explanation: string;
};

// This type represents the data passed to the client component, so it must be serializable
type SerializableUserAttempt = {
  id: string;
  userId: string;
  testId: string; // <-- FIX: Added the missing testId property
  score: number;
  correctCount: number;
  incorrectCount: number;
  totalAttempted: number;
  answers: { [key: string]: number };
  submittedAt: string; // Use string for dates passed from server to client
};

// --- Data Fetching Function ---
async function getResultsData(testId: string, attemptId: string): Promise<{ attempt: SerializableUserAttempt; questions: Question[] }> {
  try {
    const attemptDocRef = db.collection('userAttempts').doc(attemptId);
    const attemptDocSnap = await attemptDocRef.get();

    if (!attemptDocSnap.exists || attemptDocSnap.data()?.testId !== testId) {
      notFound();
    }

    const attemptData = attemptDocSnap.data()!;
    
    const testDocRef = db.collection('mockTests').doc(testId);
    const testDocSnap = await testDocRef.get();
    if (!testDocSnap.exists) notFound();
    const questionIds = testDocSnap.data()?.question_ids || [];

    let questions: Question[] = [];
    if (questionIds.length > 0) {
      const questionsRef = db.collection('questions');
      const questionsQuery = await questionsRef.where(firestore.FieldPath.documentId(), 'in', questionIds).get();
      
      const questionsMap = new Map<string, Question>();
       questionsQuery.docs.forEach(doc => {
        questionsMap.set(doc.id, { id: doc.id, ...doc.data() } as Question);
      });

      questions = questionIds.map((id: string) => questionsMap.get(id)).filter(Boolean) as Question[];
    }

    // Convert the Firestore Timestamp to a serializable ISO string for the client
    const serializableAttempt: SerializableUserAttempt = {
      id: attemptDocSnap.id,
      userId: attemptData.userId,
      testId: attemptData.testId,
      answers: attemptData.answers,
      score: attemptData.score,
      correctCount: attemptData.correctCount,
      incorrectCount: attemptData.incorrectCount,
      totalAttempted: attemptData.totalAttempted,
      submittedAt: (attemptData.submittedAt as firestore.Timestamp).toDate().toISOString(),
    };

    return { attempt: serializableAttempt, questions };
  } catch (error) {
    console.error("Error fetching results:", error);
    notFound();
  }
}

export default async function ResultsPage({ params }: { params: { testId: string; attemptId: string } }) {
  const { attempt, questions } = await getResultsData(params.testId, params.attemptId);

  return (
    <main className="pt-16 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <TestResults attempt={attempt} questions={questions} />
      </div>
    </main>
  );
}

