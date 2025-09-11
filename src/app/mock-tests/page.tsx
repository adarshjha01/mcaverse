// src/app/mock-tests/page.tsx
import { AvailableExams } from "@/components/mock-tests/AvailableExams";
import { RecentTestResults } from "@/components/mock-tests/RecentTestResults";
import { SubjectPerformance } from "@/components/mock-tests/SubjectPerformance";
import { IconClipboardCheck } from "@/components/ui/Icons";
import { PracticeSections } from "@/components/mock-tests/PracticeSections";

export default function MockTestsPage() {
  return (
    <main className="pt-16">
        <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
            <IconClipboardCheck className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
            <h1 className="text-4xl font-bold mb-2">Mock Tests & Practice Papers</h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Comprehensive practice tests for NIMCET, CUET PG MCA, and MAH MCA CET.
            </p>
        </section>
        
        {/* These two components align with your vision */}
        <PracticeSections />
        <AvailableExams />
        

        <section className="bg-slate-50">
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