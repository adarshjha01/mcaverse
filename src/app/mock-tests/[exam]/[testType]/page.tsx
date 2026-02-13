// src/app/mock-tests/[exam]/[testType]/page.tsx
import { db } from "@/lib/firebaseAdmin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  IconClock, 
  IconTrophy, 
  IconListNumbers,
  IconArrowRight
} from "@/components/ui/Icons"; 

// --- TYPES ---
type MockTest = {
  id: string;
  title: string;
  exam: string;
  testType: string;
  durationInMinutes: number;
  question_ids: string[];
  totalMarks?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
};

// --- CONFIG ---
const examNameMapping: { [key: string]: string } = {
    nimcet: "NIMCET",
    cuet: "CUET PG MCA",
    mahmca: "MAH MCA CET",
};

const testTypeTitleMapping: { [key: string]: string } = {
    'pyq': "Previous Year Questions",
    'full-length': "Full Length Mock Tests",
};

const examColorMapping: { [key: string]: string } = {
    nimcet: "text-blue-600 bg-blue-50 border-blue-100",
    cuet: "text-green-600 bg-green-50 border-green-100",
    mahmca: "text-pink-600 bg-pink-50 border-pink-100",
};

// --- FETCH DATA ---
async function getCategorizedTests(exam: string, testType: string): Promise<MockTest[]> {
  try {
    const testsRef = db.collection('mockTests');
    const snapshot = await testsRef
        .where('exam', '==', exam)
        .where('testType', '==', testType)
        // .orderBy('createdAt', 'desc') // Uncomment if you have indexes set up
        .get();
    
    if (snapshot.empty) return [];

    const tests: MockTest[] = [];
    snapshot.forEach(doc => {
      tests.push({ id: doc.id, ...doc.data() } as MockTest);
    });
    
    // Sort manually if index missing (Newest first)
    return tests; // Add .sort() here if needed
  } catch (error) {
    console.error("Error fetching categorized tests:", error);
    return [];
  }
}

export default async function TestListPage({ params }: { params: Promise<{ exam: string, testType: string }> }) {
    const { exam, testType } = await params;
    const tests = await getCategorizedTests(exam, testType);

    const examName = examNameMapping[exam];
    const testTypeTitle = testTypeTitleMapping[testType];
    const themeClass = examColorMapping[exam] || "text-indigo-600 bg-indigo-50 border-indigo-100";
    const btnClass = exam === 'nimcet' ? 'bg-blue-600 hover:bg-blue-700' : 
                     exam === 'cuet' ? 'bg-green-600 hover:bg-green-700' : 
                     'bg-pink-600 hover:bg-pink-700';

    if (!examName || !testTypeTitle) notFound();

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
            
            {/* --- HEADER --- */}
            <section className="pt-24 pb-12 text-center bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border ${themeClass}`}>
                        {examName}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 dark:text-white">
                        {testTypeTitle}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-6">
                        {testType === 'pyq' 
                            ? `Practice with actual papers from previous years to understand the ${examName} pattern.`
                            : `Simulate the real exam environment with our high-quality full length mocks for ${examName}.`
                        }
                    </p>
                    <Link href={`/mock-tests/${exam}`} className="text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center justify-center gap-1">
                        &larr; Back to {examName} Dashboard
                    </Link>
                </div>
            </section>

            {/* --- TEST LIST GRID --- */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    {tests.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tests.map(test => {
                                // Default values if missing from DB
                                const qCount = test.question_ids?.length || 0;
                                const marks = test.totalMarks || (qCount * 4); // Estimate marks if missing
                                const difficulty = test.difficulty || "Medium";
                                
                                // Dynamic Badge Colors
                                const diffColor = difficulty === 'Easy' ? 'bg-green-100 text-green-700 border-green-200' :
                                                  difficulty === 'Hard' ? 'bg-red-100 text-red-700 border-red-200' :
                                                  'bg-yellow-100 text-yellow-700 border-yellow-200';

                                return (
                                    <div key={test.id} className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                        
                                        {/* Card Header */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {test.title}
                                                </h3>
                                                <span className="text-xs font-mono text-slate-400">ID: {test.id.slice(0,6)}</span>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${diffColor}`}>
                                                {difficulty}
                                            </span>
                                        </div>

                                        {/* Info Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                    <IconListNumbers className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="block font-bold text-slate-900 dark:text-slate-200">{qCount}</span>
                                                    <span className="text-xs">Questions</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                    <IconClock className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="block font-bold text-slate-900 dark:text-slate-200">{test.durationInMinutes}</span>
                                                    <span className="text-xs">Minutes</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                    <IconTrophy className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="block font-bold text-slate-900 dark:text-slate-200">{marks}</span>
                                                    <span className="text-xs">Total Marks</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="mt-auto">
                                            <Link 
                                                href={`/mock-tests/take/${test.id}`} 
                                                className={`flex items-center justify-center w-full py-3.5 text-white font-bold rounded-xl shadow-lg shadow-indigo-200/50 dark:shadow-none transition-all ${btnClass}`}
                                            >
                                                Start Test <IconArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <IconListNumbers className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Tests Found</h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                 uploading {testTypeTitle} for {examName}. Please check back shortly.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}