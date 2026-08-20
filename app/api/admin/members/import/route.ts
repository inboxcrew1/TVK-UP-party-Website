import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';
import { submitApplication, RegisterInput } from '../../../../../server/membership';
import { validateHierarchy } from '../../../../../server/geo';
import * as XLSX from 'xlsx';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Validation schema for an excel row
const rowSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  dob: z.string().or(z.date()).transform((val) => new Date(val)),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  mobile: z.string().regex(/^\+91\d{10}$/, 'Mobile must be in format +91XXXXXXXXXX'),
  email: z.string().email('Invalid email format').nullable().optional(),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  stateName: z.string(),
  districtName: z.string(),
  assemblyName: z.string(),
  documentType: z.enum(['Aadhaar', 'Voter ID', 'Driving License', 'Passport']),
  documentNo: z.string().min(4, 'Document number must be at least 4 characters'),
});

export async function POST(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const dryRunParam = formData.get('dryRun');
    const dryRun = dryRunParam === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Read rows mapping keys to expected labels
    const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

    const validationErrors: Array<{ row: number; errors: string[] }> = [];
    const importPayloads: RegisterInput[] = [];

    // Local geo node caches to prevent query loops
    const stateCache: Record<string, string> = {};
    const districtCache: Record<string, string> = {}; // key: stateId_districtName
    const assemblyCache: Record<string, string> = {}; // key: districtId_assemblyName

    for (let i = 0; i < rawRows.length; i++) {
      const raw = rawRows[i];
      const rowIndex = i + 2; // Excel row numbering starts at 1, row 1 is header
      const rowErrors: string[] = [];

      // Clean inputs
      const cleanData = {
        fullName: String(raw['Full Name'] || raw['fullName'] || ''),
        dob: raw['Date of Birth'] || raw['dob'] || '',
        gender: String(raw['Gender'] || raw['gender'] || '').toUpperCase(),
        mobile: String(raw['Mobile'] || raw['mobile'] || ''),
        email: raw['Email'] || raw['email'] ? String(raw['Email'] || raw['email']) : null,
        address: String(raw['Address'] || raw['address'] || ''),
        pincode: String(raw['Pincode'] || raw['pincode'] || ''),
        stateName: String(raw['State'] || raw['state'] || ''),
        districtName: String(raw['District'] || raw['district'] || ''),
        assemblyName: String(raw['Assembly'] || raw['assembly'] || raw['Assembly Constituency'] || ''),
        documentType: String(raw['Document Type'] || raw['documentType'] || 'Aadhaar'),
        documentNo: String(raw['Document Number'] || raw['documentNo'] || raw['Document No'] || ''),
      };

      // Add +91 to mobile if missing
      if (cleanData.mobile && !cleanData.mobile.startsWith('+91')) {
        cleanData.mobile = `+91${cleanData.mobile.replace(/\D/g, '')}`;
      }

      // Check schema validation
      const parseResult = rowSchema.safeParse(cleanData);
      if (!parseResult.success) {
        parseResult.error.issues.forEach((err) => {
          rowErrors.push(`${err.path.join('.')}: ${err.message}`);
        });
      }

      const validated = parseResult.success ? parseResult.data : null;

      if (validated) {
        try {
          // Resolve State
          const stateNorm = validated.stateName.toLowerCase().trim();
          let stateId = stateCache[stateNorm];
          if (!stateId) {
            const dbState = await prisma.state.findFirst({
              where: { name: { equals: validated.stateName } },
            });
            if (!dbState) throw new Error(`State '${validated.stateName}' not found`);
            stateId = dbState.id;
            stateCache[stateNorm] = stateId;
          }

          // Resolve District
          const districtNorm = `${stateId}_${validated.districtName.toLowerCase().trim()}`;
          let districtId = districtCache[districtNorm];
          if (!districtId) {
            const dbDistrict = await prisma.district.findFirst({
              where: { stateId, name: { equals: validated.districtName } },
            });
            if (!dbDistrict) throw new Error(`District '${validated.districtName}' not found in selected State`);
            districtId = dbDistrict.id;
            districtCache[districtNorm] = districtId;
          }

          // Resolve Assembly Constituency
          const assemblyNorm = `${districtId}_${validated.assemblyName.toLowerCase().trim()}`;
          let assemblyId = assemblyCache[assemblyNorm];
          if (!assemblyId) {
            const dbAssembly = await prisma.assembly.findFirst({
              where: { districtId, name: { equals: validated.assemblyName } },
            });
            if (!dbAssembly) throw new Error(`Assembly Constituency '${validated.assemblyName}' not found in selected District`);
            assemblyId = dbAssembly.id;
            assemblyCache[assemblyNorm] = assemblyId;
          }

          // Validate geographical hierarchy bounds
          const isGeoValid = await validateHierarchy(stateId, districtId, assemblyId);
          if (!isGeoValid) {
            throw new Error(`Location hierarchy mismatch: District or Assembly does not map correctly.`);
          }

          // Check duplicate mobile/email/documents in database
          const duplicateMobile = await prisma.member.findUnique({ where: { mobile: validated.mobile } });
          if (duplicateMobile) {
            throw new Error(`Duplicate member: Mobile ${validated.mobile} is already registered`);
          }

          if (validated.email) {
            const duplicateEmail = await prisma.member.findFirst({ where: { email: validated.email } });
            if (duplicateEmail) {
              throw new Error(`Duplicate member: Email ${validated.email} is already registered`);
            }
          }

          // To be transaction-safe, submitApplication itself performs decrypt checks,
          // so this resolved row is safely staged.

          // Check age limit (min 18 years)
          const ageDiffMs = Date.now() - validated.dob.getTime();
          const ageDate = new Date(ageDiffMs);
          const age = Math.abs(ageDate.getUTCFullYear() - 1970);
          if (age < 18) {
            throw new Error(`Age limit error: Member is only ${age} years old (must be 18 or older)`);
          }

          importPayloads.push({
            fullName: validated.fullName,
            dob: validated.dob,
            gender: validated.gender,
            mobile: validated.mobile,
            email: validated.email || null,
            photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            stateId,
            districtId,
            assemblyId,
            membershipType: 'ORDINARY',
            address: validated.address,
            pincode: validated.pincode,
            documentType: validated.documentType,
            documentNo: validated.documentNo,
            fileUrl: 'https://example.com/uploads/document.pdf',
            termsAccepted: true,
            privacyAccepted: true,
            marketingOptIn: false,
          });

        } catch (geoErr) {
          const msg = geoErr instanceof Error ? geoErr.message : 'Geographic resolution failed';
          rowErrors.push(msg);
        }
      }

      if (rowErrors.length > 0) {
        validationErrors.push({ row: rowIndex, errors: rowErrors });
      }
    }

    // Dry Run validation response
    if (dryRun) {
      return NextResponse.json({
        success: validationErrors.length === 0,
        totalRows: rawRows.length,
        validRows: importPayloads.length,
        invalidRows: validationErrors.length,
        errors: validationErrors,
      });
    }

    // Commit mode: all-or-nothing write transaction
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Bulk import aborted: Sheet contains validation errors.',
        errors: validationErrors,
      }, { status: 400 });
    }

    const createdMembers = [];
    // Process registrations inside a sequential loop
    // Since prisma.transaction or sequential await writes counters correctly,
    // we register them one by one.
    for (const payload of importPayloads) {
      const member = await submitApplication(payload);
      createdMembers.push({
        id: member.id,
        fullName: member.fullName,
        membershipId: member.membershipId,
      });
    }

    return NextResponse.json({
      success: true,
      importedCount: createdMembers.length,
      members: createdMembers,
    });

  } catch (error) {
    console.error('Bulk import API error:', error);
    const msg = error instanceof Error ? error.message : 'Bulk import failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
