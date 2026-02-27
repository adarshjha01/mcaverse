// src/app/api/mock-tests/recent-attempts/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { verifyAuth } from '@/lib/auth-admin';

export async function GET(request: Request) {
    const requesterUid = await verifyAuth();
    if (!requesterUid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (userId !== requesterUid) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
            
            // Gracefully handle cases where test might be missing
            const testDoc = await db.collection('mockTests').doc(attemptData.testId).get();
            const testTitle = testDoc.exists ? testDoc.data()?.title : 'Unknown Test';

            // Ensure submittedAt is a valid timestamp before converting
            const submittedAt = attemptData.submittedAt as Timestamp;
            const submittedAtISO = submittedAt?.toDate ? submittedAt.toDate().toISOString() : new Date().toISOString();

            return {
                id: doc.id,
                testId: attemptData.testId,
                title: testTitle,
                score: attemptData.score || 0,
                totalAttempted: attemptData.totalAttempted || 0,
                correctCount: attemptData.correctCount || 0,
                incorrectCount: attemptData.incorrectCount || 0,
                submittedAt: submittedAtISO,
            };
        }));

        return NextResponse.json(attempts);
    } catch (error) {
        // Log the detailed error on the server for debugging
        console.error("API Route Error:", error);
        return NextResponse.json({ error: 'Failed to fetch recent attempts due to a server error.' }, { status: 500 });
    }
}