import { PrismaClient } from "../generated/prisma";
import { BikeStatus } from "@/types/bicycle";

// Only create PrismaClient if DATABASE_URL is set
let prisma: PrismaClient | null = null;
const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  prisma = new PrismaClient();
}

export async function getStatistics() {
  // If no database URL is configured, return default values
  if (!databaseUrl || !prisma) {
    console.warn("DATABASE_URL not configured, returning default statistics");
    return {
      lostStolenCount: 0,
      foundCount: 0,
      matchesThisWeek: 0,
      forSaleCount: 0,
      error: "Database not configured"
    };
  }

  try {
    // Test database connection with a timeout
    await Promise.race([
      prisma.$connect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 5000)
      )
    ]);

    // Get total lost/stolen bikes
    const lostStolenCount = await prisma.bike.count({
      where: {
        status: {
          in: [BikeStatus.LOST, BikeStatus.STOLEN]
        }
      }
    });

    // Get total found bikes
    const foundCount = await prisma.bike.count({
      where: {
        status: BikeStatus.FOUND
      }
    });

    // Get potential matches this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // For now, we'll simulate this count
    // In a real implementation, you would have a matches table or similar
    const matchesThisWeek = 0;

    // Get new for sale external listings
    const forSaleCount = await prisma.bike.count({
      where: {
        status: BikeStatus.FOR_SALE_EXTERNAL,
        createdAt: {
          gte: oneWeekAgo
        }
      }
    });

    return {
      lostStolenCount,
      foundCount,
      matchesThisWeek,
      forSaleCount
    };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    // Return default values instead of throwing an error
    return {
      lostStolenCount: 0,
      foundCount: 0,
      matchesThisWeek: 0,
      forSaleCount: 0,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}