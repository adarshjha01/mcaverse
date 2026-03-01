// src/app/api/dpp/daily-question/route.ts
//
// SIMPLE ID-BASED LOGIC — Minimal Firestore reads:
//   - Questions are stored with IDs: M01, M02, M03, …
//   - Each day maps to the next ID (Day 1 → M01, Day 2 → M02, …).
//   - Only 1 Firestore read for the question (direct doc fetch by ID).
//   - +2 reads for logged-in users (user doc + dailySolves doc).
//
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

// Anchor date: Day 1 of DPP. M01 is served on this date.
// Adjust this to the date your first question (M01) goes live.
const DPP_START_DATE = '2025-06-01';

const TOTAL_QUESTIONS = 500;

function getTodayQuestionId(): { questionId: string; dayNumber: number } {
    const start = new Date(DPP_START_DATE + 'T00:00:00Z');
    const now = new Date();
    // Use UTC so the day flips at the same instant for all users
    const startDay = Math.floor(start.getTime() / (1000 * 60 * 60 * 24));
    const todayDay = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
    const rawDay = Math.max(1, todayDay - startDay + 1); // 1-indexed

    // Wrap around using mod so it cycles M01→M500→M01…
    const dayNumber = ((rawDay - 1) % TOTAL_QUESTIONS) + 1;

    // Format: M01, M02, … M500
    const questionId = `M${String(dayNumber).padStart(2, '0')}`;
    return { questionId, dayNumber };
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        const { questionId, dayNumber } = getTodayQuestionId();

        // --- READ 1: Fetch the question directly by document ID ---
        const questionDoc = await db.collection('questions').doc(questionId).get();

        if (!questionDoc.exists) {
            return NextResponse.json({
                error: `Today's question (${questionId}) has not been uploaded yet.`,
                questionId,
                dayNumber,
            }, { status: 404 });
        }

        const questionData = { id: questionDoc.id, ...questionDoc.data() } as {
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
            // --- READ 2-3 (only for logged-in users): user doc + dailySolves doc ---
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const userRef = db.collection('users').doc(userId);

            const [userSnap, solveSnap] = await Promise.all([
                userRef.get(),
                userRef.collection('dailySolves').doc(todayStr).get(),
            ]);

            if (solveSnap.exists) {
                const solveData = solveSnap.data()!;
                wasCorrect = solveData.isCorrect || false;
                attempts = solveData.attempts || 0;
                hasSolved = wasCorrect;
            }
            userStreak = userSnap.data()?.streakCount || 0;
        }

        // Strip sensitive fields before sending to client
        const { correct_answers, dppSerialNumber, ...safeQuestion } = questionData;

        return NextResponse.json({
            question: safeQuestion,
            questionId,
            dayNumber,
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