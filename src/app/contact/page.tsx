// src/app/contact/page.tsx
import { FeedbackForm } from '@/components/contact/FeedbackForm';
import { ContactDetails } from '@/components/contact/ContactDetails';
import { IconMessageCircle } from '@/components/ui/Icons';

export default function ContactPage() {
  return (
    <main className="pt-16">
      <section className="py-12 sm:py-16 text-center px-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <IconMessageCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-indigo-500 mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-slate-900 dark:text-white">Share Your Feedback</h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Your insights are valuable to us. Let us know how we can improve.
        </p>
      </section>
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <ContactDetails />
            </div>
          </div>
          <div className="lg:col-span-2">
            <FeedbackForm />
          </div>
        </div>
      </div>
    </main>
  );
}