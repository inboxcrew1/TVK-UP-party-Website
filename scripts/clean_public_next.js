const fs = require('fs');
const path = require('path');

const publicNextDir = path.join(__dirname, '..', 'public', '_next');

if (fs.existsSync(publicNextDir)) {
  console.log('Cleaning public/_next before build...');
  fs.rmSync(publicNextDir, { recursive: true, force: true });
  console.log('Cleaned public/_next successfully.');
}
