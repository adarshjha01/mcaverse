// src/app/podcast/page.tsx
import { Navbar } from "@/components/landing/Navbar";
import { RecentEpisodes } from "@/components/podcast/RecentEpisodes";
import { GuestApplicationForm } from "@/components/podcast/GuestApplicationForm";
import { IconMic } from "@/components/ui/Icons";

export default function PodcastPage() {
  return (
    <div className="bg-slate-50 text-slate-800">
      <Navbar />
      <main className="pt-16">
        <section className="py-16 text-center bg-white border-b border-slate-200">
          <IconMic className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
          <h1 className="text-4xl font-bold mb-2">The MCAverse Podcast</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Tune in for insightful conversations with industry experts, successful alumni, and career mentors.
          </p>
        </section>
        <div className="container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <RecentEpisodes />
                </div>
                <div className="lg:col-span-1">
                    <GuestApplicationForm />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
