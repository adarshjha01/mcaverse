// src/app/api/discussions/delete/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
    const { discussionId, userId } = await request.json();
    if (!userId || !discussionId) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const docRef = db.collection('discussions').doc(discussionId);
    try {
        const doc = await docRef.get();
        if (!doc.exists || doc.data()?.authorId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        
        // Note: Deleting subcollections is a more complex operation.
        // For now, we'll just delete the main post. In a production app,
        // you'd use a Firebase Cloud Function to delete all replies.
        await docRef.delete();
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete post." }, { status: 500 });
    }
}
