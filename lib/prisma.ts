import { PrismaClient } from '@prisma/client';

// Automatically append pgbouncer=true if connecting to Supabase transaction pooler (port 6543)
// This prevents PostgreSQL error 42P05: "prepared statement already exists" with PgBouncer
let dbUrl = process.env.DATABASE_URL || '';
if (dbUrl && (dbUrl.includes(':6543') || dbUrl.includes('pooler.supabase.com')) && !dbUrl.includes('pgbouncer=true')) {
  dbUrl += dbUrl.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true';
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: dbUrl || undefined,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
