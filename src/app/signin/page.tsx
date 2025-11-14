import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { SignInButton } from "@/components/auth/sign-in-button";
import { authOptions } from "@/lib/auth-options";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect("/tasks");
  }

  return (
    <section className="mx-auto mt-20 max-w-xl rounded-3xl bg-white p-8 shadow-lg">
      <div className="space-y-6 text-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Welcome back
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Sign in to manage your tasks
          </h1>
          <p className="mt-3 text-base text-slate-600">
            FocusFlow keeps your personal todos isolated and secure. Connect
            with Google to get started.
          </p>
        </div>
        <SignInButton />
        <p className="text-xs text-slate-500">
          By continuing you agree to the Terms of Service and Privacy Policy.
        </p>
      </div>
    </section>
  );
}
