// src/app/api/dpp/submit/route.ts
//
// STREAK LOGIC:
//   - Wrong answer → does NOT break streak. User can retry until correct.
//   - Correct answer → adds to streak (continues from yesterday or starts fresh).
//   - Missing a day entirely → streak resets to 0.
//   - Attempts are tracked per day. Once correct, answer is locked.
//
import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { verifyAuth } from '@/lib/auth-admin';

export async function POST(req: Request) {
    try {
        const requesterUid = await verifyAuth();
        if (!requesterUid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let body;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        const { userId, questionId, selectedOptionIndex } = body;

        if (!userId || !questionId || selectedOptionIndex === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (userId !== requesterUid) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const now = new Date();
        const todayStr = now.toISOString().split("T")[0];
        const userRef = db.collection("users").doc(userId);
        const solveRef = userRef.collection('dailySolves').doc(todayStr);

        // Check if already solved correctly today — if so, reject duplicate submissions
        const existingSolve = await solveRef.get();
        if (existingSolve.exists && existingSolve.data()?.isCorrect === true) {
            return NextResponse.json({
                success: true,
                isCorrect: true,
                alreadySolved: true,
                newStreak: (await userRef.get()).data()?.streakCount || 0,
                message: "Already solved correctly today!"
            });
        }

        // Fetch the question securely from the database
        const qRef = db.collection('questions').doc(questionId);
        const qSnap = await qRef.get();
        if (!qSnap.exists) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 });
        }

        // Evaluate the answer
        const qData = qSnap.data()!;
        if (!Array.isArray(qData.options) || typeof selectedOptionIndex !== 'number' || selectedOptionIndex < 0 || selectedOptionIndex >= qData.options.length) {
            return NextResponse.json({ error: "Invalid option index" }, { status: 400 });
        }

        // correct_answers stores integer indices (e.g. [0], [3]), not text strings
        const isCorrect = Array.isArray(qData.correct_answers) && qData.correct_answers.includes(selectedOptionIndex);

        // Track attempt count
        const currentAttempts = existingSolve.exists ? (existingSolve.data()?.attempts || 0) : 0;

        // Record the attempt — only overwrite isCorrect if this attempt is correct
        await solveRef.set({
            questionId,
            isCorrect: isCorrect || (existingSolve.data()?.isCorrect || false),
            attempts: currentAttempts + 1,
            submittedAt: Timestamp.now()
        });

        let newStreak = 0;

        if (isCorrect) {
            // Update streak atomically via transaction
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split("T")[0];

            newStreak = await db.runTransaction(async (transaction) => {
                const userDoc = await transaction.get(userRef);
                const data = userDoc.data() || {};
                const lastActiveDate = data.lastStreakDate;
                const currentStreak = data.streakCount || 0;

                let streak = 0;
                if (lastActiveDate === todayStr) {
                    streak = currentStreak; // Already counted today
                } else if (lastActiveDate === yesterdayStr) {
                    streak = currentStreak + 1; // Streak continues!
                } else {
                    streak = 1; // Streak reset or first time
                }

                transaction.set(userRef, {
                    streakCount: streak,
                    lastStreakDate: todayStr,
                    updatedAt: Timestamp.now()
                }, { merge: true });

                return streak;
            });
        } else {
            // Wrong answer — DON'T break streak, just return current streak
            const userDoc = await userRef.get();
            newStreak = userDoc.data()?.streakCount || 0;
        }

        return NextResponse.json({
            success: true,
            isCorrect,
            newStreak,
            attempts: currentAttempts + 1,
        });

    } catch (error) {
        console.error("DPP Submit Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}