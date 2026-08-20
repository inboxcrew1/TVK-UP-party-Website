import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        status: 'PUBLISHED',
      },
      orderBy: {
        publishAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      announcements,
    });
  } catch (error) {
    console.error('Fetch published announcements error:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements.' }, { status: 500 });
  }
}
