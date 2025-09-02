import { BikeStatus } from "@/types/bicycle";
import { getBikes } from "@/lib/actions";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// Calculate Hamming distance between two hashes
export function hammingDistance(hash1: string, hash2: string): number {
  if (hash1.length !== hash2.length) return -1;
  
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++;
    }
  }
  return distance;
}

// Search bikes with various filters
export async function searchBikes(filters: {
  query?: string;
  serialNumber?: string;
  city?: string;
  status?: BikeStatus;
  limit?: number;
}) {
  try {
    const { query, serialNumber, city, status, limit = 50 } = filters;

    // Build filters for the getBikes function
    const bikeFilters: any = {};
    
    if (query) bikeFilters.search = query;
    if (serialNumber) bikeFilters.serialNumber = serialNumber;
    if (city) bikeFilters.city = city;
    if (status) bikeFilters.status = status;

    const result = await getBikes(bikeFilters);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    // Apply limit
    const bikes = result.bikes?.slice(0, limit) || [];
    
    return bikes;
  } catch (error) {
    console.error("Error searching bikes:", error);
    throw new Error("Failed to search bikes");
  }
}

// Find duplicate bikes based on serial number or pHash
export async function findDuplicateBikes(bikeId: string) {
  try {
    // Import the getBikeById function here to avoid circular dependencies
    const bike = await prisma.bike.findUnique({
      where: { id: bikeId }
    });

    if (!bike) {
      return [];
    }

    // Find duplicates by serial number
    const serialNumberDuplicates = bike.serialNumber ? await prisma.bike.findMany({
      where: {
        AND: [
          { id: { not: bikeId } },
          { serialNumber: bike.serialNumber }
        ]
      },
      include: {
        images: {
          take: 1
        }
      }
    }) : [];

    // Find duplicates by pHash (if available)
    const phashDuplicates = bike.phash ? await prisma.bike.findMany({
      where: {
        AND: [
          { id: { not: bikeId } },
          { phash: { not: null } }
        ]
      },
      include: {
        images: {
          take: 1
        }
      }
    }) : [];

    // Calculate similarity for pHash duplicates
    const similarBikes = phashDuplicates
      .map(duplicate => {
        if (!duplicate.phash || !bike.phash) return null;
        
        const distance = hammingDistance(bike.phash, duplicate.phash);
        if (distance === -1 || distance > 10) return null; // Only consider close matches
        
        return {
          ...duplicate,
          similarity: Math.max(0, 100 - (distance * 10)),
          distance
        };
      })
      .filter((bike): bike is NonNullable<typeof bike> => bike !== null)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));

    // Combine and deduplicate results
    const allDuplicates = [...serialNumberDuplicates, ...similarBikes];
    const uniqueDuplicates = Array.from(
      new Map(allDuplicates.map(item => [item.id, item])).values()
    );

    return uniqueDuplicates;
  } catch (error) {
    console.error("Error finding duplicate bikes:", error);
    throw new Error("Failed to find duplicate bikes");
  }
}

// Get all bikes with duplicate detection
export async function getBikesWithDuplicates(filters: {
  query?: string;
  serialNumber?: string;
  city?: string;
  status?: BikeStatus;
  limit?: number;
}) {
  try {
    // Get bikes based on filters
    const bikes = await searchBikes(filters);
    
    // For each bike, check if it has duplicates
    const bikesWithDuplicates = await Promise.all(
      bikes.map(async (bike) => {
        // Check for duplicates
        const duplicates = await findDuplicateBikes(bike.id);
        const isDuplicate = duplicates.length > 0;
        
        return {
          ...bike,
          isDuplicate,
          duplicates: isDuplicate ? duplicates : []
        };
      })
    );
    
    return bikesWithDuplicates;
  } catch (error) {
    console.error("Error getting bikes with duplicates:", error);
    throw new Error("Failed to get bikes with duplicates");
  }
}