// src/components/mock-tests/AvailableExams.tsx
import React from 'react';
import Link from 'next/link';
import { IconBook } from '@/components/ui/Icons';

const exams = [
    { id: 'nimcet', name: "NIMCET", fullName: "NIT MCA Common Entrance Test" },
    { id: 'cuet', name: "CUET PG MCA", fullName: "Common University Entrance Test" },
    { id: 'mahmca', name: "MAH MCA CET", fullName: "Maharashtra MCA Common Entrance Test" },
];

export const AvailableExams = () => {
    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Available Exams</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {exams.map(exam => (
                        <div key={exam.name} className="bg-slate-50 rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col text-center">
                            <div className="flex-grow flex flex-col items-center justify-center">
                                <div className="bg-white p-3 rounded-lg border border-slate-200 mb-4">
                                    <IconBook className="w-6 h-6 text-indigo-500" />
                                </div>
                                <h3 className="text-xl font-bold">{exam.name}</h3>
                                <p className="text-sm text-slate-500 mb-6">{exam.fullName}</p>
                            </div>
                            <Link href={`/mock-tests/${exam.id}`} className="mt-auto w-full text-center bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                                View Tests
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

