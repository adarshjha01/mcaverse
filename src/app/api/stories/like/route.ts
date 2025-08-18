// src/app/api/stories/like/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: Request) {
    const { storyId, userId } = await request.json();

    if (!userId || !storyId) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const storyRef = db.collection('success-stories').doc(storyId);

    try {
        await db.runTransaction(async (transaction) => {
            const storyDoc = await transaction.get(storyRef);
            if (!storyDoc.exists) {
                throw new Error("Document does not exist!");
            }
            
            const data = storyDoc.data()!;
            const likes = data.likes || [];
            
            if (likes.includes(userId)) {
                // Unlike
                transaction.update(storyRef, {
                    likes: FieldValue.arrayRemove(userId),
                    likeCount: FieldValue.increment(-1)
                });
            } else {
                // Like
                transaction.update(storyRef, {
                    likes: FieldValue.arrayUnion(userId),
                    likeCount: FieldValue.increment(1)
                });
            }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error toggling like:", error);
        return NextResponse.json({ error: "Failed to update like status." }, { status: 500 });
    }
}
