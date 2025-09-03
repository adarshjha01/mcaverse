
// src/app/mock-tests/page.tsx
import { AvailableExams } from "@/components/mock-tests/AvailableExams";
import { RecentTestResults } from "@/components/mock-tests/RecentTestResults";
import { SubjectPerformance } from "@/components/mock-tests/SubjectPerformance";
import { IconClipboardCheck } from "@/components/ui/Icons";
import { PracticeSections } from "@/components/mock-tests/PracticeSections";

export default function MockTestsPage() {
  return (
    // The main layout now handles the navbar, so we remove it from here
    <main className="pt-16">
        <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
            <IconClipboardCheck className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
            <h1 className="text-4xl font-bold mb-2">Mock Tests & Practice Papers</h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Comprehensive practice tests for NIMCET, CUET PG MCA, and MAH MCA CET.
            </p>
        </section>
        <AvailableExams />
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

// import Link from 'next/link';
// // The admin SDK db object has a different API than the client SDK
// import { db } from '../../lib/firebaseAdmin'; // Using firebaseAdmin for server-side fetching

// // Define the type for our mock test data, ensuring all required fields are typed
// type MockTest = {
//   id: string;
//   title: string;
//   exam: string;
//   testType: string;
//   // You can add other optional fields if they exist
//   durationInMinutes?: number;
// };

// /**
//  * This is a React Server Component (RSC). It fetches data on the server
//  * before rendering the page, which is efficient and secure.
//  */
// async function getMockTests(): Promise<MockTest[]> {
//   try {
//     // Use the Firebase Admin SDK syntax to get a collection reference and fetch data
//     const mockTestsCollectionRef = db.collection('mockTests');
//     const testsSnapshot = await mockTestsCollectionRef.get();
    
//     if (testsSnapshot.empty) {
//       console.log("No mock tests found in the 'mockTests' collection.");
//       return [];
//     }
    
//     // Map over the documents to create an array of test objects
//     const tests: MockTest[] = [];
//     testsSnapshot.forEach(doc => {
//       tests.push({
//         id: doc.id,
//         ...doc.data(),
//       } as MockTest);
//     });
    
//     return tests;
//   } catch (error) {
//     console.error("Error fetching mock tests:", error);
//     // In a real application, you might want to handle this more gracefully
//     return []; 
//   }
// }

// // The main page component that displays the list of tests
// export default async function MockTestsListPage() {
//   const tests = await getMockTests();

//   return (
//     <div className="container mx-auto p-4 sm:p-8">
//       <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Available Mock Tests</h1>
      
//       {tests.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {tests.map(test => (
//             <Link 
//               key={test.id} 
//               // Construct the URL based on the 'exam' and 'testType' fields from Firestore
//               href={`/mock-tests/${test.exam}/${test.testType}`}
//               className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 transition-colors duration-200"
//             >
//               <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">{test.title}</h2>
//               <p className="font-normal text-gray-700 mt-2">
//                 Exam: <span className="font-semibold capitalize">{test.exam}</span>
//               </p>
//               <div className="mt-4">
//                 <span className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg">
//                   Start Test &rarr;
//                 </span>
//               </div>
//             </Link>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-10 px-4 bg-gray-50 rounded-lg">
//             <h2 className="text-xl font-semibold">No Tests Available</h2>
//             <p className="text-gray-500 mt-2">
//                 No mock tests have been added yet. Please check back later or contact an admin.
//             </p>
//         </div>
//       )}
//     </div>
//   );
// }

