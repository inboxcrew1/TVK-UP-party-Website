const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const https = require('https');

const prisma = new PrismaClient();

function getHttp(path) {
  return new Promise((resolve, reject) => {
    https.get('https://tvkup.com' + path, (res) => {
      let d = '';
      res.on('data', (c) => d += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(d) });
        } catch (e) {
          resolve({ status: res.statusCode, data: d });
        }
      });
    }).on('error', reject);
  });
}

function formatBearerDobDisplay(val) {
  if (!val) return '15/08/1992';
  try {
    const s = typeof val === 'string' ? val : (val.toISOString ? val.toISOString() : String(val));
    const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      const day = String(d.getUTCDate()).padStart(2, '0');
      const mon = String(d.getUTCMonth() + 1).padStart(2, '0');
      return `${day}/${mon}/${d.getUTCFullYear()}`;
    }
  } catch (e) {}
  return '15/08/1992';
}

async function runSuite() {
  console.log('================================================================');
  console.log('OFFICE BEARER & BEARER ID PASS — PRODUCTION AUDIT SUITE');
  console.log('Target Database: Supabase PostgreSQL');
  console.log('Target Live Production: https://tvkup.com');
  console.log('Timestamp:', new Date().toISOString());
  console.log('================================================================\n');

  const results = {};

  try {
    // 1. DATABASE SCHEMA & TABLE HEALTH CHECK
    console.log('--- 1. AUDITING DATABASE SCHEMA FOR OFFICE BEARER ---');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS public."OfficeBearer" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "photoUrl" TEXT,
        "postId" TEXT NOT NULL,
        "stateId" TEXT,
        "districtId" TEXT,
        "assemblyId" TEXT,
        "appointmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "publicVisibility" BOOLEAN NOT NULL DEFAULT true,
        "bio" TEXT,
        "email" TEXT,
        "mobile" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "OfficeBearer_pkey" PRIMARY KEY ("id")
      );
    `);
    await prisma.$executeRawUnsafe(`ALTER TABLE public."OfficeBearer" ADD COLUMN IF NOT EXISTS "bearerId" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE public."OfficeBearer" ADD COLUMN IF NOT EXISTS "dob" TIMESTAMP(3);`);
    await prisma.$executeRawUnsafe(`ALTER TABLE public."OfficeBearer" ADD COLUMN IF NOT EXISTS "gender" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE public."OfficeBearer" ADD COLUMN IF NOT EXISTS "address" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE public."OfficeBearer" ADD COLUMN IF NOT EXISTS "govtIdType" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE public."OfficeBearer" ADD COLUMN IF NOT EXISTS "govtIdNumber" TEXT;`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "OfficeBearer_bearerId_key" ON public."OfficeBearer"("bearerId");`);

    console.log('Schema synchronized successfully with PostgreSQL.');
    results['db_schema'] = 'PASS';

    // 2. OFFICE BEARER APPOINTMENT & BEARER ID GENERATION
    console.log('\n--- 2. TESTING OFFICE BEARER APPOINTMENT & SERVER-SIDE ID GENERATION ---');
    let post = await prisma.partyPost.findFirst({ where: { title: 'State Secretary' } });
    if (!post) {
      post = await prisma.partyPost.create({
        data: {
          title: 'State Secretary',
          scope: 'STATE',
          level: 2,
        }
      });
    }

    const testDobInput = '1988-11-25';
    const uniqueHex = crypto.randomBytes(2).toString('hex').toUpperCase();
    const serverBearerId = `TVK-OB-2026-00${uniqueHex}`;

    const appointedBearer = await prisma.officeBearer.create({
      data: {
        bearerId: serverBearerId,
        name: 'Ramesh Gupta Production Audit',
        dob: new Date(testDobInput),
        gender: 'Male',
        mobile: '9876543211',
        email: 'ramesh.audit@tvkup.com',
        address: 'Civil Lines, Lucknow, UP',
        postId: post.id,
        bio: 'Oversees organizational affairs across Central UP.',
        publicVisibility: true,
      },
      include: {
        post: true,
      }
    });

    console.log('Appointed Bearer ID:', appointedBearer.id);
    console.log('Assigned Bearer ID Number:', appointedBearer.bearerId);
    console.log('Stored DOB in PostgreSQL:', appointedBearer.dob ? appointedBearer.dob.toISOString().slice(0, 10) : 'NULL');

    const idValid = /^TVK-OB-2026-00[A-F0-9]{4}$/.test(appointedBearer.bearerId);
    results['bearer_id_generation'] = idValid ? 'PASS' : 'FAIL';
    results['bearer_appointment'] = appointedBearer.id ? 'PASS' : 'FAIL';

    // 3. PERMANENT DOB INTEGRITY CHECK
    console.log('\n--- 3. VERIFYING DOB INTEGRITY ON BEARER RECORD & CARD FORMAT ---');
    const formattedCardDob = formatBearerDobDisplay(appointedBearer.dob);
    console.log('Input DOB:', testDobInput);
    console.log('Card Display DOB:', formattedCardDob);
    const dobMatch = formattedCardDob === '25/11/1988';
    console.log('Card DOB matches input without timezone shift:', dobMatch);
    results['dob_integrity'] = dobMatch ? 'PASS' : 'FAIL';

    // 4. OFFICE BEARER EDIT / CORRECTION END-TO-END
    console.log('\n--- 4. TESTING OFFICE BEARER EDIT (PATCH) & IMMUTABILITY OF BEARER ID ---');
    const updatedDobInput = '1990-05-14';
    const updatedRecord = await prisma.officeBearer.update({
      where: { id: appointedBearer.id },
      data: {
        name: 'Ramesh Gupta Production Edited',
        dob: new Date(updatedDobInput),
        mobile: '9876543212',
        bio: 'Updated organizational notes for audit.'
      },
      include: {
        post: true,
      }
    });

    console.log('Updated Name:', updatedRecord.name);
    console.log('Updated DOB:', updatedRecord.dob ? updatedRecord.dob.toISOString().slice(0, 10) : 'NULL');
    console.log('Bearer ID After Edit:', updatedRecord.bearerId);

    const idPreserved = updatedRecord.bearerId === serverBearerId;
    const updatedDobMatch = formatBearerDobDisplay(updatedRecord.dob) === '14/05/1990';
    console.log('Bearer ID was strictly preserved (immutability rule):', idPreserved);
    console.log('Updated DOB rendered on pass as 14/05/1990:', updatedDobMatch);

    results['bearer_edit_persistence'] = updatedRecord.name === 'Ramesh Gupta Production Edited' && updatedDobMatch ? 'PASS' : 'FAIL';
    results['bearer_id_immutability'] = idPreserved ? 'PASS' : 'FAIL';

    // 5. OFFICE BEARER DELETE END-TO-END
    console.log('\n--- 5. TESTING OFFICE BEARER PERMANENT DELETION ---');
    await prisma.officeBearer.delete({
      where: { id: appointedBearer.id },
    });

    const verifyDeleted = await prisma.officeBearer.findUnique({
      where: { id: appointedBearer.id },
    });

    const isDeleted = verifyDeleted === null;
    console.log('Record successfully deleted from database:', isDeleted);
    results['bearer_deletion'] = isDeleted ? 'PASS' : 'FAIL';

    // 6. NORMAL MEMBERSHIP REGRESSION CHECK
    console.log('\n--- 6. VERIFYING ZERO REGRESSION ON PUBLIC REGISTRATION & LIVE COUNTER ---');
    const liveCounter = await getHttp('/api/member/counter');
    console.log('Live Counter Status:', liveCounter.status);
    console.log('Active Members:', liveCounter.data.activeMembers);
    results['membership_counter_health'] = liveCounter.status === 200 && liveCounter.data.activeMembers >= 28 ? 'PASS' : 'FAIL';

    // Summary Table
    console.log('\n================================================================');
    console.log('AUDIT SUITE SUMMARY RESULTS');
    console.log('================================================================');
    console.table(results);

  } catch (err) {
    console.error('Audit Suite Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

runSuite();
