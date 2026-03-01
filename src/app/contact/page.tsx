// src/app/contact/page.tsx
import { FeedbackForm } from '@/components/contact/FeedbackForm';
import { ContactDetails } from '@/components/contact/ContactDetails';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* ── Hero Section ── */}
      <section className="relative pt-16 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/80 border-b border-slate-200/80 dark:border-slate-800">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-300/20 dark:bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 sm:w-80 h-64 sm:h-80 bg-purple-300/20 dark:bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative container mx-auto px-4 py-12 sm:py-16 lg:py-20 text-center">
          <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 mb-5 border border-indigo-200/60 dark:border-indigo-500/20">
            We&apos;d love to hear from you
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
              Get in Touch
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Share your feedback, ask questions, or just say hello. We respond within 24 hours.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="container mx-auto px-4 py-10 sm:py-14">
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