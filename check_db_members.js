const { prisma } = require('./lib/prisma');

async function checkDb() {
  try {
    const allMembers = await prisma.member.findMany({
      include: {
        district: true,
        assembly: true,
      },
    });
    console.log('Total Member Rows in DB:', allMembers.length);
    console.log('Members list:', JSON.stringify(allMembers.map(m => ({
      id: m.id,
      membershipId: m.membershipId,
      name: m.fullName,
      status: m.status,
      mobile: m.mobile,
      district: m.district?.name,
      assembly: m.assembly?.name,
      districtId: m.districtId,
      assemblyId: m.assemblyId
    })), null, 2));

    const totalActive = await prisma.member.count({ where: { status: 'ACTIVE' } });
    const totalPending = await prisma.member.count({ where: { status: { in: ['SUBMITTED', 'PENDING_OTP', 'UNDER_REVIEW'] } } });
    const totalRejected = await prisma.member.count({ where: { status: 'REJECTED' } });
    const totalSuspended = await prisma.member.count({ where: { status: 'SUSPENDED' } });
    console.log('Counts summary:', { totalMembers: allMembers.length, totalActive, totalPending, totalRejected, totalSuspended });
  } catch (err) {
    console.error('DB query error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
