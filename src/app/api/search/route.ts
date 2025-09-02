import { NextResponse } from "next/server";
import { getBikesWithDuplicates } from "@/lib/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const filters = {
    query: searchParams.get("q") || undefined,
    serialNumber: searchParams.get("serialNumber") || undefined,
    city: searchParams.get("city") || undefined,
    status: searchParams.get("status") as any || undefined,
    limit: searchParams.get("limit") ? parseInt(searchParams.get("limit") || "50") : undefined,
  };

  try {
    const bikes = await getBikesWithDuplicates(filters);
    
    return NextResponse.json({
      success: true,
      bikes
    });
  } catch (error) {
    console.error("Error searching bikes:", error);
    return NextResponse.json(
      { error: "Failed to search bikes" },
      { status: 500 }
    );
  }
}