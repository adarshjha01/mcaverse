// src/app/api/mock-tests/submit/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue, FieldPath } from 'firebase-admin/firestore';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth-admin';

// VALIDATION
const SubmissionSchema = z.object({
  userId: z.string().min(1),
  testId: z.string().min(1),
  answers: z.record(z.string(), z.number()), // Map: QuestionID -> OptionIndex
});

// SCORING CONFIGURATION
const SCORING_RULES: Record<string, { correct: number; incorrect: number }> = {
  'Mathematics': { correct: 12, incorrect: 3 }, // +12, -3
  'Logical Reasoning': { correct: 6, incorrect: 1.5 }, // +6, -1.5
  'Computer Awareness': { correct: 4, incorrect: 1 }, // +4, -1
  'English': { correct: 4, incorrect: 1 }, // +4, -1
  'default': { correct: 4, incorrect: 1 } // Fallback
};

// HELPER: Batch Array
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
      return NextResponse.json({ error: 'Invalid data.' }, { status: 400 });
    }

    const { userId, testId, answers } = validation.data;

    if (userId !== requesterUid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const questionIds = Object.keys(answers);

    // HANDLE EMPTY SUBMISSION
    if (questionIds.length === 0) {
      const attemptRef = await db.collection('userAttempts').add({
          userId, testId, answers: {}, score: 0, 
          correctCount: 0, incorrectCount: 0, unattemptedCount: 0, // We need total Qs to calc unattempted properly, usually done on frontend or by fetching test doc
          submittedAt: FieldValue.serverTimestamp(),
      });
      return NextResponse.json({ success: true, attemptId: attemptRef.id });
    }

    // FETCH QUESTIONS (Batched) & CALCULATE SCORE
    const questionsRef = db.collection('questions');
    let totalScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    
    // We need to know the question details to score them
    const batches = chunkArray(questionIds, 10);
    
    for (const batch of batches) {
      const snap = await questionsRef.where(FieldPath.documentId(), 'in', batch).get();
      
      snap.forEach(doc => {
        const qData = doc.data();
        const qId = doc.id;
        const userAnswer = answers[qId];
        
        // Determine Subject for Scoring
        const subject = qData.subject || 'default';
        const rules = SCORING_RULES[subject] || SCORING_RULES['default'];

        // Check Answer
        // Note: correct_answers is an array in your DB, usually [index]
        const correctAnswerIndex = qData.correct_answers?.[0];

        if (correctAnswerIndex !== undefined) {
          if (userAnswer === correctAnswerIndex) {
            totalScore += rules.correct;
            correctCount++;
          } else {
            totalScore -= rules.incorrect;
            incorrectCount++;
          }
        }
      });
    }

    // SAVE ATTEMPT
    const attemptRef = await db.collection('userAttempts').add({
      userId,
      testId,
      answers,
      score: totalScore,
      correctCount,
      incorrectCount,
      totalAttempted: questionIds.length,
      submittedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, attemptId: attemptRef.id });

  } catch (error) {
    console.error("Error submitting test:", error);
    return NextResponse.json({ error: 'Server failed.' }, { status: 500 });
  }
}