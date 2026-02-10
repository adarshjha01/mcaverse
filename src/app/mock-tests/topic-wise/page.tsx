import { db } from "@/lib/firebaseAdmin";
import { TopicPracticeForm } from "@/components/mock-tests/custom/TopicPracticeForm";
import { IconTarget } from "@/components/ui/Icons"; // Changed IconFocus to IconTarget (IconFocus might not exist in your icons file)
import Link from 'next/link';

// 1. FORCE DYNAMIC RENDERING (Disable Cache)
export const dynamic = "force-dynamic";

type SubjectsWithTopics = {
  [subject: string]: string[];
};

async function getSubjectsWithTopics(): Promise<SubjectsWithTopics> {
  try {
    const questionsSnapshot = await db.collection('questions').get();
    
    // 2. Add Logging to verify it's working
    console.log(`[TopicWisePage] Fetched ${questionsSnapshot.size} questions from DB.`);

    const subjectsMap: SubjectsWithTopics = {};

    questionsSnapshot.forEach(doc => {
      const data = doc.data();
      // Ensure we trim whitespace to avoid "Algebra" vs "Algebra " duplicates
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

    // Sort topics
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
    <main className="pt-16 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <section className="py-16 text-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <IconTarget className="w-16 h-16 mx-auto text-orange-500 mb-4" />
        <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">Topic Wise Practice</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Zero in on specific topics to master every concept.
        </p>
        <Link href="/mock-tests" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block">
            &larr; Back to all practice options
        </Link>
      </section>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto">
          <TopicPracticeForm data={subjectsWithTopics} />
        </div>
      </div>
    </main>
  );
}