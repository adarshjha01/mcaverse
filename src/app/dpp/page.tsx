// src/app/dpp/page.tsx
import { DailyPractice } from "@/components/practice/DailyPractice";
import { IconFlame } from "@/components/ui/Icons";

export default function DailyPracticePage() {
    return (
        <main className="pt-16 min-h-screen bg-slate-50">
            {/* Header Section */}
            <section className="bg-indigo-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-800 rounded-full mb-4">
                        <IconFlame className="w-8 h-8 text-orange-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Daily Quest</h1>
                    <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
                        Consistency is the key to cracking MCA entrances. Solve one problem every day, keep your streak alive, and climb the leaderboard.
                    </p>
                </div>
            </section>

            {/* Practice Section */}
            <div className="container mx-auto px-4 py-12 -mt-10">
                <div className="max-w-2xl mx-auto">
                    <DailyPractice />
                    
                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            New question drops every day at midnight.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}