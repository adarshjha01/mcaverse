"use client";

import { useState, useEffect, useMemo } from "react";

type ContributionCalendarProps = {
  userId: string;
};

type MonthLabel = {
  month: string;
  colIndex: number; // which column (week) this label sits above
};

const CELL_SIZE = 13;   // px — width & height of each square
const CELL_GAP = 4;     // px — gap between squares
const CELL_STEP = CELL_SIZE + CELL_GAP; // 17px per cell

const getColorClass = (count: number): string => {
  if (count === 0) return "bg-slate-100 dark:bg-slate-800";
  if (count <= 2)  return "bg-green-200 dark:bg-green-900";
  if (count <= 5)  return "bg-green-400 dark:bg-green-700";
  if (count <= 8)  return "bg-green-600 dark:bg-green-500";
  return "bg-green-700 dark:bg-green-400";
};

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Return "YYYY-MM-DD" for a Date without timezone shift */
const toDateString = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

/** Rewind a date to the previous Sunday (or keep it if already Sunday) */
const prevSunday = (d: Date): Date => {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - copy.getDay());
  return copy;
};

/** Advance a date to the next Saturday (or keep it if already Saturday) */
const nextSaturday = (d: Date): Date => {
  const copy = new Date(d);
  const diff = 6 - copy.getDay();
  copy.setDate(copy.getDate() + diff);
  return copy;
};

// ─── main component ────────────────────────────────────────────────────────────

