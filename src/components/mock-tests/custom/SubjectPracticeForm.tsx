// src/components/mock-tests/custom/SubjectPracticeForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  IconLibrary, 
  IconChevronRight, 
  IconClock,
  IconListNumbers,
  IconX
} from "@/components/ui/Icons"; 

const SUBJECTS = [
  "Mathematics",
  "Logical Reasoning",
  "Computer Awareness",
  "General English"
];

type SubjectPracticeFormProps = {
  subjects: string[];
};

// 2. Add the type to your component and destructure 'subjects'
export const SubjectPracticeForm = ({ subjects }: SubjectPracticeFormProps) => {
  const router = useRouter();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);

  // --- NEW STATE FOR MODAL & CONFIG ---
  const [selectedSubjectForConfig, setSelectedSubjectForConfig] = useState<string | null>(null);
  const [configSettings, setConfigSettings] = useState({ numQuestions: 20, duration: 30 }); // Default for subject tests

  const openConfigModal = (subject: string) => {
    if (!user) {
        alert("Please log in to start a test.");
        router.push('/login');
        return;
    }
    setSelectedSubjectForConfig(subject);
    // Reset defaults
    setConfigSettings({ numQuestions: 20, duration: 30 });
  };

  const handleStartTest = async () => {
    if (!user || !selectedSubjectForConfig) return;

    setIsLoading(true);
    try {
      // 1. Request the test with CUSTOM settings
      const response = await fetch('/api/mock-tests/create-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubjectForConfig,
          // No topic needed for Subject Wise
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
      setSelectedSubjectForConfig(null); // Close modal on error
    }
  };

  return (
    <div className="space-y-8 relative">
      
      {/* --- CONTENT AREA --- */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Select a Subject</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
            {SUBJECTS.map((subject) => (
              <div 
                key={subject}
                // UPDATED: onClick now opens modal
                onClick={() => openConfigModal(subject)}
                className="group flex items-center justify-between p-6 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <IconLibrary className="w-6 h-6" />
                  </div>
                  <div>
                      <span className="block text-lg font-bold text-slate-800 dark:text-white group-hover:text-indigo-900 dark:group-hover:text-indigo-300 transition-colors">{subject}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400"> comprehensive coverage</span>
                  </div>
                </div>

                <div className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors bg-slate-50 dark:bg-slate-800 p-2 rounded-full group-hover:bg-white dark:group-hover:bg-slate-900">
                     <IconChevronRight className="w-5 h-5" />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* --- CONFIGURATION MODAL --- */}
      {selectedSubjectForConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800 p-6 relative animate-in zoom-in-95">
                <button 
                    onClick={() => setSelectedSubjectForConfig(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <IconX className="w-6 h-6" />
                </button>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{selectedSubjectForConfig}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Customize your test parameters.</p>
                
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
                            {[20, 30, 45].map(mins => (
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
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
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