import { AvailableExams } from "@/components/mock-tests/AvailableExams";
import { RecentTestResults } from "@/components/mock-tests/RecentTestResults";
import { SubjectPerformance } from "@/components/mock-tests/SubjectPerformance";
import { IconClipboardCheck } from "@/components/ui/Icons";
import { PracticeSections } from "@/components/mock-tests/PracticeSections";

export default function MockTestsPage() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="py-16 text-center bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <IconClipboardCheck className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-indigo-500 mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-slate-900 dark:text-slate-100">
          Mock Tests & Practice Papers
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Comprehensive practice tests for NIMCET, CUET PG MCA, and MAH MCA CET.
        </p>
      </section>

      <PracticeSections />
      <AvailableExams />

      {/* Results + Performance section */}
      <section className="bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
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