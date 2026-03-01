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
} from "@/components/ui/Icons";

type Subject = {
  subject: string;
  topics: { name: string; lectures: any[] }[];
};

// ─── Skeleton Components ────────────────────────────────────────────────────────

const ProfileSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
    <div className="h-24 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700" />
    <div className="px-5 pb-5 -mt-10 flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-900" />
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

// ─── Profile Info Row ───────────────────────────────────────────────────────────

const InfoRow = ({
  icon,
  text,
  href,
}: {
  icon: React.ReactNode;
  text: string;
  href?: string;
}) => (
  <div className="flex items-center gap-2.5 text-sm group">
    <span className="flex-shrink-0 text-slate-400 dark:text-slate-500">{icon}</span>
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
      <span className="text-slate-600 dark:text-slate-400 truncate">{text}</span>
    )}
  </div>
);

// ─── Main Dashboard ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({});
  const [pageLoading, setPageLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [courseData, setCourseData] = useState<Subject[] | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      const safeFetch = async (url: string) => {
        const res = await fetch(url);
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

      Promise.all([
        safeFetch(`/api/profile?userId=${user.uid}`),
        safeFetch("/api/course-data"),
      ])
        .then(([profileData, fetchedCourseData]) => {
          if (profileData) setProfile(profileData);
          if (fetchedCourseData) setCourseData(fetchedCourseData);
        })
        .catch((error) => {
          console.error("Failed to fetch dashboard data:", error);
        })
        .finally(() => {
          setPageLoading(false);
        });
    } else if (!authLoading) {
      setPageLoading(false);
    }
  }, [user, authLoading]);

  // ─── Loading skeleton ───────────────────────────────────────────────────────

  if (authLoading || pageLoading) {
    return (
      <main className="pt-16 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="lg:col-span-1">
              <ProfileSkeleton />
            </div>
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
        <div className="space-y-4">
          <IconUserCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-slate-600 dark:text-slate-400">
            Please log in to view your dashboard.
          </p>
          <Link
            href="/login"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors"
          >
            Login
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
    <main className="pt-16 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 sm:py-10">
        {/* Greeting */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {greeting()},{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              {profile.name || user.displayName || "there"}
            </span>
            !
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* ─── Left Column: Profile Card ──────────────────────────────── */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
              {/* Banner */}
              <div className="h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
                <div className="absolute inset-0 bg-black/10" />
              </div>

              {/* Avatar + Name */}
              <div className="px-5 pb-5 -mt-10 flex flex-col items-center relative">
                <Image
                  src={photoSrc}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-md"
                />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-2 text-center">
                  {profile.name || user.displayName}
                </h2>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1 line-clamp-2 px-2">
                    {profile.bio}
                  </p>
                )}

                {/* Streak badge */}
                <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-700/50 mt-3">
                  <IconFlame className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-bold text-orange-700 dark:text-orange-400">
                    {profile.currentStreak || 0} Day Streak
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
              <div className="px-5 pb-5 space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4">
                {profile.college && (
                  <InfoRow
                    icon={<IconBuilding className="w-4 h-4" />}
                    text={profile.college}
                  />
                )}
                {profile.course && (
                  <InfoRow
                    icon={<IconBook className="w-4 h-4" />}
                    text={profile.course}
                  />
                )}
                {profile.location && (
                  <InfoRow
                    icon={<IconMapPin className="w-4 h-4" />}
                    text={profile.location}
                  />
                )}
                {profile.targetExam && (
                  <InfoRow
                    icon={<IconTarget className="w-4 h-4" />}
                    text={`${profile.targetExam}${profile.examYear ? ` ${profile.examYear}` : ""}`}
                  />
                )}

                {/* Social links */}
                {(profile.linkedin || profile.github) && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {profile.linkedin && /^https?:\/\//i.test(profile.linkedin) && (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
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
                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      {profile.preparationStatus}
                    </span>
                  </div>
                </div>
              )}

              {/* Skills */}
              {skillTags.length > 0 && (
                <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillTags.slice(0, 8).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                    {skillTags.length > 8 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
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