// src/components/community/ReplyForm.tsx
"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { addReply } from '@/app/actions';
import { useEffect, useRef } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400">
      {pending ? "Replying..." : "Post Reply"}
    </button>
  );
}

export const ReplyForm = ({ discussionId }: { discussionId: string }) => {
  const [state, formAction] = useActionState(addReply, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
        <h3 className="text-xl font-bold mb-4">Leave a Reply</h3>
        <form ref={formRef} action={formAction} className="space-y-4">
            <input type="hidden" name="discussionId" value={discussionId} />
            <div>
                <label htmlFor="author" className="block text-sm font-medium text-slate-700">Your Name</label>
                <input type="text" id="author" name="author" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"/>
                {state?.errors?.author && <p className="text-sm text-red-500 mt-1">{state.errors.author[0]}</p>}
            </div>
            <div>
                <label htmlFor="replyContent" className="block text-sm font-medium text-slate-700">Your Reply</label>
                <textarea id="replyContent" name="replyContent" rows={5} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                {state?.errors?.replyContent && <p className="text-sm text-red-500 mt-1">{state.errors.replyContent[0]}</p>}
            </div>
            <div className="flex justify-end">
                <SubmitButton />
            </div>
            {state?.message && <p className="text-sm text-red-500 text-center">{state.message}</p>}
        </form>
    </div>
  );
};
