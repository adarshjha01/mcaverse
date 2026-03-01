// src/app/api/dpp/daily-question/route.ts
//
// OPTIMIZED: Uses serial numbers to fetch today's question in just 2 Firestore reads:
//   1. Read metadata/dppStats → get totalEligibleCount
//   2. Query questions where dppSerialNumber == (daySeed % totalCount) → 1 doc
// Previously this read the ENTIRE questions collection (hundreds/thousands of reads).
//
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        // --- READ 1: Get question count from metadata ---
        const statsDoc = await db.collection('metadata').doc('dppStats').get();
        if (!statsDoc.exists) {
            return NextResponse.json({ error: "DPP not seeded. Run seedDailyQuestions script." }, { status: 500 });
        }
        const totalCount = statsDoc.data()!.totalEligibleCount as number;
        if (totalCount === 0) {
            return NextResponse.json({ error: "No questions available." }, { status: 404 });
        }

        // Deterministic daily index based on date
        const today = new Date();
        const seed = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
        const dailyIndex = seed % totalCount;

        // --- READ 2: Fetch the single question by serial number ---
        const questionSnap = await db.collection('questions')
            .where('dppSerialNumber', '==', dailyIndex)
            .limit(1)
            .get();

        if (questionSnap.empty) {
            return NextResponse.json({ error: "Daily question not found for today's index." }, { status: 404 });
        }

        const doc = questionSnap.docs[0];
        const questionData = { id: doc.id, ...doc.data() } as {
            id: string;
            correct_answers?: number[];
            dppSerialNumber?: number;
            [key: string]: unknown;
        };

        let hasSolved = false;
        let wasCorrect = false;
        let userStreak = 0;
        let attempts = 0;

        if (userId) {
            // --- READ 3-4 (only for logged-in users): user doc + dailySolves doc ---
            const userRef = db.collection('users').doc(userId);
            const todayStr = today.toISOString().split('T')[0];

            const [userSnap, solveSnap] = await Promise.all([
                userRef.get(),
                userRef.collection('dailySolves').doc(todayStr).get(),
            ]);

            if (solveSnap.exists) {
                const solveData = solveSnap.data()!;
                wasCorrect = solveData.isCorrect || false;
                attempts = solveData.attempts || 0;
                // Only mark as "solved" (locked) if the user got it correct
                hasSolved = wasCorrect;
            }
            userStreak = userSnap.data()?.streakCount || 0;
        }

        // Strip sensitive fields before sending to client
        const { correct_answers, dppSerialNumber, ...safeQuestion } = questionData;

        return NextResponse.json({
            question: safeQuestion,
            hasSolved,
            wasCorrect,
            streak: userStreak,
            attempts,
        });

    } catch (error) {
        console.error("Daily QP Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}