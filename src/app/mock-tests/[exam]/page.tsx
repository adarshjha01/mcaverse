// src/app/mock-tests/[exam]/[testType]/page.tsx
import { db } from "@/lib/firebaseAdmin";
import { notFound } from "next/navigation";
import Link from "next/link";

type MockTest = {
  id: string;
  title: string;
  exam: string;
  durationInMinutes?: number;
};

const examNameMapping: { [key: string]: string } = {
    nimcet: "NIMCET",
    cuet: "CUET PG MCA",
    mahmca: "MAH MCA CET",
};

const testTypeTitleMapping: { [key: string]: string } = {
    'pyq': "Previous Year Questions",
    'full-length': "Full Length Mock Tests",
};

// Fetches tests based on exam (e.g., 'nimcet') and type (e.g., 'pyq')
async function getCategorizedTests(exam: string, testType: string): Promise<MockTest[]> {
  try {
    const testsRef = db.collection('mockTests');
    const snapshot = await testsRef.where('exam', '==', exam).where('testType', '==', testType).get();
    
    if (snapshot.empty) return [];

    const tests: MockTest[] = [];
    snapshot.forEach(doc => {
      tests.push({ id: doc.id, ...doc.data() } as MockTest);
    });
    return tests;
  } catch (error) {
    console.error("Error fetching categorized tests:", error);
    return [];
  }
}

// 1. Update Props Type to Promise
type PageProps = {
  params: Promise<{ exam: string, testType: string }>;
};

export default async function TestListPage({ params }: PageProps) {
    // 2. Await params before using them
    const { exam, testType } = await params;
    
    const tests = await getCategorizedTests(exam, testType);

    const examName = examNameMapping[exam];
    const testTypeTitle = testTypeTitleMapping[testType];
    
    if (!examName || !testTypeTitle) notFound();

    return (
        <main className="pt-16">
            <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
                <h1 className="text-4xl font-bold mb-2">{examName} - {testTypeTitle}</h1>
                <Link href={`/mock-tests/${exam}`} className="text-sm font-semibold text-indigo-600 hover:underline">
                    &larr; Back to categories
                </Link>
            </section>
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {tests.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tests.map(test => (
                                <div key={test.id} className="bg-white p-6 rounded-lg border border-slate-200 flex flex-col">
                                    <h3 className="text-lg font-semibold text-slate-800">{test.title}</h3>
                                    {test.durationInMinutes && <p className="text-sm text-slate-500 mt-2">{test.durationInMinutes} Minutes</p>}
                                    <Link href={`/mock-tests/take/${test.id}`} className="mt-6 w-full text-center bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700">
                                        Start Test
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-slate-500">No tests available in this category yet.</p>
                    )}
                </div>
            </div>
        </main>
    );
}