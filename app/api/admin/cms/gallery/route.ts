import { NextResponse } from 'next/server';
import { getAdminFromRequest, hasPermission } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    const albums = await prisma.galleryAlbum.findMany({
      include: {
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      albums,
    });
  } catch (error) {
    console.error('Admin fetch gallery error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin || !hasPermission(admin, 'manage_cms')) {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges.' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, category, images } = body;

    if (!title || !category) {
      return NextResponse.json({ error: 'Title and category are required.' }, { status: 400 });
    }

    const album = await prisma.galleryAlbum.create({
      data: {
        title,
        description: description || null,
        category,
        images: {
          create: (images || []).map((img: { imageUrl: string; caption?: string; altText?: string }, idx: number) => ({
            imageUrl: img.imageUrl,
            caption: img.caption || null,
            altText: img.altText || null,
            order: idx,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({
      success: true,
      album,
    });
  } catch (error) {
    console.error('Create album error:', error);
    return NextResponse.json({ error: 'Failed to create gallery album.' }, { status: 500 });
  }
}
