import { prisma } from '../lib/prisma';

export interface StatewideStats {
  totalMembers: number;
  activeMembers: number;
  totalDistricts: number;
  totalAssemblies: number;
  verifiedBooths: number;
}

/**
 * 1. Get Statewide Live Member Statistics from Database
 */
export async function getLiveStatewideStats(): Promise<StatewideStats> {
  try {
    const activeMembers = await prisma.member.count({
      where: { status: 'ACTIVE' },
    });

    const totalMembers = await prisma.member.count();
    const totalDistricts = await prisma.district.count();
    const totalAssemblies = await prisma.assembly.count();

    return {
      totalMembers,
      activeMembers,
      totalDistricts: totalDistricts || 75,
      totalAssemblies: totalAssemblies || 403,
      verifiedBooths: 0,
    };
  } catch (error) {
    console.error('Error fetching statewide live stats:', error);
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
  try {
    const count = await prisma.member.count({
      where: {
        status: 'ACTIVE',
        OR: [
          { districtId: districtNameOrId },
          { district: { name: districtNameOrId } },
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
  try {
    const count = await prisma.member.count({
      where: {
        status: 'ACTIVE',
        OR: [
          { assemblyId: assemblyNameOrId },
          { assembly: { name: assemblyNameOrId } },
        ],
        AND: [
          {
            OR: [
              { districtId: districtNameOrId },
              { district: { name: districtNameOrId } },
            ],
          },
        ],
      },
    });
    return count;
  } catch (error) {
    console.error(`Error fetching assembly member count for "${assemblyNameOrId}":`, error);
    return 0;
  }
}

/**
 * 4. Get Statistics for ALL UP Districts in a single query
 */
export async function getAllDistrictMemberCounts(): Promise<Record<string, number>> {
  try {
    const grouped = await prisma.member.groupBy({
      by: ['districtId'],
      where: { status: 'ACTIVE' },
      _count: {
        _all: true,
      },
    });

    const districts = await prisma.district.findMany({
      select: { id: true, name: true },
    });

    const countsMap: Record<string, number> = {};
    districts.forEach((d) => {
      const g = grouped.find((item) => item.districtId === d.id);
      countsMap[d.name] = g ? g._count._all : 0;
    });

    return countsMap;
  } catch (error) {
    console.error('Error fetching all district member counts:', error);
    return {};
  }
}
