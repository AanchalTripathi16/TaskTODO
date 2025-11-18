"use client";

import { AlertCircle } from "lucide-react";

interface SignInErrorDisplayProps {
  error: string;
  callbackUrl?: string;
}

export function SignInErrorDisplay({
  error,
  callbackUrl,
}: SignInErrorDisplayProps) {
  console.error("[SignIn Error] Authentication error:", {
    error,
    callbackUrl,
    timestamp: new Date().toISOString(),
  });

  const errorMessages: Record<string, string> = {
    Callback:
      "OAuth callback failed. This is usually caused by a database connection issue. Please check: 1) DATABASE_URL is set in Vercel, 2) Database is accessible from Vercel, 3) Check Vercel function logs for detailed error messages.",
    Configuration:
      "There is a problem with the server configuration. Check if your options are correct.",
    AccessDenied:
      "You do not have permission to sign in. Please contact support.",
    Verification:
      "The verification token has expired or has already been used.",
    Default: `An error occurred during authentication: ${error}`,
  };

  const message = errorMessages[error] || errorMessages.Default;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-left">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-900">
            Authentication Error
          </h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-red-600 hover:text-red-800">
              Debug Info
            </summary>
            <div className="mt-2 rounded bg-red-100 p-2 font-mono text-xs text-red-900">
              <div>Error Code: {error}</div>
              {callbackUrl && <div>Callback URL: {callbackUrl}</div>}
              <div>Check Vercel Function Logs for server-side errors</div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

