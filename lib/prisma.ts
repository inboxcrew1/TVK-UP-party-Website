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
