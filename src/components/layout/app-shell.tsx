import { AppHeader } from "@/components/layout/app-header";
import type { Session } from "next-auth";

interface AppShellProps {
  children: React.ReactNode;
  session: Session | null;
}

export function AppShell({ children, session }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppHeader session={session} />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

