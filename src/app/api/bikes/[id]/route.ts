import { NextResponse } from "next/server";
import { getBikeById } from "@/lib/actions";
import { BikeStatus } from "@/types/bicycle";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET /api/bikes/[id] - Get a specific bike by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params to resolve the dynamic route parameter
    const { id } = await params;
    
    const result = await getBikeById(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Bike not found" ? 404 : 500 }
      );
    }
    
    return NextResponse.json(result.bike);
  } catch (error) {
    console.error("Error fetching bike:", error);
    return NextResponse.json(
      { error: "Failed to fetch bike" },
      { status: 500 }
    );
  }
}

// PUT /api/bikes/[id] - Update a specific bike by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params to resolve the dynamic route parameter
    const { id } = await params;
    
    const data = await request.json();
    
    // Validate status if provided
    if (data.status && !Object.values(BikeStatus).includes(data.status)) {
      return NextResponse.json(
        { error: `Invalid status. Valid values: ${Object.values(BikeStatus).join(", ")}` },
        { status: 400 }
      );
    }
    
    const bike = await prisma.bike.update({
      where: { id },
      data,
    });
    
    return NextResponse.json(bike);
  } catch (error) {
    console.error("Error updating bike:", error);
    return NextResponse.json(
      { error: "Failed to update bike" },
      { status: 500 }
    );
  }
}

// DELETE /api/bikes/[id] - Delete a specific bike by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params to resolve the dynamic route parameter
    const { id } = await params;
    
    const bike = await prisma.bike.delete({
      where: { id },
    });
    
    return NextResponse.json(bike);
  } catch (error) {
    console.error("Error deleting bike:", error);
    return NextResponse.json(
      { error: "Failed to delete bike" },
      { status: 500 }
    );
  }
}