// src/app/api/discussions/reply/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

const ReplySchema = z.object({
    replyContent: z.string().min(1, "Reply cannot be empty."),
    discussionId: z.string(),
    authorId: z.string(),
    authorName: z.string(),
});

export async function POST(request: Request) {
    const data = await request.json();
    const validatedFields = ReplySchema.safeParse(data);

    if (!validatedFields.success) {
        return NextResponse.json({ errors: validatedFields.error.flatten().fieldErrors }, { status: 400 });
    }
    
    const { replyContent, discussionId, authorId, authorName } = validatedFields.data;
    const discussionRef = db.collection('discussions').doc(discussionId);

    try {
        await discussionRef.collection('replies').add({
            content: replyContent,
            authorId,
            authorName,
            createdAt: FieldValue.serverTimestamp(),
        });
        await discussionRef.update({ replyCount: FieldValue.increment(1) });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ message: "Failed to add reply." }, { status: 500 });
    }
}