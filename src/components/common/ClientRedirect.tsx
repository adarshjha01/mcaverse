// src/components/common/ClientRedirect.tsx
"use client";

import { useEffect } from "react";

export function ClientRedirect() {
  useEffect(() => {
    // This code only runs in the browser
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      const codespaceUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (codespaceUrl) {
        // If we are on localhost, redirect to the full Codespaces URL
        window.location.href = codespaceUrl + window.location.pathname;
      }
    }
  }, []);

  return null; // This component renders nothing
}
