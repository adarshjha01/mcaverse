// src/components/mock-tests/custom/TopicPracticeForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  IconTarget, 
  IconChevronRight, 
  IconSearch,
  IconZap,
  IconClock,
  IconListNumbers,
  IconX
} from "@/components/ui/Icons";
import { OngoingTestCard } from '@/components/mock-tests/OngoingTestCard'; 

// Need to add IconListNumbers to Icons.tsx later if you want the icon

type TopicPracticeFormProps = {
  data: { [subject: string]: string[] };
};

export const TopicPracticeForm = ({ data }: TopicPracticeFormProps) => {
  const router = useRouter();
  const { user } = useAuth();
  
  const subjects = Object.keys(data);
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0] || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- NEW STATE FOR MODAL & CONFIG ---
  const [selectedTopicForConfig, setSelectedTopicForConfig] = useState<string | null>(null);
  const [configSettings, setConfigSettings] = useState({ numQuestions: 10, duration: 15 });

  const topics = data[selectedSubject] || [];

  const filteredTopics = topics.filter(topic => 
    topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openConfigModal = (topic: string) => {
    if (!user) {
        alert("Please log in to start a test.");
        router.push('/login');
        return;
    }
    setSelectedTopicForConfig(topic);
    // Reset defaults
    setConfigSettings({ numQuestions: 10, duration: 15 });
  };


  const handleStartTest = async () => {
    if (!user || !selectedTopicForConfig) return;

    setIsLoading(true);
    try {
      const token = await user.getIdToken();
      // 1. Request the test with CUSTOM settings
      const response = await fetch('/api/mock-tests/create-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: selectedTopicForConfig,
          numQuestions: configSettings.numQuestions, 
          duration: configSettings.duration,
          userId: user.uid, 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create test');
      }

      router.push(`/mock-tests/take/${result.testId}`);
    } catch (error: any) {
      console.error("Error starting test:", error);
      alert(error.message || "Failed to start the test. Please try again.");
      setIsLoading(false);
      setSelectedTopicForConfig(null); // Close modal on error
    }
  };

  return (
    <div className="space-y-8 relative">

      {/* Ongoing test card */}
      <OngoingTestCard />
      
      {/* Auth gate banner */}
      {!user && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Login Required</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">You need to be logged in to start a practice test.</p>
          </div>
          <a href="/login" className="shrink-0 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors text-sm">
            Login
          </a>
        </div>
      )}

      {/* --- SUBJECT TABS --- */}
      <div className="flex flex-wrap gap-2 justify-center">
        {subjects.map(subject => (
          <button
            key={subject}
            onClick={() => { setSelectedSubject(subject); setSearchQuery(""); }}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedSubject === subject
                ? "bg-indigo-600 text-white shadow-lg scale-105"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-indigo-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 min-h-[400px]">
        
        {/* Case: No Topics */}
        {topics.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <IconZap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Coming Soon</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    We are curating high-quality questions for {selectedSubject}.
                </p>
            </div>
        ) : (
            <>
                {/* Search Bar */}
                <div className="relative mb-6">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                     <IconSearch className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder={`Search ${selectedSubject} topics...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 dark:bg-slate-800 dark:text-white transition-all"
                  />
                </div>

                {/* Topic List */}
                <div className="grid gap-3">
                  {filteredTopics.length > 0 ? (
                    filteredTopics.map((topic) => (
                      <div 
                        key={topic}
                        // UPDATED: onClick now opens modal
                        onClick={() => openConfigModal(topic)}
                        className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <IconTarget className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-900 dark:group-hover:text-indigo-300">{topic}</span>
                        </div>

                        <div className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                             <IconChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      No topics found matching &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
            </>
        )}
      </div>

      {/* --- CONFIGURATION MODAL --- */}
      {selectedTopicForConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 p-6 relative animate-in zoom-in-95">
                <button 
                    onClick={() => setSelectedTopicForConfig(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <IconX className="w-6 h-6" />
                </button>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{selectedTopicForConfig}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Configure your practice session.</p>
                
                <div className="space-y-6">
                    {/* Question Count Select */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            <IconListNumbers className="w-5 h-5 text-indigo-500" /> Number of Questions
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {[10, 20, 30].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setConfigSettings(prev => ({ ...prev, numQuestions: num }))}
                                    className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                                        configSettings.numQuestions === num
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-500'
                                        : 'border-slate-200 hover:border-indigo-300 text-slate-600 dark:border-slate-700 dark:text-slate-400'
                                    }`}
                                >
                                    {num} Qs
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Duration Select */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            <IconClock className="w-5 h-5 text-indigo-500" /> Duration (Minutes)
                        </label>
                         <div className="grid grid-cols-3 gap-2">
                            {[15, 30, 45].map(mins => (
                                <button
                                    key={mins}
                                    onClick={() => setConfigSettings(prev => ({ ...prev, duration: mins }))}
                                    className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                                        configSettings.duration === mins
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-500'
                                        : 'border-slate-200 hover:border-indigo-300 text-slate-600 dark:border-slate-700 dark:text-slate-400'
                                    }`}
                                >
                                    {mins} Mins
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={handleStartTest}
                        disabled={isLoading}
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200/50 dark:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center active:scale-[0.98]"
                    >
                        {isLoading ? (
                             <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                             "Start Practice Test"
                        )}
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};