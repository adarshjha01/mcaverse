import { VideoDashboard } from "@/components/videos/VideoDashboard";
import { getCourseData } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const courseData = await getCourseData();

  const totalLectures = courseData.reduce(
    (acc, s) => acc + s.topics.reduce((a, t) => a + t.lectures.length, 0),
    0
  );
  const totalSubjects = courseData.length;
  const totalTopics = courseData.reduce((acc, s) => acc + s.topics.length, 0);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* ── Hero Section ── */}
      <section className="relative pt-16 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/80 border-b border-slate-200/80 dark:border-slate-800">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-300/20 dark:bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 sm:w-80 h-64 sm:h-80 bg-purple-300/20 dark:bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative container mx-auto px-4 py-12 sm:py-16 lg:py-20 text-center">


          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
              Video Lectures
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Master every concept with structured video courses. Track progress,
            bookmark for revision, and ace your syllabus.
          </p>

          {/* Stats pills */}
          {courseData.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <StatPill label={`${totalSubjects} Subjects`} />
              <StatPill label={`${totalTopics} Topics`} />
              <StatPill label={`${totalLectures} Lectures`} />
            </div>
          )}
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {courseData.length > 0 ? (
          <VideoDashboard initialCourseData={courseData} />
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
  );
}

function StatPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 shadow-sm">
      {label}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 sm:py-24">
      <p className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
        No Content Available
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        Course content is loading. If you&apos;re the admin, check your database
        connection and ensure the curriculum is seeded.
      </p>
    </div>
  );
}