const https = require('https');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request({ ...options, family: 4 }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: JSON.parse(body),
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: body,
          });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runAudit() {
  console.log('=== TVK-UP AUTHORITATIVE LIVE DATABASE AUDIT (IPv4) ===');

  // 1. Counter Check
  const counterRes = await request({
    hostname: 'skyblue-tarsier-268054.hostingersite.com',
    path: '/api/member/counter?allDistricts=true',
    method: 'GET',
  });
  console.log('\n1. PUBLIC AGGREGATE LIVE COUNTER:');
  console.log('   - Total Active Members (Statewide):', counterRes.data.activeMembers);
  console.log('   - Total Registered Members (All):', counterRes.data.totalMembers);
  console.log('   - Current ID:', counterRes.data.currentId);
  console.log('   - Bulandshahr Active Members:', counterRes.data.allDistricts?.Bulandshahr);
  console.log('   - Lucknow Active Members:', counterRes.data.allDistricts?.Lucknow);
  console.log('   - Varanasi Active Members:', counterRes.data.allDistricts?.Varanasi);

  // 2. Admin Login
  const loginRes = await request(
    {
      hostname: 'skyblue-tarsier-268054.hostingersite.com',
      path: '/api/admin/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@tvkup.org', password: 'Admin@123' }
  );

  const cookie = (loginRes.headers['set-cookie'] || [])[0] || '';
  const token = cookie.split(';')[0];
  console.log('\n2. ADMIN AUTHENTICATION: Status', loginRes.statusCode);

  // 3. Admin Members API
  const adminRes = await request({
    hostname: 'skyblue-tarsier-268054.hostingersite.com',
    path: '/api/admin/members',
    method: 'GET',
    headers: { Cookie: token },
  });

  console.log('\n3. ADMIN PORTAL METRICS:');
  console.log('   - Database Authoritative Stats:', adminRes.data.stats);
  console.log('   - Member Rows in DB:', adminRes.data.members?.length);
  console.log('   - Database Registered Members:');
  adminRes.data.members?.forEach((m) => {
    console.log(`     * [${m.membershipId}] ${m.fullName} | Status: ${m.status} | District: ${m.district?.name} | Assembly: ${m.assembly?.name}`);
  });
}

runAudit();
