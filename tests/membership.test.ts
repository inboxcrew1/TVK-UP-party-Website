import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../lib/prisma';
import {
  submitApplication,
  approveMember,
  rejectMember,
  suspendMember,
  reactivateMember,
  DuplicateMemberError,
  RegisterInput,
} from '../server/membership';

describe('Membership Engine Registration and Status Transition Tests', () => {
  let stateId = '';
  let districtId = '';
  let assemblyId = '';

  const testMobile = '+918888888888';
  const testEmail = 'testmember@example.com';
  const testAadhaar = '123456789012';

  beforeAll(async () => {
    // Retrieve seeded IDs
    const state = await prisma.state.findUnique({ where: { code: 'UP' } });
    if (!state) throw new Error('State seed missing');
    stateId = state.id;

    const district = await prisma.district.findFirst({ where: { stateId: state.id, name: 'Bulandshahr' } });
    if (!district) throw new Error('District seed missing');
    districtId = district.id;

    const assembly = await prisma.assembly.findFirst({ where: { districtId: district.id, name: 'Bulandshahr' } });
    if (!assembly) throw new Error('Assembly seed missing');
    assemblyId = assembly.id;

    // Cleanup any existing test members
    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
  });

  async function cleanup() {
    // Delete status history, documents, addresses first due to constraints
    const testMobiles = [testMobile, '+918888888889', '+918888888800'];
    const members = await prisma.member.findMany({
      where: { mobile: { in: testMobiles } },
    });
    const ids = members.map((m) => m.id);

    await prisma.membershipStatusHistory.deleteMany({ where: { memberId: { in: ids } } });
    await prisma.memberDocument.deleteMany({ where: { memberId: { in: ids } } });
    await prisma.memberAddress.deleteMany({ where: { memberId: { in: ids } } });
    await prisma.consent.deleteMany({ where: { memberId: { in: ids } } });
    await prisma.idCard.deleteMany({ where: { memberId: { in: ids } } });
    await prisma.member.deleteMany({ where: { id: { in: ids } } });

    // Clean up sequence counts
    await prisma.membershipCount.deleteMany({
      where: { scopeType: 'SEQUENCE', scopeId: 'TVK-UP' },
    });
  }

  const getBaseInput = (mobile = testMobile, email = testEmail, docNo = testAadhaar): RegisterInput => ({
    fullName: 'Rahul Sharma',
    dob: new Date('1995-05-15'),
    gender: 'MALE',
    mobile,
    email,
    photoUrl: 'https://example.com/photos/rahul.jpg',
    stateId,
    districtId,
    assemblyId,
    membershipType: 'ORDINARY',
    address: '123, Civil Lines, Bulandshahr',
    pincode: '203001',
    documentType: 'Aadhaar',
    documentNo: docNo,
    fileUrl: 'https://example.com/docs/aadhaar.pdf',
    termsAccepted: true,
    privacyAccepted: true,
    marketingOptIn: false,
  });

  it('should successfully submit a valid membership application', async () => {
    const input = getBaseInput();
    const member = await submitApplication(input);

    expect(member).toBeDefined();
    expect(member.status).toBe('SUBMITTED');
    expect(member.fullName).toBe('Rahul Sharma');
    expect(member.addresses.length).toBe(1);
    expect(member.documents.length).toBe(1);

    const history = await prisma.membershipStatusHistory.findFirst({
      where: { memberId: member.id },
    });
    expect(history).not.toBeNull();
    expect(history?.newStatus).toBe('SUBMITTED');
  });

  it('should reject applications if the applicant is under 18 years old', async () => {
    const underAgeInput = getBaseInput('+918888888889', 'young@example.com', '999988887777');
    // Set DOB to 10 years ago
    underAgeInput.dob = new Date(new Date().getFullYear() - 10, 1, 1);

    await expect(submitApplication(underAgeInput)).rejects.toThrow('Member must be at least 18 years old');
  });

  it('should detect duplicate members by mobile, email, and document number', async () => {
    // Attempt duplicate mobile
    const dupMobileInput = getBaseInput(testMobile, 'diffemail@example.com', '999988887777');
    await expect(submitApplication(dupMobileInput)).rejects.toThrow(DuplicateMemberError);

    // Attempt duplicate email
    const dupEmailInput = getBaseInput('+918888888889', testEmail, '999988887777');
    await expect(submitApplication(dupEmailInput)).rejects.toThrow(DuplicateMemberError);

    // Attempt duplicate Aadhaar
    const dupDocInput = getBaseInput('+918888888889', 'diffemail@example.com', testAadhaar);
    await expect(submitApplication(dupDocInput)).rejects.toThrow(DuplicateMemberError);
  });

  it('should approve a member and generate sequential transaction-safe Membership IDs', async () => {
    // Fetch submitted member
    const member = await prisma.member.findUnique({
      where: { mobile: testMobile },
    });
    expect(member).not.toBeNull();

    // Approve member
    const approved = await approveMember(member!.id, 'admin-user-uuid');
    expect(approved.status).toBe('ACTIVE');
    expect(approved.membershipId).toMatch(/^TVK-UP-\d{8}$/);

    const num1 = parseInt(approved.membershipId!.replace('TVK-UP-', ''), 10);

    // Create another member to test sequence increment
    const input2 = getBaseInput('+918888888800', 'rahul2@example.com', '111122223333');
    const member2 = await submitApplication(input2);

    const approved2 = await approveMember(member2.id, 'admin-user-uuid');
    expect(approved2.status).toBe('ACTIVE');
    expect(approved2.membershipId).toMatch(/^TVK-UP-\d{8}$/);

    const num2 = parseInt(approved2.membershipId!.replace('TVK-UP-', ''), 10);
    expect(num2).toBe(num1 + 1);
  });

  it('should support rejection, suspension, and reactivation state flows', async () => {
    // Create new member
    const input = getBaseInput('+918888888889', 'rahul3@example.com', '444455556666');
    const member = await submitApplication(input);

    // Reject member
    const rejected = await rejectMember(member.id, 'admin-uuid', 'Document not clear');
    expect(rejected.status).toBe('REJECTED');

    const historyReject = await prisma.membershipStatusHistory.findFirst({
      where: { memberId: member.id, newStatus: 'REJECTED' },
    });
    expect(historyReject?.reason).toBe('Document not clear');

    // Approve the first member (already approved to ACTIVE in previous test)
    const activeMember = await prisma.member.findUnique({
      where: { mobile: testMobile },
    });
    expect(activeMember?.status).toBe('ACTIVE');

    // Suspend active member
    const suspended = await suspendMember(activeMember!.id, 'admin-uuid', 'Violation of party rules');
    expect(suspended.status).toBe('SUSPENDED');

    // Reactivate suspended member
    const reactivated = await reactivateMember(activeMember!.id, 'admin-uuid');
    expect(reactivated.status).toBe('ACTIVE');
  });
});
