// src/app/api/seed-db/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET() {
    // This is your initial curriculum structure.
    // Replace the empty strings "" with actual Playlist IDs when you have them.
    const curriculum = [
        {
            title: "Mathematics",
            order: 1,
            topics: [
                { name: "Algebra", playlistId: "" },
                { name: "Calculus", playlistId: "" },
                { name: "Vectors", playlistId: "" },
                { name: "Trigonometry", playlistId: "" }
            ]
        },
        {
            title: "Logical Reasoning",
            order: 2,
            topics: [
                { name: "Puzzles", playlistId: "" },
                { name: "Series", playlistId: "" }
            ]
        },
        {
            title: "Computer Science",
            order: 3,
            topics: [
                { name: "Data Structures", playlistId: "" },
                { name: "Operating Systems", playlistId: "" }
            ]
        },
        {
            title: "English",
            order: 4,
            topics: [
                { name: "Grammar", playlistId: "" },
                { name: "Vocabulary", playlistId: "" }
            ]
        }
    ];

    try {
        const batch = db.batch();
        
        for (const subject of curriculum) {
            // Create a document ID based on the title (e.g., "mathematics")
            const docRef = db.collection('curriculum').doc(subject.title.toLowerCase().replace(/\s+/g, '_'));
            batch.set(docRef, subject);
        }

        await batch.commit();
        return NextResponse.json({ message: "Database seeded successfully!" });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}