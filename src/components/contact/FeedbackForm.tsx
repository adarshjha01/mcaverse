// src/components/contact/FeedbackForm.tsx
"use client";

import { useState } from "react";

export const FeedbackForm = () => {
  const googleFormEmbedUrl = "https://forms.gle/qH3hbB7jo6A5P6Qd7";
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-0.5">
            Send Us Feedback
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Fill out the form below and we&apos;ll get back to you.
          </p>
        </div>
        <a
          href={googleFormEmbedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors flex-shrink-0"
        >
          Open in new tab
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      <div className="relative w-full h-[550px] sm:h-[700px] md:h-[850px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/50 dark:shadow-none">
        {/* Loading skeleton */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-900 z-10">
            <div className="w-8 h-8 border-2 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading form...
            </p>
          </div>
        )}
        <iframe
          src={googleFormEmbedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="Feedback Form"
          className="bg-white"
          onLoad={() => setLoaded(true)}
        >
          Loading…
        </iframe>
      </div>

      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2.5 text-center">
        Having trouble?{" "}
        <a
          href={googleFormEmbedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Open the form directly
        </a>
        .
      </p>
    </div>
  );
};