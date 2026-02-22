"use client";

import React from 'react';
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
    IconUserCircle, 
    IconLogout, 
    IconMenu2, 
    IconMail 
} from '@/components/ui/Icons';

// Helper Component: Navigation Link
const NavLink = ({ href, icon, label, isCollapsed }: { href: string, icon: React.ReactNode, label: string, isCollapsed: boolean }) => {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href);
    
    return (
        <div className="relative group w-full">
            <Link href={href} className={`flex items-center gap-3 rounded-md text-sm font-medium transition-colors ${isCollapsed ? 'px-0 py-3 justify-center' : 'px-4 py-2'} ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            }`}>
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
                    {icon}
                </div>
                {!isCollapsed && <span className="truncate">{label}</span>}
            </Link>
            {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-slate-700 shadow-xl">
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
        <aside className={`bg-slate-800 text-white p-4 flex flex-col h-screen fixed transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} z-50 border-r border-slate-700 overflow-x-hidden`}>
            
            {/* Header: Restored to original clean layout */}
            <div className={`flex items-center mb-8 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <Link href="/" className={`flex items-center space-x-3 ${isCollapsed ? 'hidden' : 'px-2'}`}>
                    <Image src="/mcaverse-logo.png" alt="MCAverse Logo" width={32} height={32} className="rounded-full" />
                    <span className="font-bold text-xl truncate">MCAverse</span>
                </Link>

                {/* Collapse Menu Button */}
                <button onClick={onToggle} className="p-2 rounded-md hover:bg-slate-700/50 text-slate-300 hover:text-white flex-shrink-0">
                    <IconMenu2 />
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow space-y-2 overflow-y-auto overflow-x-hidden no-scrollbar">
                <NavLink href="/videos" icon={<IconVideo />} label="Video Lectures" isCollapsed={isCollapsed} />
                <NavLink href="/mock-tests" icon={<IconFileText />} label="Practice" isCollapsed={isCollapsed} />
                <NavLink href="/ai-assistant" icon={<IconBot />} label="AI Assistant" isCollapsed={isCollapsed} />
                <NavLink href="/success-stories" icon={<IconTrophy />} label="Success Stories" isCollapsed={isCollapsed} />
                <NavLink href="/podcast" icon={<IconMic />} label="Podcast" isCollapsed={isCollapsed} />
                <NavLink href="/community" icon={<IconUsers />} label="Community" isCollapsed={isCollapsed} />
                <NavLink href="/about" icon={<IconUserCircle />} label="About Us" isCollapsed={isCollapsed} />
                <NavLink href="/contact" icon={<IconMail />} label="Contact" isCollapsed={isCollapsed} />
            </nav>

            {/* Footer: Theme Toggle + Profile + Logout */}
            <div className="flex-shrink-0 border-t border-slate-700 pt-4 mt-auto flex flex-col gap-2">
                
                {/* NEW: Theme Toggle Row */}
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4 justify-between'} text-slate-300 mb-2`}>
                    {!isCollapsed && <span className="text-sm font-medium">Appearance</span>}
                    <ThemeToggle />
                </div>

                {user && (
                    <div className="space-y-2">
                        <Link href="/dashboard" className={`flex items-center gap-3 p-2 rounded-md hover:bg-slate-700/50 ${isCollapsed ? 'justify-center' : ''}`}>
                            <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
                                {user.photoURL ? (
                                    <Image src={user.photoURL} alt="Profile" width={32} height={32} />
                                ) : (
                                    <IconUserCircle className="w-6 h-6 text-slate-400"/>
                                )}
                            </div>
                            {!isCollapsed && <span className="text-sm font-semibold truncate">{user.displayName || 'Dashboard'}</span>}
                        </Link>
                        <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-red-900/50 hover:text-white ${isCollapsed ? 'justify-center px-0' : ''}`}>
                            <div className="flex-shrink-0"><IconLogout /></div>
                            {!isCollapsed && <span>Logout</span>}
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
};