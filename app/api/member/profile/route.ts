import { NextResponse } from 'next/server';
import { getMemberFromRequest } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { decrypt, maskDocumentNumber } from '../../../../lib/security';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const sessionMember = await getMemberFromRequest(req);

    if (!sessionMember) {
      return NextResponse.json({ error: 'Unauthorized session. Please log in.' }, { status: 401 });
    }

    // Load full details
    const member = await prisma.member.findUnique({
      where: { id: sessionMember.id },
      include: {
        addresses: true,
        documents: true,
        history: {
          orderBy: { createdAt: 'desc' },
        },
        district: true,
        assembly: true,
        state: true,
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member profile not found.' }, { status: 404 });
    }

    // Decrypt and mask sensitive documents
    const sanitizedDocuments = member.documents.map((doc) => {
      let decryptedNo = 'DECRYPTION_ERROR';
      try {
        decryptedNo = decrypt(doc.documentNo);
      } catch (err) {
        console.error('Failed to decrypt document no:', err);
      }
      return {
        id: doc.id,
        documentType: doc.documentType,
        documentNo: maskDocumentNumber(decryptedNo),
        fileUrl: doc.fileUrl,
        createdAt: doc.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      member: {
        id: member.id,
        fullName: member.fullName,
        dob: member.dob,
        gender: member.gender,
        mobile: member.mobile,
        email: member.email,
        photoUrl: member.photoUrl,
        membershipId: member.membershipId,
        membershipType: member.membershipType,
        status: member.status,
        joiningDate: member.joiningDate,
        approvedAt: member.approvedAt,
        state: member.state,
        district: member.district,
        assembly: member.assembly,
        addresses: member.addresses,
        documents: sanitizedDocuments,
        history: member.history,
      },
    });
  } catch (error) {
    console.error('Fetch profile API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 });
  }
}
