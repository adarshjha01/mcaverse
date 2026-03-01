import { FeaturesGrid } from "@/components/ai/FeaturesGrid";
import { AnalysisInAction } from "@/components/ai/AnalysisInAction";
import { PerformanceDashboard } from "@/components/ai/PerformanceDashboard";
import { ChatInterface } from "@/components/ai/ChatInterface";
import { CtaSection } from "@/components/ai/CtaSection";

const IconBot = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 8V4H8"></path>
    <rect width="16" height="12" x="4" y="8" rx="2"></rect>
    <path d="M2 14h2"></path>
    <path d="M20 14h2"></path>
    <path d="M15 13v2"></path>
    <path d="M9 13v2"></path>
  </svg>
);

export default function AIAssistantPage() {
  return (
    <main className="pt-16">
      {/* Header */}
      <section className="py-10 sm:py-16 lg:py-20 text-center bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-3 sm:mb-4">
          <IconBot className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-slate-900 dark:text-slate-100 px-4">
          AI-Powered Learning Assistant Coming Soon...
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
          Get personalized insights, mistake analysis, and study recommendations powered by advanced AI technology.
        </p>
      </section>

      <FeaturesGrid />

      {/* Main Content Area */}
      <section className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
          {/* Chat on mobile comes first for visibility */}
          <div className="order-1 lg:order-2 lg:col-span-2">
            <ChatInterface />
          </div>
          <div className="order-2 lg:order-1 lg:col-span-3">
            <AnalysisInAction />
            <PerformanceDashboard />
          </div>
        </div>
      </section>

      <CtaSection />
    </main>
  );
}