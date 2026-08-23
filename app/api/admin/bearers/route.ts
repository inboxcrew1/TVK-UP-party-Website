import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getAdminFromRequest, checkAdminScope, AdminScopeItem } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    const whereClause: Prisma.OfficeBearerWhereInput = {};

    if (admin.role === 'STATE_ADMIN') {
      const stateIds = (admin.scopes || []).map((s: AdminScopeItem) => s.stateId).filter((id): id is string => !!id);
      whereClause.stateId = { in: stateIds };
    } else if (admin.role === 'DISTRICT_ADMIN') {
      const districtIds = (admin.scopes || []).map((s: AdminScopeItem) => s.districtId).filter((id): id is string => !!id);
      whereClause.districtId = { in: districtIds };
    } else if (admin.role === 'ASSEMBLY_ADMIN') {
      const assemblyIds = (admin.scopes || []).map((s: AdminScopeItem) => s.assemblyId).filter((id): id is string => !!id);
      whereClause.assemblyId = { in: assemblyIds };
    } else if (admin.role !== 'SUPER_ADMIN' && admin.role !== 'NATIONAL_ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Scoped role configuration missing.' }, { status: 403 });
    }

    const bearers = await prisma.officeBearer.findMany({
      where: whereClause,
      include: {
        post: true,
      },
      orderBy: {
        appointmentDate: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      bearers,
    });
  } catch (error) {
    console.error('Fetch office bearers error:', error);
    return NextResponse.json({ error: 'Failed to retrieve office bearers.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      postId,
      stateId,
      districtId,
      assemblyId,
      bio,
      email,
      mobile,
      photoUrl,
      publicVisibility,
    } = body;

    if (!name || !postId) {
      return NextResponse.json({ error: 'Name and Post ID are required' }, { status: 400 });
    }

    // 1. Resolve Post (by ID, Title, or fallback)
    let post = await prisma.partyPost.findUnique({
      where: { id: postId },
    });
    if (!post) {
      post = await prisma.partyPost.findFirst({
        where: { title: postId },
      });
    }
    if (!post) {
      const defaultTitle = typeof postId === 'string' && postId.trim().length > 2 ? postId.trim() : 'State President';
      post = await prisma.partyPost.create({
        data: {
          title: defaultTitle,
          scope: 'STATE',
          level: 1,
        },
      });
    }

    // 2. Resolve State if stateId is missing or 'state-up'
    let resolvedStateId = stateId || null;
    let resolvedDistrictId = districtId || null;
    let resolvedAssemblyId = assemblyId || null;

    if (resolvedStateId === 'state-up' || (!resolvedStateId && post.scope === 'STATE')) {
      let upState = await prisma.state.findFirst({ where: { code: 'UP' } });
      if (!upState) {
        upState = await prisma.state.create({ data: { name: 'Uttar Pradesh', code: 'UP' } });
      }
      resolvedStateId = upState.id;
    }

    // 3. Security Check: Admin must have scope over targets
    const hasScope = checkAdminScope(admin, {
      stateId: post.scope === 'STATE' || post.scope === 'DISTRICT' || post.scope === 'ASSEMBLY' ? (resolvedStateId ?? undefined) : undefined,
      districtId: post.scope === 'DISTRICT' || post.scope === 'ASSEMBLY' ? (resolvedDistrictId ?? undefined) : undefined,
      assemblyId: post.scope === 'ASSEMBLY' ? (resolvedAssemblyId ?? undefined) : undefined,
    });

    if (!hasScope) {
      return NextResponse.json(
        { error: 'Forbidden: Appointing location falls outside your administrative scope.' },
        { status: 403 }
      );
    }

    const bearer = await prisma.officeBearer.create({
      data: {
        name: name.trim(),
        postId: post.id,
        stateId: resolvedStateId,
        districtId: resolvedDistrictId,
        assemblyId: resolvedAssemblyId,
        bio: bio ? String(bio).trim() : null,
        email: email ? String(email).trim() : null,
        mobile: mobile ? String(mobile).trim() : null,
        photoUrl: photoUrl || null,
        publicVisibility: publicVisibility !== false,
      },
      include: {
        post: true,
      },
    });

    return NextResponse.json({
      success: true,
      bearer,
    });
  } catch (error: any) {
    console.error('Appoint office bearer error:', error);
    const errorDetail = error?.message || 'Database error occurred';
    return NextResponse.json({ error: `Failed to appoint office bearer: ${errorDetail}` }, { status: 500 });
  }
}
