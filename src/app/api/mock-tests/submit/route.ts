import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue, FieldPath } from 'firebase-admin/firestore';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth-admin';

const SubmissionSchema = z.object({
  userId: z.string().min(1),
  testId: z.string().min(1),
  answers: z.record(z.string(), z.number()),
});

// HELPER: Split IDs into groups of 10 (Firebase Limit)
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export async function POST(request: Request) {
  try {
    const requesterUid = await verifyAuth();
    if (!requesterUid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = SubmissionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data provided.' }, { status: 400 });
    }

    const { userId, testId, answers } = validation.data;

    if (userId !== requesterUid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const questionIds = Object.keys(answers);

    // Handle empty submission
    if (questionIds.length === 0) {
      const attemptRef = await db.collection('userAttempts').add({
          userId, testId, answers: {}, score: 0, correctCount: 0, incorrectCount: 0, totalAttempted: 0, submittedAt: FieldValue.serverTimestamp(),
      });
      return NextResponse.json({ success: true, attemptId: attemptRef.id });
    }

    // --- FIX: BATCHED QUERY ---
    const questionsRef = db.collection('questions');
    const correctAnswersMap = new Map<string, number>();
    
    // Split IDs into groups of 10 to avoid Firebase error
    const batches = chunkArray(questionIds, 10);
    
    for (const batch of batches) {
      const questionsSnap = await questionsRef.where(FieldPath.documentId(), 'in', batch).get();
      questionsSnap.forEach(doc => {
        const data = doc.data();
        if (data.correct_answers && data.correct_answers.length > 0) {
          correctAnswersMap.set(doc.id, data.correct_answers[0]);
        }
      });
    }

    let correctCount = 0;
    let incorrectCount = 0;

    for (const questionId of questionIds) {
      const userAnswer = answers[questionId];
      const correctAnswer = correctAnswersMap.get(questionId);

      // Only grade if question exists in DB
      if (correctAnswer !== undefined) {
        if (userAnswer === correctAnswer) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      }
    }

    const score = (correctCount * 4) - (incorrectCount * 1);
    
    const attemptRef = await db.collection('userAttempts').add({
      userId,
      testId,
      answers,
      score,
      correctCount,
      incorrectCount,
      totalAttempted: questionIds.length,
      submittedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, attemptId: attemptRef.id });

  } catch (error) {
    console.error("Error submitting test:", error);
    return NextResponse.json({ error: 'Failed to submit the test.' }, { status: 500 });
  }
}