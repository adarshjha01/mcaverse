// src/components/practice/DailyPractice.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { IconFlame, IconCheck } from '@/components/ui/Icons';
import { LatexText } from '@/components/ui/LatexText';
import Link from 'next/link';
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
    const [wasCorrect, setWasCorrect] = useState(false);
    const [streak, setStreak] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDaily = async () => {
            const userIdParam = user ? `?userId=${user.uid}` : '';
            try {
                const res = await fetch(`/api/dpp/daily-question${userIdParam}`);
                const data = await res.json();
                
                if (data.question) {
                    setQuestion(data.question);
                    setHasSolved(data.hasSolved);
                    setWasCorrect(data.wasCorrect);
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
            const token = await user.getIdToken();
            const res = await fetch('/api/dpp/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    userId: user.uid,
                    questionId: question.id,
                    selectedOptionIndex: selectedOption
                })
            });
            const data = await res.json();

            setHasSolved(true);
            setStreak(data.newStreak);

            if (data.isCorrect) {
                setWasCorrect(true);
                setFeedback({ type: 'success', message: `Spot on! Streak updated to ${data.newStreak} 🔥` });
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            } else {
                setWasCorrect(false);
                setFeedback({ type: 'error', message: "Not quite! Review the concepts and try again tomorrow." });
            }
        } catch (err) {
            setFeedback({ type: 'error', message: "Something went wrong." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-3/4 mb-6"></div>
            <div className="space-y-4">
                <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded"></div>
                <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded"></div>
            </div>
        </div>
    );

    // If user has already attempted it TODAY
    if (hasSolved) return (
        <div className={`rounded-2xl p-6 sm:p-8 text-center shadow-lg transition-all ${wasCorrect ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${wasCorrect ? 'bg-white/20 backdrop-blur-sm' : 'bg-slate-200 dark:bg-slate-700'}`}>
                {wasCorrect ? <IconCheck className="w-8 h-8 text-white" /> : <span className="text-2xl">⏳</span>}
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${wasCorrect ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                {wasCorrect ? "Quest Complete!" : "Attempt Logged"}
            </h2>
            <p className={`mb-4 ${wasCorrect ? 'opacity-90' : 'text-slate-600 dark:text-slate-400'}`}>
                {wasCorrect ? "You've kept your streak alive." : "You missed this one, but consistency is key."}
            </p>
            
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-sm ${wasCorrect ? 'bg-white/20 backdrop-blur-sm text-white' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'}`}>
                <IconFlame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500' : 'text-slate-400'}`} />
                {streak} Day Streak
            </div>
            
            <p className={`mt-6 text-sm ${wasCorrect ? 'opacity-75' : 'text-slate-500 dark:text-slate-500'}`}>
                Come back tomorrow for a new challenge.
            </p>
        </div>
    );

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden transition-colors">
            {/* Header */}
            <div className="bg-indigo-50/50 dark:bg-indigo-900/20 px-6 py-4 border-b border-indigo-100 dark:border-indigo-800/50 flex justify-between items-center">
                <h2 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                    <span>⚔️ Daily Quest</span>
                </h2>
                {user && (
                    <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-bold text-sm bg-white dark:bg-slate-950 px-3 py-1.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
                        <IconFlame className="w-4 h-4" />
                        <span>{streak}</span>
                    </div>
                )}
            </div>

            {question ? (
                <div className="p-6 sm:p-8">
                    <div className="text-slate-800 dark:text-slate-200 font-medium text-lg mb-8 leading-relaxed">
                        <LatexText text={question.question_text} />
                    </div>

                    <div className="space-y-3 mb-8">
                        {question.options.map((option, idx) => {
                            const isSelected = selectedOption === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedOption(idx)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group flex items-start ${
                                        isSelected 
                                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100' 
                                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                                    }`}
                                >
                                    <span className={`flex-shrink-0 w-7 h-7 rounded-full border text-xs font-bold flex items-center justify-center mr-4 mt-0.5 transition-colors ${
                                        isSelected 
                                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-600 dark:bg-indigo-500 text-white' 
                                        : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 group-hover:border-indigo-400'
                                    }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="leading-relaxed"><LatexText text={option} /></span>
                                </button>
                            );
                        })}
                    </div>

                    {feedback && (
                        <div className={`p-4 rounded-xl mb-6 text-center text-sm font-semibold ${
                            feedback.type === 'success' 
                            ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50' 
                            : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800/50'
                        }`}>
                            {feedback.message}
                        </div>
                    )}

                    {user ? (
                        <button
                            onClick={handleSubmit}
                            disabled={selectedOption === null || isSubmitting}
                            className="w-full relative overflow-hidden group bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            {isSubmitting ? 'Verifying...' : 'Submit Answer'}
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <Link
                                href="/login"
                                className="w-full block text-center relative overflow-hidden group bg-indigo-600 dark:bg-indigo-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                Login to Submit
                            </Link>
                            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                                Sign in to save your streak and appear on the leaderboard
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-12 text-center text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                    No Daily Quest available today. Check back later!
                </div>
            )}
        </div>
    );
};