import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { hashPassword, comparePassword, signToken, verifyToken } from '../lib/auth';
import { sendOtp, verifyOtp } from '../lib/otp';
import { prisma } from '../lib/prisma';

describe('Security & Auth Unit Tests', () => {
  it('should securely hash and verify passwords', async () => {
    const rawPass = 'Secret@123';
    const hashed = await hashPassword(rawPass);

    expect(hashed).not.toBe(rawPass);
    expect(hashed.length).toBeGreaterThan(30);

    const match = await comparePassword(rawPass, hashed);
    expect(match).toBe(true);

    const fail = await comparePassword('WrongPassword', hashed);
    expect(fail).toBe(false);
  });

  it('should sign and verify JWT tokens', () => {
    const payload = { userId: 'test-user-id', role: 'SUPER_ADMIN', type: 'ADMIN' as const };
    const token = signToken(payload, '1h');

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.role).toBe(payload.role);
    expect(decoded?.type).toBe(payload.type);

    const badToken = verifyToken('invalid-token-string');
    expect(badToken).toBeNull();
  });
});

describe('OTP Verification System Tests', () => {
  const testMobile = '+919999999999';

  beforeAll(async () => {
    // Cleanup any existing test OTPs
    await prisma.otpVerification.deleteMany({
      where: { mobile: testMobile },
    });
  });

  afterAll(async () => {
    await prisma.otpVerification.deleteMany({
      where: { mobile: testMobile },
    });
  });

  it('should send and verify an OTP', async () => {
    const sendResult = await sendOtp(testMobile);
    expect(sendResult.success).toBe(true);
    expect(sendResult.otp).toBeDefined(); // available in dev mode

    const otpVal = sendResult.otp!;

    // Verify correct OTP
    const verifyResult = await verifyOtp(testMobile, otpVal);
    expect(verifyResult.success).toBe(true);
  });

  it('should enforce 60-second rate limiting on sending OTPs', async () => {
    // Clean up first to reset rate limits
    await prisma.otpVerification.deleteMany({ where: { mobile: testMobile } });

    // Send first OTP
    const send1 = await sendOtp(testMobile);
    expect(send1.success).toBe(true);

    // Try immediately sending a second OTP (should fail)
    const send2 = await sendOtp(testMobile);
    expect(send2.success).toBe(false);
    expect(send2.message).toContain('Please wait 60 seconds');
  });

  it('should reject incorrect OTPs and increment attempts count', async () => {
    // Delete past OTPs to start fresh
    await prisma.otpVerification.deleteMany({ where: { mobile: testMobile } });

    // Send a new OTP
    const send = await sendOtp(testMobile);
    const correctOtp = send.otp!;

    // Try verifying with incorrect OTP
    const badVerify = await verifyOtp(testMobile, '000000');
    expect(badVerify.success).toBe(false);
    expect(badVerify.message).toContain('Incorrect OTP');

    // Verify it fails with attempts limit on successive wrong attempts
    await verifyOtp(testMobile, '000000');
    await verifyOtp(testMobile, '000000');

    // 4th verification attempt should report attempts exceeded or invalid
    const fourthVerify = await verifyOtp(testMobile, correctOtp);
    expect(fourthVerify.success).toBe(false);
    expect(fourthVerify.message).toContain('Too many failed attempts');
  });
});
