// src/app/mock-tests/[exam]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { IconHistory, IconFileCheck } from "@/components/ui/Icons";

const examData = {
    nimcet: { name: "NIMCET" },
    cuet: { name: "CUET PG MCA" },
    mahmca: { name: "MAH MCA CET" },
};

const testTypes = [
    { id: 'pyq', title: "Previous Year Questions", description: "Practice with official past papers.", icon: <IconHistory /> },
    { id: 'full-length', title: "Full Length Mock Tests", description: "Simulate the real exam experience.", icon: <IconFileCheck /> },
];

export default function ExamCategoryPage({ params }: { params: { exam: string } }) {
    const examDetails = examData[params.exam as keyof typeof examData];
    if (!examDetails) notFound();

    return (
        <main className="pt-16">
            <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
                <h1 className="text-4xl font-bold mb-2">{examDetails.name} Tests Coming Soon...</h1>
                <p className="text-lg text-slate-600">Select a category to start your practice.</p>
            </section>
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    {testTypes.map(type => (
                        <Link key={type.id} href={`/mock-tests/${params.exam}/${type.id}`} className="block bg-white p-8 rounded-lg border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                                    {type.icon}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">{type.title}</h2>
                                    <p className="text-slate-500 text-sm">{type.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}