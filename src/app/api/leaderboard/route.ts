// src/app/api/leaderboard/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET() {
    try {
        // Query the 'users' collection, order by totalPoints, and limit to top 10
        const snapshot = await db.collection('users')
            .orderBy('totalPoints', 'desc')
            .limit(10)
            .get();
        
        if (snapshot.empty) {
            return NextResponse.json([]);
        }

        const leaderboard = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userName: data.name || data.displayName || 'Anonymous', // Use name, displayName, or fallback
                points: data.totalPoints || 0,
                photoURL: data.photoURL || null, // Include user image for the UI
            };
        });

        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
}
