// src/app/api/dpp/submit/route.ts
import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, questionId, isCorrect } = body;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let currentStreak = 0;
        let newStreak = 0;

        // We only update the streak if the answer is CORRECT
        if (isCorrect) {
            const userRef = db.collection("users").doc(userId);
            const userDoc = await userRef.get();
            
            // Get today's and yesterday's date strings in local format (YYYY-MM-DD)
            const now = new Date();
            const todayStr = now.toISOString().split("T")[0]; 
            
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split("T")[0];

            if (userDoc.exists) {
                const data = userDoc.data()!;
                const lastActiveDate = data.lastStreakDate; 
                currentStreak = data.streakCount || 0;
                
                // STREAK LOGIC FROM SCRATCH:
                if (lastActiveDate === todayStr) {
                    // 1. Already answered correctly today. Streak stays the same.
                    newStreak = currentStreak;
                } else if (lastActiveDate === yesterdayStr) {
                    // 2. Answered yesterday. Increment streak!
                    newStreak = currentStreak + 1;
                } else {
                    // 3. Missed a day (or first time). Reset streak to 1.
                    newStreak = 1; 
                }
            } else {
                // First time ever playing
                newStreak = 1;
            }
            
            // Save the updated streak and the date to Firebase
            await userRef.set({
                streakCount: newStreak,
                lastStreakDate: todayStr,
                updatedAt: Timestamp.now()
            }, { merge: true });
            
            return NextResponse.json({ success: true, isCorrect: true, streak: newStreak });
        }
        
        // If they got it wrong, streak doesn't update
        return NextResponse.json({ success: true, isCorrect: false, message: "Incorrect answer" });

    } catch (error) {
        console.error("DPP Submit Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}