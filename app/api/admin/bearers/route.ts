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
      const stateIds = admin.scopes.map((s: AdminScopeItem) => s.stateId).filter((id): id is string => !!id);
      whereClause.stateId = { in: stateIds };
    } else if (admin.role === 'DISTRICT_ADMIN') {
      const districtIds = admin.scopes.map((s: AdminScopeItem) => s.districtId).filter((id): id is string => !!id);
      whereClause.districtId = { in: districtIds };
    } else if (admin.role === 'ASSEMBLY_ADMIN') {
      const assemblyIds = admin.scopes.map((s: AdminScopeItem) => s.assemblyId).filter((id): id is string => !!id);
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

    // 1. Verify Post
    const post = await prisma.partyPost.findUnique({
      where: { id: postId },
    });
    if (!post) {
      return NextResponse.json({ error: 'Party post not found' }, { status: 404 });
    }

    // 2. Validate region targets based on post scope
    if (post.scope === 'STATE' && !stateId) {
      return NextResponse.json({ error: 'State ID is required for State scope posts' }, { status: 400 });
    }
    if (post.scope === 'DISTRICT' && !districtId) {
      return NextResponse.json({ error: 'District ID is required for District scope posts' }, { status: 400 });
    }
    if (post.scope === 'ASSEMBLY' && !assemblyId) {
      return NextResponse.json({ error: 'Assembly ID is required for Assembly scope posts' }, { status: 400 });
    }

    // 3. Security Check: Admin must have scope over targets
    const hasScope = checkAdminScope(admin, {
      stateId: post.scope === 'STATE' || post.scope === 'DISTRICT' || post.scope === 'ASSEMBLY' ? (stateId ?? undefined) : undefined,
      districtId: post.scope === 'DISTRICT' || post.scope === 'ASSEMBLY' ? (districtId ?? undefined) : undefined,
      assemblyId: post.scope === 'ASSEMBLY' ? (assemblyId ?? undefined) : undefined,
    });

    if (!hasScope) {
      return NextResponse.json(
        { error: 'Forbidden: Appointing location falls outside your administrative scope.' },
        { status: 403 }
      );
    }

    const bearer = await prisma.officeBearer.create({
      data: {
        name,
        postId,
        stateId: post.scope === 'STATE' || post.scope === 'DISTRICT' || post.scope === 'ASSEMBLY' ? stateId : null,
        districtId: post.scope === 'DISTRICT' || post.scope === 'ASSEMBLY' ? districtId : null,
        assemblyId: post.scope === 'ASSEMBLY' ? assemblyId : null,
        bio: bio || null,
        email: email || null,
        mobile: mobile || null,
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
  } catch (error) {
    console.error('Appoint office bearer error:', error);
    return NextResponse.json({ error: 'Failed to appoint office bearer.' }, { status: 500 });
  }
}
