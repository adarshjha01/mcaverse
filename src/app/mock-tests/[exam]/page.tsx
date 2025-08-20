// src/app/mock-tests/[exam]/page.tsx
import { Navbar } from "@/components/landing/Navbar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { IconHistory, IconFileCheck, IconLibrary, IconFocus } from "@/components/ui/Icons";
import React from "react";

const examData = {
    nimcet: { name: "NIMCET" },
    cuet: { name: "CUET PG MCA" },
    mahmca: { name: "MAH MCA CET" },
};

const testTypes = [
    { 
        id: "pyq",
        title: "Previous Year Questions", 
        description: "Practice with official past papers to understand the exam pattern.",
        icon: <IconHistory className="text-blue-500" />,
        bgColor: "bg-blue-50",
        buttonText: "Start Solving PYQs",
        buttonColor: "bg-blue-500 hover:bg-blue-600",
    },
    { 
        id: "full-length",
        title: "Full Length Mock Test", 
        description: "Simulate the real exam experience with our full syllabus mock tests.",
        icon: <IconFileCheck className="text-green-500" />,
        bgColor: "bg-green-50",
        buttonText: "Attempt Mock Tests",
        buttonColor: "bg-green-500 hover:bg-green-600",
    },
    { 
        id: "subject-wise",
        title: "Subject Wise Test", 
        description: "Strengthen your core subjects with dedicated practice tests.",
        icon: <IconLibrary className="text-purple-500" />,
        bgColor: "bg-purple-50",
        buttonText: "Command Subjects",
        buttonColor: "bg-purple-500 hover:bg-purple-600",
    },
    { 
        id: "topic-wise",
        title: "Topic Wise Test", 
        description: "Master individual topics and pinpoint your specific weak areas.",
        icon: <IconFocus className="text-orange-500" />,
        bgColor: "bg-orange-50",
        buttonText: "Focus on a Topic",
        buttonColor: "bg-orange-500 hover:bg-orange-600",
    },
];

export default function ExamDetailPage({ params }: { params: { exam: string } }) {
    const examDetails = examData[params.exam as keyof typeof examData];
    if (!examDetails) notFound();

    return (
        <div className="bg-white text-slate-800 min-h-screen">
            <Navbar />
            <main className="pt-16">
                <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
                    <h1 className="text-4xl font-bold mb-2">{examDetails.name} Test Series</h1>
                    <Link href="/mock-tests" className="text-sm font-semibold text-indigo-600 hover:underline">
                        &larr; Back to all exams
                    </Link>
                </section>
                <div className="container mx-auto px-4 py-16">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {testTypes.map(test => (
                            <div key={test.title} className={`flex flex-col p-8 rounded-xl border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${test.bgColor}`}>
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white mb-6">
                                    {test.icon}
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 mb-2">{test.title}</h2>
                                <p className="text-slate-600 text-sm flex-grow">{test.description}</p>
                                <Link href={`/mock-tests/${params.exam}/${test.id}`} className={`mt-6 block w-full text-center text-white font-semibold py-2 rounded-lg transition-colors ${test.buttonColor}`}>
                                    {test.buttonText}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
