"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect, useState, useMemo } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

type SubjectData = {
    name: string;
    score: number;
};

// Added type for the history API data
type TestAttempt = {
    correctCount: number;
    totalAttempted: number;
};

export const SubjectPerformance = () => {
    const { user } = useAuth();
    const [subjects, setSubjects] = useState<SubjectData[]>([]);
    const [attempts, setAttempts] = useState<TestAttempt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            
            // Fetch BOTH APIs at the exact same time
            Promise.all([
                fetch(`/api/user/subject-performance?userId=${user.uid}`).then(res => res.json()),
                fetch(`/api/mock-tests/history?userId=${user.uid}`).then(res => res.json())
            ])
            .then(([subjectData, historyData]) => {
                // Safely set subject data
                if (Array.isArray(subjectData)) setSubjects(subjectData);
                else setSubjects([]);

                // Safely set history data
                if (Array.isArray(historyData)) setAttempts(historyData);
                else setAttempts([]);
                
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch performance data:", err);
                setSubjects([]);
                setAttempts([]);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [user]);

    // Calculate TRUE overall accuracy using the history data
    const accuracyData = useMemo(() => {
        if (!Array.isArray(attempts) || attempts.length === 0) {
            return { percentage: 0, fill: "#6366f1" }; // Default Indigo
        }

        let totalCorrect = 0;
        let totalAttempted = 0;

        // Sum up every single question they have ever answered
        attempts.forEach(attempt => {
            totalCorrect += (attempt.correctCount || 0);
            totalAttempted += (attempt.totalAttempted || 0);
        });

        // Calculate the true percentage
        const percentage = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
        
        // Dynamic coloring
        let fill = "#6366f1"; // Indigo
        if (percentage >= 80) fill = "#10b981"; // Emerald
        else if (percentage >= 50) fill = "#f59e0b"; // Amber
        else fill = "#ef4444"; // Red

        return { percentage, fill };
    }, [attempts]);

    if (!user) return null;

    if (loading) {
        return (
             <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24 animate-pulse">
                <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-3/4 mb-6"></div>
                <div className="mx-auto aspect-square w-48 bg-slate-100 dark:bg-slate-800 rounded-full mb-6"></div>
                <div className="space-y-4">
                    {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded"></div>)}
                </div>
            </div>
        );
    }
    
    const hasHistoryData = Array.isArray(attempts) && attempts.length > 0;
    const hasSubjectData = Array.isArray(subjects) && subjects.length > 0;
    
    return (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24 transition-colors">
            <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white text-center">Overall Accuracy</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">Your win-rate across all mock tests</p>

            <div className="h-[220px] w-full mb-8 relative flex items-center justify-center">
                {hasHistoryData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart 
                            cx="50%" 
                            cy="50%" 
                            innerRadius="75%" 
                            outerRadius="100%" 
                            barSize={24} 
                            data={[{ name: "Accuracy", value: accuracyData.percentage, fill: accuracyData.fill }]} 
                            startAngle={90} 
                            endAngle={-270}
                        >
                            <PolarAngleAxis 
                                type="number" 
                                domain={[0, 100]} 
                                angleAxisId={0} 
                                tick={false} 
                            />
                            <RadialBar
                                background={{ fill: 'rgba(148, 163, 184, 0.15)' }} 
                                dataKey="value"
                                cornerRadius={12}
                            />
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                                <tspan x="50%" dy="-5" className="text-4xl font-bold fill-slate-800 dark:fill-white">
                                    {accuracyData.percentage}%
                                </tspan>
                                <tspan x="50%" dy="25" className="text-xs font-medium fill-slate-500 dark:fill-slate-400">
                                    Average Score
                                </tspan>
                            </text>
                        </RadialBarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-48 w-48 flex items-center justify-center rounded-full border-8 border-slate-100 dark:border-slate-800">
                         <p className="text-slate-400 text-sm font-medium">No tests yet</p>
                    </div>
                )}
            </div>

            <h3 className="text-sm font-bold mb-4 text-slate-700 dark:text-slate-200 uppercase tracking-wide">Subject Breakdown</h3>
            {hasSubjectData ? (
                <div className="space-y-5">
                    {subjects.map(subject => (
                        <div key={subject.name}>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-600 dark:text-slate-300 font-medium">{subject.name}</span>
                                <span className="font-bold text-slate-800 dark:text-white">{subject.score}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div 
                                    className="h-full rounded-full transition-all duration-1000 ease-out" 
                                    style={{ 
                                        width: `${subject.score}%`,
                                        backgroundColor: subject.score >= 80 ? '#10b981' : subject.score >= 50 ? '#f59e0b' : '#ef4444'
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Attempt tests to unlock insights.</p>
                </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                 <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                    {hasHistoryData ? (
                        <>
                            {accuracyData.percentage >= 80 ? (
                                <li className="flex items-start gap-3"><span className="text-green-500 font-bold">✓</span> <span>Outstanding accuracy! You are well prepared for the exam.</span></li>
                            ) : accuracyData.percentage >= 50 ? (
                                <li className="flex items-start gap-3"><span className="text-yellow-500 font-bold">~</span> <span>Good effort. Focus on your weaker subjects to push past 80%.</span></li>
                            ) : (
                                <li className="flex items-start gap-3"><span className="text-red-500 font-bold">!</span> <span>Review the fundamentals and take more topic-wise tests.</span></li>
                            )}
                        </>
                    ) : (
                        <li className="flex items-start gap-3"><span className="text-indigo-500 font-bold">→</span> <span>Your AI insights will appear here once you've completed some tests.</span></li>
                    )}
                 </ul>
            </div>
        </div>
    );
};