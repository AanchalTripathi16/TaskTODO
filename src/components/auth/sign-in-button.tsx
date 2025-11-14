"use client";

import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export function SignInButton() {
  const searchParams = useSearchParams();
  const requestedCallbackUrl = searchParams.get("callbackUrl") ?? "/";
  const callbackUrl = requestedCallbackUrl.startsWith("/")
    ? requestedCallbackUrl
    : "/";

  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl })}
      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800"
    >
      <LogIn className="h-5 w-5" />
      Continue with Google
    </button>
  );
}
