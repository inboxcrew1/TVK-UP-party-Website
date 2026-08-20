import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export type ScopeType = 'STATE' | 'DISTRICT' | 'ASSEMBLY' | 'INDIA';

interface MemberScopeData {
  stateId: string;
  districtId: string;
  assemblyId: string;
  status: string;
}

/**
 * Atomically adjusts active and pending member counters in the database.
 * Designed to run inside an existing Prisma transaction.
 */
export async function updateCounters(
  tx: Prisma.TransactionClient,
  oldMember: MemberScopeData | null,
  newMember: MemberScopeData | null
): Promise<void> {
  // Helper to safely increment/decrement counters
  const adjust = async (scopeType: ScopeType, scopeId: string, activeDiff: number, pendingDiff: number) => {
    if (activeDiff === 0 && pendingDiff === 0) return;

    await tx.membershipCount.upsert({
      where: {
        scopeType_scopeId: {
          scopeType,
          scopeId,
        },
      },
      update: {
        activeCount: {
          increment: activeDiff,
        },
        pendingCount: {
          increment: pendingDiff,
        },
      },
      create: {
        scopeType,
        scopeId,
        activeCount: Math.max(0, activeDiff),
        pendingCount: Math.max(0, pendingDiff),
      },
    });
  };

  // Case 1: Initial Registration (SUBMITTED / UNDER_REVIEW / etc.)
  if (!oldMember && newMember) {
    const isPending = ['SUBMITTED', 'UNDER_REVIEW', 'PENDING_OTP'].includes(newMember.status);
    const isActive = newMember.status === 'ACTIVE';

    const pDiff = isPending ? 1 : 0;
    const aDiff = isActive ? 1 : 0;

    await adjust('STATE', newMember.stateId, aDiff, pDiff);
    await adjust('DISTRICT', newMember.districtId, aDiff, pDiff);
    await adjust('ASSEMBLY', newMember.assemblyId, aDiff, pDiff);
    return;
  }

  // Case 2: Deletion
  if (oldMember && !newMember) {
    const wasPending = ['SUBMITTED', 'UNDER_REVIEW', 'PENDING_OTP'].includes(oldMember.status);
    const wasActive = oldMember.status === 'ACTIVE';

    const pDiff = wasPending ? -1 : 0;
    const aDiff = wasActive ? -1 : 0;

    await adjust('STATE', oldMember.stateId, aDiff, pDiff);
    await adjust('DISTRICT', oldMember.districtId, aDiff, pDiff);
    await adjust('ASSEMBLY', oldMember.assemblyId, aDiff, pDiff);
    return;
  }

  // Case 3: Status Updates and Geographic Transfers
  if (oldMember && newMember) {
    const wasPending = ['SUBMITTED', 'UNDER_REVIEW', 'PENDING_OTP'].includes(oldMember.status);
    const wasActive = oldMember.status === 'ACTIVE';
    const isPending = ['SUBMITTED', 'UNDER_REVIEW', 'PENDING_OTP'].includes(newMember.status);
    const isActive = newMember.status === 'ACTIVE';

    // check if geographic locations changed
    const geoChanged =
      oldMember.stateId !== newMember.stateId ||
      oldMember.districtId !== newMember.districtId ||
      oldMember.assemblyId !== newMember.assemblyId;

    if (!geoChanged) {
      // Just status changed (e.g. SUBMITTED -> ACTIVE)
      const activeDiff = (isActive ? 1 : 0) - (wasActive ? 1 : 0);
      const pendingDiff = (isPending ? 1 : 0) - (wasPending ? 1 : 0);

      await adjust('STATE', newMember.stateId, activeDiff, pendingDiff);
      await adjust('DISTRICT', newMember.districtId, activeDiff, pendingDiff);
      await adjust('ASSEMBLY', newMember.assemblyId, activeDiff, pendingDiff);
    } else {
      // Geographic boundaries changed (e.g. transfer district)
      // 1. Subtract from old locations
      const oldActiveMinus = wasActive ? -1 : 0;
      const oldPendingMinus = wasPending ? -1 : 0;

      await adjust('STATE', oldMember.stateId, oldActiveMinus, oldPendingMinus);
      await adjust('DISTRICT', oldMember.districtId, oldActiveMinus, oldPendingMinus);
      await adjust('ASSEMBLY', oldMember.assemblyId, oldActiveMinus, oldPendingMinus);

      // 2. Add to new locations
      const newActiveAdd = isActive ? 1 : 0;
      const newPendingAdd = isPending ? 1 : 0;

      await adjust('STATE', newMember.stateId, newActiveAdd, newPendingAdd);
      await adjust('DISTRICT', newMember.districtId, newActiveAdd, newPendingAdd);
      await adjust('ASSEMBLY', newMember.assemblyId, newActiveAdd, newPendingAdd);
    }
  }
}

/**
 * Helper to fetch aggregated counts directly from Member table to verify counter accuracy.
 */
export async function getAggregatedCounts(scopeType: ScopeType, scopeId: string) {
  if (scopeType === 'STATE') {
    const active = await prisma.member.count({ where: { stateId: scopeId, status: 'ACTIVE' } });
    const pending = await prisma.member.count({
      where: {
        stateId: scopeId,
        status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'PENDING_OTP'] },
      },
    });
    return { active, pending };
  }
  
  if (scopeType === 'DISTRICT') {
    const active = await prisma.member.count({ where: { districtId: scopeId, status: 'ACTIVE' } });
    const pending = await prisma.member.count({
      where: {
        districtId: scopeId,
        status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'PENDING_OTP'] },
      },
    });
    return { active, pending };
  }

  if (scopeType === 'ASSEMBLY') {
    const active = await prisma.member.count({ where: { assemblyId: scopeId, status: 'ACTIVE' } });
    const pending = await prisma.member.count({
      where: {
        assemblyId: scopeId,
        status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'PENDING_OTP'] },
      },
    });
    return { active, pending };
  }

  return { active: 0, pending: 0 };
}
