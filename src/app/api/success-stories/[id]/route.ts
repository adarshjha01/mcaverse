// src/app/api/success-stories/[id]/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await db.collection("success-stories").doc(id).delete();
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting story:", error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}