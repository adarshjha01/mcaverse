"use client";

import { useState, useMemo } from "react";
import allQuestionsData from "@/db/allQuestions_fixed.json";
import { LatexText } from "@/components/ui/LatexText";

const QUESTIONS_PER_PAGE = 50;

export default function QACheckPage() {
  const [topicFilter, setTopicFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique topics/subjects from the database
// Extract unique topics/subjects from the database
  const topics = useMemo(() => {
    const questionArray = allQuestionsData as any[]; // <-- Force TypeScript to see it as an array
    const subjects = new Set(questionArray.map((q: any) => q.subject || q.topic || "Uncategorized"));
    return ["All", ...Array.from(subjects)] as string[];
  }, []);

  // Filter and paginate the questions
  const filteredQuestions = useMemo(() => {
    let filtered = allQuestionsData as any[];
    if (topicFilter !== "All") {
      filtered = filtered.filter((q) => (q.subject || q.topic || "Uncategorized") === topicFilter);
    }
    return filtered;
  }, [topicFilter]);

  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const currentQuestions = filteredQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Database QA Review</h1>
        
        {/* Controls */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center border border-gray-200">
          <div>
            <label className="font-bold mr-3 text-gray-700">Filter by Topic:</label>
            <select 
              className="border p-2 rounded bg-gray-50 text-black"
              value={topicFilter} 
              onChange={(e) => { setTopicFilter(e.target.value); setCurrentPage(1); }}
            >
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="font-bold text-gray-600">
            Total Questions: {filteredQuestions.length}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {currentQuestions.map((q, index) => (
            <div key={q.question_id || q.id || index} className="bg-white p-6 rounded-lg shadow border border-gray-200 relative">
              {/* THE ID BADGE */}
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-bold font-mono">
                ID: {q.question_id || q.id || "Unknown"}
              </div>

              <div className="mb-4 pt-2">
                <span className="font-bold text-gray-500 mr-2">Q:</span>
                <LatexText text={q.question_text || "No question text"} />
              </div>

              {q.options && Array.isArray(q.options) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 pl-6">
                  {q.options.map((opt: string, i: number) => (
                    <div key={i} className={`p-2 rounded border ${q.correct_answers?.includes(i) ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-100'}`}>
                      <span className="font-bold text-gray-400 mr-2">{String.fromCharCode(65 + i)}.</span>
                      <LatexText text={opt} />
                    </div>
                  ))}
                </div>
              )}

              {q.explanation && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <span className="font-bold text-yellow-800 block mb-1">Explanation:</span>
                  <LatexText text={q.explanation} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center gap-4 pb-12">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-4 py-2 bg-gray-800 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="py-2 font-bold text-gray-700">Page {currentPage} of {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-4 py-2 bg-gray-800 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}