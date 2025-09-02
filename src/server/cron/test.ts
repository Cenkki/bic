#!/usr/bin/env node

/**
 * Test script for cron jobs
 * This script can be used to test the cron job functionality
 */

const PrismaClient = require("../../generated/prisma").PrismaClient;

const prisma = new PrismaClient();

async function test() {
  try {
    const bikes = await prisma.bike.findMany();
    console.log(`Found ${bikes.length} bikes`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test().catch(console.error);