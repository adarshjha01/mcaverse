// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { storage } from '@/lib/firebaseClient';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Image from 'next/image';
import Link from 'next/link';
import { ProgressSnapshot } from '@/components/dashboard/ProgressSnapshot';
import ContributionCalendar from '@/components/dashboard/ContributionCalendar';
import { IconBuilding, IconMapPin, IconBook } from '@/components/ui/Icons';

// --- Type Definitions ---
type ProfileData = {
    name?: string;
    college?: string;
    course?: string;
    location?: string;
    photoURL?: string;
};

type Subject = {
  subject: string;
  topics: { name: string; lectures: any[] }[];
};


export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<ProfileData>({});
    const [file, setFile] = useState<File | null>(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    
    // FIX: State to hold the course data for the ProgressSnapshot
    const [courseData, setCourseData] = useState<Subject[] | null>(null);

    useEffect(() => {
        if (!authLoading && user) {
            // Fetch profile and course data in parallel for efficiency
            Promise.all([
                fetch(`/api/profile?userId=${user.uid}`).then(res => res.json()),
                fetch('/api/course-data').then(res => res.json())
            ]).then(([profileData, fetchedCourseData]) => {
                setProfile(profileData);
                setCourseData(fetchedCourseData);
            }).catch(error => {
                console.error("Failed to fetch dashboard data:", error);
            }).finally(() => {
                setPageLoading(false);
            });
        } else if (!authLoading) {
            setPageLoading(false);
        }
    }, [user, authLoading]);

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!user) return;
        setFormLoading(true);
        setMessage(null);

        const formData = new FormData(event.currentTarget);
        formData.append('userId', user.uid);

        try {
            if (file) {
                const storageRef = ref(storage, `profile-pictures/${user.uid}/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
                const snapshot = await uploadTask;
                const downloadURL = await getDownloadURL(snapshot.ref);
                formData.append('imageUrl', downloadURL);
            }

            const response = await fetch('/api/profile', { method: 'POST', body: formData });
            const result = await response.json();

            if (response.ok) {
                setMessage({ text: result.message, type: 'success' });
                const updatedProfile = await fetch(`/api/profile?userId=${user.uid}`).then(res => res.json());
                setProfile(updatedProfile);
                setIsEditing(false);
            } else {
                setMessage({ text: result.error || 'An error occurred.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'An unexpected error occurred.', type: 'error' });
        } finally {
            setFormLoading(false);
        }
    };

    if (authLoading || pageLoading) {
        return <div className="flex h-screen items-center justify-center text-slate-700">Loading Dashboard...</div>;
    }

    if (!user) {
        return (
            <main className="pt-16 flex h-screen items-center justify-center text-center">
                <div>
                    <p className="mb-4 text-slate-700">Please log in to view your dashboard.</p>
                    <Link href="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-lg">Login</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="pt-16 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* --- Left Column: Profile --- */}
                    <div className="lg:col-span-1">
                        {isEditing ? (
                            <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg shadow-md border border-slate-200 space-y-6">
                                <h2 className="text-xl font-bold text-slate-800">Edit Profile</h2>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                                    <input type="text" id="name" name="name" defaultValue={profile.name || user.displayName || ''} required className="mt-1 block w-full rounded-md border-slate-300"/>
                                </div>
                                <div>
                                    <label htmlFor="image" className="block text-sm font-medium text-slate-700">Profile Picture</label>
                                    <input type="file" id="image" name="image" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50"/>
                                </div>
                                <div>
                                    <label htmlFor="college" className="block text-sm font-medium text-slate-700">College</label>
                                    <input type="text" id="college" name="college" defaultValue={profile.college || ''} placeholder="e.g., National Institute of Technology" className="mt-1 block w-full rounded-md border-slate-300"/>
                                </div>
                                <div>
                                    <label htmlFor="course" className="block text-sm font-medium text-slate-700">Course</label>
                                    <input type="text" id="course" name="course" defaultValue={profile.course || ''} placeholder="e.g., Master of Computer Applications" className="mt-1 block w-full rounded-md border-slate-300"/>
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-slate-700">Location</label>
                                    <input type="text" id="location" name="location" defaultValue={profile.location || ''} placeholder="e.g., Bengaluru, India" className="mt-1 block w-full rounded-md border-slate-300"/>
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button type="button" onClick={() => setIsEditing(false)} className="bg-slate-200 text-slate-800 font-semibold px-4 py-2 rounded-lg">Cancel</button>
                                    <button type="submit" disabled={formLoading} className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg">
                                        {formLoading ? "Saving..." : "Save"}
                                    </button>
                                </div>
                                {message && <p className={`text-sm text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{message.text}</p>}
                            </form>
                        ) : (
                            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 space-y-4">
                               <div className="flex flex-col items-center">
                                 <Image src={profile.photoURL || user.photoURL || `https://placehold.co/128x128/E2E8F0/475569?text=${(user.displayName || 'U').charAt(0)}`} alt="Profile" width={128} height={128} className="rounded-full mb-4" />
                                 <h1 className="text-2xl font-bold text-slate-800">{profile.name || user.displayName}</h1>
                                  <button onClick={() => setIsEditing(true)} className="w-full mt-4 bg-slate-100 text-slate-800 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                                    Edit Profile
                                  </button>
                               </div>
                                <div className="pt-4 border-t border-slate-200 space-y-3">
                                    <div className="flex items-center gap-3 text-sm"><IconBuilding className="w-5 h-5 text-slate-500"/> <span className="text-slate-600">{profile.college || 'Not specified'}</span></div>
                                    <div className="flex items-center gap-3 text-sm"><IconBook className="w-5 h-5 text-slate-500"/> <span className="text-slate-600">{profile.course || 'Not specified'}</span></div>
                                    <div className="flex items-center gap-3 text-sm"><IconMapPin className="w-5 h-5 text-slate-500"/> <span className="text-slate-600">{profile.location || 'Not specified'}</span></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- Right Column: Activity --- */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* FIX: Pass the fetched course data as a prop */}
                        <ProgressSnapshot initialCourseData={courseData} />
                        <ContributionCalendar userId={user.uid} />
                    </div>
                </div>
            </div>
        </main>
    );
}