// src/app/mock-tests/[testId]/results/[attemptId]/page.tsx
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

type UserAttempt = {
  id: string;
  userId: string;
  testId: string;
  answers: { [key: string]: number };
  score: number;
  correctCount: number;
  incorrectCount: number;
  totalAttempted: number;
  submittedAt: firestore.Timestamp;
};

// --- Data Fetching Function ---
async function getResultsData(testId: string, attemptId: string): Promise<{ attempt: UserAttempt; questions: Question[] }> {
  try {
    const attemptDocRef = db.collection('userAttempts').doc(attemptId);
    const attemptDocSnap = await attemptDocRef.get();

    if (!attemptDocSnap.exists || attemptDocSnap.data()?.testId !== testId) {
      notFound();
    }

    const attemptData = { id: attemptDocSnap.id, ...attemptDocSnap.data() } as UserAttempt;
    const questionIds = Object.keys(attemptData.answers);

    let questions: Question[] = [];
    if (questionIds.length > 0) {
      const questionsRef = db.collection('questions');
      const questionsQuery = await questionsRef.where(firestore.FieldPath.documentId(), 'in', questionIds).get();
      questions = questionsQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Question));
    }

    return { attempt: attemptData, questions };

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