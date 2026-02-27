// src/app/api/user/streak/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
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
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return NextResponse.json({ currentStreak: 0 });
        }

        const userData = userDoc.data()!;
        
        // This logic checks if the streak is broken and returns 0 if it is.
        const lastPracticeDate = userData.lastPracticeDate?.toDate();
        if (lastPracticeDate) {
            const today = new Date();
            const lastPracticeDay = new Date(lastPracticeDate);

            // Set both dates to midnight to compare days accurately
            today.setHours(0, 0, 0, 0);
            lastPracticeDay.setHours(0, 0, 0, 0);
            
            const diffTime = today.getTime() - lastPracticeDay.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > 1) {
                // The streak is broken if more than 1 day has passed.
                // We return 0, but the actual reset happens on the next submission.
                return NextResponse.json({ currentStreak: 0 });
            }
        }
        
        return NextResponse.json({ currentStreak: userData.currentStreak || 0 });

    } catch (error) {
        console.error("Error fetching user streak:", error);
        return NextResponse.json({ error: 'Failed to fetch streak' }, { status: 500 });
    }
}
