import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '../../../../../lib/auth';
import { processPendingQueue } from '../../../../../lib/notifications';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    const result = await processPendingQueue(50);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Process notifications queue error:', error);
    return NextResponse.json({ error: 'Failed to process notification queue.' }, { status: 500 });
  }
}
