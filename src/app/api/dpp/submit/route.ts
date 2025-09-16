// src/app/api/dpp/submit/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

// Helper to check if two dates are on consecutive days, ignoring time
const areConsecutiveDays = (date1: Date, date2: Date): boolean => {
    const d1 = new Date(date1);
    d1.setHours(0, 0, 0, 0);
    const d2 = new Date(date2);
    d2.setHours(0, 0, 0, 0);
    
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
};

// Helper to check if two dates are the same day, ignoring time
const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

export async function POST(request: Request) {
    const { userId, dppId, answers } = await request.json();

    if (!userId || !dppId || !answers) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const dppDoc = await db.collection('dpps').doc(dppId).get();
        if (!dppDoc.exists) {
            return NextResponse.json({ error: 'DPP not found' }, { status: 404 });
        }
        
        const dppData = dppDoc.data()!;
        const questionIds = Object.keys(answers);

        if (questionIds.length === 0) {
            return NextResponse.json({ success: true, score: 0, totalPoints: 0 });
        }
        
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
        
        const pointsEarned = (correctCount * 4) - (incorrectCount * 1);
        const userRef = db.collection('users').doc(userId);

        // Use a transaction to safely update user points and streak
        const { finalTotalPoints, finalStreak } = await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            
            if (!userDoc.exists) {
                transaction.set(userRef, {
                    totalPoints: pointsEarned > 0 ? pointsEarned : 0,
                    currentStreak: 1,
                    longestStreak: 1,
                    lastPracticeDate: FieldValue.serverTimestamp(),
                });
                return { finalTotalPoints: pointsEarned, finalStreak: 1 };
            }

            const userData = userDoc.data()!;
            const lastPracticeDate = userData.lastPracticeDate?.toDate();
            const today = new Date();
            let newStreak = userData.currentStreak || 0;
            
            if (lastPracticeDate && !isSameDay(lastPracticeDate, today)) {
                if (areConsecutiveDays(lastPracticeDate, today)) {
                    newStreak++; // Increment streak
                } else {
                    newStreak = 1; // Reset streak
                }
            } else if (!lastPracticeDate) {
                 newStreak = 1; // First-time practice
            }

            const newLongestStreak = Math.max(userData.longestStreak || 0, newStreak);
            const newTotalPoints = (userData.totalPoints || 0) + pointsEarned;
            
            transaction.update(userRef, {
                totalPoints: newTotalPoints > 0 ? newTotalPoints : 0,
                currentStreak: newStreak,
                longestStreak: newLongestStreak,
                lastPracticeDate: Timestamp.now()
            });

            return { finalTotalPoints: newTotalPoints, finalStreak: newStreak };
        });
        
        // Log the daily attempt for the contribution graph
        const dppAttemptRef = userRef.collection('dppAttempts').doc(dppId);
        await dppAttemptRef.set({
            submittedAt: Timestamp.now(),
            score: pointsEarned,
        });

        return NextResponse.json({ 
            success: true, 
            score: pointsEarned, 
            totalPoints: finalTotalPoints 
        });

    } catch (error) {
        console.error("DPP Submission Error:", error);
        return NextResponse.json({ error: 'Failed to submit DPP.' }, { status: 500 });
    }
}