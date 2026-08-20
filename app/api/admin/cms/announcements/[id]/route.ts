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
    const { title, content, category, imageUrl, status, publishAt } = body;

    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Announcement not found.' }, { status: 404 });
    }

    const updated = await prisma.announcement.update({
      where: { id },
      data: {
        title: title || undefined,
        content: content || undefined,
        category: category || undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        status: status || undefined,
        publishAt: publishAt ? new Date(publishAt) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      announcement: updated,
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    return NextResponse.json({ error: 'Failed to update announcement.' }, { status: 500 });
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

    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Announcement not found.' }, { status: 404 });
    }

    await prisma.announcement.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'Announcement deleted successfully.',
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    return NextResponse.json({ error: 'Failed to delete announcement.' }, { status: 500 });
  }
}
