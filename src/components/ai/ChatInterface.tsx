"use client";

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { getAIResponse } from '@/app/actions';
import { IconSendPurple } from '@/components/ui/Icons';

type Message = {
  role: 'user' | 'model';
  text: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={true}
      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-slate-400"
    >
      <IconSendPurple className="w-5 h-5" />
    </button>
  );
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, formAction] = useActionState(getAIResponse, null);
  const formRef = useRef<HTMLFormElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Handle server responses
  useEffect(() => {
    if (state?.response || state?.error) {
      const messageText =
        state.response ||
        state.error ||
        "Oops! Something went wrong. Try exploring other MCAverse features while I recharge. ⚡";

      setMessages((prev) => [...prev, { role: "model", text: messageText }]);
      formRef.current?.reset();
    }
  }, [state]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo(0, chatContainerRef.current.scrollHeight);
    }
  }, [messages]);

  // Optimistic update
  const handleOptimisticUpdate = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const prompt = formData.get("prompt") as string;
      if (prompt) {
        setMessages((prev) => [...prev, { role: "user", text: prompt }]);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200 sticky top-24 h-[70vh] flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-center">AI Study Buddy</h2>

      <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-4 pr-2">
        <div className="flex">
          <div className="bg-purple-600 text-white p-3 rounded-lg max-w-xs">
            <p className="text-sm">
              My developers are still tuning my AI brain! In the meantime watch some Podcast or explore other features of MCAverse :) 
            </p>
          </div>
        </div>

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.role === "user"
                  ? "bg-slate-200 text-slate-800"
                  : "bg-purple-600 text-white"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <form ref={formRef} action={formAction} onSubmit={handleOptimisticUpdate} className="relative">
          <input
            type="text"
            name="prompt"
            placeholder="Ask me anything..."
            className="w-full pl-4 pr-12 py-3 rounded-full bg-slate-100 border-slate-300 focus:ring-purple-500 focus:border-purple-500"
          />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
};
