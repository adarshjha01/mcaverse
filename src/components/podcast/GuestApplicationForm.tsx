// src/components/podcast/GuestApplicationForm.tsx
"use client";

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { submitGuestApplication } from '@/app/actions';

type FormState = {
  message: string | null;
  errors?: { name?: string[]; email?: string[]; expertise?: string[]; message?: string[]; };
  success: boolean;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="mt-6 w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors focus:outline-none disabled:bg-slate-400">
      {pending ? 'Submitting...' : 'Submit Application'}
    </button>
  );
}

export const GuestApplicationForm = () => {
  const initialState: FormState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(submitGuestApplication, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200 sticky top-24">
      <h2 className="text-2xl font-bold mb-4">Want to be a Guest?</h2>
      <p className="text-slate-600 mb-6">If you're an industry professional, successful alumni, or have valuable insights for MCA students, we'd love to hear from you!</p>
      <form ref={formRef} action={dispatch}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
            <input type="text" id="name" name="name" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            {state.errors?.name && <p className="text-sm text-red-500 mt-1">{state.errors.name[0]}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
            <input type="email" id="email" name="email" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            {state.errors?.email && <p className="text-sm text-red-500 mt-1">{state.errors.email[0]}</p>}
          </div>
          <div>
            <label htmlFor="expertise" className="block text-sm font-medium text-slate-700">Area of Expertise</label>
            <input type="text" id="expertise" name="expertise" placeholder="e.g., AI/ML, Placements" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            {state.errors?.expertise && <p className="text-sm text-red-500 mt-1">{state.errors.expertise[0]}</p>}
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700">Why would you be a great guest?</label>
            <textarea id="message" name="message" rows={4} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            {state.errors?.message && <p className="text-sm text-red-500 mt-1">{state.errors.message[0]}</p>}
          </div>
        </div>
        <SubmitButton />
        {state.success && <p className="text-sm text-green-600 mt-4 text-center">{state.message}</p>}
        {!state.success && state.message && !state.errors && <p className="text-sm text-red-500 mt-4 text-center">{state.message}</p>}
      </form>
    </div>
  );
};