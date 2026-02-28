"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { auth } from '@/lib/firebaseClient';
import { signOut } from 'firebase/auth';
import { ThemeToggle } from '@/components/common/ThemeToggle'; 
import { 
    IconVideo, 
    IconFileText, 
    IconBot, 
    IconTrophy, 
    IconMic, 
    IconUsers, 
    IconMenu2, 
    IconX 
} from '@/components/ui/Icons';

// Primary links: shown on desktop navbar AND mobile menu
const primaryLinks = [
    { href: "/videos", label: "Video Lectures", icon: <IconVideo className="w-5 h-5"/> },
    { href: "/mock-tests", label: "Practice", icon: <IconFileText className="w-5 h-5"/> },
    { href: "/community", label: "Community", icon: <IconUsers className="w-5 h-5"/> },
];

// Secondary links: shown ONLY in mobile menu
const secondaryLinks = [
    { href: "/", label: "Home", icon: null },
    { href: "/ai-assistant", label: "AI Assistant", icon: <IconBot className="w-5 h-5"/> },
    { href: "/success-stories", label: "Success Stories", icon: <IconTrophy className="w-5 h-5"/> },
    { href: "/podcast", label: "Podcast", icon: <IconMic className="w-5 h-5"/> },
    { href: "/about", label: "About Us", icon: null },
];

// All links combined for mobile menu (Home first, then primary, then rest of secondary)
const allLinks = [secondaryLinks[0], ...primaryLinks, ...secondaryLinks.slice(1)];

export const HorizontalNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();

    const handleLogout = async () => {
        await signOut(auth);
        setIsMenuOpen(false);
        router.push('/');
    };

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-3">
                            <Image src="/mcaverse-logo.png" alt="MCAverse Logo" width={32} height={32} className="rounded-full" />
                            <span className="font-bold text-xl text-slate-800 dark:text-white">MCAverse</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation — centered primary links */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-2">
                        {primaryLinks.map((link) => {
                            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                            return (
                                <Link key={link.label} href={link.href} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive 
                                    ? 'text-indigo-600 bg-indigo-50 dark:bg-slate-700 dark:text-white' 
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}>
                                    {link.icon}
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop Right — Theme Toggle + Auth */}
                    <div className="hidden md:flex items-center gap-2">
                        <ThemeToggle />
                        {user ? (
                            <Link href="/dashboard" className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Dashboard</Link>
                        ) : (
                            <Link href="/login" className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Login</Link>
                        )}
                    </div>

                    {/* Mobile Menu Button + Theme Toggle */}
                    <div className="md:hidden flex items-center gap-2">
                        <ThemeToggle />
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 dark:text-slate-300 p-2">
                            {isMenuOpen ? <IconX className="w-6 h-6" /> : <IconMenu2 className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown — ALL links (primary + secondary) */}
            {isMenuOpen && (
                <div className="md:hidden p-4 space-y-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg">
                    {allLinks.map((link) => (
                        <Link key={link.label} href={link.href} className="flex items-center gap-3 p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsMenuOpen(false)}>
                            {link.icon}
                            <span>{link.label}</span>
                        </Link>
                    ))}

                    {user ? (
                        <>
                            <Link href="/dashboard" className="flex items-center gap-3 p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsMenuOpen(false)}>
                                {user.photoURL ? (
                                    <Image src={user.photoURL} alt="Profile" width={20} height={20} className="rounded-full w-5 h-5" />
                                ) : (
                                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-400">{(user.displayName || 'U').charAt(0)}</span>
                                )}
                                <span>{user.displayName || 'Dashboard'}</span>
                            </Link>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="block w-full text-center bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    )}
                </div>
            )}
        </header>
    );
};