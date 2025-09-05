// src/app/mock-tests/topic-wise/page.tsx
import { db } from "@/lib/firebaseAdmin";
import { TopicPracticeForm } from "@/components/mock-tests/custom/TopicPracticeForm";
import { IconFocus } from "@/components/ui/Icons";
import Link from 'next/link';

type SubjectsWithTopics = {
  [subject: string]: string[];
};

// Fetches a map of subjects to their unique topics
async function getSubjectsWithTopics(): Promise<SubjectsWithTopics> {
  try {
    const questionsSnapshot = await db.collection('questions').get();
    const subjectsMap: SubjectsWithTopics = {};

    questionsSnapshot.forEach(doc => {
      const data = doc.data();
      const { subject, topic } = data;

      if (subject && topic) {
        if (!subjectsMap[subject]) {
          subjectsMap[subject] = [];
        }
        if (!subjectsMap[subject].includes(topic)) {
          subjectsMap[subject].push(topic);
        }
      }
    });

    // Sort topics within each subject for consistent ordering
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
    <main className="pt-16">
      <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
        <IconFocus className="w-16 h-16 mx-auto text-orange-500 mb-4" />
        <h1 className="text-4xl font-bold mb-2">Topic Wise Practice</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Zero in on specific topics to master every concept.
        </p>
        <Link href="/mock-tests" className="text-sm font-semibold text-indigo-600 hover:underline mt-4 inline-block">
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