// src/app/page.tsx
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { QuickAccess } from "@/components/landing/QuickAccess";

// Note: We no longer import a HorizontalNavbar here. The main layout.tsx handles it.
export default function LandingPage() {
    return (
        <main>
            <Hero />
            <Features />
            <QuickAccess />
        </main>
    );
}
