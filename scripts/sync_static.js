const fs = require('fs');
const path = require('path');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Source directory does not exist: ${src}`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const nextStaticDir = path.join(__dirname, '..', '.next', 'static');
const publicNextStaticDir = path.join(__dirname, '..', 'public', '_next', 'static');

console.log('--- SYNCING .next/static TO public/_next/static FOR LITESPEED / HOSTINGER ---');
console.log(`From: ${nextStaticDir}`);
console.log(`To:   ${publicNextStaticDir}`);

try {
  copyDirRecursive(nextStaticDir, publicNextStaticDir);
  console.log('SUCCESS: Static CSS, JS, and chunks successfully synced to public folder!');
} catch (err) {
  console.error('Error syncing static files:', err);
}
