import { prisma } from './prisma';

const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 3;

export interface OtpSendResult {
  success: boolean;
  message: string;
  otp?: string; // Only returned in development mode for easy verification testing
}

export async function sendOtp(mobile: string): Promise<OtpSendResult> {
  // Normalize mobile number (remove spaces, etc. - assume +91 and 10 digits)
  const normalizedMobile = mobile.trim().replace(/\s+/g, '');
  if (!/^\+91\d{10}$/.test(normalizedMobile)) {
    return { success: false, message: 'Invalid mobile number format. Must start with +91 followed by 10 digits.' };
  }

  // Check rate limiting: prevent sending OTP if one was sent in the last 60 seconds
  const lastOtp = await prisma.otpVerification.findFirst({
    where: {
      mobile: normalizedMobile,
      createdAt: {
        gte: new Date(Date.now() - 60000), // 60 seconds ago
      },
    },
  });

  if (lastOtp) {
    return { success: false, message: 'Please wait 60 seconds before requesting another OTP.' };
  }

  // Generate 6-digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Store in database
  await prisma.otpVerification.create({
    data: {
      mobile: normalizedMobile,
      otp,
      expiresAt,
    },
  });

  const provider = process.env.OTP_PROVIDER || 'development';
  if (provider === 'development') {
    // Log OTP for development
    console.log(`[SMS OTP DEV] Sent OTP: ${otp} to Mobile: ${normalizedMobile}`);
    return {
      success: true,
      message: `OTP sent successfully (Development mode: OTP is ${otp}).`,
      otp,
    };
  }

  // In production, we would integrate the SMS API key and send the SMS here
  console.log(`[SMS OTP PROD] Simulating SMS OTP delivery using SMS API Key`);
  return { success: true, message: 'OTP sent successfully to your mobile number.' };
}

export interface OtpVerifyResult {
  success: boolean;
  message: string;
}

export async function verifyOtp(mobile: string, otpCode: string): Promise<OtpVerifyResult> {
  const normalizedMobile = mobile.trim().replace(/\s+/g, '');
  const cleanOtp = otpCode.trim();

  // Find the latest unverified OTP for this mobile number
  const verification = await prisma.otpVerification.findFirst({
    where: {
      mobile: normalizedMobile,
      verified: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!verification) {
    return { success: false, message: 'No OTP verification request found for this mobile number.' };
  }

  // Check expiration
  if (new Date() > verification.expiresAt) {
    return { success: false, message: 'OTP has expired. Please request a new one.' };
  }

  // Check attempts limit
  if (verification.attempts >= MAX_OTP_ATTEMPTS) {
    return { success: false, message: 'Too many failed attempts. Please request a new OTP.' };
  }

  // Validate OTP
  if (verification.otp !== cleanOtp) {
    // Increment attempts
    await prisma.otpVerification.update({
      where: { id: verification.id },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });
    return { success: false, message: 'Incorrect OTP. Please try again.' };
  }

  // Mark as verified
  await prisma.otpVerification.update({
    where: { id: verification.id },
    data: {
      verified: true,
    },
  });

  return { success: true, message: 'OTP verified successfully.' };
}
