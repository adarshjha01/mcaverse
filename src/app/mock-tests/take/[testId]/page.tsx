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
    
    // 1. SANITIZE TEST DATA (Manually pick fields, do NOT use ...testData)
    const serializableTest: MockTest = {
      id: testDocSnap.id,
      title: testData.title || "Untitled Test",
      durationInMinutes: testData.durationInMinutes || 15,
      question_ids: testData.question_ids || [],
    };

    if (serializableTest.question_ids.length === 0) {
      return { test: serializableTest, questions: [] };
    }

    // 2. FETCH QUESTIONS IN BATCHES
    const questionsRef = db.collection('questions');
    const questionBatches = chunkArray(serializableTest.question_ids, 10);
    let allFetchedQuestions: Question[] = [];

    for (const batch of questionBatches) {
      const querySnap = await questionsRef.where(FieldPath.documentId(), 'in', batch).get();
      
      const batchQuestions = querySnap.docs.map(doc => {
        const data = doc.data();
        // 3. CRITICAL FIX: MANUALLY PICK FIELDS. DO NOT USE ...data()
        // This strips out 'createdAt', 'updatedAt', and other non-serializable objects.
        return {
          id: doc.id,
          question_text: data.question_text || "Question text missing",
          options: data.options || [],
          correct_answers: data.correct_answers || [],
          explanation: data.explanation || "",
        } as Question;
      });
      
      allFetchedQuestions = [...allFetchedQuestions, ...batchQuestions];
    }

    // 4. SORT QUESTIONS
    const orderedQuestions = serializableTest.question_ids
      .map(id => allFetchedQuestions.find(q => q.id === id))
      .filter((q): q is Question => Boolean(q));

    return { test: serializableTest, questions: orderedQuestions };

  } catch (error) {
    console.error("Error fetching test details:", error);
    notFound();
  }
}

export default async function MockTestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  const { test, questions } = await getTestDetails(testId);

  return (
    // FIX: Use simple div w-full h-full to allow Full Screen mode to work
    <div className="w-full h-full">
      <TestInterface test={test} questions={questions} />
    </div>
  );
}