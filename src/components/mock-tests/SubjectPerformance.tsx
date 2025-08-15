// src/components/mock-tests/SubjectPerformance.tsx

const subjects = [
    { name: "Mathematics", score: 75 },
    { name: "Logical Reasoning", score: 68 },
    { name: "Computer Concepts", score: 89 },
    { name: "General English", score: 82 },
    { name: "General Awareness", score: 65 },
];

export const SubjectPerformance = () => {
    return (
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Subject Performance</h2>
            <div className="space-y-4">
                {subjects.map(subject => (
                    <div key={subject.name}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-300">{subject.name}</span>
                            <span className="font-semibold">{subject.score}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${subject.score}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-700">
                 <h3 className="text-lg font-bold mb-4">Performance Insights</h3>
                 <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex items-start gap-3"><span className="text-green-400 mt-1">✓</span> <span><strong>Strong in Computer Concepts:</strong> Consistently scoring above 85%.</span></li>
                    <li className="flex items-start gap-3"><span className="text-yellow-400 mt-1">~</span> <span><strong>Focus on General Awareness:</strong> Room for improvement in current affairs.</span></li>
                    <li className="flex items-start gap-3"><span className="text-blue-400 mt-1">→</span> <span><strong>Practice more reasoning:</strong> Improve speed and accuracy.</span></li>
                 </ul>
            </div>
        </div>
    );
};