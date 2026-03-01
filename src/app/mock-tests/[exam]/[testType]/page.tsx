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

const examGradientMapping: { [key: string]: { gradient: string; darkGradient: string; badge: string; btn: string } } = {
    nimcet: {
        gradient: "from-blue-600 via-blue-600 to-indigo-700",
        darkGradient: "dark:from-blue-800 dark:via-blue-800 dark:to-indigo-900",
        badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        btn: "bg-blue-600 hover:bg-blue-700",
    },
    cuet: {
        gradient: "from-emerald-600 via-emerald-600 to-teal-700",
        darkGradient: "dark:from-emerald-800 dark:via-emerald-800 dark:to-teal-900",
        badge: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
        btn: "bg-emerald-600 hover:bg-emerald-700",
    },
    mahmca: {
        gradient: "from-pink-600 via-pink-600 to-rose-700",
        darkGradient: "dark:from-pink-800 dark:via-pink-800 dark:to-rose-900",
        badge: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800",
        btn: "bg-pink-600 hover:bg-pink-700",
    },
};

// --- FETCH DATA ---
async function getCategorizedTests(exam: string, testType: string): Promise<MockTest[]> {
  try {
    const testsRef = db.collection('mockTests');
    const snapshot = await testsRef
        .where('exam', '==', exam)
        .where('testType', '==', testType)
        .get();
    
    if (snapshot.empty) return [];

    const tests: MockTest[] = [];
    snapshot.forEach(doc => {
      tests.push({ id: doc.id, ...doc.data() } as MockTest);
    });
    
    return tests;
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
    const theme = examGradientMapping[exam] || examGradientMapping.nimcet;

    if (!examName || !testTypeTitle) notFound();

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
            
            {/* --- HEADER --- */}
            <section className={`relative overflow-hidden pt-24 pb-14 bg-gradient-to-br ${theme.gradient} ${theme.darkGradient} text-white`}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                </div>
                <div className="relative container mx-auto px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-white/15 backdrop-blur-sm border border-white/20`}>
                            {examName}
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 tracking-tight">
                            {testTypeTitle}
                        </h1>
                        <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto mb-5 leading-relaxed">
                            {testType === 'pyq' 
                                ? `Practice with actual papers from previous years to understand the ${examName} pattern.`
                                : `Simulate the real exam environment with our high-quality full length mocks for ${examName}.`
                            }
                        </p>
                        <Link href={`/mock-tests/${exam}`} className="text-sm font-medium text-white/60 hover:text-white transition-colors inline-flex items-center gap-1">
                            &larr; Back to {examName} Dashboard
                        </Link>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 40" fill="none" className="w-full h-6 sm:h-8">
                        <path d="M0 40L48 37.5C96 35 192 30 288 27.5C384 25 480 25 576 26.7C672 28.3 768 31.7 864 33.3C960 35 1056 35 1152 33.3C1248 31.7 1344 28.3 1392 26.7L1440 25V40H0Z" className="fill-slate-50 dark:fill-slate-900/50" />
                    </svg>
                </div>
            </section>

            {/* --- TEST LIST GRID --- */}
            <div className="bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4 py-10 sm:py-14">
                    <div className="max-w-5xl mx-auto">
                        {/* Results count */}
                        {tests.length > 0 && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                                Showing <span className="text-slate-900 dark:text-white font-bold">{tests.length}</span> {tests.length === 1 ? 'test' : 'tests'}
                            </p>
                        )}

                        {tests.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {tests.map(test => {
                                    const qCount = test.question_ids?.length || 0;
                                    const marks = test.totalMarks || (qCount * 4);
                                    const difficulty = test.difficulty || "Medium";
                                    
                                    const diffColor = difficulty === 'Easy' 
                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                                        : difficulty === 'Hard' 
                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' 
                                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';

                                    return (
                                        <div key={test.id} className="group bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                            
                                            {/* Card Header */}
                                            <div className="flex justify-between items-start mb-5">
                                                <div className="pr-3">
                                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {test.title}
                                                    </h3>
                                                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">ID: {test.id.slice(0,6)}</span>
                                                </div>
                                                <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold border ${diffColor}`}>
                                                    {difficulty}
                                                </span>
                                            </div>

                                            {/* Info Stats */}
                                            <div className="grid grid-cols-3 gap-3 mb-6">
                                                <div className="flex items-center gap-2.5 text-sm">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                                                        <IconListNumbers className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <span className="block font-bold text-slate-900 dark:text-slate-200 text-sm">{qCount}</span>
                                                        <span className="text-[10px] text-slate-500 dark:text-slate-400">Questions</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-sm">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                                                        <IconClock className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <span className="block font-bold text-slate-900 dark:text-slate-200 text-sm">{test.durationInMinutes}</span>
                                                        <span className="text-[10px] text-slate-500 dark:text-slate-400">Minutes</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5 text-sm">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                                                        <IconTrophy className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <span className="block font-bold text-slate-900 dark:text-slate-200 text-sm">{marks}</span>
                                                        <span className="text-[10px] text-slate-500 dark:text-slate-400">Marks</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <div className="mt-auto">
                                                <Link 
                                                    href={`/mock-tests/take/${test.id}`} 
                                                    className={`flex items-center justify-center w-full py-3 text-white font-bold rounded-xl shadow-lg shadow-indigo-200/30 dark:shadow-none transition-all text-sm ${theme.btn}`}
                                                >
                                                    Start Test <IconArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                                    <IconListNumbers className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No Tests Found</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                    We&apos;re uploading {testTypeTitle} for {examName}. Please check back shortly.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}