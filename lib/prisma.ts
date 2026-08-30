import { PrismaClient } from '@prisma/client';

// Automatically format Supabase PgBouncer URL with required parameters
let dbUrl = process.env.DATABASE_URL || '';
if (dbUrl && (dbUrl.includes(':6543') || dbUrl.includes('pooler.supabase.com'))) {
  try {
    const urlObj = new URL(dbUrl);
    if (!urlObj.searchParams.has('pgbouncer')) {
      urlObj.searchParams.set('pgbouncer', 'true');
    }
    if (!urlObj.searchParams.has('connection_limit')) {
      urlObj.searchParams.set('connection_limit', '10');
    }
    if (!urlObj.searchParams.has('pool_timeout')) {
      urlObj.searchParams.set('pool_timeout', '10');
    }
    if (!urlObj.searchParams.has('connect_timeout')) {
      urlObj.searchParams.set('connect_timeout', '10');
    }
    dbUrl = urlObj.toString();
  } catch {
    // If URL parsing fails, fallback to raw dbUrl
  }
}

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: dbUrl || undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

globalForPrisma.prisma = prisma;

/**
 * Safe database query wrapper with automatic 1-time retry for resilience against dropped sockets
 */
export async function withDbRetry<T>(queryFn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await queryFn();
  } catch (firstErr) {
    console.warn('First DB query attempt failed, retrying once...', firstErr);
    try {
      return await queryFn();
    } catch (secondErr) {
      console.error('Second DB query attempt failed:', secondErr);
      return fallback;
    }
  }
}

let sequenceTableEnsured = false;

/**
 * Ensures the MembershipCount table exists in PostgreSQL and has the permanent sequence tracker initialized
 */
export async function ensureSequenceTrackingTable() {
  if (sequenceTableEnsured) return;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS public."MembershipCount" (
        "id" TEXT PRIMARY KEY,
        "scopeType" TEXT NOT NULL,
        "scopeId" TEXT NOT NULL,
        "activeCount" INTEGER NOT NULL DEFAULT 0,
        "pendingCount" INTEGER NOT NULL DEFAULT 0,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "MembershipCount_scopeType_scopeId_key" 
      ON public."MembershipCount"("scopeType", "scopeId");
    `);

    // Ensure SEQUENCE tracking record is initialized to at least the highest existing member sequence
    const existingSeq = await prisma.membershipCount.findFirst({
      where: { scopeType: 'SEQUENCE', scopeId: 'TVK-UP' },
    });
    if (!existingSeq) {
      const allMembers = await prisma.member.findMany({
        where: { membershipId: { not: null } },
        select: { membershipId: true },
      });
      let initMax = 100;
      for (const m of allMembers) {
        if (m.membershipId) {
          const num = parseInt(m.membershipId.replace(/\D/g, ''), 10);
          if (!isNaN(num) && num > initMax) initMax = num;
        }
      }
      await prisma.membershipCount.create({
        data: {
          id: 'seq-tvk-up',
          scopeType: 'SEQUENCE',
          scopeId: 'TVK-UP',
          activeCount: initMax,
        },
      });
    }

    sequenceTableEnsured = true;
  } catch (e) {
    console.warn('ensureSequenceTrackingTable warning:', e);
  }
}

export const AUTHORIZED_ADMIN_EMAIL = 'tvkuttarpradesh@gmail.com';

let adminLockdownEnsured = false;

/**
 * Ensures AdminOtpVerification table exists and restricts active admin users
 * solely to the authorized administrator (tvkuttarpradesh@gmail.com).
 */
export async function ensureAdminSecurityLockdown() {
  if (adminLockdownEnsured) return;
  try {
    // 1. Create AdminOtpVerification table if it does not exist
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS public."AdminOtpVerification" (
        "id" TEXT PRIMARY KEY,
        "email" TEXT NOT NULL,
        "otpHash" TEXT NOT NULL,
        "preAuthToken" TEXT NOT NULL,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        "verified" BOOLEAN NOT NULL DEFAULT false,
        "attempts" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "AdminOtpVerification_email_idx" 
      ON public."AdminOtpVerification"("email");
    `);

    // 2. Check if authorizedUser exists
    const authorizedUser = await prisma.user.findFirst({
      where: { email: AUTHORIZED_ADMIN_EMAIL },
    });

    if (!authorizedUser) {
      // Find the existing superadmin user and migrate email to tvkuttarpradesh@gmail.com
      const existingSuperAdmin = await prisma.user.findFirst({
        where: {
          adminUser: { isNot: null },
          status: 'ACTIVE',
        },
      });

      if (existingSuperAdmin) {
        await prisma.user.update({
          where: { id: existingSuperAdmin.id },
          data: {
            email: AUTHORIZED_ADMIN_EMAIL,
            name: 'TVK Uttar Pradesh Admin',
          },
        });
        console.log(`[SECURITY LOCKDOWN] Migrated superadmin account to ${AUTHORIZED_ADMIN_EMAIL}`);
      }
    }

    // 3. Disable any other admin users
    await prisma.user.updateMany({
      where: {
        email: { not: AUTHORIZED_ADMIN_EMAIL },
        adminUser: { isNot: null },
      },
      data: {
        status: 'DISABLED',
      },
    });

    adminLockdownEnsured = true;
  } catch (err) {
    console.warn('ensureAdminSecurityLockdown warning:', err);
  }
}

