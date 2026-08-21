const https = require('https');

https.get('https://skyblue-tarsier-268054.hostingersite.com', { family: 4 }, (res) => {
  let body = '';
  res.on('data', (c) => (body += c));
  res.on('end', () => {
    console.log('HTML length:', body.length);
    const cssMatches = body.match(/href="([^"]+\.css[^"]*)"/g);
    const jsMatches = body.match(/src="([^"]+\.js[^"]*)"/g);
    console.log('CSS Matches:', cssMatches);
    console.log('JS Matches sample:', (jsMatches || []).slice(0, 5));

    if (cssMatches && cssMatches.length > 0) {
      const cssPath = cssMatches[0].replace('href="', '').replace('"', '');
      console.log('\nTesting CSS Fetch:', cssPath);
      https.get('https://skyblue-tarsier-268054.hostingersite.com' + cssPath, { family: 4 }, (cssRes) => {
        console.log('CSS Response Status:', cssRes.statusCode);
        console.log('CSS Content-Type:', cssRes.headers['content-type']);
        let cssBody = '';
        cssRes.on('data', (d) => (cssBody += d));
        cssRes.on('end', () => {
          console.log('CSS Body length:', cssBody.length);
          console.log('CSS Body preview:', cssBody.slice(0, 200));
        });
      });
    }
  });
});
