import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getAdminFromRequest } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { decrypt, maskDocumentNumber } from '../../../../lib/security';

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
      const stateIds = admin.scopes.map((s) => s.stateId).filter((id): id is string => !!id);
      baseScope.stateId = { in: stateIds };
    } else if (admin.role === 'DISTRICT_ADMIN') {
      const districtIds = admin.scopes.map((s) => s.districtId).filter((id): id is string => !!id);
      baseScope.districtId = { in: districtIds };
    } else if (admin.role === 'ASSEMBLY_ADMIN') {
      const assemblyIds = admin.scopes.map((s) => s.assemblyId).filter((id): id is string => !!id);
      baseScope.assemblyId = { in: assemblyIds };
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
        documents: true,
      },
      orderBy: { joiningDate: 'desc' },
    });

    // 2. Fetch authoritative database statistics
    const [totalCount, activeCount, pendingCount, rejectedCount, suspendedCount] = await Promise.all([
      prisma.member.count({ where: baseScope }),
      prisma.member.count({ where: { ...baseScope, status: 'ACTIVE' } }),
      prisma.member.count({
        where: {
          ...baseScope,
          status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'PENDING_OTP'] },
        },
      }),
      prisma.member.count({ where: { ...baseScope, status: 'REJECTED' } }),
      prisma.member.count({ where: { ...baseScope, status: 'SUSPENDED' } }),
    ]);

    // Mask sensitive documents before sending to frontend client
    const sanitizedMembers = members.map((m) => {
      const sanitizedDocs = m.documents.map((doc) => {
        let decNo = 'DECRYPTION_ERROR';
        try {
          decNo = decrypt(doc.documentNo);
        } catch (err) {
          console.error('Failed to decrypt doc no:', err);
        }
        return {
          id: doc.id,
          documentType: doc.documentType,
          documentNo: maskDocumentNumber(decNo),
          fileUrl: doc.fileUrl,
        };
      });

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
        documents: sanitizedDocs,
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
    return NextResponse.json({ error: 'Failed to retrieve members list.' }, { status: 500 });
  }
}
