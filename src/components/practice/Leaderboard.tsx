// src/components/practice/Leaderboard.tsx
"use client";

import { useState, useEffect } from 'react';

export const Leaderboard = () => {
    const [leaders, setLeaders] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/leaderboard')
            .then(res => res.json())
            .then(setLeaders);
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-xl font-bold mb-4">Leaderboard</h3>
            <ul className="space-y-3">
                {leaders.map((leader, index) => (
                    <li key={leader.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="font-bold">{index + 1}.</span>
                            <span>{leader.userName}</span>
                        </div>
                        <span className="font-semibold text-indigo-600">{leader.points} pts</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};