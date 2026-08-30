import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { getAdminFromRequest, comparePassword, hashPassword, signToken } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

// GET: Retrieve current admin account details
export async function GET(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: admin.id },
      select: { id: true, email: true, name: true, status: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Admin account not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Fetch admin profile error:', error);
    return NextResponse.json({ error: 'Failed to retrieve admin details.' }, { status: 500 });
  }
}

// PATCH: Update admin email/username and/or password
export async function PATCH(req: Request) {
  try {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newEmail, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required to make credential changes.' },
        { status: 400 }
      );
    }

    // Retrieve the user record with password hash
    const user = await prisma.user.findUnique({
      where: { id: admin.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'Admin account not found.' }, { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect. Please try again.' },
        { status: 400 }
      );
    }

    const updateData: { email?: string; password?: string } = {};

    // Validate new email
    if (newEmail && newEmail.trim() !== '') {
      const cleanEmail = newEmail.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return NextResponse.json(
          { error: 'Please enter a valid email address.' },
          { status: 400 }
        );
      }

      if (cleanEmail !== user.email.toLowerCase()) {
        const existingUser = await prisma.user.findFirst({
          where: {
            email: cleanEmail,
            id: { not: user.id },
          },
        });
        if (existingUser) {
          return NextResponse.json(
            { error: `The email "${cleanEmail}" is already in use by another account.` },
            { status: 400 }
          );
        }
        updateData.email = cleanEmail;
      }
    }

    // Validate new password
    if (newPassword && newPassword.trim() !== '') {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters long.' },
          { status: 400 }
        );
      }
      updateData.password = await hashPassword(newPassword);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No changes provided. Please enter a new email or new password.' },
        { status: 400 }
      );
    }

    // Update in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // Refresh session token
    const token = signToken({
      userId: updatedUser.id,
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
      message: 'Admin credentials updated successfully.',
      email: updatedUser.email,
    });
  } catch (error) {
    console.error('Update credentials error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update credentials.' },
      { status: 500 }
    );
  }
}
