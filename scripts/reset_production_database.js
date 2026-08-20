const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetProductionDatabase() {
  console.log('--- TVK UTTAR PRADESH PRE-LAUNCH DATABASE RESET ---');
  
  try {
    // 1. Delete all non-master member transaction records
    const deletedDocs = await prisma.memberDocument.deleteMany({});
    console.log(`Deleted ${deletedDocs.count} test member document records.`);

    const deletedMembers = await prisma.member.deleteMany({});
    console.log(`Deleted ${deletedMembers.count} test member registration records.`);

    const deletedCounts = await prisma.membershipCount.deleteMany({});
    console.log(`Reset ${deletedCounts.count} membership counter sequence trackers.`);

    // 2. Verify remaining count
    const remainingMembers = await prisma.member.count();
    console.log(`Verification: Total Active Members in Database = ${remainingMembers}`);

    if (remainingMembers === 0) {
      console.log('SUCCESS: Database successfully reset! Ready for real live registrations.');
    } else {
      console.error('WARNING: Some records could not be cleared.');
    }
  } catch (err) {
    console.error('Reset error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

resetProductionDatabase();
