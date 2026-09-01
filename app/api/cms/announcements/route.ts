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
      announcements: announcements || [],
    });
  } catch (error) {
    console.warn('Fetch published announcements fallback:', error);
    return NextResponse.json({ success: true, announcements: [] });
  }
}
