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

// ─── Promise-based singleton initialization guards ───────────────────────────
// These ensure each DDL block runs EXACTLY ONCE per process lifetime,
// even if multiple concurrent requests arrive during a cold start.
// This eliminates the "DDL on every request" root cause of 504 timeouts.

let sequenceInitPromise: Promise<void> | null = null;
let adminSecurityInitPromise: Promise<void> | null = null;
let cmsTablesInitPromise: Promise<void> | null = null;
let officeBearerInitPromise: Promise<void> | null = null;

/**
 * Ensures the MembershipCount table exists and the sequence tracker is initialized.
 * Uses a module-level Promise singleton — DDL runs at most once per process.
 */
export function ensureSequenceTrackingTable(): Promise<void> {
  if (!sequenceInitPromise) {
    sequenceInitPromise = _initSequenceTable().catch((e) => {
      // Reset on failure so next request can retry
      sequenceInitPromise = null;
      console.warn('ensureSequenceTrackingTable warning:', e);
    }) as Promise<void>;
  }
  return sequenceInitPromise;
}

async function _initSequenceTable(): Promise<void> {
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

  // Ensure SEQUENCE tracking record is initialized
  const existingSeq = await prisma.membershipCount.findFirst({
    where: { scopeType: 'SEQUENCE', scopeId: 'TVK-UP' },
  });
  if (!existingSeq) {
    // Find the highest existing member sequence efficiently
    const maxResult = await prisma.$queryRaw<{ max_seq: string | null }[]>`
      SELECT MAX(CAST(REGEXP_REPLACE("membershipId", '[^0-9]', '', 'g') AS INTEGER)) as max_seq
      FROM "Member"
      WHERE "membershipId" IS NOT NULL
    `;
    const initMax = Math.max(100, parseInt(maxResult?.[0]?.max_seq || '100', 10) || 100);

    await prisma.membershipCount.create({
      data: {
        id: 'seq-tvk-up',
        scopeType: 'SEQUENCE',
        scopeId: 'TVK-UP',
        activeCount: initMax,
      },
    });
  }
}

export const AUTHORIZED_ADMIN_EMAIL = 'tvkuttarpradesh@gmail.com';

/**
 * Ensures AdminOtpVerification table exists and security lockdown is applied.
 * Uses a module-level Promise singleton — runs at most once per process.
 */
export function ensureAdminSecurityLockdown(): Promise<void> {
  if (!adminSecurityInitPromise) {
    adminSecurityInitPromise = _initAdminSecurity().catch((e) => {
      adminSecurityInitPromise = null;
      console.warn('ensureAdminSecurityLockdown warning:', e);
    }) as Promise<void>;
  }
  return adminSecurityInitPromise;
}

async function _initAdminSecurity(): Promise<void> {
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
    // Find the existing superadmin user and migrate email
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
}

/**
 * Ensures CMS tables exist.
 * Uses a module-level Promise singleton — runs at most once per process.
 */
export function ensureCmsTables(): Promise<void> {
  if (!cmsTablesInitPromise) {
    cmsTablesInitPromise = _initCmsTables().catch((e) => {
      cmsTablesInitPromise = null;
      console.warn('ensureCmsTables warning:', e);
    }) as Promise<void>;
  }
  return cmsTablesInitPromise;
}

async function _initCmsTables(): Promise<void> {
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
}

/**
 * Ensures OfficeBearer table and its extended columns exist.
 * Uses a module-level Promise singleton — runs at most once per process.
 */
export function ensureOfficeBearerTable(): Promise<void> {
  if (!officeBearerInitPromise) {
    officeBearerInitPromise = _initOfficeBearerTable().catch((e) => {
      officeBearerInitPromise = null;
      console.warn('ensureOfficeBearerTable warning:', e);
    }) as Promise<void>;
  }
  return officeBearerInitPromise;
}

async function _initOfficeBearerTable(): Promise<void> {
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

  // Safely add columns if missing (idempotent — IF NOT EXISTS)
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

  // Backfill any existing bearers where bearerId is null (one-time only)
  const unassignedBearers = await prisma.officeBearer.findMany({
    where: { bearerId: null },
    select: { id: true },
  });
  for (const b of unassignedBearers) {
    const generatedId = `TVK-OB-2026-00${b.id.slice(0, 4).toUpperCase()}`;
    await prisma.officeBearer.update({
      where: { id: b.id },
      data: { bearerId: generatedId },
    });
  }
}

// ─── Pre-warm all initialization on module load ──────────────────────────────
// This starts the DDL checks immediately when the module is first imported,
// so they complete BEFORE the first user request arrives.
// All subsequent calls return the already-resolved Promise instantly.
const isBuildPhase =
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.npm_lifecycle_event === 'build' ||
  !process.env.DATABASE_URL ||
  process.env.DATABASE_URL.includes('YOUR-PROJECT-REF');

if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test' && !isBuildPhase) {
  // Fire-and-forget: errors are caught inside each init function
  ensureSequenceTrackingTable().catch(() => {});
  ensureAdminSecurityLockdown().catch(() => {});
  ensureCmsTables().catch(() => {});
  ensureOfficeBearerTable().catch(() => {});
}
