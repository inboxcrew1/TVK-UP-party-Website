import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const SESSION_SECRET = process.env.SESSION_SECRET || 'your-default-session-secret-at-least-32-chars';

// SESSION_SECRET production security check
if (process.env.NODE_ENV === 'production' && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.includes('default'))) {
  console.warn('WARNING: SESSION_SECRET is using a default or unconfigured key in production environment.');
}

export interface TokenPayload {
  userId: string;
  role?: string;
  type: 'ADMIN' | 'MEMBER';
}

export interface AdminScopeItem {
  id: string;
  adminUserId: string;
  stateId: string | null;
  districtId: string | null;
  assemblyId: string | null;
  createdAt: Date;
}

export interface AdminSession {
  id: string;
  adminUserId: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  scopes: AdminScopeItem[];
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export function signToken(payload: TokenPayload, expiresIn = '24h'): string {
  return jwt.sign(payload, SESSION_SECRET, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, SESSION_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// Extract cookies from standard Request headers
export function getCookieValue(req: Request, cookieName: string): string | null {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map(c => c.trim());
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === cookieName) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export async function getAdminFromRequest(req: Request): Promise<AdminSession | null> {
  const token = getCookieValue(req, 'admin_token');
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || payload.type !== 'ADMIN') return null;

  // Retrieve user, role, permissions, and scopes
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      adminUser: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
          scopes: true,
        },
      },
    },
  });

  if (!user || user.status !== 'ACTIVE' || !user.adminUser) {
    return null;
  }

  const permissions = user.adminUser.role.permissions.map(rp => rp.permission.name);

  return {
    id: user.id,
    adminUserId: user.adminUser.id,
    email: user.email,
    name: user.name,
    role: user.adminUser.role.name,
    permissions,
    scopes: user.adminUser.scopes,
  };
}

export async function getMemberFromRequest(req: Request) {
  const token = getCookieValue(req, 'member_token');
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || payload.type !== 'MEMBER') return null;

  const member = await prisma.member.findUnique({
    where: { id: payload.userId },
  });

  if (!member) return null;

  return member;
}

// RBAC checks
export function hasPermission(admin: AdminSession | null, permissionName: string): boolean {
  if (!admin) return false;
  if (admin.role === 'SUPER_ADMIN') return true;
  return admin.permissions.includes(permissionName);
}

// Check scope constraints for scoped admins
export function checkAdminScope(admin: AdminSession | null, target: { stateId?: string; districtId?: string; assemblyId?: string }): boolean {
  if (!admin) return false;
  if (admin.role === 'SUPER_ADMIN' || admin.role === 'NATIONAL_ADMIN') return true;

  const scopes = admin.scopes;
  if (!scopes || scopes.length === 0) return false;

  // For STATE_ADMIN, check if target state matches their scope
  if (admin.role === 'STATE_ADMIN') {
    if (!target.stateId) return true; // generic read
    return scopes.some((s: AdminScopeItem) => s.stateId === target.stateId);
  }

  // For DISTRICT_ADMIN, check if target district matches their scope
  if (admin.role === 'DISTRICT_ADMIN') {
    if (!target.districtId) return false; // must specify district
    return scopes.some((s: AdminScopeItem) => s.districtId === target.districtId);
  }

  // For ASSEMBLY_ADMIN, check if target assembly matches their scope
  if (admin.role === 'ASSEMBLY_ADMIN') {
    if (!target.assemblyId) return false; // must specify assembly
    return scopes.some((s: AdminScopeItem) => s.assemblyId === target.assemblyId);
  }

  return false;
}
