// src/components/mock-tests/AvailableExams.tsx
import Link from "next/link";
import React from "react";
import { IconBook } from "@/components/ui/Icons";

const exams = [
    { id: 'nimcet', name: "NIMCET", fullName: "NIT MCA Common Entrance Test" },
    { id: 'cuet', name: "CUET PG MCA", fullName: "Common University Entrance Test" },
    { id: 'mahmca', name: "MAH MCA CET", fullName: "Maharashtra MCA Common Entrance Test" },
];

export const AvailableExams = () => {
    return (
        <section className="bg-white dark:bg-slate-950 pt-20 pb-16 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center text-slate-900 dark:text-white">Available Exams</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {exams.map(exam => (
                        <div key={exam.name} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-slate-800 mb-6 border border-slate-100 dark:border-slate-700 group-hover:border-indigo-100 dark:group-hover:border-indigo-900/30 transition-colors">
                                <IconBook className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{exam.name}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-grow leading-relaxed">{exam.fullName}</p>
                            <Link href={`/mock-tests/${exam.id}`} className="mt-auto w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none">
                                View Tests
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};