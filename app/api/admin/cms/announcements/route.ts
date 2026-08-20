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

    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      announcements,
    });
  } catch (error) {
    console.error('Admin fetch announcements error:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin || !hasPermission(admin, 'manage_cms')) {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges.' }, { status: 403 });
    }

    const body = await req.json();
    const { title, content, category, imageUrl, status, publishAt } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Title, content, and category are required.' }, { status: 400 });
    }

    // Generate unique slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const announcement = await prisma.announcement.create({
      data: {
        title,
        slug,
        content,
        category,
        imageUrl: imageUrl || null,
        author: admin.name || 'Admin',
        status: status || 'DRAFT',
        publishAt: publishAt ? new Date(publishAt) : new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      announcement,
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    return NextResponse.json({ error: 'Failed to create announcement.' }, { status: 500 });
  }
}
