import { NextResponse } from 'next/server';
import { getAdminFromRequest, checkAdminScope } from '../../../../../lib/auth';
import { prisma, ensureOfficeBearerTable } from '../../../../../lib/prisma';

export const dynamic = 'force-dynamic';

// GET: Retrieve single office bearer details
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    await ensureOfficeBearerTable();

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Bearer ID required.' }, { status: 400 });
    }

    const bearer = await prisma.officeBearer.findUnique({
      where: { id },
      include: {
        post: true,
      },
    });

    if (!bearer) {
      return NextResponse.json({ error: 'Office bearer not found.' }, { status: 404 });
    }

    // Security Check: Scope verification
    const hasScope = checkAdminScope(admin, {
      stateId: bearer.stateId || undefined,
      districtId: bearer.districtId || undefined,
      assemblyId: bearer.assemblyId || undefined,
    });

    if (!hasScope) {
      return NextResponse.json({ error: 'Forbidden: Office bearer falls outside your administrative scope.' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      bearer,
    });
  } catch (error: any) {
    console.error('Fetch single bearer error:', error);
    return NextResponse.json({ error: 'Failed to retrieve office bearer details.' }, { status: 500 });
  }
}

// PATCH & PUT: Update Office Bearer details (bearerId is strictly immutable)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdate(req, params);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdate(req, params);
}

async function handleUpdate(
  req: Request,
  paramsPromise: Promise<{ id: string }>
) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    await ensureOfficeBearerTable();

    const { id } = await paramsPromise;
    if (!id) {
      return NextResponse.json({ error: 'Bearer ID required.' }, { status: 400 });
    }

    const existingBearer = await prisma.officeBearer.findUnique({
      where: { id },
    });

    if (!existingBearer) {
      return NextResponse.json({ error: 'Office bearer not found.' }, { status: 404 });
    }

    const hasScope = checkAdminScope(admin, {
      stateId: existingBearer.stateId || undefined,
      districtId: existingBearer.districtId || undefined,
      assemblyId: existingBearer.assemblyId || undefined,
    });

    if (!hasScope) {
      return NextResponse.json({ error: 'Forbidden: Office bearer falls outside your administrative scope.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      dob,
      gender,
      address,
      mobile,
      email,
      postId,
      stateId,
      districtId,
      assemblyId,
      photoUrl,
      bio,
      status,
      publicVisibility,
    } = body;

    const updateData: any = {};

    if (name && name.trim().length > 0) updateData.name = name.trim();
    if (mobile !== undefined) updateData.mobile = mobile ? String(mobile).trim() : null;
    if (email !== undefined) updateData.email = email ? String(email).trim() : null;
    if (gender !== undefined) updateData.gender = gender ? String(gender).trim() : null;
    if (address !== undefined) updateData.address = address ? String(address).trim() : null;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl || null;
    if (bio !== undefined) updateData.bio = bio ? String(bio).trim() : null;
    if (status !== undefined) updateData.status = status;
    if (publicVisibility !== undefined) updateData.publicVisibility = publicVisibility;

    if (postId) {
      const post = await prisma.partyPost.findUnique({ where: { id: postId } });
      if (post) updateData.postId = post.id;
    }
    if (stateId !== undefined) updateData.stateId = stateId || null;
    if (districtId !== undefined) updateData.districtId = districtId || null;
    if (assemblyId !== undefined) updateData.assemblyId = assemblyId || null;

    if (dob !== undefined) {
      if (dob) {
        const d = new Date(dob);
        if (!isNaN(d.getTime())) {
          updateData.dob = d;
        }
      } else {
        updateData.dob = null;
      }
    }

    // Ensure bearerId is preserved or backfilled if missing
    if (!existingBearer.bearerId) {
      updateData.bearerId = `TVK-OB-2026-00${existingBearer.id.slice(0, 4).toUpperCase()}`;
    }

    const updatedBearer = await prisma.officeBearer.update({
      where: { id },
      data: updateData,
      include: {
        post: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Office bearer details updated successfully.',
      bearer: updatedBearer,
    });
  } catch (error: any) {
    console.error('Update office bearer error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update office bearer.' },
      { status: 500 }
    );
  }
}

// DELETE: Permanent deletion of Office Bearer
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    await ensureOfficeBearerTable();

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Bearer ID required.' }, { status: 400 });
    }

    const existingBearer = await prisma.officeBearer.findUnique({
      where: { id },
    });

    if (!existingBearer) {
      return NextResponse.json({ error: 'Office bearer not found or already deleted.' }, { status: 404 });
    }

    const hasScope = checkAdminScope(admin, {
      stateId: existingBearer.stateId || undefined,
      districtId: existingBearer.districtId || undefined,
      assemblyId: existingBearer.assemblyId || undefined,
    });

    if (!hasScope) {
      return NextResponse.json({ error: 'Forbidden: Office bearer falls outside your administrative scope.' }, { status: 403 });
    }

    await prisma.officeBearer.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Office bearer ${existingBearer.name} permanently deleted.`,
      deletedBearerId: id,
    });
  } catch (error: any) {
    console.error('Delete office bearer error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete office bearer.' },
      { status: 500 }
    );
  }
}
