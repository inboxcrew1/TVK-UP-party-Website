import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { queueNotification, NotificationType } from '../../../../lib/notifications';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      include: {
        logs: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    const body = await req.json();
    const { recipient, type, template, payload } = body;

    if (!recipient || !type || !template) {
      return NextResponse.json({ error: 'Recipient, type, and template are required.' }, { status: 400 });
    }

    const notification = await queueNotification({
      recipient,
      type: type as NotificationType,
      template,
      payload: payload || {},
    });

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error('Enqueue notification error:', error);
    return NextResponse.json({ error: 'Failed to enqueue notification.' }, { status: 500 });
  }
}
