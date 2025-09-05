// src/app/api/mock-tests/recent-attempts/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const attemptsSnapshot = await db.collection('userAttempts')
            .where('userId', '==', userId)
            .orderBy('submittedAt', 'desc')
            .limit(5)
            .get();

        if (attemptsSnapshot.empty) {
            return NextResponse.json([]);
        }

        const attempts = await Promise.all(attemptsSnapshot.docs.map(async (doc) => {
            const attemptData = doc.data();
            const testDoc = await db.collection('mockTests').doc(attemptData.testId).get();
            const testData = testDoc.data();

            const submittedAt = attemptData.submittedAt as Timestamp;

            return {
                id: doc.id,
                testId: attemptData.testId,
                title: testData?.title || 'Unknown Test',
                score: attemptData.score,
                totalAttempted: attemptData.totalAttempted,
                correctCount: attemptData.correctCount,
                incorrectCount: attemptData.incorrectCount,
                submittedAt: submittedAt.toDate().toISOString(),
            };
        }));

        return NextResponse.json(attempts);
    } catch (error) {
        console.error("API GET Error:", error);
        return NextResponse.json({ error: 'Failed to fetch recent attempts' }, { status: 500 });
    }
}