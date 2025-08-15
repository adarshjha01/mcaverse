// src/components/ai/FeaturesGrid.tsx
import { IconCode, IconTargetRed, IconTrendingUpGreen, IconClipboardList } from "@/components/ui/Icons";

const features = [
    { icon: <IconCode className="w-8 h-8 text-purple-600"/>, title: "Smart Analysis", desc: "AI-powered analysis of your test performance with detailed insights and recommendations." },
    { icon: <IconTargetRed className="w-8 h-8 text-red-600"/>, title: "Mistake Pattern Recognition", desc: "Identifies recurring mistake patterns and provides targeted practice recommendations." },
    { icon: <IconTrendingUpGreen className="w-8 h-8 text-green-600"/>, title: "Performance Tracking", desc: "Track your progress over time with AI-generated performance analytics and trends." },
    { icon: <IconClipboardList className="w-8 h-8 text-yellow-600"/>, title: "Personalized Study Plan", desc: "Get customized study plans based on your strengths and areas for improvement." },
];

export const FeaturesGrid = () => (
    <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">AI-Driven Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map(f => (
                    <div key={f.title} className="bg-white p-6 rounded-lg shadow-md border border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                        <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-4 bg-opacity-10 ${
                            f.title.includes('Smart') ? 'bg-purple-500' : f.title.includes('Mistake') ? 'bg-red-500' : f.title.includes('Performance') ? 'bg-green-500' : 'bg-yellow-500'
                        }`}>
                            {f.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                        <p className="text-slate-600">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
