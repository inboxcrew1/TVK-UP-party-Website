const { execSync } = require('child_process');

const pages = [
  '/',
  '/sadasyata',
  '/districts',
  '/about',
  '/leadership',
  '/ideology',
  '/history',
  '/gallery',
  '/wings',
  '/verify',
  '/admin/login',
  '/admin/dashboard'
];

console.log('=== VERIFYING ALL PRODUCTION PAGES & STYLESHEETS ===\n');

for (const page of pages) {
  const url = `https://skyblue-tarsier-268054.hostingersite.com${page}`;
  try {
    const head = execSync(`curl.exe -I -s "${url}"`).toString();
    const statusLine = head.split('\n')[0].trim();
    const isDynamic = head.includes('x-hcdn-cache-status: DYNAMIC') || head.includes('Cache-Control: public, max-age=0');
    console.log(`${page.padEnd(20)}: ${statusLine} | Dynamic: ${isDynamic ? 'YES (Fresh)' : 'Cached'}`);
  } catch (err) {
    console.error(`Failed ${page}:`, err.message);
  }
}

// Check CSS and JS chunk delivery
console.log('\n=== CHECKING ACTIVE CSS AND JS CHUNKS ON LIVE SERVER ===');
const html = execSync('curl.exe -s "https://skyblue-tarsier-268054.hostingersite.com/sadasyata"').toString();
const cssMatches = [...new Set(html.match(/\/(_next\/static\/[a-zA-Z0-9_\/.-]+\.css)/g) || [])];

console.log(`Found ${cssMatches.length} CSS files on /sadasyata:`);
for (const css of cssMatches) {
  const fullUrl = `https://skyblue-tarsier-268054.hostingersite.com${css}`;
  const res = execSync(`curl.exe -I -s "${fullUrl}"`).toString();
  const status = res.split('\n')[0].trim();
  const contentType = (res.match(/Content-Type:[^\r\n]+/i) || [''])[0];
  console.log(`  ${css} -> ${status} | ${contentType}`);
}

console.log('\n=== API ENDPOINTS HEALTH CHECK ===');
const apis = ['/api/member/counter', '/api/geo/districts'];
for (const api of apis) {
  const fullUrl = `https://skyblue-tarsier-268054.hostingersite.com${api}`;
  const res = execSync(`curl.exe -s "${fullUrl}"`).toString();
  console.log(`  ${api} -> ${res.slice(0, 100)}`);
}
