import { AvailableExams } from "@/components/mock-tests/AvailableExams";
import { RecentTestResults } from "@/components/mock-tests/RecentTestResults";
import { SubjectPerformance } from "@/components/mock-tests/SubjectPerformance";
import { IconClipboardCheck } from "@/components/ui/Icons";
import { PracticeSections } from "@/components/mock-tests/PracticeSections";
import Link from "next/link";

export default function MockTestsPage() {
  return (
    <main className="pt-16 min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-800 dark:via-blue-800 dark:to-cyan-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative container mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 mb-6 shadow-lg">
              <IconClipboardCheck className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Mock Tests & Practice Papers
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Comprehensive practice tests for NIMCET, CUET PG MCA, and MAH MCA CET — simulate the real exam experience.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/20">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                3 Exam Types
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/20">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                PYQs Available
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/20">
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                Custom Tests
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-8 sm:h-12">
            <path d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 36.7 768 43.3 864 45C960 46.7 1056 43.3 1152 40C1248 36.7 1344 33.3 1392 31.7L1440 30V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" className="fill-white dark:fill-slate-950" />
          </svg>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/50 transition-colors">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar -mx-4 px-4">
            <Link href="#practice" className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
              Custom Practice
            </Link>
            <Link href="#exams" className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              Available Exams
            </Link>
            <Link href="#results" className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              Recent Results
            </Link>
            <Link href="/mock-tests/history" className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              Full History
            </Link>
          </nav>
        </div>
      </section>

      <div id="practice">
        <PracticeSections />
      </div>

      <div id="exams">
        <AvailableExams />
      </div>

      {/* Results + Performance */}
      <section id="results" className="bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300 border-t border-slate-100 dark:border-slate-800/50">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Your Performance</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">Track your progress and identify areas for improvement</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <RecentTestResults />
            </div>
            <div className="lg:col-span-1">
              <SubjectPerformance />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}