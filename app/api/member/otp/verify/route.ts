import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { verifyOtp } from '../../../../../lib/otp';
import { prisma } from '../../../../../lib/prisma';
import { signToken } from '../../../../../lib/auth';

const SESSION_SECRET = process.env.SESSION_SECRET || 'your-default-session-secret-at-least-32-chars';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { mobile, code } = await req.json();

    if (!mobile || !code) {
      return NextResponse.json({ error: 'Mobile and OTP code are required' }, { status: 400 });
    }

    // Verify OTP
    const verifyResult = await verifyOtp(mobile, code);
    if (!verifyResult.success) {
      return NextResponse.json({ error: verifyResult.message }, { status: 400 });
    }

    // Check if member already exists
    const member = await prisma.member.findUnique({
      where: { mobile },
    });

    const cookieStore = await cookies();

    if (member) {
      // Existing member -> Log in directly
      const token = signToken({
        userId: member.id,
        type: 'MEMBER',
      });

      cookieStore.set('member_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      // Clear any registration tokens
      cookieStore.delete('registration_token');

      return NextResponse.json({
        success: true,
        authenticated: true,
        member: {
          id: member.id,
          fullName: member.fullName,
          membershipId: member.membershipId,
          status: member.status,
        },
      });
    } else {
      // New member -> Create temporary registration token
      const registrationToken = jwt.sign(
        { mobile, verified: true },
        SESSION_SECRET,
        { expiresIn: '15m' }
      );

      cookieStore.set('registration_token', registrationToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60, // 15 minutes
      });

      return NextResponse.json({
        success: true,
        authenticated: false,
        mobile,
        message: 'OTP verified. Please proceed to registration.',
      });
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    const msg = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
