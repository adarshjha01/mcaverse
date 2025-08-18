// src/components/success-stories/ShareJourneyForm.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { storage } from '@/lib/firebaseClient';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Define a type for our form state
type FormState = {
  message?: string | null;
  errors?: { [key: string]: string[] | undefined; };
  success?: boolean;
};

export const ShareJourneyForm = () => {
  const { user } = useAuth();
  const [state, setState] = useState<FormState | undefined>();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setFile(null);
    }
  }, [state]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setState(undefined);

    const formData = new FormData(event.currentTarget);
    
    try {
        if (file && user) {
            const storageRef = ref(storage, `success-stories/${user.uid}_${Date.now()}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            // Wait for the upload to complete and get the URL
            const snapshot = await uploadTask;
            const downloadURL = await getDownloadURL(snapshot.ref);
            formData.append('imageUrl', downloadURL);
        }

        const response = await fetch('/api/success-stories', {
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

  if (!user) {
    return (
        <div className="bg-slate-50 p-8 rounded-lg shadow-lg border border-slate-200 sticky top-24 text-center">
            <h2 className="text-2xl font-bold mb-4">Share Your Journey</h2>
            <p className="text-slate-600 mb-6">Inspire others by sharing your success story with the community.</p>
            <Link href="/login" className="w-full block bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700">
                Login to Share Your Story
            </Link>
        </div>
    );
  }

  return (
    <div className="bg-slate-50 p-8 rounded-lg shadow-lg border border-slate-200 sticky top-24">
      <h2 className="text-2xl font-bold mb-4">Share Your Journey</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">Your Name</label>
          <input type="text" id="name" name="name" defaultValue={user.displayName || ''} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
          {state?.errors?.name && <p className="text-sm text-red-500 mt-1">{state.errors.name[0]}</p>}
        </div>
        <div>
          <label htmlFor="batch" className="block text-sm font-medium text-slate-700">Batch Year</label>
          <input type="text" id="batch" name="batch" placeholder="e.g., 2022" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
          {state?.errors?.batch && <p className="text-sm text-red-500 mt-1">{state.errors.batch[0]}</p>}
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-slate-700">Current Company</label>
          <input type="text" id="company" name="company" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
          {state?.errors?.company && <p className="text-sm text-red-500 mt-1">{state.errors.company[0]}</p>}
        </div>
        <div>
            <label htmlFor="image" className="block text-sm font-medium text-slate-700">Your Photo (Optional)</label>
            <input type="file" id="image" name="image" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
        </div>
        <div>
          <label htmlFor="storyTitle" className="block text-sm font-medium text-slate-700">Story Title</label>
          <input type="text" id="storyTitle" name="storyTitle" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
          {state?.errors?.storyTitle && <p className="text-sm text-red-500 mt-1">{state.errors.storyTitle[0]}</p>}
        </div>
        <div>
          <label htmlFor="storyContent" className="block text-sm font-medium text-slate-700">Your Story</label>
          <textarea id="storyContent" name="storyContent" rows={5} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
          {state?.errors?.storyContent && <p className="text-sm text-red-500 mt-1">{state.errors.storyContent[0]}</p>}
        </div>
        <button type="submit" disabled={loading} className="mt-6 w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400">
            {loading ? "Submitting..." : "Share My Story"}
        </button>
        {state?.message && <p className={`text-sm mt-4 text-center ${state.success ? 'text-green-600' : 'text-red-500'}`}>{state.message}</p>}
      </form>
    </div>
  );
};
