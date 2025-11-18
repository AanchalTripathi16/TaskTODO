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

// Ensure NEXTAUTH_URL is available - NextAuth requires this for OAuth callbacks
if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  // Vercel automatically provides VERCEL_URL, but we need NEXTAUTH_URL
  console.warn(
    "NEXTAUTH_URL not set. Using VERCEL_URL as fallback. Please set NEXTAUTH_URL in Vercel environment variables."
  );
}

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
    async signIn({ account, profile }) {
      // Allow sign in
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith("/")) {
        return url;
      }

      // Allow URLs from the same origin
      try {
        if (new URL(url).origin === new URL(baseUrl).origin) {
          return url;
        }
      } catch {
        // If URL parsing fails, return baseUrl
        return baseUrl;
      }

      // Default to baseUrl
      return baseUrl;
    },
    session: ({ session, token }) => {
      if (session.user && token?.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
