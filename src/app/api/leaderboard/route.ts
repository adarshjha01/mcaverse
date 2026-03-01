// src/app/api/leaderboard/route.ts
//
// Leaderboard now ranks users by their STREAK (consecutive days),
// not by totalPoints. Shows "X day streak" on the board.
//
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET() {
    try {
        // Query the 'users' collection, order by streakCount (highest first), top 10
        const snapshot = await db.collection('users')
            .orderBy('streakCount', 'desc')
            .limit(10)
            .get();
        
        if (snapshot.empty) {
            return NextResponse.json([]);
        }

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const leaderboard = snapshot.docs
            .map(doc => {
                const data = doc.data();
                const lastStreakDate = data.lastStreakDate;
                // Only show streak if user was active today or yesterday (streak is still alive)
                const isActive = lastStreakDate === todayStr || lastStreakDate === yesterdayStr;
                return {
                    id: doc.id,
                    userName: data.name || data.displayName || 'Anonymous',
                    streak: isActive ? (data.streakCount || 0) : 0,
                    photoURL: data.photoURL || null,
                };
            })
            .filter(u => u.streak > 0) // Only show users with active streaks
            .sort((a, b) => b.streak - a.streak);

        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
}
