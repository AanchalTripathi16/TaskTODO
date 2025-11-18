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

// Get NEXTAUTH_URL with fallback for development
const nextAuthUrl =
  process.env.NEXTAUTH_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

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
    redirect: ({ url, baseUrl }) => {
      // Use NEXTAUTH_URL if available, otherwise use baseUrl from NextAuth
      const base = nextAuthUrl || baseUrl;

      // If url is relative, return it as is
      if (url.startsWith("/")) {
        return url;
      }

      try {
        const parsed = new URL(url);
        const baseParsed = new URL(base);

        // Check if the URL belongs to our domain
        if (parsed.origin === baseParsed.origin) {
          return parsed.pathname + parsed.search + parsed.hash;
        }

        // If it's a full URL from our domain, extract the path
        if (url.startsWith(base)) {
          return url.replace(base, "") || "/";
        }
      } catch {
        // ignore parsing errors for relative urls
      }

      // Default redirect to home
      return "/";
    },
    session: ({ session, token }) => {
      if (session.user && token?.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
};
