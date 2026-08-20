import { prisma } from './prisma';

export type NotificationType = 'SMS' | 'EMAIL' | 'WHATSAPP';

export interface CreateNotificationInput {
  recipient: string;
  type: NotificationType;
  template: string;
  payload: Record<string, any>;
}

/**
 * Enqueues a notification into the database Notification queue.
 */
export async function queueNotification(input: CreateNotificationInput) {
  const notification = await prisma.notification.create({
    data: {
      recipient: input.recipient,
      type: input.type,
      template: input.template,
      payload: JSON.stringify(input.payload),
      status: 'QUEUED',
      attempts: 0,
    },
  });

  return notification;
}

/**
 * Dispatches a single queued notification to the designated delivery provider (SMS, WhatsApp, Email).
 */
export async function processNotification(id: string) {
  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  if (!notification) {
    throw new Error(`Notification record ${id} not found.`);
  }

  const attempts = notification.attempts + 1;

  try {
    const payload = JSON.parse(notification.payload);

    // Mock Delivery Gateways (SMS, Email, WhatsApp)
    if (notification.type === 'WHATSAPP') {
      console.log(`[WHATSAPP DEV GATEWAY] Sent WhatsApp message to ${notification.recipient} using template ${notification.template}:`, payload);
    } else if (notification.type === 'SMS') {
      console.log(`[SMS DEV GATEWAY] Sent SMS to ${notification.recipient} using template ${notification.template}:`, payload);
    } else if (notification.type === 'EMAIL') {
      console.log(`[EMAIL DEV GATEWAY] Sent Email to ${notification.recipient} using template ${notification.template}:`, payload);
    }

    // Record success in log and update notification status
    await prisma.$transaction([
      prisma.notificationLog.create({
        data: {
          notificationId: id,
          status: 'SENT',
        },
      }),
      prisma.notification.update({
        where: { id },
        data: {
          status: 'SENT',
          attempts,
        },
      }),
    ]);

    return { success: true, id };
  } catch (err: any) {
    const errorMessage = err?.message || 'Delivery error';

    await prisma.$transaction([
      prisma.notificationLog.create({
        data: {
          notificationId: id,
          status: 'FAILED',
          error: errorMessage,
        },
      }),
      prisma.notification.update({
        where: { id },
        data: {
          status: attempts >= 3 ? 'FAILED' : 'QUEUED',
          attempts,
        },
      }),
    ]);

    return { success: false, id, error: errorMessage };
  }
}

/**
 * Batch processes queued notifications.
 */
export async function processPendingQueue(batchSize = 20) {
  const queued = await prisma.notification.findMany({
    where: { status: 'QUEUED' },
    take: batchSize,
    orderBy: { createdAt: 'asc' },
  });

  const results = [];
  for (const item of queued) {
    const res = await processNotification(item.id);
    results.push(res);
  }

  return {
    processed: queued.length,
    results,
  };
}

/**
 * Helper to dispatch Member Welcome notification via SMS or WhatsApp.
 */
export async function queueMemberWelcomeNotification(recipient: string, name: string, type: NotificationType = 'WHATSAPP') {
  return queueNotification({
    recipient,
    type,
    template: 'MEMBER_WELCOME',
    payload: {
      name,
      message: `Welcome to TVK Uttar Pradesh, ${name}! Your membership application has been successfully submitted.`,
    },
  });
}

/**
 * Helper to dispatch Member Approval notification via SMS or WhatsApp.
 */
export async function queueMemberApprovalNotification(recipient: string, name: string, membershipId: string, type: NotificationType = 'WHATSAPP') {
  return queueNotification({
    recipient,
    type,
    template: 'MEMBER_APPROVED',
    payload: {
      name,
      membershipId,
      message: `Congratulations ${name}! Your TVK UP Membership (${membershipId}) is now ACTIVE. You can download your official ID Card from the portal.`,
    },
  });
}
