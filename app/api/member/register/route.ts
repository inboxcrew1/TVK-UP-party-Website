import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { submitApplication, DuplicateMemberError } from '../../../../server/membership';
import { signToken } from '../../../../lib/auth';

const SESSION_SECRET = process.env.SESSION_SECRET || 'your-default-session-secret-at-least-32-chars';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const regToken = cookieStore.get('registration_token')?.value;

    if (!regToken) {
      return NextResponse.json({ error: 'Mobile number not verified. Please request an OTP first.' }, { status: 401 });
    }

    interface RegTokenPayload {
      mobile: string;
      verified: boolean;
    }

    let decoded: RegTokenPayload;
    try {
      decoded = jwt.verify(regToken, SESSION_SECRET) as RegTokenPayload;
    } catch {
      return NextResponse.json({ error: 'Verification token expired or invalid. Please verify OTP again.' }, { status: 401 });
    }

    const { mobile } = decoded;
    if (!mobile) {
      return NextResponse.json({ error: 'Invalid verification session.' }, { status: 401 });
    }

    const body = await req.json();

    // Submit registration using our validated membership engine
    const member = await submitApplication({
      ...body,
      mobile, // Enforce the pre-verified mobile number from the JWT token
    });

    // Establish logged in session for the new member
    const sessionToken = signToken({
      userId: member.id,
      type: 'MEMBER',
    });

    cookieStore.set('member_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // Clear registration token
    cookieStore.delete('registration_token');

    return NextResponse.json({
      success: true,
      member: {
        id: member.id,
        fullName: member.fullName,
        membershipId: member.membershipId,
        status: member.status,
      },
    });
  } catch (error) {
    if (error instanceof DuplicateMemberError) {
      return NextResponse.json({
        error: 'DUPLICATE MEMBER DETECTED',
        membershipId: error.existingMembershipId,
        status: error.existingStatus,
        message: `A member with this information is already registered (Membership ID: ${error.existingMembershipId || 'PENDING'}, Status: ${error.existingStatus}).`,
      }, { status: 400 });
    }

    console.error('Registration API error:', error);
    const msg = error instanceof Error ? error.message : 'Registration failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
