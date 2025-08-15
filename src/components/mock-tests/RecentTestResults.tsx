// src/components/mock-tests/RecentTestResults.tsx
import { IconBarChart, IconRefreshCw } from '@/components/ui/Icons';

const results = [
    { name: "NIMCET Mock Test 1", date: "2 days ago", score: 85, rank: 45, attempted: 95, correct: 85, incorrect: 10 },
    { name: "CUET PG MCA Practice 3", date: "5 days ago", score: 78, rank: 89, attempted: 75, correct: 58, incorrect: 17 },
];

export const RecentTestResults = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Recent Test Results</h2>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View All</button>
            </div>
            <div className="space-y-6">
                {results.map(result => (
                    <div key={result.name} className="bg-white p-6 rounded-lg border border-slate-200 shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold">{result.name}</h3>
                                <p className="text-sm text-slate-500">{result.date}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-green-600">{result.score}%</p>
                                <p className="text-sm text-slate-500">Rank #{result.rank}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 text-center mb-4">
                            <div><p className="text-2xl font-semibold">{result.attempted}</p><p className="text-xs text-slate-500">Attempted</p></div>
                            <div><p className="text-2xl font-semibold text-green-600">{result.correct}</p><p className="text-xs text-slate-500">Correct</p></div>
                            <div><p className="text-2xl font-semibold text-red-500">{result.incorrect}</p><p className="text-xs text-slate-500">Incorrect</p></div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${result.score}%` }}></div>
                        </div>
                        <div className="flex gap-4">
                            <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-300">
                                <IconBarChart /> Detailed Analysis
                            </button>
                            <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-300">
                                <IconRefreshCw /> Retake Test
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
