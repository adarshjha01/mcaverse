// src/app/community/page.tsx
import { Navbar } from "@/components/landing/Navbar";
import { ConnectWithUs } from "@/components/community/ConnectWithUs"; // <-- UPDATED IMPORT
import { DiscussionList } from "@/components/community/DiscussionList";
import { IconUsers } from "@/components/ui/Icons";

export default function CommunityPage() {
  return (
    <div className="bg-slate-50 text-slate-800">
      <Navbar />
      <main className="pt-16">
        {/* Page Header */}
        <section className="py-16 text-center bg-white border-b border-slate-200">
          <IconUsers className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
          <h1 className="text-4xl font-bold mb-2">Community Hub</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Connect with fellow students, ask questions, and grow together.
          </p>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <DiscussionList />
                </div>
                <div className="lg:col-span-1">
                    <ConnectWithUs /> {/* <-- UPDATED COMPONENT */}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
