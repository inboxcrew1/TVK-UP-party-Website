import { prisma } from '../lib/prisma';
import { UP_DISTRICT_ASSEMBLIES } from '../lib/upConstituencies';

export interface StatewideStats {
  totalMembers: number;
  activeMembers: number;
  totalDistricts: number;
  totalAssemblies: number;
  verifiedBooths: number;
}

export interface CentralizedStats extends StatewideStats {
  districtCounts: Record<string, number>;
  currentId: string;
}

// In-memory cache layer for sub-millisecond public counter responses
interface CacheStore {
  timestamp: number;
  statewide: StatewideStats;
  allDistricts: Record<string, number>;
}

let memoryCache: CacheStore | null = null;
const CACHE_TTL_MS = 3000; // 3 seconds TTL

/**
 * Instantly invalidate cache when new registrations or status changes occur
 */
export function invalidateMemberStatsCache() {
  memoryCache = null;
}

/**
 * 1. Get Statewide Live Member Statistics from PostgreSQL Database
 * Source of Truth: prisma.member.count({ where: { status: 'ACTIVE' } })
 */
export async function getLiveStatewideStats(): Promise<StatewideStats> {
  const now = Date.now();
  if (memoryCache && now - memoryCache.timestamp < CACHE_TTL_MS) {
    return memoryCache.statewide;
  }

  try {
    const activeMembers = await prisma.member.count({
      where: { status: 'ACTIVE' },
    });

    const totalMembers = await prisma.member.count();

    const stats: StatewideStats = {
      totalMembers,
      activeMembers,
      totalDistricts: 75,
      totalAssemblies: 403,
      verifiedBooths: 0,
    };

    if (!memoryCache) {
      const allDistricts = await queryAllDistrictCountsFromDb();
      memoryCache = { timestamp: now, statewide: stats, allDistricts };
    } else {
      memoryCache.statewide = stats;
      memoryCache.timestamp = now;
    }

    return stats;
  } catch (error) {
    console.error('Error fetching statewide live stats from DB:', error);
    return (
      memoryCache?.statewide || {
        totalMembers: 0,
        activeMembers: 0,
        totalDistricts: 75,
        totalAssemblies: 403,
        verifiedBooths: 0,
      }
    );
  }
}

/**
 * 2. Get Member Count for a specific District by Name or ID
 */
export async function getDistrictMemberCount(districtNameOrId: string): Promise<number> {
  if (!districtNameOrId) return 0;
  const cleanName = districtNameOrId.trim();

  // If memory cache is available, try memory lookup first
  if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_TTL_MS) {
    const matchedKey = Object.keys(memoryCache.allDistricts).find(
      (k) => k.toLowerCase() === cleanName.toLowerCase()
    );
    if (matchedKey) {
      return memoryCache.allDistricts[matchedKey];
    }
  }

  try {
    const count = await prisma.member.count({
      where: {
        status: 'ACTIVE',
        OR: [
          { districtId: cleanName },
          { district: { name: { equals: cleanName, mode: 'insensitive' } } },
        ],
      },
    });
    return count;
  } catch (error) {
    console.error(`Error fetching district member count for "${districtNameOrId}":`, error);
    return 0;
  }
}

/**
 * 3. Get Member Count for a specific Assembly Constituency
 */
export async function getAssemblyMemberCount(
  districtNameOrId: string,
  assemblyNameOrId: string
): Promise<number> {
  if (!assemblyNameOrId) return 0;
  const cleanDist = (districtNameOrId || '').trim();
  const cleanAss = assemblyNameOrId.trim();

  try {
    const count = await prisma.member.count({
      where: {
        status: 'ACTIVE',
        OR: [
          { assemblyId: cleanAss },
          { assembly: { name: { contains: cleanAss, mode: 'insensitive' } } },
        ],
        ...(cleanDist
          ? {
              district: {
                name: { contains: cleanDist, mode: 'insensitive' },
              },
            }
          : {}),
      },
    });
    return count;
  } catch (error) {
    console.error(`Error fetching assembly member count for "${cleanAss}":`, error);
    return 0;
  }
}

