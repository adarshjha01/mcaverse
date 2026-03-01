// src/components/mock-tests/TestList.tsx
import Link from "next/link";
import { IconClock, IconListNumbers, IconTrophy, IconUsers, IconArrowRight } from "@/components/ui/Icons";

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
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
            {tests.map(test => {
                const diffColor = test.difficulty === 'Easy' 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                    : test.difficulty === 'Medium' 
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' 
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
                const statusColor = test.status === 'Attempted' 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';

                return (
                    <div key={test.id} className="group bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors pr-2">{test.name}</h3>
                            <div className="flex gap-1.5 shrink-0">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffColor}`}>{test.difficulty}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>{test.status}</span>
                            </div>
                        </div>
                        
                        {/* Stats grid */}
                        <div className="grid grid-cols-2 gap-3 mb-5 flex-grow">
                            <div className="flex items-center gap-2.5 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                                    <IconListNumbers className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-900 dark:text-slate-200 text-sm">{test.questions}</span>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Questions</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                                    <IconClock className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-900 dark:text-slate-200 text-sm">{test.duration} min</span>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Duration</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                                    <IconTrophy className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-900 dark:text-slate-200 text-sm">{test.marks}</span>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Marks</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                                    <IconUsers className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-900 dark:text-slate-200 text-sm">{test.students.toLocaleString()}</span>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Attempted</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* CTA */}
                        <Link href="#" className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200/30 dark:shadow-none transition-all text-sm">
                            Start Test <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};
