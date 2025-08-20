// src/app/mock-tests/[exam]/page.tsx

import { ExamTestInterface } from "@/components/mock-tests/ExamTestInterface";
import { notFound } from "next/navigation";
import Link from "next/link";

const examData = {
    nimcet: { name: "NIMCET", title: "Previous Years Questions" },
    cuet: { name: "CUET PG MCA", title: "Previous Years Questions" },
    mahmca: { name: "MAH MCA CET", title: "Previous Years Questions" },
};

export default function ExamDetailPage({ params }: { params: { exam: string } }) {
    const examDetails = examData[params.exam as keyof typeof examData];

    if (!examDetails) {
        notFound();
    }

    return (
            <main className="pt-16">
                <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
                    <h1 className="text-4xl font-bold mb-2">{examDetails.name} {examDetails.title}</h1>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                        Boost your {examDetails.name} prep with our extensive collection of Previous Year Questions—learn from the past to ace the future!
                    </p>
                </section>
                <div className="container mx-auto px-4 py-16">
                    <ExamTestInterface />
                </div>
            </main>
    );
}