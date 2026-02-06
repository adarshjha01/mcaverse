// src/app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth-admin'; // Import the helper

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

// GET function (Public read is okay, but strictly speaking, personal data should be protected. 
// For a community app, reading other profiles is usually fine.)
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

// POST function (Protected Write)
export async function POST(request: Request) {
    // 1. Verify Authentication
    const requesterUid = await verifyAuth();
    if (!requesterUid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    // 2. Authorization Check: Ensure requester matches the target userId
    if (userId !== requesterUid) {
        return NextResponse.json({ error: 'Forbidden: You can only edit your own profile.' }, { status: 403 });
    }

    const validatedFields = ProfileSchema.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success) {
        return NextResponse.json({ errors: validatedFields.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, imageUrl, ...profileData } = validatedFields.data;

    try {
        // Update Auth Profile (Display Name / Photo)
        await getAuth().updateUser(userId, {
            displayName: name,
            ...(imageUrl && { photoURL: imageUrl }),
        });

        // Update Firestore Profile
        await db.collection('users').doc(userId).set({
            name,
            ...(imageUrl && { photoURL: imageUrl }),
            ...profileData
        }, { merge: true });

        return NextResponse.json({ success: true, message: "Profile updated successfully!" });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}