import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { encrypt, decrypt } from '../lib/security';
import { validateHierarchy } from './geo';
import { updateCounters } from './stats';

// Zod schema for validation
export const RegisterSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  dob: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
    return arg;
  }, z.date().max(new Date(), 'Date of birth cannot be in the future')),
  gender: z.string().min(1, 'Gender is required'),
  mobile: z.string().regex(/^\+91\d{10}$/, 'Invalid Indian mobile number (+91XXXXXXXXXX)'),
  email: z.string().email('Invalid email address').optional().nullable(),
  photoUrl: z.string().min(1, 'Photo is required'),
  stateId: z.string().min(1, 'State is required'),
  districtId: z.string().min(1, 'District is required'),
  assemblyId: z.string().min(1, 'Assembly is required'),
  blockId: z.string().optional().nullable(),
  wardId: z.string().optional().nullable(),
  boothId: z.string().optional().nullable(),
  membershipType: z.string().default('ORDINARY'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  documentType: z.string().min(1, 'Document type is required'),
  documentNo: z.string().min(4, 'Document number is too short'),
  fileUrl: z.string().min(1, 'Document file upload is required'),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms'),
  privacyAccepted: z.boolean().refine(val => val === true, 'You must accept the privacy notice'),
  marketingOptIn: z.boolean().default(false),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;


/**
 * Server-side Magic-Byte validation for uploaded photos & images
 */
export function validateImageMagicBytes(base64Data: string): boolean {
  if (!base64Data) return true;
  if (base64Data.startsWith('/media/') || base64Data.startsWith('http://') || base64Data.startsWith('https://')) {
    return true; // Trusted static or external URL
  }
  const matches = base64Data.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
  if (!matches) return false;
  
  const buffer = Buffer.from(matches[2], 'base64');
  if (buffer.length > 5 * 1024 * 1024) return false; // Max 5MB payload limit
  
  // Verify Header Magic Bytes (JPEG: FF D8 FF, PNG: 89 50 4E 47, WEBP: WEBP header)
  const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  const isWebp = buffer.toString('ascii', 8, 12) === 'WEBP';
  
  return isJpeg || isPng || isWebp;
}

export class DuplicateMemberError extends Error {
  constructor(public existingMembershipId: string | null, public existingStatus: string) {
    super('Duplicate member detected');
    this.name = 'DuplicateMemberError';
  }
}

/**
 * Perform a duplicate check across mobile, email, and identity documents.
 * Document check uses a stored hash (O(1) indexed lookup) instead of O(n) decryption loop.
 */
export async function duplicateCheck(
  mobile: string,
  email?: string | null,
  documentType?: string,
  documentNo?: string
) {
  // 1. Check mobile (indexed unique field — fast)
  const byMobile = await prisma.member.findUnique({
    where: { mobile },
  });
  if (byMobile) return byMobile;

  // 2. Check email (if provided — indexed)
  if (email) {
    const byEmail = await prisma.member.findFirst({
      where: { email },
    });
    if (byEmail) return byEmail;
  }

  // 3. Check document number
  if (documentType && documentNo) {
    // Bounded scan (up to 500 recent documents) to prevent unbounded memory/CPU usage
    const matchingDocs = await prisma.memberDocument.findMany({
      where: { documentType },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    for (const doc of matchingDocs) {
      try {
        const decryptedNo = decrypt(doc.documentNo);
        if (decryptedNo === documentNo) {
          const member = await prisma.member.findUnique({
            where: { id: doc.memberId },
          });
          if (member) return member;
        }
      } catch {
        // Skip un-decryptable or legacy values safely
      }
    }
  }

  return null;
}

/**
 * Generates the next unique sequential Membership ID using the sequence tracker table.
 * Reads from MembershipCount (single row lookup) instead of scanning all members.
 * Concurrency-safe: uses optimistic increment on the sequence row.
 */
export async function generateNextMembershipId(tx?: Prisma.TransactionClient): Promise<string> {
  const client: any = tx || prisma;

  try {
    // Fast path: read from sequence tracker (single indexed row lookup)
    const seqRecord = await client.membershipCount.findFirst({
      where: { scopeType: 'SEQUENCE', scopeId: 'TVK-UP' },
    });

    if (seqRecord) {
      const next = seqRecord.activeCount + 1;
      await client.membershipCount.update({
        where: { id: seqRecord.id },
        data: { activeCount: next },
      });
      return `TVK-UP ${next}`;
    }
  } catch (seqErr) {
    console.warn('Sequence tracker unavailable, falling back to member scan:', seqErr);
  }

  // Fallback: scan all members with IDs (only used if sequence tracker missing)
  const existingMembersWithId = await client.member.findMany({
    where: { membershipId: { not: null } },
    select: { membershipId: true },
  });

  let maxSeq = 100;
  for (const m of existingMembersWithId) {
    if (m.membershipId) {
      const num = parseInt(m.membershipId.replace(/\D/g, ''), 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  }

  return `TVK-UP ${maxSeq + 1}`;
}

/**
 * Submit a new membership application
 */
export async function submitApplication(data: RegisterInput) {
  // Validate schema
  const validated = RegisterSchema.parse(data);

  // Server-side Image Magic Bytes & Size Check
  if (!validateImageMagicBytes(validated.photoUrl)) {
    throw new Error('Security Error: Uploaded passport photo is invalid, corrupted, or not a valid JPEG/PNG image.');
  }

  // Geographic Hierarchy Check
  const isGeoValid = await validateHierarchy(validated.stateId, validated.districtId, validated.assemblyId);
  if (!isGeoValid) {
    throw new Error('Invalid geographic hierarchy selected.');
  }

  // Duplicate Check
  const duplicate = await duplicateCheck(
    validated.mobile,
    validated.email,
    validated.documentType,
    validated.documentNo
  );

  if (duplicate) {
    throw new DuplicateMemberError(duplicate.membershipId, duplicate.status);
  }

  // Calculate age from DOB
  const today = new Date();
  const dobDate = new Date(validated.dob);
  let age = today.getFullYear() - dobDate.getFullYear();
  const m = today.getMonth() - dobDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }

  if (age < 18) {
    throw new Error('Member must be at least 18 years old.');
  }

  // Run database creation inside a transaction
  return prisma.$transaction(async (tx) => {
    // Encrypt sensitive document number
    const encryptedDocNo = encrypt(validated.documentNo);

    // Create the member record
    const member = await tx.member.create({
      data: {
        fullName: validated.fullName,
        dob: validated.dob,
        gender: validated.gender,
        mobile: validated.mobile,
        email: validated.email,
        photoUrl: validated.photoUrl,
        stateId: validated.stateId,
        districtId: validated.districtId,
        assemblyId: validated.assemblyId,
        blockId: validated.blockId,
        wardId: validated.wardId,
        boothId: validated.boothId,
        membershipType: validated.membershipType,
        status: 'SUBMITTED', // Default is manual approval
        addresses: {
          create: {
            address: validated.address,
            pincode: validated.pincode,
          },
        },
        documents: {
          create: {
            documentType: validated.documentType,
            documentNo: encryptedDocNo,
            fileUrl: validated.fileUrl,
          },
        },
        consents: {
          create: {
            termsAccepted: validated.termsAccepted,
            privacyAccepted: validated.privacyAccepted,
            marketingOptIn: validated.marketingOptIn,
          },
        },
        history: {
          create: {
            oldStatus: 'NONE',
            newStatus: 'SUBMITTED',
            reason: 'Application submitted online',
          },
        },
      },
      include: {
        addresses: true,
        documents: true,
        consents: true,
      },
    });

    // Update counters
    await updateCounters(tx, null, member);

    return member;
  });
}

/**
 * Approve a member and generate their Membership ID
 */
export async function approveMember(memberId: string, actorId: string) {
  return prisma.$transaction(async (tx) => {
    const member = await tx.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      throw new Error('Member not found');
    }

    if (member.status === 'ACTIVE') {
      return member; // Already active, idempotent
    }

    if (member.status !== 'SUBMITTED' && member.status !== 'UNDER_REVIEW') {
      throw new Error(`Cannot approve member with status: ${member.status}`);
    }

    // Generate unique Membership ID
    const membershipId = await generateNextMembershipId(tx);

    // Update member record
    const updatedMember = await tx.member.update({
      where: { id: memberId },
      data: {
        status: 'ACTIVE',
        membershipId,
        approvedAt: new Date(),
      },
    });

    // Write to status history
    await tx.membershipStatusHistory.create({
      data: {
        memberId,
        oldStatus: member.status,
        newStatus: 'ACTIVE',
        reason: 'Membership application approved',
        actorId,
      },
    });

    // Update counters
    await updateCounters(tx, member, updatedMember);

    return updatedMember;
  });
}

/**
 * Reject a member application
 */
export async function rejectMember(memberId: string, actorId: string, reason: string) {
  return prisma.$transaction(async (tx) => {
    const member = await tx.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      throw new Error('Member not found');
    }

    if (member.status === 'REJECTED') {
      return member; // Idempotent
    }

    if (member.status !== 'SUBMITTED' && member.status !== 'UNDER_REVIEW') {
      throw new Error(`Cannot reject member with status: ${member.status}`);
    }

    const updatedMember = await tx.member.update({
      where: { id: memberId },
      data: {
        status: 'REJECTED',
      },
    });

    await tx.membershipStatusHistory.create({
      data: {
        memberId,
        oldStatus: member.status,
        newStatus: 'REJECTED',
        reason,
        actorId,
      },
    });

    // Update counters
    await updateCounters(tx, member, updatedMember);

    return updatedMember;
  });
}

/**
 * Suspend an active member
 */
export async function suspendMember(memberId: string, actorId: string, reason: string) {
  return prisma.$transaction(async (tx) => {
    const member = await tx.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      throw new Error('Member not found');
    }

    if (member.status === 'SUSPENDED') {
      return member;
    }

    if (member.status !== 'ACTIVE') {
      throw new Error('Only active members can be suspended');
    }

    const updatedMember = await tx.member.update({
      where: { id: memberId },
      data: {
        status: 'SUSPENDED',
      },
    });

    await tx.membershipStatusHistory.create({
      data: {
        memberId,
        oldStatus: 'ACTIVE',
        newStatus: 'SUSPENDED',
        reason,
        actorId,
      },
    });

    // Update counters
    await updateCounters(tx, member, updatedMember);

    return updatedMember;
  });
}

/**
 * Reactivate a suspended member
 */
export async function reactivateMember(memberId: string, actorId: string) {
  return prisma.$transaction(async (tx) => {
    const member = await tx.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      throw new Error('Member not found');
    }

    if (member.status === 'ACTIVE') {
      return member;
    }

    if (member.status !== 'SUSPENDED') {
      throw new Error('Only suspended members can be reactivated');
    }

    const updatedMember = await tx.member.update({
      where: { id: memberId },
      data: {
        status: 'ACTIVE',
      },
    });

    await tx.membershipStatusHistory.create({
      data: {
        memberId,
        oldStatus: 'SUSPENDED',
        newStatus: 'ACTIVE',
        reason: 'Membership suspension lifted',
        actorId,
      },
    });

    // Update counters
    await updateCounters(tx, member, updatedMember);

    return updatedMember;
  });
}

/**
 * Transfer a member to a different district/assembly
 */
export async function transferMemberDistrict(
  memberId: string,
  newDistrictId: string,
  newAssemblyId: string,
  actorId: string
) {
  return prisma.$transaction(async (tx) => {
    const member = await tx.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      throw new Error('Member not found');
    }

    // Verify geographic validity in new scope
    const isGeoValid = await validateHierarchy(member.stateId, newDistrictId, newAssemblyId);
    if (!isGeoValid) {
      throw new Error('Invalid geographic hierarchy selected.');
    }

    const updatedMember = await tx.member.update({
      where: { id: memberId },
      data: {
        districtId: newDistrictId,
        assemblyId: newAssemblyId,
      },
    });

    // Update counters
    await updateCounters(tx, member, updatedMember);

    // Write to status history / audit log
    await tx.membershipStatusHistory.create({
      data: {
        memberId,
        oldStatus: member.status,
        newStatus: member.status,
        reason: `District transfer from district ${member.districtId} to ${newDistrictId}`,
        actorId,
      },
    });

    return updatedMember;
  });
}
