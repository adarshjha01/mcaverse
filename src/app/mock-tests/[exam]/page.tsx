// src/app/mock-tests/[exam]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  IconTrophy, 
  IconLibrary, 
  IconTarget,
  IconSparkles,
  IconArrowRight,
  IconBook
} from "@/components/ui/Icons"; 

// --- CONFIGURATION ---
const examConfig: { [key: string]: any } = {
  nimcet: {
    title: "NIMCET",
    fullName: "NIT MCA Common Entrance Test",
    description: "The gateway to National Institutes of Technology (NITs). Focus on Mathematics, Analytical Ability, Computer Awareness, and English.",
    gradient: "from-blue-600 to-indigo-700",
    lightGradient: "from-blue-600 via-blue-600 to-indigo-700",
    darkGradient: "dark:from-blue-800 dark:via-blue-800 dark:to-indigo-900",
    bgAccent: "bg-blue-50 dark:bg-blue-900/20",
    textAccent: "text-blue-600 dark:text-blue-400",
    borderAccent: "border-blue-100 dark:border-blue-800",
    stats: { questions: "120 Qs", time: "120 Mins", marks: "1000 Marks" },
    icon: <IconTrophy className="w-10 h-10 text-white" />,
  },
  cuet: {
    title: "CUET PG MCA",
    fullName: "Common University Entrance Test",
    description: "Your ticket to top central universities like JNU, BHU, and DU. Emphasizes Mathematics, Thinking Ability, and Computer Basics.",
    gradient: "from-emerald-600 to-teal-700",
    lightGradient: "from-emerald-600 via-emerald-600 to-teal-700",
    darkGradient: "dark:from-emerald-800 dark:via-emerald-800 dark:to-teal-900",
    bgAccent: "bg-emerald-50 dark:bg-emerald-900/20",
    textAccent: "text-emerald-600 dark:text-emerald-400",
    borderAccent: "border-emerald-100 dark:border-emerald-800",
    stats: { questions: "75 Qs", time: "105 Mins", marks: "300 Marks" },
    icon: <IconBook className="w-10 h-10 text-white" />,
  },
  mahmca: {
    title: "MAH MCA CET",
    fullName: "Maharashtra Common Entrance Test",
    description: "Admission to top colleges in Maharashtra like VJTI and SPIT. Tests Logical Reasoning, Abstract Reasoning, English, and Computer concepts.",
    gradient: "from-pink-600 to-rose-700",
    lightGradient: "from-pink-600 via-pink-600 to-rose-700",
    darkGradient: "dark:from-pink-800 dark:via-pink-800 dark:to-rose-900",
    bgAccent: "bg-pink-50 dark:bg-pink-900/20",
    textAccent: "text-pink-600 dark:text-pink-400",
    borderAccent: "border-pink-100 dark:border-pink-800",
    stats: { questions: "100 Qs", time: "90 Mins", marks: "200 Marks" },
    icon: <IconTarget className="w-10 h-10 text-white" />,
  }
};

type PageProps = {
  params: Promise<{ exam: string }>;
};

export default async function ExamHubPage({ params }: PageProps) {
  const { exam } = await params;
  const config = examConfig[exam];

  if (!config) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* --- HERO SECTION --- */}
      <section className={`relative overflow-hidden pt-24 pb-16 bg-gradient-to-br ${config.lightGradient} ${config.darkGradient} text-white`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/mock-tests" 
              className="inline-flex items-center text-white/70 hover:text-white mb-8 text-sm font-medium transition-colors gap-1"
            >
              &larr; Back to All Exams
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/15 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg shrink-0">
                {config.icon}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-1.5 tracking-tight">{config.title}</h1>
                <p className="text-base sm:text-lg text-white/80 font-medium">{config.fullName}</p>
              </div>
            </div>

            {/* Exam Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-10 max-w-md">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/10 text-center">
                    <div className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider mb-1">Duration</div>
                    <div className="font-bold text-base sm:text-lg">{config.stats.time}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/10 text-center">
                    <div className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider mb-1">Questions</div>
                    <div className="font-bold text-base sm:text-lg">{config.stats.questions}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/10 text-center">
                    <div className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider mb-1">Max Score</div>
                    <div className="font-bold text-base sm:text-lg">{config.stats.marks}</div>
                </div>
            </div>
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" className="w-full h-8 sm:h-10">
            <path d="M0 50L48 46.7C96 43.3 192 36.7 288 33.3C384 30 480 30 576 31.7C672 33.3 768 36.7 864 38.3C960 40 1056 40 1152 38.3C1248 36.7 1344 33.3 1392 31.7L1440 30V50H0Z" className="fill-white dark:fill-slate-950" />
          </svg>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto px-4 py-10 sm:py-14">
        <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Description Card */}
            <div className="bg-slate-50 dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className={`w-1.5 h-5 rounded-full bg-gradient-to-b ${config.gradient}`} />
                    About the Exam
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    {config.description}
                </p>
            </div>

            {/* --- SELECTION CARDS (Coming Soon) --- */}
            <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                
                {/* Full Length Mocks — Coming Soon */}
                <div className="group cursor-default">
                    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col relative overflow-hidden opacity-80">
                        {/* Coming Soon Badge */}
                        <div className="absolute top-4 right-4 z-10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                Coming Soon
                            </span>
                        </div>

                        <div className={`absolute top-0 right-0 w-32 h-32 ${config.bgAccent} rounded-full -mr-10 -mt-10 opacity-50`} />
                        
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 ${config.bgAccent} rounded-xl flex items-center justify-center ${config.textAccent} mb-5 border ${config.borderAccent}`}>
                            <IconTarget className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">Full Mock Tests</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-grow leading-relaxed">
                            Simulate the actual exam environment. Strict timer, negative marking, and real-time rank analysis.
                        </p>
                        
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/40">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-snug">
                                We&apos;re building mock tests for you. Stay tuned!
                            </p>
                        </div>
                    </div>
                </div>

                {/* PYQs — Coming Soon */}
                <div className="group cursor-default">
                    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col relative overflow-hidden opacity-80">
                        {/* Coming Soon Badge */}
                        <div className="absolute top-4 right-4 z-10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                Coming Soon
                            </span>
                        </div>

                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 dark:bg-orange-900/20 rounded-full -mr-10 -mt-10 opacity-50" />
                        
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-5 border border-orange-200 dark:border-orange-800">
                            <IconLibrary className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">Previous Year Papers</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-grow leading-relaxed">
                            Practice with authentic papers from 2018 to 2025. Understand the pattern and difficulty trends.
                        </p>
                        
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/40">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-snug">
                                We&apos;re building PYQ tests for you. Stay tuned!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- EXTRA PRACTICE --- */}
            <div>
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-5 sm:p-6 border border-indigo-100 dark:border-indigo-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-start sm:items-center gap-4">
                        <div className="w-11 h-11 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-700">
                             <IconSparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Weak in a specific area?</h4>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Take Subject-wise tests for Math, Reasoning, or Computers.</p>
                        </div>
                    </div>
                    <Link href="/mock-tests/subject-wise" className="shrink-0 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm">
                        Explore Subjects
                    </Link>
                </div>
            </div>

        </div>
      </div>
    </main>
  );
}