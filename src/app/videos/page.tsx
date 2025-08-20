// src/app/videos/page.tsx
import { VideoDashboard } from "@/components/videos/VideoDashboard";
import { IconVideo } from "@/components/ui/Icons";
import { getCourseData } from "@/app/actions"; // Import the new action

export default async function VideosPage() {
  // Fetch course data on the server when the page loads
  const courseData = await getCourseData();

  return (
      <main className="pt-16">
        <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
            <IconVideo className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
            <h1 className="text-4xl font-bold mb-2">Video Tutorials</h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Master every concept with our structured video courses. Track your progress and conquer your syllabus.
            </p>
        </section>

        <div className="container mx-auto px-4 py-16">
            {/* Pass the fetched data to the client component */}
            <VideoDashboard initialCourseData={courseData} />
        </div>
      </main>
  );
}
