import { NextResponse } from 'next/server';
import { getStates } from '../../../../server/geo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const states = await getStates();
    return NextResponse.json(states);
  } catch (error) {
    console.error('API states fetch failed:', error);
    return NextResponse.json({ error: 'Failed to fetch states' }, { status: 500 });
  }
}
