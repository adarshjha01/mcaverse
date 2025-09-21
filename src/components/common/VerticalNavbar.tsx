// src/components/common/VerticalNavbar.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { auth } from '@/lib/firebaseClient';
import { signOut } from 'firebase/auth';
import { IconVideo, IconFileText, IconBot, IconTrophy, IconMic, IconUsers, IconUserCircle, IconLogout, IconChevronRight, IconMenu2, IconMail } from '@/components/ui/Icons';

// Updated NavSection to handle collapsed state
const NavSection = ({ title, children, isCollapsed }: { title: string, children: React.ReactNode, isCollapsed: boolean }) => {
    const [isOpen, setIsOpen] = React.useState(true);
    
    if (isCollapsed) {
        return <div className="space-y-1">{children}</div>;
    }

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-xs font-semibold uppercase text-slate-400 tracking-wider px-4 py-2 hover:bg-slate-700/50 rounded-md">
                <span>{title}</span>
                <IconChevronRight className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            {isOpen && <div className="mt-2 ml-4 pl-2 border-l border-slate-700 space-y-1">{children}</div>}
        </div>
    );
};

// Updated NavLink to handle collapsed state
const NavLink = ({ href, icon, label, isCollapsed }: { href: string, icon: React.ReactNode, label: string, isCollapsed: boolean }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <div className="relative group">
            <Link href={href} className={`flex items-center gap-3 rounded-md text-sm font-medium transition-colors ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-2'} ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            }`}>
                {icon}
                {!isCollapsed && <span>{label}</span>}
            </Link>
            {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {label}
                </div>
            )}
        </div>
    );
};

export const VerticalNavbar = ({ isCollapsed, onToggle }: { isCollapsed: boolean, onToggle: () => void }) => {
    const { user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };

    return (
        <aside className={`bg-slate-800 text-white p-4 flex flex-col h-screen fixed transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className={`flex items-center mb-8 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <Link href="/" className={`flex items-center space-x-3 ${isCollapsed ? 'hidden' : 'px-2'}`}>
                    <Image src="/mcaverse-logo.png" alt="MCAverse Logo" width={32} height={32} className="rounded-full" />
                    <span className="font-bold text-xl">MCAverse</span>
                </Link>
                <button onClick={onToggle} className="p-2 rounded-md hover:bg-slate-700/50">
                    <IconMenu2 />
                </button>
            </div>

            <nav className="flex-grow space-y-4">
                    <NavLink href="/videos" icon={<IconVideo className="w-5 h-5"/>} label="Video Lectures" isCollapsed={isCollapsed} />
                    <NavLink href="/mock-tests" icon={<IconFileText className="w-5 h-5"/>} label="Practice" isCollapsed={isCollapsed} />
                <NavLink href="/ai-assistant" icon={<IconBot className="w-5 h-5"/>} label="AI Assistant" isCollapsed={isCollapsed} />
                    <NavLink href="/success-stories" icon={<IconTrophy className="w-5 h-5"/>} label="Success Stories" isCollapsed={isCollapsed} />
                    <NavLink href="/podcast" icon={<IconMic className="w-5 h-5"/>} label="Podcast" isCollapsed={isCollapsed} />
                <NavLink href="/community" icon={<IconUsers className="w-5 h-5"/>} label="Community" isCollapsed={isCollapsed} />
                <NavLink href="/about" icon={<IconUserCircle className="w-5 h-5"/>} label="About Us" isCollapsed={isCollapsed} />
                <NavLink href="/contact" icon={<IconMail className="w-5 h-5"/>} label="Contact" isCollapsed={isCollapsed} />
            </nav>

            <div className="flex-shrink-0 border-t border-slate-700 pt-4">
                {user && (
                    <div className="space-y-3">
                        <Link href="/dashboard" className={`flex items-center gap-3 p-2 rounded-md hover:bg-slate-700/50 ${isCollapsed ? 'justify-center' : ''}`}>
                            {user.photoURL ? (
                                <Image src={user.photoURL} alt="Profile" width={32} height={32} className="rounded-full"/>
                            ) : (
                                <IconUserCircle className="w-8 h-8 text-slate-400"/>
                            )}
                            {!isCollapsed && <span className="text-sm font-semibold">{user.displayName || 'Dashboard'}</span>}
                        </Link>
                        <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-red-900/50 hover:text-white ${isCollapsed ? 'justify-center' : ''}`}>
                            <IconLogout />
                            {!isCollapsed && <span>Logout</span>}
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
};