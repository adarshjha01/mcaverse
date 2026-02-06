// src/app/api/discussions/delete/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { verifyAuth } from '@/lib/auth-admin'; // Import security helper

export async function POST(request: Request) {
    // 1. Verify Identity
    const requesterUid = await verifyAuth();
    if (!requesterUid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { discussionId } = await request.json(); // We don't need userId from body anymore
    if (!discussionId) {
        return NextResponse.json({ error: 'Missing discussion ID' }, { status: 400 });
    }

    const docRef = db.collection('discussions').doc(discussionId);
    try {
        const doc = await docRef.get();
        // 2. Enforce Ownership
        if (!doc.exists || doc.data()?.authorId !== requesterUid) {
            return NextResponse.json({ error: 'Forbidden: You do not own this post.' }, { status: 403 });
        }
        
        await docRef.delete();
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete post." }, { status: 500 });
    }
}