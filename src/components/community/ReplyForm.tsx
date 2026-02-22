// src/components/community/ReplyForm.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export const ReplyForm = ({ discussionId }: { discussionId: string }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      alert("You must be logged in to reply.");
      return;
    }
    
    setLoading(true);
    setError(null);
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    // Add author details manually from the logged-in user
    const content = formData.get('replyContent') as string;
    const payload = {
      discussionId,
      author: user.displayName || 'Anonymous',
      authorId: user.uid,
      content
    };
    
    try {
      // Get the secure token
      const token = await user.getIdToken();

      const response = await fetch('/api/discussions/reply', { 
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        form.reset();
        router.refresh(); // Refresh to show the new reply immediately
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to post reply.');
      }
    } catch (err) {
      setError("An error occurred while posting your reply.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center">
        <p className="text-slate-600 mb-2">You must be logged in to leave a reply.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
        <h3 className="text-xl font-bold mb-4">Leave a Reply</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
                <label htmlFor="replyContent" className="block text-sm font-medium text-slate-700">Your Reply</label>
                <textarea 
                    id="replyContent" 
                    name="replyContent" 
                    rows={5} 
                    required 
                    placeholder="Type your reply here..."
                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                ></textarea>
            </div>
            
            <div className="flex justify-end">
                 <button 
                    type="submit" 
                    disabled={loading} 
                    className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 transition-colors"
                >
                    {loading ? "Replying..." : "Post Reply"}
                </button>
            </div>
            
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </form>
    </div>
  );
};