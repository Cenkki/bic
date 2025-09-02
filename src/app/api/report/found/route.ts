import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { BikeStatus } from "@/types/bicycle";

const prisma = new PrismaClient();

// POST /api/report/found - Create a found bike report
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.brand || !data.model || !data.description) {
      return NextResponse.json(
        { error: "Brand, model, and description are required" },
        { status: 400 }
      );
    }
    
    // Check for duplicate by serial number
    if (data.serialNumber) {
      const existingBike = await prisma.bike.findUnique({
        where: { serialNumber: data.serialNumber }
      });
      
      if (existingBike) {
        return NextResponse.json(
          { 
            error: "A bike with this serial number already exists",
            bikeId: existingBike.id
          },
          { status: 409 }
        );
      }
    }
    
    // Create a temporary user if userId is not provided
    let userId = data.userId;
    if (!userId) {
      const user = await prisma.user.upsert({
        where: { email: "temp@example.com" },
        update: {},
        create: {
          email: "temp@example.com"
        }
      });
      userId = user.id;
    }
    
    // Create the bike first
    const bike = await prisma.bike.create({
      data: {
        brand: data.brand,
        model: data.model,
        color: data.color,
        serialNumber: data.serialNumber,
        description: data.description,
        status: BikeStatus.FOUND,
        locationLat: data.locationLat,
        locationLng: data.locationLng,
        city: data.city,
        source: "api",
      },
    });
    
    // Create the find
    const find = await prisma.find.create({
      data: {
        userId: userId,
        bikeId: bike.id,
        note: data.note,
        foundDate: data.foundDate ? new Date(data.foundDate) : undefined,
      },
    });
    
    return NextResponse.json({ bike, find });
  } catch (error) {
    console.error("Error creating found bike report:", error);
    return NextResponse.json(
      { error: "Failed to create found bike report" },
      { status: 500 }
    );
  }
}