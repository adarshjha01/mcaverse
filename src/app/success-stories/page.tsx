// src/app/success-stories/page.tsx
import { Navbar } from "@/components/landing/Navbar";
import { StoryList } from "@/components/success-stories/StoryList";
import { ShareJourneyForm } from "@/components/success-stories/ShareJourneyForm";
import { IconTrophy } from "@/components/ui/Icons";

export default function SuccessStoriesPage() {
  return (
    <div className="bg-white text-slate-800 min-h-screen">
      <Navbar />
      <main className="pt-16">
        <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
            <IconTrophy className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
            <h1 className="text-4xl font-bold mb-2">Success Stories</h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Inspiring journeys of MCA students who have achieved their career goals.
            </p>
        </section>

        <div className="container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <StoryList />
                </div>
                <div className="lg:col-span-1">
                    <ShareJourneyForm />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}