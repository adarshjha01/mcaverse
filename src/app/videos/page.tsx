// src/app/videos/page.tsx
import { VideoDashboard } from "@/components/videos/VideoDashboard";
import { IconVideo } from "@/components/ui/Icons";
import { getCourseData } from "@/app/actions"; 

export const dynamic = 'force-dynamic'; // Ensure page doesn't cache stale data forever

export default async function VideosPage() {
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
            {courseData.length > 0 ? (
                <VideoDashboard initialCourseData={courseData} />
            ) : (
                <div className="text-center py-12">
                    <p className="text-xl text-slate-500">Loading course content or no content available...</p>
                    <p className="text-sm text-slate-400 mt-2">If you are the admin, please check your database connection.</p>
                </div>
            )}
        </div>
      </main>
  );
}