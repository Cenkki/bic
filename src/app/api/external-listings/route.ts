import { NextResponse } from "next/server";
import { fetchExternalListings, saveExternalListings } from "@/lib/externalListings";

/**
 * GET /api/external-listings
 * Fetch all external listings
 */
export async function GET() {
  try {
    const listings = await fetchExternalListings();
    return NextResponse.json({ success: true, listings });
  } catch (error) {
    console.error("Error fetching external listings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch external listings" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/external-listings
 * Save new external listings
 */
export async function POST(request: Request) {
  try {
    const listings = await request.json();
    await saveExternalListings(listings);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving external listings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save external listings" },
      { status: 500 }
    );
  }
}