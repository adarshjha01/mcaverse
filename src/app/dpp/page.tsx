// src/app/dpp/page.tsx
import { DppDashboard } from "@/components/practice/DppDashboard";
import { dppData } from "@/db/dpp-data";
import { IconTarget } from "@/components/ui/Icons";

export default function DppPage() {
    // In a real app, this data would be fetched from a database
    const data = dppData;

    return (
        <main className="pt-16">
            <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
                <IconTarget className="w-16 h-16 mx-auto text-orange-500 mb-4" />
                <h1 className="text-4xl font-bold mb-2">Daily Practice Problems (DPP)</h1>
                <p className="text-lg text-slate-600">Sharpen your skills with a fresh set of problems every day.</p>
            </section>
            <div className="container mx-auto px-4 py-16">
                <DppDashboard initialData={data} />
            </div>
        </main>
    );
}
