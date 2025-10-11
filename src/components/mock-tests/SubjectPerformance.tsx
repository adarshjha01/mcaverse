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

    // If user is not logged in, don't render anything
    if (!user) {
        return null;
    }

    if (loading) {
        return (
             <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-md sticky top-24 animate-pulse">
                <div className="h-8 bg-slate-200 rounded w-3/4 mb-6"></div>
                <div className="space-y-4">
                    <div className="h-10 bg-slate-200 rounded"></div>
                    <div className="h-10 bg-slate-200 rounded"></div>
                    <div className="h-10 bg-slate-200 rounded"></div>
                    <div className="h-10 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-md sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Subject Performance</h2>
            {subjects.length > 0 ? (
                <div className="space-y-4">
                    {subjects.map(subject => (
                        <div key={subject.name}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">{subject.name}</span>
                                <span className="font-semibold">{subject.score}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${subject.score}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-10">
                    <p className="text-slate-500 text-sm">Attempt a few tests to see your performance breakdown by subject.</p>
                </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-slate-200">
                 <h3 className="text-lg font-bold mb-4">Performance Insights</h3>
                 <ul className="space-y-3 text-sm text-slate-500">
                    {subjects.length > 0 ? (
                        <>
                            <li className="flex items-start gap-3"><span className="text-green-500 mt-1">✓</span> <span>Keep practicing your strong areas to maintain consistency.</span></li>
                            <li className="flex items-start gap-3"><span className="text-yellow-500 mt-1">~</span> <span>Identify your weaker subjects and focus on improving them.</span></li>
                            <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">→</span> <span>Use our topic-wise tests for targeted practice.</span></li>
                        </>
                    ) : (
                         <li>Your insights will appear here once you've completed some tests.</li>
                    )}
                 </ul>
            </div>
        </div>
    );
};
