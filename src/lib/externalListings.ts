import { ExternalListing } from "../types/external";
import { BikeStatus } from "../types/bicycle";

/**
 * Service for handling external listings from sources like Tori.fi
 */

// Mock data for external listings (in a real implementation, this would come from an API or scraper)
const mockExternalListings: ExternalListing[] = [
  {
    title: "Miesten hybridipyörä, sininen, hyvä kunto",
    price: 350,
    city: "Helsinki",
    url: "https://example.com/listing/1",
    image: "/images/bike1.jpg",
    extractedAt: new Date("2023-06-15"),
  },
  {
    title: "Naisten kaupunkipyörä, Punainen, Kolmen vaihteinen",
    price: 200,
    city: "Espoo",
    url: "https://example.com/listing/2",
    image: "/images/bike2.jpg",
    extractedAt: new Date("2023-06-14"),
  },
  {
    title: "Lasten polkupyörä, 16 tuumaa, sininen ja valkoinen",
    price: 120,
    city: "Vantaa",
    url: "https://example.com/listing/3",
    image: "/images/bike3.jpg",
    extractedAt: new Date("2023-06-13"),
  },
];

// Type for converted bike from external listing
export interface ConvertedBike {
  id: string;
  brand?: string;
  model?: string;
  color?: string;
  status: BikeStatus;
  city?: string;
  source: string;
  sourceUrl: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  price?: number;
  serialNumber?: string;
}

/**
 * Check if the Tori.fi adapter is enabled
 */
function isToriAdapterEnabled(): boolean {
  // Check environment variable
  const enableToriAdapter = process.env.ENABLE_TORI_ADAPTER;
  return enableToriAdapter === 'true' || enableToriAdapter === undefined; // Enabled by default
}

/**
 * Fetch external listings from a source
 * In a real implementation, this would connect to an API or scraper
 */
export async function fetchExternalListings(): Promise<ExternalListing[]> {
  // Check if the adapter is enabled
  if (!isToriAdapterEnabled()) {
    console.log("Tori.fi adapter is disabled");
    return [];
  }
  
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Return mock data
  return [...mockExternalListings];
}

/**
 * Save external listings to the database
 * In a real implementation, this would save to the database
 */
export async function saveExternalListings(listings: ExternalListing[]): Promise<void> {
  // Check if the adapter is enabled
  if (!isToriAdapterEnabled()) {
    console.log("Tori.fi adapter is disabled");
    return;
  }
  
  // In a real implementation, this would save to the database
  console.log("Saving external listings:", listings);
}

/**
 * Update existing external listings
 * In a real implementation, this would update the database
 */
export async function updateExternalListings(listings: ExternalListing[]): Promise<void> {
  // Check if the adapter is enabled
  if (!isToriAdapterEnabled()) {
    console.log("Tori.fi adapter is disabled");
    return;
  }
  
  // In a real implementation, this would update the database
  console.log("Updating external listings:", listings);
}

/**
 * Extract bike information from listing title
 */
export function extractBikeInfo(title: string): {
  brand?: string;
  model?: string;
  color?: string;
} {
  // This is a simplified implementation
  // A real implementation would use more sophisticated NLP techniques
  
  const lowerTitle = title.toLowerCase();
  
  // Simple brand detection (in a real app, this would be more comprehensive)
  const brands = ["trek", "giant", "specialized", "cannondale", "scott"];
  const brand = brands.find(b => lowerTitle.includes(b));
  
  // Simple color detection
  const colors = ["sininen", "punainen", "vihreä", "musta", "valkoinen", "harmaa", "keltainen"];
  const color = colors.find(c => lowerTitle.includes(c));
  
  // Simple model/feature detection
  const features = ["hybridipyörä", "kaupunkipyörä", "polkupyörä", "maastopyörä", "lastenpyörä"];
  const model = features.find(f => lowerTitle.includes(f));
  
  return {
    brand: brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : undefined,
    model,
    color: color ? color.charAt(0).toUpperCase() + color.slice(1) : undefined,
  };
}

/**
 * Convert external listing to bike format
 */
export function externalListingToBike(listing: ExternalListing): ConvertedBike {
  const bikeInfo = extractBikeInfo(listing.title);
  
  return {
    id: `external-${listing.url.split('/').pop()}`,
    brand: bikeInfo.brand,
    model: bikeInfo.model,
    color: bikeInfo.color,
    status: BikeStatus.FOR_SALE_EXTERNAL,
    city: listing.city,
    source: "tori.fi", // or other source
    sourceUrl: listing.url,
    createdAt: listing.extractedAt,
    updatedAt: listing.extractedAt,
    image: listing.image,
    price: listing.price,
    serialNumber: undefined, // External listings typically don't have serial numbers
  };
}