// src/app/api/discussions/reply/delete/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
    const { discussionId, replyId, userId } = await request.json();
    if (!userId || !discussionId || !replyId) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const replyRef = db.collection('discussions').doc(discussionId).collection('replies').doc(replyId);
    try {
        const doc = await replyRef.get();
        if (!doc.exists || doc.data()?.authorId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        
        await replyRef.delete();
        
        // Decrement the reply count on the parent post
        const discussionRef = db.collection('discussions').doc(discussionId);
        await discussionRef.update({ replyCount: FieldValue.increment(-1) });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete reply." }, { status: 500 });
    }
}
