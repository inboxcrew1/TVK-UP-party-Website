import { NextResponse } from 'next/server';
import { prisma, ensureCmsTables } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureCmsTables();

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
