// src/app/api/video-progress/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';

// Function to get the user's progress
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

// Function to update the user's progress
export async function POST(request: Request) {
    const { userId, lectureId, type, isAdding } = await request.json();

    if (!userId || !lectureId || !type) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = db.collection('videoProgress').doc(userId);
    const field = type === 'completed' ? 'completedLectures' : 'revisionLectures';

    try {
        if (isAdding) {
            await docRef.set({ [field]: FieldValue.arrayUnion(lectureId) }, { merge: true });
        } else {
            await docRef.update({ [field]: FieldValue.arrayRemove(lectureId) });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("API POST Error:", error);
        return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
    }
}