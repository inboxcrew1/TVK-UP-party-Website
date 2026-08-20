import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getConstituenciesByDistrict } from '../../../../lib/upConstituencies';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, dob, gender, age, govtIdType, govtIdNumber, photoPreview, stateName, districtName, assemblyName, referralCode } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and Mobile Number are required.' }, { status: 400 });
    }

    const dist = districtName || 'Bulandshahr';
    const ass = assemblyName || '065 - Sikandrabad';

    // 1. SERVER-SIDE DISTRICT -> ASSEMBLY HIERARCHY VALIDATION
    const validAssemblies = getConstituenciesByDistrict(dist);
    const isValidAssembly = validAssemblies.some((a) => a.toLowerCase().includes(ass.toLowerCase()) || ass.toLowerCase().includes(a.toLowerCase()));
    
    if (!isValidAssembly && validAssemblies.length > 0) {
      return NextResponse.json(
        { error: `Security Error: Assembly "${ass}" does not belong to district "${dist}".` },
        { status: 400 }
      );
    }

    // 2. ATOMIC DATABASE TRANSACTION & UNIQUE MEMBERSHIP ID GENERATION
    const result = await prisma.$transaction(async (tx) => {
      // Find or verify State, District, Assembly records in Master Data
      let stateObj = await tx.state.findFirst({ where: { code: 'UP' } });
      if (!stateObj) {
        stateObj = await tx.state.create({
          data: { name: 'Uttar Pradesh', code: 'UP' },
        });
      }

      let distObj = await tx.district.findFirst({
        where: { name: dist },
      });
      if (!distObj) {
        distObj = await tx.district.create({
          data: { name: dist, stateId: stateObj.id },
        });
      }

      let assObj = await tx.assembly.findFirst({
        where: { name: ass },
      });
      if (!assObj) {
        assObj = await tx.assembly.create({
          data: { name: ass, districtId: distObj.id },
        });
      }

      // Calculate next sequential membership number based on active database count
      const activeCount = await tx.member.count({ where: { status: 'ACTIVE' } });
      const nextSeqNumber = 100 + activeCount + 1;
      const formattedId = `TVK-UP ${nextSeqNumber}`;

      // Create Member record
      const member = await tx.member.create({
        data: {
          membershipId: formattedId,
          fullName: name,
          mobile: phone,
          email: email || undefined,
          gender: gender || 'Male',
          dob: dob ? new Date(dob) : new Date(1998, 0, 1),
          photoUrl: photoPreview || '/media/thalapathy_vijay_watermark.jpg',
          stateId: stateObj.id,
          districtId: distObj.id,
          assemblyId: assObj.id,
          status: 'ACTIVE',
        },
      });

      return { member, formattedId, nextSeqNumber, totalCount: activeCount + 1 };
    });

    const smsMessage = `[TVK-UP SMS Confirmed] Congratulations ${name}! Your TVK membership is active. Your official ID is: ${result.formattedId}. Welcome to TVK!`;

    return NextResponse.json({
      success: true,
      membershipNumber: result.formattedId,
      counterNumber: result.nextSeqNumber,
      totalCount: result.totalCount,
      fullName: name,
      phone: phone,
      email: email || 'N/A',
      gender: gender || 'Male',
      age: age || '25',
      govtIdType: govtIdType || 'Aadhaar Card',
      govtIdNumber: govtIdNumber || 'XXXX-XXXX-XXXX',
      photoPreview: photoPreview || '/media/thalapathy_vijay_watermark.jpg',
      stateName: stateName || 'Uttar Pradesh',
      districtName: dist,
      assemblyName: ass,
      joinedAt: new Date().toLocaleDateString('en-IN'),
      smsConfirmation: smsMessage,
    });
  } catch (err) {
    console.error('Direct member registration error:', err);
    return NextResponse.json(
      { error: 'An unexpected database registration error occurred.' },
      { status: 500 }
    );
  }
}
