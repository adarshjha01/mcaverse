"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IconSun, IconMoon } from "@/components/ui/Icons";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const handleToggle = () => {
    if (animating) return;
    setAnimating(true);
    // Switch theme at the halfway point of the spin
    setTimeout(() => {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    }, 300);
    setTimeout(() => {
      setAnimating(false);
    }, 600);
  };

  return (
    <>
      <style jsx>{`
        @keyframes spin-swap {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(0.6);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }
        .animate-spin-swap {
          animation: spin-swap 600ms ease-in-out forwards;
        }
      `}</style>
      <button
        onClick={handleToggle}
        className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-center"
        aria-label="Toggle Theme"
        title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <span className={`inline-flex ${animating ? "animate-spin-swap" : ""}`}>
          {resolvedTheme === "dark" ? (
            <IconSun className="w-5 h-5" />
          ) : (
            <IconMoon className="w-5 h-5" />
          )}
        </span>
      </button>
    </>
  );
};