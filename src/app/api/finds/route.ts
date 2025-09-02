import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

// POST /api/finds - Create a new find
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const find = await prisma.find.create({
      data,
    });
    
    return NextResponse.json(find);
  } catch (error) {
    console.error("Error creating find:", error);
    return NextResponse.json(
      { error: "Failed to create find" },
      { status: 500 }
    );
  }
}