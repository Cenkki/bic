import { NextResponse } from "next/server";
import { uploadImagesAndUpdateBike } from "@/lib/imageService";
import { PrismaClient } from "../../../../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bikeId } = await params;
    
    // Check if bike exists
    const bike = await prisma.bike.findUnique({
      where: { id: bikeId }
    });
    
    if (!bike) {
      return NextResponse.json(
        { error: "Bike not found" },
        { status: 404 }
      );
    }
    
    // For demo purposes, we'll return a mock response
    // In a real implementation, you would process the uploaded files
    return NextResponse.json({
      success: true,
      message: "Images uploaded successfully",
      bikeId
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}