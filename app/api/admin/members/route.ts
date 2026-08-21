import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getAdminFromRequest } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    // Build filter based on admin scopes
    const baseScope: Prisma.MemberWhereInput = {};

    if (admin.role === 'STATE_ADMIN') {
      const stateIds = (admin.scopes || []).map((s) => s.stateId).filter((id): id is string => !!id);
      if (stateIds.length > 0) baseScope.stateId = { in: stateIds };
    } else if (admin.role === 'DISTRICT_ADMIN') {
      const districtIds = (admin.scopes || []).map((s) => s.districtId).filter((id): id is string => !!id);
      if (districtIds.length > 0) baseScope.districtId = { in: districtIds };
    } else if (admin.role === 'ASSEMBLY_ADMIN') {
      const assemblyIds = (admin.scopes || []).map((s) => s.assemblyId).filter((id): id is string => !!id);
      if (assemblyIds.length > 0) baseScope.assemblyId = { in: assemblyIds };
    } else if (admin.role !== 'SUPER_ADMIN' && admin.role !== 'NATIONAL_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Scoped role configuration missing.' }, { status: 403 });
    }

    // Extract search and filter query params
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const whereClause: Prisma.MemberWhereInput = { ...baseScope };

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (search) {
      const cleanSearch = search.trim();
      whereClause.OR = [
        { fullName: { contains: cleanSearch, mode: 'insensitive' } },
        { mobile: { contains: cleanSearch, mode: 'insensitive' } },
        { email: { contains: cleanSearch, mode: 'insensitive' } },
        { membershipId: { contains: cleanSearch, mode: 'insensitive' } },
      ];
    }

    // 1. Fetch Member rows
    const members = await prisma.member.findMany({
      where: whereClause,
      include: {
        district: true,
        assembly: true,
      },
      orderBy: { joiningDate: 'desc' },
    });

    // 2. Fetch authoritative database statistics using a single PgBouncer-safe groupBy query
    let totalCount = 0;
    let activeCount = 0;
    let pendingCount = 0;
    let rejectedCount = 0;
    let suspendedCount = 0;

    try {
      const statusGroups = await prisma.member.groupBy({
        by: ['status'],
        where: baseScope,
        _count: { _all: true },
      });

      statusGroups.forEach((g) => {
        const c = g._count._all;
        totalCount += c;
        const st = (g.status || '').toUpperCase();
        if (st === 'ACTIVE') {
          activeCount += c;
        } else if (st === 'SUBMITTED' || st === 'UNDER_REVIEW' || st === 'PENDING_OTP') {
          pendingCount += c;
        } else if (st === 'REJECTED') {
          rejectedCount += c;
        } else if (st === 'SUSPENDED') {
          suspendedCount += c;
        }
      });
    } catch (countErr) {
      console.error('Error grouping member stats in admin API:', countErr);
      totalCount = members.length;
      activeCount = members.filter((m) => m.status === 'ACTIVE').length;
      pendingCount = members.filter(
        (m) => m.status === 'SUBMITTED' || m.status === 'UNDER_REVIEW' || m.status === 'PENDING_OTP'
      ).length;
      rejectedCount = members.filter((m) => m.status === 'REJECTED').length;
      suspendedCount = members.filter((m) => m.status === 'SUSPENDED').length;
    }

    // Sanitize members before sending to frontend client
    const sanitizedMembers = members.map((m) => {
      return {
        id: m.id,
        fullName: m.fullName,
        dob: m.dob,
        gender: m.gender,
        mobile: m.mobile,
        email: m.email,
        photoUrl: m.photoUrl,
        membershipId: m.membershipId,
        status: m.status,
        joiningDate: m.joiningDate,
        approvedAt: m.approvedAt,
        district: m.district,
        assembly: m.assembly,
        documents: [],
      };
    });

    return NextResponse.json({
      success: true,
      members: sanitizedMembers,
      stats: {
        total: totalCount,
        active: activeCount,
        pending: pendingCount,
        rejected: rejectedCount,
        suspended: suspendedCount,
      },
    });
  } catch (error) {
    console.error('Admin members fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve members list.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
