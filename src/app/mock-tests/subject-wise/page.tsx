// src/app/mock-tests/subject-wise/page.tsx
import { db } from "@/lib/firebaseAdmin";
import { SubjectPracticeForm } from "@/components/mock-tests/custom/SubjectPracticeForm";
import { IconLibrary } from "@/components/ui/Icons";
import Link from 'next/link';

async function getUniqueSubjects(): Promise<string[]> {
  try {
    const questionsSnapshot = await db.collection('questions').select('subject').get();
    const subjects = new Set<string>();
    questionsSnapshot.forEach(doc => {
      const subject = doc.data().subject;
      if (subject) {
        subjects.add(subject);
      }
    });
    return Array.from(subjects).sort();
  } catch (error) {
    console.error("Error fetching unique subjects:", error);
    return [];
  }
}

export default async function SubjectWisePracticePage() {
  const subjects = await getUniqueSubjects();

  return (
    <main className="pt-16 min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-800 dark:via-violet-800 dark:to-indigo-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative container mx-auto px-4 py-14 sm:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 mb-5">
              <IconLibrary className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight">
              Subject Wise Practice
            </h1>
            <p className="text-sm sm:text-base text-purple-100 max-w-xl mx-auto leading-relaxed">
              Create a custom test to focus on a specific subject and strengthen your fundamentals.
            </p>
            <Link href="/mock-tests" className="inline-flex items-center gap-2 mt-5 text-sm font-medium text-purple-200 hover:text-white transition-colors">
              &larr; Back to all practice options
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full h-6 sm:h-8">
            <path d="M0 40L48 37.5C96 35 192 30 288 27.5C384 25 480 25 576 26.7C672 28.3 768 31.7 864 33.3C960 35 1056 35 1152 33.3C1248 31.7 1344 28.3 1392 26.7L1440 25V40H0Z" className="fill-slate-50 dark:fill-slate-900/50" />
          </svg>
        </div>
      </section>

      <div className="bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <div className="max-w-xl mx-auto">
            <SubjectPracticeForm subjects={subjects} />
          </div>
        </div>
      </div>
    </main>
  );
}