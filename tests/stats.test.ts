import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../lib/prisma';
import {
  submitApplication,
  approveMember,
  suspendMember,
  reactivateMember,
  transferMemberDistrict,
  RegisterInput,
} from '../server/membership';

describe('Automatic Live Counter Automation Tests', () => {
  let stateId = '';
  let meerutId = '';
  let ghaziabadId = '';
  let mAssemblyId = ''; // Meerut Assembly
  let gAssemblyId = ''; // Loni Assembly (Ghaziabad)

  const testMobile = '+917777777777';
  const testEmail = 'statsmember@example.com';
  const testAadhaar = '999988887777';

  beforeAll(async () => {
    // Retrieve seeded IDs
    const state = await prisma.state.findUnique({ where: { code: 'UP' } });
    if (!state) throw new Error('State seed missing');
    stateId = state.id;

    const mDist = await prisma.district.findFirst({
      where: { stateId: state.id, name: 'Meerut' },
      include: { assemblies: true },
    });
    if (!mDist) throw new Error('Meerut seed missing');
    meerutId = mDist.id;
    mAssemblyId = mDist.assemblies[0].id;

    const gDist = await prisma.district.findFirst({
      where: { stateId: state.id, name: 'Ghaziabad' },
      include: { assemblies: true },
    });
    if (!gDist) throw new Error('Ghaziabad seed missing');
    ghaziabadId = gDist.id;
    gAssemblyId = gDist.assemblies.find(a => a.name === 'Loni')?.id || gDist.assemblies[0].id;

    // Cleanup database
    await cleanup();
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

    // Reset counts for test locations
    await prisma.membershipCount.deleteMany({
      where: {
        scopeId: { in: [stateId, meerutId, ghaziabadId, mAssemblyId, gAssemblyId] },
      },
    });
  }

  const getRegisterInput = (): RegisterInput => ({
    fullName: 'Stat Checker',
    dob: new Date('1990-01-01'),
    gender: 'FEMALE',
    mobile: testMobile,
    email: testEmail,
    photoUrl: 'https://example.com/photos/stats.jpg',
    stateId,
    districtId: meerutId,
    assemblyId: mAssemblyId,
    membershipType: 'ORDINARY',
    address: '456, Station Road, Meerut',
    pincode: '250001',
    documentType: 'Voter ID',
    documentNo: testAadhaar,
    fileUrl: 'https://example.com/docs/voter.pdf',
    termsAccepted: true,
    privacyAccepted: true,
    marketingOptIn: false,
  });

  it('should correctly increment pending counts upon initial registration', async () => {
    await submitApplication(getRegisterInput());

    // Verify district count
    const districtCount = await prisma.membershipCount.findUnique({
      where: { scopeType_scopeId: { scopeType: 'DISTRICT', scopeId: meerutId } },
    });
    expect(districtCount).not.toBeNull();
    expect(districtCount?.pendingCount).toBe(1);
    expect(districtCount?.activeCount).toBe(0);

    // Verify assembly count
    const assemblyCount = await prisma.membershipCount.findUnique({
      where: { scopeType_scopeId: { scopeType: 'ASSEMBLY', scopeId: mAssemblyId } },
    });
    expect(assemblyCount?.pendingCount).toBe(1);
    expect(assemblyCount?.activeCount).toBe(0);

    // Verify state count (Note: since there might be other registrations running concurrently on stateId, we check that it is at least 1)
    const stateCount = await prisma.membershipCount.findUnique({
      where: { scopeType_scopeId: { scopeType: 'STATE', scopeId: stateId } },
    });
    expect(stateCount?.pendingCount).toBeGreaterThanOrEqual(1);
  });

  it('should transfer counts from pending to active upon approval', async () => {
    const member = await prisma.member.findUnique({ where: { mobile: testMobile } });
    expect(member).not.toBeNull();

    await approveMember(member!.id, 'admin-id');

    // Verify district count updates
    const districtCount = await prisma.membershipCount.findUnique({
      where: { scopeType_scopeId: { scopeType: 'DISTRICT', scopeId: meerutId } },
    });
    expect(districtCount?.pendingCount).toBe(0);
    expect(districtCount?.activeCount).toBe(1);

    // Verify state count updates (asserting relative counts is safer due to concurrent state changes)
    const stateCount = await prisma.membershipCount.findUnique({
      where: { scopeType_scopeId: { scopeType: 'STATE', scopeId: stateId } },
    });
    expect(stateCount?.activeCount).toBeGreaterThanOrEqual(1);
  });

  it('should decrement active counts upon member suspension', async () => {
    const member = await prisma.member.findUnique({ where: { mobile: testMobile } });
    expect(member).not.toBeNull();

    await suspendMember(member!.id, 'admin-id', 'test suspension');

    const districtCount = await prisma.membershipCount.findUnique({
      where: { scopeType_scopeId: { scopeType: 'DISTRICT', scopeId: meerutId } },
    });
    expect(districtCount?.activeCount).toBe(0);
  });

  it('should increment active counts again upon reactivation', async () => {
    const member = await prisma.member.findUnique({ where: { mobile: testMobile } });
    await reactivateMember(member!.id, 'admin-id');

    const districtCount = await prisma.membershipCount.findUnique({
      where: { scopeType_scopeId: { scopeType: 'DISTRICT', scopeId: meerutId } },
    });
    expect(districtCount?.activeCount).toBe(1);
  });

  it('should transfer active count across districts during district transfer', async () => {
    const member = await prisma.member.findUnique({ where: { mobile: testMobile } });
    expect(member).not.toBeNull();

    // Fetch initial state active count to check delta
    const stateCountBefore = await prisma.membershipCount.findUnique({
      where: { scopeType_scopeId: { scopeType: 'STATE', scopeId: stateId } },
    });
    const stateActiveBefore = stateCountBefore?.activeCount || 0;

    // Fetch destination Ghaziabad active count before transfer
    const newDistCountBefore = await prisma.membershipCount.findUnique({
      where: { scopeType_scopeId: { scopeType: 'DISTRICT', scopeId: ghaziabadId } },
    });
    const ghaziabadActiveBefore = newDistCountBefore?.activeCount || 0;

    // Transfer Meerut -> Ghaziabad
    await transferMemberDistrict(member!.id, ghaziabadId, gAssemblyId, 'admin-id');

    // Meerut active count should decrease (1 -> 0)
    const oldDistCount = await prisma.membershipCount.findUnique({
      where: { scopeType_scopeId: { scopeType: 'DISTRICT', scopeId: meerutId } },
    });
    expect(oldDistCount?.activeCount).toBe(0);

    // Ghaziabad active count should increase by 1
    const newDistCount = await prisma.membershipCount.findUnique({
      where: { scopeType_scopeId: { scopeType: 'DISTRICT', scopeId: ghaziabadId } },
    });
    expect(newDistCount?.activeCount).toBe(ghaziabadActiveBefore + 1);

    // State count should remain unchanged
    const stateCountAfter = await prisma.membershipCount.findUnique({
      where: { scopeType_scopeId: { scopeType: 'STATE', scopeId: stateId } },
    });
    expect(stateCountAfter?.activeCount).toBe(stateActiveBefore);
  });
});
