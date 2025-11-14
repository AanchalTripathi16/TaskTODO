"use client";

import { CircleUserRound, LogIn, LogOut } from "lucide-react";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

interface UserMenuProps {
  session: Session | null;
}

export function UserMenu({ session }: UserMenuProps) {
  if (!session?.user) {
    return (
      <button
        type="button"
        onClick={() => signIn("google")}
        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        <LogIn className="h-4 w-4" />
        Sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-900">
        <CircleUserRound className="h-4 w-4 text-slate-500" />
        <span>{session.user.name ?? "You"}</span>
      </div>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/signin" })}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  );
}

