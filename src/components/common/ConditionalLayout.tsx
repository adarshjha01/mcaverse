// src/components/common/ConditionalLayout.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { HorizontalNavbar } from "@/components/landing/HorizontalNavbar";
import { VerticalNavbar } from "./VerticalNavbar";

export const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (user) {
        // Logged-in users get the collapsible vertical sidebar layout
        return (
            <div className="flex">
                <VerticalNavbar 
                    isCollapsed={isSidebarCollapsed} 
                    onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                />
                <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
                    {children}
                </div>
            </div>
        );
    } else {
        // Logged-out users get the horizontal navbar
        return (
            <div>
                <HorizontalNavbar />
                {children}
            </div>
        );
    }
};
