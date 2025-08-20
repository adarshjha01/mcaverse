// src/components/mock-tests/TestList.tsx
import Link from "next/link";

const mockTests = {
     "Full Length Mock Tests": [
        { id: 4, name: "Full Syllabus Mock Test 1", questions: 120, duration: 120, marks: 1000, date: "22 Dec at 5:30 PM", students: 1500, difficulty: "Hard", status: "Not Attempted" },
        { id: 5, name: "Full Syllabus Mock Test 2", questions: 120, duration: 120, marks: 1000, date: "23 Dec at 5:30 PM", students: 1320, difficulty: "Hard", status: "Not Attempted" },
    ],
    "Previous Year Questions": [
        { id: 1, name: "NIMCET 2024 Official", questions: 120, duration: 120, marks: 1000, date: "21 Dec at 5:30 PM", students: 2361, difficulty: "Easy", status: "Attempted" },
        { id: 2, name: "NIMCET 2023 Official", questions: 120, duration: 120, marks: 1000, date: "21 Dec at 5:30 PM", students: 704, difficulty: "Medium", status: "Not Attempted" },
        { id: 3, name: "NIMCET 2022 Official", questions: 120, duration: 120, marks: 980, date: "21 Dec at 5:30 PM", students: 414, difficulty: "Medium", status: "Not Attempted" },
    ],
   
};

export const TestList = ({ testType }: { testType: string }) => {
    const tests = mockTests[testType as keyof typeof mockTests] || [];

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map(test => (
                <div key={test.id} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">{test.name}</h3>
                        <div className="flex gap-2">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${test.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{test.difficulty}</span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${test.status === 'Attempted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{test.status}</span>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm text-slate-500">
                        <p>Questions: {test.questions} | {test.duration} Minutes</p>
                        <p>Marks: {test.marks}</p>
                        <p>Date: {test.date} | {test.students} attempted</p>
                    </div>
                    <Link href="#" className="mt-6 block w-full text-center bg-teal-600 text-white font-semibold py-2 rounded-lg hover:bg-teal-700 transition-colors">
                        Start Test
                    </Link>
                </div>
            ))}
        </div>
    );
};
