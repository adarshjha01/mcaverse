// src/components/dashboard/ProgressSnapshot.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

type Lecture = { id: string; title: string; youtubeLink: string; };
type Topic = { name: string; lectures: Lecture[]; };
type Subject = { subject: string; topics: Topic[]; };
type Progress = { completed: string[] };

const SUBJECT_COLORS = [
  {
    progress: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-200/60 dark:ring-emerald-500/20",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    progress: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-200/60 dark:ring-amber-500/20",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    progress: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
    ring: "ring-rose-200/60 dark:ring-rose-500/20",
    bg: "bg-rose-50 dark:bg-rose-950/30",
  },
  {
    progress: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-400",
    ring: "ring-sky-200/60 dark:ring-sky-500/20",
    bg: "bg-sky-50 dark:bg-sky-950/30",
  },
  {
    progress: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-400",
    ring: "ring-violet-200/60 dark:ring-violet-500/20",
    bg: "bg-violet-50 dark:bg-violet-950/30",
  },
];

function getMotivation(pct: number): string {
  if (pct === 0) return "Ready to begin your journey? Start watching!";
  if (pct <= 25) return "Great start! Keep the momentum going!";
  if (pct <= 50) return "Solid progress — you're building strong foundations!";
  if (pct <= 75) return "More than halfway! You're crushing it!";
  if (pct < 100) return "Almost there — the final push awaits!";
  return "All lectures completed — incredible work!";
}

const CircularProgress = ({ percentage, size = 80 }: { percentage: number; size?: number }) => {
    const strokeWidth = 7;
    const radius = size / 2 - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
                <circle
                    className="text-slate-200 dark:text-slate-700/50"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className="text-indigo-500 dark:text-indigo-400 transition-all duration-700 ease-out"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                {Math.round(percentage)}%
            </span>
        </div>
    );
};

export const ProgressSnapshot = ({ initialCourseData }: { initialCourseData: Subject[] | null }) => {
    const { user } = useAuth();
    const [completedLectures, setCompletedLectures] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            const fetchProgress = async () => {
                try {
                    const token = await user.getIdToken();
                    const res = await fetch(`/api/video-progress?userId=${user.uid}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    if (!res.ok) {
                        console.error(`Video progress fetch failed: ${res.status}`);
                        return;
                    }
                    const text = await res.text();
                    const progress: Progress = text ? JSON.parse(text) : { completed: [] };
                    if (progress && progress.completed) {
                        setCompletedLectures(new Set(progress.completed));
                    }
                } catch (err) {
                    console.error('Failed to load video progress:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchProgress();
        } else if (!user) {
            setLoading(false);
        }
    }, [user]);

    const { totalLectures, subjectStats } = useMemo(() => {
        if (!initialCourseData || !Array.isArray(initialCourseData)) {
            return { totalLectures: 0, subjectStats: [] };
        }
        
        let total = 0;
        const stats = initialCourseData.map((subject, index) => {
            const subjectTotal = subject.topics.reduce((acc, topic) => acc + topic.lectures.length, 0);
            total += subjectTotal;
            const completed = subject.topics.reduce((acc, topic) =>
                acc + topic.lectures.filter(lec => completedLectures.has(lec.id)).length, 0);
            return { name: subject.subject, completed, total: subjectTotal, colorIndex: index };
        });

        return { totalLectures: total, subjectStats: stats };
    }, [completedLectures, initialCourseData]);

    const overallProgress = totalLectures > 0 ? (completedLectures.size / totalLectures) * 100 : 0;

    if (loading || !initialCourseData) {
         return (
             <div className="bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm animate-pulse h-[160px]">
                <div className="h-full bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
             </div>
        )
    }

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Your Progress</h2>
                <Link href="/videos" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                    Video Lectures &rarr;
                </Link>
            </div>

            {/* Main Stats Card — matches ProgressOverview from video lectures */}
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-sm backdrop-blur-sm">
                {/* Left: Circular Progress + Summary */}
                <div className="flex items-center gap-4 sm:gap-5 pb-5 md:pb-0 md:pr-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700/60">
                    <CircularProgress percentage={overallProgress} size={80} />
                    <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-0.5">
                            Overall Progress
                        </p>
                        <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                            {completedLectures.size}
                            <span className="text-sm sm:text-base font-normal text-slate-400 dark:text-slate-500">
                                {" "}/ {totalLectures}
                            </span>
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 italic hidden sm:block">
                            {getMotivation(overallProgress)}
                        </p>
                    </div>
                </div>

                {/* Right: Per-Subject Stats — same colored cards as video page */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {subjectStats.map((stat) => {
                        const color = SUBJECT_COLORS[stat.colorIndex % SUBJECT_COLORS.length];
                        const pct = stat.total > 0 ? (stat.completed / stat.total) * 100 : 0;
                        return (
                            <div
                                key={stat.name}
                                className={`p-2.5 sm:p-3 rounded-xl ${color.bg} ring-1 ${color.ring} transition-all`}
                            >
                                <p
                                    className={`text-[10px] sm:text-xs font-semibold ${color.text} truncate`}
                                    title={stat.name}
                                >
                                    {stat.name}
                                </p>
                                <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 tabular-nums mt-0.5">
                                    {stat.completed}
                                    <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                                        /{stat.total}
                                    </span>
                                </p>
                                <div className="w-full bg-slate-200/80 dark:bg-slate-700/50 rounded-full h-1.5 mt-1.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ease-out ${color.progress}`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Motivation — mobile only */}
            <p className="text-xs text-center text-slate-400 dark:text-slate-500 italic sm:hidden">
                {getMotivation(overallProgress)}
            </p>
        </div>
    );
};