import { NextResponse } from "next/server";
import { getBikes } from "@/lib/actions";
import { BikeStatus } from "@/types/bicycle";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET /api/bikes - Get all bikes with filtering
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  try {
    // Extract query parameters
    const statusParam = searchParams.get("status");
    const q = searchParams.get("q") || undefined; // General search term
    const city = searchParams.get("city") || undefined;
    const serial = searchParams.get("serial") || undefined;
    const near = searchParams.get("near") || undefined; // lat,lng,radiusKm
    
    // Validate status parameter
    let status: BikeStatus | undefined;
    if (statusParam) {
      if (Object.values(BikeStatus).includes(statusParam as BikeStatus)) {
        status = statusParam as BikeStatus;
      } else {
        return NextResponse.json(
          { error: `Invalid status parameter. Valid values: ${Object.values(BikeStatus).join(", ")}` },
          { status: 400 }
        );
      }
    }
    
    // Build filters object
    const filters: any = {};
    
    // Status filter
    if (status) {
      filters.status = status;
    }
    
    // City filter
    if (city) {
      filters.city = city;
    }
    
    // Serial number filter
    if (serial) {
      filters.serialNumber = serial;
    }
    
    // General search across multiple fields
    if (q) {
      filters.search = q;
    }
    
    // Handle near location filter separately since it's not supported by getBikes
    if (near) {
      // For now, we'll just return an error since this requires special handling
      // In a real implementation, we would need to extend the getBikes function
      // or create a separate function for geospatial queries
      return NextResponse.json(
        { error: "Geospatial filtering (near parameter) not yet implemented" },
        { status: 501 }
      );
    }
    
    const result = await getBikes(filters);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result.bikes);
  } catch (error) {
    console.error("Error fetching bikes:", error);
    return NextResponse.json(
      { error: "Failed to fetch bikes" },
      { status: 500 }
    );
  }
}

// POST /api/bikes - Create a new bike
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate status if provided
    if (data.status && !Object.values(BikeStatus).includes(data.status)) {
      return NextResponse.json(
        { error: `Invalid status. Valid values: ${Object.values(BikeStatus).join(", ")}` },
        { status: 400 }
      );
    }
    
    const bike = await prisma.bike.create({
      data,
    });
    
    return NextResponse.json(bike);
  } catch (error) {
    console.error("Error creating bike:", error);
    return NextResponse.json(
      { error: "Failed to create bike" },
      { status: 500 }
    );
  }
}
