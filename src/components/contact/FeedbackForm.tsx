// src/components/contact/FeedbackForm.tsx
"use client";

export const FeedbackForm = () => {
  // IMPORTANT: Replace this with the embed link you copied from your Google Form
  const googleFormEmbedUrl = "https://forms.gle/qH3hbB7jo6A5P6Qd7";

  return (
    <div className="w-full h-[900px] overflow-hidden rounded-lg shadow-lg border border-slate-200">
      <iframe
        src={googleFormEmbedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="Feedback Form"
      >
        Loading…
      </iframe>
    </div>
  );
};