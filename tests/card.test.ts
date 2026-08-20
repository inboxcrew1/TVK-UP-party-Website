import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../lib/prisma';
import { submitApplication, approveMember, RegisterInput } from '../server/membership';
import { generateMemberCard } from '../lib/card';

describe('ID Card & QR Code Generation Integration Tests', () => {
  let stateId = '';
  let districtId = '';
  let assemblyId = '';
  let testMemberId = '';

  const testMobile = '+916666666666';
  const testEmail = 'cardtest@example.com';
  const testAadhaar = '888877776666';

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

    // Clean up
    await cleanup();

    // Create and approve a member to active status
    const input: RegisterInput = {
      fullName: 'Vikram Singh',
      dob: new Date('1988-08-08'),
      gender: 'MALE',
      mobile: testMobile,
      email: testEmail,
      photoUrl: 'https://example.com/photos/vikram.jpg',
      stateId,
      districtId,
      assemblyId,
      membershipType: 'ACTIVE_PARTNER',
      address: '789, Saket Colony, Bulandshahr',
      pincode: '203001',
      documentType: 'Aadhaar',
      documentNo: testAadhaar,
      fileUrl: 'https://example.com/docs/aadhaar.pdf',
      termsAccepted: true,
      privacyAccepted: true,
      marketingOptIn: true,
    };

    const member = await submitApplication(input);
    const approved = await approveMember(member.id, 'admin-uuid');
    testMemberId = approved.id;
  });

  afterAll(async () => {
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
  }

  it('should successfully generate a PDF ID card buffer and QR code data URL', async () => {
    const result = await generateMemberCard(testMemberId);

    expect(result).toBeDefined();
    expect(result.pdfBuffer).toBeInstanceOf(Buffer);
    expect(result.pdfBuffer.length).toBeGreaterThan(5000); // PDF should be at least 5KB

    expect(result.qrCodeDataUrl).toBeDefined();
    expect(result.qrCodeDataUrl).toMatch(/^data:image\/png;base64,/);
  });

  it('should throw an error if the member does not exist', async () => {
    await expect(generateMemberCard('non-existent-member-uuid')).rejects.toThrow('Member not found');
  });

  it('should throw an error if the member is not approved/active yet (no membership ID)', async () => {
    // Create a new pending member
    const pendingInput: RegisterInput = {
      fullName: 'Pending Card User',
      dob: new Date('1992-12-12'),
      gender: 'FEMALE',
      mobile: '+916666666660',
      email: 'pendingcard@example.com',
      photoUrl: 'https://example.com/photos/pending.jpg',
      stateId,
      districtId,
      assemblyId,
      membershipType: 'ORDINARY',
      address: '12, G.T. Road, Bulandshahr',
      pincode: '203001',
      documentType: 'Passport',
      documentNo: 'Z1234567',
      fileUrl: 'https://example.com/docs/passport.pdf',
      termsAccepted: true,
      privacyAccepted: true,
      marketingOptIn: false,
    };

    const pendingMember = await submitApplication(pendingInput);

    // Call generateMemberCard on pending member (should fail because membership ID is null)
    await expect(generateMemberCard(pendingMember.id)).rejects.toThrow('Member has no membership ID assigned yet');

    // Cleanup pending member
    await prisma.membershipStatusHistory.deleteMany({ where: { memberId: pendingMember.id } });
    await prisma.memberDocument.deleteMany({ where: { memberId: pendingMember.id } });
    await prisma.memberAddress.deleteMany({ where: { memberId: pendingMember.id } });
    await prisma.consent.deleteMany({ where: { memberId: pendingMember.id } });
    await prisma.member.deleteMany({ where: { id: pendingMember.id } });
  });
});
