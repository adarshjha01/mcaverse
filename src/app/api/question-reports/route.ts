// src/app/api/question-reports/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth-admin';

const ReportSchema = z.object({
  questionId: z.string().min(1),
  testId: z.string().min(1),
  category: z.enum([
    'wrong_answer',
    'wrong_explanation',
    'formatting_issue',
    'unclear_question',
    'duplicate_question',
    'other',
  ]),
  description: z.string().min(1).max(1000),
  questionNumber: z.number().int().positive().optional(),
});

export async function POST(request: Request) {
  try {
    const uid = await verifyAuth();
    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = ReportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data.', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { questionId, testId, category, description, questionNumber } = validation.data;

    // Check for duplicate report from the same user for the same question + category
    const existing = await db
      .collection('questionReports')
      .where('userId', '==', uid)
      .where('questionId', '==', questionId)
      .where('category', '==', category)
      .where('status', '==', 'open')
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json(
        { error: 'You have already reported this issue for this question.' },
        { status: 409 }
      );
    }

    const reportRef = await db.collection('questionReports').add({
      userId: uid,
      questionId,
      testId,
      category,
      description,
      questionNumber: questionNumber ?? null,
      status: 'open', // open | reviewed | resolved | dismissed
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, reportId: reportRef.id });
  } catch (error) {
    console.error('Error creating question report:', error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
