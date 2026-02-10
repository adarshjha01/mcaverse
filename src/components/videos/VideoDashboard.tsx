// src/components/videos/VideoDashboard.tsx
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { IconChevronDown, IconPlayCircle } from '@/components/ui/Icons';
import { useAuth } from '@/components/auth/AuthProvider';
import { Subject, Topic, Lecture } from '@/app/actions'; // Import types from actions

// --- Icons & UI Components ---
const IconStar = ({ className = "w-5 h-5", filled = false }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const CircularProgressBar = ({ percentage, size = 80 }: { percentage: number, size?: number }) => {
    const radius = (size / 2) - 5;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                {/* Track: light gray in light mode, dark gray in dark mode */}
                <circle
                    className="text-slate-200 dark:text-slate-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className="text-indigo-600 dark:text-indigo-400 transition-all duration-500 ease-out"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </svg>
            {/* Percentage text: dark in light mode, light in dark mode */}
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-700 dark:text-slate-200">
                {Math.round(percentage)}%
            </span>
        </div>
    );
};

// --- Main Dashboard Component ---
export const VideoDashboard = ({ initialCourseData }: { initialCourseData: Subject[] }) => {
    const { user } = useAuth();
    const [openSubjects, setOpenSubjects] = useState<Set<string>>(new Set(initialCourseData[0]?.subject ? [initialCourseData[0].subject] : []));
    const [openTopics, setOpenTopics] = useState<Set<string>>(new Set(initialCourseData[0]?.topics[0]?.name ? [initialCourseData[0].topics[0].name] : []));

    const [completedLectures, setCompletedLectures] = useState<Set<string>>(new Set());
    const [revisionLectures, setRevisionLectures] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (user) {
            fetch(`/api/video-progress?userId=${user.uid}`)
                .then(res => res.json())
                .then((progress) => {
                    setCompletedLectures(new Set(progress.completed || []));
                    setRevisionLectures(new Set(progress.revision || []));
                })
                .catch(err => console.error("Error fetching progress:", err));
        } else {
            setCompletedLectures(new Set());
            setRevisionLectures(new Set());
        }
    }, [user]);

    const { totalLectures, subjectStats } = useMemo(() => {
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

    const updateVideoProgressAPI = async (lectureId: string, type: 'completed' | 'revision', isAdding: boolean) => {
        if (!user) return;
        try {
            await fetch('/api/video-progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid, lectureId, type, isAdding }),
            });
        } catch (error) {
            console.error("Failed to save progress", error);
        }
    };

    const handleToggleLecture = (id: string) => {
        if (!user) {
            alert("Please log in to track your progress.");
            return;
        }
        const newSet = new Set(completedLectures);
        const isAdding = !newSet.has(id);
        if (isAdding) newSet.add(id); else newSet.delete(id);
        setCompletedLectures(newSet);
        updateVideoProgressAPI(id, 'completed', isAdding);
    };

    const handleToggleRevision = (id: string) => {
        if (!user) {
            alert("Please log in to save your revisions.");
            return;
        }
        const newSet = new Set(revisionLectures);
        const isAdding = !newSet.has(id);
        if (isAdding) newSet.add(id); else newSet.delete(id);
        setRevisionLectures(newSet);
        updateVideoProgressAPI(id, 'revision', isAdding);
    };

    const toggleSubject = (subject: string) => setOpenSubjects(prev => {
        const newSet = new Set(prev);
        if (newSet.has(subject)) newSet.delete(subject); else newSet.add(subject);
        return newSet;
    });

    const toggleTopic = (topic: string) => setOpenTopics(prev => {
        const newSet = new Set(prev);
        if (newSet.has(topic)) newSet.delete(topic); else newSet.add(topic);
        return newSet;
    });

    const getSubjectColor = (name: string) => {
        const colors: { [key: string]: string } = {
            "Mathematics": "bg-green-500",
            "Logical Reasoning": "bg-yellow-500",
            "Computer Science": "bg-red-500",
            "English": "bg-blue-500",
        };
        return colors[name] || "bg-indigo-500";
    };

    return (
        <div className="max-w-6xl mx-auto">

            {/* ── Progress Section ── */}
            <div className="
                bg-white dark:bg-slate-800
                p-6 rounded-lg
                border border-slate-200 dark:border-slate-700
                shadow-md mb-8
                flex flex-col md:flex-row items-center gap-8
            ">
                {/* Overall circular progress */}
                <div className="
                    flex items-center gap-4
                    pr-8
                    border-b md:border-b-0 md:border-r
                    border-slate-200 dark:border-slate-700
                    pb-6 md:pb-0
                    w-full md:w-auto
                ">
                    <div className="flex-shrink-0">
                        <CircularProgressBar percentage={overallProgress} />
                    </div>
                    <div className="text-left">
                        {/* Muted label */}
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Total Progress</p>
                        {/* Bold count — inherits foreground color */}
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                            {completedLectures.size} / {totalLectures}
                        </p>
                    </div>
                </div>

                {/* Per-subject stats */}
                <div className="w-full flex-grow grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                    {subjectStats.map(stat => {
                        const subjectProgress = stat.total > 0 ? (stat.completed / stat.total) * 100 : 0;
                        return (
                            <div key={stat.name}>
                                {/* Subject name */}
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    {stat.name}
                                </p>
                                {/* Count + "completed" label */}
                                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                    {stat.completed} / {stat.total}{' '}
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                                        completed
                                    </span>
                                </p>
                                {/* Progress bar track */}
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1">
                                    <div
                                        className={`h-1.5 rounded-full ${getSubjectColor(stat.name)}`}
                                        style={{ width: `${subjectProgress}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Accordion Section ── */}
            <div className="space-y-4">
                {initialCourseData.map(subject => {
                    const isSubjectOpen = openSubjects.has(subject.subject);
                    return (
                        <div
                            key={subject.subject}
                            className="
                                bg-white dark:bg-slate-800
                                rounded-lg
                                border border-slate-200 dark:border-slate-700
                                shadow-sm
                            "
                        >
                            {/* Subject header button */}
                            <button
                                onClick={() => toggleSubject(subject.subject)}
                                className="w-full flex justify-between items-center p-4 text-left"
                            >
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                    {subject.subject}
                                </h2>
                                <IconChevronDown
                                    className={`transition-transform text-slate-500 dark:text-slate-400 ${isSubjectOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {isSubjectOpen && (
                                <div className="px-4 pb-4 space-y-2">
                                    {subject.topics.map(topic => {
                                        const isTopicOpen = openTopics.has(topic.name);
                                        return (
                                            <div
                                                key={topic.name}
                                                className="
                                                    bg-slate-50 dark:bg-slate-900
                                                    rounded-md
                                                    border border-slate-200 dark:border-slate-700
                                                "
                                            >
                                                {/* Topic header button */}
                                                <button
                                                    onClick={() => toggleTopic(topic.name)}
                                                    className="w-full flex justify-between items-center p-3 text-left"
                                                >
                                                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                                                        {topic.name}
                                                    </h3>
                                                    <IconChevronDown
                                                        className={`transition-transform text-slate-500 dark:text-slate-400 ${isTopicOpen ? 'rotate-180' : ''}`}
                                                    />
                                                </button>

                                                {isTopicOpen && (
                                                    <div className="px-3 pb-3">
                                                        {topic.lectures.length > 0 ? (
                                                            <table className="w-full text-sm text-left table-fixed">
                                                                <thead>
                                                                    <tr>
                                                                        {/* Table header labels — muted but readable in both modes */}
                                                                        <th className="py-2 px-2 w-16 text-xs uppercase text-slate-500 dark:text-slate-400">
                                                                            Status
                                                                        </th>
                                                                        <th className="py-2 px-2 text-xs uppercase text-slate-500 dark:text-slate-400">
                                                                            Title
                                                                        </th>
                                                                        <th className="py-2 px-2 w-24 text-center text-xs uppercase text-slate-500 dark:text-slate-400">
                                                                            Watch
                                                                        </th>
                                                                        <th className="py-2 px-2 w-24 text-center text-xs uppercase text-slate-500 dark:text-slate-400">
                                                                            Revise
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {topic.lectures.map(lecture => (
                                                                        <tr
                                                                            key={lecture.id}
                                                                            className="border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                                                                        >
                                                                            {/* Checkbox */}
                                                                            <td className="py-2 px-2">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={completedLectures.has(lecture.id)}
                                                                                    onChange={() => handleToggleLecture(lecture.id)}
                                                                                    className="
                                                                                        w-4 h-4 cursor-pointer rounded
                                                                                        text-indigo-600
                                                                                        bg-slate-100 dark:bg-slate-700
                                                                                        border-slate-300 dark:border-slate-600
                                                                                        focus:ring-indigo-500 dark:focus:ring-indigo-400
                                                                                    "
                                                                                />
                                                                            </td>

                                                                            {/* Lecture title */}
                                                                            <td className={`py-2 px-2 truncate ${
                                                                                completedLectures.has(lecture.id)
                                                                                    ? 'line-through text-slate-400 dark:text-slate-500'
                                                                                    : 'text-slate-700 dark:text-slate-200'
                                                                            }`}>
                                                                                {lecture.title}
                                                                            </td>

                                                                            {/* Watch link */}
                                                                            <td className="py-2 px-2">
                                                                                <a
                                                                                    href={lecture.youtubeLink}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 flex justify-center"
                                                                                >
                                                                                    <IconPlayCircle />
                                                                                </a>
                                                                            </td>

                                                                            {/* Revision star */}
                                                                            <td className="py-2 px-2">
                                                                                <button
                                                                                    onClick={() => handleToggleRevision(lecture.id)}
                                                                                    className={`w-full flex justify-center hover:text-yellow-500 dark:hover:text-yellow-400 ${
                                                                                        revisionLectures.has(lecture.id)
                                                                                            ? 'text-yellow-400 dark:text-yellow-300'
                                                                                            : 'text-slate-300 dark:text-slate-600'
                                                                                    }`}
                                                                                >
                                                                                    <IconStar filled={revisionLectures.has(lecture.id)} />
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        ) : (
                                                            /* Empty state */
                                                            <div className="text-center py-4 text-slate-400 dark:text-slate-500 italic">
                                                                Playlist coming soon...
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
