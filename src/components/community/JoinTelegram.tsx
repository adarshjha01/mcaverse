// src/components/community/JoinTelegram.tsx
import { IconSend, IconMessageCircle } from "@/components/ui/Icons";

export const JoinTelegram = () => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200 sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Join us on Telegram</h2>
            <p className="text-slate-600 mb-6">
                Get instant updates, join live discussions, and be part of our active community.
            </p>
            <div className="space-y-4">
                <a 
                    href="https://t.me/adarshjhanitkurukshetra" // <-- UPDATED LINK
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 bg-sky-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-sky-600 transition-colors"
                >
                    <IconSend />
                    <span>Join Channel</span>
                </a>
                <a 
                    href="https://t.me/NIT_MCA" // <-- UPDATED LINK
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 bg-slate-700 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-slate-800 transition-colors"
                >
                    <IconMessageCircle className="w-6 h-6" />
                    <span>Join Discussion Group</span>
                </a>
            </div>
        </div>
    );
};