// src/app/ai-assistant/page.tsx
import { FeaturesGrid } from "@/components/ai/FeaturesGrid";
import { AnalysisInAction } from "@/components/ai/AnalysisInAction";
import { PerformanceDashboard } from "@/components/ai/PerformanceDashboard";
import { ChatInterface } from "@/components/ai/ChatInterface";
import { CtaSection } from "@/components/ai/CtaSection";
const IconBot = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>;

export default function AIAssistantPage() {
  return (
      <main className="pt-16">
        {/* Header */}
        <section className="py-20 text-center bg-white border-b border-slate-200">
            <div className="w-16 h-16 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                <IconBot className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold mb-2">AI-Powered Learning Assistant Coming Soon...</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Get personalized insights, mistake analysis, and study recommendations powered by advanced AI technology.
            </p>
        </section>

        <FeaturesGrid />

        {/* Main Content Area */}
        <section className="container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3">
                    <AnalysisInAction />
                    <PerformanceDashboard />
                </div>
                <div className="lg:col-span-2">
                    <ChatInterface />
                </div>
            </div>
        </section>

        <CtaSection />
      </main>
  );
}
