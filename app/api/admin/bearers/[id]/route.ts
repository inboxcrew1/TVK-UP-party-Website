import { NextResponse } from 'next/server';
import { getAdminFromRequest, checkAdminScope } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    // Retrieve bearer to verify scope
    const bearer = await prisma.officeBearer.findUnique({
      where: { id },
    });

    if (!bearer) {
      return NextResponse.json({ error: 'Office bearer not found.' }, { status: 404 });
    }

    // Scope verification
    const hasScope = checkAdminScope(admin, {
      stateId: bearer.stateId ?? undefined,
      districtId: bearer.districtId ?? undefined,
      assemblyId: bearer.assemblyId ?? undefined,
    });

    if (!hasScope) {
      return NextResponse.json(
        { error: 'Forbidden: Office bearer falls outside your administrative scope.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, bio, email, mobile, publicVisibility, status } = body;

    const updated = await prisma.officeBearer.update({
      where: { id },
      data: {
        name: name || undefined,
        bio: bio !== undefined ? bio : undefined,
        email: email !== undefined ? email : undefined,
        mobile: mobile !== undefined ? mobile : undefined,
        publicVisibility: publicVisibility !== undefined ? publicVisibility : undefined,
        status: status || undefined,
      },
      include: {
        post: true,
      },
    });

    return NextResponse.json({
      success: true,
      bearer: updated,
    });
  } catch (error) {
    console.error('Update office bearer error:', error);
    return NextResponse.json({ error: 'Failed to update office bearer.' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    const bearer = await prisma.officeBearer.findUnique({
      where: { id },
    });

    if (!bearer) {
      return NextResponse.json({ error: 'Office bearer not found.' }, { status: 404 });
    }

    // Scope verification
    const hasScope = checkAdminScope(admin, {
      stateId: bearer.stateId ?? undefined,
      districtId: bearer.districtId ?? undefined,
      assemblyId: bearer.assemblyId ?? undefined,
    });

    if (!hasScope) {
      return NextResponse.json(
        { error: 'Forbidden: Office bearer falls outside your administrative scope.' },
        { status: 403 }
      );
    }

    await prisma.officeBearer.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Office bearer removed successfully.',
    });
  } catch (error) {
    console.error('Delete office bearer error:', error);
    return NextResponse.json({ error: 'Failed to delete office bearer.' }, { status: 500 });
  }
}
