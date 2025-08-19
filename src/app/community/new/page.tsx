// src/app/community/new/page.tsx
import { Navbar } from "@/components/landing/Navbar";
import { NewPostForm } from "@/components/community/NewPostForm";

export default function NewPostPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-3 text-slate-800">Create a New Discussion</h1>
          <NewPostForm />
        </div>
      </main>
    </div>
  );
}

