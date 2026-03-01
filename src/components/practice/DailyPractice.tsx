// src/components/practice/DailyPractice.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { IconFlame, IconCheck, IconX } from '@/components/ui/Icons';
import { LatexText } from '@/components/ui/LatexText';
import Link from 'next/link';
import confetti from 'canvas-confetti';

type DailyQuestion = {
    id: string;
    question_text: string;
    options: string[];
    subject?: string;
    difficulty?: string;
};

export const DailyPractice = ({ onStreakUpdate }: { onStreakUpdate?: () => void }) => {
    const { user } = useAuth();
    const [question, setQuestion] = useState<DailyQuestion | null>(null);
    const [hasSolved, setHasSolved] = useState(false);
    const [wasCorrect, setWasCorrect] = useState(false);
    const [streak, setStreak] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [wrongOptions, setWrongOptions] = useState<Set<number>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'retry', message: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [shakeOption, setShakeOption] = useState<number | null>(null);

    const fetchDaily = useCallback(async () => {
        const userIdParam = user ? `?userId=${user.uid}` : '';
        try {
            const res = await fetch(`/api/dpp/daily-question${userIdParam}`);
            if (!res.ok) {
                console.error(`Failed to fetch daily question: ${res.status}`);
                return;
            }
            const data = await res.json();

            if (data.question) {
                setQuestion(data.question);
                setHasSolved(data.hasSolved);
                setWasCorrect(data.wasCorrect);
                setStreak(data.streak);
                setAttempts(data.attempts || 0);
            }
        } catch (err) {
            console.error("Failed to load Daily Quest", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchDaily();
    }, [fetchDaily]);

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
            if (!res.ok) {
                throw new Error(`Submit failed: ${res.status}`);
            }
            const data = await res.json();
            setStreak(data.newStreak);
            setAttempts(data.attempts || attempts + 1);

            if (data.isCorrect) {
                setHasSolved(true);
                setWasCorrect(true);
                setFeedback({ type: 'success', message: `Correct! Streak: ${data.newStreak} day${data.newStreak !== 1 ? 's' : ''} 🔥` });
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#6366f1', '#f59e0b', '#10b981', '#ef4444']
                });
                // Notify parent to refresh leaderboard
                onStreakUpdate?.();
            } else {
                // Wrong answer — mark this option as wrong, let user retry
                setWrongOptions(prev => new Set(prev).add(selectedOption));
                setShakeOption(selectedOption);
                setTimeout(() => setShakeOption(null), 600);
                setSelectedOption(null);
                setFeedback({
                    type: 'retry',
                    message: `Not quite! Try again — your streak is safe. (Attempt ${data.attempts || attempts + 1})`
                });
            }
        } catch (err) {
            setFeedback({ type: 'error', message: "Something went wrong. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading skeleton
    if (loading) return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="animate-pulse space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-32" />
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-full w-16" />
                </div>
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="space-y-3 mt-6">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                    ))}
                </div>
                <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-xl mt-4" />
            </div>
        </div>
    );

    // Solved state — shown only when user got the correct answer
    if (hasSolved && wasCorrect) return (
        <div className="relative overflow-hidden rounded-2xl shadow-lg">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]" />

            <div className="relative p-8 sm:p-10 text-center text-white">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-5 ring-4 ring-white/10">
                    <IconCheck className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-extrabold mb-2">Quest Complete!</h2>
                <p className="text-emerald-100 text-lg mb-6">
                    Solved in {attempts} attempt{attempts !== 1 ? 's' : ''}. You&apos;re on fire!
                </p>

                {/* Streak badge */}
                <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                    <IconFlame className="w-7 h-7 text-orange-300 drop-shadow" />
                    <div className="text-left">
                        <p className="text-2xl font-extrabold leading-tight">{streak}</p>
                        <p className="text-xs text-emerald-100 uppercase tracking-wider font-medium">Day Streak</p>
                    </div>
                </div>

                <p className="mt-8 text-sm text-emerald-200/80">
                    Come back tomorrow to keep your streak alive!
                </p>
            </div>
        </div>
    );

    // Main question UI
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden transition-colors">
            {/* Header bar */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="text-xl">⚔️</span>
                    <div>
                        <h2 className="font-bold text-white text-base">Daily Quest</h2>
                        {question?.subject && (
                            <p className="text-indigo-200 text-xs mt-0.5">{question.subject}{question.difficulty ? ` • ${question.difficulty}` : ''}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {attempts > 0 && !wasCorrect && (
                        <span className="text-xs text-indigo-200 bg-indigo-500/30 px-2.5 py-1 rounded-full font-medium">
                            Attempt {attempts}
                        </span>
                    )}
                    {user && (
                        <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-bold border border-white/10">
                            <IconFlame className={`w-4 h-4 ${streak > 0 ? 'text-orange-400' : 'text-white/50'}`} />
                            <span>{streak}</span>
                        </div>
                    )}
                </div>
            </div>

            {question ? (
                <div className="p-6 sm:p-8">
                    {/* Question text */}
                    <div className="text-slate-800 dark:text-slate-200 font-medium text-lg mb-8 leading-relaxed">
                        <LatexText text={question.question_text} />
                    </div>

                    {/* Options */}
                    <div className="space-y-3 mb-6">
                        {question.options.map((option, idx) => {
                            const isSelected = selectedOption === idx;
                            const isWrong = wrongOptions.has(idx);
                            const isShaking = shakeOption === idx;
                            const isDisabled = isWrong;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => !isDisabled && setSelectedOption(idx)}
                                    disabled={isDisabled}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group flex items-start
                                        ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}
                                        ${isWrong
                                            ? 'border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-900/10 opacity-60 cursor-not-allowed'
                                            : isSelected
                                                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100 shadow-sm'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                                        }`}
                                >
                                    <span className={`flex-shrink-0 w-7 h-7 rounded-full border text-xs font-bold flex items-center justify-center mr-4 mt-0.5 transition-colors
                                        ${isWrong
                                            ? 'border-red-400 bg-red-100 dark:bg-red-900/30 text-red-500'
                                            : isSelected
                                                ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-600 dark:bg-indigo-500 text-white'
                                                : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 group-hover:border-indigo-400'
                                        }`}>
                                        {isWrong ? <IconX className="w-3.5 h-3.5" /> : String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className={`leading-relaxed ${isWrong ? 'line-through text-red-400 dark:text-red-500' : ''}`}>
                                        <LatexText text={option} />
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Feedback banner */}
                    {feedback && (
                        <div className={`p-4 rounded-xl mb-6 text-center text-sm font-semibold flex items-center justify-center gap-2
                            ${feedback.type === 'success'
                                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                                : feedback.type === 'retry'
                                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'
                                    : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50'
                            }`}>
                            {feedback.type === 'retry' && <span className="text-lg">💡</span>}
                            {feedback.message}
                        </div>
                    )}

                    {/* Submit / Login */}
                    {user ? (
                        <button
                            onClick={handleSubmit}
                            disabled={selectedOption === null || isSubmitting}
                            className="w-full relative overflow-hidden group bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                    Verifying...
                                </span>
                            ) : wrongOptions.size > 0 ? 'Try Again' : 'Submit Answer'}
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <Link
                                href="/login"
                                className="w-full block text-center relative overflow-hidden group bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
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
                    <span className="text-4xl mb-4 block">🧘</span>
                    <p className="font-medium">No Daily Quest available today.</p>
                    <p className="text-sm mt-1">Check back later!</p>
                </div>
            )}
        </div>
    );
};