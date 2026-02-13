// src/app/mock-tests/[exam]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  IconTrophy, 
  IconClock, 
  IconLibrary, 
  IconTarget,
  IconSparkles,
  IconArrowRight
} from "@/components/ui/Icons"; 

// --- CONFIGURATION ---
const examConfig: { [key: string]: any } = {
  nimcet: {
    title: "NIMCET",
    fullName: "NIT MCA Common Entrance Test",
    description: "The gateway to National Institutes of Technology (NITs). Focus on Mathematics, Analytical Ability, Computer Awareness, and English.",
    color: "blue",
    gradient: "from-blue-600 to-indigo-700",
    bgAccent: "bg-blue-50 dark:bg-blue-900/20",
    textAccent: "text-blue-600 dark:text-blue-400",
    stats: {
      questions: "120 Qs",
      time: "120 Mins",
      marks: "1000 Marks"
    }
  },
  cuet: {
    title: "CUET PG MCA",
    fullName: "Common University Entrance Test",
    description: "Your ticket to top central universities like JNU, BHU, and DU. Emphasizes Mathematics, Thinking Ability, and Computer Basics.",
    color: "emerald",
    gradient: "from-emerald-600 to-teal-700",
    bgAccent: "bg-emerald-50 dark:bg-emerald-900/20",
    textAccent: "text-emerald-600 dark:text-emerald-400",
    stats: {
      questions: "75 Qs",
      time: "105 Mins",
      marks: "300 Marks"
    }
  },
  mahmca: {
    title: "MAH MCA CET",
    fullName: "Maharashtra Common Entrance Test",
    description: "Admission to top colleges in Maharashtra like VJTI and SPIT. Tests Logical Reasoning, Abstract Reasoning, English, and Computer concepts.",
    color: "pink",
    gradient: "from-pink-600 to-rose-700",
    bgAccent: "bg-pink-50 dark:bg-pink-900/20",
    textAccent: "text-pink-600 dark:text-pink-400",
    stats: {
      questions: "100 Qs",
      time: "90 Mins",
      marks: "200 Marks"
    }
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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* --- HERO SECTION --- */}
      <section className={`pt-24 pb-12 bg-gradient-to-br ${config.gradient} text-white`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/mock-tests" 
              className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors"
            >
              &larr; Back to All Exams
            </Link>
            
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                 <IconTrophy className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">{config.title}</h1>
                <p className="text-xl text-white/90 font-medium">{config.fullName}</p>
              </div>
            </div>

            {/* Exam Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/10 text-center">
                    <div className="text-xs text-white/70 uppercase tracking-wider mb-1">Duration</div>
                    <div className="font-bold text-lg">{config.stats.time}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/10 text-center">
                    <div className="text-xs text-white/70 uppercase tracking-wider mb-1">Questions</div>
                    <div className="font-bold text-lg">{config.stats.questions}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/10 text-center">
                    <div className="text-xs text-white/70 uppercase tracking-wider mb-1">Max Score</div>
                    <div className="font-bold text-lg">{config.stats.marks}</div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto px-4 py-12 -mt-8 relative z-10">
        <div className="max-w-4xl mx-auto grid gap-8">
            
            {/* Description Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">About the Exam</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {config.description}
                </p>
            </div>

            {/* --- SELECTION CARDS --- */}
            <div className="grid md:grid-cols-2 gap-6">
                
                {/* 1. Full Length Mocks */}
                <Link href={`/mock-tests/${exam}/full-length`} className="group">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all h-full flex flex-col relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${config.bgAccent} rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
                        
                        <div className={`w-14 h-14 ${config.bgAccent} rounded-xl flex items-center justify-center ${config.textAccent} mb-6`}>
                            <IconTarget className="w-8 h-8" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Full Mock Tests</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow">
                            Simulate the actual exam environment. Strict timer, negative marking, and real-time rank analysis.
                        </p>
                        
                        <div className={`flex items-center font-bold ${config.textAccent}`}>
                            Start Simulation <IconArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                {/* 2. Previous Year Questions (PYQs) */}
                <Link href={`/mock-tests/${exam}/pyq`} className="group">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all h-full flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 dark:bg-orange-900/20 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                        
                        <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6">
                            <IconLibrary className="w-8 h-8" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Previous Year Papers</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow">
                            Practice with authentic papers from 2018 to 2025. Understand the pattern and difficulty trends.
                        </p>
                        
                        <div className="flex items-center font-bold text-orange-600 dark:text-orange-400">
                            Solve Past Papers <IconArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

            </div>

            {/* --- EXTRA PRACTICE --- */}
            <div className="mt-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Targeted Practice</h3>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-sm text-indigo-600">
                             <IconSparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Weak in a specific area?</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Take Subject-wise tests for Math, Reasoning, or Computers.</p>
                        </div>
                    </div>
                    <Link href="/mock-tests/subject-wise" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap">
                        Explore Subjects
                    </Link>
                </div>
            </div>

        </div>
      </div>
    </main>
  );
}