// src/app/api/discussions/reply/delete/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuth } from '@/lib/auth-admin'; // Import security helper

export async function POST(request: Request) {
    // 1. Verify Identity
    const requesterUid = await verifyAuth();
    if (!requesterUid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { discussionId, replyId } = body;
    if (!discussionId || !replyId) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const replyRef = db.collection('discussions').doc(discussionId).collection('replies').doc(replyId);
    try {
        const doc = await replyRef.get();
        // 2. Enforce Ownership
        if (!doc.exists || doc.data()?.authorId !== requesterUid) {
            return NextResponse.json({ error: 'Forbidden: You do not own this reply.' }, { status: 403 });
        }
        
        await replyRef.delete();
        
        // Atomically decrement reply count using a batch
        const discussionRef = db.collection('discussions').doc(discussionId);
        const batch = db.batch();
        batch.update(discussionRef, { replyCount: FieldValue.increment(-1) });
        await batch.commit();

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete reply." }, { status: 500 });
    }
}