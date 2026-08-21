import { NextResponse } from 'next/server';
import {
  getLiveStatewideStats,
  getDistrictMemberCount,
  getAssemblyMemberCount,
  getAllDistrictMemberCounts,
  getDistrictAssembliesCounts,
} from '../../../../server/memberStats';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district');
    const assembly = searchParams.get('assembly');
    const fetchAllDistricts = searchParams.get('allDistricts') === 'true' || !district;
    const fetchAssemblies = searchParams.get('assemblies') === 'true' && !!district;

    const statewide = await getLiveStatewideStats();
    let districtCount = 0;
    let assemblyCount = 0;
    let assembliesMap: Record<string, number> | undefined;

    if (district) {
      districtCount = await getDistrictMemberCount(district);
      if (fetchAssemblies) {
        assembliesMap = await getDistrictAssembliesCounts(district);
      }
    }

    if (district && assembly) {
      assemblyCount = await getAssemblyMemberCount(district, assembly);
    }

    let allDistrictsMap: Record<string, number> | undefined;
    if (fetchAllDistricts) {
      allDistrictsMap = await getAllDistrictMemberCounts();
    }

    const count = district ? (assembly ? assemblyCount : districtCount) : statewide.activeMembers;

    const res = NextResponse.json({
      count,
      totalMembers: statewide.totalMembers,
      activeMembers: statewide.activeMembers,
      totalDistricts: statewide.totalDistricts,
      totalAssemblies: statewide.totalAssemblies,
      verifiedBooths: statewide.verifiedBooths,
      districtCount,
      assemblyCount,
      allDistricts: allDistrictsMap,
      assemblies: assembliesMap,
      currentId: `TVK-UP ${100 + statewide.activeMembers}`,
    });

    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return res;
  } catch (err) {
    console.error('API /api/member/counter error:', err);
    return NextResponse.json(
      {
        count: 0,
        totalMembers: 0,
        activeMembers: 0,
        totalDistricts: 75,
        totalAssemblies: 403,
        verifiedBooths: 0,
        districtCount: 0,
        assemblyCount: 0,
        allDistricts: {},
        currentId: 'TVK-UP 100',
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}
