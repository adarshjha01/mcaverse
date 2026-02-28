"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { User } from "firebase/auth";
import { storage } from "@/lib/firebaseClient";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import {
  IconX,
  IconUserCircle,
  IconBuilding,
  IconBook,
  IconMapPin,
  IconLinkedIn,
  IconGithub,
  IconMail,
  IconTarget,
  IconCheckCircle,
} from "@/components/ui/Icons";

// ─── Types ──────────────────────────────────────────────────────────────────────

export type ProfileData = {
  name?: string;
  college?: string;
  course?: string;
  location?: string;
  photoURL?: string;
  currentStreak?: number;
  bio?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  targetExam?: string;
  examYear?: string;
  preparationStatus?: string;
  semester?: string;
  enrollmentYear?: string;
  graduationYear?: string;
  skills?: string;
  interests?: string;
};

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  user: User;
  onProfileUpdated: (updatedProfile: ProfileData) => void;
};

// ─── Constants ──────────────────────────────────────────────────────────────────

const TARGET_EXAMS = [
  "NIMCET",
  "CUET PG",
  "BHU PET",
  "JNU",
  "DU",
  "IPU CET",
  "TANCET",
  "MAH MCA CET",
  "OJEE",
  "Other",
];

const PREP_STATUSES = [
  "Just Getting Started",
  "Building Basics",
  "Intermediate",
  "Advanced / Revision Mode",
  "Test Series Phase",
];

const SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 8 }, (_, i) => String(CURRENT_YEAR - 3 + i));

// ─── Helpers ────────────────────────────────────────────────────────────────────

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-200 dark:border-slate-700/60">
    {icon}
    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {title}
    </h3>
  </div>
);

const FormField = ({
  label,
  id,
  children,
  hint,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  hint?: string;
}) => (
  <div className="space-y-1.5">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
    >
      {label}
    </label>
    {children}
    {hint && (
      <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>
    )}
  </div>
);

const inputClasses =
  "w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 transition-colors duration-150";

const selectClasses =
  "w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 transition-colors duration-150 appearance-none cursor-pointer";

// ─── Tag Input ──────────────────────────────────────────────────────────────────

