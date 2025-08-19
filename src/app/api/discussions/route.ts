// src/app/api/discussions/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Updated schema to match the form data
const PostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  authorId: z.string(),
  authorName: z.string(),
});

export async function POST(request: Request) {
    const formData = await request.formData();
    const validatedFields = PostSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return NextResponse.json({ 
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed." 
        }, { status: 400 });
    }

    try {
        const { title, content, authorId, authorName } = validatedFields.data;
        await db.collection('discussions').add({
            title,
            content,
            authorId,
            authorName,
            createdAt: FieldValue.serverTimestamp(),
            replyCount: 0,
            voteCount: 0,
            upvotes: [],
            downvotes: [],
        });
        
        revalidatePath('/community');
        return NextResponse.json({ success: true, message: "Your post has been created!" });

    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ message: "Failed to create post. Please try again." }, { status: 500 });
    }
}
