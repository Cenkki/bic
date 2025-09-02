import { PrismaClient } from "../generated/prisma";
import { BikeStatus } from "@/types/bicycle";

const prisma = new PrismaClient();

export async function getStatistics() {
  try {
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
    return {
      lostStolenCount: 0,
      foundCount: 0,
      matchesThisWeek: 0,
      forSaleCount: 0
    };
  }
}