import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

function calculateAge(dobVal: Date | string | null | undefined): string {
  if (!dobVal) return '26';
  const d = typeof dobVal === 'string' ? new Date(dobVal) : dobVal;
  if (isNaN(d.getTime())) return '26';
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
    age--;
  }
  return age > 0 ? String(age) : '26';
}

async function performSearch(membershipId?: string | null, phone?: string | null, query?: string | null) {
  let cleanId = (membershipId || '').trim();
  let cleanPhone = (phone || '').trim().replace(/[^0-9]/g, '');

  if (query) {
    const q = query.trim();
    if (/^\d{10}$/.test(q)) {
      cleanPhone = q;
    } else if (/^TVK/i.test(q) || /\d+/.test(q)) {
      cleanId = q;
    } else {
      cleanId = q;
    }
  }

  if (!cleanId && !cleanPhone) {
    return {
      error: 'Membership ID or registered mobile number is required.',
      status: 400,
    };
  }

  const whereOr: any[] = [];

  if (cleanId) {
    const formattedWithSpace = cleanId.toUpperCase();
    const formattedNoSpace = cleanId.toUpperCase().replace(/\s+/g, '');
    const formattedHyphen = cleanId.toUpperCase().replace(/\s+/g, '-');

    whereOr.push(
      { membershipId: { equals: formattedWithSpace, mode: 'insensitive' } },
      { membershipId: { equals: formattedNoSpace, mode: 'insensitive' } },
      { membershipId: { equals: formattedHyphen, mode: 'insensitive' } },
      { fullName: { contains: cleanId, mode: 'insensitive' } }
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
    return {
      success: false,
      error: 'No membership record found matching the provided details.',
      cards: [],
      members: [],
      status: 404,
    };
  }

  const cards = members
    .filter((m) => !!m.membershipId)
    .map((m) => {
      const seqNum = parseInt(m.membershipId!.replace(/\D/g, '') || '100', 10);
      const isoDob = m.dob ? m.dob.toISOString().split('T')[0] : '1998-08-15';
      const computedAge = calculateAge(m.dob);

      return {
        id: m.id,
        membershipNumber: m.membershipId!,
        membershipId: m.membershipId!,
        counterNumber: seqNum,
        fullName: m.fullName,
        phone: m.mobile,
        mobile: m.mobile,
        email: m.email || 'N/A',
        gender: m.gender || 'Male',
        dob: isoDob,
        age: computedAge,
        govtIdType: 'Aadhaar Card',
        govtIdNumber: 'XXXX-XXXX-XXXX',
        photoPreview: m.photoUrl || '/media/thalapathy_vijay_watermark.jpg',
        districtName: m.district?.name || 'Lucknow',
        assemblyName: m.assembly?.name || 'Lucknow Central',
        stateName: 'Uttar Pradesh',
        addressLine: `${m.assembly?.name || 'Central Assembly'}, ${m.district?.name || 'Lucknow'}`,
        status: m.status,
        joinedAt: new Date(m.joiningDate).toLocaleDateString('en-IN'),
        smsConfirmation: `[TVK-UP Confirmed] Membership Verified: ${m.membershipId} for ${m.fullName}.`,
      };
    });

  return {
    success: true,
    cards,
    members: cards,
    status: 200,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const membershipId = searchParams.get('membershipId');
    const phone = searchParams.get('phone');
    const query = searchParams.get('query');

    const result = await performSearch(membershipId, phone, query);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result, { status: result.status });
  } catch (err) {
    console.error('Member search GET API error:', err);
    return NextResponse.json(
      { error: 'An error occurred while searching for member records.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { membershipId, phone, query } = body;

    const result = await performSearch(membershipId, phone, query);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result, { status: result.status });
  } catch (err) {
    console.error('Member search POST API error:', err);
    return NextResponse.json(
      { error: 'An error occurred while searching for member records.' },
      { status: 500 }
    );
  }
}
