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
            <main className="h-screen w-screen overflow-hidden bg-slate-100" data-force-light>
                {children}
            </main>
        );
    }

    if (user) {
        return (
            <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 w-full overflow-x-hidden">
                {/* Mobile: HorizontalNavbar (hidden on md+) */}
                <div className="md:hidden">
                    <HorizontalNavbar />
                </div>

                {/* Desktop: VerticalNavbar (hidden below md) */}
                <div className="hidden md:block">
                    <VerticalNavbar 
                        isCollapsed={isSidebarCollapsed} 
                        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                    />
                </div>
                
                {/* Content: no margin on mobile (horizontal nav), sidebar margin on md+ */}
                <div 
                    className={`flex-1 flex flex-col transition-all duration-300 ease-in-out w-full ${
                        isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64' 
                    }`} 
                >
                    <main className="grow p-4 sm:p-6 pt-20 md:pt-6 w-full overflow-x-hidden"> 
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
            <main className="grow w-full">
                {children}
            </main>
            <Footer />
        </div>
    );
};