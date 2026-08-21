import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { comparePassword, signToken } from '../../../../lib/auth';

import { checkRateLimit, getClientIp } from '../../../../lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`login_${ip}`, 10, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in 1 minute.' },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Load user and verify
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        adminUser: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || user.status !== 'ACTIVE' || !user.adminUser) {
      return NextResponse.json({ error: 'Invalid admin credentials or inactive account.' }, { status: 401 });
    }

    // Validate password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
    }

    // Sign session token
    const token = signToken({
      userId: user.id,
      type: 'ADMIN',
    });

    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.adminUser.role.name,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    const msg = error instanceof Error ? error.message : 'Login failed';

    // Detect DATABASE_URL misconfiguration and return a clear actionable error
    if (
      msg.includes('invalid domain character') ||
      msg.includes('Error parsing connection string') ||
      msg.includes('database string is invalid') ||
      msg.includes('P1001') ||
      msg.includes('ECONNREFUSED') ||
      msg.includes('connect ETIMEDOUT')
    ) {
      return NextResponse.json(
        {
          error:
            'Database connection failed. The DATABASE_URL environment variable on the server is misconfigured or missing. Please update it in your Hostinger Node.js environment settings with the correct Supabase connection string.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Unable to sign in. Please check your credentials and try again.' },
      { status: 500 }
    );
  }
}
