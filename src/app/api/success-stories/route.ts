// src/app/api/success-stories/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";

// Add this line below your imports!
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Extract the data from our new Premium Form
        const { name, title, quote, rating, userId, photoURL } = body;

        if (!name || !title || !quote) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newStory = {
            name,
            title, // e.g., "NIT Trichy '26"
            content: quote, // Maps the form's 'quote' to the DB's 'content'
            imageUrl: photoURL || null, // Maps the form's 'photoURL' to the DB's 'imageUrl'
            batch: new Date().getFullYear().toString(), 
            rating: rating || 5,
            userId: userId || "anonymous",
            likeCount: 0,
            likes: [],
            isApproved: true, // THE FIX: Auto-approves the story so it skips the review phase!
            createdAt: Timestamp.now(),
        };

        const docRef = await db.collection("success-stories").add(newStory);

        return NextResponse.json({ success: true, id: docRef.id });
    } catch (error) {
        console.error("Error adding success story:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        // THE FIX: Simplified the query to avoid Firebase Composite Index blocks
        const snapshot = await db.collection("success-stories")
            .where("isApproved", "==", true)
            .orderBy("createdAt", "desc") // Just order by newest
            .limit(10) 
            .get();

        const stories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()?.toISOString(),
        }));

        // THE FIX: Sort by highest rating in-memory instead!
        stories.sort((a: any, b: any) => (b.rating || 5) - (a.rating || 5));

        return NextResponse.json(stories);
    } catch (error) {
        console.error("Error fetching success stories:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}