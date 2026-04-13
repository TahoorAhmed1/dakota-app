const { PrismaClient } = require("@prisma/client");

async function testConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log("Testing database connection...");
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Test a simple query
    const campCount = await prisma.camp.count();
    console.log(`Found ${campCount} camps in database`);

    await prisma.$disconnect();
    console.log("✅ Connection test completed");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

testConnection();