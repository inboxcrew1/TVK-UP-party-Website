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
const rootNextStaticDir = path.join(__dirname, '..', '_next', 'static');

console.log('--- POST-BUILD: POPULATING STATIC DIRECTORIES FOR LITESPEED WEB SERVER ---');
try {
  copyDirRecursive(nextStaticDir, publicNextStaticDir);
  copyDirRecursive(nextStaticDir, rootNextStaticDir);
  console.log('SUCCESS: Static assets synchronized to both public/_next/static and _next/static!');
} catch (err) {
  console.error('Error copying static assets:', err);
}
