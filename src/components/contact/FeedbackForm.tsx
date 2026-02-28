// src/components/contact/FeedbackForm.tsx
"use client";

export const FeedbackForm = () => {
  const googleFormEmbedUrl = "https://forms.gle/qH3hbB7jo6A5P6Qd7";

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Send Us Feedback</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Fill out the form below and we&apos;ll get back to you as soon as possible.
      </p>
      <div className="w-full h-[600px] sm:h-[750px] md:h-[900px] overflow-hidden rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <iframe
          src={googleFormEmbedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="Feedback Form"
          className="bg-white"
        >
          Loading…
        </iframe>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
        If the form doesn&apos;t load,{" "}
        <a href={googleFormEmbedUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          open it directly
        </a>.
      </p>
    </div>
  );
};