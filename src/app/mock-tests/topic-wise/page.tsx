// src/app/mock-tests/topic-wise/page.tsx
import { db } from "@/lib/firebaseAdmin";
import { TopicPracticeForm } from "@/components/mock-tests/custom/TopicPracticeForm";
import { IconTarget } from "@/components/ui/Icons";
import Link from 'next/link';

export const dynamic = "force-dynamic";

type SubjectsWithTopics = {
  [subject: string]: string[];
};

async function getSubjectsWithTopics(): Promise<SubjectsWithTopics> {
  try {
    const questionsSnapshot = await db.collection('questions')
      .select('subject', 'topic', 'deprecated')
      .get();
    
    console.log(`[TopicWisePage] Fetched ${questionsSnapshot.size} question metadata docs.`);

    const subjectsMap: SubjectsWithTopics = {};

    questionsSnapshot.forEach(doc => {
      const data = doc.data();
      
      if (data.deprecated === true) {
        return; 
      }

      const subject = data.subject?.trim();
      const topic = data.topic?.trim();

      if (subject && topic) {
        if (!subjectsMap[subject]) {
          subjectsMap[subject] = [];
        }
        if (!subjectsMap[subject].includes(topic)) {
          subjectsMap[subject].push(topic);
        }
      }
    });

    for (const subject in subjectsMap) {
      subjectsMap[subject].sort();
    }

    return subjectsMap;
  } catch (error) {
    console.error("Error fetching subjects with topics:", error);
    return {};
  }
}

export default async function TopicWisePracticePage() {
  const subjectsWithTopics = await getSubjectsWithTopics();

  return (
    <main className="pt-16 min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 dark:from-orange-700 dark:via-amber-700 dark:to-yellow-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative container mx-auto px-4 py-14 sm:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 mb-5">
              <IconTarget className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight">
              Topic Wise Practice
            </h1>
            <p className="text-sm sm:text-base text-orange-100 max-w-xl mx-auto leading-relaxed">
              Zero in on specific topics to master every concept. Targeted practice for maximum improvement.
            </p>
            <Link href="/mock-tests" className="inline-flex items-center gap-2 mt-5 text-sm font-medium text-orange-200 hover:text-white transition-colors">
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
            <TopicPracticeForm data={subjectsWithTopics} />
          </div>
        </div>
      </div>
    </main>
  );
}