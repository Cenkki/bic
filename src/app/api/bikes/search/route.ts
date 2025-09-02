import { NextResponse } from "next/server";
import { searchBikesAction } from "@/lib/actions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  try {
    const result = await searchBikesAction(query);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    return NextResponse.json(result.bikes);
  } catch (error) {
    console.error("Error searching bikes:", error);
    return NextResponse.json({ error: "Failed to search bikes" }, { status: 500 });
  }
}