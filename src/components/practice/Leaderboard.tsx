// src/components/practice/Leaderboard.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { IconFlame } from '@/components/ui/Icons';

type Leader = {
    id: string;
    userName: string;
    streak: number;
    photoURL?: string | null;
};

const IconTrophy = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

const RankBadge = ({ rank }: { rank: number }) => {
    if (rank === 1) return <span className="text-lg leading-none">🥇</span>;
    if (rank === 2) return <span className="text-lg leading-none">🥈</span>;
    if (rank === 3) return <span className="text-lg leading-none">🥉</span>;
    return (
        <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold inline-flex items-center justify-center flex-shrink-0">
            {rank}
        </span>
    );
};

const Avatar = ({ name, photoURL }: { name: string; photoURL?: string | null }) => {
    const initials = name
        .split(' ')
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    if (photoURL) {
        return (
            <img
                src={photoURL}
                alt={name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                referrerPolicy="no-referrer"
            />
        );
    }

    return (
        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
            {initials}
        </div>
    );
};

const SkeletonRow = () => (
    <div className="flex items-center gap-3 py-3 animate-pulse">
        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>
);

export const Leaderboard = ({ refreshKey = 0 }: { refreshKey?: number }) => {
    const { user } = useAuth();
    const [leaders, setLeaders] = useState<Leader[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(false);
        fetch('/api/leaderboard')
            .then(res => {
                if (!res.ok) throw new Error('Failed');
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) setLeaders(data);
                else setLeaders([]);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [refreshKey]);

    return (
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-2 mb-5">
                <IconTrophy className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Streak Leaderboard</h3>
            </div>

            {loading && (
                <div className="space-y-1">
                    {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
                </div>
            )}

            {error && !loading && (
                <p className="text-sm text-red-500 dark:text-red-400 text-center py-6">
                    Failed to load leaderboard. Try refreshing.
                </p>
            )}

            {!loading && !error && leaders.length === 0 && (
                <div className="text-center py-8">
                    <IconFlame className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        No active streaks yet.
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Be the first to start a streak!
                    </p>
                </div>
            )}

            {!loading && !error && leaders.length > 0 && (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                    {leaders.map((leader, index) => {
                        const isCurrentUser = user?.uid === leader.id;
                        return (
                            <li
                                key={leader.id}
                                className={`flex items-center gap-3 py-3 px-2 rounded-lg transition-colors ${
                                    isCurrentUser
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20'
                                        : ''
                                }`}
                            >
                                <RankBadge rank={index + 1} />
                                <Avatar name={leader.userName} photoURL={leader.photoURL} />
                                <span className={`flex-1 text-sm font-medium truncate ${
                                    isCurrentUser
                                        ? 'text-indigo-700 dark:text-indigo-300'
                                        : 'text-slate-700 dark:text-slate-200'
                                }`}>
                                    {leader.userName}
                                    {isCurrentUser && (
                                        <span className="ml-1.5 text-[10px] uppercase tracking-wide font-bold text-indigo-500 dark:text-indigo-400">
                                            You
                                        </span>
                                    )}
                                </span>
                                <span className={`flex items-center gap-1 text-sm font-bold tabular-nums flex-shrink-0 ${
                                    index < 3
                                        ? 'text-orange-500 dark:text-orange-400'
                                        : 'text-slate-600 dark:text-slate-400'
                                }`}>
                                    <IconFlame className="w-3.5 h-3.5" />
                                    {leader.streak} <span className="text-xs font-normal">day{leader.streak !== 1 ? 's' : ''}</span>
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};