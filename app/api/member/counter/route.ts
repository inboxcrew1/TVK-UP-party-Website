import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import {
  getLiveStatewideStats,
  getDistrictMemberCount,
  getAssemblyMemberCount,
  getAllDistrictMemberCounts,
  getDistrictAssembliesCounts,
} from '../../../../server/memberStats';
import { withTimeoutFallback } from '../../../../lib/timeout';

export const dynamic = 'force-dynamic';
// Cache at CDN/proxy layer: 30s fresh, 10s stale-while-revalidate
// This dramatically reduces DB hits under concurrent traffic
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district');
    const assembly = searchParams.get('assembly');
    const fetchAllDistricts = searchParams.get('allDistricts') === 'true' || !district;
    const fetchAssemblies = searchParams.get('assemblies') === 'true' && !!district;

    // ─── All DB calls wrapped with 8s timeout ───────────────────────────────
    const TIMEOUT_MS = 8000;

    const statewide = await withTimeoutFallback(
      getLiveStatewideStats(),
      TIMEOUT_MS,
      { totalMembers: 0, activeMembers: 0, totalDistricts: 75, totalAssemblies: 403, verifiedBooths: 0 },
      'statewide stats'
    );

    let districtCount = 0;
    let assemblyCount = 0;
    let assembliesMap: Record<string, number> | undefined;

    if (district) {
      districtCount = await withTimeoutFallback(
        getDistrictMemberCount(district),
        TIMEOUT_MS,
        0,
        'district count'
      );
      if (fetchAssemblies) {
        assembliesMap = await withTimeoutFallback(
          getDistrictAssembliesCounts(district),
          TIMEOUT_MS,
          {},
          'assemblies count'
        );
      }
    }

    if (district && assembly) {
      assemblyCount = await withTimeoutFallback(
        getAssemblyMemberCount(district, assembly),
        TIMEOUT_MS,
        0,
        'assembly count'
      );
    }

    let allDistrictsMap: Record<string, number> | undefined;
    if (fetchAllDistricts) {
      allDistrictsMap = await withTimeoutFallback(
        getAllDistrictMemberCounts(),
        TIMEOUT_MS,
        {},
        'all districts'
      );
    }

    const count = district ? (assembly ? assemblyCount : districtCount) : statewide.activeMembers;

    // ─── Sequence tracker — use sequence table ONLY, no full member scan ────
    // The MembershipCount table with scopeType='SEQUENCE' is the single source of truth.
    // We do NOT scan all members to compute max sequence here.
    let maxSeq = 100;
    try {
      const seqRecord = await withTimeoutFallback(
        prisma.membershipCount.findFirst({
          where: { scopeType: 'SEQUENCE', scopeId: 'TVK-UP' },
        }),
        TIMEOUT_MS,
        null,
        'sequence tracker'
      );
      if (seqRecord && seqRecord.activeCount > maxSeq) {
        maxSeq = seqRecord.activeCount;
      }
    } catch (seqErr) {
      console.warn('Sequence tracker read error in counter:', seqErr);
    }

    const currentId = `TVK-UP ${maxSeq}`;

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
      currentId,
    });

    // Allow proxy/CDN to cache for 30s, serve stale for 10s while revalidating
    res.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=10');
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
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
        },
      }
    );
  }
}
