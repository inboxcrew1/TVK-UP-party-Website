const { execSync } = require('child_process');

try {
  const ts = Date.now();
  console.log(`=== FETCHING UNCACHED FRESH HTML WITH TIMESTAMP ${ts} ===`);
  const html = execSync(`curl.exe -s -H "Cache-Control: no-cache" -H "Pragma: no-cache" "https://skyblue-tarsier-268054.hostingersite.com/?cb=${ts}"`).toString();

  const cssMatches = html.match(/(\/_next\/static\/[a-zA-Z0-9_\/.-]+\.css)/g) || [];
  const jsMatches = html.match(/(\/_next\/static\/[a-zA-Z0-9_\/.-]+\.js)/g) || [];

  const uniqueCss = [...new Set(cssMatches)];
  const uniqueJs = [...new Set(jsMatches)];

  console.log('Unique CSS referenced in fresh HTML:', uniqueCss);
  console.log('Unique JS referenced in fresh HTML:', uniqueJs);

  for (const css of uniqueCss) {
    const url = `https://skyblue-tarsier-268054.hostingersite.com${css}`;
    console.log(`\nTesting CSS: ${url}`);
    console.log(execSync(`curl.exe -I -s "${url}"`).toString());
  }

  for (const js of uniqueJs.slice(0, 3)) {
    const url = `https://skyblue-tarsier-268054.hostingersite.com${js}`;
    console.log(`\nTesting JS: ${url}`);
    console.log(execSync(`curl.exe -I -s "${url}"`).toString());
  }
} catch (err) {
  console.error('Error in test:', err);
}
