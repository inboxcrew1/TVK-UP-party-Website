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
import { GET as postsGetHandler } from '../app/api/admin/posts/route';
import { GET as bearersGetHandler, POST as bearerPostHandler } from '../app/api/admin/bearers/route';
import { PUT as bearerPutHandler, DELETE as bearerDeleteHandler } from '../app/api/admin/bearers/[id]/route';

describe('Party Posts and Office Bearers Integration Tests', () => {
  let stateId = '';
  let postId = '';
  let bearerId = '';

  beforeAll(async () => {
    mockCookiesStore = {};

    const state = await prisma.state.findUnique({ where: { code: 'UP' } });
    if (!state) throw new Error('State seed missing');
    stateId = state.id;

    // Seed a test party post if none exists
    const post = await prisma.partyPost.upsert({
      where: { title: 'State General Secretary Test' },
      update: {},
      create: {
        title: 'State General Secretary Test',
        scope: 'STATE',
        level: 2,
        description: 'Test State General Secretary Post',
      },
    });
    postId = post.id;
  });

  afterAll(async () => {
    mockCookiesStore = {};
    if (bearerId) {
      await prisma.officeBearer.deleteMany({ where: { id: bearerId } });
    }
    if (postId) {
      await prisma.partyPost.deleteMany({ where: { id: postId } });
    }
  });

  it('should authenticate admin and perform full CRUD on office bearers', async () => {
    // 1. Super Admin Login
    const reqLogin = new Request('http://localhost/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'superadmin@tvkup.org',
        password: 'Admin@123',
      }),
    });
    const resLogin = await adminLoginHandler(reqLogin);
    expect(resLogin.status).toBe(200);
    const loginData = await resLogin.json();
    expect(loginData.success).toBe(true);

    // 2. GET Party Posts
    const reqPosts = new Request('http://localhost/api/admin/posts', {
      method: 'GET',
      headers: { 'Cookie': `admin_token=${mockCookiesStore['admin_token']}` },
    });
    const resPosts = await postsGetHandler(reqPosts);
    expect(resPosts.status).toBe(200);
    const postsData = await resPosts.json();
    expect(postsData.success).toBe(true);
    expect(Array.isArray(postsData.posts)).toBe(true);
    expect(postsData.posts.some((p: { id: string }) => p.id === postId)).toBe(true);

    // 3. Appoint Office Bearer (POST /api/admin/bearers)
    const reqCreateBearer = new Request('http://localhost/api/admin/bearers', {
      method: 'POST',
      headers: { 'Cookie': `admin_token=${mockCookiesStore['admin_token']}` },
      body: JSON.stringify({
        name: 'Ramesh Verma',
        postId: postId,
        stateId: stateId,
        bio: 'Dedicated state leader',
        email: 'ramesh.verma@example.com',
        mobile: '+919876543210',
        publicVisibility: true,
      }),
    });
    const resCreateBearer = await bearerPostHandler(reqCreateBearer);
    expect(resCreateBearer.status).toBe(200);
    const createData = await resCreateBearer.json();
    expect(createData.success).toBe(true);
    expect(createData.bearer.name).toBe('Ramesh Verma');
    bearerId = createData.bearer.id;

    // 4. Fetch Office Bearers (GET /api/admin/bearers)
    const reqGetBearers = new Request('http://localhost/api/admin/bearers', {
      method: 'GET',
      headers: { 'Cookie': `admin_token=${mockCookiesStore['admin_token']}` },
    });
    const resGetBearers = await bearersGetHandler(reqGetBearers);
    expect(resGetBearers.status).toBe(200);
    const getData = await resGetBearers.json();
    expect(getData.success).toBe(true);
    expect(getData.bearers.some((b: { id: string }) => b.id === bearerId)).toBe(true);

    // 5. Update Office Bearer (PUT /api/admin/bearers/[id])
    const reqUpdateBearer = new Request(`http://localhost/api/admin/bearers/${bearerId}`, {
      method: 'PUT',
      headers: { 'Cookie': `admin_token=${mockCookiesStore['admin_token']}` },
      body: JSON.stringify({
        name: 'Ramesh Verma (Senior)',
        bio: 'Senior State Leader',
        status: 'ACTIVE',
      }),
    });
    const resUpdateBearer = await bearerPutHandler(reqUpdateBearer, {
      params: Promise.resolve({ id: bearerId }),
    });
    expect(resUpdateBearer.status).toBe(200);
    const updateData = await resUpdateBearer.json();
    expect(updateData.success).toBe(true);
    expect(updateData.bearer.name).toBe('Ramesh Verma (Senior)');
    expect(updateData.bearer.bio).toBe('Senior State Leader');

    // 6. Delete Office Bearer (DELETE /api/admin/bearers/[id])
    const reqDeleteBearer = new Request(`http://localhost/api/admin/bearers/${bearerId}`, {
      method: 'DELETE',
      headers: { 'Cookie': `admin_token=${mockCookiesStore['admin_token']}` },
    });
    const resDeleteBearer = await bearerDeleteHandler(reqDeleteBearer, {
      params: Promise.resolve({ id: bearerId }),
    });
    expect(resDeleteBearer.status).toBe(200);
    const deleteData = await resDeleteBearer.json();
    expect(deleteData.success).toBe(true);

    // Reset bearerId so cleanup doesn't error out
    bearerId = '';
  });
});
