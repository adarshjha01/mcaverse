// src/app/page.tsx
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { QuickAccess } from "@/components/landing/QuickAccess";
import { Testimonials } from "@/components/landing/Testimonials"; 

export default function LandingPage() {
    return (
        // THE FIX: overflow-x-hidden strictly prevents the page from widening!
        <main className="w-full overflow-x-hidden flex flex-col">
            <Hero />
            <Features />
            <Testimonials />
            <QuickAccess />
        </main>
    );
}