// src/app/mock-tests/[exam]/[testType]/page.tsx

import { TestList } from "@/components/mock-tests/TestList";
import { notFound } from "next/navigation";
import Link from "next/link";

const examData = {
    nimcet: { name: "NIMCET" },
    cuet: { name: "CUET PG MCA" },
    mahmca: { name: "MAH MCA CET" },
};

const testTypeTitles: { [key: string]: string } = {
    pyq: "Previous Year Questions",
    "full-length": "Full Length Mock Tests",
    "subject-wise": "Subject Wise Tests",
    "topic-wise": "Topic Wise Tests",
};

export default function TestListPage({ params }: { params: { exam: string, testType: string } }) {
    const examDetails = examData[params.exam as keyof typeof examData];
    const pageTitle = testTypeTitles[params.testType];

    if (!examDetails || !pageTitle) {
        notFound();
    }

    return (
            <main className="pt-16">
                <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
                    <h1 className="text-4xl font-bold mb-2">{examDetails.name} - {pageTitle}</h1>
                    <Link href={`/mock-tests/${params.exam}`} className="text-sm font-semibold text-indigo-600 hover:underline">
                        &larr; Back to all test types
                    </Link>
                </section>
                <div className="container mx-auto px-4 py-16">
                    <TestList testType={params.testType} />
                </div>
            </main>
    );
}
