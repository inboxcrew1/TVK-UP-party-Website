import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getConstituenciesByDistrict } from '../../../../lib/upConstituencies';
import { invalidateMemberStatsCache } from '../../../../server/memberStats';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      email,
      dob,
      gender,
      age,
      govtIdType,
      govtIdNumber,
      photoPreview,
      stateName,
      districtName,
      assemblyName,
      consentGiven,
      consentTimestamp,
      consentLanguage,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    }

    const cleanPhone = (phone || '').trim().replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json({ error: 'Valid 10-digit mobile number is required.' }, { status: 400 });
    }

    const dist = districtName || 'Bulandshahr';
    const ass = assemblyName || '065 - Sikandrabad';

    // 1. SERVER-SIDE DISTRICT -> ASSEMBLY HIERARCHY VALIDATION
    const validAssemblies = getConstituenciesByDistrict(dist);
    const isValidAssembly = validAssemblies.some(
      (a) => a.toLowerCase().includes(ass.toLowerCase()) || ass.toLowerCase().includes(a.toLowerCase())
    );

    if (!isValidAssembly && validAssemblies.length > 0) {
      return NextResponse.json(
        { error: `Security Error: Assembly "${ass}" does not belong to district "${dist}".` },
        { status: 400 }
      );
    }

    // 2. CHECK IF THIS EXACT MEMBER (NAME + MOBILE) IS ALREADY REGISTERED
    const existingMember = await prisma.member.findFirst({
      where: {
        mobile: cleanPhone,
        fullName: { equals: name.trim(), mode: 'insensitive' },
      },
    });

    if (existingMember && existingMember.membershipId) {
      const totalCount = await prisma.member.count({ where: { status: 'ACTIVE' } });
      const seqNum = parseInt(existingMember.membershipId.replace(/\D/g, '') || '100', 10);
      return NextResponse.json({
        success: true,
        membershipNumber: existingMember.membershipId,
        counterNumber: seqNum,
        totalCount,
        fullName: existingMember.fullName,
        phone: cleanPhone,
        email: existingMember.email || email || 'N/A',
        gender: existingMember.gender || gender || 'Male',
        age: age || '26',
        govtIdType: govtIdType || 'Aadhaar Card',
        govtIdNumber: govtIdNumber || 'XXXX-XXXX-XXXX',
        photoPreview: existingMember.photoUrl || photoPreview || '/media/thalapathy_vijay_watermark.jpg',
        stateName: stateName || 'Uttar Pradesh',
        districtName: dist,
        assemblyName: ass,
        joinedAt: new Date(existingMember.joiningDate).toLocaleDateString('en-IN'),
        consentGiven: consentGiven ?? true,
        consentTimestamp: consentTimestamp || new Date().toISOString(),
        consentLanguage: consentLanguage || 'EN',
        smsConfirmation: `[TVK-UP SMS Confirmed] Welcome back ${name}! Your official ID is: ${existingMember.membershipId}.`,
        isExisting: true,
      });
    }

    // 3. RESOLVE STATE, DISTRICT, ASSEMBLY IN MASTER DATA
    let stateObj = await prisma.state.findFirst({ where: { code: 'UP' } });
    if (!stateObj) {
      stateObj = await prisma.state.create({
        data: { name: 'Uttar Pradesh', code: 'UP' },
      });
    }

    let distObj = await prisma.district.findFirst({
      where: { name: { equals: dist, mode: 'insensitive' } },
    });
    if (!distObj) {
      distObj = await prisma.district.create({
        data: { name: dist, stateId: stateObj.id },
      });
    }

    let assObj = await prisma.assembly.findFirst({
      where: {
        name: { equals: ass, mode: 'insensitive' },
        districtId: distObj.id,
      },
    });
    if (!assObj) {
      assObj = await prisma.assembly.findFirst({
        where: { districtId: distObj.id },
      });
    }
    if (!assObj) {
      assObj = await prisma.assembly.create({
        data: { name: ass, districtId: distObj.id },
      });
    }

    // 4. CALCULATE NEXT SEQUENTIAL MEMBERSHIP NUMBER FROM DATABASE SINGLE SOURCE OF TRUTH
    const existingMembersWithId = await prisma.member.findMany({
      where: { membershipId: { not: null } },
      select: { membershipId: true },
    });

    let maxSeq = 100;
    for (const m of existingMembersWithId) {
      if (m.membershipId) {
        const num = parseInt(m.membershipId.replace(/\D/g, ''), 10);
        if (!isNaN(num) && num > maxSeq) {
          maxSeq = num;
        }
      }
    }

    let member: any = null;
    let nextSeqNumber = maxSeq + 1;
    let formattedId = `TVK-UP ${nextSeqNumber}`;
    let isExisting = false;

    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        member = await prisma.member.create({
          data: {
            membershipId: formattedId,
            fullName: name.trim(),
            mobile: cleanPhone,
            email: email ? email.trim() : undefined,
            gender: gender || 'Male',
            dob: dob ? new Date(dob) : new Date(1998, 0, 1),
            photoUrl: photoPreview || '/media/thalapathy_vijay_watermark.jpg',
            stateId: stateObj.id,
            districtId: distObj.id,
            assemblyId: assObj.id,
            status: 'ACTIVE',
          },
        });
        break;
      } catch (createErr: any) {
        if (createErr?.code === 'P2002') {
          const target = createErr?.meta?.target;
          const targetStr = Array.isArray(target) ? target.join(',') : String(target || '');
          const msg = String(createErr?.message || '');

          // Check if collision was on mobile
          if (targetStr.includes('mobile') || msg.includes('mobile')) {
            const existingForMobile = await prisma.member.findFirst({
              where: { mobile: cleanPhone },
            });
            return NextResponse.json(
              {
                error: `यह मोबाइल नंबर पहले से पंजीकृत है (सदस्यता ID: ${existingForMobile?.membershipId || 'अज्ञात'})। कृपया 'खोजें / डाउनलोड' टैब में अपना कार्ड देखें। (This mobile number is already registered with Membership ID: ${existingForMobile?.membershipId || 'N/A'}).`,
                existingMembershipId: existingForMobile?.membershipId,
              },
              { status: 400 }
            );
          }

          // Otherwise, it was a concurrent collision on membershipId -> increment and retry next ID
          if (attempt < 4) {
            nextSeqNumber += 1;
            formattedId = `TVK-UP ${nextSeqNumber}`;
            continue;
          }
        }

        console.error('Member create failed:', createErr);
        return NextResponse.json(
          { error: `Registration error: ${createErr?.message || 'Database error'}` },
          { status: 500 }
        );
      }
    }

    const activeCount = await prisma.member.count({ where: { status: 'ACTIVE' } });

    // Invalidate stats cache so all public counters update in real time
    invalidateMemberStatsCache();

    const smsMessage = `[TVK-UP SMS Confirmed] Congratulations ${name}! Your TVK membership is active. Your official ID is: ${formattedId}. Welcome to TVK!`;

    return NextResponse.json({
      success: true,
      membershipNumber: formattedId,
      counterNumber: nextSeqNumber,
      totalCount: activeCount,
      fullName: name.trim(),
      phone: cleanPhone,
      email: email || 'N/A',
      gender: gender || 'Male',
      age: age || '26',
      govtIdType: govtIdType || 'Aadhaar Card',
      govtIdNumber: govtIdNumber || 'XXXX-XXXX-XXXX',
      photoPreview: photoPreview || '/media/thalapathy_vijay_watermark.jpg',
      stateName: stateName || 'Uttar Pradesh',
      districtName: dist,
      assemblyName: ass,
      joinedAt: new Date().toLocaleDateString('en-IN'),
      consentGiven: consentGiven ?? true,
      consentTimestamp: consentTimestamp || new Date().toISOString(),
      consentLanguage: consentLanguage || 'EN',
      smsConfirmation: smsMessage,
      isExisting,
    });
  } catch (err: any) {
    console.error('Direct member registration error:', err);
    return NextResponse.json(
      { error: `Registration error: ${err?.message || String(err)}` },
      { status: 500 }
    );
  }
}
