import { NextResponse } from 'next/server';
import { getAdminFromRequest, hasPermission } from '../../../../../../lib/auth';
import { prisma } from '../../../../../../lib/prisma';

export const dynamic = 'force-dynamic';

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

    const existing = await prisma.galleryAlbum.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Album not found.' }, { status: 404 });
    }

    await prisma.galleryAlbum.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'Album deleted successfully.',
    });
  } catch (error) {
    console.error('Delete album error:', error);
    return NextResponse.json({ error: 'Failed to delete gallery album.' }, { status: 500 });
  }
}
