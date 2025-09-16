// src/app/api/user/practice-history/route.ts
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
        const attemptsSnapshot = await db.collection('users').doc(userId).collection('dppAttempts').get();
        
        if (attemptsSnapshot.empty) {
            return NextResponse.json([]);
        }

        const dates = attemptsSnapshot.docs.map(doc => {
            const data = doc.data();
            const submittedAt = data.submittedAt as Timestamp;
            return submittedAt.toDate().toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
        });

        // Remove duplicates in case user submits DPP multiple times a day
        const uniqueDates = [...new Set(dates)];

        return NextResponse.json(uniqueDates);
    } catch (error) {
        console.error("Error fetching practice history:", error);
        return NextResponse.json({ error: 'Failed to fetch practice history' }, { status: 500 });
    }
}