/**
 * Helper to query all district counts directly from DB
 */
async function queryAllDistrictCountsFromDb(): Promise<Record<string, number>> {
  const countsMap: Record<string, number> = {};
  for (const d of Object.keys(UP_DISTRICT_ASSEMBLIES)) {
    countsMap[d] = 0;
  }

  try {
    const grouped = await prisma.member.groupBy({
      by: ['districtId'],
      where: { status: 'ACTIVE' },
      _count: {
        _all: true,
      },
    });

    if (grouped.length > 0) {
      const districtIds = grouped.map((g) => g.districtId);
      const districts = await prisma.district.findMany({
        where: { id: { in: districtIds } },
        select: { id: true, name: true },
      });

      const distIdToName: Record<string, string> = {};
      districts.forEach((d) => {
        distIdToName[d.id] = d.name;
      });

      grouped.forEach((g) => {
        const rawName = distIdToName[g.districtId];
        if (rawName) {
          const matchedKey = Object.keys(UP_DISTRICT_ASSEMBLIES).find(
            (k) => k.toLowerCase() === rawName.toLowerCase()
          );
          if (matchedKey) {
            countsMap[matchedKey] = g._count._all;
          } else {
            countsMap[rawName] = g._count._all;
          }
        }
      });
    }

    return countsMap;
  } catch (error) {
    console.error('Error querying all district counts:', error);
    return countsMap;
  }
}

/**
 * 4. Get Statistics for ALL 75 UP Districts in a single optimized query with caching
 */
export async function getAllDistrictMemberCounts(): Promise<Record<string, number>> {
  const now = Date.now();
  if (memoryCache && now - memoryCache.timestamp < CACHE_TTL_MS) {
    return memoryCache.allDistricts;
  }

  const allDistricts = await queryAllDistrictCountsFromDb();
  if (memoryCache) {
    memoryCache.allDistricts = allDistricts;
    memoryCache.timestamp = now;
  }
  return allDistricts;
}

/**
 * 5. Get Statistics for all Assemblies in a specific District
 */
export async function getDistrictAssembliesCounts(
  districtName: string
): Promise<Record<string, number>> {
  const assemblies = UP_DISTRICT_ASSEMBLIES[districtName] || [];
  const countsMap: Record<string, number> = {};
  for (const a of assemblies) {
    countsMap[a] = 0;
  }

  try {
    const members = await prisma.member.findMany({
      where: {
        status: 'ACTIVE',
        district: { name: { equals: districtName, mode: 'insensitive' } },
      },
      select: {
        assembly: { select: { name: true } },
      },
    });

    members.forEach((m) => {
      if (m.assembly?.name) {
        const aName = m.assembly.name;
        const matched = assemblies.find(
          (a) =>
            a.toLowerCase().includes(aName.toLowerCase()) ||
            aName.toLowerCase().includes(a.toLowerCase())
        );
        if (matched) {
          countsMap[matched] = (countsMap[matched] || 0) + 1;
        } else {
          countsMap[aName] = (countsMap[aName] || 0) + 1;
        }
      }
    });

    return countsMap;
  } catch (err) {
    console.error(`Error fetching assemblies count for district "${districtName}":`, err);
    return countsMap;
  }
}

/**
 * 6. Centralized Master Statistics Service Function
 */
export async function getCentralizedMembershipStats(
  district?: string,
  assembly?: string
): Promise<CentralizedStats> {
  const statewide = await getLiveStatewideStats();
  const allDistricts = await getAllDistrictMemberCounts();

  return {
    ...statewide,
    districtCounts: allDistricts,
    currentId: `TVK-UP ${100 + statewide.activeMembers}`,
  };
}
