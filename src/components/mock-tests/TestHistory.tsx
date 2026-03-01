// src/components/mock-tests/TestHistory.tsx
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

export const TestHistory = () => {
    const { user } = useAuth();
    const [results, setResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchHistory = async () => {
                try {
                    const token = await user.getIdToken();
                    const res = await fetch(`/api/mock-tests/history?userId=${user.uid}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    const data = await res.json();
                    setResults(data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchHistory();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <div className="text-center">Loading test history...</div>;
    }

    return (
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
                <p className="text-slate-500 text-center">You have not attempted any tests yet.</p>
            )}
        </div>
    );
};