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

    const events = await prisma.event.findMany({
      orderBy: { eventDate: 'desc' },
    });

    return NextResponse.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error('Admin fetch events error:', error);
    return NextResponse.json({ error: 'Failed to fetch events.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin || !hasPermission(admin, 'manage_cms')) {
      return NextResponse.json({ error: 'Forbidden: Insufficient privileges.' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, location, eventDate, imageUrl, districtId, assemblyId, registrationLink, status } = body;

    if (!title || !description || !location || !eventDate) {
      return NextResponse.json({ error: 'Title, description, location, and eventDate are required.' }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        location,
        eventDate: new Date(eventDate),
        imageUrl: imageUrl || null,
        districtId: districtId || null,
        assemblyId: assemblyId || null,
        registrationLink: registrationLink || null,
        status: status || 'DRAFT',
      },
    });

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json({ error: 'Failed to create event.' }, { status: 500 });
  }
}
