// src/app/api/dpp/daily-question/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        // 1. Fetch pool of Easy/Medium questions
        const questionsRef = db.collection('questions');
        const snapshot = await questionsRef
            .where('difficulty', 'in', ['Easy', 'Medium', 'easy', 'medium']) 
            .get();

        if (snapshot.empty) {
            return NextResponse.json({ error: "No questions available." }, { status: 404 });
        }

        // 2. Filter for Validity (Must have correct_answers)
        const allQuestions = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            // @ts-ignore
            .filter(q => Array.isArray(q.correct_answers) && q.correct_answers.length > 0);

        if (allQuestions.length === 0) {
            return NextResponse.json({ error: "No valid questions found." }, { status: 404 });
        }

        // 3. Deterministic "Question of the Day" Picker
        const today = new Date();
        const seed = Math.floor(today.getTime() / (1000 * 60 * 60 * 24)); 
        const dailyIndex = seed % allQuestions.length;
        
        const dailyQuestion = allQuestions[dailyIndex];

        // 4. Check User Status
        let hasSolved = false;
        let userStreak = 0;

        if (userId) {
            const userRef = db.collection('users').doc(userId);
            const userSnap = await userRef.get();
            const userData = userSnap.data();

            const todayStr = today.toISOString().split('T')[0];
            const solveRef = userRef.collection('dailySolves').doc(todayStr);
            const solveSnap = await solveRef.get();

            hasSolved = solveSnap.exists;
            userStreak = userData?.currentStreak || 0;
        }

        // 5. Return Safe Data (No correct_answers sent to frontend)
        // @ts-ignore
        const { correct_answers, ...safeQuestion } = dailyQuestion;

        return NextResponse.json({
            question: safeQuestion,
            hasSolved,
            streak: userStreak
        });

    } catch (error) {
        console.error("Daily QP Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}