import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding TVK UP Portal database...');

  // 1. Seed Permissions
  const permissionsData = [
    { name: 'view_members', description: 'Can view members' },
    { name: 'create_member', description: 'Can create/register new members' },
    { name: 'edit_member', description: 'Can edit member profiles' },
    { name: 'approve_member', description: 'Can approve pending memberships' },
    { name: 'reject_member', description: 'Can reject pending memberships' },
    { name: 'suspend_member', description: 'Can suspend active memberships' },
    { name: 'export_members', description: 'Can export members list to Excel/CSV' },
    { name: 'import_members', description: 'Can import members list from Excel' },
    { name: 'generate_cards', description: 'Can generate digital ID cards' },
    { name: 'manage_districts', description: 'Can manage district configurations' },
    { name: 'manage_assemblies', description: 'Can manage assembly configurations' },
    { name: 'manage_posts', description: 'Can manage party posts' },
    { name: 'manage_events', description: 'Can manage events' },
    { name: 'manage_announcements', description: 'Can manage CMS announcements' },
    { name: 'manage_gallery', description: 'Can manage gallery media' },
    { name: 'manage_admin_users', description: 'Can manage administrative users' },
    { name: 'view_audit_logs', description: 'Can view security audit logs' },
    { name: 'manage_settings', description: 'Can edit system setting parameters' },
  ];

  console.log('Creating permissions...');
  const permissionsMap: Record<string, string> = {};
  for (const perm of permissionsData) {
    const record = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
    permissionsMap[perm.name] = record.id;
  }

  // 2. Seed Roles
  const rolesData = [
    {
      name: 'SUPER_ADMIN',
      description: 'Full system administrator with global permissions',
      permissions: Object.keys(permissionsMap),
    },
    {
      name: 'NATIONAL_ADMIN',
      description: 'National level administrator',
      permissions: [
        'view_members', 'create_member', 'edit_member', 'export_members',
        'generate_cards', 'manage_posts', 'manage_events', 'manage_announcements',
        'manage_gallery', 'view_audit_logs'
      ],
    },
    {
      name: 'STATE_ADMIN',
      description: 'State level administrator for Uttar Pradesh',
      permissions: [
        'view_members', 'create_member', 'edit_member', 'approve_member',
        'reject_member', 'suspend_member', 'export_members', 'generate_cards',
        'manage_posts', 'manage_events', 'manage_announcements', 'manage_gallery'
      ],
    },
    {
      name: 'DISTRICT_ADMIN',
      description: 'District level scoped administrator',
      permissions: [
        'view_members', 'create_member', 'edit_member', 'approve_member',
        'reject_member', 'generate_cards', 'manage_events'
      ],
    },
    {
      name: 'ASSEMBLY_ADMIN',
      description: 'Assembly constituency level scoped administrator',
      permissions: [
        'view_members', 'create_member', 'generate_cards'
      ],
    },
    {
      name: 'VERIFICATION_OFFICER',
      description: 'Officer dedicated to membership card and document verification',
      permissions: [
        'view_members', 'approve_member', 'reject_member', 'generate_cards'
      ],
    },
    {
      name: 'DATA_ENTRY_OPERATOR',
      description: 'Agent for typing in membership forms',
      permissions: [
        'create_member'
      ],
    },
    {
      name: 'REPORT_VIEWER',
      description: 'Auditor who can only view statistics and generated reports',
      permissions: [
        'view_members'
      ],
    },
  ];

  console.log('Creating roles and mapping permissions...');
  const rolesMap: Record<string, string> = {};
  for (const r of rolesData) {
    const roleRecord = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: {
        name: r.name,
        description: r.description,
      },
    });
    rolesMap[r.name] = roleRecord.id;

    // Link permissions
    for (const permName of r.permissions) {
      const permId = permissionsMap[permName];
      if (permId) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: roleRecord.id,
              permissionId: permId,
            },
          },
          update: {},
          create: {
            roleId: roleRecord.id,
            permissionId: permId,
          },
        });
      }
    }
  }

  // 3. Seed State & Geographic Hierarchy (UP)
  console.log('Creating geographic hierarchy for Uttar Pradesh...');
  const upState = await prisma.state.upsert({
    where: { code: 'UP' },
    update: {},
    create: {
      name: 'Uttar Pradesh',
      code: 'UP',
    },
  });

  // Seed districts
  const districtsData = [
    {
      name: 'Bulandshahr',
      assemblies: [
        'Bulandshahr', 'Syana', 'Anupshahr', 'Debai', 'Shikarpur', 'Khurja', 'Secunderabad'
      ]
    },
    {
      name: 'Ghaziabad',
      assemblies: [
        'Loni', 'Muradnagar', 'Sahibabad', 'Ghaziabad', 'Modinagar'
      ]
    },
    { name: 'Meerut', assemblies: ['Meerut Cantt.', 'Meerut', 'Meerut South'] },
    { name: 'Lucknow', assemblies: ['Lucknow East', 'Lucknow West', 'Lucknow Central'] },
    { name: 'Gautam Buddha Nagar', assemblies: ['Noida', 'Dadri', 'Jewar'] },
    { name: 'Kanpur Nagar', assemblies: ['Kanpur Cantt.', 'Aryanagar', 'Kalyanpur'] },
    { name: 'Varanasi', assemblies: ['Varanasi North', 'Varanasi South', 'Varanasi Cantt.'] },
    { name: 'Agra', assemblies: ['Agra North', 'Agra South', 'Agra Cantt.'] },
    { name: 'Gorakhpur', assemblies: ['Gorakhpur Urban', 'Gorakhpur Rural'] },
    { name: 'Prayagraj', assemblies: ['Allahabad North', 'Allahabad South', 'Allahabad West'] },
  ];

  for (const d of districtsData) {
    const districtRecord = await prisma.district.upsert({
      where: {
        name_stateId: {
          name: d.name,
          stateId: upState.id,
        },
      },
      update: {},
      create: {
        name: d.name,
        stateId: upState.id,
      },
    });

    for (const aName of d.assemblies) {
      await prisma.assembly.upsert({
        where: {
          name_districtId: {
            name: aName,
            districtId: districtRecord.id,
          },
        },
        update: {},
        create: {
          name: aName,
          districtId: districtRecord.id,
        },
      });
    }
  }

  // 4. Seed Super Admin Users
  console.log('Creating Super Admin accounts...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Admin@123', salt);

  const superAdminRole = rolesMap['SUPER_ADMIN'];

  const adminEmails = ['superadmin@tvkup.org', 'admin@tvkup.org'];

  for (const email of adminEmails) {
    const adminUserRecord = await prisma.user.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: {
        email,
        password: hashedPassword,
        name: email.startsWith('super') ? 'Super Admin' : 'TVK Admin Officer',
        status: 'ACTIVE',
      },
    });

    await prisma.adminUser.upsert({
      where: { userId: adminUserRecord.id },
      update: {},
      create: {
        userId: adminUserRecord.id,
        roleId: superAdminRole,
      },
    });
  }

  // 5. Seed Party Posts
  const partyPosts = [
    { title: 'State President', scope: 'STATE', level: 1, description: 'Highest state-level post' },
    { title: 'State General Secretary', scope: 'STATE', level: 2, description: 'Key state organizer' },
    { title: 'State Treasurer', scope: 'STATE', level: 2, description: 'Handles state finance' },
    { title: 'District President', scope: 'DISTRICT', level: 3, description: 'District leader' },
    { title: 'District Secretary', scope: 'DISTRICT', level: 4, description: 'District organizer' },
    { title: 'Assembly President', scope: 'ASSEMBLY', level: 5, description: 'Assembly leader' },
  ];

  console.log('Creating party posts...');
  for (const post of partyPosts) {
    await prisma.partyPost.upsert({
      where: { title: post.title },
      update: {},
      create: post,
    });
  }

  console.log('Seeding complete! Default Super Admin: email="superadmin@tvkup.org" password="Admin@123"');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
