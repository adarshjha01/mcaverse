// src/app/mock-tests/subject-wise/page.tsx
import { db } from "@/lib/firebaseAdmin";
import { SubjectPracticeForm } from "@/components/mock-tests/custom/SubjectPracticeForm";
import { IconLibrary } from "@/components/ui/Icons";
import Link from 'next/link';

// This function fetches all unique subject names from your questions
async function getUniqueSubjects(): Promise<string[]> {
  try {
    // Only fetch the 'subject' field — NOT full documents with question_text, options, etc.
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
    <main className="pt-16">
      <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
        <IconLibrary className="w-16 h-16 mx-auto text-purple-500 mb-4" />
        <h1 className="text-4xl font-bold mb-2">Subject Wise Practice</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Create a custom test to focus on a specific subject.
        </p>
         <Link href="/mock-tests" className="text-sm font-semibold text-indigo-600 hover:underline mt-4 inline-block">
            &larr; Back to all practice options
        </Link>
      </section>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto">
          <SubjectPracticeForm subjects={subjects} />
        </div>
      </div>
    </main>
  );
}