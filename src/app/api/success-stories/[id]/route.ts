// src/app/api/success-stories/[id]/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { verifyAuth } from '@/lib/auth-admin';
import { Timestamp } from "firebase-admin/firestore";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const requesterUid = await verifyAuth();
        if (!requesterUid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const docRef = db.collection("success-stories").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        if (doc.data()?.userId !== requesterUid) {
            return NextResponse.json({ error: 'Forbidden: You can only edit your own stories.' }, { status: 403 });
        }

        const body = await req.json();
        const { name, title, content, batch, rating } = body;

        if (!name || !title || !content) {
            return NextResponse.json({ error: "Name, title, and content are required." }, { status: 400 });
        }

        if (content.length > 500) {
            return NextResponse.json({ error: "Content must be 500 characters or less." }, { status: 400 });
        }

        const storyRating = rating || doc.data()?.rating || 5;
        const isAutoApproved = storyRating >= 4;

        await docRef.update({
            name,
            title,
            content,
            batch: batch || doc.data()?.batch || '',
            rating: storyRating,
            isApproved: isAutoApproved,
            updatedAt: Timestamp.now(),
        });

        return NextResponse.json({
            success: true,
            isApproved: isAutoApproved,
            story: {
                id,
                name,
                title,
                content,
                batch: batch || doc.data()?.batch || '',
                rating: storyRating,
                imageUrl: doc.data()?.imageUrl || null,
                likeCount: doc.data()?.likeCount || 0,
                likes: doc.data()?.likes || [],
                userId: requesterUid,
            },
        });
    } catch (error) {
        console.error("Error updating story:", error);
        return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const requesterUid = await verifyAuth();
        if (!requesterUid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const docRef = db.collection("success-stories").doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        // Only the author can delete their own story
        if (doc.data()?.userId !== requesterUid) {
            return NextResponse.json({ error: 'Forbidden: You can only delete your own stories.' }, { status: 403 });
        }

        await docRef.delete();
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting story:", error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}