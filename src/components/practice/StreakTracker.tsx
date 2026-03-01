// src/components/practice/StreakTracker.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { IconFlame } from '@/components/ui/Icons';

export const StreakTracker = () => {
    const { user } = useAuth();
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        if (user) {
            const fetchStreak = async () => {
                try {
                    const token = await user.getIdToken();
                    const res = await fetch(`/api/user/streak?userId=${user.uid}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    if (!res.ok) {
                        console.error(`Failed to fetch streak: ${res.status}`);
                        return;
                    }
                    const data = await res.json();
                    setStreak(data.currentStreak || 0);
                } catch (err) {
                    console.error("Failed to fetch streak:", err);
                }
            };
            fetchStreak();
        }
    }, [user]);

    if (!user) return null;

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 text-center transition-colors">
            <IconFlame className={`w-12 h-12 mx-auto mb-2 ${streak > 0 ? 'text-orange-500' : 'text-slate-400 dark:text-slate-600'}`} />
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{streak}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Day Streak</p>
        </div>
    );
};