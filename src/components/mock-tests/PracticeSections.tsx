// src/components/mock-tests/PracticeSections.tsx
import Link from "next/link";
import React from "react";
import { IconLibrary, IconFocus } from "@/components/ui/Icons";

const practiceTypes = [
    {
        id: "subject-wise",
        title: "Subject Wise Tests",
        description: "Strengthen your core subjects with dedicated practice tests.",
        icon: <IconLibrary className="text-purple-500" />,
        buttonText: "View Subjects",
    },
    {
        id: "topic-wise",
        title: "Topic Wise Tests",
        description: "Master individual topics and pinpoint your specific weak areas.",
        icon: <IconFocus className="text-orange-500" />,
        buttonText: "View Topics",
    },
];

export const PracticeSections = () => {
    return (
        <section className="bg-white pt-10 pb-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Customised Practice</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {practiceTypes.map(test => (
                        <div key={test.title} className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4 border">
                                {test.icon}
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">{test.title}</h2>
                            <p className="text-slate-500 text-sm mb-6 flex-grow">{test.description}</p>
                            <Link href={`/mock-tests/${test.id}`} className="mt-auto w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                                {test.buttonText}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
