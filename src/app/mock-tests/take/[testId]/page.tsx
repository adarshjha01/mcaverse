// src/app/mock-tests/take/[testId]/page.tsx
import { db } from "@/lib/firebaseAdmin";
import { notFound } from "next/navigation";
import { TestInterface } from "@/components/mock-tests/TestInterface";

// THE MAGIC: Import your local database! Cost = $0.00
import allQuestionsData from '@/db/allQuestions_fixed.json';

export const dynamic = 'force-dynamic';

type Question = {
  id: string;
  question_text: string;
  options: string[];
  correct_answers: number[];
  explanation: string;
  subject?: string;
};

type MockTestSection = {
  name: string;
  duration: number; 
  questionCount: number;
};

type MockTest = {
  id: string;
  title: string;
  durationInMinutes: number;
  question_ids: string[];
  sections?: MockTestSection[];
};

async function getTestDetails(testId: string): Promise<{ test: MockTest; questions: Question[] }> {
  try {
    // 1. FETCH TEST METADATA FROM FIREBASE (Costs exactly 1 Read)
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
      sections: testData.sections || [], 
    };

    if (serializableTest.question_ids.length === 0) {
      return { test: serializableTest, questions: [] };
    }

    // 2. FETCH QUESTIONS FROM LOCAL JSON (Costs 0 Reads, 100x Faster!)
    const localDatabase = allQuestionsData as any[];

    // 3. MAP THE IDS TO LOCAL DATA
    const orderedQuestions = serializableTest.question_ids
      .map(id => {
        // Find the question locally (Checking both ID structures)
        const q = localDatabase.find(localQ => localQ.question_id === id || localQ.id === id);
        
        if (q) {
          return {
            id: q.question_id || q.id,
            question_text: q.question_text || "",
            options: q.options || [],
            correct_answers: q.correct_answers || [],
            explanation: q.explanation || "",
            subject: q.subject || "General",
          } as Question;
        }
        return null;
      })
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
    <div className="w-full h-full">
      <TestInterface test={test} questions={questions} />
    </div>
  );
}