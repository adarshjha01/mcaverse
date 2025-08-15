// src/components/mock-tests/TestList.tsx
import Link from "next/link";

// Mock data for the tests
const tests = [
    { id: 1, name: "Full Syllabus Mock Test 1", questions: 120, duration: 120 },
    { id: 2, name: "Full Syllabus Mock Test 2", questions: 120, duration: 120 },
    { id: 3, name: "Sectional Test: Mathematics", questions: 50, duration: 60 },
    { id: 4, name: "Sectional Test: Logical Reasoning", questions: 40, duration: 45 },
];

export const TestList = ({ examName }: { examName: string }) => {
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Available Tests for {examName}</h2>
            <div className="bg-white rounded-lg shadow-md border border-slate-200">
                <ul className="divide-y divide-slate-200">
                    {tests.map(test => (
                        <li key={test.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">{test.name}</h3>
                                <div className="flex gap-4 text-sm text-slate-500 mt-1">
                                    <span>{test.questions} Questions</span>
                                    <span>{test.duration} Minutes</span>
                                </div>
                            </div>
                            <Link href="#" className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                                Attempt Test
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
