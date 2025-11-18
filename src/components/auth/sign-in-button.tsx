"use client";

import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function SignInButton() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const requestedCallbackUrl = searchParams.get("callbackUrl") ?? "/";
  const callbackUrl = requestedCallbackUrl.startsWith("/")
    ? requestedCallbackUrl
    : "/";

  const handleSignIn = () => {
    console.log("[SignIn Button] Starting sign in:", {
      callbackUrl,
      requestedCallbackUrl,
      timestamp: new Date().toISOString(),
      provider: "google",
    });

    setIsLoading(true);

    // Use standard NextAuth signIn with redirect (default behavior)
    // This will redirect to Google OAuth, then back to our callback
    signIn("google", {
      callbackUrl,
    }).catch((error) => {
      console.error("[SignIn Button] Sign in exception:", error);
      setIsLoading(false);
      // If there's an error, redirect to show it
      window.location.href = `/signin?error=Configuration&callbackUrl=${encodeURIComponent(callbackUrl)}`;
    });
  };

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={isLoading}
      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <LogIn className="h-5 w-5" />
      {isLoading ? "Signing in..." : "Continue with Google"}
    </button>
  );
}
