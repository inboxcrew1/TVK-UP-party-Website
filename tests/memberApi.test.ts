import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { prisma } from '../lib/prisma';

// Mock cookies storage for next/headers
let mockCookiesStore: Record<string, string> = {};

vi.mock('next/headers', () => {
  return {
    cookies: () => ({
      get: (name: string) => {
        const val = mockCookiesStore[name];
        return val ? { name, value: val } : undefined;
      },
      set: (name: string, value: string) => {
        mockCookiesStore[name] = value;
      },
      delete: (name: string) => {
        delete mockCookiesStore[name];
      },
    }),
  };
});

// Import route handlers
import { POST as sendOtpHandler } from '../app/api/member/otp/send/route';
import { POST as verifyOtpHandler } from '../app/api/member/otp/verify/route';
import { POST as registerHandler } from '../app/api/member/register/route';
import { GET as profileHandler } from '../app/api/member/profile/route';
import { GET as cardHandler } from '../app/api/member/card/route';

describe('Member API Route Endpoints Integration Tests', () => {
  let stateId = '';
  let districtId = '';
  let assemblyId = '';

  const testMobile = '+915555555555';
  const testEmail = 'api_member@example.com';
  const testAadhaar = '555544443333';

  beforeAll(async () => {
    // Fetch seed info
    const state = await prisma.state.findUnique({ where: { code: 'UP' } });
    if (!state) throw new Error('State seed missing');
    stateId = state.id;

    const district = await prisma.district.findFirst({ where: { stateId: state.id, name: 'Bulandshahr' } });
    if (!district) throw new Error('District seed missing');
    districtId = district.id;

    const assembly = await prisma.assembly.findFirst({ where: { districtId: district.id, name: 'Bulandshahr' } });
    if (!assembly) throw new Error('Assembly seed missing');
    assemblyId = assembly.id;

    mockCookiesStore = {};
    await cleanup();
  });

  afterAll(async () => {
    mockCookiesStore = {};
    await cleanup();
  });

  async function cleanup() {
    const members = await prisma.member.findMany({
      where: { mobile: testMobile },
    });
    const ids = members.map((m) => m.id);

    await prisma.membershipStatusHistory.deleteMany({ where: { memberId: { in: ids } } });
    await prisma.memberDocument.deleteMany({ where: { memberId: { in: ids } } });
    await prisma.memberAddress.deleteMany({ where: { memberId: { in: ids } } });
    await prisma.consent.deleteMany({ where: { memberId: { in: ids } } });
    await prisma.idCard.deleteMany({ where: { memberId: { in: ids } } });
    await prisma.member.deleteMany({ where: { id: { in: ids } } });

    // Clean up otp records matching testMobile
    await prisma.otpVerification.deleteMany({ where: { mobile: testMobile } });
  }

  it('should flow through the register API request cycle successfully', async () => {
    // 1. Send OTP
    const reqSend = new Request('http://localhost/api/member/otp/send', {
      method: 'POST',
      body: JSON.stringify({ mobile: testMobile }),
    });
    const resSend = await sendOtpHandler(reqSend);
    expect(resSend.status).toBe(200);

    const bodySend = await resSend.json();
    expect(bodySend.success).toBe(true);
    expect(bodySend.exists).toBe(false);

    // Retrieve generated OTP from DB
    const otpRec = await prisma.otpVerification.findFirst({
      where: { mobile: testMobile },
      orderBy: { createdAt: 'desc' },
    });
    expect(otpRec).not.toBeNull();
    const code = otpRec!.otp;

    // 2. Verify OTP
    const reqVerify = new Request('http://localhost/api/member/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ mobile: testMobile, code }),
    });
    const resVerify = await verifyOtpHandler(reqVerify);
    expect(resVerify.status).toBe(200);

    const bodyVerify = await resVerify.json();
    expect(bodyVerify.success).toBe(true);
    expect(bodyVerify.authenticated).toBe(false);
    expect(mockCookiesStore['registration_token']).toBeDefined();

    // 3. Register
    const regBody = {
      fullName: 'Vikrant Roy',
      dob: new Date('1994-04-04'),
      gender: 'MALE',
      email: testEmail,
      photoUrl: 'https://example.com/photos/vikrant.jpg',
      stateId,
      districtId,
      assemblyId,
      address: '124, Kavi Nagar, Bulandshahr',
      pincode: '203001',
      documentType: 'Aadhaar',
      documentNo: testAadhaar,
      fileUrl: 'https://example.com/docs/aadhaar.pdf',
      termsAccepted: true,
      privacyAccepted: true,
      marketingOptIn: false,
    };

    const reqRegister = new Request('http://localhost/api/member/register', {
      method: 'POST',
      body: JSON.stringify(regBody),
    });
    const resRegister = await registerHandler(reqRegister);
    expect(resRegister.status).toBe(200);

    const bodyRegister = await resRegister.json();
    expect(bodyRegister.success).toBe(true);
    expect(bodyRegister.member.status).toBe('SUBMITTED');
    expect(mockCookiesStore['member_token']).toBeDefined();
    expect(mockCookiesStore['registration_token']).toBeUndefined(); // Should be deleted

    // 4. Fetch Profile
    const reqProfile = new Request('http://localhost/api/member/profile', {
      method: 'GET',
      headers: {
        'Cookie': `member_token=${mockCookiesStore['member_token']}`,
      },
    });
    const resProfile = await profileHandler(reqProfile);
    expect(resProfile.status).toBe(200);

    const bodyProfile = await resProfile.json();
    expect(bodyProfile.success).toBe(true);
    expect(bodyProfile.member.fullName).toBe('Vikrant Roy');
    // Aadhaar number must be masked!
    expect(bodyProfile.member.documents[0].documentNo).toBe('XXXX-XXXX-3333');

    // 5. Try downloading card (should fail as member is still SUBMITTED, not ACTIVE)
    const reqCard = new Request('http://localhost/api/member/card', {
      method: 'GET',
      headers: {
        'Cookie': `member_token=${mockCookiesStore['member_token']}`,
      },
    });
    const resCard = await cardHandler(reqCard);
    expect(resCard.status).toBe(403);

    // 6. Force approve member to ACTIVE in DB to test successful card download
    const dbMember = await prisma.member.findUnique({
      where: { mobile: testMobile },
    });
    await prisma.member.update({
      where: { id: dbMember!.id },
      data: { status: 'ACTIVE', membershipId: 'TVK-UP-12345678' },
    });

    // Try downloading card again (should succeed)
    const reqCardSuccess = new Request('http://localhost/api/member/card', {
      method: 'GET',
      headers: {
        'Cookie': `member_token=${mockCookiesStore['member_token']}`,
      },
    });
    const resCardSuccess = await cardHandler(reqCardSuccess);
    expect(resCardSuccess.status).toBe(200);
    expect(resCardSuccess.headers.get('Content-Type')).toBe('application/pdf');

    const cardBuffer = await resCardSuccess.arrayBuffer();
    expect(cardBuffer.byteLength).toBeGreaterThan(5000);
  });
});
