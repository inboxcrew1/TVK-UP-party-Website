import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma, ensureAdminSecurityLockdown, AUTHORIZED_ADMIN_EMAIL } from '../../../../lib/prisma';
import { comparePassword, hashPassword, signToken } from '../../../../lib/auth';
import { checkRateLimit, getClientIp } from '../../../../lib/rateLimit';
import { sendAdminOtpEmail } from '../../../../lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // 1. Ensure high-security lockdown & tables exist
    await ensureAdminSecurityLockdown();

    // 2. Strict Rate Limiting: Max 5 attempts per 10 minutes per IP
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`login_${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. For security reasons, please try again in 10 minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 3. Unbypassable Gateway Hard-Lock: Only AUTHORIZED_ADMIN_EMAIL is permitted
    if (normalizedEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      console.warn(`[SECURITY ALERT] Rejected unauthorized admin login attempt for: ${normalizedEmail} from IP: ${ip}`);
      return NextResponse.json(
        { error: 'Access denied: Unauthorized administrator account.' },
        { status: 403 }
      );
    }

    // 4. Retrieve admin user record
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
        { error: 'Admin account is inactive or not configured.' },
        { status: 401 }
      );
    }

    // 5. Verify primary password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
    }

    // 6. Cryptographically secure 6-digit OTP generation
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await hashPassword(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes TTL

    // 7. Generate temporary 5-minute pre-auth challenge token
    const preAuthToken = signToken(
      {
        userId: user.id,
        role: normalizedEmail,
        type: 'ADMIN',
      },
      '5m'
    );

    // 8. Delete previous active OTP challenges for this email
    try {
      await prisma.$executeRawUnsafe(
        `DELETE FROM public."AdminOtpVerification" WHERE "email" = $1`,
        normalizedEmail
      );
    } catch (e) {
      console.warn('Cleanup error on AdminOtpVerification:', e);
    }

    // 9. Save challenge in database
    const challengeId = crypto.randomUUID();
    await prisma.$executeRawUnsafe(
      `INSERT INTO public."AdminOtpVerification" ("id", "email", "otpHash", "preAuthToken", "expiresAt", "verified", "attempts", "createdAt")
       VALUES ($1, $2, $3, $4, $5, false, 0, NOW())`,
      challengeId,
      normalizedEmail,
      otpHash,
      preAuthToken,
      expiresAt
    );

    // 10. Dispatch OTP via Email to tvkuttarpradesh@gmail.com
    await sendAdminOtpEmail(normalizedEmail, otp);

    // 11. Return response requiring OTP (DO NOT set admin_token cookie!)
    return NextResponse.json({
      success: true,
      requireOtp: true,
      preAuthToken,
      email: normalizedEmail,
      message: `A 6-digit security verification code has been dispatched to ${normalizedEmail}.`,
    });
  } catch (error) {
    console.error('Admin login exception:', error);
    return NextResponse.json(
      { error: 'Authentication service temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
