import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth-admin';

// Fisher-Yates shuffle for uniform randomness
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const CustomTestSchema = z.object({
  subject: z.string(),
  topic: z.string().optional(),
  numQuestions: z.number().min(5).max(50),
  duration: z.number().min(10).max(120),
  userId: z.string(),
});

export async function POST(request: Request) {
  const requesterUid = await verifyAuth();
  if (!requesterUid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validation = CustomTestSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid input.' }, { status: 400 });
  }

  const { subject, topic, numQuestions, duration, userId } = validation.data;

    if (userId !== requesterUid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  try {
    let query: FirebaseFirestore.Query = db.collection('questions').where('subject', '==', subject);
    if (topic) {
      query = query.where('topic', '==', topic);
    }

    const questionsSnapshot = await query.get();

    if (questionsSnapshot.empty) {
      return NextResponse.json({ error: 'No questions found for the selected criteria.' }, { status: 404 });
    }

    const allQuestionIds = questionsSnapshot.docs.map(doc => doc.id);

    if (allQuestionIds.length < numQuestions) {
      return NextResponse.json({ error: `Only found ${allQuestionIds.length} questions. Please select a smaller number.` }, { status: 400 });
    }

    const selectedQuestionIds = shuffleArray(allQuestionIds)
      .slice(0, numQuestions);

    const testTitle = topic ? `Custom: ${subject} - ${topic}` : `Custom: ${subject}`;

    const newTestRef = await db.collection('mockTests').add({
      title: testTitle,
      exam: 'custom',
      testType: topic ? 'topic-wise' : 'subject-wise',
      durationInMinutes: duration,
      question_ids: selectedQuestionIds,
      isCustom: true,
      userId: userId,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, testId: newTestRef.id });

  } catch (error) {
    console.error("Error creating custom test:", error);
    return NextResponse.json({ error: 'Failed to create the test.' }, { status: 500 });
  }
}
