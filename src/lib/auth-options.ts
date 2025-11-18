import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

const requiredEnv = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "NEXTAUTH_SECRET",
] as const;

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`);
  }
});

// Log environment variables for debugging
console.log("[NextAuth Config] Environment Check:", {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
  VERCEL_URL: process.env.VERCEL_URL || "NOT SET",
  NODE_ENV: process.env.NODE_ENV,
  hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
  hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  hasDatabaseUrl: !!process.env.DATABASE_URL,
  databaseUrlPreview: process.env.DATABASE_URL
    ? `${process.env.DATABASE_URL.substring(0, 20)}...`
    : "NOT SET",
});

// Test database connection
prisma
  .$connect()
  .then(() => {
    console.log("[NextAuth Config] Database connection successful");
  })
  .catch((error) => {
    console.error("[NextAuth Config] Database connection failed:", error);
    console.error(
      "[NextAuth Config] This will cause OAuth callback errors. Please check DATABASE_URL in Vercel."
    );
  });

// Ensure NEXTAUTH_URL is available - NextAuth requires this for OAuth callbacks
if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  // Vercel automatically provides VERCEL_URL, but we need NEXTAUTH_URL
  console.warn(
    "[NextAuth Config] NEXTAUTH_URL not set. Using VERCEL_URL as fallback. Please set NEXTAUTH_URL in Vercel environment variables."
  );
}

// Calculate expected callback URL for logging
const expectedCallbackUrl = process.env.NEXTAUTH_URL
  ? `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
  : process.env.VERCEL_URL
  ? `https://task-todo-dun-one.vercel.app/api/auth/callback/google`
  : "http://localhost:3000/api/auth/callback/google";

console.log("[NextAuth Config] Expected Callback URL:", expectedCallbackUrl);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      console.log("[NextAuth Callback] signIn called:", {
        accountProvider: account?.provider,
        accountType: account?.type,
        userId: user?.id,
        userEmail: user?.email,
        hasProfile: !!profile,
      });

      try {
        // Test database connection before allowing sign in
        await prisma.$connect();
        console.log("[NextAuth Callback] Database connection verified");

        // Allow sign in
        const result = true;
        console.log("[NextAuth Callback] signIn result:", result);
        return result;
      } catch (error) {
        console.error("[NextAuth Callback] signIn error:", error);
        console.error(
          "[NextAuth Callback] Database connection issue. Check DATABASE_URL in Vercel environment variables."
        );
        // Don't throw - let NextAuth handle it, but log the error
        throw error;
      }
    },
    async redirect({ url, baseUrl }) {
      console.log("[NextAuth Callback] redirect called:", {
        url,
        baseUrl,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      });

      // Allow relative URLs
      if (url.startsWith("/")) {
        console.log(
          "[NextAuth Callback] redirect: returning relative URL:",
          url
        );
        return url;
      }

      // Allow URLs from the same origin
      try {
        const urlObj = new URL(url);
        const baseObj = new URL(baseUrl);
        const sameOrigin = urlObj.origin === baseObj.origin;

        console.log("[NextAuth Callback] redirect: origin check:", {
          urlOrigin: urlObj.origin,
          baseOrigin: baseObj.origin,
          sameOrigin,
        });

        if (sameOrigin) {
          console.log(
            "[NextAuth Callback] redirect: returning same-origin URL:",
            url
          );
          return url;
        }
      } catch (error) {
        console.error(
          "[NextAuth Callback] redirect: URL parsing error:",
          error
        );
        // If URL parsing fails, return baseUrl
        return baseUrl;
      }

      // Default to baseUrl
      console.log("[NextAuth Callback] redirect: returning baseUrl:", baseUrl);
      return baseUrl;
    },
    session: ({ session, token }) => {
      if (session.user && token?.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
  debug: true, // Enable debug mode to see all logs
  logger: {
    error(code, metadata) {
      console.error("[NextAuth Error]", { code, metadata });

      // Log specific error details for callback errors
      if (code === "CALLBACK_OAUTH_ERROR" || code === "CALLBACK_ROUTE_ERROR") {
        console.error(
          "[NextAuth Error] OAuth Callback Error Details:",
          JSON.stringify(metadata, null, 2)
        );
        console.error(
          "[NextAuth Error] Possible causes:",
          "1. DATABASE_URL not set or incorrect in Vercel",
          "2. Database connection timeout",
          "3. PrismaAdapter unable to save user/account",
          "4. NEXTAUTH_URL mismatch"
        );
      }
    },
    warn(code) {
      console.warn("[NextAuth Warn]", { code });
    },
    debug(code, metadata) {
      console.log("[NextAuth Debug]", { code, metadata });
    },
  },
};
