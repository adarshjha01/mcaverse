// src/app/mock-tests/page.tsx
import { Navbar } from "@/components/landing/Navbar";
import { AvailableExams } from "@/components/mock-tests/AvailableExams";
import { RecentTestResults } from "@/components/mock-tests/RecentTestResults";
import { SubjectPerformance } from "@/components/mock-tests/SubjectPerformance";
import { IconClipboardCheck } from "@/components/ui/Icons";

export default function MockTestsPage() {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Page Header */}
        <section className="py-16 text-center bg-slate-800 border-b border-slate-700">
            <IconClipboardCheck className="w-16 h-16 mx-auto text-indigo-400 mb-4" />
            <h1 className="text-4xl font-bold mb-2">Mock Tests & Practice Papers</h1>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                Comprehensive practice tests for NIMCET, CUET PG MCA, and MAH MCA CET with detailed analysis and performance tracking.
            </p>
        </section>

        <AvailableExams />

        {/* Dashboard Section */}
        <section className="container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <RecentTestResults />
                </div>
                <div className="lg:col-span-1">
                    <SubjectPerformance />
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}