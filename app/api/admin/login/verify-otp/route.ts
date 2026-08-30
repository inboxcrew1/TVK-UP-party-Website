import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma, AUTHORIZED_ADMIN_EMAIL } from '../../../../../lib/prisma';
import { comparePassword, signToken, verifyToken } from '../../../../../lib/auth';
import { checkRateLimit, getClientIp } from '../../../../../lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`verify_otp_${ip}`, 10, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please wait 5 minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { preAuthToken, otp } = body;

    if (!preAuthToken) {
      return NextResponse.json(
        { error: 'Missing pre-authentication token. Please log in again.' },
        { status: 400 }
      );
    }

    if (!otp || typeof otp !== 'string' || !/^\d{6}$/.test(otp.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid 6-digit numeric verification code.' },
        { status: 400 }
      );
    }

    const cleanOtp = otp.trim();

    // 1. Verify preAuthToken JWT signature and expiration
    const tokenPayload = verifyToken(preAuthToken);
    if (!tokenPayload || tokenPayload.type !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Authentication challenge expired or invalid. Please sign in again.' },
        { status: 401 }
      );
    }

    // 2. Query active challenge record from database
    const challenges: any[] = await prisma.$queryRawUnsafe(
      `SELECT "id", "email", "otpHash", "expiresAt", "attempts", "verified"
       FROM public."AdminOtpVerification"
       WHERE "preAuthToken" = $1 AND "email" = $2 AND "verified" = false
       ORDER BY "createdAt" DESC LIMIT 1`,
      preAuthToken,
      AUTHORIZED_ADMIN_EMAIL
    );

    if (!challenges || challenges.length === 0) {
      return NextResponse.json(
        { error: 'No active verification challenge found. Please sign in again.' },
        { status: 400 }
      );
    }

    const challenge = challenges[0];

    // 3. Expiration Check
    if (new Date(challenge.expiresAt).getTime() < Date.now()) {
      await prisma.$executeRawUnsafe(
        `DELETE FROM public."AdminOtpVerification" WHERE "id" = $1`,
        challenge.id
      );
      return NextResponse.json(
        { error: 'The verification code has expired. Please sign in again to receive a fresh code.' },
        { status: 400 }
      );
    }

    // 4. Rate-limiting attempts per challenge (Maximum 3 tries)
    if (challenge.attempts >= 3) {
      await prisma.$executeRawUnsafe(
        `DELETE FROM public."AdminOtpVerification" WHERE "id" = $1`,
        challenge.id
      );
      return NextResponse.json(
        { error: 'Too many incorrect attempts. For security reasons, this challenge has been revoked. Please sign in again.' },
        { status: 403 }
      );
    }

    // 5. Verify the OTP against the stored cryptographic hash
    const isOtpValid = await comparePassword(cleanOtp, challenge.otpHash);
    if (!isOtpValid) {
      const remainingAttempts = 3 - (challenge.attempts + 1);
      await prisma.$executeRawUnsafe(
        `UPDATE public."AdminOtpVerification" SET "attempts" = "attempts" + 1 WHERE "id" = $1`,
        challenge.id
      );

      if (remainingAttempts <= 0) {
        await prisma.$executeRawUnsafe(
          `DELETE FROM public."AdminOtpVerification" WHERE "id" = $1`,
          challenge.id
        );
        return NextResponse.json(
          { error: 'Incorrect verification code. Maximum attempts exceeded. Please sign in again.' },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: `Incorrect verification code. ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.` },
        { status: 400 }
      );
    }

    // 6. Security Invalidation: Immediately delete the verified challenge (prevent replay attacks)
    await prisma.$executeRawUnsafe(
      `DELETE FROM public."AdminOtpVerification" WHERE "id" = $1`,
      challenge.id
    );

    // 7. Load verified admin user
    const user = await prisma.user.findUnique({
      where: { email: AUTHORIZED_ADMIN_EMAIL },
      include: {
        adminUser: {
          include: { role: true },
        },
      },
    });

    if (!user || user.status !== 'ACTIVE' || !user.adminUser) {
      return NextResponse.json(
        { error: 'Administrator profile could not be verified.' },
        { status: 401 }
      );
    }

    // 8. Sign authentic administrative session token
    const token = signToken(
      {
        userId: user.id,
        type: 'ADMIN',
      },
      '24h'
    );

    // 9. Issue HTTP-only, secure admin_token cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    console.log(`[SECURITY AUDIT] Two-Factor Authentication successful for ${AUTHORIZED_ADMIN_EMAIL} from IP ${ip}`);

    return NextResponse.json({
      success: true,
      message: 'Authentication successful. Access granted.',
      redirect: '/admin/dashboard',
    });
  } catch (error) {
    console.error('Verify OTP exception:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during OTP verification.' },
      { status: 500 }
    );
  }
}
