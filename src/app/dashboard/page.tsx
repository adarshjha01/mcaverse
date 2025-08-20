// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navbar } from "@/components/landing/Navbar";
import { storage } from '@/lib/firebaseClient';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Image from 'next/image';
import Link from 'next/link';
import { ProgressSnapshot } from '@/components/dashboard/ProgressSnapshot';
import { IconBuilding, IconMapPin, IconGithub, IconLinkedIn, IconBook } from '@/components/ui/Icons';

type ProfileData = {
    name?: string;
    college?: string;
    course?: string;
    location?: string;
    bio?: string;
    linkedin?: string;
    github?: string;
    photoURL?: string;
};

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<ProfileData>({});
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (user) {
            fetch(`/api/profile?userId=${user.uid}`)
                .then(res => res.json())
                .then(data => {
                    setProfile(data);
                    setLoading(false);
                });
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!user) return;
        setLoading(true);
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
                fetch(`/api/profile?userId=${user.uid}`).then(res => res.json()).then(setProfile);
                setIsEditing(false);
            } else {
                setMessage({ text: result.error || 'An error occurred.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'An unexpected error occurred.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || (loading && !isEditing)) {
        return <div className="flex h-screen items-center justify-center text-slate-700">Loading...</div>;
    }

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center text-center">
                <div>
                    <p className="mb-4 text-slate-700">Please log in to view your dashboard.</p>
                    <Link href="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-lg">Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <main className="pt-16">
                <section className="py-12 bg-white border-b border-slate-200">
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Image src={profile.photoURL || user.photoURL || `https://placehold.co/80x80/E2E8F0/475569?text=${(user.displayName || 'U').charAt(0)}`} alt="Profile" width={80} height={80} className="rounded-full" />
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">{profile.name || user.displayName}</h1>
                                <p className="text-slate-500">{user.email}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsEditing(!isEditing)} className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                            {isEditing ? "Cancel" : "Edit Profile"}
                        </button>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-12">
                    {isEditing ? (
                        <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border border-slate-200 space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800">Edit Profile</h2>
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
                                <button type="button" onClick={() => setIsEditing(false)} className="bg-slate-200 text-slate-800 font-semibold px-6 py-3 rounded-lg">Cancel</button>
                                <button type="submit" disabled={loading} className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg">
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                            {message && <p className={`text-sm text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{message.text}</p>}
                        </form>
                    ) : (
                        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border border-slate-200 space-y-4">
                            <h2 className="text-2xl font-bold text-slate-800">Your Profile</h2>
                            <div className="flex items-center gap-3"><IconBuilding className="text-slate-500"/> <span className="font-semibold text-slate-700">College:</span> <span className="text-slate-600">{profile.college || 'Not specified'}</span></div>
                            <div className="flex items-center gap-3"><IconBook className="text-slate-500"/> <span className="font-semibold text-slate-700">Course:</span> <span className="text-slate-600">{profile.course || 'Not specified'}</span></div>
                            <div className="flex items-center gap-3"><IconMapPin className="text-slate-500"/> <span className="font-semibold text-slate-700">Location:</span> <span className="text-slate-600">{profile.location || 'Not specified'}</span></div>
                        </div>
                    )}
                    <div className="max-w-2xl mx-auto">
                        <ProgressSnapshot />
                    </div>
                </div>
            </main>
        </div>
    );
}
