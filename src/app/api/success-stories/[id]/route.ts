// src/app/api/success-stories/[id]/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { verifyAuth } from '@/lib/auth-admin';

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