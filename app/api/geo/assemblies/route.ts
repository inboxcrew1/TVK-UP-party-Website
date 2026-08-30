import { NextResponse } from 'next/server';
import { getAssemblies } from '../../../../server/geo';
import { UP_DISTRICT_ASSEMBLIES, getConstituenciesByDistrict } from '../../../../lib/upConstituencies';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const districtParam = searchParams.get('district') || searchParams.get('districtId');

    if (!districtParam) {
      return NextResponse.json({ error: 'district or districtId query parameter is required' }, { status: 400 });
    }

    // Try finding by district ID or Name in DB
    let assemblies = await getAssemblies(districtParam);

    // If empty, check if districtParam is a district name or id in DB
    if (!assemblies || assemblies.length === 0) {
      const dist = await prisma.district.findFirst({
        where: {
          OR: [
            { id: districtParam },
            { name: { equals: districtParam, mode: 'insensitive' } },
          ],
        },
      });

      if (dist) {
        assemblies = await prisma.assembly.findMany({
          where: { districtId: dist.id },
          orderBy: { name: 'asc' },
        });
      }
    }

    // Static fallback to UP_DISTRICT_ASSEMBLIES if DB records are not present
    if (!assemblies || assemblies.length === 0) {
      const staticList = getConstituenciesByDistrict(districtParam);
      assemblies = staticList.map((aName) => ({
        id: `ass-${aName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: aName,
        districtId: districtParam,
        createdAt: new Date(),
      }));
    }

    return NextResponse.json({
      success: true,
      assemblies,
    });
  } catch (error) {
    console.error('API assemblies fetch failed:', error);
    return NextResponse.json({ error: 'Failed to fetch assemblies' }, { status: 500 });
  }
}
