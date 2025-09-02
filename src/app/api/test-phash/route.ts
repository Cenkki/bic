import { NextResponse } from "next/server";
import { findSimilarBikes } from "@/lib/imageService";

export async function GET() {
  try {
    // This is a mock implementation for demonstration
    // In a real scenario, you would pass an actual pHash value
    
    // Mock similar bikes result
    const mockSimilarBikes = [
      {
        id: "1",
        brand: "Trek",
        model: "Marlin 5",
        color: "Musta",
        city: "Helsinki",
        status: "STOLEN",
        phash: "abc123",
        distance: 5,
        similarity: 90,
        images: [{ url: "/uploads/mock1.jpg" }]
      },
      {
        id: "2",
        brand: "Giant",
        model: "Talon 3",
        color: "Sininen",
        city: "Espoo",
        status: "FOUND",
        phash: "def456",
        distance: 8,
        similarity: 85,
        images: [{ url: "/uploads/mock2.jpg" }]
      }
    ];

    return NextResponse.json({
      success: true,
      similarBikes: mockSimilarBikes,
      message: "Mock pHash similarity search completed"
    });
  } catch (error) {
    console.error("Error in pHash test:", error);
    return NextResponse.json(
      { error: "Failed to test pHash functionality" },
      { status: 500 }
    );
  }
}