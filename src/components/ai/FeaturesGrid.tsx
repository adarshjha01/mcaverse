// src/components/ai/FeaturesGrid.tsx
import { IconCode, IconTargetRed, IconTrendingUpGreen, IconClipboardList } from "@/components/ui/Icons";

const features = [
    { icon: <IconCode className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400"/>, title: "Smart Analysis", desc: "AI-powered analysis of your test performance with detailed insights and recommendations.", bgClass: "bg-purple-500/10 dark:bg-purple-500/20" },
    { icon: <IconTargetRed className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400"/>, title: "Mistake Pattern Recognition", desc: "Identifies recurring mistake patterns and provides targeted practice recommendations.", bgClass: "bg-red-500/10 dark:bg-red-500/20" },
    { icon: <IconTrendingUpGreen className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400"/>, title: "Performance Tracking", desc: "Track your progress over time with AI-generated performance analytics and trends.", bgClass: "bg-green-500/10 dark:bg-green-500/20" },
    { icon: <IconClipboardList className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 dark:text-yellow-400"/>, title: "Personalized Study Plan", desc: "Get customized study plans based on your strengths and areas for improvement.", bgClass: "bg-yellow-500/10 dark:bg-yellow-500/20" },
];

export const FeaturesGrid = () => (
    <section className="bg-slate-50 dark:bg-slate-900/50 py-12 sm:py-16 lg:py-20 transition-colors duration-300">
        <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-slate-900 dark:text-slate-100">AI-Driven Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {features.map(f => (
                    <div key={f.title} className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-2">
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mb-3 sm:mb-4 ${f.bgClass}`}>
                            {f.icon}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">{f.title}</h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
