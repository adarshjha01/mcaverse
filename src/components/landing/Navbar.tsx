// src/components/landing/Navbar.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { auth } from '@/lib/firebaseClient';
import { signOut } from 'firebase/auth';

// --- SVG ICONS ---
const IconFileText = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>;
const IconBot = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>;
const IconVideo = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 8-6 4 6 4V8Z"></path><rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect></svg>;
const IconTrophy = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>;
const IconMic = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>;
const IconUsers = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconMenu = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;
const IconX = ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>;
const IconShare = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>;

export const Navbar = () => {
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const pathname = usePathname();

    const handleLogout = async () => {
        await signOut(auth);
    };

    const handleShare = async () => {
        const shareData = {
            title: 'MCAverse',
            text: 'Check out MCAverse - Guiding MCA Aspirants & Graduates to Success!',
            url: window.location.origin,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.origin);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            console.error('Error sharing:', err);
            try {
              const textArea = document.createElement('textarea');
              textArea.value = window.location.origin;
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand('copy');
              document.body.removeChild(textArea);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch (copyErr) {
              alert('Could not copy link.');
            }
        }
    };
    
    const navLinks = [
        { href: "/", label: "Home", icon: null },
        { href: "/mock-tests", label: "Mock Tests", icon: <IconFileText /> },
        { href: "/ai-assistant", label: "AI Assistant", icon: <IconBot /> },
        { href: "/videos", label: "Videos", icon: <IconVideo /> },
        { href: "/success-stories", label: "Success Stories", icon: <IconTrophy /> },
        { href: "/podcast", label: "Podcast", icon: <IconMic /> },
        { href: "/community", label: "Community", icon: <IconUsers /> },
        { href: "/about", label: "About", icon: null },
    ];

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3">
                            <Image src="/mcaverse-logo.png" alt="MCAverse Logo" width={32} height={32} className="rounded-full" />
                            <span className="font-bold text-xl text-slate-800 dark:text-white">MCAverse</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex flex-1 items-center justify-center">
                        <nav className="flex items-center space-x-1 lg:space-x-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link key={link.label} href={link.href} className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                        isActive 
                                        ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white' 
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}>
                                        {link.icon}
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="hidden md:flex items-center justify-end space-x-4">
                        {user ? (
                             <button onClick={handleLogout} className="bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-slate-600">Logout</button>
                        ) : (
                            <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700">Login</Link>
                        )}
                        <button onClick={handleShare} className="relative bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 p-2 rounded-md text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600">
                            <IconShare />
                            {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded">Copied!</span>}
                        </button>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800">
                            {isMenuOpen ? <IconX /> : <IconMenu />}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => {
                             const isActive = pathname === link.href;
                             return (
                                <Link key={link.label} href={link.href} className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                                    isActive ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                                }`}>
                                    {link.icon}
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                        <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4 flex flex-col space-y-2">
                            {user ? (
                                <button onClick={handleLogout} className="w-full text-left bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2 rounded-md text-base font-medium">Logout</button>
                            ) : (
                                <Link href="/login" className="block bg-indigo-600 text-white px-3 py-2 rounded-md text-base font-semibold text-center">Login</Link>
                            )}
                            <button onClick={handleShare} className="flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2 rounded-md text-base font-semibold">
                                <IconShare />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
