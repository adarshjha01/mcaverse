// src/app/mock-tests/page.tsx
import { AvailableExams } from "@/components/mock-tests/AvailableExams";
import { RecentTestResults } from "@/components/mock-tests/RecentTestResults";
import { SubjectPerformance } from "@/components/mock-tests/SubjectPerformance";
import { IconClipboardCheck } from "@/components/ui/Icons";
import { PracticeSections } from "@/components/mock-tests/PracticeSections";
import { db } from "@/lib/firebaseAdmin";
import Link from "next/link";

// Define the type for our mock test data
type MockTest = {
  id: string;
  title: string;
  exam: string;
  testType: string;
  durationInMinutes?: number;
};

// Function to fetch mock tests from Firestore
async function getMockTests(): Promise<MockTest[]> {
  try {
    const mockTestsCollectionRef = db.collection('mockTests');
    const testsSnapshot = await mockTestsCollectionRef.get();
    
    if (testsSnapshot.empty) {
      console.log("No mock tests found in the 'mockTests' collection.");
      return [];
    }
    
    const tests: MockTest[] = [];
    testsSnapshot.forEach(doc => {
      tests.push({
        id: doc.id,
        ...doc.data(),
      } as MockTest);
    });
    
    return tests;
  } catch (error) {
    console.error("Error fetching mock tests:", error);
    return []; 
  }
}

export default async function MockTestsPage() {
  const tests = await getMockTests();

  return (
    <main className="pt-16">
        <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
            <IconClipboardCheck className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
            <h1 className="text-4xl font-bold mb-2">Mock Tests & Practice Papers</h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Comprehensive practice tests for NIMCET, CUET PG MCA, and MAH MCA CET.
            </p>
        </section>

        <AvailableExams />

        {/* Section to display all available tests */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">All Available Tests</h2>
            {tests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map(test => (
                  <div key={test.id} className="bg-slate-50 p-6 rounded-lg border border-slate-200 flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-800">{test.title}</h3>
                    <div className="flex gap-4 text-sm text-slate-500 mt-2">
                      <span>Exam: <span className="font-semibold capitalize">{test.exam}</span></span>
                      {test.durationInMinutes && <span>{test.durationInMinutes} Minutes</span>}
                    </div>
                    {/* This link will eventually go to the test interface page */}
                    <Link href={`/mock-tests/${test.id}`} className="mt-6 w-full text-center bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                      Start Test
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500">No mock tests available at the moment. Please check back later.</p>
            )}
          </div>
        </section>

        <PracticeSections />

        <section className="bg-slate-50">
            <div className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <RecentTestResults />
                    </div>
                    <div className="lg:col-span-1">
                        <SubjectPerformance />
                    </div>
                </div>
            </div>
        </section>
    </main>
  );
}