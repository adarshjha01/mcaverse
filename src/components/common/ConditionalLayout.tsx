// src/components/common/ConditionalLayout.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation"; 
import { useAuth } from "@/components/auth/AuthProvider";
import { HorizontalNavbar } from "@/components/landing/HorizontalNavbar";
import { VerticalNavbar } from "./VerticalNavbar"; 
import Footer from "./Footer"; 

export const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const pathname = usePathname(); 
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // --- LOGIC FIX ---
    // 1. We are in "Test Mode" if the URL starts with /mock-tests/take/
    // 2. BUT we are NOT in Test Mode if we are looking at /results/
    const isTestPage = pathname?.startsWith('/mock-tests/take/') && !pathname?.includes('/results');

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // --- FOCUS MODE (Only while answering questions) ---
    if (user && isTestPage) {
        return (
            <main className="h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950">
                {children}
            </main>
        );
    }

    // --- STANDARD LAYOUT (Dashboard, Results, etc.) ---
    if (user) {
        return (
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                <VerticalNavbar 
                    isCollapsed={isSidebarCollapsed} 
                    onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                />
                
                <div 
                    className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
                        isSidebarCollapsed ? 'ml-[80px]' : 'ml-[250px]' 
                    } max-w-[calc(100vw-80px)] md:max-w-none`} 
                >
                    <main className="flex-grow p-6 pt-20 md:pt-6"> 
                        {children}
                    </main>
                    <Footer />
                </div>
            </div>
        );
    }

    // --- LOGGED OUT LAYOUT ---
    return (
        <div className="flex flex-col min-h-screen">
            <HorizontalNavbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};