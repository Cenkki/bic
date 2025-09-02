#!/usr/bin/env node

/**
 * Cron job to recompute matches for new bikes
 * This script should be run periodically to find new matches
 * 
 * Note: This cron job works independently of the Tori.fi adapter feature flag
 * as it processes all bikes in the system, not just external listings.
 */

const PrismaClient = require("../../generated/prisma").PrismaClient;
const { findMatchesForBike } = require("../../lib/matcher");

const prisma = new PrismaClient();

async function recomputeMatches() {
  console.log("Starting recomputeMatches cron job...");
  
  try {
    // Get bikes that haven't had matches computed recently (or ever)
    // For simplicity, we'll get bikes created in the last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const recentBikes = await prisma.bike.findMany({
      where: {
        createdAt: {
          gte: oneDayAgo
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    
    console.log(`Found ${recentBikes.length} recent bikes to process`);
    
    let totalMatchesFound = 0;
    
    // Process each bike
    for (const bike of recentBikes) {
      try {
        console.log(`Processing bike ${bike.id}...`);
        
        // Find matches for this bike
        const matches = await findMatchesForBike(bike.id);
        
        if (matches.length > 0) {
          console.log(`Found ${matches.length} matches for bike ${bike.id}`);
          totalMatchesFound += matches.length;
          
          // In a real implementation, you might want to:
          // 1. Store matches in a database table
          // 2. Send notifications to users
          // 3. Update a matches count on the bike record
          
          // For now, we'll just log the matches
          for (const match of matches) {
            console.log(`  Match: ${match.matchedBikeId} (confidence: ${match.confidence}%, type: ${match.matchType})`);
          }
        }
      } catch (error) {
        console.error(`Error processing bike ${bike.id}:`, error);
      }
    }
    
    console.log(`RecomputeMatches cron job completed. Found ${totalMatchesFound} total matches.`);
  } catch (error) {
    console.error("Error in recomputeMatches cron job:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cron job if this file is executed directly
if (require.main === module) {
  recomputeMatches().catch(console.error);
}

module.exports = recomputeMatches;