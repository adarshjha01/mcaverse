// src/app/mock-tests/history/page.tsx
import { TestHistory } from "@/components/mock-tests/TestHistory";
import { IconHistory } from "@/components/ui/Icons";

export default function TestHistoryPage() {
  return (
    <main className="pt-16">
      <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
        <IconHistory className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
        <h1 className="text-4xl font-bold mb-2">Test History</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Review your past performance and track your progress over time.
        </p>
      </section>
      <div className="container mx-auto px-4 py-16">
        <TestHistory />
      </div>
    </main>
  );
}