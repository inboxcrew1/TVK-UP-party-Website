import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '../../../../../../lib/auth';
import { prisma } from '../../../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Member ID required.' }, { status: 400 });
    }

    const member = await prisma.member.findUnique({
      where: { id },
      select: { photoUrl: true },
    });

    if (!member || !member.photoUrl) {
      return NextResponse.redirect(new URL('/media/leadership.jpg', req.url));
    }

    const photo = member.photoUrl;

    // If it's a relative or external URL, redirect directly
    if (photo.startsWith('/') || photo.startsWith('http://') || photo.startsWith('https://')) {
      return NextResponse.redirect(new URL(photo, req.url));
    }

    // If it's a base64 data URI (data:image/jpeg;base64,...)
    const matches = photo.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (matches) {
      const mimeSubtype = matches[1].toLowerCase();
      const contentType = mimeSubtype === 'png' ? 'image/png' : mimeSubtype === 'webp' ? 'image/webp' : 'image/jpeg';
      const buffer = Buffer.from(matches[2], 'base64');

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        },
      });
    }

    // Fallback redirect
    return NextResponse.redirect(new URL('/media/leadership.jpg', req.url));
  } catch (error) {
    console.error('Member photo fetch error:', error);
    return NextResponse.redirect(new URL('/media/leadership.jpg', req.url));
  }
}
