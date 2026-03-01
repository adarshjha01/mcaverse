// src/components/mock-tests/TestInterface.tsx
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { LatexText } from '@/components/ui/LatexText';
import { 
  IconClock, IconChevronRight, IconMenu2, IconX, IconInfoCircle, IconMaximize, IconMinimize, IconLock 
} from "@/components/ui/Icons"; 
import { ReportBugModal, ReportBugButton } from '@/components/mock-tests/ReportBugModal';

// --- TYPES ---
type Question = {
  id: string;
  question_text: string;
  options: string[];
  subject?: string;
};

type MockTestSection = {
  name: string;
  duration: number;
  questionCount: number;
};

type MockTest = {
  id: string;
  title: string;
  durationInMinutes: number;
  question_ids: string[];
  sections?: MockTestSection[];
  subject?: string;
  topic?: string;
};

type TestInterfaceProps = {
  test: MockTest;
  questions: Question[];
};

type QuestionStatus = 'not_visited' | 'not_answered' | 'answered' | 'marked_review';

// --- HELPER: Safely exit fullscreen and wait for browser to stabilize ---
async function safeExitFullscreen(): Promise<void> {
  if (document.fullscreenElement) {
    try {
      await document.exitFullscreen();
    } catch {
      // Already exited or not supported
    }
  }
  // Always wait for the browser to repaint after any fullscreen transition
  await new Promise(resolve => setTimeout(resolve, 300));
}

