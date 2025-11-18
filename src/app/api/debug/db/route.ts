import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Try a simple query
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      userCount,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseUrlPreview: process.env.DATABASE_URL
          ? `${process.env.DATABASE_URL.substring(0, 30)}...`
          : "NOT SET",
        nodeEnv: process.env.NODE_ENV,
        nextAuthUrl: process.env.NEXTAUTH_URL || "NOT SET",
        vercelUrl: process.env.VERCEL_URL || "NOT SET",
      },
    });
  } catch (error) {
    console.error("[Debug DB] Database connection error:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : String(error),
        env: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          databaseUrlPreview: process.env.DATABASE_URL
            ? `${process.env.DATABASE_URL.substring(0, 30)}...`
            : "NOT SET",
          nodeEnv: process.env.NODE_ENV,
        },
      },
      { status: 500 }
    );
  }
}

