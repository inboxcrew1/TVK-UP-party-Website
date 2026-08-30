import { NextResponse } from 'next/server';
import { getDistricts, getStates } from '../../../../server/geo';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let stateId = searchParams.get('stateId');

    if (!stateId) {
      const states = await getStates();
      stateId = states[0]?.id || 'state-up';
    }

    const districts = await getDistricts(stateId);
    return NextResponse.json({
      success: true,
      districts,
      stateId,
    });
  } catch (error) {
    console.error('API districts fetch failed:', error);
    return NextResponse.json({ error: 'Failed to fetch districts' }, { status: 500 });
  }
}
