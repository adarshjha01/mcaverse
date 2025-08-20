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
        <section className="bg-white pt-20 pb-10">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Available Exams</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {exams.map(exam => (
                        <div key={exam.name} className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4 border">
                                <IconBook className="w-8 h-8 text-indigo-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">{exam.name}</h3>
                            <p className="text-slate-500 text-sm mb-6 flex-grow">{exam.fullName}</p>
                            <Link href={`/mock-tests/${exam.id}`} className="mt-auto w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                                View Tests
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};