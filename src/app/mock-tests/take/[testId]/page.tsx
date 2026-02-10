// src/app/mock-tests/take/[testId]/page.tsx
import { db } from "@/lib/firebaseAdmin";
import { notFound } from "next/navigation";
import { TestInterface } from "@/components/mock-tests/TestInterface";
import { FieldPath } from 'firebase-admin/firestore';

// Force dynamic to ensure fresh data fetch
export const dynamic = 'force-dynamic';

type Question = {
  id: string;
  question_text: string;
  options: string[];
  correct_answers: number[];
  explanation: string;
};

type MockTest = {
  id: string;
  title: string;
  durationInMinutes: number;
  question_ids: string[];
};

// HELPER: Split array into chunks of 10 (Firebase Limit)
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function getTestDetails(testId: string): Promise<{ test: MockTest; questions: Question[] }> {
  try {
    const testDocRef = db.collection('mockTests').doc(testId);
    const testDocSnap = await testDocRef.get();

    if (!testDocSnap.exists) {
      console.error(`Test ${testId} not found`);
      notFound();
    }

    const testData = testDocSnap.data()!;
    const serializableTest: MockTest = {
      id: testDocSnap.id,
      title: testData.title || "Untitled Test",
      durationInMinutes: testData.durationInMinutes || 15,
      question_ids: testData.question_ids || [],
    };

    if (serializableTest.question_ids.length === 0) {
      return { test: serializableTest, questions: [] };
    }

    // --- FIX: FETCH IN BATCHES OF 10 ---
    const questionsRef = db.collection('questions');
    const questionBatches = chunkArray(serializableTest.question_ids, 10);
    let allFetchedQuestions: Question[] = [];

    for (const batch of questionBatches) {
      const querySnap = await questionsRef.where(FieldPath.documentId(), 'in', batch).get();
      
      const batchQuestions = querySnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Question));
      
      allFetchedQuestions = [...allFetchedQuestions, ...batchQuestions];
    }

    // Sort questions to match the original random order stored in the test
    const orderedQuestions = serializableTest.question_ids
      .map(id => allFetchedQuestions.find(q => q.id === id))
      .filter((q): q is Question => Boolean(q));

    return { test: serializableTest, questions: orderedQuestions };

  } catch (error) {
    console.error("Error fetching test details:", error);
    notFound();
  }
}

export default async function MockTestPage({ params }: { params: { testId: string } }) {
  const { test, questions } = await getTestDetails(params.testId);

  return (
    <main className="pt-16 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <TestInterface test={test} questions={questions} />
      </div>
    </main>
  );
}