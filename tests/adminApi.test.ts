import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { prisma } from '../lib/prisma';
import { submitApplication, RegisterInput } from '../server/membership';
import * as XLSX from 'xlsx';

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
import { POST as adminLoginHandler } from '../app/api/admin/login/route';
import { GET as adminMembersHandler } from '../app/api/admin/members/route';
import { POST as adminActionHandler } from '../app/api/admin/members/[id]/action/route';
import { POST as adminImportHandler } from '../app/api/admin/members/import/route';

describe('Admin API Route Endpoints Integration Tests', () => {
  let stateId = '';
  let districtId = '';
  let assemblyId = '';
  let testMemberId = '';

  const testMobile = '+914444444444';
  const testEmail = 'api_admin_member@example.com';
  const testAadhaar = '444433332222';

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

    // Create a pending member to perform actions on
    const input: RegisterInput = {
      fullName: 'Vikash Jain',
      dob: new Date('1990-10-10'),
      gender: 'MALE',
      mobile: testMobile,
      email: testEmail,
      photoUrl: 'https://example.com/photos/vikash.jpg',
      stateId,
      districtId,
      assemblyId,
      membershipType: 'ORDINARY',
      address: '22, Jawahar Colony, Bulandshahr',
      pincode: '203001',
      documentType: 'Aadhaar',
      documentNo: testAadhaar,
      fileUrl: 'https://example.com/docs/aadhaar.pdf',
      termsAccepted: true,
      privacyAccepted: true,
      marketingOptIn: false,
    };

    const member = await submitApplication(input);
    testMemberId = member.id;
  });

  afterAll(async () => {
    mockCookiesStore = {};
    await cleanup();
  });

  async function cleanup() {
    const members = await prisma.member.findMany({
      where: { mobile: { in: [testMobile, '+918888777766'] } },
    });
    const ids = members.map((m) => m.id);

    await prisma.membershipStatusHistory.deleteMany({ where: { memberId: { in: ids } } });
    await prisma.memberDocument.deleteMany({ where: { memberId: { in: ids } } });
    await prisma.memberAddress.deleteMany({ where: { memberId: { in: ids } } });
    await prisma.consent.deleteMany({ where: { memberId: { in: ids } } });
    await prisma.idCard.deleteMany({ where: { memberId: { in: ids } } });
    await prisma.member.deleteMany({ where: { id: { in: ids } } });

    // Clean up sequence counts if needed
    await prisma.membershipCount.deleteMany({
      where: { scopeId: { in: [stateId, districtId, assemblyId] } },
    });
  }

  it('should flow through administrative login, scoped search, and action execution', async () => {
    // 1. Admin Login (using seeded Super Admin account)
    const reqLogin = new Request('http://localhost/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'superadmin@tvkup.org',
        password: 'Admin@123',
      }),
    });
    const resLogin = await adminLoginHandler(reqLogin);
    expect(resLogin.status).toBe(200);

    const bodyLogin = await resLogin.json();
    expect(bodyLogin.success).toBe(true);
    expect(bodyLogin.user.role).toBe('SUPER_ADMIN');
    expect(mockCookiesStore['admin_token']).toBeDefined();

    // 2. Fetch Scoped Members
    const reqMembers = new Request('http://localhost/api/admin/members', {
      method: 'GET',
      headers: {
        'Cookie': `admin_token=${mockCookiesStore['admin_token']}`,
      },
    });
    const resMembers = await adminMembersHandler(reqMembers);
    expect(resMembers.status).toBe(200);

    const bodyMembers = await resMembers.json();
    expect(bodyMembers.success).toBe(true);
    expect(bodyMembers.members.length).toBeGreaterThanOrEqual(1);

    interface MemberResponseItem {
      id: string;
      status: string;
      documents: Array<{ documentNo: string }>;
    }
    const match = bodyMembers.members.find((m: MemberResponseItem) => m.id === testMemberId);
    expect(match).toBeDefined();
    expect(match.status).toBe('SUBMITTED');
    expect(match.documents[0].documentNo).toBe('XXXX-XXXX-2222'); // Masked Aadhaar number check

    // 3. Approve Member
    const reqAction = new Request(`http://localhost/api/admin/members/${testMemberId}/action`, {
      method: 'POST',
      headers: {
        'Cookie': `admin_token=${mockCookiesStore['admin_token']}`,
      },
      body: JSON.stringify({ action: 'APPROVE' }),
    });
    
    // We mock the context params promise for the dynamic segment [id]
    const resAction = await adminActionHandler(reqAction, {
      params: Promise.resolve({ id: testMemberId }),
    });
    expect(resAction.status).toBe(200);

    const bodyAction = await resAction.json();
    expect(bodyAction.success).toBe(true);
    expect(bodyAction.member.status).toBe('ACTIVE');
    expect(bodyAction.member.membershipId).toMatch(/^TVK-UP-\d{8}$/);

    // 4. Excel Bulk Import Dry-Run Validation
    const testData = [
      {
        'Full Name': 'Sanjay Gupta',
        'Date of Birth': '1992-06-20',
        'Gender': 'MALE',
        'Mobile': '+918888777766',
        'Email': 'sanjay@example.com',
        'Address': '88, Shastri Nagar, Bulandshahr',
        'Pincode': '203001',
        'State': 'Uttar Pradesh',
        'District': 'Bulandshahr',
        'Assembly': 'Bulandshahr',
        'Document Type': 'Aadhaar',
        'Document Number': '888877776666',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(testData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ImportSheet');
    const xlsxBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const blob = new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const formData = new FormData();
    formData.append('file', blob, 'import.xlsx');
    formData.append('dryRun', 'true');

    const reqImport = new Request('http://localhost/api/admin/members/import', {
      method: 'POST',
      headers: {
        'Cookie': `admin_token=${mockCookiesStore['admin_token']}`,
      },
      body: formData,
    });

    const resImport = await adminImportHandler(reqImport);
    expect(resImport.status).toBe(200);

    const bodyImport = await resImport.json();
    expect(bodyImport.success).toBe(true);
    expect(bodyImport.totalRows).toBe(1);
    expect(bodyImport.validRows).toBe(1);
    expect(bodyImport.invalidRows).toBe(0);

    // 5. Excel Bulk Import Commit Mode
    const formDataCommit = new FormData();
    formDataCommit.append('file', blob, 'import.xlsx');
    formDataCommit.append('dryRun', 'false');

    const reqImportCommit = new Request('http://localhost/api/admin/members/import', {
      method: 'POST',
      headers: {
        'Cookie': `admin_token=${mockCookiesStore['admin_token']}`,
      },
      body: formDataCommit,
    });

    const resImportCommit = await adminImportHandler(reqImportCommit);
    expect(resImportCommit.status).toBe(200);

    const bodyImportCommit = await resImportCommit.json();
    expect(bodyImportCommit.success).toBe(true);
    expect(bodyImportCommit.importedCount).toBe(1);
  });
});
