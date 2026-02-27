// src/app/api/dpp/submit/route.ts
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

        // Notice: We now receive the index, not a boolean!
        const { userId, questionId, selectedOptionIndex } = body;

        if (!userId || !questionId || selectedOptionIndex === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (userId !== requesterUid) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 1. Fetch the question securely from the database
        const qRef = db.collection('questions').doc(questionId);
        const qSnap = await qRef.get();
        if (!qSnap.exists) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 });
        }

        // 2. Evaluate the answer with bounds checking
        const qData = qSnap.data()!;
        if (!Array.isArray(qData.options) || typeof selectedOptionIndex !== 'number' || selectedOptionIndex < 0 || selectedOptionIndex >= qData.options.length) {
            return NextResponse.json({ error: "Invalid option index" }, { status: 400 });
        }

        const selectedText = qData.options[selectedOptionIndex];
        const isCorrect = Array.isArray(qData.correct_answers) && qData.correct_answers.includes(selectedText);

        const now = new Date();
        const todayStr = now.toISOString().split("T")[0]; 
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        const userRef = db.collection("users").doc(userId);

        // 3. THE FIX: Record that the user attempted today's question!
        await userRef.collection('dailySolves').doc(todayStr).set({
            questionId,
            isCorrect,
            submittedAt: Timestamp.now()
        });

        let newStreak = 0;

        // 4. Update the streak atomically using a transaction
        if (isCorrect) {
            newStreak = await db.runTransaction(async (transaction) => {
                const userDoc = await transaction.get(userRef);
                const data = userDoc.data() || {};
                const lastActiveDate = data.lastStreakDate; 
                const currentStreak = data.streakCount || 0;
                
                let streak = 0;
                if (lastActiveDate === todayStr) {
                    streak = currentStreak; // Already solved today
                } else if (lastActiveDate === yesterdayStr) {
                    streak = currentStreak + 1; // Streak continues!
                } else {
                    streak = 1; // Streak reset/started
                }
                
                transaction.set(userRef, {
                    streakCount: streak,
                    lastStreakDate: todayStr,
                    updatedAt: Timestamp.now()
                }, { merge: true });

                return streak;
            });
        } else {
            // Keep existing streak if they get it wrong
            const userDoc = await userRef.get();
            newStreak = userDoc.data()?.streakCount || 0;
        }

        return NextResponse.json({ success: true, isCorrect, newStreak });

    } catch (error) {
        console.error("DPP Submit Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}