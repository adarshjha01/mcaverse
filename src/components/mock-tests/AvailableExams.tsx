// src/components/mock-tests/AvailableExams.tsx
"use client";
import React, { useState } from 'react';
import { IconBook } from '@/components/ui/Icons'; // Assuming IconBook is in your shared icons file

const exams = [
    { name: "NIMCET", fullName: "NIT MCA Common Entrance Test", tests: 25, difficulty: "High", duration: 120 },
    { name: "CUET PG MCA", fullName: "Common University Entrance Test", tests: 20, difficulty: "Medium", duration: 90 },
    { name: "MAH MCA CET", fullName: "Maharashtra MCA Common Entrance Test", tests: 15, difficulty: "Medium", duration: 90 },
];

export const AvailableExams = () => {
    return (
        <section className="bg-slate-900 py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">Available Exams</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {exams.map(exam => (
                        <div key={exam.name} className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 flex flex-col">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-slate-700 p-3 rounded-lg">
                                    <IconBook className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{exam.name}</h3>
                                    <p className="text-sm text-slate-400">{exam.fullName}</p>
                                </div>
                            </div>
                            <div className="space-y-3 text-sm text-slate-300 flex-grow">
                                <div className="flex justify-between"><span>Available Tests</span> <span className="font-semibold text-blue-400 bg-blue-900/50 px-2 py-0.5 rounded">{exam.tests} Tests</span></div>
                                <div className="flex justify-between"><span>Difficulty</span> <span className={`font-semibold px-2 py-0.5 rounded ${exam.difficulty === 'High' ? 'text-red-400 bg-red-900/50' : 'text-yellow-400 bg-yellow-900/50'}`}>{exam.difficulty}</span></div>
                                <div className="flex justify-between"><span>Duration</span> <span className="font-semibold">{exam.duration} min</span></div>
                            </div>
                            <button className="mt-6 w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                                Start Mock Test
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