// --- CUSTOM CONFIRM MODAL (works reliably in fullscreen) ---
function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onConfirm();
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onConfirm, onCancel]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onCancel}>
      <div
        className="bg-white rounded-xl shadow-2xl p-6 mx-4 max-w-sm w-full border border-slate-200 animate-in fade-in zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <p className="text-slate-800 font-medium text-base leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export const TestInterface = ({ test, questions }: TestInterfaceProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  // --- FORCE LIGHT MODE DURING TEST ---
  useEffect(() => {
    const previousTheme = resolvedTheme || 'system';
    setTheme('light');
    return () => {
      setTheme(previousTheme);
    };
    // Only run on mount/unmount — ignore resolvedTheme changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- DERIVE SECTIONS IF MISSING ---
  const sections = useMemo(() => {
    if (test.sections && test.sections.length > 0) return test.sections;
    return [{ name: "General Section", duration: test.durationInMinutes, questionCount: questions.length }];
  }, [test, questions.length]);

  // --- STATE ---
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [statusMap, setStatusMap] = useState<{ [key: string]: QuestionStatus }>({});
  
  const [timeLeft, setTimeLeft] = useState(sections[0].duration * 60);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Custom confirm modal state (replaces window.confirm which breaks fullscreen)
  const [confirmModal, setConfirmModal] = useState<{ message: string; resolve: (val: boolean) => void } | null>(null);
  const [reportBugOpen, setReportBugOpen] = useState(false);

  // Refs for stable access in timer callback
  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;
  const wasFullscreenRef = useRef(false);

  // Custom confirm that works inside fullscreen
  const showConfirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmModal({ message, resolve });
    });
  }, []);

  const handleConfirmYes = useCallback(() => {
    confirmModal?.resolve(true);
    setConfirmModal(null);
  }, [confirmModal]);

  const handleConfirmNo = useCallback(() => {
    confirmModal?.resolve(false);
    setConfirmModal(null);
  }, [confirmModal]);

  // --- DERIVED HELPERS ---
  const currentSection = sections[currentSectionIndex];

  const sectionIndices = useMemo(() => {
    let start = 0;
    for (let i = 0; i < currentSectionIndex; i++) {
      start += sections[i].questionCount;
    }
    return { start, end: start + currentSection.questionCount - 1 };
  }, [currentSectionIndex, sections]);

  useEffect(() => {
    if (currentQuestionIndex < sectionIndices.start || currentQuestionIndex > sectionIndices.end) {
      setCurrentQuestionIndex(sectionIndices.start);
    }
  }, [currentSectionIndex, sectionIndices, currentQuestionIndex]);

  // --- INITIALIZATION ---
  useEffect(() => {
    const initialStatus: { [key: string]: QuestionStatus } = {};
    questions.forEach(q => { initialStatus[q.id] = 'not_visited'; });
    if (questions.length > 0) initialStatus[questions[0].id] = 'not_answered';
    setStatusMap(initialStatus);
  }, [questions]);

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (timeLeft === 0) {
      handleSectionSubmitRef.current();
    }
    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // --- FULL SCREEN ---
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFs = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      if (fs) wasFullscreenRef.current = true;
    };
    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, []);

  // --- NAVIGATION HANDLERS ---
  const handleNavigation = (newIndex: number) => {
    if (newIndex < sectionIndices.start || newIndex > sectionIndices.end) return;

    const oldId = questions[currentQuestionIndex].id;
    setStatusMap(prev => {
        if (answers[oldId] === undefined && prev[oldId] !== 'marked_review') {
            return { ...prev, [oldId]: 'not_answered' };
        }
        return prev;
    });
    setCurrentQuestionIndex(newIndex);
    const newId = questions[newIndex].id;
    setStatusMap(prev => (prev[newId] === 'not_visited' ? { ...prev, [newId]: 'not_answered' } : prev));
  };

  const handleAnswer = (optionIndex: number) => {
    const qId = questions[currentQuestionIndex].id;
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
    setStatusMap(prev => ({ ...prev, [qId]: 'answered' }));
  };

  const handleClearResponse = () => {
    const qId = questions[currentQuestionIndex].id;
    const newAnswers = { ...answers }; delete newAnswers[qId]; setAnswers(newAnswers);
    setStatusMap(prev => ({ ...prev, [qId]: 'not_answered' }));
  };

  const handleMarkForReview = () => {
    const qId = questions[currentQuestionIndex].id;
    setStatusMap(prev => ({ ...prev, [qId]: 'marked_review' }));
    if (currentQuestionIndex < sectionIndices.end) handleNavigation(currentQuestionIndex + 1);
  };

  // --- SECTION SUBMIT / NEXT SECTION ---
  const handleSectionSubmit = async () => {
    const isLastSection = currentSectionIndex === sections.length - 1;
    
    if (isLastSection) {
      handleSubmitTest();
    } else {
      const nextIndex = currentSectionIndex + 1;
      const nextSection = sections[nextIndex];
      
      const confirmed = await showConfirm(`Submit ${currentSection.name} and start ${nextSection.name}? You cannot go back.`);
      if (confirmed) {
          setCurrentSectionIndex(nextIndex);
          setTimeLeft(nextSection.duration * 60);
      }
    }
  };

  // --- FINAL SUBMIT (FULLSCREEN-SAFE) ---
  const handleSubmitTest = useCallback(async () => {
    if (!user || isSubmitting) return;

    // Use custom confirm instead of window.confirm (which breaks fullscreen)
    if (timeLeftRef.current > 0) {
      const confirmed = await showConfirm("Finish Test and Submit?");
      if (!confirmed) return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 1. Exit fullscreen FIRST, before any API call or navigation
      //    This ensures the browser is in normal mode for the redirect.
      const wasInFullscreen = !!document.fullscreenElement || wasFullscreenRef.current;
      await safeExitFullscreen();

      // 2. Submit to API
      const token = await user.getIdToken();
      const response = await fetch('/api/mock-tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId: user.uid, testId: test.id, answers }),
      });
      
      if (!response.ok) throw new Error('Failed');
      const result = await response.json();

      // 3. Extra safety delay if we were in fullscreen
      if (wasInFullscreen) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // 4. Navigate using window.location for maximum reliability after fullscreen exit
      //    router.push can fail silently during browser repaint after fullscreen transition
      const targetUrl = `/mock-tests/take/${test.id}/results/${result.attemptId}`;
      window.location.href = targetUrl;
      
    } catch (e) { 
        alert("Error submitting. Please check connection."); 
        setIsSubmitting(false); 
    }
  }, [user, test.id, answers, isSubmitting, showConfirm]);

  // Keep a ref to handleSectionSubmit for the timer
  const handleSectionSubmitRef = useRef(handleSectionSubmit);
  handleSectionSubmitRef.current = handleSectionSubmit;

  // --- RENDER ---
  const currentQuestion = questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const sectionQuestions = questions.slice(sectionIndices.start, sectionIndices.end + 1);
  const sectionAnsweredCount = sectionQuestions.filter(q => statusMap[q.id] === 'answered').length;

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 font-sans text-slate-900">
      
      {/* CUSTOM CONFIRM MODAL (fullscreen safe) */}
      {confirmModal && (
        <ConfirmModal message={confirmModal.message} onConfirm={handleConfirmYes} onCancel={handleConfirmNo} />
      )}

      {/* REPORT BUG MODAL (fullscreen safe) */}
      {currentQuestion && user && (
        <ReportBugModal
          isOpen={reportBugOpen}
          onClose={() => setReportBugOpen(false)}
          questionId={currentQuestion.id}
          questionNumber={currentQuestionIndex + 1}
          testId={test.id}
          getToken={() => user.getIdToken()}
          lightOnly
        />
      )}

      {/* HEADER */}
      <header className="h-14 bg-white border-b border-slate-200/80 flex items-center justify-between px-3 sm:px-5 shrink-0 shadow-sm z-20">
        <h1 className="font-bold text-slate-800 truncate text-sm hidden sm:block max-w-[200px] lg:max-w-sm">{test.title}</h1>
        
        {/* SECTION TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mx-2">
            {sections.map((sec, idx) => {
                const isActive = idx === currentSectionIndex;
                const isLocked = idx > currentSectionIndex;
                const isCompleted = idx < currentSectionIndex;
                
                return (
                    <div 
                        key={idx}
                        className={`
                            px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap flex items-center gap-1.5 transition-all border
                            ${isActive ? 'bg-indigo-600 text-white border-indigo-700 shadow-md shadow-indigo-200/50' : 'bg-white text-slate-500 border-slate-200'}
                            ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                            ${isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                        `}
                    >
                        {isLocked && <IconLock className="w-3 h-3" />}
                        {isCompleted && <span className="text-emerald-500">✓</span>}
                        {sec.name}
                    </div>
                );
            })}
        </div>

        <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono text-sm font-bold transition-all ${timeLeft < 300 ? 'animate-pulse bg-red-600 text-white shadow-lg shadow-red-200/50' : timeLeft < 600 ? 'bg-amber-500 text-white' : 'bg-slate-800 text-white'}`}>
                <IconClock className="w-3.5 h-3.5" />
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </div>
            <button onClick={toggleFullScreen} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hidden sm:flex items-center justify-center transition-colors">
                {isFullscreen ? <IconMinimize className="w-4 h-4"/> : <IconMaximize className="w-4 h-4"/>}
            </button>
            <button onClick={() => setIsPaletteOpen(!isPaletteOpen)} className="md:hidden p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors">
                {isPaletteOpen ? <IconX className="w-4 h-4"/> : <IconMenu2 className="w-4 h-4"/>}
            </button>
        </div>
      </header>

      {/* SECTION INFO BAR */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-2 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-2.5 text-sm">
              <IconInfoCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-semibold truncate max-w-[180px] sm:max-w-xs">{currentSection.name}</span>
          </div>
          <div className="flex items-center gap-3">
              <div className="text-xs font-medium">
                  <span className="text-emerald-400 font-bold">{sectionAnsweredCount}</span>
                  <span className="text-slate-400"> / {currentSection.questionCount} answered</span>
              </div>
              <div className="w-20 sm:w-28 h-1.5 bg-slate-600 rounded-full overflow-hidden hidden sm:block">
                  <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${(sectionAnsweredCount / currentSection.questionCount) * 100}%` }} />
              </div>
          </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden relative min-h-0 bg-white">
        
        {/* LEFT: QUESTION */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
            <div className="bg-white px-4 sm:px-5 py-2.5 border-b border-slate-100 flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-2.5">
                     <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-bold">{currentQuestionIndex + 1}</span>
                     <span className="font-semibold text-slate-700 text-sm">Question {currentQuestionIndex + 1}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <ReportBugButton onClick={() => setReportBugOpen(true)} lightOnly />
                   <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 uppercase tracking-wider border border-slate-200">Single Choice</span>
                 </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-4 bg-slate-50/50">
                {currentQuestion?.id && (
                  <div className="text-[10px] text-slate-400 font-mono mb-3 uppercase tracking-widest">
                    ID: {currentQuestion.id}
                  </div>
                )}
                
                <div className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium mb-8 select-none">
                    <LatexText text={currentQuestion?.question_text || "Loading..."} />
                </div>
                <div className="grid gap-3 max-w-2xl">
                    {currentQuestion?.options.map((option, index) => {
                        const isSelected = answers[currentQuestion.id] === index;
                        const label = String.fromCharCode(65 + index);
                        return (
                            <label
                                key={index}
                                className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all group
                                    ${isSelected
                                        ? 'border-indigo-500 bg-indigo-50/70 shadow-sm shadow-indigo-100'
                                        : 'border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-lg border-2 mr-3.5 flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${isSelected ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-300 text-slate-500 group-hover:border-slate-400'}`}>
                                    {label}
                                </div>
                                <span className="text-slate-700 text-sm sm:text-base select-none w-full pt-1"><LatexText text={option} /></span>
                                <input type="radio" name={currentQuestion.id} className="hidden" checked={isSelected} onChange={() => handleAnswer(index)} />
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* BOTTOM ACTION BAR */}
            <div className="h-[60px] bg-white border-t border-slate-200 px-3 sm:px-5 flex items-center justify-between shrink-0 z-10 shadow-[0_-1px_4px_rgba(0,0,0,0.04)]">
                <div className="flex gap-2">
                    <button onClick={handleMarkForReview} className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 whitespace-nowrap transition-all active:scale-95">
                        <span className="hidden sm:inline">Mark for </span>Review
                    </button>
                    <button onClick={handleClearResponse} className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 whitespace-nowrap transition-all active:scale-95">Clear</button>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleNavigation(currentQuestionIndex + 1)} disabled={currentQuestionIndex === sectionIndices.end} className="px-4 sm:px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm flex items-center gap-1.5 shadow-sm whitespace-nowrap transition-all active:scale-95">
                        Save &amp; Next <IconChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={handleSectionSubmit}
                        disabled={isSubmitting}
                        className="px-4 sm:px-5 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-xs sm:text-sm shadow-sm whitespace-nowrap transition-all active:scale-95"
                    >
                        {isSubmitting ? 'Submitting...' : (currentSectionIndex === sections.length - 1 ? 'Submit Test' : 'Submit Section')}
                    </button>
                </div>
            </div>
        </div>

        {/* RIGHT: PALETTE (FILTERED BY SECTION) */}
        <div className={`fixed inset-y-0 right-0 w-72 bg-white border-l border-slate-200 z-30 transform transition-transform duration-300 ease-out shadow-2xl ${isPaletteOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0 md:w-72 md:flex md:flex-col md:border-l md:shadow-none`}>
            <div className="p-3 bg-slate-50 border-b border-slate-200 shrink-0">
                 <div className="flex justify-between items-center mb-3 md:hidden">
                     <span className="font-bold text-slate-800 text-sm">Question Palette</span>
                     <button onClick={()=>setIsPaletteOpen(false)} className="p-1 rounded-md hover:bg-slate-200 text-slate-500 transition-colors"><IconX className="w-4 h-4"/></button>
                 </div>
                 <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] text-slate-600 font-medium">
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded"></span> Answered</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-400 rounded"></span> Not Answered</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-slate-200 rounded border border-slate-300"></span> Not Visited</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-purple-500 rounded-full"></span> Review</div>
                 </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 bg-white">
                <h3 className="font-bold text-xs mb-3 text-slate-500 uppercase tracking-wider px-0.5">{currentSection.name}</h3>
                <div className="grid grid-cols-5 gap-1.5 content-start">
                    {questions.slice(sectionIndices.start, sectionIndices.end + 1).map((q, idx) => {
                         const globalIdx = sectionIndices.start + idx;
                         const status = statusMap[q.id] || 'not_visited';
                         
                         let statusClass = '';
                         if(status === 'answered') statusClass = 'bg-emerald-500 text-white border-emerald-600';
                         else if(status === 'not_answered') statusClass = 'bg-red-400 text-white border-red-500';
                         else if(status === 'marked_review') statusClass = 'bg-purple-500 text-white border-purple-600 rounded-full';
                         else statusClass = 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400 hover:text-indigo-600';
                         
                         return (
                            <button key={q.id} onClick={() => { handleNavigation(globalIdx); setIsPaletteOpen(false); }} className={`aspect-square rounded-lg font-bold text-[11px] border flex items-center justify-center transition-all relative ${statusClass} ${currentQuestionIndex === globalIdx ? 'ring-2 ring-indigo-500 ring-offset-1 z-10 scale-110' : ''}`}>
                                {globalIdx + 1}
                            </button>
                         );
                    })}
                </div>
            </div>
            <div className="p-3 border-t border-slate-100 bg-slate-50 shrink-0 space-y-2">
                 {currentSectionIndex === sections.length - 1 && (
                    <button onClick={handleSubmitTest} disabled={isSubmitting} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm disabled:opacity-50 text-sm tracking-wide transition-all active:scale-[0.98]">
                        {isSubmitting ? 'Submitting...' : 'SUBMIT TEST'}
                    </button>
                 )}
                 {currentSectionIndex < sections.length - 1 && (
                    <button onClick={handleSectionSubmit} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm text-sm tracking-wide transition-all active:scale-[0.98]">
                        NEXT SECTION
                    </button>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
};