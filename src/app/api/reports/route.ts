import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

// POST /api/reports - Create a new report
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const report = await prisma.report.create({
      data,
    });
    
    // Update bike status to STOLEN
    await prisma.bike.update({
      where: { id: data.bikeId },
      data: { status: "STOLEN" },
    });
    
    return NextResponse.json(report);
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
