// src/app/mock-tests/take/[testId]/results/[attemptId]/page.tsx
import { notFound } from "next/navigation";
import { db } from "@/lib/firebaseAdmin";
import { TestResults } from "@/components/mock-tests/TestResults";
import { FieldPath } from "firebase-admin/firestore";

type PageProps = {
  params: Promise<{ testId: string; attemptId: string }>;
};

// --- FIX: THIS FUNCTION PREVENTS THE BLANK SCREEN CRASH ---
function sanitizeData(data: any) {
  if (!data) return null;
  const sanitized = { ...data };
  
  // Convert all Timestamps to Strings
  if (sanitized.createdAt?.toDate) sanitized.createdAt = sanitized.createdAt.toDate().toISOString();
  if (sanitized.submittedAt?.toDate) sanitized.submittedAt = sanitized.submittedAt.toDate().toISOString();
  if (sanitized.updatedAt?.toDate) sanitized.updatedAt = sanitized.updatedAt.toDate().toISOString();

  // Ensure answers object exists
  if (!sanitized.answers) sanitized.answers = {};

  return sanitized;
}

async function getAttempt(attemptId: string) {
  try {
    const doc = await db.collection("userAttempts").doc(attemptId).get();
    if (!doc.exists) return null;
    // Apply sanitization here
    return { id: doc.id, ...sanitizeData(doc.data()) };
  } catch (error) {
    console.error("Error fetching attempt:", error);
    return null;
  }
}

async function getQuestions(testId: string) {
  try {
    // 1. Get Test Data
    const testDoc = await db.collection("mockTests").doc(testId).get();
    if (!testDoc.exists) return [];
    const testData = testDoc.data();
    const questionIds = testData?.question_ids || [];

    if (questionIds.length === 0) return [];

    // 2. Batch Fetch Questions (Fixes "10 item limit" error)
    const chunks = [];
    for (let i = 0; i < questionIds.length; i += 10) {
        chunks.push(questionIds.slice(i, i + 10));
    }

    let allQuestions: any[] = [];
    for (const chunk of chunks) {
        const snap = await db.collection("questions")
          .where(FieldPath.documentId(), "in", chunk)
          .get();
        
        snap.forEach(doc => {
            const qData = doc.data();
            allQuestions.push({ 
                id: doc.id, 
                question_text: qData.question_text || "",
                options: qData.options || [],
                correct_answers: qData.correct_answers || [],
                explanation: qData.explanation || "",
                subject: qData.subject || "General",
            });
        });
    }

    // 3. Sort questions
    const questionsMap = new Map(allQuestions.map(q => [q.id, q]));
    return questionIds.map((id: string) => questionsMap.get(id)).filter((q: any) => q !== undefined);

  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

export default async function TestResultsPage({ params }: PageProps) {
  const { testId, attemptId } = await params;

  const [attempt, questions] = await Promise.all([
    getAttempt(attemptId),
    getQuestions(testId)
  ]);

  if (!attempt || questions.length === 0) {
    return <div className="p-10 text-center">Results not found.</div>;
  }

  return <TestResults attempt={attempt as any} questions={questions as any} />;
}