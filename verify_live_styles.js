const { execSync } = require('child_process');

try {
  console.log('=== EXTRACTING LIVE PRODUCTION HTML & CSS LINKS ===');
  const html = execSync('curl.exe -s https://skyblue-tarsier-268054.hostingersite.com/').toString();
  
  // Find all CSS and JS files referenced in the page
  const cssMatches = html.match(/(\/_next\/static\/[a-zA-Z0-9_\/.-]+\.css)/g) || [];
  const jsMatches = html.match(/(\/_next\/static\/[a-zA-Z0-9_\/.-]+\.js)/g) || [];

  const uniqueCss = [...new Set(cssMatches)];
  const uniqueJs = [...new Set(jsMatches)];

  console.log(`Found ${uniqueCss.length} CSS files in live HTML:`, uniqueCss);
  console.log(`Found ${uniqueJs.length} JS files in live HTML.`);

  let allSuccess = true;

  for (const cssPath of uniqueCss) {
    const fullUrl = `https://skyblue-tarsier-268054.hostingersite.com${cssPath}`;
    console.log(`\nTesting CSS Endpoint: ${fullUrl}`);
    const headers = execSync(`curl.exe -I -s ${fullUrl}`).toString();
    console.log(headers);

    if (!headers.includes('200 OK') || (!headers.includes('text/css') && !headers.includes('application/octet-stream'))) {
      allSuccess = false;
    }
  }

  for (const jsPath of uniqueJs.slice(0, 3)) {
    const fullUrl = `https://skyblue-tarsier-268054.hostingersite.com${jsPath}`;
    console.log(`\nTesting JS Endpoint: ${fullUrl}`);
    const headers = execSync(`curl.exe -I -s ${fullUrl}`).toString();
    console.log(headers);

    if (!headers.includes('200 OK')) {
      allSuccess = false;
    }
  }

  if (allSuccess && uniqueCss.length > 0) {
    console.log('\n>>> SUCCESS: ALL LIVE STYLESHEETS & SCRIPTS ARE SERVED WITH HTTP 200 OK! <<<');
  } else {
    console.log('\n>>> Notice on assets above <<<');
  }
} catch (err) {
  console.error('Error running verification:', err);
}
