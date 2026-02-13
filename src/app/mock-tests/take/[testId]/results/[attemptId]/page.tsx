// src/app/mock-tests/take/[testId]/results/[attemptId]/page.tsx
import { db } from "@/lib/firebaseAdmin";
import { notFound } from "next/navigation";
import { TestResults } from "@/components/mock-tests/TestResults";
import { FieldPath } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

type Question = {
  id: string;
  question_text: string;
  options: string[];
  correct_answers: number[];
  explanation: string;
  subject?: string;
};

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// --- HELPER: SANITIZE DATA TO PREVENT CRASHES ---
// Converts complex Firestore objects (Timestamps) into plain strings
function sanitizeAttemptData(data: any) {
    const sanitized = { ...data };
    
    // Safely convert Timestamps
    if (sanitized.submittedAt?.toDate) {
        sanitized.submittedAt = sanitized.submittedAt.toDate().toISOString();
    } else if (!sanitized.submittedAt) {
        sanitized.submittedAt = new Date().toISOString();
    }
    
    // Remove other potential timestamp fields from attempt if they exist
    delete sanitized.createdAt;
    delete sanitized.startedAt;

    return sanitized;
}

async function getResultsData(testId: string, attemptId: string) {
  try {
    // 1. Fetch Attempt
    const attemptDocRef = db.collection('userAttempts').doc(attemptId);
    const attemptDocSnap = await attemptDocRef.get();

    if (!attemptDocSnap.exists) notFound();
    
    const rawAttemptData = attemptDocSnap.data()!;
    
    if (rawAttemptData.testId !== testId) notFound();

    // 2. Fetch Test
    const testDocRef = db.collection('mockTests').doc(testId);
    const testDocSnap = await testDocRef.get();
    
    if (!testDocSnap.exists) notFound();
    
    const questionIds: string[] = testDocSnap.data()?.question_ids || [];

    // 3. Fetch Questions (Sanitized)
    const questionsMap = new Map<string, Question>();
    
    if (questionIds.length > 0) {
      const questionsRef = db.collection('questions');
      const batches = chunkArray(questionIds, 10); 

      for (const batch of batches) {
        const querySnap = await questionsRef.where(FieldPath.documentId(), 'in', batch).get();
        querySnap.forEach(doc => {
            const data = doc.data();
            // CRITICAL FIX: Manually pick fields. Do NOT use ...data()
            // This prevents 'createdAt' timestamps from crashing the page.
            questionsMap.set(doc.id, { 
                id: doc.id, 
                question_text: data.question_text || "",
                options: data.options || [],
                correct_answers: data.correct_answers || [],
                explanation: data.explanation || "",
                subject: data.subject || "General"
            });
        });
      }
    }

    const orderedQuestions = questionIds
      .map(id => questionsMap.get(id))
      .filter((q): q is Question => Boolean(q));

    // 4. Serialize Attempt
    const serializableAttempt = {
      id: attemptDocSnap.id,
      ...sanitizeAttemptData(rawAttemptData)
    };

    return { attempt: serializableAttempt, questions: orderedQuestions };

  } catch (error) {
    console.error("Error fetching results:", error);
    notFound();
  }
}

export default async function ResultsPage({ params }: { params: Promise<{ testId: string; attemptId: string }> }) {
  const { testId, attemptId } = await params;
  const { attempt, questions } = await getResultsData(testId, attemptId);

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-8">
            <TestResults attempt={attempt as any} questions={questions} />
        </div>
    </div>
  );
}