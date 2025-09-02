#!/usr/bin/env node

/**
 * Cron job to fetch external listings from Tori.fi and other sources
 * This script should be run periodically to update external listings
 */

const PrismaClient = require("../../generated/prisma").PrismaClient;
const { fetchExternalListings, externalListingToBike } = require("../../lib/externalListings");
const { BikeStatus } = require("../../types/bicycle");

const prisma = new PrismaClient();

/**
 * Check if the Tori.fi adapter is enabled
 */
function isToriAdapterEnabled() {
  // Check environment variable
  const enableToriAdapter = process.env.ENABLE_TORI_ADAPTER;
  return enableToriAdapter === 'true' || enableToriAdapter === undefined; // Enabled by default
}

async function fetchForSaleListings() {
  console.log("Starting fetchForSale cron job...");
  
  // Check if the adapter is enabled
  if (!isToriAdapterEnabled()) {
    console.log("Tori.fi adapter is disabled, skipping cron job");
    return;
  }
  
  try {
    // Fetch external listings
    console.log("Fetching external listings...");
    const listings = await fetchExternalListings();
    console.log(`Fetched ${listings.length} listings`);
    
    let newBikesCount = 0;
    let updatedBikesCount = 0;
    
    // Process each listing
    for (const listing of listings) {
      try {
        // Convert listing to bike format
        const convertedBike = externalListingToBike(listing);
        
        // Check if bike already exists
        const existingBike = await prisma.bike.findFirst({
          where: {
            AND: [
              { sourceUrl: convertedBike.sourceUrl },
              { status: BikeStatus.FOR_SALE_EXTERNAL }
            ]
          }
        });
        
        if (existingBike) {
          // Update existing bike
          await prisma.bike.update({
            where: { id: existingBike.id },
            data: {
              brand: convertedBike.brand,
              model: convertedBike.model,
              color: convertedBike.color,
              city: convertedBike.city,
              updatedAt: new Date(),
            }
          });
          updatedBikesCount++;
        } else {
          // Create new bike
          await prisma.bike.create({
            data: {
              brand: convertedBike.brand,
              model: convertedBike.model,
              color: convertedBike.color,
              status: BikeStatus.FOR_SALE_EXTERNAL,
              city: convertedBike.city,
              source: convertedBike.source,
              sourceUrl: convertedBike.sourceUrl,
              createdAt: convertedBike.createdAt,
              updatedAt: convertedBike.updatedAt,
            }
          });
          newBikesCount++;
        }
      } catch (error) {
        console.error(`Error processing listing ${listing.url}:`, error);
      }
    }
    
    console.log(`FetchForSale cron job completed. Added ${newBikesCount} new bikes, updated ${updatedBikesCount} bikes.`);
  } catch (error) {
    console.error("Error in fetchForSale cron job:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cron job if this file is executed directly
if (require.main === module) {
  fetchForSaleListings().catch(console.error);
}

module.exports = fetchForSaleListings;