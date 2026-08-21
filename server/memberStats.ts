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

/**
 * 1. Get Statewide Live Member Statistics from PostgreSQL Database
 * Source of Truth: prisma.member.count({ where: { status: 'ACTIVE' } })
 */
export async function getLiveStatewideStats(): Promise<StatewideStats> {
  try {
    const activeMembers = await prisma.member.count({
      where: { status: 'ACTIVE' },
    });

    const totalMembers = await prisma.member.count();

    return {
      totalMembers,
      activeMembers,
      totalDistricts: 75,
      totalAssemblies: 403,
      verifiedBooths: 0,
    };
  } catch (error) {
    console.error('Error fetching statewide live stats from DB:', error);
    return {
      totalMembers: 0,
      activeMembers: 0,
      totalDistricts: 75,
      totalAssemblies: 403,
      verifiedBooths: 0,
    };
  }
}

/**
 * 2. Get Member Count for a specific District by Name or ID
 */
export async function getDistrictMemberCount(districtNameOrId: string): Promise<number> {
  if (!districtNameOrId) return 0;
  const cleanName = districtNameOrId.trim();

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
 * 4. Get Statistics for ALL 75 UP Districts in a single optimized aggregation query
 * Guaranteed: Every one of the 75 UP districts is represented (defaults to 0).
 */
export async function getAllDistrictMemberCounts(): Promise<Record<string, number>> {
  // Initialize all 75 UP districts with 0
  const countsMap: Record<string, number> = {};
  for (const d of Object.keys(UP_DISTRICT_ASSEMBLIES)) {
    countsMap[d] = 0;
  }

  try {
    // 1. Group active members by districtId
    const grouped = await prisma.member.groupBy({
      by: ['districtId'],
      where: { status: 'ACTIVE' },
      _count: {
        _all: true,
      },
    });

    if (grouped.length > 0) {
      // 2. Fetch district names for the populated IDs
      const districtIds = grouped.map((g) => g.districtId);
      const districts = await prisma.district.findMany({
        where: { id: { in: districtIds } },
        select: { id: true, name: true },
      });

      const distIdToName: Record<string, string> = {};
      districts.forEach((d) => {
        distIdToName[d.id] = d.name;
      });

      // 3. Map counts to matching UP district names (case-insensitive)
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
    console.error('Error fetching all district member counts:', error);
    return countsMap;
  }
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
          (a) => a.toLowerCase().includes(aName.toLowerCase()) || aName.toLowerCase().includes(a.toLowerCase())
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
