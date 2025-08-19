// src/app/api/video-progress/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const docRef = db.collection('videoProgress').doc(userId);
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            const data = docSnap.data();
            return NextResponse.json({
                completed: data?.completedLectures || [],
                revision: data?.revisionLectures || [],
            });
        }
        return NextResponse.json({ completed: [], revision: [] });
    } catch (error) {
        console.error("API GET Error:", error);
        return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
    }
}
