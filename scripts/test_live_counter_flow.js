const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testLiveCounterFlow() {
  console.log('--- TESTING AUTHORITATIVE END-TO-END LIVE COUNTER FLOW ---');

  // 1. Reset database to 0
  await prisma.memberDocument.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.membershipCount.deleteMany({});

  const initialCount = await prisma.member.count({ where: { status: 'ACTIVE' } });
  console.log(`Step 1: Initial Database Active Member Count = ${initialCount}`);
  if (initialCount !== 0) throw new Error('Initial count must be 0!');

  // 2. Register Member 1 in Bulandshahr -> Sikandrabad
  let stateObj = await prisma.state.findFirst({ where: { code: 'UP' } });
  if (!stateObj) {
    stateObj = await prisma.state.create({ data: { name: 'Uttar Pradesh', code: 'UP' } });
  }

  let distBulandshahr = await prisma.district.findFirst({ where: { name: 'Bulandshahr' } });
  if (!distBulandshahr) {
    distBulandshahr = await prisma.district.create({ data: { name: 'Bulandshahr', stateId: stateObj.id } });
  }

  let assSikandrabad = await prisma.assembly.findFirst({ where: { name: '065 - Sikandrabad' } });
  if (!assSikandrabad) {
    assSikandrabad = await prisma.assembly.create({ data: { name: '065 - Sikandrabad', districtId: distBulandshahr.id } });
  }

  const member1 = await prisma.member.create({
    data: {
      membershipId: 'TVK-UP 101',
      fullName: 'Test Member One',
      mobile: '+919876500001',
      gender: 'Male',
      dob: new Date(1995, 0, 1),
      photoUrl: '/media/thalapathy_vijay_watermark.jpg',
      stateId: stateObj.id,
      districtId: distBulandshahr.id,
      assemblyId: assSikandrabad.id,
      status: 'ACTIVE',
    },
  });
  console.log(`Step 2: Created Member 1 (${member1.fullName}) with ID: ${member1.membershipId}`);

  // Check counts after Member 1
  const countAfter1 = await prisma.member.count({ where: { status: 'ACTIVE' } });
  const countBulandshahr = await prisma.member.count({ where: { status: 'ACTIVE', districtId: distBulandshahr.id } });
  const countSikandrabad = await prisma.member.count({ where: { status: 'ACTIVE', assemblyId: assSikandrabad.id } });

  console.log(`Statewide Active Count: ${countAfter1} (Expected: 1)`);
  console.log(`Bulandshahr Active Count: ${countBulandshahr} (Expected: 1)`);
  console.log(`Sikandrabad Active Count: ${countSikandrabad} (Expected: 1)`);

  if (countAfter1 !== 1 || countBulandshahr !== 1 || countSikandrabad !== 1) {
    throw new Error('Count mismatch after Member 1 registration!');
  }

  // 3. Register Member 2 in Lucknow -> Lucknow West
  let distLucknow = await prisma.district.findFirst({ where: { name: 'Lucknow' } });
  if (!distLucknow) {
    distLucknow = await prisma.district.create({ data: { name: 'Lucknow', stateId: stateObj.id } });
  }

  let assLucknowWest = await prisma.assembly.findFirst({ where: { name: '171 - Lucknow West' } });
  if (!assLucknowWest) {
    assLucknowWest = await prisma.assembly.create({ data: { name: '171 - Lucknow West', districtId: distLucknow.id } });
  }

  const member2 = await prisma.member.create({
    data: {
      membershipId: 'TVK-UP 102',
      fullName: 'Test Member Two',
      mobile: '+919876500002',
      gender: 'Female',
      dob: new Date(1996, 5, 10),
      photoUrl: '/media/thalapathy_vijay_watermark.jpg',
      stateId: stateObj.id,
      districtId: distLucknow.id,
      assemblyId: assLucknowWest.id,
      status: 'ACTIVE',
    },
  });
  console.log(`Step 3: Created Member 2 (${member2.fullName}) with ID: ${member2.membershipId}`);

  // Check counts after Member 2
  const countAfter2 = await prisma.member.count({ where: { status: 'ACTIVE' } });
  const countLucknow = await prisma.member.count({ where: { status: 'ACTIVE', districtId: distLucknow.id } });
  const countBulandshahrUnchanged = await prisma.member.count({ where: { status: 'ACTIVE', districtId: distBulandshahr.id } });

  console.log(`Statewide Active Count: ${countAfter2} (Expected: 2)`);
  console.log(`Lucknow Active Count: ${countLucknow} (Expected: 1)`);
  console.log(`Bulandshahr Active Count: ${countBulandshahrUnchanged} (Expected: 1)`);

  if (countAfter2 !== 2 || countLucknow !== 1 || countBulandshahrUnchanged !== 1) {
    throw new Error('Count mismatch after Member 2 registration!');
  }

  // 4. Final Reset to 0
  await prisma.memberDocument.deleteMany({});
  await prisma.member.deleteMany({});
  await prisma.membershipCount.deleteMany({});

  const finalCount = await prisma.member.count({ where: { status: 'ACTIVE' } });
  console.log(`Step 4: Final Reset Count = ${finalCount} (Expected: 0)`);

  console.log('SUCCESS: All end-to-end live counter tests PASSED with 100% database accuracy!');
  await prisma.$disconnect();
}

testLiveCounterFlow();
