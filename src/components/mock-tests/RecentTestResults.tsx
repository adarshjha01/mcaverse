// src/components/mock-tests/RecentTestResults.tsx
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { IconBarChart, IconRefreshCw } from '@/components/ui/Icons';

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
            console.log("Frontend: Fetching results for userId:", user.uid);

            const fetchResults = async () => {
                try {
                    const token = await user.getIdToken();
                    const res = await fetch(`/api/mock-tests/recent-attempts?userId=${user.uid}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    if (!res.ok) {
                        console.error(`Failed to fetch recent results: ${res.status}`);
                        return;
                    }
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
        return <div className="text-center text-slate-500 dark:text-slate-400 py-10">Loading recent results...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Recent Test Results</h2>
                <Link href="/mock-tests/history" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">View All</Link>
            </div>
            <div className="space-y-6">
                {results.length > 0 ? (
                    results.map(result => (
                        <div key={result.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{result.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Attempted on {new Date(result.submittedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-left md:text-right bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{result.score}</p>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Score</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg text-center">
                                    <p className="text-xl font-semibold text-slate-800 dark:text-slate-200">{result.totalAttempted}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Attempted</p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-lg text-center">
                                    <p className="text-xl font-semibold text-green-600 dark:text-green-400">{result.correctCount}</p>
                                    <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">Correct</p>
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg text-center">
                                    <p className="text-xl font-semibold text-red-500 dark:text-red-400">{result.incorrectCount}</p>
                                    <p className="text-xs text-red-500/80 dark:text-red-400/80 mt-1">Incorrect</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <Link href={`/mock-tests/take/${result.testId}/results/${result.id}`} className="flex-1 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <IconBarChart className="w-4 h-4" /> Analysis
                                </Link>
                                <Link href={`/mock-tests/take/${result.testId}`} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                                    <IconRefreshCw className="w-4 h-4" /> Retake
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                        <p className="text-slate-500 dark:text-slate-400">You have not attempted any tests yet.</p>
                        <Link href="/mock-tests" className="inline-block mt-4 text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                            Start a Mock Test
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};