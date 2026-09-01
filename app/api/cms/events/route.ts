import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {

    const { searchParams } = new URL(req.url);
    const districtId = searchParams.get('districtId');

    // Filter by district if specified, or return all published events
    const whereClause: { status: string; districtId?: string } = {
      status: 'PUBLISHED',
    };
    if (districtId) {
      whereClause.districtId = districtId;
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: {
        eventDate: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      events: events || [],
    });
  } catch (error) {
    console.warn('Fetch published events fallback:', error);
    return NextResponse.json({ success: true, events: [] });
  }
}
