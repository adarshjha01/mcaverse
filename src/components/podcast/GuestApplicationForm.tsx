// src/components/podcast/GuestApplicationForm.tsx
"use client";

import { useEffect, useRef, useState } from 'react';

// Define a type for our form state
type FormState = {
  message?: string | null;
  errors?: { [key: string]: string[] | undefined; };
  success?: boolean;
};

export const GuestApplicationForm = () => {
  const [state, setState] = useState<FormState | undefined>();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setState(undefined);

    const formData = new FormData(event.currentTarget);
    
    try {
        const response = await fetch('/api/guest-application', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        setState(result);

    } catch (error) {
        console.error("Form submission error:", error);
        setState({ message: "An unexpected error occurred." });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200 sticky top-24">
      <h2 className="text-2xl font-bold mb-4">Want to be a Guest?</h2>
      <p className="text-slate-600 mb-6">
        If you're an industry professional, successful alumni, or have valuable insights for MCA students, we'd love to hear from you!
      </p>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
          <input type="text" id="name" name="name" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
          {state?.errors?.name && <p className="text-sm text-red-500 mt-1">{state.errors.name[0]}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
          <input type="email" id="email" name="email" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
          {state?.errors?.email && <p className="text-sm text-red-500 mt-1">{state.errors.email[0]}</p>}
        </div>
        <div>
          <label htmlFor="expertise" className="block text-sm font-medium text-slate-700">Area of Expertise</label>
          <input type="text" id="expertise" name="expertise" placeholder="e.g., AI/ML, Placements" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
          {state?.errors?.expertise && <p className="text-sm text-red-500 mt-1">{state.errors.expertise[0]}</p>}
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700">Why would you be a great guest?</label>
          <textarea id="message" name="message" rows={4} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
          {state?.errors?.message && <p className="text-sm text-red-500 mt-1">{state.errors.message[0]}</p>}
        </div>
        <button type="submit" disabled={loading} className="mt-6 w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 transition-colors">
            {loading ? 'Submitting...' : 'Submit Application'}
        </button>
        {state?.message && <p className={`text-sm mt-4 text-center ${state.success ? 'text-green-600' : 'text-red-500'}`}>{state.message}</p>}
      </form>
    </div>
  );
};
