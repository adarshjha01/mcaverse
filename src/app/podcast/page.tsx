// src/app/podcast/page.tsx

import { RecentEpisodes } from "@/components/podcast/RecentEpisodes";
import { GuestApplicationForm } from "@/components/podcast/GuestApplicationForm";
import { IconMic } from "@/components/ui/Icons";

export default function PodcastPage() {
  return (
      <main className="pt-16">
        <section className="py-12 sm:py-16 text-center px-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <IconMic className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-indigo-500 mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-slate-900 dark:text-white">The MCAverse Podcast</h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Tune in for insightful conversations with industry experts, successful alumni, and career mentors.
          </p>
        </section>
        <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                <div className="lg:col-span-2">
                    <RecentEpisodes />
                </div>
                <div className="lg:col-span-1">
                    <GuestApplicationForm />
                </div>
            </div>
        </div>
      </main>
  );
}
