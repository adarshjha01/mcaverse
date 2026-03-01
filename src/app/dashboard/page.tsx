// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import Image from "next/image";
import Link from "next/link";
import { ProgressSnapshot } from "@/components/dashboard/ProgressSnapshot";
import ContributionCalendar from "@/components/dashboard/ContributionCalendar";
import EditProfileModal from "@/components/dashboard/EditProfileModal";
import type { ProfileData } from "@/components/dashboard/EditProfileModal";
import {
  IconBuilding,
  IconMapPin,
  IconBook,
  IconFlame,
  IconTarget,
  IconLinkedIn,
  IconGithub,
  IconUserCircle,
  IconBarChart,
  IconCheckCircle,
  IconArrowRight,
} from "@/components/ui/Icons";

type Subject = {
  subject: string;
  topics: { name: string; lectures: any[] }[];
};

// ─── Skeleton Components ────────────────────────────────────────────────────────

const ProfileSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
    <div className="h-28 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700" />
    <div className="px-5 pb-5 -mt-12 flex flex-col items-center">
      <div className="w-[88px] h-[88px] rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-900" />
      <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded mt-3" />
      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mt-2" />
      <div className="h-9 w-full bg-slate-200 dark:bg-slate-700 rounded-lg mt-4" />
      <div className="w-full space-y-3 mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
        ))}
      </div>
    </div>
  </div>
);

const StatSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
      <div className="space-y-2">
        <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  </div>
);

// ─── Profile Info Row ───────────────────────────────────────────────────────────

const InfoRow = ({
  icon,
  iconBg,
  text,
  href,
}: {
  icon: React.ReactNode;
  iconBg: string;
  text: string;
  href?: string;
}) => (
  <div className="flex items-center gap-3 text-sm">
    <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
      {icon}
    </span>
    {href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 dark:text-indigo-400 hover:underline truncate"
      >
        {text}
      </a>
    ) : (
      <span className="text-slate-700 dark:text-slate-300 truncate">{text}</span>
    )}
  </div>
);

const StatPill = ({
  icon,
  iconBg,
  value,
  label,
}: {
  icon: React.ReactNode;
  iconBg: string;
  value: string | number;
  label: string;
}) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none p-4 flex items-center gap-3.5 transition-colors">
    <span className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
      {icon}
    </span>
    <div className="min-w-0">
      <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight truncate">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
    </div>
  </div>
);

