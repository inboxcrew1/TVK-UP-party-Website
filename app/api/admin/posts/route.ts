import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    const posts = await prisma.partyPost.findMany({
      orderBy: {
        level: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error('Fetch party posts error:', error);
    return NextResponse.json({ error: 'Failed to retrieve party posts.' }, { status: 500 });
  }
}
