// src/app/videos/page.tsx
import { Navbar } from "@/components/landing/Navbar";
import { VideoDashboard } from "@/components/videos/VideoDashboard";
import { IconVideo } from "@/components/ui/Icons";

export default function VideosPage() {
  return (
    <div className="bg-white text-slate-800 min-h-screen">
      <Navbar />
      <main className="pt-16">
        <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
            <IconVideo className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
            <h1 className="text-4xl font-bold mb-2">Video Tutorials</h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Master every concept with our structured video courses. Track your progress and conquer your syllabus.
            </p>
        </section>

        <div className="container mx-auto px-4 py-16">
            <VideoDashboard />
        </div>
      </main>
    </div>
  );
}
