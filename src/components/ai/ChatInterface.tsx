import { IconSendPurple } from '@/components/ui/Icons';

export const ChatInterface = () => {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 lg:sticky lg:top-24 h-[60vh] sm:h-[65vh] lg:h-[70vh] flex flex-col">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center text-slate-900 dark:text-slate-100">AI Study Buddy</h2>

      <div className="flex-grow overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2 no-scrollbar">
        {/* Static welcome message */}
        <div className="flex">
          <div className="bg-purple-600 text-white p-3 rounded-lg rounded-tl-none max-w-[85%] sm:max-w-[75%]">
            <p className="text-xs sm:text-sm leading-relaxed">
              My developers are still tuning my AI brain! In the meantime watch some Podcast or explore other features of MCAverse :)
            </p>
          </div>
        </div>

        {/* Coming soon placeholder */}
        <div className="flex-grow flex flex-col items-center justify-center text-center py-8 sm:py-12">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500 dark:text-purple-400">
              <path d="M12 8V4H8"></path>
              <rect width="16" height="12" x="4" y="8" rx="2"></rect>
              <path d="M2 14h2"></path>
              <path d="M20 14h2"></path>
              <path d="M15 13v2"></path>
              <path d="M9 13v2"></path>
            </svg>
          </div>
          <p className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300">Coming Soon!</p>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">AI chat is under development. Stay tuned for updates.</p>
        </div>
      </div>

      {/* Disabled input area */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="relative">
          <input
            type="text"
            disabled
            placeholder="Chat coming soon..."
            className="w-full pl-4 pr-12 py-2.5 sm:py-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base cursor-not-allowed opacity-60"
          />
          <button
            type="button"
            disabled
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-400 text-white rounded-full cursor-not-allowed"
            aria-label="Send message (coming soon)"
          >
            <IconSendPurple className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
