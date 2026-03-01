// src/app/api/user/subject-performance/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldPath } from 'firebase-admin/firestore';
import { verifyAuth } from '@/lib/auth-admin';

// Define a type for our question lookup map
type QuestionData = {
    subject: string;
    correctAnswer: number;
};

export async function GET(request: Request) {
    const requesterUid = await verifyAuth();
    if (!requesterUid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (userId !== requesterUid) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        // 1. Fetch all attempts for the given user
        const attemptsSnapshot = await db.collection('userAttempts')
            .where('userId', '==', userId)
            .get();

        if (attemptsSnapshot.empty) {
            return NextResponse.json([]);
        }

        const attempts = attemptsSnapshot.docs.map(doc => doc.data());

        // 2. Collect all unique question IDs from all attempts
        const allQuestionIds = new Set<string>();
        attempts.forEach(attempt => {
            if (attempt.answers) {
                Object.keys(attempt.answers).forEach(qid => allQuestionIds.add(qid));
            }
        });

        if (allQuestionIds.size === 0) {
            return NextResponse.json([]);
        }

        // 3. Fetch all relevant questions in batches (Firestore 'in' limit is 30)
        const questionIdArray = Array.from(allQuestionIds);
        const questionDataMap = new Map<string, QuestionData>();

        // Batch in chunks of 30
        for (let i = 0; i < questionIdArray.length; i += 30) {
            const batch = questionIdArray.slice(i, i + 30);
            const questionsSnapshot = await db.collection('questions')
                .where(FieldPath.documentId(), 'in', batch)
                .get();
            
            questionsSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.subject && data.correct_answers && data.correct_answers.length > 0) {
                    questionDataMap.set(doc.id, {
                        subject: data.subject,
                        correctAnswer: data.correct_answers[0],
                    });
                }
            });
        }
        
        // 5. Calculate stats
        const subjectStats: { [subject: string]: { correct: number; total: number; } } = {};
        
        attempts.forEach(attempt => {
            if (attempt.answers) {
                for (const questionId in attempt.answers) {
                    const questionData = questionDataMap.get(questionId);
                    const userAnswer = attempt.answers[questionId];

                    if (questionData) {
                        const { subject, correctAnswer } = questionData;
                        
                        if (!subjectStats[subject]) {
                            subjectStats[subject] = { correct: 0, total: 0 };
                        }

                        subjectStats[subject].total++;
                        if (userAnswer === correctAnswer) {
                            subjectStats[subject].correct++;
                        }
                    }
                }
            }
        });

        // 6. Format the final output
        const performanceData = Object.entries(subjectStats).map(([name, stats]) => ({
            name,
            score: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        })).sort((a, b) => b.score - a.score); // Sort by score descending

        return NextResponse.json(performanceData);

    } catch (error) {
        console.error("Error fetching subject performance:", error);
        return NextResponse.json({ error: 'Failed to fetch subject performance' }, { status: 500 });
    }
}
