import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getAdminFromRequest } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';

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
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

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

    // Fetch all members for export, selecting only fields needed for spreadsheet
    const members = await prisma.member.findMany({
      where: whereClause,
      select: {
        id: true,
        membershipId: true,
        fullName: true,
        mobile: true,
        email: true,
        gender: true,
        dob: true,
        status: true,
        joiningDate: true,
        approvedAt: true,
        photoUrl: true,
        district: { select: { name: true } },
        assembly: { select: { name: true } },
      },
      orderBy: { joiningDate: 'desc' },
    });

    const exportRows = members.map((m, idx) => ({
      sNo: idx + 1,
      membershipId: m.membershipId || 'PENDING',
      fullName: m.fullName,
      mobile: m.mobile,
      email: m.email || 'N/A',
      gender: m.gender,
      dob: m.dob ? new Date(m.dob).toLocaleDateString('en-IN') : 'N/A',
      district: m.district?.name || 'N/A',
      assembly: m.assembly?.name || 'N/A',
      status: m.status,
      joiningDate: m.joiningDate ? new Date(m.joiningDate).toLocaleDateString('en-IN') : 'N/A',
      approvedAt: m.approvedAt ? new Date(m.approvedAt).toLocaleDateString('en-IN') : 'N/A',
      photoUrl: m.photoUrl?.startsWith('data:') ? 'Embedded Base64 Photo' : (m.photoUrl || 'Not Uploaded'),
    }));

    return NextResponse.json({
      success: true,
      rows: exportRows,
      totalCount: exportRows.length,
    });
  } catch (error) {
    console.error('Admin members export error:', error);
    return NextResponse.json({ error: 'Failed to export members.' }, { status: 500 });
  }
}
