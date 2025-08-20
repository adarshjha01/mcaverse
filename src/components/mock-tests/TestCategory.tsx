// src/components/mock-tests/TestCategory.tsx
import Link from "next/link";

export const TestCategory = ({ title, count }: { title: string; count: number }) => {
    const tests = Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `${title.replace('(PYQs)', '').trim()} ${i + 1}`,
        questions: title.includes('Full') ? 120 : 50,
        duration: title.includes('Full') ? 120 : 60,
    }));

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">{title}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map(test => (
                    <div key={test.id} className="bg-slate-50 p-6 rounded-lg border border-slate-200 flex flex-col">
                        <h3 className="text-lg font-semibold text-slate-800">{test.name}</h3>
                        <div className="flex gap-4 text-sm text-slate-500 mt-2">
                            <span>{test.questions} Questions</span>
                            <span>•</span>
                            <span>{test.duration} Minutes</span>
                        </div>
                        <Link href="#" className="mt-6 w-full text-center bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                            Start Test
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};
