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

// --- ROBUST DATA SANITIZER ---
// Recursively traverses any object and converts Firestore Timestamps to strings.
// This prevents "Serialization Error" crashes no matter what fields are in the DB.
function sanitizeFirestoreData(data: any): any {
  if (data === null || data === undefined) return data;
  
  // 1. If it's a Firestore Timestamp (has toDate method), convert to ISO string
  if (data && typeof data.toDate === 'function') {
    return data.toDate().toISOString();
  }
  
  // 2. If it's a Date object, convert to ISO string
  if (data instanceof Date) {
    return data.toISOString();
  }

  // 3. If it's an Array, recursively sanitize each item
  if (Array.isArray(data)) {
    return data.map(item => sanitizeFirestoreData(item));
  }
  
  // 4. If it's an Object, recursively sanitize each key
  if (typeof data === 'object') {
    const sanitized: any = {};
    for (const key in data) {
      // Skip internal keys or functions
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitized[key] = sanitizeFirestoreData(data[key]);
      }
    }
    return sanitized;
  }
  
  // 5. Primitives (string, number, boolean) pass through unchanged
  return data;
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function getResultsData(testId: string, attemptId: string) {
  try {
    // 1. Fetch Attempt
    const attemptDocRef = db.collection('userAttempts').doc(attemptId);
    const attemptDocSnap = await attemptDocRef.get();

    if (!attemptDocSnap.exists) notFound();
    
    // FETCH & SANITIZE IMMEDIATELY
    // This cleans nested objects, createdAt, updatedAt, etc.
    const rawAttemptData = attemptDocSnap.data();
    const sanitizedAttempt = sanitizeFirestoreData(rawAttemptData);
    
    if (sanitizedAttempt.testId !== testId) notFound();

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
            // Manually pick fields to ensure clean data
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

    // 4. Construct Final Serializable Attempt
    const finalAttempt = {
      id: attemptDocSnap.id,
      ...sanitizedAttempt
    };

    return { attempt: finalAttempt, questions: orderedQuestions };

  } catch (error) {
    console.error("Error fetching results:", error);
    return null; // Handle error gracefully in UI
  }
}

export default async function ResultsPage({ params }: { params: Promise<{ testId: string; attemptId: string }> }) {
  const { testId, attemptId } = await params;
  const result = await getResultsData(testId, attemptId);

  if (!result) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800">
              <h1 className="text-2xl font-bold mb-2">Results Not Found</h1>
              <p>Unable to load the requested test results.</p>
          </div>
      );
  }

  const { attempt, questions } = result;

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 py-8">
            <TestResults attempt={attempt as any} questions={questions} />
        </div>
    </div>
  );
}