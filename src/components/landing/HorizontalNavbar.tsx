"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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

export const HorizontalNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Home", icon: null },
        { href: "/videos", label: "Video Lectures", icon: <IconVideo className="w-5 h-5"/> },
        { href: "/mock-tests", label: "Practice", icon: <IconFileText className="w-5 h-5"/> },
        { href: "/ai-assistant", label: "AI Assistant", icon: <IconBot className="w-5 h-5"/> },
        { href: "/success-stories", label: "Success Stories", icon: <IconTrophy className="w-5 h-5"/> },
        { href: "/podcast", label: "Podcast", icon: <IconMic className="w-5 h-5"/> },
        { href: "/community", label: "Community", icon: <IconUsers className="w-5 h-5"/> },
        { href: "/about", label: "About Us", icon: null },
    ];

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-3">
                            <Image src="/mcaverse-logo.png" alt="MCAverse Logo" width={32} height={32} className="rounded-full" />
                            <span className="font-bold text-xl text-slate-800 dark:text-white">MCAverse</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
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
                        
                        {/* Theme Toggle (Between About Us and Login) */}
                        <div className="mx-2 border-l border-slate-200 dark:border-slate-700 pl-2 flex items-center">
                            <ThemeToggle />
                        </div>

                        <Link href="/login" className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors ml-2">Login</Link>
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

            {/* Mobile Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden p-4 space-y-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg">
                    {navLinks.map((link) => (
                        <Link key={link.label} href={link.href} className="flex items-center gap-3 p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsMenuOpen(false)}>
                            {link.icon}
                            <span>{link.label}</span>
                        </Link>
                    ))}
                    <Link href="/login" className="block w-full text-center bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700" onClick={() => setIsMenuOpen(false)}>Login</Link>
                </div>
            )}
        </header>
    );
};