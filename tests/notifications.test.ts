import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { prisma } from '../lib/prisma';
import {
  queueNotification,
  processNotification,
  processPendingQueue,
  queueMemberWelcomeNotification,
  queueMemberApprovalNotification,
} from '../lib/notifications';

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
import { GET as notificationsGetHandler, POST as notificationsPostHandler } from '../app/api/admin/notifications/route';
import { POST as notificationsProcessHandler } from '../app/api/admin/notifications/process/route';

describe('Notification Services Integration Tests', () => {
  const testMobile = '+919988776655';
  let notificationId = '';

  beforeAll(async () => {
    mockCookiesStore = {};
  });

  afterAll(async () => {
    mockCookiesStore = {};
    const notifs = await prisma.notification.findMany({ where: { recipient: testMobile } });
    const ids = notifs.map((n) => n.id);
    await prisma.notificationLog.deleteMany({ where: { notificationId: { in: ids } } });
    await prisma.notification.deleteMany({ where: { recipient: testMobile } });
  });

  it('should queue and process WhatsApp / SMS / Email notifications', async () => {
    // 1. Queue a WhatsApp notification directly via helper
    const queuedNotif = await queueMemberWelcomeNotification(testMobile, 'Sunil Sharma', 'WHATSAPP');
    expect(queuedNotif.id).toBeDefined();
    expect(queuedNotif.type).toBe('WHATSAPP');
    expect(queuedNotif.status).toBe('QUEUED');
    notificationId = queuedNotif.id;

    // 2. Process the single queued notification
    const resProcess = await processNotification(notificationId);
    expect(resProcess.success).toBe(true);

    const updatedNotif = await prisma.notification.findUnique({
      where: { id: notificationId },
      include: { logs: true },
    });
    expect(updatedNotif?.status).toBe('SENT');
    expect(updatedNotif?.attempts).toBe(1);
    expect(updatedNotif?.logs.length).toBe(1);
    expect(updatedNotif?.logs[0].status).toBe('SENT');

    // 3. Queue an Approval notification via helper
    const appNotif = await queueMemberApprovalNotification(testMobile, 'Sunil Sharma', 'TVK-UP-00009999', 'WHATSAPP');
    expect(appNotif.id).toBeDefined();

    // 4. Batch process pending queue
    const batchRes = await processPendingQueue(10);
    expect(batchRes.processed).toBeGreaterThanOrEqual(1);

    // 5. Admin API integration: Admin Login and Query Queue
    const reqLogin = new Request('http://localhost/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'superadmin@tvkup.org',
        password: 'Admin@123',
      }),
    });
    const resLogin = await adminLoginHandler(reqLogin);
    expect(resLogin.status).toBe(200);

    const reqGet = new Request('http://localhost/api/admin/notifications', {
      method: 'GET',
      headers: { 'Cookie': `admin_token=${mockCookiesStore['admin_token']}` },
    });
    const resGet = await notificationsGetHandler(reqGet);
    expect(resGet.status).toBe(200);
    const bodyGet = await resGet.json();
    expect(bodyGet.success).toBe(true);
    expect(Array.isArray(bodyGet.notifications)).toBe(true);

    // 6. Admin API Enqueue & Process Trigger
    const reqEnqueue = new Request('http://localhost/api/admin/notifications', {
      method: 'POST',
      headers: { 'Cookie': `admin_token=${mockCookiesStore['admin_token']}` },
      body: JSON.stringify({
        recipient: testMobile,
        type: 'WHATSAPP',
        template: 'CUSTOM_ALERT',
        payload: { text: 'Testing custom WhatsApp alert' },
      }),
    });
    const resEnqueue = await notificationsPostHandler(reqEnqueue);
    expect(resEnqueue.status).toBe(200);

    const reqBatchProcess = new Request('http://localhost/api/admin/notifications/process', {
      method: 'POST',
      headers: { 'Cookie': `admin_token=${mockCookiesStore['admin_token']}` },
    });
    const resBatchProcess = await notificationsProcessHandler(reqBatchProcess);
    expect(resBatchProcess.status).toBe(200);
    const bodyBatch = await resBatchProcess.json();
    expect(bodyBatch.success).toBe(true);
    expect(bodyBatch.result.processed).toBeGreaterThanOrEqual(1);
  });
});
