import { NextResponse } from 'next/server';
import { sendOtp } from '../../../../../lib/otp';
import { prisma } from '../../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { mobile } = await req.json();

    if (!mobile || !/^\+91\d{10}$/.test(mobile)) {
      return NextResponse.json({ error: 'Invalid Indian mobile number (+91XXXXXXXXXX)' }, { status: 400 });
    }

    // Check if member already exists
    const existingMember = await prisma.member.findUnique({
      where: { mobile },
    });

    // Send OTP
    const otpResult = await sendOtp(mobile);
    if (!otpResult.success) {
      return NextResponse.json({ error: otpResult.message }, { status: 429 });
    }

    return NextResponse.json({
      success: true,
      exists: !!existingMember,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    const msg = error instanceof Error ? error.message : 'Failed to send OTP';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
