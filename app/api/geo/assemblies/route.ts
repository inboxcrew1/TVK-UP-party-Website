import { NextResponse } from 'next/server';
import { getAssemblies } from '../../../../server/geo';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const districtId = searchParams.get('districtId');
    
    if (!districtId) {
      return NextResponse.json({ error: 'districtId query parameter is required' }, { status: 400 });
    }
    
    const assemblies = await getAssemblies(districtId);
    return NextResponse.json(assemblies);
  } catch (error) {
    console.error('API assemblies fetch failed:', error);
    return NextResponse.json({ error: 'Failed to fetch assemblies' }, { status: 500 });
  }
}
