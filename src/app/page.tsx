// src/app/page.tsx
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { QuickAccess } from "@/components/landing/QuickAccess";

export default function LandingPage() {
    return (
        <div className="bg-white">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <QuickAccess />
            </main>
        </div>
    );
}