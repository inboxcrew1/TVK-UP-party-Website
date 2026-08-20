import { NextResponse } from 'next/server';
import { getAdminFromRequest, hasPermission } from '../../../../../../lib/auth';
import { prisma } from '../../../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await getAdminFromRequest(req);
    if (!admin || !hasPermission(admin, 'manage_cms')) {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges.' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, location, eventDate, imageUrl, districtId, assemblyId, registrationLink, status } = body;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: title || undefined,
        description: description || undefined,
        location: location || undefined,
        eventDate: eventDate ? new Date(eventDate) : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        districtId: districtId !== undefined ? districtId : undefined,
        assemblyId: assemblyId !== undefined ? assemblyId : undefined,
        registrationLink: registrationLink !== undefined ? registrationLink : undefined,
        status: status || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      event: updated,
    });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json({ error: 'Failed to update event.' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await getAdminFromRequest(req);
    if (!admin || !hasPermission(admin, 'manage_cms')) {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges.' }, { status: 403 });
    }

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    await prisma.event.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully.',
    });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json({ error: 'Failed to delete event.' }, { status: 500 });
  }
}
