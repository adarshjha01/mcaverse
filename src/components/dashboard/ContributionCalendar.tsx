"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

type ContributionCalendarProps = {
  userId: string;
};

/** Return "YYYY-MM-DD" for a Date without timezone shift */
const toDateString = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getColorClass = (count: number): string => {
  if (count === 0) return "bg-slate-200 dark:bg-slate-700";
  if (count <= 2) return "bg-green-300 dark:bg-green-800";
  if (count <= 5) return "bg-green-400 dark:bg-green-600";
  if (count <= 8) return "bg-green-500 dark:bg-green-500";
  return "bg-green-600 dark:bg-green-400";
};

/** Get number of days in a month (1-indexed month) */
const daysInMonth = (year: number, month: number): number =>
  new Date(year, month, 0).getDate();

/** Get day-of-week for the 1st of a month (0=Sun … 6=Sat) */
const firstDayOfMonth = (year: number, month: number): number =>
  new Date(year, month - 1, 1).getDay();

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CELL = 14; // px – compact but readable
const GAP = 2;

type MonthGrid = {
  year: number;
  month: number;
  name: string;
  weeks: (Date | null)[][];
};

const buildMonthGrid = (year: number, month: number): MonthGrid => {
  const numDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);
  const weeks: (Date | null)[][] = [];
  let week: (Date | null)[] = [];

  for (let i = 0; i < startDay; i++) week.push(null);

  for (let day = 1; day <= numDays; day++) {
    week.push(new Date(year, month - 1, day));
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return { year, month, name: MONTH_NAMES[month - 1], weeks };
};

// ─── main component ────────────────────────────────────────────────────────────

const ContributionCalendar = ({ userId }: ContributionCalendarProps) => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [displayYear, setDisplayYear] = useState<"last-year" | number>("last-year");
  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !user) return;
    setLoading(true);
    const fetchHistory = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch(`/api/user/practice-history?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error(`Practice history fetch failed: ${res.status}`);
          return;
        }
        const text = await res.text();
        const d = text ? JSON.parse(text) : {};
        setData(d);
      } catch (err) {
        console.error('Failed to load practice history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId, user]);

  const { months, totalContributions } = useMemo(() => {
    const grids: MonthGrid[] = [];

    if (displayYear === "last-year") {
      for (let i = 11; i >= 0; i--) {
        let m = currentMonth - i;
        let y = currentYear;
        if (m <= 0) { m += 12; y -= 1; }
        grids.push(buildMonthGrid(y, m));
      }
    } else {
      const maxM = displayYear === currentYear ? currentMonth : 12;
      for (let m = 1; m <= maxM; m++) grids.push(buildMonthGrid(displayYear, m));
    }

    let total = 0;
    grids.forEach((mg) =>
      mg.weeks.forEach((w) =>
        w.forEach((d) => { if (d) total += data[toDateString(d)] ?? 0; })
      )
    );

    return { months: grids, totalContributions: total };
  }, [displayYear, data, currentYear, currentMonth]);

  const todayStr = toDateString(new Date());

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
            Practice History
          </h2>
        </div>
        <div className="h-32 w-full bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
            Practice History
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {totalContributions.toLocaleString()} contribution
            {totalContributions !== 1 ? "s" : ""} in the{" "}
            {displayYear === "last-year" ? "last year" : `year ${displayYear}`}
          </p>
        </div>
        <select
          value={displayYear}
          onChange={(e) =>
            setDisplayYear(
              e.target.value === "last-year" ? "last-year" : Number(e.target.value)
            )
          }
          className="text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-md px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="last-year">Last 12 months</option>
          {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar – single scrollable row with weekday labels on the left */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex items-end">
          {/* Weekday labels – shown once */}
          <div className="flex-shrink-0 flex flex-col mr-1" style={{ gap: GAP, paddingTop: 16 }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div
                key={i}
                className="text-[8px] text-slate-400 dark:text-slate-500 text-right select-none font-medium leading-none flex items-center justify-end"
                style={{ width: 14, height: CELL }}
              >
                {i % 2 === 1 ? d : ""}
              </div>
            ))}
          </div>

          {/* Month columns */}
          {months.map((mg) => {
            const numWeeks = mg.weeks.length;
            return (
              <div key={`${mg.year}-${mg.month}`} className="flex-shrink-0 mr-[6px]">
                {/* Month label */}
                <div className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 mb-[2px] leading-none">
                  {mg.name}
                </div>

                {/* Transposed grid: 7 rows (weekdays) × N columns (weeks) */}
                <div className="flex" style={{ gap: GAP }}>
                  {Array.from({ length: numWeeks }, (_, wi) => (
                    <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                      {mg.weeks[wi].map((day, di) => {
                        if (!day) {
                          return (
                            <div key={di} style={{ width: CELL, height: CELL }} />
                          );
                        }

                        const dateStr = toDateString(day);
                        const count = data[dateStr] ?? 0;
                        const colorClass = getColorClass(count);
                        const isToday = dateStr === todayStr;

                        const label =
                          count > 0
                            ? `${count} contribution${count === 1 ? "" : "s"}`
                            : "No contributions";
                        const dateLabel = day.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        });

                        return (
                          <div
                            key={di}
                            className={`rounded-[2px] group relative ${colorClass} ${
                              isToday
                                ? "ring-1 ring-indigo-500 dark:ring-indigo-400"
                                : ""
                            } hover:ring-1 hover:ring-slate-400 dark:hover:ring-slate-300 transition-all duration-75`}
                            style={{ width: CELL, height: CELL }}
                          >
                            <span
                              className="
                                pointer-events-none absolute z-30 bottom-full mb-1 left-1/2 -translate-x-1/2
                                whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-medium shadow-lg
                                bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900
                                opacity-0 group-hover:opacity-100 transition-opacity duration-150
                              "
                            >
                              {label} on {dateLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer — legend */}
      <div className="flex flex-wrap justify-between items-center mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 gap-2">
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Consistency is key to cracking MCA exams.
        </p>
        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
          <span>Less</span>
          {[
            "bg-slate-200 dark:bg-slate-700",
            "bg-green-300 dark:bg-green-800",
            "bg-green-400 dark:bg-green-600",
            "bg-green-500 dark:bg-green-500",
            "bg-green-600 dark:bg-green-400",
          ].map((cls, i) => (
            <div key={i} className={`w-[10px] h-[10px] rounded-sm ${cls}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ContributionCalendar;