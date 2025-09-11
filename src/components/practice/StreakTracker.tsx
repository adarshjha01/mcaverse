// src/components/practice/StreakTracker.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { IconFlame } from '@/components/ui/Icons'; // Assuming you add this icon

export const StreakTracker = () => {
    const { user } = useAuth();
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        if (user) {
            fetch(`/api/user/streak?userId=${user.uid}`)
                .then(res => res.json())
                .then(data => setStreak(data.currentStreak || 0));
        }
    }, [user]);

    if (!user) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 text-center">
            <IconFlame className="w-12 h-12 mx-auto text-orange-500 mb-2" />
            <p className="text-3xl font-bold">{streak}</p>
            <p className="text-sm text-slate-500">Day Streak</p>
        </div>
    );
};