const ContributionCalendar = ({ userId }: ContributionCalendarProps) => {
  const currentYear = new Date().getFullYear();
  const [displayYear, setDisplayYear] = useState<"last-year" | number>("last-year");
  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/user/practice-history?userId=${userId}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  // ── build grid data ──────────────────────────────────────────────────────────
  const { weeks, monthLabels, totalContributions } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Determine the [rangeStart, rangeEnd] window the user cares about
    let rangeStart: Date;
    let rangeEnd: Date;

    if (displayYear === "last-year") {
      rangeEnd = new Date(today);
      rangeStart = new Date(today);
      rangeStart.setFullYear(rangeStart.getFullYear() - 1);
      rangeStart.setDate(rangeStart.getDate() + 1); // exactly 365 days
    } else {
      rangeStart = new Date(displayYear, 0, 1);
      rangeEnd = displayYear === currentYear ? today : new Date(displayYear, 11, 31);
    }

    // The grid starts on the Sunday on or before rangeStart
    // and ends on the Saturday on or after rangeEnd
    const gridStart = prevSunday(rangeStart);
    const gridEnd   = nextSaturday(rangeEnd);

    // Build weeks: each week is an array of 7 Date|null (null = outside range)
    const weeksArray: (Date | null)[][] = [];
    const cursor = new Date(gridStart);

    while (cursor <= gridEnd) {
      const week: (Date | null)[] = [];
      for (let dow = 0; dow < 7; dow++) {
        const day = new Date(cursor);
        // Show cell only if within [rangeStart, rangeEnd]
        week.push(day >= rangeStart && day <= rangeEnd ? day : null);
        cursor.setDate(cursor.getDate() + 1);
      }
      weeksArray.push(week);
    }

    // Build month labels: place a label at the first week where a new month begins
    // We only show a label if the first day of that month falls within that week
    // AND there's at least ~3 weeks distance from the previous label (avoids overlap)
    const labels: MonthLabel[] = [];
    let lastLabelCol = -4;

    weeksArray.forEach((week, colIndex) => {
      // Find the first non-null day in this week
      const firstReal = week.find((d) => d !== null);
      if (!firstReal) return;

      // If day-of-month is 1..7 it means a new month starts this week
      if (firstReal.getDate() <= 7 && colIndex - lastLabelCol >= 3) {
        labels.push({
          month: firstReal.toLocaleString("default", { month: "short" }),
          colIndex,
        });
        lastLabelCol = colIndex;
      }
    });

    // Total contributions in range
    let total = 0;
    weeksArray.forEach((week) =>
      week.forEach((day) => {
        if (day) total += data[toDateString(day)] ?? 0;
      })
    );

    return { weeks: weeksArray, monthLabels: labels, totalContributions: total };
  }, [displayYear, data, currentYear]);

  // ── derived layout values ────────────────────────────────────────────────────
  const numCols     = weeks.length;
  const LABEL_H     = 22; // px — height reserved for month labels row
  const DAY_LABEL_W = 36; // px — width reserved for Mon/Wed/Fri labels column

  // Total SVG / grid dimensions
  const gridW = numCols * CELL_STEP - CELL_GAP;
  const gridH = 7 * CELL_STEP - CELL_GAP;

  // ── loading skeleton ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Practice History</h2>
        </div>
        <div className="h-32 w-full bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
      </div>
    );
  }

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Practice History</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {totalContributions.toLocaleString()} contributions
          </p>
        </div>
        <select
          value={displayYear}
          onChange={(e) =>
            setDisplayYear(
              e.target.value === "last-year" ? "last-year" : Number(e.target.value)
            )
          }
          className="text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="last-year">Last 12 months</option>
          {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Calendar grid — using SVG-coordinate math via inline styles for pixel-perfect alignment */}
      <div className="overflow-x-auto">
        <div
          className="relative inline-flex"
          style={{ paddingLeft: DAY_LABEL_W, paddingTop: LABEL_H }}
        >
          {/* ── Month labels row ── */}
          <div
            className="absolute top-0 text-xs text-slate-500 dark:text-slate-400 font-medium select-none"
            style={{ left: DAY_LABEL_W, height: LABEL_H }}
          >
            {monthLabels.map(({ month, colIndex }) => (
              <span
                key={`${month}-${colIndex}`}
                className="absolute leading-none"
                style={{
                  left: colIndex * CELL_STEP,
                  top: 0,
                }}
              >
                {month}
              </span>
            ))}
          </div>

          {/* ── Day-of-week labels column ── */}
          <div
            className="absolute left-0 text-xs text-slate-500 dark:text-slate-400 font-medium select-none"
            style={{ top: LABEL_H, width: DAY_LABEL_W }}
          >
            {/* Sun=0 Mon=1 Tue=2 Wed=3 Thu=4 Fri=5 Sat=6 */}
            {(["", "Mon", "", "Wed", "", "Fri", ""] as const).map((label, i) => (
              <div
                key={i}
                className="absolute right-2 leading-none flex items-center"
                style={{
                  top: i * CELL_STEP + Math.floor(CELL_SIZE / 2) - 5, // vertically centre text in row
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* ── Cells grid ── */}
          <div
            className="relative"
            style={{ width: gridW, height: gridH }}
          >
            {weeks.map((week, colIndex) =>
              week.map((day, rowIndex) => {
                if (!day) {
                  // Empty cell (outside range) — still occupies space
                  return (
                    <div
                      key={`${colIndex}-${rowIndex}`}
                      className="absolute"
                      style={{
                        left: colIndex * CELL_STEP,
                        top:  rowIndex * CELL_STEP,
                        width:  CELL_SIZE,
                        height: CELL_SIZE,
                      }}
                    />
                  );
                }

                const dateStr = toDateString(day);
                const count = data[dateStr] ?? 0;
                const colorClass = getColorClass(count);
                const label = count > 0
                  ? `${count} contribution${count === 1 ? "" : "s"}`
                  : "No contributions";
                const dateLabel = day.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div
                    key={`${colIndex}-${rowIndex}`}
                    className={`absolute rounded-[2px] group ${colorClass} hover:ring-1 hover:ring-slate-400 dark:hover:ring-slate-500 transition-all duration-75`}
                    style={{
                      left:   colIndex * CELL_STEP,
                      top:    rowIndex * CELL_STEP,
                      width:  CELL_SIZE,
                      height: CELL_SIZE,
                    }}
                  >
                    {/* Tooltip */}
                    <span className="
                      pointer-events-none absolute z-20 bottom-full mb-2 left-1/2 -translate-x-1/2
                      whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium shadow-lg
                      bg-slate-900 text-white dark:bg-white dark:text-slate-900
                      opacity-0 group-hover:opacity-100 transition-opacity duration-150
                    ">
                      {label} on {dateLabel}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap justify-between items-center mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 gap-2">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Consistency is key to cracking MCA exams.
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Less</span>
          {[
            "bg-slate-100 dark:bg-slate-800",
            "bg-green-200 dark:bg-green-900",
            "bg-green-400 dark:bg-green-700",
            "bg-green-600 dark:bg-green-500",
            "bg-green-700 dark:bg-green-400",
          ].map((cls, i) => (
            <div
              key={i}
              className={`rounded-[2px] ${cls}`}
              style={{ width: CELL_SIZE, height: CELL_SIZE }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ContributionCalendar;