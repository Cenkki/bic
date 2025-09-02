const { PrismaClient } = require('../src/generated/prisma');

async function testDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log('❌ DATABASE_URL environment variable not set');
    process.exit(1);
  }
  
  console.log('📡 Testing database connection...');
  console.log(`🔗 URL: ${databaseUrl.replace(/:[^:@]+@/, ':***@')}`); // Hide password in logs
  
  try {
    const prisma = new PrismaClient();
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test a simple query
    const count = await prisma.bike.count();
    console.log(`📊 Found ${count} bikes in the database`);
    
    await prisma.$disconnect();
    console.log('🔌 Disconnected from database');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testDatabase();