let cmsTablesEnsured = false;

export async function ensureCmsTables() {
  if (cmsTablesEnsured) return;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS public."Announcement" (
        "id" TEXT PRIMARY KEY,
        "title" TEXT NOT NULL,
        "slug" TEXT UNIQUE NOT NULL,
        "content" TEXT NOT NULL,
        "imageUrl" TEXT,
        "category" TEXT NOT NULL,
        "author" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'DRAFT',
        "publishAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS public."Event" (
        "id" TEXT PRIMARY KEY,
        "title" TEXT NOT NULL,
        "slug" TEXT UNIQUE NOT NULL,
        "description" TEXT NOT NULL,
        "imageUrl" TEXT,
        "location" TEXT NOT NULL,
        "eventDate" TIMESTAMP(3) NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'DRAFT',
        "districtId" TEXT,
        "assemblyId" TEXT,
        "registrationLink" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    cmsTablesEnsured = true;
  } catch (err) {
    console.warn('ensureCmsTables warning:', err);
  }
}

let officeBearerTableEnsured = false;

export async function ensureOfficeBearerTable() {
  if (officeBearerTableEnsured) return;
  try {
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

    // Safely add columns if missing
    await prisma.$executeRawUnsafe(`ALTER TABLE public."OfficeBearer" ADD COLUMN IF NOT EXISTS "bearerId" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE public."OfficeBearer" ADD COLUMN IF NOT EXISTS "dob" TIMESTAMP(3);`);
    await prisma.$executeRawUnsafe(`ALTER TABLE public."OfficeBearer" ADD COLUMN IF NOT EXISTS "gender" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE public."OfficeBearer" ADD COLUMN IF NOT EXISTS "address" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE public."OfficeBearer" ADD COLUMN IF NOT EXISTS "govtIdType" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE public."OfficeBearer" ADD COLUMN IF NOT EXISTS "govtIdNumber" TEXT;`);

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "OfficeBearer_bearerId_key" 
      ON public."OfficeBearer"("bearerId");
    `);

    // Backfill any existing bearers where bearerId is null
    const unassignedBearers = await prisma.officeBearer.findMany({
      where: { bearerId: null },
    });
    for (const b of unassignedBearers) {
      const generatedId = `TVK-OB-2026-00${b.id.slice(0, 4).toUpperCase()}`;
      await prisma.officeBearer.update({
        where: { id: b.id },
        data: { bearerId: generatedId },
      });
    }

    officeBearerTableEnsured = true;
  } catch (err) {
    console.warn('ensureOfficeBearerTable warning:', err);
  }
}


