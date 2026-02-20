// src/app/api/dpp/submit/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

// --- Helper Functions ---

const areConsecutiveDays = (date1: Date, date2: Date): boolean => {
    const d1 = new Date(date1); d1.setHours(0,0,0,0);
    const d2 = new Date(date2); d2.setHours(0,0,0,0);
    const diffTime = d2.getTime() - d1.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24)) === 1;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Detect if this is a Daily Quest (Single Question) or a DPP (Multiple Questions)
        // Your DailyPractice.tsx sends 'questionId', while Mock Tests send 'dppId'
        const isDailyQuest = 'questionId' in body;

        if (isDailyQuest) {
            return await handleDailyQuestSubmit(body);
        } else {
            return await handleDppSubmit(body);
        }
    } catch (error) {
        console.error("Submit Error:", error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}

// --- Logic 1: Handle Daily Quest (Single Question) ---
async function handleDailyQuestSubmit(data: any) {
    const { userId, questionId, selectedOptionIndex } = data;

    if (!userId || !questionId || selectedOptionIndex === undefined) {
        return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // 1. Verify Answer
    const questionRef = db.collection('questions').doc(questionId);
    const questionSnap = await questionRef.get();

    if (!questionSnap.exists) {
        return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const questionData = questionSnap.data();
    const correctAnswerIndex = questionData?.correct_answers?.[0]; // Assuming [1] format

    // Loose equality check (==) covers string vs number issues
    const isCorrect = correctAnswerIndex == selectedOptionIndex;

    // 🛑 STEP 2 FIX: Fail Fast!
    // If the answer is wrong, we return immediately.
    // The streak transaction below will NEVER run for wrong answers.
    if (!isCorrect) {
        return NextResponse.json({ 
            success: false, 
            message: "Incorrect answer. Streak not updated." 
        });
    }

    // 2. Handle Correct Answer (Transaction)
    const userRef = db.collection('users').doc(userId);
    const todayStr = new Date().toISOString().split('T')[0];
    const dailySolveRef = userRef.collection('dailySolves').doc(todayStr);

    const result = await db.runTransaction(async (transaction) => {
        // Check if already solved TODAY
        const solveDoc = await transaction.get(dailySolveRef);
        const userDoc = await transaction.get(userRef);
        
        if (solveDoc.exists) {
            // Already solved today? No streak update needed.
            const currentStreak = userDoc.exists ? (userDoc.data()?.currentStreak || 0) : 0;
            return { streakUpdated: false, newStreak: currentStreak };
        }

        // Calculate New Streak
        const userData = userDoc.data() || {};
        const lastPracticeDate = userData.lastPracticeDate?.toDate();
        const today = new Date();
        let newStreak = userData.currentStreak || 0;

        if (lastPracticeDate) {
            if (!isSameDay(lastPracticeDate, today)) {
                if (areConsecutiveDays(lastPracticeDate, today)) {
                    newStreak++; // Kept it alive
                } else {
                    newStreak = 1; // Missed a day
                }
            }
        } else {
            newStreak = 1; // First time
        }

        const newLongest = Math.max(userData.longestStreak || 0, newStreak);

        // Update User Stats
        transaction.set(userRef, {
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastPracticeDate: FieldValue.serverTimestamp(),
            totalPoints: FieldValue.increment(10), // +10 XP
            questionsSolved: FieldValue.increment(1)
        }, { merge: true });

        // Mark Today as Solved
        transaction.set(dailySolveRef, {
            questionId,
            solvedAt: FieldValue.serverTimestamp(),
            pointsEarned: 10
        });

        return { streakUpdated: true, newStreak };
    });

    return NextResponse.json({ 
        success: true, 
        isCorrect: true, 
        streakUpdated: result.streakUpdated,
        newStreak: result.newStreak,
        message: "Correct! Streak Updated 🔥"
    });
}

// --- Logic 2: Handle DPP / Mock Test (Multiple Questions) ---
async function handleDppSubmit(data: any) {
    const { userId, dppId, answers } = data;

    if (!userId || !dppId || !answers) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const dppDoc = await db.collection('dpps').doc(dppId).get();
    // Note: If you don't have a 'dpps' collection yet, this check might fail. 
    // You can remove this check if you are just testing.
    if (!dppDoc.exists) {
         // return NextResponse.json({ error: 'DPP not found' }, { status: 404 });
    }

    const questionIds = Object.keys(answers);
    if (questionIds.length === 0) {
        return NextResponse.json({ success: false, message: "No answers provided" });
    }

    // Verify Answers
    const questionsSnap = await db.collection('questions').where('__name__', 'in', questionIds).get();
    const correctAnswersMap = new Map<string, number>();
    questionsSnap.forEach(doc => {
        correctAnswersMap.set(doc.id, doc.data().correct_answers[0]);
    });

    let correctCount = 0;
    let incorrectCount = 0;
    for (const qId of questionIds) {
        if (answers[qId] === correctAnswersMap.get(qId)) {
            correctCount++;
        } else {
            incorrectCount++;
        }
    }

    // Calculate Score
    const pointsEarned = (correctCount * 4) - (incorrectCount * 1);

    // 🛑 STEP 2 FIX: Fail Fast!
    if (pointsEarned <= 0) {
        return NextResponse.json({ 
            success: false, 
            message: "Score is too low. Keep practicing!" 
        });
    }

    // Transaction for Streak (Only runs if points > 0)
    const userRef = db.collection('users').doc(userId);
    
    const { finalTotalPoints, finalStreak } = await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const userData = userDoc.data() || {};
        
        // Check duplication (optional, based on your needs)
        // const attemptRef = userRef.collection('dppAttempts').doc(dppId);
        // ...

        let newStreak = userData.currentStreak || 0;
        const lastPracticeDate = userData.lastPracticeDate?.toDate();
        const today = new Date();

        if (lastPracticeDate) {
            if (!isSameDay(lastPracticeDate, today)) {
                if (areConsecutiveDays(lastPracticeDate, today)) {
                    newStreak++;
                } else {
                    newStreak = 1;
                }
            }
        } else {
            newStreak = 1;
        }

        const newLongest = Math.max(userData.longestStreak || 0, newStreak);
        const newTotalPoints = (userData.totalPoints || 0) + pointsEarned;

        transaction.set(userRef, {
            totalPoints: newTotalPoints,
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastPracticeDate: FieldValue.serverTimestamp()
        }, { merge: true });

        return { finalTotalPoints: newTotalPoints, finalStreak: newStreak };
    });

    // Log Attempt (Fire and Forget)
    userRef.collection('dppAttempts').doc(dppId).set({
        submittedAt: Timestamp.now(),
        score: pointsEarned
    });

    return NextResponse.json({ 
        success: true, 
        score: pointsEarned, 
        totalPoints: finalTotalPoints,
        streak: finalStreak
    });
}