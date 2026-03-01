// src/components/mock-tests/RecentTestResults.tsx
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { IconBarChart, IconRefreshCw, IconClock, IconArrowRight } from '@/components/ui/Icons';

type TestResult = {
    id: string;
    testId: string;
    title: string;
    score: number;
    totalAttempted: number;
    correctCount: number;
    incorrectCount: number;
    submittedAt: string;
};

export const RecentTestResults = () => {
    const { user } = useAuth();
    const [results, setResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const fetchResults = async () => {
                try {
                    const token = await user.getIdToken();
                    const res = await fetch(`/api/mock-tests/recent-attempts?userId=${user.uid}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    if (!res.ok) return;
                    const data = await res.json();
                    setResults(data);
                } catch (err) {
                    console.error("Failed to fetch recent results:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchResults();
        } else {
            setLoading(false);
            setResults([]);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-48 animate-pulse" />
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-20 animate-pulse" />
                </div>
                {[1, 2].map(i => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse">
                        <div className="flex justify-between mb-5">
                            <div className="space-y-2">
                                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-44" />
                                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-28" />
                            </div>
                            <div className="h-12 w-14 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-5">
                            {[1, 2, 3].map(j => <div key={j} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl" />)}
                        </div>
                        <div className="flex gap-3">
                            <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex-1" />
                            <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex-1" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Recent Test Results</h2>
                <Link href="/mock-tests/history" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                    View All <IconArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
            <div className="space-y-4">
                {results.length > 0 ? (
                    results.map(result => {
                        const accuracy = result.totalAttempted > 0
                            ? Math.round((result.correctCount / result.totalAttempted) * 100)
                            : 0;
                        
                        return (
                            <div key={result.id} className="group bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{result.title}</h3>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <IconClock className="w-3.5 h-3.5 text-slate-400" />
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {new Date(result.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="text-center bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{result.score}</p>
                                            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Score</p>
                                        </div>
                                        <div className="text-center bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <p className={`text-xl font-bold ${accuracy >= 70 ? 'text-emerald-600 dark:text-emerald-400' : accuracy >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'}`}>{accuracy}%</p>
                                            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Accuracy</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-3 mb-5">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl text-center border border-slate-100 dark:border-slate-700/50">
                                        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{result.totalAttempted}</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Attempted</p>
                                    </div>
                                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-2.5 rounded-xl text-center border border-emerald-100 dark:border-emerald-800/30">
                                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{result.correctCount}</p>
                                        <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">Correct</p>
                                    </div>
                                    <div className="bg-red-50 dark:bg-red-900/10 p-2.5 rounded-xl text-center border border-red-100 dark:border-red-800/30">
                                        <p className="text-lg font-bold text-red-500 dark:text-red-400">{result.incorrectCount}</p>
                                        <p className="text-[10px] text-red-500/80 dark:text-red-400/80 font-medium">Incorrect</p>
                                    </div>
                                </div>

                                {/* Accuracy bar */}
                                <div className="mb-5">
                                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ease-out ${accuracy >= 70 ? 'bg-emerald-500' : accuracy >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                            style={{ width: `${accuracy}%` }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex gap-3">
                                    <Link href={`/mock-tests/take/${result.testId}/results/${result.id}`} className="flex-1 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 shadow-sm text-sm">
                                        <IconBarChart className="w-4 h-4" /> Analysis
                                    </Link>
                                    <Link href={`/mock-tests/take/${result.testId}`} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm text-sm">
                                        <IconRefreshCw className="w-4 h-4" /> Retake
                                    </Link>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-14 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <IconClock className="w-6 h-6 text-slate-400" />
                        </div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">No Tests Attempted Yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Start a mock test to see your results here.</p>
                        <Link href="/mock-tests" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm">
                            Start a Mock Test
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};