// src/app/api/mock-tests/submit/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue, FieldPath } from 'firebase-admin/firestore';
import { z } from 'zod';

const SubmissionSchema = z.object({
  userId: z.string().min(1),
  testId: z.string().min(1),
  answers: z.record(z.string(), z.number()),
});

export async function POST(request: Request) {
  const body = await request.json();
  const validation = SubmissionSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid data provided.' }, { status: 400 });
  }

  const { userId, testId, answers } = validation.data;
  const questionIds = Object.keys(answers);

  if (questionIds.length === 0) {
    const attemptRef = await db.collection('userAttempts').add({
        userId, testId, answers: {}, score: 0, correctCount: 0, incorrectCount: 0, totalAttempted: 0, submittedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ success: true, attemptId: attemptRef.id });
  }

  try {
    const questionsRef = db.collection('questions');
    const questionsSnap = await questionsRef.where(FieldPath.documentId(), 'in', questionIds).get();
    
    const correctAnswersMap = new Map<string, number>();
    questionsSnap.forEach(doc => {
      correctAnswersMap.set(doc.id, doc.data().correct_answers[0]);
    });

    // --- UPDATED SCORING LOGIC ---
    let correctCount = 0;
    let incorrectCount = 0;

    for (const questionId of questionIds) {
      if (answers[questionId] === correctAnswersMap.get(questionId)) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    }

    const score = (correctCount * 4) - (incorrectCount * 1);
    const totalAttempted = questionIds.length;

    // Save the attempt
    const attemptRef = await db.collection('userAttempts').add({
      userId,
      testId,
      answers,
      score,
      correctCount,
      incorrectCount,
      totalAttempted,
      submittedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, attemptId: attemptRef.id });

  } catch (error) {
    console.error("Error submitting test:", error);
    return NextResponse.json({ error: 'Failed to submit the test.' }, { status: 500 });
  }
}
