const https = require('https');

function checkAsset(url) {
  return new Promise((resolve) => {
    https.get(url, { family: 4 }, (res) => {
      const cType = res.headers['content-type'] || 'unknown';
      console.log(`[HTTP ${res.statusCode}] ${url} -> Content-Type: ${cType}`);
      resolve(res.statusCode === 200);
    }).on('error', (e) => {
      console.error('Fetch error:', url, e.message);
      resolve(false);
    });
  });
}

async function run() {
  console.log('=== VERIFYING PRODUCTION ASSETS ===');
  await checkAsset('https://skyblue-tarsier-268054.hostingersite.com/');
  await checkAsset('https://skyblue-tarsier-268054.hostingersite.com/media/tvk_official_logo.jpg');
  await checkAsset('https://skyblue-tarsier-268054.hostingersite.com/media/hero_slider_tvk_up.jpg');
  await checkAsset('https://skyblue-tarsier-268054.hostingersite.com/media/tvk_brand_icon.jpg');
  await checkAsset('https://skyblue-tarsier-268054.hostingersite.com/api/member/counter');
  await checkAsset('https://skyblue-tarsier-268054.hostingersite.com/api/geo/states');
  console.log('Asset audit complete.');
}

run();
