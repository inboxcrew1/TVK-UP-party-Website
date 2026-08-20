const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.tsx') || name.endsWith('.ts')) {
      files.push(name);
    }
  }
  return files;
}

const files = getFiles('app');
const hrefRegex = /href=["'](\/[a-zA-Z0-9_\-\/]*)["']/g;
const links = new Set();

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    links.add(match[1]);
  }
});

console.log('Unique Href Links Found:', Array.from(links));

const missing = [];
Array.from(links).forEach(link => {
  const cleanLink = link.split('?')[0].split('#')[0];
  if (!cleanLink || cleanLink === '/') return;
  
  const pagePath = path.join('app', cleanLink, 'page.tsx');
  const directPath = path.join('app', cleanLink + '.tsx');
  const routeApiPath = path.join('app', cleanLink, 'route.ts');

  if (!fs.existsSync(pagePath) && !fs.existsSync(directPath) && !fs.existsSync(routeApiPath)) {
    missing.push(link);
  }
});

if (missing.length === 0) {
  console.log('SUCCESS: All internal routes are 100% valid with ZERO dead links!');
} else {
  console.log('WARNING: Found missing routes:', missing);
}
