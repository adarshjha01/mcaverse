// src/app/mock-tests/take/[testId]/page.tsx
import { db } from "@/lib/firebaseAdmin";
import { notFound } from "next/navigation";
import { TestInterface } from "@/components/mock-tests/TestInterface";
import { firestore } from 'firebase-admin';

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

// This function now returns a plain object that is safe to pass to client components
async function getTestDetails(testId: string): Promise<{ test: MockTest; questions: Question[] }> {
  try {
    const testDocRef = db.collection('mockTests').doc(testId);
    const testDocSnap = await testDocRef.get();

    if (!testDocSnap.exists) {
      notFound();
    }

    const testData = testDocSnap.data()!;
    // Manually construct a plain object to avoid passing non-serializable data like Timestamps
    const serializableTest: MockTest = {
      id: testDocSnap.id,
      title: testData.title,
      durationInMinutes: testData.durationInMinutes,
      question_ids: testData.question_ids || [],
    };

    if (!serializableTest.question_ids || serializableTest.question_ids.length === 0) {
      return { test: serializableTest, questions: [] };
    }

    const questionsRef = db.collection('questions');
    const questionsQuery = await questionsRef.where(firestore.FieldPath.documentId(), 'in', serializableTest.question_ids).get();
    
    const questions: Question[] = questionsQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Question));

    const orderedQuestions = serializableTest.question_ids.map(id => questions.find(q => q.id === id)).filter(Boolean) as Question[];

    return { test: serializableTest, questions: orderedQuestions };
  } catch (error) {
    console.error("Error fetching test details:", error);
    // Use notFound() to trigger a 404 page on error
    notFound();
  }
}

export default async function MockTestPage({ params }: { params: { testId: string } }) {
  const { test, questions } = await getTestDetails(params.testId);

  return (
    <main className="pt-16 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <TestInterface test={test} questions={questions} />
      </div>
    </main>
  );
}

