// src/app/login/page.tsx
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
      <main className="pt-16 flex items-center justify-center py-12 md:py-24">
        <div className="container mx-auto px-4">
          <AuthForm />
        </div>
      </main>
  );
}