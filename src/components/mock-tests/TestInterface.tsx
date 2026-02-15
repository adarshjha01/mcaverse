// src/components/mock-tests/TestInterface.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { LatexText } from '@/components/ui/LatexText';
import { 
  IconClock, IconChevronRight, IconMenu2, IconX, IconInfoCircle, IconMaximize, IconMinimize, IconLock 
} from "@/components/ui/Icons"; 

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

export const TestInterface = ({ test, questions }: TestInterfaceProps) => {
  const { user } = useAuth();
  const router = useRouter();

  // --- DERIVE SECTIONS IF MISSING ---
  // If no sections in DB, create a default "General" section with total duration
  const sections = useMemo(() => {
    if (test.sections && test.sections.length > 0) return test.sections;
    return [{ name: "General Section", duration: test.durationInMinutes, questionCount: questions.length }];
  }, [test]);

  // --- STATE ---
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Global index
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [statusMap, setStatusMap] = useState<{ [key: string]: QuestionStatus }>({});
  
  // Initialize timer with the FIRST section's duration
  const [timeLeft, setTimeLeft] = useState(sections[0].duration * 60);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- DERIVED HELPERS ---
  const currentSection = sections[currentSectionIndex];

  // Calculate the start/end indices for the current section in the global question list
  const sectionIndices = useMemo(() => {
    let start = 0;
    for (let i = 0; i < currentSectionIndex; i++) {
      start += sections[i].questionCount;
    }
    return { start, end: start + currentSection.questionCount - 1 };
  }, [currentSectionIndex, sections]);

  // Ensure current question is within valid bounds when switching sections
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

  // --- TIMER LOGIC (SECTION BASED) ---
  useEffect(() => {
    if (timeLeft === 0) {
      handleSectionSubmit();
    }
    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
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
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, []);

  // --- NAVIGATION HANDLERS ---
  const handleNavigation = (newIndex: number) => {
    // Prevent navigating outside current section bounds
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
  const handleSectionSubmit = () => {
    const isLastSection = currentSectionIndex === sections.length - 1;
    
    if (isLastSection) {
      handleSubmitTest();
    } else {
      // Move to next section
      const nextIndex = currentSectionIndex + 1;
      const nextSection = sections[nextIndex];
      
      if (confirm(`Submit ${currentSection.name} and start ${nextSection.name}? You cannot go back.`)) {
          setCurrentSectionIndex(nextIndex);
          // Set timer for next section
          setTimeLeft(nextSection.duration * 60);
      }
    }
  };

  // --- FINAL SUBMIT (WITH FULL SCREEN FIX) ---
  const handleSubmitTest = useCallback(async () => {
    if (!user || isSubmitting) return;
    if (timeLeft > 0 && !window.confirm("Finish Test and Submit?")) return;
    
    setIsSubmitting(true);
    
    try {
      // 1. Submit to API
      const token = await user.getIdToken();
      const response = await fetch('/api/mock-tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId: user.uid, testId: test.id, answers }),
      });
      
      if (!response.ok) throw new Error('Failed');
      const result = await response.json();

      // 2. SAFE EXIT: Wait for Full Screen to close before navigating
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        // Critical Delay: Allows browser to repaint
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // 3. Navigate
      router.push(`/mock-tests/take/${test.id}/results/${result.attemptId}`);
      
    } catch (e) { 
        alert("Error submitting. Please check connection."); 
        setIsSubmitting(false); 
    }
  }, [user, test.id, answers, isSubmitting, router, timeLeft]);

  // --- RENDER ---
  const currentQuestion = questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Calculate answered count for *current section*
  const sectionQuestions = questions.slice(sectionIndices.start, sectionIndices.end + 1);
  const sectionAnsweredCount = sectionQuestions.filter(q => statusMap[q.id] === 'answered').length;

  return (
    <div className="flex flex-col h-full w-full bg-slate-100 font-sans text-slate-900">
      
      {/* HEADER */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
        <h1 className="font-bold text-slate-800 truncate text-sm md:text-base hidden sm:block">{test.title}</h1>
        
        {/* SECTION TABS (Top Left/Center) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mx-2">
            {sections.map((sec, idx) => {
                const isActive = idx === currentSectionIndex;
                const isLocked = idx > currentSectionIndex;
                const isCompleted = idx < currentSectionIndex;
                
                return (
                    <div 
                        key={idx}
                        className={`
                            px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-all
                            ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'}
                            ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}
                            ${isCompleted ? 'bg-green-100 text-green-700' : ''}
                        `}
                    >
                        {isLocked && <IconLock className="w-3 h-3" />}
                        {sec.name}
                    </div>
                );
            })}
        </div>

        <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded bg-slate-800 text-white font-mono text-sm font-bold ${timeLeft < 300 ? 'animate-pulse bg-red-600' : ''}`}>
                <IconClock className="w-4 h-4" />
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </div>
            <button onClick={toggleFullScreen} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 hidden sm:block">
                {isFullscreen ? <IconMinimize className="w-5 h-5"/> : <IconMaximize className="w-5 h-5"/>}
            </button>
            <button onClick={() => setIsPaletteOpen(!isPaletteOpen)} className="md:hidden p-1.5 bg-slate-100 rounded-md">
                {isPaletteOpen ? <IconX className="w-5 h-5"/> : <IconMenu2 className="w-5 h-5"/>}
            </button>
        </div>
      </header>

      {/* SECTION INFO BAR */}
      <div className="bg-[#003D69] text-white px-2 pt-2 flex items-end gap-1 overflow-x-auto shrink-0 z-10">
          <div className="relative bg-[#0072BC] pl-3 pr-8 py-2 text-xs md:text-sm font-medium rounded-t-sm flex items-center gap-2 min-w-fit shadow-md">
              <IconInfoCircle className="w-4 h-4 opacity-80" />
              <div className="flex flex-col leading-tight">
                  <span className="truncate max-w-[150px] md:max-w-xs">{currentSection.name}</span>
                  <span className="text-[10px] opacity-80">{sectionAnsweredCount} / {currentSection.questionCount} Attempted</span>
              </div>
              <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#0072BC]"></div>
          </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden relative min-h-0 bg-white">
        
        {/* LEFT: QUESTION */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center shrink-0">
                 <span className="font-bold text-slate-700 text-sm">Question No. {currentQuestionIndex + 1}</span>
                 <span className="text-xs text-slate-500 font-medium bg-slate-200 px-2 py-0.5 rounded">Single Choice</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-4">
                <div className="text-base md:text-lg text-slate-900 leading-relaxed font-medium mb-6 select-none">
                    <LatexText text={currentQuestion?.question_text || "Loading..."} />
                </div>
                <div className="grid gap-3">
                    {currentQuestion?.options.map((option, index) => (
                        <label key={index} className={`flex items-start p-3.5 rounded-md border-2 cursor-pointer transition-all hover:bg-slate-50 ${answers[currentQuestion.id] === index ? 'border-[#0072BC] bg-blue-50/50' : 'border-slate-200'}`}>
                            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 mt-0.5 ${answers[currentQuestion.id] === index ? 'border-[#0072BC]' : 'border-slate-300'}`}>
                                {answers[currentQuestion.id] === index && <div className="w-2.5 h-2.5 rounded-full bg-[#0072BC]" />}
                            </div>
                            <span className="text-slate-700 text-sm md:text-base select-none w-full"><LatexText text={option} /></span>
                            <input type="radio" name={currentQuestion.id} className="hidden" checked={answers[currentQuestion.id] === index} onChange={() => handleAnswer(index)} />
                        </label>
                    ))}
                </div>
            </div>

            <div className="h-16 bg-white border-t border-slate-200 px-4 flex items-center justify-between shrink-0 z-10 shadow-sm">
                <div className="flex gap-2">
                    <button onClick={handleMarkForReview} className="px-3 py-2 text-xs md:text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 whitespace-nowrap">Mark for Review</button>
                    <button onClick={handleClearResponse} className="px-3 py-2 text-xs md:text-sm font-bold text-slate-600 hover:bg-slate-100 rounded border border-slate-300 whitespace-nowrap">Clear</button>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleNavigation(currentQuestionIndex + 1)} disabled={currentQuestionIndex === sectionIndices.end} className="px-5 py-2 bg-[#0072BC] text-white font-bold rounded hover:bg-blue-700 disabled:opacity-50 text-sm flex items-center gap-2 shadow-sm whitespace-nowrap">
                        Save & Next <IconChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={handleSectionSubmit}
                        disabled={isSubmitting}
                        className="px-5 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 text-sm shadow-sm whitespace-nowrap"
                    >
                        {currentSectionIndex === sections.length - 1 ? 'Submit Test' : 'Submit Section'}
                    </button>
                </div>
            </div>
        </div>

        {/* RIGHT: PALETTE (FILTERED BY SECTION) */}
        <div className={`fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 z-30 transform transition-transform ${isPaletteOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0 md:w-80 md:flex md:flex-col md:border-l`}>
            <div className="p-3 bg-blue-50 border-b border-blue-100 shrink-0">
                 <div className="flex justify-between items-center mb-3 md:hidden"><span className="font-bold">Palette</span><button onClick={()=>setIsPaletteOpen(false)}><IconX/></button></div>
                 <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 font-medium">
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-500 rounded-sm"></span> Answered</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500 rounded-sm"></span> Not Answered</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-slate-200 rounded-sm border border-slate-300"></span> Not Visited</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-purple-500 rounded-full"></span> Review</div>
                 </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 bg-[#F0F9FF]">
                <h3 className="font-bold text-sm mb-3 text-[#003D69] px-1">{currentSection.name}</h3>
                <div className="grid grid-cols-5 gap-2 content-start">
                    {/* Render ONLY questions for the CURRENT section */}
                    {questions.slice(sectionIndices.start, sectionIndices.end + 1).map((q, idx) => {
                         // The actual global index
                         const globalIdx = sectionIndices.start + idx;
                         const status = statusMap[q.id] || 'not_visited';
                         
                         let statusClass = '';
                         if(status === 'answered') statusClass = 'bg-green-500 text-white border-green-600';
                         else if(status === 'not_answered') statusClass = 'bg-red-500 text-white border-red-600 rounded-t-md rounded-bl-md';
                         else if(status === 'marked_review') statusClass = 'bg-purple-500 text-white rounded-full';
                         else statusClass = 'bg-white text-slate-700 border-slate-300 rounded-sm hover:border-blue-400';
                         
                         return (
                            <button key={q.id} onClick={() => { handleNavigation(globalIdx); setIsPaletteOpen(false); }} className={`aspect-square font-bold text-xs border flex items-center justify-center transition-all relative shadow-sm ${statusClass} ${currentQuestionIndex === globalIdx ? 'ring-2 ring-blue-600 z-10 scale-105' : ''}`}>
                                {globalIdx + 1}
                            </button>
                         );
                    })}
                </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0">
                 {/* Only show "Submit Test" button if it's the last section */}
                 {currentSectionIndex === sections.length - 1 && (
                    <button onClick={handleSubmitTest} disabled={isSubmitting} className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow-sm disabled:opacity-50 text-sm tracking-wide">
                        {isSubmitting ? 'Submitting...' : 'SUBMIT TEST'}
                    </button>
                 )}
                 {currentSectionIndex < sections.length - 1 && (
                    <button onClick={handleSectionSubmit} className="w-full py-2.5 bg-[#0072BC] hover:bg-blue-700 text-white font-bold rounded shadow-sm text-sm tracking-wide">
                        NEXT SECTION
                    </button>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
};