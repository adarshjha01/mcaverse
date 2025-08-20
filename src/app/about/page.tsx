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
        <section className="py-16 text-center">
          <IconUserCircle className="w-16 h-16 mx-auto text-slate-500 mb-4" />
          <h1 className="text-4xl font-bold mb-2">About MCAverse</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
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
