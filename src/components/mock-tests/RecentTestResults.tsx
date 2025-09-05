// src/components/mock-tests/RecentTestResults.tsx
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { IconBarChart, IconRefreshCw } from '@/components/ui/Icons';

// Define a type for the structure of a test result
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

    // Fetch data when the component mounts or the user changes
    useEffect(() => {
        if (user) {
            setLoading(true);
            
            // --- ADD THIS LOG ---
            console.log("Frontend: Fetching results for userId:", user.uid);

            fetch(`/api/mock-tests/recent-attempts?userId=${user.uid}`)
                .then(res => res.json())
                .then(data => {
                    setResults(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch recent results:", err);
                    setLoading(false);
                });
        } else {
            // If no user, stop loading and show the empty state
            setLoading(false);
            setResults([]);
        }
    }, [user]);

    // ... rest of the component is unchanged
    if (loading) {
        return <div className="text-center text-slate-500">Loading recent results...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Recent Test Results</h2>
                <Link href="/mock-tests/history" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View All</Link>
            </div>
            <div className="space-y-6">
                {results.length > 0 ? (
                    results.map(result => (
                        <div key={result.id} className="bg-white p-6 rounded-lg border border-slate-200 shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold">{result.title}</h3>
                                    <p className="text-sm text-slate-500">
                                        {new Date(result.submittedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-green-600">{result.score}</p>
                                    <p className="text-sm text-slate-500">Score</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 text-center mb-4">
                                <div><p className="text-2xl font-semibold">{result.totalAttempted}</p><p className="text-xs text-slate-500">Attempted</p></div>
                                <div><p className="text-2xl font-semibold text-green-600">{result.correctCount}</p><p className="text-xs text-slate-500">Correct</p></div>
                                <div><p className="text-2xl font-semibold text-red-500">{result.incorrectCount}</p><p className="text-xs text-slate-500">Incorrect</p></div>
                            </div>
                            <div className="flex gap-4">
                                <Link href={`/mock-tests/take/${result.testId}/results/${result.id}`} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-300">
                                    <IconBarChart /> Detailed Analysis
                                </Link>
                                <Link href={`/mock-tests/take/${result.testId}`} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-300">
                                    <IconRefreshCw /> Retake Test
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-slate-50 rounded-lg">
                        <p className="text-slate-500">You have not attempted any tests yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};