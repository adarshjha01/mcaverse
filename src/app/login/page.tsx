// src/app/login/page.tsx
import { Navbar } from "@/components/landing/Navbar";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen">
      <Navbar />
      <main className="pt-16 flex items-center justify-center py-12 md:py-24">
        <div className="container mx-auto px-4">
          <AuthForm />
        </div>
      </main>
    </div>
  );
}