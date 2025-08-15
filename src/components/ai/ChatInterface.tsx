// src/components/ai/ChatInterface.tsx
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
        <button type="submit" disabled={pending} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-slate-400">
            <IconSendPurple className="w-5 h-5" />
        </button>
    );
}

export const ChatInterface = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [state, formAction] = useActionState(getAIResponse, null);
    const formRef = useRef<HTMLFormElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (state?.response) {
            setMessages(prev => [...prev, { role: 'model', text: state.response }]);
        }
        if (state?.error) {
            setMessages(prev => [...prev, { role: 'model', text: `Error: ${state.error}` }]);
        }
    }, [state]);
    
    useEffect(() => {
        chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
    }, [messages]);

    const handleFormSubmit = (formData: FormData) => {
        const prompt = formData.get('prompt') as string;
        if (!prompt) return;

        const newMessages: Message[] = [...messages, { role: 'user', text: prompt }];
        setMessages(newMessages);
        
        const historyForApi = newMessages.slice(0, -1).map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));
        
        formData.set('history', JSON.stringify(historyForApi));
        formAction(formData);
        formRef.current?.reset();
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200 sticky top-24 h-[70vh] flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-center">AI Study Buddy</h2>
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-4 pr-2">
                {/* Initial Message */}
                <div className="flex">
                    <div className="bg-purple-600 text-white p-3 rounded-lg max-w-xs">
                        <p className="text-sm">Always here to help you learn!</p>
                    </div>
                </div>
                {/* Chat Messages */}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-xs ${
                            msg.role === 'user' ? 'bg-slate-200 text-slate-800' : 'bg-purple-600 text-white'
                        }`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
                <form ref={formRef} action={handleFormSubmit} className="relative">
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