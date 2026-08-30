import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma, AUTHORIZED_ADMIN_EMAIL } from '../../../../../lib/prisma';
import { hashPassword, verifyToken } from '../../../../../lib/auth';
import { checkRateLimit, getClientIp } from '../../../../../lib/rateLimit';
import { sendAdminOtpEmail } from '../../../../../lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const body = await req.json();
    const { preAuthToken } = body;

    if (!preAuthToken) {
      return NextResponse.json({ error: 'Missing pre-authentication session.' }, { status: 400 });
    }

    // 1. Verify token signature and claims
    const tokenPayload = verifyToken(preAuthToken);
    if (!tokenPayload || tokenPayload.type !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Verification session expired or invalid. Please sign in again.' },
        { status: 401 }
      );
    }

    // 2. Rate limit resend requests (strictly 1 request per 60 seconds)
    const rateCheck = checkRateLimit(`resend_otp_${AUTHORIZED_ADMIN_EMAIL}`, 1, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Please wait 60 seconds before requesting another code.' },
        { status: 429 }
      );
    }

    // 3. Generate fresh 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await hashPassword(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes TTL

    // 4. Update or replace challenge in database
    await prisma.$executeRawUnsafe(
      `DELETE FROM public."AdminOtpVerification" WHERE "email" = $1`,
      AUTHORIZED_ADMIN_EMAIL
    );

    const challengeId = crypto.randomUUID();
    await prisma.$executeRawUnsafe(
      `INSERT INTO public."AdminOtpVerification" ("id", "email", "otpHash", "preAuthToken", "expiresAt", "verified", "attempts", "createdAt")
       VALUES ($1, $2, $3, $4, $5, false, 0, NOW())`,
      challengeId,
      AUTHORIZED_ADMIN_EMAIL,
      otpHash,
      preAuthToken,
      expiresAt
    );

    // 5. Dispatch email
    await sendAdminOtpEmail(AUTHORIZED_ADMIN_EMAIL, otp);

    return NextResponse.json({
      success: true,
      message: `A new 6-digit verification code has been dispatched to ${AUTHORIZED_ADMIN_EMAIL}.`,
    });
  } catch (error) {
    console.error('Resend OTP exception:', error);
    return NextResponse.json(
      { error: 'Unable to resend verification code. Please try again.' },
      { status: 500 }
    );
  }
}
