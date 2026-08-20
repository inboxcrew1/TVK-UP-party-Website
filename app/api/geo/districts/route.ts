import { NextResponse } from 'next/server';
import { getDistricts } from '../../../../server/geo';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const stateId = searchParams.get('stateId');
    
    if (!stateId) {
      return NextResponse.json({ error: 'stateId query parameter is required' }, { status: 400 });
    }
    
    const districts = await getDistricts(stateId);
    return NextResponse.json(districts);
  } catch (error) {
    console.error('API districts fetch failed:', error);
    return NextResponse.json({ error: 'Failed to fetch districts' }, { status: 500 });
  }
}
