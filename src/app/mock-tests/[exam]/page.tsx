// src/app/mock-tests/[exam]/page.tsx
import { Navbar } from "@/components/landing/Navbar";
import { TestList } from "@/components/mock-tests/TestList";
import { notFound } from "next/navigation";

// This data could come from a database later
const examData: { [key: string]: { name: string; description: string } } = {
    nimcet: { name: "NIMCET", description: "NIT MCA Common Entrance Test" },
    cuet: { name: "CUET PG MCA", description: "Common University Entrance Test" },
    mahmca: { name: "MAH MCA CET", description: "Maharashtra MCA Common Entrance Test" },
};

export default function ExamDetailPage({ params }: { params: { exam: string } }) {
    const examDetails = examData[params.exam];

    if (!examDetails) {
        notFound(); // Show 404 if the exam doesn't exist
    }

    return (
        <div className="bg-white text-slate-800 min-h-screen">
            <Navbar />
            <main className="pt-16">
                <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
                    <h1 className="text-4xl font-bold mb-2">{examDetails.name} Mock Tests</h1>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                        {examDetails.description}
                    </p>
                </section>
                <div className="container mx-auto px-4 py-16">
                    <TestList examName={examDetails.name} />
                </div>
            </main>
        </div>
    );
}
