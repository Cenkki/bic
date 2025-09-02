import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

// Only initialize PrismaClient if DATABASE_URL is set
let prisma: PrismaClient | null = null;
const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  prisma = new PrismaClient();
}

export async function GET() {
  // Check if DATABASE_URL is configured
  if (!databaseUrl) {
    return NextResponse.json({
      status: "warning",
      database: "not configured",
      message: "DATABASE_URL environment variable not set",
      timestamp: new Date().toISOString()
    }, { status: 200 });
  }

  try {
    if (!prisma) {
      throw new Error("PrismaClient not initialized");
    }
    
    // Test database connection
    await prisma.$connect();
    
    // Test a simple query
    const count = await prisma.bike.count();
    
    return NextResponse.json({
      status: "ok",
      database: "connected",
      bikeCount: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({
      status: "error",
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 503 });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}