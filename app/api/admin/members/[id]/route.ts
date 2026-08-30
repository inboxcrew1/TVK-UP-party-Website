import { NextResponse } from 'next/server';
import { getAdminFromRequest, checkAdminScope } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';

export const dynamic = 'force-dynamic';

// GET: Retrieve single member details for editing
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Member ID required.' }, { status: 400 });
    }

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        district: true,
        assembly: true,
        state: true,
        addresses: true,
        documents: true,
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found.' }, { status: 404 });
    }

    // Check scope
    const hasScope = checkAdminScope(admin, {
      stateId: member.stateId,
      districtId: member.districtId,
      assemblyId: member.assemblyId,
    });

    if (!hasScope) {
      return NextResponse.json({ error: 'Forbidden: Member falls outside your scope.' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      member: {
        id: member.id,
        membershipId: member.membershipId,
        fullName: member.fullName,
        mobile: member.mobile,
        email: member.email,
        dob: member.dob ? member.dob.toISOString().split('T')[0] : '',
        gender: member.gender,
        status: member.status,
        stateId: member.stateId,
        districtId: member.districtId,
        districtName: member.district?.name || '',
        assemblyId: member.assemblyId,
        assemblyName: member.assembly?.name || '',
        address: member.addresses?.[0]?.address || '',
        pincode: member.addresses?.[0]?.pincode || '',
        govtIdType: member.documents?.[0]?.documentType || 'Aadhaar Card',
        govtIdNumber: member.documents?.[0]?.documentNo || '',
        photoUrl: member.photoUrl,
        joiningDate: member.joiningDate,
      },
    });
  } catch (error) {
    console.error('Admin member fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve member details.' }, { status: 500 });
  }
}

// PATCH: Edit / Correct member details (Membership ID is strictly immutable)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Member ID required.' }, { status: 400 });
    }

    const existingMember = await prisma.member.findUnique({
      where: { id },
      include: { addresses: true, documents: true },
    });

    if (!existingMember) {
      return NextResponse.json({ error: 'Member not found.' }, { status: 404 });
    }

    // Check scope
    const hasScope = checkAdminScope(admin, {
      stateId: existingMember.stateId,
      districtId: existingMember.districtId,
      assemblyId: existingMember.assemblyId,
    });

    if (!hasScope) {
      return NextResponse.json({ error: 'Forbidden: Member falls outside your scope.' }, { status: 403 });
    }

    const body = await req.json();
    const {
      fullName,
      mobile,
      email,
      dob,
      gender,
      districtId,
      assemblyId,
      address,
      pincode,
      govtIdType,
      govtIdNumber,
    } = body;

    // Validation
    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json({ error: 'Full name must be at least 2 characters.' }, { status: 400 });
    }

    const cleanMobile = (mobile || '').replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 });
    }
    const finalMobile = cleanMobile.length === 10 ? `+91${cleanMobile}` : `+${cleanMobile}`;

    // Mobile uniqueness check: ensure no other member has this mobile number
    const duplicateMobileMember = await prisma.member.findFirst({
      where: {
        mobile: finalMobile,
        id: { not: id },
      },
    });

    if (duplicateMobileMember) {
      return NextResponse.json(
        { error: `Mobile number ${cleanMobile.slice(-10)} is already registered to another member (${duplicateMobileMember.fullName}, ${duplicateMobileMember.membershipId || 'Pending'}).` },
        { status: 400 }
      );
    }

    // Parse date of birth
    let parsedDob = existingMember.dob;
    if (dob) {
      const d = new Date(dob);
      if (!isNaN(d.getTime())) {
        parsedDob = d;
      }
    }

    // Prepare update data — Membership ID is strictly preserved and NEVER modified
    const updateData: any = {
      fullName: fullName.trim(),
      mobile: finalMobile,
      email: email ? email.trim() : null,
      dob: parsedDob,
      gender: gender || existingMember.gender,
    };

    if (districtId) updateData.districtId = districtId;
    if (assemblyId) updateData.assemblyId = assemblyId;

    // Update Member row
    const updatedMember = await prisma.member.update({
      where: { id },
      data: updateData,
      include: {
        district: true,
        assembly: true,
      },
    });

    // Update or create address record
    if (address || pincode) {
      const firstAddress = existingMember.addresses?.[0];
      if (firstAddress) {
        await prisma.memberAddress.update({
          where: { id: firstAddress.id },
          data: {
            address: address ? address.trim() : firstAddress.address,
            pincode: pincode ? pincode.trim() : firstAddress.pincode,
          },
        });
      } else {
        await prisma.memberAddress.create({
          data: {
            memberId: id,
            address: address ? address.trim() : 'Uttar Pradesh',
            pincode: pincode ? pincode.trim() : '203001',
          },
        });
      }
    }

    // Update or create document record
    if (govtIdType || govtIdNumber) {
      const firstDoc = existingMember.documents?.[0];
      if (firstDoc) {
        await prisma.memberDocument.update({
          where: { id: firstDoc.id },
          data: {
            documentType: govtIdType || firstDoc.documentType,
            documentNo: govtIdNumber ? govtIdNumber.trim() : firstDoc.documentNo,
          },
        });
      } else {
        await prisma.memberDocument.create({
          data: {
            memberId: id,
            documentType: govtIdType || 'Aadhaar Card',
            documentNo: govtIdNumber ? govtIdNumber.trim() : 'XXXX-XXXX-XXXX',
            fileUrl: '',
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Member details updated successfully.',
      member: {
        id: updatedMember.id,
        membershipId: updatedMember.membershipId, // Guaranteed unchanged
        fullName: updatedMember.fullName,
        mobile: updatedMember.mobile,
        email: updatedMember.email,
        dob: updatedMember.dob,
        gender: updatedMember.gender,
        district: updatedMember.district,
        assembly: updatedMember.assembly,
        status: updatedMember.status,
      },
    });
  } catch (error) {
    console.error('Admin member edit error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update member.' },
      { status: 500 }
    );
  }
}

// DELETE: Permanent deletion of a member record with full relation safety
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Member ID required.' }, { status: 400 });
    }

    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found or already deleted.' }, { status: 404 });
    }

    // Check scope
    const hasScope = checkAdminScope(admin, {
      stateId: member.stateId,
      districtId: member.districtId,
      assemblyId: member.assemblyId,
    });

    if (!hasScope) {
      return NextResponse.json({ error: 'Forbidden: Member falls outside your scope.' }, { status: 403 });
    }

    // 1. Safely remove dependent child records
    await prisma.memberDocument.deleteMany({ where: { memberId: id } });
    await prisma.memberAddress.deleteMany({ where: { memberId: id } });
    await prisma.membershipStatusHistory.deleteMany({ where: { memberId: id } });
    await prisma.consent.deleteMany({ where: { memberId: id } });
    await prisma.idCard.deleteMany({ where: { memberId: id } });

    // 2. Permanently delete the member record
    await prisma.member.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Member ${member.fullName} (${member.membershipId || 'Pending'}) permanently deleted.`,
      deletedMemberId: id,
    });
  } catch (error) {
    console.error('Admin member delete error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete member.' },
      { status: 500 }
    );
  }
}
