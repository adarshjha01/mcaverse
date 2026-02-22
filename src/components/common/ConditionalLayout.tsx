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

    const isTestPage = pathname?.startsWith('/mock-tests/take/') && !pathname?.includes('/results');

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (user && isTestPage) {
        return (
            <main className="h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950">
                {children}
            </main>
        );
    }

    if (user) {
        return (
            // THE FIX: overflow-x-hidden guarantees no horizontal scrolling
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 w-full overflow-x-hidden">
                <VerticalNavbar 
                    isCollapsed={isSidebarCollapsed} 
                    onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                />
                
                {/* THE FIX: Removed the buggy max-w calculations and simplified the margin logic */}
                <div 
                    className={`flex-1 flex flex-col transition-all duration-300 ease-in-out w-full ${
                        isSidebarCollapsed ? 'ml-20' : 'ml-64' 
                    }`} 
                >
                    <main className="flex-grow p-6 pt-20 md:pt-6 w-full overflow-x-hidden"> 
                        {children}
                    </main>
                    <Footer />
                </div>
            </div>
        );
    }

    return (
        // THE FIX: Lock the unauthenticated layout too, just in case
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
            <HorizontalNavbar />
            <main className="flex-grow w-full">
                {children}
            </main>
            <Footer />
        </div>
    );
};