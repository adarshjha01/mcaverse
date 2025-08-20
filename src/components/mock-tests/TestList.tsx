// src/components/mock-tests/TestList.tsx
import Link from "next/link";

// Mock data for different test types
const mockTests = {
    pyq: [
        { id: 1, name: "2023 PYQs", questions: 120, students: 1250 },
        { id: 2, name: "2022 PYQs", questions: 120, students: 980 },
        { id: 3, name: "2021 PYQs", questions: 120, students: 850 },
    ],
    "full-length": [
        { id: 1, name: "Full Syllabus Mock Test 1", questions: 120, students: 1500 },
        { id: 2, name: "Full Syllabus Mock Test 2", questions: 120, students: 1320 },
    ],
    // Add data for other types as needed
};

export const TestList = ({ testType }: { testType: string }) => {
    const tests = mockTests[testType as keyof typeof mockTests] || [];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md border border-slate-200">
                <ul className="divide-y divide-slate-200">
                    {tests.map(test => (
                        <li key={test.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">{test.name}</h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    {test.questions} Questions | {test.students} students attempted
                                </p>
                            </div>
                            <Link href="#" className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0">
                                Start Test
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
