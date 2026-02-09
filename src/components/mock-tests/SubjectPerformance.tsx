// src/components/mock-tests/SubjectPerformance.tsx
"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect, useState } from "react";

type SubjectData = {
    name: string;
    score: number;
};

export const SubjectPerformance = () => {
    const { user } = useAuth();
    const [subjects, setSubjects] = useState<SubjectData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            fetch(`/api/user/subject-performance?userId=${user.uid}`)
                .then(res => res.json())
                .then(data => {
                    setSubjects(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch subject performance:", err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [user]);

    if (!user) return null;

    if (loading) {
        return (
             <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24 animate-pulse">
                <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-3/4 mb-6"></div>
                <div className="space-y-4">
                    {[1,2,3,4].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded"></div>)}
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24 transition-colors">
            <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">Syllabus Completed</h2>
            {subjects.length > 0 ? (
                <div className="space-y-5">
                    {subjects.map(subject => (
                        <div key={subject.name}>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-600 dark:text-slate-300 font-medium">{subject.name}</span>
                                <span className="font-bold text-slate-800 dark:text-white">{subject.score}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                                <div className="bg-indigo-500 dark:bg-indigo-400 h-2 rounded-full transition-all duration-500" style={{ width: `${subject.score}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Attempt a few tests to see your performance breakdown by subject.</p>
                </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                 <h3 className="text-sm font-bold mb-4 text-slate-700 dark:text-slate-200 uppercase tracking-wide">Insights</h3>
                 <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                    {subjects.length > 0 ? (
                        <>
                            <li className="flex items-start gap-3"><span className="text-green-500 mt-0.5 font-bold">✓</span> <span>Keep practicing your strong areas to maintain consistency.</span></li>
                            <li className="flex items-start gap-3"><span className="text-yellow-500 mt-0.5 font-bold">~</span> <span>Identify your weaker subjects and focus on improving them.</span></li>
                            <li className="flex items-start gap-3"><span className="text-blue-500 mt-0.5 font-bold">→</span> <span>Use our topic-wise tests for targeted practice.</span></li>
                        </>
                    ) : (
                         <li>Your insights will appear here once you've completed some tests.</li>
                    )}
                 </ul>
            </div>
        </div>
    );
};