// ─── Main Dashboard ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({});
  const [pageLoading, setPageLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [courseData, setCourseData] = useState<Subject[] | null>(null);
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    if (!authLoading && user) {
      const safeFetch = async (url: string, opts?: RequestInit) => {
        const res = await fetch(url, opts);
        if (!res.ok) {
          console.error(`Fetch failed: ${url} (${res.status})`);
          return null;
        }
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch {
          return null;
        }
      };

      (async () => {
        try {
          const token = await user.getIdToken();
          const [profileData, fetchedCourseData, streakData] = await Promise.all([
            safeFetch(`/api/profile?userId=${user.uid}`),
            safeFetch("/api/course-data"),
            safeFetch(`/api/user/streak?userId=${user.uid}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);
          if (profileData) setProfile(profileData);
          if (fetchedCourseData) setCourseData(fetchedCourseData);
          if (streakData) setStreak(streakData.currentStreak ?? 0);
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        } finally {
          setPageLoading(false);
        }
      })();
    } else if (!authLoading) {
      setPageLoading(false);
    }
  }, [user, authLoading]);

  // ─── Loading skeleton ───────────────────────────────────────────────────────

  if (authLoading || pageLoading) {
    return (
      <main className="pt-16 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
        <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="container mx-auto px-4 py-6 sm:py-8">
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded mt-3 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              {[1, 2, 3].map((i) => <StatSkeleton key={i} />)}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1"><ProfileSkeleton /></div>
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 h-36 animate-pulse" />
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 h-52 animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── Not logged in ──────────────────────────────────────────────────────────

  if (!user) {
    return (
      <main className="pt-16 flex min-h-screen items-center justify-center text-center bg-slate-50 dark:bg-slate-950">
        <div className="space-y-4 px-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mx-auto">
            <IconUserCircle className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Please log in to view your dashboard.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-2.5 rounded-xl transition-colors"
          >
            Login
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  // ─── Derived values ─────────────────────────────────────────────────────────

  const photoSrc =
    profile.photoURL ||
    user.photoURL ||
    `https://placehold.co/128x128/E2E8F0/475569?text=${(user.displayName || "U").charAt(0)}`;

  const skillTags = profile.skills
    ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className="pt-16 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
      {/* ─── Hero / Greeting ─────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 border-b border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-indigo-200/30 dark:bg-indigo-900/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-purple-200/30 dark:bg-purple-900/10 blur-3xl" />

        <div className="relative container mx-auto px-4 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {greeting()},{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              {profile.name || user.displayName || "there"}
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
            <StatPill
              icon={<IconFlame className="w-5 h-5 text-orange-500" />}
              iconBg="bg-orange-50 dark:bg-orange-900/20"
              value={streak}
              label="Day Streak"
            />
            <StatPill
              icon={<IconTarget className="w-5 h-5 text-indigo-500" />}
              iconBg="bg-indigo-50 dark:bg-indigo-900/20"
              value={profile.targetExam || "Not set"}
              label="Target Exam"
            />
            <StatPill
              icon={<IconBarChart className="w-5 h-5 text-emerald-500" />}
              iconBg="bg-emerald-50 dark:bg-emerald-900/20"
              value={profile.preparationStatus || "Not set"}
              label="Prep Level"
            />
          </div>
        </div>
      </section>

      {/* ─── Main Content ────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ─── Left Column: Profile Card ──────────────────────────────── */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
              {/* Banner */}
              <div className="h-28 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_70%)]" />
              </div>

              {/* Avatar + Name */}
              <div className="px-5 pb-5 -mt-12 flex flex-col items-center relative">
                <Image
                  src={photoSrc}
                  alt="Profile"
                  width={88}
                  height={88}
                  className="w-[88px] h-[88px] rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-lg"
                />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-3 text-center">
                  {profile.name || user.displayName}
                </h2>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1.5 line-clamp-2 px-2 leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                {/* Streak badge — fetched dynamically from /api/user/streak */}
                <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-700/50 mt-3">
                  <IconFlame className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-bold text-orange-700 dark:text-orange-400 tabular-nums">
                    {streak} Day Streak
                  </span>
                </div>

                {/* Edit button */}
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="w-full mt-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  Edit Profile
                </button>
              </div>

              {/* Info Section */}
              <div className="px-5 pb-5 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                {profile.college && (
                  <InfoRow
                    icon={<IconBuilding className="w-4 h-4 text-indigo-500" />}
                    iconBg="bg-indigo-50 dark:bg-indigo-900/20"
                    text={profile.college}
                  />
                )}
                {profile.course && (
                  <InfoRow
                    icon={<IconBook className="w-4 h-4 text-emerald-500" />}
                    iconBg="bg-emerald-50 dark:bg-emerald-900/20"
                    text={profile.course}
                  />
                )}
                {profile.location && (
                  <InfoRow
                    icon={<IconMapPin className="w-4 h-4 text-rose-500" />}
                    iconBg="bg-rose-50 dark:bg-rose-900/20"
                    text={profile.location}
                  />
                )}
                {profile.targetExam && (
                  <InfoRow
                    icon={<IconTarget className="w-4 h-4 text-amber-500" />}
                    iconBg="bg-amber-50 dark:bg-amber-900/20"
                    text={`${profile.targetExam}${profile.examYear ? ` ${profile.examYear}` : ""}`}
                  />
                )}

                {/* Social links */}
                {(profile.linkedin || profile.github) && (
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    {profile.linkedin && /^https?:\/\//i.test(profile.linkedin) && (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        title="LinkedIn"
                      >
                        <IconLinkedIn className="w-4 h-4" />
                      </a>
                    )}
                    {profile.github && /^https?:\/\//i.test(profile.github) && (
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        title="GitHub"
                      >
                        <IconGithub className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Preparation badge */}
              {profile.preparationStatus && (
                <div className="px-5 pb-4">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/40">
                    <IconCheckCircle className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      {profile.preparationStatus}
                    </span>
                  </div>
                </div>
              )}

              {/* Skills */}
              {skillTags.length > 0 && (
                <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillTags.slice(0, 8).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {skillTags.length > 8 && (
                      <span className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                        +{skillTags.length - 8}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Empty state nudge */}
              {!profile.college && !profile.targetExam && !profile.bio && (
                <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="w-full text-left p-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors group"
                  >
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Complete your profile
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      Add your college, target exam, and more
                    </p>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ─── Right Column: Activity ─────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">
            <ProgressSnapshot initialCourseData={courseData} />
            <ContributionCalendar userId={user.uid} />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
        user={user}
        onProfileUpdated={(updated) => setProfile(updated)}
      />
    </main>
  );
}