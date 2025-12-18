// src/app/contact/page.tsx
import { FeedbackForm } from '@/components/contact/FeedbackForm';
import { ContactDetails } from '@/components/contact/ContactDetails';
import { IconMessageCircle } from '@/components/ui/Icons';

export default function ContactPage() {
  return (
    <main className="pt-16">
      <section className="py-16 text-center bg-slate-50 border-b border-slate-200">
        <IconMessageCircle className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
        <h1 className="text-4xl font-bold mb-2">Share Your Feedback</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Your insights are valuable to us. Let us know how we can improve.
        </p>
      </section>
      <div className="container mx-auto px-4 py-16">
        {/* Updated layout for better form display */}
        <div className="flex flex-col items-center gap-16 max-w-4xl mx-auto">
          <ContactDetails />
          <FeedbackForm />
        </div>
      </div>
    </main>
  );
}