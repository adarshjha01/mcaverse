// src/app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';
import { z } from 'zod';

const ProfileSchema = z.object({
  name: z.string().min(2, "Name is required."),
  college: z.string().optional(),
  course: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional(),
});

// GET function to fetch profile data
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    try {
        const docSnap = await db.collection('users').doc(userId).get();
        if (docSnap.exists) {
            return NextResponse.json(docSnap.data());
        }
        return NextResponse.json({});
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

// POST function to update profile data
export async function POST(request: Request) {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const validatedFields = ProfileSchema.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success) {
        return NextResponse.json({ errors: validatedFields.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, imageUrl, ...profileData } = validatedFields.data;

    try {
        await getAuth().updateUser(userId, {
            displayName: name,
            ...(imageUrl && { photoURL: imageUrl }),
        });

        await db.collection('users').doc(userId).set({
            name,
            ...(imageUrl && { photoURL: imageUrl }),
            ...profileData
        }, { merge: true });

        return NextResponse.json({ success: true, message: "Profile updated successfully!" });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
