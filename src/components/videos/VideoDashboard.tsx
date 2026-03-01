// src/components/videos/VideoDashboard.tsx
"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { IconChevronDown, IconPlayCircle } from "@/components/ui/Icons";
import { useAuth } from "@/components/auth/AuthProvider";
import { Subject, Topic, Lecture } from "@/app/actions";
import { VideoPlayer, NowPlayingItem } from "./VideoPlayer";
import { ProgressOverview, SubjectStat } from "./ProgressOverview";
import { SearchFilters, FilterMode } from "./SearchFilters";

// ── Inline SVG Icons ──

const IconStar = ({
  className = "w-5 h-5",
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconCheck = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Subject accent colors ──

const ACCENT_COLORS = [
  "border-l-emerald-500",
  "border-l-amber-500",
  "border-l-rose-500",
  "border-l-sky-500",
  "border-l-violet-500",
];

/** Extract YouTube video ID */
const extractVideoId = (url: string): string | null => {
  const match = url.match(
    /(?:youtu\.be\/|(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
};

// ── Main Dashboard ──

export const VideoDashboard = ({
  initialCourseData,
}: {
  initialCourseData: Subject[];
}) => {
  const { user } = useAuth();
  const playerRef = useRef<HTMLDivElement>(null);

  const [openSubjects, setOpenSubjects] = useState<Set<string>>(
    new Set(initialCourseData[0]?.subject ? [initialCourseData[0].subject] : [])
  );
  const [openTopics, setOpenTopics] = useState<Set<string>>(
    new Set(
      initialCourseData[0]?.topics[0]?.name
        ? [initialCourseData[0].topics[0].name]
        : []
    )
  );
  const [completedLectures, setCompletedLectures] = useState<Set<string>>(
    new Set()
  );
  const [revisionLectures, setRevisionLectures] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [nowPlaying, setNowPlaying] = useState<NowPlayingItem | null>(null);

  // ── Fetch user progress ──
  useEffect(() => {
    if (user) {
      const fetchProgress = async () => {
        try {
          const token = await user.getIdToken();
          const res = await fetch(`/api/video-progress?userId=${user.uid}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const progress = await res.json();
          setCompletedLectures(new Set(progress.completed || []));
          setRevisionLectures(new Set(progress.revision || []));
        } catch (err) {
          console.error("Error fetching progress:", err);
        }
      };
      fetchProgress();
    } else {
      setCompletedLectures(new Set());
      setRevisionLectures(new Set());
    }
  }, [user]);

  // ── Close player with Escape ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && nowPlaying) setNowPlaying(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [nowPlaying]);

  // ── Stats ──
  const { totalLectures, subjectStats } = useMemo(() => {
    let total = 0;
    const stats: SubjectStat[] = initialCourseData.map((subject, idx) => {
      const subjectTotal = subject.topics.reduce(
        (acc, t) => acc + t.lectures.length,
        0
      );
      total += subjectTotal;
      const completed = subject.topics.reduce(
        (acc, t) =>
          acc + t.lectures.filter((l) => completedLectures.has(l.id)).length,
        0
      );
      return {
        name: subject.subject,
        completed,
        total: subjectTotal,
        colorIndex: idx,
      };
    });
    return { totalLectures: total, subjectStats: stats };
  }, [completedLectures, initialCourseData]);

  const overallProgress =
    totalLectures > 0 ? (completedLectures.size / totalLectures) * 100 : 0;

  // ── Filtered course data ──
  // Always keep all subjects & topics visible (empty topics show "coming soon")
  const filteredCourseData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return initialCourseData.map((subject) => ({
      ...subject,
      topics: subject.topics.map((topic) => ({
        ...topic,
        lectures: topic.lectures.filter((lec) => {
          if (q && !lec.title.toLowerCase().includes(q)) return false;
          if (filterMode === "completed")
            return completedLectures.has(lec.id);
          if (filterMode === "revision")
            return revisionLectures.has(lec.id);
          if (filterMode === "not-started")
            return !completedLectures.has(lec.id);
          return true;
        }),
      })),
    }));
  }, [
    initialCourseData,
    searchQuery,
    filterMode,
    completedLectures,
    revisionLectures,
  ]);

  const filteredLectureCount = filteredCourseData.reduce(
    (acc, s) => acc + s.topics.reduce((a, t) => a + t.lectures.length, 0),
    0
  );

  // ── Auto-expand on search/filter ──
  useEffect(() => {
    if (searchQuery.trim() || filterMode !== "all") {
      setOpenSubjects(new Set(filteredCourseData.map((s) => s.subject)));
      setOpenTopics(
        new Set(filteredCourseData.flatMap((s) => s.topics.map((t) => t.name)))
      );
    }
  }, [searchQuery, filterMode, filteredCourseData]);

  // ── Handlers ──

  const handlePlay = useCallback((lecture: Lecture) => {
    const videoId = extractVideoId(lecture.youtubeLink);
    if (videoId) {
      setNowPlaying({ id: lecture.id, title: lecture.title, videoId });
      setTimeout(
        () =>
          playerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        100
      );
    }
  }, []);

  const updateVideoProgressAPI = async (
    lectureId: string,
    type: "completed" | "revision",
    isAdding: boolean
  ) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      await fetch("/api/video-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.uid, lectureId, type, isAdding }),
      });
    } catch (error) {
      console.error("Failed to save progress", error);
    }
  };

  const handleToggleLecture = (id: string) => {
    if (!user) {
      alert("Please log in to track your progress.");
      return;
    }
    const isAdding = !completedLectures.has(id);
    setCompletedLectures((prev) => {
      const s = new Set(prev);
      isAdding ? s.add(id) : s.delete(id);
      return s;
    });
    updateVideoProgressAPI(id, "completed", isAdding);
  };

  const handleToggleRevision = (id: string) => {
    if (!user) {
      alert("Please log in to save revisions.");
      return;
    }
    const isAdding = !revisionLectures.has(id);
    setRevisionLectures((prev) => {
      const s = new Set(prev);
      isAdding ? s.add(id) : s.delete(id);
      return s;
    });
    updateVideoProgressAPI(id, "revision", isAdding);
  };

  const toggleSubject = (name: string) =>
    setOpenSubjects((prev) => {
      const s = new Set(prev);
      s.has(name) ? s.delete(name) : s.add(name);
      return s;
    });

  const toggleTopic = (name: string) =>
    setOpenTopics((prev) => {
      const s = new Set(prev);
      s.has(name) ? s.delete(name) : s.add(name);
      return s;
    });

  const allSubjectNames = initialCourseData.map((s) => s.subject);
  const allTopicNames = initialCourseData.flatMap((s) =>
    s.topics.map((t) => t.name)
  );
  const allExpanded =
    allSubjectNames.every((s) => openSubjects.has(s)) &&
    allTopicNames.every((t) => openTopics.has(t));

  const handleExpandCollapseAll = useCallback(() => {
    if (allExpanded) {
      setOpenSubjects(new Set());
      setOpenTopics(new Set());
    } else {
      setOpenSubjects(new Set(allSubjectNames));
      setOpenTopics(new Set(allTopicNames));
    }
  }, [allExpanded, allSubjectNames, allTopicNames]);

  // Build a map of original topic data for accurate progress tracking
  const originalTopicMap = useMemo(() => {
    const map = new Map<string, Topic>();
    for (const subject of initialCourseData) {
      for (const topic of subject.topics) {
        map.set(topic.name, topic);
      }
    }
    return map;
  }, [initialCourseData]);

  const getTopicProgress = useCallback(
    (topicName: string) => {
      const original = originalTopicMap.get(topicName);
      if (!original) return { done: 0, total: 0 };
      const total = original.lectures.length;
      const done = original.lectures.filter((l) =>
        completedLectures.has(l.id)
      ).length;
      return { done, total };
    },
    [completedLectures, originalTopicMap]
  );

  // ── Render ──

  return (
    <div className="max-w-6xl mx-auto">
      {/* Video Player */}
      <VideoPlayer
        nowPlaying={nowPlaying}
        onClose={() => setNowPlaying(null)}
        playerRef={playerRef}
      />

      {/* Progress (logged-in only) */}
      {user && (
        <ProgressOverview
          overallProgress={overallProgress}
          completedCount={completedLectures.size}
          totalLectures={totalLectures}
          revisionCount={revisionLectures.size}
          subjectStats={subjectStats}
        />
      )}

      {/* Search & Filters */}
      <SearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterMode={filterMode}
        onFilterChange={setFilterMode}
        allExpanded={allExpanded}
        onToggleExpand={handleExpandCollapseAll}
        resultCount={
          searchQuery.trim() || filterMode !== "all"
            ? filteredLectureCount
            : undefined
        }
        isLoggedIn={!!user}
      />

      {/* Subject Accordions */}
      <div className="space-y-3 sm:space-y-4">
        {filteredCourseData.map((subject, subjectIdx) => {
          const isOpen = openSubjects.has(subject.subject);
          const accent = ACCENT_COLORS[subjectIdx % ACCENT_COLORS.length];
          const stat = subjectStats.find((s) => s.name === subject.subject);
          // Use original total from stats, not filtered count
          const lectureCount = stat?.total ?? 0;
          const filteredCount = subject.topics.reduce(
            (a, t) => a + t.lectures.length,
            0
          );
          // Count topics (including empty ones)
          const topicCount = subject.topics.length;

          return (
            <div
              key={subject.subject}
              className={`rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-800/80 shadow-sm overflow-hidden border-l-[3px] ${accent} transition-all`}
            >
              {/* Subject Header */}
              <button
                onClick={() => toggleSubject(subject.subject)}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left gap-3 group hover:bg-slate-50/60 dark:hover:bg-slate-700/20 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <h2 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                    {subject.subject}
                  </h2>
                  <span className="hidden sm:inline text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
                    {topicCount} topics · {lectureCount} lectures
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {stat && stat.total > 0 && (
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 tabular-nums">
                      {stat.completed}/{stat.total}
                    </span>
                  )}
                  <IconChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Subject Content */}
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2">
                    {subject.topics.map((topic) => {
                      const isTopicOpen = openTopics.has(topic.name);
                      const { done, total } = getTopicProgress(topic.name);
                      const topicPct =
                        total > 0 ? (done / total) * 100 : 0;
                      const isComplete = total > 0 && done === total;

                      return (
                        <div
                          key={topic.name}
                          className="rounded-lg border border-slate-100 dark:border-slate-700/40 bg-slate-50/60 dark:bg-slate-900/30 overflow-hidden"
                        >
                          {/* Topic Header */}
                          <button
                            onClick={() => toggleTopic(topic.name)}
                            className="w-full flex items-center justify-between p-2.5 sm:p-3 text-left gap-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {isComplete && (
                                <span className="flex-shrink-0 w-4.5 h-4.5 rounded-full bg-green-100 dark:bg-green-500/15 flex items-center justify-center">
                                  <IconCheck className="w-2.5 h-2.5 text-green-600 dark:text-green-400" />
                                </span>
                              )}
                              <h3 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">
                                {topic.name}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {total > 0 && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-medium tabular-nums">
                                    {done}/{total}
                                  </span>
                                  <div className="w-10 sm:w-16 h-1 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all duration-500 ${
                                        isComplete
                                          ? "bg-green-500"
                                          : "bg-indigo-500"
                                      }`}
                                      style={{ width: `${topicPct}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                              <IconChevronDown
                                className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-300 ${
                                  isTopicOpen ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </button>

                          {/* Topic Lectures */}
                          <div
                            className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                            style={{
                              gridTemplateRows: isTopicOpen ? "1fr" : "0fr",
                            }}
                          >
                            <div className="overflow-hidden">
                              <div className="px-2 sm:px-3 pb-2 sm:pb-3">
                                {topic.lectures.length > 0 ? (
                                  <>
                                    {/* Desktop Table */}
                                    <table className="w-full text-sm text-left table-fixed hidden sm:table">
                                      <thead>
                                        <tr className="border-b border-slate-200/60 dark:border-slate-700/40">
                                          <th className="py-1.5 px-2 w-9 text-[10px] uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500">
                                            #
                                          </th>
                                          <th className="py-1.5 px-2 w-10 text-[10px] uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500">
                                            
                                          </th>
                                          <th className="py-1.5 px-2 text-[10px] uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500">
                                            Title
                                          </th>
                                          <th className="py-1.5 px-2 w-16 text-center text-[10px] uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500">
                                            Play
                                          </th>
                                          <th className="py-1.5 px-2 w-16 text-center text-[10px] uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500">
                                            Save
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {topic.lectures.map((lecture, idx) => {
                                          const isDone =
                                            completedLectures.has(lecture.id);
                                          const isPlaying =
                                            nowPlaying?.id === lecture.id;
                                          const isRevision =
                                            revisionLectures.has(lecture.id);
                                          return (
                                            <tr
                                              key={lecture.id}
                                              className={`border-b border-slate-100/80 dark:border-slate-700/20 last:border-b-0 transition-colors ${
                                                isPlaying
                                                  ? "bg-indigo-50/50 dark:bg-indigo-950/15"
                                                  : isDone
                                                  ? "bg-green-50/20 dark:bg-green-950/5"
                                                  : "hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                                              }`}
                                            >
                                              <td className="py-2 px-2 text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
                                                {idx + 1}
                                              </td>
                                              <td className="py-2 px-2">
                                                <button
                                                  onClick={() =>
                                                    handleToggleLecture(
                                                      lecture.id
                                                    )
                                                  }
                                                  className={`w-4.5 h-4.5 rounded border-[1.5px] flex items-center justify-center transition-all ${
                                                    isDone
                                                      ? "bg-green-500 border-green-500 text-white"
                                                      : "border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500"
                                                  }`}
                                                  aria-label={
                                                    isDone
                                                      ? "Mark incomplete"
                                                      : "Mark complete"
                                                  }
                                                >
                                                  {isDone && (
                                                    <IconCheck className="w-2.5 h-2.5" />
                                                  )}
                                                </button>
                                              </td>
                                              <td
                                                className={`py-2 px-2 text-[13px] ${
                                                  isDone
                                                    ? "text-slate-400 dark:text-slate-500 line-through decoration-slate-300/60 dark:decoration-slate-600/60"
                                                    : "text-slate-700 dark:text-slate-200"
                                                }`}
                                              >
                                                <span className="line-clamp-1">
                                                  {lecture.title}
                                                </span>
                                              </td>
                                              <td className="py-2 px-2">
                                                <button
                                                  onClick={() =>
                                                    handlePlay(lecture)
                                                  }
                                                  className={`flex justify-center w-full transition-colors ${
                                                    isPlaying
                                                      ? "text-indigo-600 dark:text-indigo-400"
                                                      : "text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                                                  }`}
                                                  title="Play"
                                                >
                                                  <IconPlayCircle className="w-4 h-4" />
                                                </button>
                                              </td>
                                              <td className="py-2 px-2">
                                                <button
                                                  onClick={() =>
                                                    handleToggleRevision(
                                                      lecture.id
                                                    )
                                                  }
                                                  className={`w-full flex justify-center transition-colors ${
                                                    isRevision
                                                      ? "text-yellow-500 dark:text-yellow-400"
                                                      : "text-slate-300 dark:text-slate-600 hover:text-yellow-400 dark:hover:text-yellow-500"
                                                  }`}
                                                  title={
                                                    isRevision
                                                      ? "Remove from revision"
                                                      : "Save for revision"
                                                  }
                                                >
                                                  <IconStar
                                                    className="w-4 h-4"
                                                    filled={isRevision}
                                                  />
                                                </button>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>

                                    {/* Mobile Cards */}
                                    <div className="sm:hidden space-y-1.5">
                                      {topic.lectures.map((lecture, idx) => {
                                        const isDone =
                                          completedLectures.has(lecture.id);
                                        const isPlaying =
                                          nowPlaying?.id === lecture.id;
                                        const isRevision =
                                          revisionLectures.has(lecture.id);
                                        return (
                                          <div
                                            key={lecture.id}
                                            className={`p-2.5 rounded-lg border transition-colors ${
                                              isPlaying
                                                ? "bg-indigo-50/50 dark:bg-indigo-950/15 border-indigo-200/60 dark:border-indigo-500/20"
                                                : isDone
                                                ? "bg-green-50/30 dark:bg-green-950/5 border-green-200/40 dark:border-green-800/20"
                                                : "bg-white/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-700/30"
                                            }`}
                                          >
                                            <div className="flex items-start gap-2.5">
                                              <button
                                                onClick={() =>
                                                  handleToggleLecture(
                                                    lecture.id
                                                  )
                                                }
                                                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-[1.5px] flex items-center justify-center transition-all ${
                                                  isDone
                                                    ? "bg-green-500 border-green-500 text-white"
                                                    : "border-slate-300 dark:border-slate-600"
                                                }`}
                                              >
                                                {isDone && (
                                                  <IconCheck className="w-3 h-3" />
                                                )}
                                              </button>

                                              <div className="flex-grow min-w-0">
                                                <p
                                                  className={`text-[13px] leading-snug ${
                                                    isDone
                                                      ? "text-slate-400 dark:text-slate-500 line-through"
                                                      : "text-slate-800 dark:text-slate-200"
                                                  }`}
                                                >
                                                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mr-1 tabular-nums">
                                                    {idx + 1}.
                                                  </span>
                                                  {lecture.title}
                                                </p>

                                                <div className="flex items-center gap-3.5 mt-2">
                                                  <button
                                                    onClick={() =>
                                                      handlePlay(lecture)
                                                    }
                                                    className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                                                      isPlaying
                                                        ? "text-indigo-600 dark:text-indigo-400"
                                                        : "text-slate-500 dark:text-slate-400"
                                                    }`}
                                                  >
                                                    <IconPlayCircle className="w-3.5 h-3.5" />
                                                    {isPlaying
                                                      ? "Playing"
                                                      : "Watch"}
                                                  </button>
                                                  <button
                                                    onClick={() =>
                                                      handleToggleRevision(
                                                        lecture.id
                                                      )
                                                    }
                                                    className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                                                      isRevision
                                                        ? "text-yellow-500 dark:text-yellow-400"
                                                        : "text-slate-400 dark:text-slate-500"
                                                    }`}
                                                  >
                                                    <IconStar
                                                      className="w-3.5 h-3.5"
                                                      filled={isRevision}
                                                    />
                                                    Revise
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-center py-6">
                                    <p className="text-sm text-slate-400 dark:text-slate-500">
                                      Playlist coming soon
                                    </p>
                                    <p className="text-[11px] text-slate-300 dark:text-slate-600 mt-1">
                                      Lectures for this topic are being prepared
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* No Results */}
        {filteredLectureCount === 0 &&
          (searchQuery.trim() || filterMode !== "all") && (
            <div className="text-center py-14">
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                No lectures found
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterMode("all");
                }}
                className="mt-3 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
      </div>
    </div>
  );
};
