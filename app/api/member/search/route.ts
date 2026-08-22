import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { membershipId, phone } = body;

    const cleanId = (membershipId || '').trim();
    const cleanPhone = (phone || '').trim().replace(/[^0-9]/g, '');

    if (!cleanId && !cleanPhone) {
      return NextResponse.json(
        { error: 'Membership ID or registered mobile number is required.' },
        { status: 400 }
      );
    }

    const whereOr: any[] = [];

    if (cleanId) {
      const formattedWithSpace = cleanId.toUpperCase();
      const formattedNoSpace = cleanId.toUpperCase().replace(/\s+/g, '');
      const formattedHyphen = cleanId.toUpperCase().replace(/\s+/g, '-');

      whereOr.push(
        { membershipId: { equals: formattedWithSpace, mode: 'insensitive' } },
        { membershipId: { equals: formattedNoSpace, mode: 'insensitive' } },
        { membershipId: { equals: formattedHyphen, mode: 'insensitive' } }
      );
    }

    if (cleanPhone && cleanPhone.length >= 10) {
      whereOr.push({ mobile: { contains: cleanPhone.slice(-10) } });
    }

    const members = await prisma.member.findMany({
      where: {
        OR: whereOr,
      },
      include: {
        district: true,
        assembly: true,
      },
      orderBy: { joiningDate: 'desc' },
      take: 10,
    });

    if (!members || members.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No membership record found matching the provided details.',
          cards: [],
        },
        { status: 404 }
      );
    }

    const cards = members.map((m, idx) => {
      const seqNum = parseInt((m.membershipId || '').replace(/\D/g, '') || '100', 10);
      return {
        membershipNumber: m.membershipId || `TVK-UP ${100 + idx}`,
        counterNumber: seqNum,
        fullName: m.fullName,
        phone: m.mobile,
        email: m.email || 'N/A',
        gender: m.gender || 'Male',
        age: '25',
        govtIdType: 'Aadhaar Card',
        govtIdNumber: 'XXXX-XXXX-XXXX',
        photoPreview: m.photoUrl || '/media/thalapathy_vijay_watermark.jpg',
        districtName: m.district?.name || 'Lucknow',
        assemblyName: m.assembly?.name || 'Lucknow Central',
        stateName: 'Uttar Pradesh',
        addressLine: `${m.assembly?.name || 'Central Assembly'}, ${m.district?.name || 'Lucknow'}`,
        status: m.status,
        joinedAt: new Date(m.joiningDate).toLocaleDateString('en-IN'),
        smsConfirmation: `[TVK-UP Confirmed] Membership Verified: ${m.membershipId || 'TVK-UP 100'} for ${m.fullName}.`,
      };
    });

    return NextResponse.json({
      success: true,
      cards,
    });
  } catch (err) {
    console.error('Member search API error:', err);
    return NextResponse.json(
      { error: 'An error occurred while searching for member records.' },
      { status: 500 }
    );
  }
}
