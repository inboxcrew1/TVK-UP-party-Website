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

    let posts = await prisma.partyPost.findMany({
      orderBy: {
        level: 'asc',
      },
    });

    // If database table is not seeded yet, seed official party posts automatically
    if (posts.length === 0) {
      const defaultPosts = [
        { title: 'State President', scope: 'STATE', level: 1, description: 'Highest state-level post' },
        { title: 'State General Secretary', scope: 'STATE', level: 2, description: 'Key state organizer' },
        { title: 'State Treasurer', scope: 'STATE', level: 2, description: 'Handles state finance' },
        { title: 'District President', scope: 'DISTRICT', level: 3, description: 'District leader' },
        { title: 'District Secretary', scope: 'DISTRICT', level: 4, description: 'District organizer' },
        { title: 'Assembly President', scope: 'ASSEMBLY', level: 5, description: 'Assembly leader' },
      ];

      for (const p of defaultPosts) {
        await prisma.partyPost.upsert({
          where: { title: p.title },
          update: {},
          create: p,
        });
      }

      posts = await prisma.partyPost.findMany({
        orderBy: {
          level: 'asc',
        },
      });
    }

    return NextResponse.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error('Fetch party posts error:', error);
    return NextResponse.json({ error: 'Failed to retrieve party posts.' }, { status: 500 });
  }
}
