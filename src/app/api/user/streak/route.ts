// src/app/api/user/streak/route.ts
//
// Returns user's current streak. Uses streakCount + lastStreakDate fields
// (consistent with the DPP submit route).
//
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
        const lastStreakDate = userData.lastStreakDate; // string like "2026-02-28"
        const streakCount = userData.streakCount || 0;

        if (!lastStreakDate) {
            return NextResponse.json({ currentStreak: 0 });
        }

        // Check if streak is still active (today or yesterday)
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const isActive = lastStreakDate === todayStr || lastStreakDate === yesterdayStr;

        return NextResponse.json({
            currentStreak: isActive ? streakCount : 0,
        });

    } catch (error) {
        console.error("Error fetching user streak:", error);
        return NextResponse.json({ error: 'Failed to fetch streak' }, { status: 500 });
    }
}
