import { FounderProfile } from "@/components/about/FounderProfile";
import { Achievements } from "@/components/about/Achievements";
import { JourneyTimeline } from "@/components/about/JourneyTimeline";
import { ValuesMissionVision } from "@/components/about/ValuesMissionVision";
import { JoinMission } from "@/components/about/JoinMission";
import { IconSparkles } from "@/components/ui/Icons";

export default function AboutPage() {
  return (
      <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 sm:pt-32 pb-20 sm:pb-28 bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Decorative blurs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-16 left-10 w-72 h-72 bg-teal-200/30 dark:bg-teal-900/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-100/20 dark:bg-cyan-900/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100/80 dark:bg-teal-900/20 border border-teal-200/60 dark:border-teal-800/30 mb-6 backdrop-blur-sm">
                    <IconSparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">Our Story</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight leading-[1.1]">
                    About{' '}
                    <span className="relative inline-block">
                        <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">MCAverse</span>
                        <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                            <path d="M2 8C50 2 150 2 198 8" stroke="url(#about-underline)" strokeWidth="3" strokeLinecap="round" />
                            <defs><linearGradient id="about-underline" x1="0" y1="0" x2="200" y2="0"><stop stopColor="#14b8a6" /><stop offset="1" stopColor="#10b981" /></linearGradient></defs>
                        </svg>
                    </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    The vision, mission, and journey behind your trusted companion for MCA success.
                </p>
            </div>

            {/* Wave divider */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 48" fill="none" className="w-full h-8 sm:h-12">
                    <path d="M0 48L60 42C120 36 240 24 360 20C480 16 600 20 720 26C840 32 960 40 1080 42C1200 44 1320 40 1380 38L1440 36V48H0Z" className="fill-white dark:fill-slate-950" />
                </svg>
            </div>
        </section>

        {/* Main Content Sections */}
        <FounderProfile />
        <Achievements />
        <JourneyTimeline />
        <ValuesMissionVision />
        <JoinMission />
      </main>
  );
}
