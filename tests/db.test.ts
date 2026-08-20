import { describe, it, expect } from 'vitest';
import { prisma } from '../lib/prisma';

describe('Database Integration Test', () => {
  it('should be able to query the seeded Super Admin user', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'superadmin@tvkup.org' },
      include: {
        adminUser: {
          include: {
            role: true,
          },
        },
      },
    });

    expect(user).not.toBeNull();
    expect(user?.name).toBe('Super Admin');
    expect(user?.adminUser?.role.name).toBe('SUPER_ADMIN');
  });

  it('should verify seeded geographic structure', async () => {
    const upState = await prisma.state.findUnique({
      where: { code: 'UP' },
      include: {
        districts: {
          include: {
            assemblies: true,
          },
        },
      },
    });

    expect(upState).not.toBeNull();
    expect(upState?.name).toBe('Uttar Pradesh');
    expect(upState?.districts.length).toBeGreaterThan(0);

    const bulandshahr = upState?.districts.find((d) => d.name === 'Bulandshahr');
    expect(bulandshahr).toBeDefined();
    expect(bulandshahr?.assemblies.length).toBe(7); // Seeded 7 assemblies
  });
});
