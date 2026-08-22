const fs = require('fs');
const path = require('path');

const publicNextDir = path.join(__dirname, '..', 'public', '_next');
const rootNextDir = path.join(__dirname, '..', '_next');

if (fs.existsSync(publicNextDir)) {
  fs.rmSync(publicNextDir, { recursive: true, force: true });
}

if (fs.existsSync(rootNextDir)) {
  fs.rmSync(rootNextDir, { recursive: true, force: true });
}

console.log('Cleaned static directories before build.');
