import { NextResponse } from 'next/server';
import { getMemberFromRequest } from '../../../../lib/auth';
import { generateMemberCard } from '../../../../lib/card';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const member = await getMemberFromRequest(req);

    if (!member) {
      return NextResponse.json({ error: 'Unauthorized session. Please log in.' }, { status: 401 });
    }

    if (member.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Your membership is not active yet.' }, { status: 403 });
    }

    // Generate member card
    const card = await generateMemberCard(member.id);

    return new NextResponse(new Uint8Array(card.pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="TVK-Member-Card-${member.membershipId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Download card API error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to generate ID card';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
