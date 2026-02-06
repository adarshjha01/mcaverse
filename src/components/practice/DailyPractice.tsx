// src/components/practice/DailyPractice.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { IconFlame, IconCheck } from '@/components/ui/Icons';
import confetti from 'canvas-confetti';

type DailyQuestion = {
    id: string;
    question_text: string;
    options: string[];
};

export const DailyPractice = () => {
    const { user } = useAuth();
    const [question, setQuestion] = useState<DailyQuestion | null>(null);
    const [hasSolved, setHasSolved] = useState(false);
    const [streak, setStreak] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDaily = async () => {
            // We fetch the question even if not logged in, but we can't check 'hasSolved'
            const userIdParam = user ? `?userId=${user.uid}` : '';
            try {
                const res = await fetch(`/api/dpp/daily-question${userIdParam}`);
                const data = await res.json();
                
                if (data.question) {
                    setQuestion(data.question);
                    setHasSolved(data.hasSolved);
                    setStreak(data.streak);
                }
            } catch (err) {
                console.error("Failed to load Daily Quest", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDaily();
    }, [user]);

    const handleSubmit = async () => {
        if (selectedOption === null || !question) return;
        
        if (!user) {
            alert("Please login to save your streak!");
            return;
        }
        
        setIsSubmitting(true);
        setFeedback(null);

        try {
            const res = await fetch('/api/dpp/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.uid,
                    questionId: question.id,
                    selectedOptionIndex: selectedOption
                })
            });
            const data = await res.json();

            if (data.success) {
                setHasSolved(true);
                setStreak(data.newStreak);
                setFeedback({ type: 'success', message: `Correct! Streak updated to ${data.newStreak} 🔥` });
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } else {
                setFeedback({ type: 'error', message: "Incorrect. Try again!" });
            }
        } catch (err) {
            setFeedback({ type: 'error', message: "Something went wrong." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-6"></div>
            <div className="space-y-4">
                <div className="h-12 bg-slate-200 rounded"></div>
                <div className="h-12 bg-slate-200 rounded"></div>
            </div>
        </div>
    );

    // If user has solved it TODAY
    if (hasSolved) return (
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-8 text-white text-center shadow-lg transform transition-all hover:scale-[1.01]">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <IconCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Quest Complete!</h2>
            <p className="mb-4 opacity-90">You've kept your streak alive.</p>
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm font-bold shadow-sm">
                <IconFlame className="w-5 h-5 text-orange-300" />
                {streak} Day Streak
            </div>
            <p className="mt-6 text-sm opacity-75">Come back tomorrow for a new challenge.</p>
        </div>
    );

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex justify-between items-center">
                <h2 className="font-bold text-indigo-900 flex items-center gap-2">
                    <span>⚔️ Daily Quest</span>
                </h2>
                {user && (
                    <div className="flex items-center gap-1 text-orange-500 font-bold text-sm bg-white px-3 py-1 rounded-full shadow-sm border border-indigo-100">
                        <IconFlame className="w-4 h-4" />
                        <span>{streak}</span>
                    </div>
                )}
            </div>

            {question ? (
                <div className="p-6">
                    <p className="text-slate-800 font-medium text-lg mb-6 leading-relaxed">
                        {question.question_text}
                    </p>

                    <div className="space-y-3 mb-6">
                        {question.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedOption(idx)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 group flex items-start ${
                                    selectedOption === idx 
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900' 
                                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                                }`}
                            >
                                <span className={`flex-shrink-0 w-6 h-6 rounded-full border text-xs flex items-center justify-center mr-3 mt-0.5 transition-colors ${
                                    selectedOption === idx ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-400 text-slate-500 group-hover:border-indigo-400'
                                }`}>
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                <span>{option}</span>
                            </button>
                        ))}
                    </div>

                    {feedback && (
                        <div className={`p-3 rounded-lg mb-4 text-center text-sm font-medium ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {feedback.message}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={selectedOption === null || isSubmitting}
                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isSubmitting ? 'Checking...' : (user ? 'Submit Answer' : 'Login to Submit')}
                    </button>
                </div>
            ) : (
                <div className="p-10 text-center text-slate-500">
                    No Daily Quest available today. Check back later!
                </div>
            )}
        </div>
    );
};