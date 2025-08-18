// src/app/api/success-stories/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

// Define the same Zod schema for validation
const StorySchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  batch: z.string().min(4, "Please enter your batch year."),
  company: z.string().min(2, "Please enter your company name."),
  storyTitle: z.string().min(10, "Title must be at least 10 characters."),
  storyContent: z.string().min(50, "Your story must be at least 50 characters."),
  imageUrl: z.string().url("Invalid image URL.").optional(),
});

export async function POST(request: Request) {
    const formData = await request.formData();
    const validatedFields = StorySchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return NextResponse.json({ 
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed." 
        }, { status: 400 });
    }

    try {
        const { name, batch, company, storyTitle, storyContent, imageUrl } = validatedFields.data;
        await db.collection('success-stories').add({
            name,
            batch,
            company,
            title: storyTitle,
            content: storyContent,
            imageUrl: imageUrl || null,
            submittedAt: FieldValue.serverTimestamp(),
            approved: false,
        });
        return NextResponse.json({ success: true, message: "Thank you! Your story has been submitted for review." });
    } catch (error) {
        console.error("Error submitting story:", error);
        return NextResponse.json({ message: "Failed to submit story. Please try again." }, { status: 500 });
    }
}
