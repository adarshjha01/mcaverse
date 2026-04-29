"use client";

import React, { useState, useEffect } from 'react';
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
    IconX,
    IconMail,
    IconFlame
} from '@/components/ui/Icons';

const primaryLinks = [
    { href: "/videos", label: "Video Lectures", icon: <IconVideo className="w-5 h-5"/> },
    { href: "/mock-tests", label: "Mock Tests", icon: <IconFileText className="w-5 h-5"/> },
    { href: "/dpp", label: "DPP", icon: <IconFlame className="w-5 h-5"/> },
    { href: "/community", label: "Community", icon: <IconUsers className="w-5 h-5"/> },
    { href: "/contact", label: "Contact", icon: <IconMail className="w-5 h-5"/> },
];

const secondaryLinks = [
    { href: "/", label: "Home", icon: null },
    { href: "/ai-assistant", label: "AI Assistant", icon: <IconBot className="w-5 h-5"/> },
    { href: "/success-stories", label: "Success Stories", icon: <IconTrophy className="w-5 h-5"/> },
    { href: "/podcast", label: "Podcast", icon: <IconMic className="w-5 h-5"/> },
    { href: "/about", label: "About Us", icon: null },
];

const allLinks = [secondaryLinks[0], ...primaryLinks, ...secondaryLinks.slice(1)];

export const HorizontalNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const handleLogout = async () => {
        await signOut(auth);
        setIsMenuOpen(false);
        router.push('/');
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm' : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-14 sm:h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-2.5">
                            <Image src="/mcaverse-logo.png" alt="MCAverse Logo" width={30} height={30} className="rounded-full" />
                            <span className="font-bold text-lg text-slate-800 dark:text-white">MCAverse</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
                        {primaryLinks.map((link) => {
                            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                            return (
                                <Link key={link.label} href={link.href} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive 
                                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}>
                                    {link.icon}
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop Right */}
                    <div className="hidden md:flex items-center gap-2">
                        <ThemeToggle />
                        {user ? (
                            <Link href="/dashboard" className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors active:scale-[0.97]">Dashboard</Link>
                        ) : (
                            <Link href="/login" className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors active:scale-[0.97]">Login</Link>
                        )}
                    </div>

                    {/* Mobile Controls */}
                    <div className="md:hidden flex items-center gap-1.5">
                        <ThemeToggle />
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 dark:text-slate-300 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Toggle menu">
                            {isMenuOpen ? <IconX className="w-5 h-5" /> : <IconMenu2 className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`md:hidden fixed inset-0 top-14 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)} />

            {/* Mobile Slide Panel */}
            <div className={`md:hidden fixed top-14 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-xl transition-all duration-200 overflow-y-auto max-h-[calc(100dvh-3.5rem)] ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'}`}>
                <div className="p-3 space-y-0.5">
                    {allLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.label} href={link.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                isActive 
                                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`} onClick={() => setIsMenuOpen(false)}>
                                {link.icon && <span className="text-slate-400 dark:text-slate-500">{link.icon}</span>}
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}

                    <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                        {user ? (
                            <>
                                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => setIsMenuOpen(false)}>
                                    {user.photoURL ? (
                                        <Image src={user.photoURL} alt="Profile" width={20} height={20} className="rounded-full w-5 h-5" />
                                    ) : (
                                        <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{(user.displayName || 'U').charAt(0)}</span>
                                    )}
                                    <span>{user.displayName || 'Dashboard'}</span>
                                </Link>
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="block w-full text-center bg-indigo-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-indigo-700 transition-colors active:scale-[0.97]" onClick={() => setIsMenuOpen(false)}>Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};