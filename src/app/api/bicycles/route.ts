import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

// GET /api/bicycles - Get all bicycles
export async function GET() {
  try {
    const bicycles = await prisma.bike.findMany({
      include: {
        reports: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(bicycles);
  } catch (error) {
    console.error("Error fetching bicycles:", error);
    return NextResponse.json(
      { error: "Failed to fetch bicycles" },
      { status: 500 }
    );
  }
}

// POST /api/bicycles - Create a new bicycle
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // In a real application, you would get the user ID from the session
    // For now, we'll use a placeholder
    const userId = "placeholder-user-id";
    
    const bicycle = await prisma.bike.create({
      data: {
        ...data,
        reports: {
          create: {
            userId,
            // Add other required fields for the report
          }
        }
      },
    });
    
    return NextResponse.json(bicycle);
  } catch (error) {
    console.error("Error creating bicycle:", error);
    return NextResponse.json(
      { error: "Failed to create bicycle" },
      { status: 500 }
    );
  }
}