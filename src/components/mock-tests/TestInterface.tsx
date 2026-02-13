// src/components/mock-tests/TestInterface.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { LatexText } from '@/components/ui/LatexText';
import { 
  IconClock, 
  IconChevronRight, 
  IconMenu2, 
  IconX,
  IconInfoCircle,
  IconMaximize,
  IconMinimize
} from "@/components/ui/Icons"; 

type Question = {
  id: string;
  question_text: string;
  options: string[];
};

type MockTest = {
  id: string;
  title: string;
  durationInMinutes: number;
  question_ids: string[];
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
  
  // --- STATE ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [statusMap, setStatusMap] = useState<{ [key: string]: QuestionStatus }>({});
  const [timeLeft, setTimeLeft] = useState(test.durationInMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sectionName = test.topic || test.subject || "General Section";
  const totalQuestions = questions.length;
  const answeredCount = Object.values(statusMap).filter(s => s === 'answered').length;

  // --- INITIALIZATION ---
  useEffect(() => {
    const initialStatus: { [key: string]: QuestionStatus } = {};
    questions.forEach(q => {
      initialStatus[q.id] = 'not_visited';
    });
    if (questions.length > 0) initialStatus[questions[0].id] = 'not_answered';
    setStatusMap(initialStatus);
  }, [questions]);

  // --- TIMER ---
  useEffect(() => {
    if (timeLeft === 0) handleSubmit();
    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // --- FULL SCREEN TOGGLE ---
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // --- HANDLERS ---
  const handleNavigation = (newIndex: number) => {
    const oldId = questions[currentQuestionIndex].id;
    setStatusMap(prev => {
        const hasAnswer = answers[oldId] !== undefined;
        if (!hasAnswer && prev[oldId] !== 'marked_review') {
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
    const newAnswers = { ...answers }; 
    delete newAnswers[qId]; 
    setAnswers(newAnswers);
    setStatusMap(prev => ({ ...prev, [qId]: 'not_answered' }));
  };

  const handleMarkForReview = () => {
    const qId = questions[currentQuestionIndex].id;
    setStatusMap(prev => ({ ...prev, [qId]: 'marked_review' }));
    if (currentQuestionIndex < questions.length - 1) handleNavigation(currentQuestionIndex + 1);
  };

  const handleSubmit = useCallback(async () => {
    if (!user || isSubmitting) return;
    if (timeLeft > 0 && !window.confirm("Submit the test?")) return;
    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/mock-tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId: user.uid, testId: test.id, answers }),
      });
      if (!response.ok) throw new Error('Failed');
      const result = await response.json();
      router.push(`/mock-tests/take/${test.id}/results/${result.attemptId}`);
    } catch (e) { alert("Error submitting."); setIsSubmitting(false); }
  }, [user, test.id, answers, isSubmitting, router, timeLeft]);

  // --- RENDER ---
  const currentQuestion = questions[currentQuestionIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    // FIX 1: Use h-full and w-full to fill the ConditionalLayout's h-screen container perfectly.
    <div className="flex flex-col h-full w-full bg-slate-100 font-sans text-slate-900">
      
      {/* HEADER */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
        <h1 className="font-bold text-slate-800 truncate text-sm md:text-base">{test.title}</h1>
        <div className="flex items-center gap-3">
            {/* Timer */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded bg-slate-800 text-white font-mono text-sm font-bold ${timeLeft < 300 ? 'animate-pulse bg-red-600' : ''}`}>
                <IconClock className="w-4 h-4" />
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </div>

            {/* Full Screen Toggle */}
            <button 
                onClick={toggleFullScreen}
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors hidden sm:block"
                title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
            >
                {isFullscreen ? <IconMinimize className="w-5 h-5"/> : <IconMaximize className="w-5 h-5"/>}
            </button>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsPaletteOpen(!isPaletteOpen)} className="md:hidden p-1.5 bg-slate-100 rounded-md">
                {isPaletteOpen ? <IconX className="w-5 h-5"/> : <IconMenu2 className="w-5 h-5"/>}
            </button>
        </div>
      </header>

      {/* SECTION INFO BAR */}
      <div className="bg-[#003D69] text-white px-2 pt-2 flex items-end gap-1 overflow-x-auto shrink-0 no-scrollbar z-10">
          <div className="relative bg-[#0072BC] pl-3 pr-8 py-2 text-xs md:text-sm font-medium rounded-t-sm flex items-center gap-2 min-w-fit shadow-[0_-2px_4px_rgba(0,0,0,0.1)]">
              <IconInfoCircle className="w-4 h-4 opacity-80" />
              <div className="flex flex-col leading-tight">
                  <span className="truncate max-w-[150px] md:max-w-xs">{sectionName}</span>
                  <span className="text-[10px] opacity-80">{answeredCount} / {totalQuestions} Attempted</span>
              </div>
              <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#0072BC]"></div>
          </div>
      </div>

      {/* MAIN CONTENT AREA */}
      {/* FIX 2: min-h-0 is absolutely critical for scrolling to work inside Flexbox */}
      <div className="flex flex-1 overflow-hidden relative min-h-0 bg-white">
        
        {/* LEFT: QUESTION CONTAINER */}
        {/* FIX 3: Removed m-2 to utilize full space edge-to-edge */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
            
            {/* Question Info Header */}
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center shrink-0">
                 <span className="font-bold text-slate-700 text-sm">Q No. {currentQuestionIndex + 1}</span>
                 <span className="text-xs text-slate-500 font-medium bg-slate-200 px-2 py-0.5 rounded">Single Choice</span>
            </div>

            {/* SCROLLABLE QUESTION AREA */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-4">
                <div className="text-base md:text-lg text-slate-900 leading-relaxed font-medium mb-6 select-none">
                    <LatexText text={currentQuestion.question_text} />
                </div>

                <div className="grid gap-3">
                    {currentQuestion.options.map((option, index) => (
                        <label 
                            key={index}
                            className={`flex items-start p-3.5 rounded-md border-2 cursor-pointer transition-all hover:bg-slate-50 ${
                                answers[currentQuestion.id] === index ? 'border-[#0072BC] bg-blue-50/50' : 'border-slate-200'
                            }`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                answers[currentQuestion.id] === index ? 'border-[#0072BC]' : 'border-slate-300'
                            }`}>
                                {answers[currentQuestion.id] === index && <div className="w-2.5 h-2.5 rounded-full bg-[#0072BC]" />}
                            </div>
                            <span className="text-slate-700 text-sm md:text-base select-none w-full">
                                <LatexText text={option} />
                            </span>
                            <input 
                                type="radio" 
                                name={currentQuestion.id} 
                                className="hidden" 
                                checked={answers[currentQuestion.id] === index} 
                                onChange={() => handleAnswer(index)} 
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* FIXED FOOTER NAV */}
            {/* FIX 4: This footer will now stick to the bottom properly because of flex-col layout */}
            <div className="h-16 bg-white border-t border-slate-200 px-4 flex items-center justify-between shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex gap-2">
                    <button 
                        onClick={handleMarkForReview} 
                        className="px-3 py-2 text-xs md:text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 whitespace-nowrap"
                    >
                        Mark for Review
                    </button>
                    <button 
                        onClick={handleClearResponse} 
                        className="px-3 py-2 text-xs md:text-sm font-bold text-slate-600 hover:bg-slate-100 rounded border border-slate-300 whitespace-nowrap"
                    >
                        Clear
                    </button>
                </div>
                <button 
                    onClick={() => handleNavigation(currentQuestionIndex + 1)} 
                    disabled={currentQuestionIndex === questions.length - 1} 
                    className="px-6 py-2 bg-[#0072BC] text-white font-bold rounded hover:bg-blue-700 disabled:opacity-50 text-sm flex items-center gap-2 shadow-sm whitespace-nowrap ml-2"
                >
                    Save & Next <IconChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* RIGHT: PALETTE SIDEBAR */}
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
                <h3 className="font-bold text-sm mb-3 text-[#003D69] px-1">{sectionName}</h3>
                <div className="grid grid-cols-5 gap-2 content-start">
                    {questions.map((q, idx) => {
                         const status = statusMap[q.id] || 'not_visited';
                         let statusClass = '';
                         if(status === 'answered') statusClass = 'bg-green-500 text-white border-green-600 clip-path-polygon-[0_0,_100%_0,_100%_85%,_85%_100%,_0_100%]';
                         else if(status === 'not_answered') statusClass = 'bg-red-500 text-white border-red-600 rounded-t-md rounded-bl-md';
                         else if(status === 'marked_review') statusClass = 'bg-purple-500 text-white rounded-full';
                         else statusClass = 'bg-white text-slate-700 border-slate-300 rounded-sm hover:border-blue-400';

                         return (
                            <button key={q.id} onClick={() => { handleNavigation(idx); setIsPaletteOpen(false); }} 
                                className={`aspect-square font-bold text-xs border flex items-center justify-center transition-all relative shadow-sm ${statusClass} ${currentQuestionIndex === idx ? 'ring-2 ring-blue-600 z-10 scale-105' : ''}`}>
                                {idx + 1}
                            </button>
                         );
                    })}
                </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0">
                <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow-sm disabled:opacity-50 text-sm tracking-wide">
                    {isSubmitting ? 'Submitting...' : 'SUBMIT TEST'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};