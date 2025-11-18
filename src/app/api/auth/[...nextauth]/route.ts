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
  
  console.log("[NextAuth Route] Request:", {
    method: req.method,
    pathname: url.pathname,
    searchParams: Object.fromEntries(url.searchParams),
    nextauthParams: params.nextauth,
    headers: {
      host: req.headers.get("host"),
      origin: req.headers.get("origin"),
      referer: req.headers.get("referer"),
    },
  });

  try {
    const response = await handler(req, context);
    console.log("[NextAuth Route] Response:", {
      status: response.status,
      statusText: response.statusText,
    });
    return response;
  } catch (error) {
    console.error("[NextAuth Route] Error:", error);
    throw error;
  }
};

export { loggedHandler as GET, loggedHandler as POST };
