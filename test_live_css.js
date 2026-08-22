const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, { family: 4 }, (res) => {
      let body = '';
      res.on('data', (d) => (body += d));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    }).on('error', (err) => resolve({ status: 500, headers: {}, body: err.message }));
  });
}

async function run() {
  console.log('=== INSPECTING LIVE HTML & STYLESHEETS ===');
  const main = await fetch('https://skyblue-tarsier-268054.hostingersite.com/');
  console.log('Main Page HTTP Status:', main.status);
  console.log('Main Page Content-Type:', main.headers['content-type']);

  const links = main.body.match(/<link[^>]+>/gi) || [];
  console.log(`Found ${links.length} total <link> tags in live HTML.`);

  const cssLinks = links.filter((l) => l.includes('stylesheet') || l.includes('.css'));
  console.log('CSS Link Tags found:', cssLinks);

  for (const l of cssLinks) {
    const match = l.match(/href=["']([^"']+)["']/i);
    if (match && match[1]) {
      const href = match[1];
      const fullUrl = href.startsWith('http') ? href : 'https://skyblue-tarsier-268054.hostingersite.com' + href;
      const res = await fetch(fullUrl);
      console.log(`\nTesting CSS: ${fullUrl}`);
      console.log(`  Status: ${res.status}`);
      console.log(`  Content-Type: ${res.headers['content-type']}`);
      console.log(`  Body Length: ${res.body.length} bytes`);
      console.log(`  First 120 chars: ${res.body.substring(0, 120)}...`);
    }
  }

  const scripts = main.body.match(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi) || [];
  console.log(`\nFound ${scripts.length} script tags with src:`);
  for (const s of scripts.slice(0, 3)) {
    const match = s.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) {
      const src = match[1];
      const fullUrl = src.startsWith('http') ? src : 'https://skyblue-tarsier-268054.hostingersite.com' + src;
      const res = await fetch(fullUrl);
      console.log(`Testing JS: ${fullUrl} -> Status: ${res.status}, Content-Type: ${res.headers['content-type']}`);
    }
  }
}

run();
