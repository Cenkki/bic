import { NextResponse } from "next/server";
import { getBikes } from "@/lib/actions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const filters = {
    status: searchParams.get("status") as any || undefined,
    brand: searchParams.get("brand") || undefined,
    city: searchParams.get("city") || undefined,
    color: searchParams.get("color") || undefined,
    search: searchParams.get("search") || undefined,
  };

  try {
    const result = await getBikes(filters);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    return NextResponse.json(result.bikes);
  } catch (error) {
    console.error("Error filtering bikes:", error);
    return NextResponse.json({ error: "Failed to filter bikes" }, { status: 500 });
  }
}