import { PrismaClient } from "../generated/prisma";
import { BikeStatus } from "@/types/bicycle";

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

// Interface for match results
export interface Match {
  id: string;
  bikeId: string;
  matchedBikeId: string;
  confidence: number; // 0-100 percentage
  matchType: "SERIAL_NUMBER" | "PHASH" | "KEYWORDS";
  details: string;
}

/**
 * Find matches for a bike based on various criteria
 */
export async function findMatchesForBike(bikeId: string): Promise<Match[]> {
  try {
    const bike = await prisma.bike.findUnique({
      where: { id: bikeId }
    });

    if (!bike) {
      throw new Error("Bike not found");
    }

    const matches: Match[] = [];

    // 1. Serial number matching
    if (bike.serialNumber) {
      const serialMatches = await findSerialNumberMatches(bike);
      matches.push(...serialMatches);
    }

    // 2. pHash similarity matching
    if (bike.phash) {
      const phashMatches = await findPhashMatches(bike);
      matches.push(...phashMatches);
    }

    // 3. Keyword + city matching
    const keywordMatches = await findKeywordMatches(bike);
    matches.push(...keywordMatches);

    // Remove duplicates and sort by confidence
    const uniqueMatches = Array.from(
      new Map(matches.map(match => [match.matchedBikeId, match])).values()
    );

    return uniqueMatches.sort((a, b) => b.confidence - a.confidence);
  } catch (error) {
    console.error("Error finding matches:", error);
    throw new Error("Failed to find matches");
  }
}

/**
 * Find matches based on serial number
 */
async function findSerialNumberMatches(bike: any): Promise<Match[]> {
  const matches: Match[] = [];
  
  // Don't match against bikes with the same status
  const oppositeStatuses = getOppositeStatuses(bike.status as BikeStatus);
  
  const matchingBikes = await prisma.bike.findMany({
    where: {
      AND: [
        { serialNumber: bike.serialNumber },
        { id: { not: bike.id } },
        { status: { in: oppositeStatuses } }
      ]
    }
  });

  for (const matchedBike of matchingBikes) {
    matches.push({
      id: `serial-${bike.id}-${matchedBike.id}`,
      bikeId: bike.id,
      matchedBikeId: matchedBike.id,
      confidence: 95, // High confidence for exact serial match
      matchType: "SERIAL_NUMBER",
      details: `Sarjanumero täsmää: ${bike.serialNumber}`
    });
  }

  return matches;
}

/**
 * Find matches based on pHash similarity
 */
async function findPhashMatches(bike: any): Promise<Match[]> {
  const matches: Match[] = [];
  
  // Don't match against bikes with the same status
  const oppositeStatuses = getOppositeStatuses(bike.status as BikeStatus);
  
  const potentialMatches = await prisma.bike.findMany({
    where: {
      AND: [
        { phash: { not: null } },
        { id: { not: bike.id } },
        { status: { in: oppositeStatuses } }
      ]
    }
  });

  for (const matchedBike of potentialMatches) {
    if (!matchedBike.phash) continue;
    
    const distance = hammingDistance(bike.phash!, matchedBike.phash);
    if (distance === -1 || distance > 10) continue;
    
    // Confidence based on distance (0 distance = 100% confidence, 10 distance = 0% confidence)
    const confidence = Math.max(0, 100 - (distance * 10));
    
    if (confidence >= 50) { // Only include matches with at least 50% confidence
      matches.push({
        id: `phash-${bike.id}-${matchedBike.id}`,
        bikeId: bike.id,
        matchedBikeId: matchedBike.id,
        confidence,
        matchType: "PHASH",
        details: `Visuaalinen samankaltaisuus (etäisyys: ${distance})`
      });
    }
  }

  return matches;
}

/**
 * Find matches based on keywords and city
 */
async function findKeywordMatches(bike: any): Promise<Match[]> {
  const matches: Match[] = [];
  
  if (!bike.brand && !bike.model) {
    return matches; // Can't match without brand or model
  }
  
  // Don't match against bikes with the same status
  const oppositeStatuses = getOppositeStatuses(bike.status as BikeStatus);
  
  const potentialMatches = await prisma.bike.findMany({
    where: {
      AND: [
        { id: { not: bike.id } },
        { city: bike.city },
        { status: { in: oppositeStatuses } },
        {
          OR: [
            bike.brand ? { brand: { contains: bike.brand, mode: "insensitive" } } : {},
            bike.model ? { model: { contains: bike.model, mode: "insensitive" } } : {}
          ]
        }
      ]
    }
  });

  for (const matchedBike of potentialMatches) {
    // Calculate confidence based on matching fields
    let confidence = 0;
    const details = [];
    
    if (bike.brand && matchedBike.brand && 
        bike.brand.toLowerCase() === matchedBike.brand.toLowerCase()) {
      confidence += 40;
      details.push(`Merkki: ${bike.brand}`);
    }
    
    if (bike.model && matchedBike.model && 
        bike.model.toLowerCase() === matchedBike.model.toLowerCase()) {
      confidence += 40;
      details.push(`Malli: ${bike.model}`);
    }
    
    // Bonus for same city
    if (bike.city && matchedBike.city && 
        bike.city.toLowerCase() === matchedBike.city.toLowerCase()) {
      confidence += 20;
      details.push(`Kaupunki: ${bike.city}`);
    }
    
    if (confidence >= 50) { // Only include matches with at least 50% confidence
      matches.push({
        id: `keyword-${bike.id}-${matchedBike.id}`,
        bikeId: bike.id,
        matchedBikeId: matchedBike.id,
        confidence,
        matchType: "KEYWORDS",
        details: details.join(", ")
      });
    }
  }

  return matches;
}

/**
 * Get opposite statuses for matching
 * LOST/STOLEN bikes should match with FOUND/FOR_SALE_EXTERNAL bikes and vice versa
 */
function getOppositeStatuses(status: BikeStatus): BikeStatus[] {
  switch (status) {
    case BikeStatus.LOST:
    case BikeStatus.STOLEN:
      return [BikeStatus.FOUND, BikeStatus.FOR_SALE_EXTERNAL];
    case BikeStatus.FOUND:
    case BikeStatus.FOR_SALE_EXTERNAL:
      return [BikeStatus.LOST, BikeStatus.STOLEN];
    default:
      return [];
  }
}