import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { prisma } from '../lib/prisma';

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
import { GET as publicAnnouncementsHandler } from '../app/api/cms/announcements/route';
import { GET as publicEventsHandler } from '../app/api/cms/events/route';
import { GET as publicGalleryHandler } from '../app/api/cms/gallery/route';

import { GET as adminAnnouncementsGetHandler, POST as adminAnnouncementsPostHandler } from '../app/api/admin/cms/announcements/route';
import { PUT as adminAnnouncementPutHandler, DELETE as adminAnnouncementDeleteHandler } from '../app/api/admin/cms/announcements/[id]/route';

import { GET as adminEventsGetHandler, POST as adminEventsPostHandler } from '../app/api/admin/cms/events/route';
import { PUT as adminEventPutHandler, DELETE as adminEventDeleteHandler } from '../app/api/admin/cms/events/[id]/route';

import { GET as adminGalleryGetHandler, POST as adminGalleryPostHandler } from '../app/api/admin/cms/gallery/route';
import { DELETE as adminGalleryDeleteHandler } from '../app/api/admin/cms/gallery/[id]/route';

describe('CMS Engine Integration Tests', () => {
  let announcementId = '';
  let eventId = '';
  let albumId = '';

  beforeAll(async () => {
    mockCookiesStore = {};
  });

  afterAll(async () => {
    mockCookiesStore = {};
    if (announcementId) {
      await prisma.announcement.deleteMany({ where: { id: announcementId } });
    }
    if (eventId) {
      await prisma.event.deleteMany({ where: { id: eventId } });
    }
    if (albumId) {
      await prisma.galleryAlbum.deleteMany({ where: { id: albumId } });
    }
  });

  it('should authenticate admin and perform CRUD on announcements, events, and gallery', async () => {
    // 1. Admin Login
    const reqLogin = new Request('http://localhost/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'superadmin@tvkup.org',
        password: 'Admin@123',
      }),
    });
    const resLogin = await adminLoginHandler(reqLogin);
    expect(resLogin.status).toBe(200);

    // 2. Create Announcement (POST /api/admin/cms/announcements)
    const reqCreateAnn = new Request('http://localhost/api/admin/cms/announcements', {
      method: 'POST',
      headers: { 'Cookie': `admin_token=${mockCookiesStore['admin_token']}` },
      body: JSON.stringify({
        title: 'TVK UP State Convention 2026',
        content: 'Official state convention announced for all registered members.',
        category: 'PRESS_RELEASE',
        status: 'PUBLISHED',
      }),
    });
    const resCreateAnn = await adminAnnouncementsPostHandler(reqCreateAnn);
    expect(resCreateAnn.status).toBe(200);
    const annData = await resCreateAnn.json();
    expect(annData.success).toBe(true);
    announcementId = annData.announcement.id;

    // 3. Fetch Published Announcements Public Endpoint
    const resPubAnn = await publicAnnouncementsHandler();
    expect(resPubAnn.status).toBe(200);
    const pubAnnData = await resPubAnn.json();
    expect(pubAnnData.success).toBe(true);
    expect(pubAnnData.announcements.some((a: { id: string }) => a.id === announcementId)).toBe(true);

    // 4. Update Announcement
    const reqUpdateAnn = new Request(`http://localhost/api/admin/cms/announcements/${announcementId}`, {
      method: 'PUT',
      headers: { 'Cookie': `admin_token=${mockCookiesStore['admin_token']}` },
      body: JSON.stringify({
        title: 'TVK UP State Convention 2026 (Updated)',
      }),
    });
    const resUpdateAnn = await adminAnnouncementPutHandler(reqUpdateAnn, {
      params: Promise.resolve({ id: announcementId }),
    });
    expect(resUpdateAnn.status).toBe(200);

    // 5. Create Event (POST /api/admin/cms/events)
    const reqCreateEvent = new Request('http://localhost/api/admin/cms/events', {
      method: 'POST',
      headers: { 'Cookie': `admin_token=${mockCookiesStore['admin_token']}` },
      body: JSON.stringify({
        title: 'Lucknow Membership Drive',
        description: 'Join us at the grand membership drive in Lucknow.',
        location: 'Indira Gandhi Pratishthan, Lucknow',
        eventDate: '2026-09-15T10:00:00.000Z',
        status: 'PUBLISHED',
      }),
    });
    const resCreateEvent = await adminEventsPostHandler(reqCreateEvent);
    expect(resCreateEvent.status).toBe(200);
    const eventData = await resCreateEvent.json();
    expect(eventData.success).toBe(true);
    eventId = eventData.event.id;

    // 6. Fetch Public Events
    const reqPubEvent = new Request('http://localhost/api/cms/events', { method: 'GET' });
    const resPubEvent = await publicEventsHandler(reqPubEvent);
    expect(resPubEvent.status).toBe(200);
    const pubEventData = await resPubEvent.json();
    expect(pubEventData.success).toBe(true);
    expect(pubEventData.events.some((e: { id: string }) => e.id === eventId)).toBe(true);

    // 7. Create Gallery Album (POST /api/admin/cms/gallery)
    const reqCreateAlbum = new Request('http://localhost/api/admin/cms/gallery', {
      method: 'POST',
      headers: { 'Cookie': `admin_token=${mockCookiesStore['admin_token']}` },
      body: JSON.stringify({
        title: 'State Executive Meeting 2026',
        category: 'MEETINGS',
        images: [
          { imageUrl: 'https://example.com/photo1.jpg', caption: 'Inauguration' },
        ],
      }),
    });
    const resCreateAlbum = await adminGalleryPostHandler(reqCreateAlbum);
    expect(resCreateAlbum.status).toBe(200);
    const albumData = await resCreateAlbum.json();
    expect(albumData.success).toBe(true);
    albumId = albumData.album.id;

    // 8. Fetch Public Gallery
    const resPubGallery = await publicGalleryHandler();
    expect(resPubGallery.status).toBe(200);
    const pubGalleryData = await resPubGallery.json();
    expect(pubGalleryData.success).toBe(true);
    expect(pubGalleryData.albums.some((a: { id: string }) => a.id === albumId)).toBe(true);

    // 9. Clean up via DELETE endpoints
    const reqDelAnn = new Request(`http://localhost/api/admin/cms/announcements/${announcementId}`, {
      method: 'DELETE',
      headers: { 'Cookie': `admin_token=${mockCookiesStore['admin_token']}` },
    });
    await adminAnnouncementDeleteHandler(reqDelAnn, { params: Promise.resolve({ id: announcementId }) });
    announcementId = '';

    const reqDelEvent = new Request(`http://localhost/api/admin/cms/events/${eventId}`, {
      method: 'DELETE',
      headers: { 'Cookie': `admin_token=${mockCookiesStore['admin_token']}` },
    });
    await adminEventDeleteHandler(reqDelEvent, { params: Promise.resolve({ id: eventId }) });
    eventId = '';

    const reqDelAlbum = new Request(`http://localhost/api/admin/cms/gallery/${albumId}`, {
      method: 'DELETE',
      headers: { 'Cookie': `admin_token=${mockCookiesStore['admin_token']}` },
    });
    await adminGalleryDeleteHandler(reqDelAlbum, { params: Promise.resolve({ id: albumId }) });
    albumId = '';
  });
});
