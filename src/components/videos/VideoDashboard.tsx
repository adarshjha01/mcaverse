// src/components/videos/VideoDashboard.tsx
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { IconChevronDown, IconPlayCircle } from '@/components/ui/Icons';
import { useAuth } from '@/components/auth/AuthProvider';
import { Subject, Topic, Lecture } from '@/app/actions';

// --- Icons & UI Components ---
const IconStar = ({ className = "w-5 h-5", filled = false }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const IconSearch = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
);

const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconX = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

/** Extract YouTube video ID from various URL formats */
const extractVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtu\.be\/|(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
    return match ? match[1] : null;
};

const CircularProgressBar = ({ percentage, size = 80 }: { percentage: number, size?: number }) => {
    const radius = (size / 2) - 5;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
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
    const [searchQuery, setSearchQuery] = useState("");
    const [nowPlaying, setNowPlaying] = useState<{ id: string; title: string; videoId: string } | null>(null);
    const playerRef = React.useRef<HTMLDivElement>(null);

    const handlePlay = useCallback((lecture: Lecture) => {
        const videoId = extractVideoId(lecture.youtubeLink);
        if (videoId) {
            setNowPlaying({ id: lecture.id, title: lecture.title, videoId });
            // Scroll to player after a tick
            setTimeout(() => playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
    }, []);

    useEffect(() => {
        if (user) {
            const fetchProgress = async () => {
                try {
                    const token = await user.getIdToken();
                    const res = await fetch(`/api/video-progress?userId=${user.uid}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    const progress = await res.json();
                    setCompletedLectures(new Set(progress.completed || []));
                    setRevisionLectures(new Set(progress.revision || []));
                } catch (err) {
                    console.error("Error fetching progress:", err);
                }
            };
            fetchProgress();
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

    // --- Search filtering ---
    const filteredCourseData = useMemo(() => {
        if (!searchQuery.trim()) return initialCourseData;
        const q = searchQuery.toLowerCase();
        return initialCourseData.map(subject => ({
            ...subject,
            topics: subject.topics.map(topic => ({
                ...topic,
                lectures: topic.lectures.filter(lec => lec.title.toLowerCase().includes(q)),
            })).filter(topic => topic.lectures.length > 0),
        })).filter(subject => subject.topics.length > 0);
    }, [initialCourseData, searchQuery]);

    // Auto-expand subjects/topics when searching
    useEffect(() => {
        if (searchQuery.trim()) {
            const subjectNames = new Set(filteredCourseData.map(s => s.subject));
            const topicNames = new Set(filteredCourseData.flatMap(s => s.topics.map(t => t.name)));
            setOpenSubjects(subjectNames);
            setOpenTopics(topicNames);
        }
    }, [searchQuery, filteredCourseData]);

    const updateVideoProgressAPI = async (lectureId: string, type: 'completed' | 'revision', isAdding: boolean) => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            await fetch('/api/video-progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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

    const allSubjectNames = initialCourseData.map(s => s.subject);
    const allTopicNames = initialCourseData.flatMap(s => s.topics.map(t => t.name));
    const allExpanded = allSubjectNames.every(s => openSubjects.has(s)) && allTopicNames.every(t => openTopics.has(t));

    const handleExpandCollapseAll = useCallback(() => {
        if (allExpanded) {
            setOpenSubjects(new Set());
            setOpenTopics(new Set());
        } else {
            setOpenSubjects(new Set(allSubjectNames));
            setOpenTopics(new Set(allTopicNames));
        }
    }, [allExpanded, allSubjectNames, allTopicNames]);

    const getTopicProgress = useCallback((topic: Topic) => {
        const total = topic.lectures.length;
        const done = topic.lectures.filter(lec => completedLectures.has(lec.id)).length;
        return { done, total };
    }, [completedLectures]);

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

            {/* ── Progress Section (only when logged in) ── */}
            {user && <div className="
                bg-white dark:bg-slate-800
                p-6 rounded-lg
                border border-slate-200 dark:border-slate-700
                shadow-md mb-6
                flex flex-col md:flex-row items-center gap-8
            ">
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
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Total Progress</p>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                            {completedLectures.size} / {totalLectures}
                        </p>
                    </div>
                </div>

                <div className="w-full flex-grow grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                    {subjectStats.map(stat => {
                        const subjectProgress = stat.total > 0 ? (stat.completed / stat.total) * 100 : 0;
                        return (
                            <div key={stat.name}>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    {stat.name}
                                </p>
                                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                    {stat.completed} / {stat.total}{' '}
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                                        completed
                                    </span>
                                </p>
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
            </div>}

            {/* ── Inline Video Player ── */}
            {nowPlaying && (
                <div ref={playerRef} className="mb-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black shadow-lg">
                    {/* Player header */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 dark:bg-slate-800">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                            <p className="text-sm font-medium text-white truncate">
                                {nowPlaying.title}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                            <a
                                href={`https://www.youtube.com/watch?v=${nowPlaying.videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-slate-400 hover:text-white transition-colors"
                                title="Open on YouTube"
                            >
                                YouTube ↗
                            </a>
                            <button
                                onClick={() => setNowPlaying(null)}
                                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                aria-label="Close player"
                            >
                                <IconX className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    {/* 16:9 responsive iframe */}
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                            key={nowPlaying.videoId}
                            className="absolute inset-0 w-full h-full"
                            src={`https://www.youtube-nocookie.com/embed/${nowPlaying.videoId}?autoplay=1&rel=0&modestbranding=1`}
                            title={nowPlaying.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            )}

            {/* ── Search & Controls ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-grow">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search lectures..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs"
                        >
                            ✕
                        </button>
                    )}
                </div>
                <button
                    onClick={handleExpandCollapseAll}
                    className="flex-shrink-0 px-4 py-2.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                    {allExpanded ? "Collapse All" : "Expand All"}
                </button>
            </div>

            {/* ── Search results count ── */}
            {searchQuery.trim() && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    Found {filteredCourseData.reduce((acc, s) => acc + s.topics.reduce((a, t) => a + t.lectures.length, 0), 0)} lecture(s) matching &ldquo;{searchQuery}&rdquo;
                </p>
            )}

            {/* ── Accordion Section ── */}
            <div className="space-y-4">
                {filteredCourseData.map(subject => {
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
                            <button
                                onClick={() => toggleSubject(subject.subject)}
                                className="w-full flex justify-between items-center p-4 text-left gap-3"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 truncate">
                                        {subject.subject}
                                    </h2>
                                </div>
                                <IconChevronDown
                                    className={`flex-shrink-0 transition-transform text-slate-500 dark:text-slate-400 ${isSubjectOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {isSubjectOpen && (
                                <div className="px-4 pb-4 space-y-2">
                                    {subject.topics.map(topic => {
                                        const isTopicOpen = openTopics.has(topic.name);
                                        const { done, total } = getTopicProgress(topic);
                                        const topicPct = total > 0 ? (done / total) * 100 : 0;
                                        const isComplete = total > 0 && done === total;

                                        return (
                                            <div
                                                key={topic.name}
                                                className="
                                                    bg-slate-50 dark:bg-slate-900
                                                    rounded-md
                                                    border border-slate-200 dark:border-slate-700
                                                "
                                            >
                                                <button
                                                    onClick={() => toggleTopic(topic.name)}
                                                    className="w-full flex justify-between items-center p-3 text-left gap-2"
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        {isComplete && (
                                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                                                                <IconCheck className="w-3 h-3 text-green-600 dark:text-green-400" />
                                                            </span>
                                                        )}
                                                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                                            {topic.name}
                                                        </h3>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        {total > 0 && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tabular-nums">
                                                                    {done}/{total}
                                                                </span>
                                                                <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                                    <div
                                                                        className={`h-full rounded-full transition-all duration-300 ${isComplete ? 'bg-green-500' : 'bg-indigo-500'}`}
                                                                        style={{ width: `${topicPct}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <IconChevronDown
                                                            className={`transition-transform text-slate-500 dark:text-slate-400 ${isTopicOpen ? 'rotate-180' : ''}`}
                                                        />
                                                    </div>
                                                </button>

                                                {isTopicOpen && (
                                                    <div className="px-3 pb-3">
                                                        {topic.lectures.length > 0 ? (
                                                            <div className="space-y-0">
                                                                {/* Desktop table */}
                                                                <table className="w-full text-sm text-left table-fixed hidden sm:table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="py-2 px-2 w-10 text-xs uppercase text-slate-500 dark:text-slate-400">#</th>
                                                                            <th className="py-2 px-2 w-12 text-xs uppercase text-slate-500 dark:text-slate-400">Done</th>
                                                                            <th className="py-2 px-2 text-xs uppercase text-slate-500 dark:text-slate-400">Title</th>
                                                                            <th className="py-2 px-2 w-20 text-center text-xs uppercase text-slate-500 dark:text-slate-400">Watch</th>
                                                                            <th className="py-2 px-2 w-20 text-center text-xs uppercase text-slate-500 dark:text-slate-400">Revise</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {topic.lectures.map((lecture, idx) => {
                                                                            const isDone = completedLectures.has(lecture.id);
                                                                            return (
                                                                                <tr
                                                                                    key={lecture.id}
                                                                                    className={`border-b border-slate-200 dark:border-slate-700 last:border-b-0 transition-colors ${isDone ? 'bg-green-50/50 dark:bg-green-900/10' : ''}`}
                                                                                >
                                                                                    <td className="py-2.5 px-2 text-xs text-slate-400 dark:text-slate-500 tabular-nums">
                                                                                        {idx + 1}
                                                                                    </td>
                                                                                    <td className="py-2.5 px-2">
                                                                                        <button
                                                                                            onClick={() => handleToggleLecture(lecture.id)}
                                                                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                                                                                isDone
                                                                                                    ? 'bg-green-500 border-green-500 text-white'
                                                                                                    : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                                                                                            }`}
                                                                                        >
                                                                                            {isDone && <IconCheck className="w-3 h-3" />}
                                                                                        </button>
                                                                                    </td>
                                                                                    <td className={`py-2.5 px-2 ${
                                                                                        isDone
                                                                                            ? 'text-slate-400 dark:text-slate-500'
                                                                                            : 'text-slate-700 dark:text-slate-200'
                                                                                    }`}>
                                                                                        <span className="line-clamp-2">{lecture.title}</span>
                                                                                    </td>
                                                                                    <td className="py-2.5 px-2">
                                                                                        <button
                                                                                            onClick={() => handlePlay(lecture)}
                                                                                            className={`flex justify-center w-full transition-colors ${
                                                                                                nowPlaying?.id === lecture.id
                                                                                                    ? 'text-indigo-600 dark:text-indigo-400'
                                                                                                    : 'text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300'
                                                                                            }`}
                                                                                            title="Play video"
                                                                                        >
                                                                                            <IconPlayCircle />
                                                                                        </button>
                                                                                    </td>
                                                                                    <td className="py-2.5 px-2">
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
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                </table>

                                                                {/* Mobile card layout */}
                                                                <div className="sm:hidden space-y-2">
                                                                    {topic.lectures.map((lecture, idx) => {
                                                                        const isDone = completedLectures.has(lecture.id);
                                                                        return (
                                                                            <div
                                                                                key={lecture.id}
                                                                                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                                                                                    isDone
                                                                                        ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50'
                                                                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                                                                }`}
                                                                            >
                                                                                <button
                                                                                    onClick={() => handleToggleLecture(lecture.id)}
                                                                                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                                                                        isDone
                                                                                            ? 'bg-green-500 border-green-500 text-white'
                                                                                            : 'border-slate-300 dark:border-slate-600'
                                                                                    }`}
                                                                                >
                                                                                    {isDone && <IconCheck className="w-3 h-3" />}
                                                                                </button>
                                                                                <div className="flex-grow min-w-0">
                                                                                    <p className={`text-sm leading-snug ${
                                                                                        isDone
                                                                                            ? 'text-slate-400 dark:text-slate-500'
                                                                                            : 'text-slate-800 dark:text-slate-200'
                                                                                    }`}>
                                                                                        <span className="text-xs text-slate-400 dark:text-slate-500 mr-1">{idx + 1}.</span>
                                                                                        {lecture.title}
                                                                                    </p>
                                                                                    <div className="flex items-center gap-3 mt-2">
                                                                                        <button
                                                                                            onClick={() => handlePlay(lecture)}
                                                                                            className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                                                                                                nowPlaying?.id === lecture.id
                                                                                                    ? 'text-indigo-600 dark:text-indigo-400'
                                                                                                    : 'text-red-600 dark:text-red-400 hover:text-red-500'
                                                                                            }`}
                                                                                        >
                                                                                            <IconPlayCircle className="w-4 h-4" /> {nowPlaying?.id === lecture.id ? 'Playing' : 'Watch'}
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => handleToggleRevision(lecture.id)}
                                                                                            className={`flex items-center gap-1 text-xs font-medium ${
                                                                                                revisionLectures.has(lecture.id)
                                                                                                    ? 'text-yellow-500 dark:text-yellow-400'
                                                                                                    : 'text-slate-400 dark:text-slate-500'
                                                                                            }`}
                                                                                        >
                                                                                            <IconStar className="w-4 h-4" filled={revisionLectures.has(lecture.id)} />
                                                                                            Revise
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        ) : (
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

                {filteredCourseData.length === 0 && searchQuery.trim() && (
                    <div className="text-center py-12">
                        <p className="text-slate-500 dark:text-slate-400">No lectures found matching &ldquo;{searchQuery}&rdquo;</p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
