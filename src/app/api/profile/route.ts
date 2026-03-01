// src/app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { getAuth } from 'firebase-admin/auth';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth-admin'; // Import the helper

// Transform empty strings to undefined so Firestore doesn't store blank values
const emptyToUndefined = z.string().transform(v => v.trim() === '' ? undefined : v.trim());

const ProfileSchema = z.object({
  name: z.string().min(2, "Name is required.").transform(v => v.trim()),
  college: emptyToUndefined.optional(),
  course: emptyToUndefined.optional(),
  location: emptyToUndefined.optional(),
  bio: z.string().max(300).transform(v => v.trim() === '' ? undefined : v.trim()).optional(),
  phone: z.string().regex(/^\+?[\d\s\-()]{0,20}$/, "Invalid phone format.").transform(v => v.trim() === '' ? undefined : v.trim()).optional(),
  linkedin: z.string().url().optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  github: z.string().url().optional().or(z.literal('')).transform(v => v === '' ? undefined : v),
  targetExam: emptyToUndefined.optional(),
  examYear: emptyToUndefined.optional(),
  preparationStatus: emptyToUndefined.optional(),
  semester: emptyToUndefined.optional(),
  enrollmentYear: emptyToUndefined.optional(),
  graduationYear: emptyToUndefined.optional(),
  skills: emptyToUndefined.optional(),
  interests: emptyToUndefined.optional(),
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
            const data = { ...docSnap.data() };
            // Strip sensitive fields from public responses
            delete data.phone;
            return NextResponse.json(data);
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

    // Strip undefined values — Firestore throws on writing undefined
    const cleanData: Record<string, any> = {};
    for (const [key, value] of Object.entries(profileData)) {
        if (value !== undefined) cleanData[key] = value;
    }

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
            ...cleanData
        }, { merge: true });

        return NextResponse.json({ success: true, message: "Profile updated successfully!" });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}