const TagInput = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) => {
  const [input, setInput] = useState("");
  const tags = value ? value.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed].join(", "));
      setInput("");
    }
  };

  const removeTag = (idx: number) => {
    onChange(tags.filter((_, i) => i !== idx).join(", "));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className={inputClasses}
        />
        <button
          type="button"
          onClick={addTag}
          className="flex-shrink-0 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
        >
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="hover:text-red-500 transition-colors"
              >
                <IconX className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Profile Completion ────────────────────────────────────────────────────────

const computeCompletion = (p: ProfileData): number => {
  const fields: (keyof ProfileData)[] = [
    "name", "photoURL", "college", "course", "location", "bio",
    "targetExam", "preparationStatus", "linkedin", "github",
  ];
  const filled = fields.filter((f) => p[f] && String(p[f]).trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
};

// ─── Main Component ────────────────────────────────────────────────────────────

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  user,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"personal" | "academic" | "social">("personal");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form state — mirrors ProfileData
  const [form, setForm] = useState<ProfileData>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Sync form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({ ...profile });
      setFile(null);
      setPreview(null);
      setUploadProgress(0);
      setMessage(null);
      setActiveTab("personal");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, profile]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Image preview
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const updateField = useCallback(
    (key: keyof ProfileData, value: string) => setForm((prev) => ({ ...prev, [key]: value })),
    []
  );

  const completion = computeCompletion({ ...form, photoURL: preview || form.photoURL });

  // ─── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);

    try {
      const token = await user.getIdToken();
      const formData = new FormData();
      formData.append("userId", user.uid);

      // Scalar fields
      const scalarKeys: (keyof ProfileData)[] = [
        "name", "college", "course", "location", "bio", "phone",
        "linkedin", "github", "targetExam", "examYear",
        "preparationStatus", "semester", "enrollmentYear",
        "graduationYear", "skills", "interests",
      ];
      for (const key of scalarKeys) {
        formData.append(key, String(form[key] ?? ""));
      }

      // Upload image if changed
      if (file) {
        const storageRef = ref(storage, `profile-pictures/${user.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
            reject,
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              formData.append("imageUrl", url);
              resolve();
            }
          );
        });
      }

      const res = await fetch("/api/profile", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errText = await res.text();
        let errMsg = "Failed to save profile.";
        try { errMsg = JSON.parse(errText)?.error || errMsg; } catch {}
        setMessage({ text: errMsg, type: "error" });
        return;
      }

      // Refetch updated profile
      const profileRes = await fetch(`/api/profile?userId=${user.uid}`);
      const updated = profileRes.ok ? await profileRes.json() : form;
      onProfileUpdated(updated);
      setMessage({ text: "Profile saved successfully!", type: "success" });
      setTimeout(() => onClose(), 800);
    } catch (err) {
      console.error(err);
      setMessage({ text: "An unexpected error occurred.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  // ─── Tabs ─────────────────────────────────────────────────────────────────

  const tabs = [
    { key: "personal" as const, label: "Personal" },
    { key: "academic" as const, label: "Academic" },
    { key: "social" as const, label: "Social & More" },
  ];

  const photoSrc =
    preview ||
    form.photoURL ||
    user.photoURL ||
    `https://placehold.co/128x128/E2E8F0/475569?text=${(user.displayName || "U").charAt(0)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
      >
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Edit Profile
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Complete your profile to get the most out of MCAverse
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>

          {/* Completion bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-grow h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${completion}%`,
                  background:
                    completion < 40
                      ? "#ef4444"
                      : completion < 70
                      ? "#f59e0b"
                      : "#22c55e",
                }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 tabular-nums w-10 text-right">
              {completion}%
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 -mb-px">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === t.key
                    ? "bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-b-0 border-slate-200 dark:border-slate-700/60"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {/* ═══════ TAB: Personal ═══════ */}
            {activeTab === "personal" && (
              <>
                {/* Avatar row */}
                <div className="flex items-center gap-5">
                  <div className="relative group flex-shrink-0">
                    <Image
                      src={photoSrc}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-white text-xs font-medium">Change</span>
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const selected = e.target.files?.[0] || null;
                        if (selected && selected.size > 5 * 1024 * 1024) {
                          setMessage({ text: "Image must be under 5 MB.", type: "error" });
                          e.target.value = "";
                          return;
                        }
                        setFile(selected);
                      }}
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Profile Photo
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      JPG, PNG under 5 MB. Recommended 256×256.
                    </p>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <SectionHeader
                  icon={<IconUserCircle className="w-4 h-4 text-slate-400" />}
                  title="Basic Information"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Full Name *" id="name">
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name || ""}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Your full name"
                      className={inputClasses}
                    />
                  </FormField>

                  <FormField label="Phone" id="phone" hint="Won't be shown publicly">
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone || ""}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className={inputClasses}
                    />
                  </FormField>
                </div>

                <FormField label="Bio" id="bio" hint={`${(form.bio || "").length}/300 characters`}>
                  <textarea
                    id="bio"
                    rows={3}
                    maxLength={300}
                    value={form.bio || ""}
                    onChange={(e) => updateField("bio", e.target.value)}
                    placeholder="MCA aspirant passionate about data structures and algorithms..."
                    className={`${inputClasses} resize-none`}
                  />
                </FormField>

                <FormField label="Location" id="location">
                  <div className="relative">
                    <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="location"
                      type="text"
                      value={form.location || ""}
                      onChange={(e) => updateField("location", e.target.value)}
                      placeholder="City, State or Country"
                      className={`${inputClasses} pl-9`}
                    />
                  </div>
                </FormField>
              </>
            )}

            {/* ═══════ TAB: Academic ═══════ */}
            {activeTab === "academic" && (
              <>
                <SectionHeader
                  icon={<IconBuilding className="w-4 h-4 text-slate-400" />}
                  title="College Details"
                />

                <FormField label="College / University" id="college">
                  <div className="relative">
                    <IconBuilding className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="college"
                      type="text"
                      value={form.college || ""}
                      onChange={(e) => updateField("college", e.target.value)}
                      placeholder="e.g., National Institute of Technology"
                      className={`${inputClasses} pl-9`}
                    />
                  </div>
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Course / Program" id="course">
                    <div className="relative">
                      <IconBook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="course"
                        type="text"
                        value={form.course || ""}
                        onChange={(e) => updateField("course", e.target.value)}
                        placeholder="e.g., MCA, BCA, B.Tech CS"
                        className={`${inputClasses} pl-9`}
                      />
                    </div>
                  </FormField>

                  <FormField label="Current Semester" id="semester">
                    <select
                      id="semester"
                      value={form.semester || ""}
                      onChange={(e) => updateField("semester", e.target.value)}
                      className={selectClasses}
                    >
                      <option value="">Select semester</option>
                      {SEMESTERS.map((s) => (
                        <option key={s} value={s}>{s} Semester</option>
                      ))}
                      <option value="Graduated">Graduated</option>
                    </select>
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Enrollment Year" id="enrollmentYear">
                    <select
                      id="enrollmentYear"
                      value={form.enrollmentYear || ""}
                      onChange={(e) => updateField("enrollmentYear", e.target.value)}
                      className={selectClasses}
                    >
                      <option value="">Select year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Expected Graduation" id="graduationYear">
                    <select
                      id="graduationYear"
                      value={form.graduationYear || ""}
                      onChange={(e) => updateField("graduationYear", e.target.value)}
                      className={selectClasses}
                    >
                      <option value="">Select year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <SectionHeader
                  icon={<IconTarget className="w-4 h-4 text-slate-400" />}
                  title="Exam Preparation"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Target Exam" id="targetExam">
                    <select
                      id="targetExam"
                      value={form.targetExam || ""}
                      onChange={(e) => updateField("targetExam", e.target.value)}
                      className={selectClasses}
                    >
                      <option value="">Select your target exam</option>
                      {TARGET_EXAMS.map((exam) => (
                        <option key={exam} value={exam}>{exam}</option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Target Year" id="examYear">
                    <select
                      id="examYear"
                      value={form.examYear || ""}
                      onChange={(e) => updateField("examYear", e.target.value)}
                      className={selectClasses}
                    >
                      <option value="">Select year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <FormField label="Preparation Level" id="preparationStatus">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PREP_STATUSES.map((status) => (
                      <label
                        key={status}
                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border cursor-pointer transition-all text-sm ${
                          form.preparationStatus === status
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/30"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="preparationStatus"
                          value={status}
                          checked={form.preparationStatus === status}
                          onChange={(e) => updateField("preparationStatus", e.target.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            form.preparationStatus === status
                              ? "border-indigo-500 bg-indigo-500"
                              : "border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          {form.preparationStatus === status && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        {status}
                      </label>
                    ))}
                  </div>
                </FormField>
              </>
            )}

            {/* ═══════ TAB: Social & More ═══════ */}
            {activeTab === "social" && (
              <>
                <SectionHeader
                  icon={<IconLinkedIn className="w-4 h-4 text-slate-400" />}
                  title="Social Profiles"
                />

                <FormField label="LinkedIn" id="linkedin">
                  <div className="relative">
                    <IconLinkedIn className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="linkedin"
                      type="url"
                      value={form.linkedin || ""}
                      onChange={(e) => updateField("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className={`${inputClasses} pl-9`}
                    />
                  </div>
                </FormField>

                <FormField label="GitHub" id="github">
                  <div className="relative">
                    <IconGithub className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="github"
                      type="url"
                      value={form.github || ""}
                      onChange={(e) => updateField("github", e.target.value)}
                      placeholder="https://github.com/yourusername"
                      className={`${inputClasses} pl-9`}
                    />
                  </div>
                </FormField>

                <SectionHeader
                  icon={<IconCheckCircle className="w-4 h-4 text-slate-400" />}
                  title="Skills & Interests"
                />

                <FormField label="Skills" id="skills" hint="Press Enter or comma to add">
                  <TagInput
                    value={form.skills || ""}
                    onChange={(val) => updateField("skills", val)}
                    placeholder="e.g., Data Structures, Python, SQL"
                  />
                </FormField>

                <FormField label="Interests" id="interests" hint="Press Enter or comma to add">
                  <TagInput
                    value={form.interests || ""}
                    onChange={(val) => updateField("interests", val)}
                    placeholder="e.g., Machine Learning, Web Dev, Competitive Coding"
                  />
                </FormField>
              </>
            )}
          </div>

          {/* ── Footer ─────────────────────────────────────────────────────── */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/50">
            {message && (
              <div
                className={`mb-3 px-3 py-2 rounded-lg text-sm font-medium text-center ${
                  message.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                }`}
              >
                {message.text}
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              <p className="hidden sm:block text-xs text-slate-400 dark:text-slate-500">
                {completion < 100
                  ? `${100 - completion}% more to complete your profile`
                  : "Your profile is complete!"}
              </p>
              <div className="flex gap-3 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
