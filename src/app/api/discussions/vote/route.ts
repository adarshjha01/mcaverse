// src/app/api/discussions/vote/route.ts
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

    const { discussionId, userId, voteType } = await request.json();
    
    if (!userId || !discussionId || !voteType) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 2. Enforce Ownership (You can only vote as yourself)
    if (userId !== requesterUid) {
        return NextResponse.json({ error: "Forbidden: Cannot vote for another user." }, { status: 403 });
    }

    const docRef = db.collection('discussions').doc(discussionId);
    try {
        await db.runTransaction(async (t) => {
            const doc = await t.get(docRef);
            if (!doc.exists) throw new Error("Document does not exist!");
            
            const data = doc.data()!;
            const upvotes = data.upvotes || [];
            const downvotes = data.downvotes || [];
            // const voteCount = data.voteCount || 0; // Unused variable

            const hasUpvoted = upvotes.includes(userId);
            const hasDownvoted = downvotes.includes(userId);

            if (voteType === 'up') {
                if (hasUpvoted) { // Remove upvote
                    t.update(docRef, { upvotes: FieldValue.arrayRemove(userId), voteCount: FieldValue.increment(-1) });
                } else { // Add upvote
                    t.update(docRef, { upvotes: FieldValue.arrayUnion(userId), downvotes: FieldValue.arrayRemove(userId), voteCount: FieldValue.increment(hasDownvoted ? 2 : 1) });
                }
            } else if (voteType === 'down') {
                if (hasDownvoted) { // Remove downvote
                    t.update(docRef, { downvotes: FieldValue.arrayRemove(userId), voteCount: FieldValue.increment(1) });
                } else { // Add downvote
                    t.update(docRef, { downvotes: FieldValue.arrayUnion(userId), upvotes: FieldValue.arrayRemove(userId), voteCount: FieldValue.increment(hasUpvoted ? -2 : -1) });
                }
            }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to vote." }, { status: 500 });
    }
}