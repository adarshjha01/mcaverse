// src/app/mock-tests/[testId]/page.tsx
import { db } from "@/lib/firebaseAdmin";
import { notFound } from "next/navigation";
import { TestInterface } from "@/components/mock-tests/TestInterface";
import { firestore } from 'firebase-admin'; // Import firestore from firebase-admin

// Define types for our data
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

// Function to fetch test details and questions
async function getTestDetails(testId: string): Promise<{ test: MockTest; questions: Question[] }> {
  try {
    // Fetch the mock test document
    const testDocRef = db.collection('mockTests').doc(testId);
    const testDocSnap = await testDocRef.get();

    if (!testDocSnap.exists) {
      notFound();
    }

    const testData = testDocSnap.data() as MockTest;
    testData.id = testDocSnap.id;

    if (!testData.question_ids || testData.question_ids.length === 0) {
      return { test: testData, questions: [] };
    }

    // Fetch all questions associated with the test
    const questionsRef = db.collection('questions');
    const questionsQuery = await questionsRef.where(firestore.FieldPath.documentId(), 'in', testData.question_ids).get();
    
    const questions: Question[] = questionsQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Question));

    // Ensure the order of questions is the same as in question_ids
    const orderedQuestions = testData.question_ids.map(id => questions.find(q => q.id === id)).filter(Boolean) as Question[];

    return { test: testData, questions: orderedQuestions };
  } catch (error) {
    console.error("Error fetching test details:", error);
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