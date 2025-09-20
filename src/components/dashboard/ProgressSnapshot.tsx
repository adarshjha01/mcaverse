// src/components/dashboard/ProgressSnapshot.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

// --- Type Definitions ---
type Lecture = { id: string; title: string; youtubeLink: string; };
type Topic = { name: string; lectures: Lecture[]; };
type Subject = { subject: string; topics: Topic[]; };
type Progress = { completed: string[] };

// --- Circular Progress Bar Component ---
const CircularProgressBar = ({ percentage, size = 80 }: { percentage: number, size?: number }) => {
    const radius = (size / 2) - 5;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                <circle className="text-slate-200" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx={size/2} cy={size/2} />
                <circle
                    className="text-orange-500"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size/2}
                    cy={size/2}
                    transform={`rotate(-90 ${size/2} ${size/2})`}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-700">{Math.round(percentage)}%</span>
        </div>
    );
};

export const ProgressSnapshot = ({ initialCourseData }: { initialCourseData: Subject[] | null }) => {
    const { user } = useAuth();
    const [completedLectures, setCompletedLectures] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetch(`/api/video-progress?userId=${user.uid}`)
                .then(res => res.json())
                .then((progress: Progress) => {
                    if (progress && progress.completed) {
                        setCompletedLectures(new Set(progress.completed));
                    }
                }).finally(() => setLoading(false));
        } else if (!user) {
            setLoading(false);
        }
    }, [user]);

    const { totalLectures, subjectStats } = useMemo(() => {
        if (!initialCourseData || !Array.isArray(initialCourseData)) {
            return { totalLectures: 0, subjectStats: [] };
        }
        
        let total = 0;
        const stats = initialCourseData.map(subject => {
            const subjectTotal = subject.topics.reduce((acc, topic) => acc + topic.lectures.length, 0);
            total += subjectTotal;
            const completed = subject.topics.reduce((acc, topic) =>
                acc + topic.lectures.filter(lec => completedLectures.has(lec.id)).length, 0);
            return { name: subject.subject, completed, total: subjectTotal };
        });

        return { totalLectures: total, subjectStats: stats };
    }, [completedLectures, initialCourseData]);

    const overallProgress = totalLectures > 0 ? (completedLectures.size / totalLectures) * 100 : 0;
    
    const subjectColors: { [key: string]: string } = {
        "Mathematics": "bg-green-500",
        "Analytical Ability & Logical Reasoning": "bg-yellow-500",
        "Computer Awareness": "bg-red-500",
        "English": "bg-blue-500",
    };

    if (loading || !initialCourseData) {
         return (
             <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm animate-pulse h-[144px]">
                <div className="h-full bg-slate-100 rounded"></div>
             </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-md">
             <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex items-center gap-4 pr-8 border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 w-full md:w-auto">
                    <div className="flex-shrink-0">
                        <CircularProgressBar percentage={overallProgress} />
                    </div>
                    <div className="text-left">
                        <p className="text-slate-500 text-sm">Total Progress</p>
                        <p className="text-3xl font-bold">{completedLectures.size} / {totalLectures}</p>
                    </div>
                </div>
                <div className="w-full flex-grow grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                    {subjectStats.map(stat => {
                        const subjectProgress = stat.total > 0 ? (stat.completed / stat.total) * 100 : 0;
                        return (
                            <div key={stat.name}>
                                <p className="text-sm font-semibold text-slate-700">{stat.name}</p>
                                <p className="text-lg font-bold text-slate-800">{stat.completed} / {stat.total} <span className="text-xs text-slate-500 font-normal">completed</span></p>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                                    <div className={`h-1.5 rounded-full ${subjectColors[stat.name] || 'bg-gray-400'}`} style={{ width: `${subjectProgress}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};