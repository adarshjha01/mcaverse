// src/app/api/user/practice-history/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        // Fetch from the new 'contributions' collection
        const contributionsSnapshot = await db.collection('users').doc(userId).collection('contributions').get();
        
        if (contributionsSnapshot.empty) {
            return NextResponse.json({}); // Return an empty object if no contributions
        }
        
        // Create an object mapping date strings to their contribution count
        const contributions: { [date: string]: number } = {};
        contributionsSnapshot.forEach(doc => {
            contributions[doc.id] = doc.data().count;
        });

        return NextResponse.json(contributions);
    } catch (error) {
        console.error("Error fetching practice history:", error);
        return NextResponse.json({ error: 'Failed to fetch practice history' }, { status: 500 });
    }
}