import { NextResponse } from 'next/server';
import { getAdminFromRequest, checkAdminScope } from '../../../../../../lib/auth';
import { prisma } from '../../../../../../lib/prisma';
import {
  approveMember,
  rejectMember,
  suspendMember,
  reactivateMember,
} from '../../../../../../server/membership';

import { queueMemberApprovalNotification } from '../../../../../../lib/notifications';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await getAdminFromRequest(req);

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    const { action, reason } = await req.json();

    if (!action || !['APPROVE', 'REJECT', 'SUSPEND', 'REACTIVATE'].includes(action)) {
      return NextResponse.json({ error: 'Invalid or missing action instruction.' }, { status: 400 });
    }

    // Retrieve target member
    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found.' }, { status: 404 });
    }

    // Security Gate: Verify admin scope contains member
    const hasScope = checkAdminScope(admin, {
      stateId: member.stateId,
      districtId: member.districtId,
      assemblyId: member.assemblyId,
    });

    if (!hasScope) {
      return NextResponse.json(
        { error: 'Forbidden: Member falls outside your administrative scope.' },
        { status: 403 }
      );
    }

    let updatedMember;
    const actorId = admin.id;

    if (action === 'APPROVE') {
      updatedMember = await approveMember(id, actorId);
      if (updatedMember && updatedMember.membershipId) {
        await queueMemberApprovalNotification(updatedMember.mobile, updatedMember.fullName, updatedMember.membershipId, 'WHATSAPP');
      }
    } else if (action === 'REJECT') {
      if (!reason || reason.trim().length === 0) {
        return NextResponse.json({ error: 'A reason is required to reject an application.' }, { status: 400 });
      }
      updatedMember = await rejectMember(id, actorId, reason);
    } else if (action === 'SUSPEND') {
      if (!reason || reason.trim().length === 0) {
        return NextResponse.json({ error: 'A reason is required to suspend a member.' }, { status: 400 });
      }
      updatedMember = await suspendMember(id, actorId, reason);
    } else if (action === 'REACTIVATE') {
      updatedMember = await reactivateMember(id, actorId);
    }

    return NextResponse.json({
      success: true,
      member: updatedMember,
    });
  } catch (error) {
    console.error('Admin action error:', error);
    const msg = error instanceof Error ? error.message : 'Action failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
