// src/app/about/page.tsx
import { FounderProfile } from "@/components/about/FounderProfile";
import { Achievements } from "@/components/about/Achievements";
import { JourneyTimeline } from "@/components/about/JourneyTimeline";
import { ValuesMissionVision } from "@/components/about/ValuesMissionVision";
import { JoinMission } from "@/components/about/JoinMission";
import { IconUserCircle } from "@/components/ui/Icons";

export default function AboutPage() {
  return (
      <main className="pt-16">
        {/* Page Header */}
        <section className="py-12 sm:py-16 text-center px-4 bg-white dark:bg-slate-950 transition-colors duration-300">
          <IconUserCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-slate-500 dark:text-slate-400 mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-slate-900 dark:text-white">About MCAverse</h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Learn about the vision, mission, and the journey behind MCAverse - your trusted companion for MCA success.
          </p>
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
