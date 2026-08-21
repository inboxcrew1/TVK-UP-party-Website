const https = require('https');

const routes = [
  '/',
  '/about',
  '/leadership',
  '/ideology',
  '/districts',
  '/districts/lucknow',
  '/districts/bulandshahr',
  '/districts/varanasi',
  '/sadasyata',
  '/gallery',
  '/elections',
  '/history',
  '/wings',
  '/verify',
  '/admin/login',
  '/api/member/counter?allDistricts=true',
  '/api/geo/states',
  '/api/geo/districts?stateId=state-up'
];

async function checkRoute(r) {
  return new Promise((resolve) => {
    const req = https.get('https://skyblue-tarsier-268054.hostingersite.com' + r, { family: 4, timeout: 10000 }, (res) => {
      resolve({ route: r, status: res.statusCode });
    });
    req.on('error', (err) => {
      resolve({ route: r, error: err.message });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ route: r, error: 'TIMEOUT' });
    });
  });
}

async function run() {
  console.log('=== TVK UTTAR PRADESH PORTAL — PRODUCTION ROUTE AUDIT ===');
  let pass = 0;
  for (const r of routes) {
    const result = await checkRoute(r);
    if (result.status === 200) {
      console.log(`[HTTP 200] ${r} -> OK`);
      pass++;
    } else {
      console.log(`[HTTP ${result.status || 'ERR'}] ${r} -> ${result.error || 'Failed'}`);
    }
  }
  console.log(`\nResult: ${pass}/${routes.length} routes operational.`);
}

run();
