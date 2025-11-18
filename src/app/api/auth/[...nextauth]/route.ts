import type { NextRequest } from "next/server";
import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth-options";

const handler = NextAuth(authOptions);

// Add logging wrapper for debugging
const loggedHandler = async (
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) => {
  const url = new URL(req.url);
  const params = await context.params;
  const isCallback = params.nextauth?.[0] === "callback";
  
  console.log("[NextAuth Route] Request:", {
    method: req.method,
    pathname: url.pathname,
    searchParams: Object.fromEntries(url.searchParams),
    nextauthParams: params.nextauth,
    isCallback,
    headers: {
      host: req.headers.get("host"),
      origin: req.headers.get("origin"),
      referer: req.headers.get("referer"),
    },
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
      VERCEL_URL: process.env.VERCEL_URL || "NOT SET",
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    },
  });

  // If this is a callback, test database connection first
  if (isCallback) {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.$connect();
      console.log("[NextAuth Route] Database connection verified before callback");
    } catch (dbError) {
      console.error("[NextAuth Route] Database connection failed before callback:", dbError);
      return new Response(
        JSON.stringify({
          error: "Database connection failed",
          message: "Unable to connect to database. Check DATABASE_URL in Vercel.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  try {
    const response = await handler(req, context);
    console.log("[NextAuth Route] Response:", {
      status: response.status,
      statusText: response.statusText,
      isCallback,
    });
    return response;
  } catch (error) {
    console.error("[NextAuth Route] Error:", error);
    console.error("[NextAuth Route] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

export { loggedHandler as GET, loggedHandler as POST };
