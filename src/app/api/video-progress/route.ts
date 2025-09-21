// src/app/api/video-progress/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

// Helper function to get the date in YYYY-MM-DD format
const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Function to GET the user's progress
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

// Function to POST (update) the user's progress
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
            
            // If it's a 'completed' action, also log it as a contribution for the calendar
            if (type === 'completed') {
                const today = getTodayDateString();
                const contributionRef = db.collection('users').doc(userId).collection('contributions').doc(today);
                await contributionRef.set({
                    count: FieldValue.increment(1),
                    lastUpdated: FieldValue.serverTimestamp()
                }, { merge: true });
            }
        } else {
            await docRef.update({ [field]: FieldValue.arrayRemove(lectureId) });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("API POST Error:", error);
        return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
    }
}