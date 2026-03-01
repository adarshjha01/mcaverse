import { RecentEpisodes } from "@/components/podcast/RecentEpisodes";
import { GuestApplicationForm } from "@/components/podcast/GuestApplicationForm";
import { IconSparkles } from "@/components/ui/Icons";

export default function PodcastPage() {
  return (
      <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 sm:pt-32 pb-20 sm:pb-28 bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Decorative blurs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-16 left-10 w-72 h-72 bg-violet-200/30 dark:bg-violet-900/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-100/20 dark:bg-purple-900/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100/80 dark:bg-violet-900/20 border border-violet-200/60 dark:border-violet-800/30 mb-6 backdrop-blur-sm">
                    <IconSparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <span className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wider">New Episodes Weekly</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight leading-[1.1]">
                    The MCAverse{' '}
                    <span className="relative inline-block">
                        <span className="bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">Podcast</span>
                        <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                            <path d="M2 8C50 2 150 2 198 8" stroke="url(#pod-underline)" strokeWidth="3" strokeLinecap="round" />
                            <defs><linearGradient id="pod-underline" x1="0" y1="0" x2="200" y2="0"><stop stopColor="#8b5cf6" /><stop offset="1" stopColor="#a855f7" /></linearGradient></defs>
                        </svg>
                    </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
                    Insightful conversations with industry experts, successful alumni, and career mentors — every week.
                </p>
            </div>

            {/* Wave divider */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 48" fill="none" className="w-full h-8 sm:h-12">
                    <path d="M0 48L60 42C120 36 240 24 360 20C480 16 600 20 720 26C840 32 960 40 1080 42C1200 44 1320 40 1380 38L1440 36V48H0Z" className="fill-white dark:fill-slate-950" />
                </svg>
            </div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-4 py-12 sm:py-16">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* On mobile: episodes first, form second. On desktop: episodes left, form sticky right */}
                <div className="lg:col-span-2 lg:order-1">
                    <RecentEpisodes />
                </div>
                <div className="lg:col-span-1 lg:order-2 lg:sticky lg:top-24">
                    <GuestApplicationForm />
                </div>
            </div>
        </div>
      </main>
  );
}
