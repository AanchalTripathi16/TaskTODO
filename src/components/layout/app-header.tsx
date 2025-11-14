import Link from "next/link";
import type { Session } from "next-auth";

import { UserMenu } from "@/components/layout/user-menu";

interface AppHeaderProps {
  session: Session | null;
}

export function AppHeader({ session }: AppHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/tasks" className="text-lg font-semibold text-slate-900">
          FocusFlow
        </Link>
        <UserMenu session={session} />
      </div>
    </header>
  );
}

