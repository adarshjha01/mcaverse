// src/app/api/dpp/daily-question/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        const questionsRef = db.collection('questions');
        const snapshot = await questionsRef
            .where('difficulty', 'in', ['Easy', 'Medium', 'easy', 'medium']) 
            .get();

        if (snapshot.empty) return NextResponse.json({ error: "No questions available." }, { status: 404 });

        const allQuestions = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as { id: string; correct_answers?: string[]; [key: string]: unknown }))
            .filter(q => Array.isArray(q.correct_answers) && q.correct_answers.length > 0);

        if (allQuestions.length === 0) return NextResponse.json({ error: "No valid questions found." }, { status: 404 });

        const today = new Date();
        const seed = Math.floor(today.getTime() / (1000 * 60 * 60 * 24)); 
        const dailyIndex = seed % allQuestions.length;
        const dailyQuestion = allQuestions[dailyIndex];

        let hasSolved = false;
        let wasCorrect = false;
        let userStreak = 0;

        if (userId) {
            const userRef = db.collection('users').doc(userId);
            const userSnap = await userRef.get();
            
            const todayStr = today.toISOString().split('T')[0];
            const solveRef = userRef.collection('dailySolves').doc(todayStr);
            const solveSnap = await solveRef.get();

            if (solveSnap.exists) {
                hasSolved = true;
                wasCorrect = solveSnap.data()?.isCorrect || false;
            }
            // THE FIX: Aligned with the field name we save in the POST route
            userStreak = userSnap.data()?.streakCount || 0;
        }

        const { correct_answers, ...safeQuestion } = dailyQuestion as { correct_answers?: string[]; [key: string]: unknown };

        return NextResponse.json({
            question: safeQuestion,
            hasSolved,
            wasCorrect,
            streak: userStreak
        });

    } catch (error) {
        console.error("Daily QP Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}