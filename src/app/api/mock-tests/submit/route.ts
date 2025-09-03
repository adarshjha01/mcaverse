// src/app/api/mock-tests/submit/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue, FieldPath } from 'firebase-admin/firestore'; // Corrected import
import { z } from 'zod';

// Define the schema for the incoming submission data
const SubmissionSchema = z.object({
  userId: z.string().min(1),
  testId: z.string().min(1),
  answers: z.record(z.string(), z.number()), // Corrected: Added string key type
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
    // You can decide how to handle empty submissions. Here we'll just save it with a score of 0.
    const attemptRef = await db.collection('userAttempts').add({
        userId, testId, answers: {}, score: 0, correctCount: 0, incorrectCount: 0, totalAttempted: 0, submittedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ success: true, attemptId: attemptRef.id });
  }

  try {
    // 1. Fetch the correct answers for the submitted questions
    const questionsRef = db.collection('questions');
    // Corrected query to use FieldPath.documentId()
    const questionsSnap = await questionsRef.where(FieldPath.documentId(), 'in', questionIds).get();
    
    const correctAnswersMap = new Map<string, number>();
    questionsSnap.forEach(doc => {
      // Assuming the first answer in the array is the correct one
      correctAnswersMap.set(doc.id, doc.data().correct_answers[0]);
    });

    // 2. Calculate the score
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    for (const questionId of questionIds) {
      if (answers[questionId] === correctAnswersMap.get(questionId)) {
        score += 4; // Assuming +4 for a correct answer
        correctCount++;
      } else {
        score -= 1; // Assuming -1 for an incorrect answer
        incorrectCount++;
      }
    }
    const totalAttempted = questionIds.length;

    // 3. Save the user's attempt to the database
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

    // 4. Return the ID of the new attempt document
    return NextResponse.json({ success: true, attemptId: attemptRef.id });

  } catch (error) {
    console.error("Error submitting test:", error);
    return NextResponse.json({ error: 'Failed to submit the test.' }, { status: 500 });
  }
}