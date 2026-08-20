const fs = require('fs');
const path = require('path');
const https = require('https');

const assets = [
  { url: 'https://tvkassets.minsky.studio/media/leadership.png', file: 'leadership.jpg' },
  { url: 'https://tvkassets.minsky.studio/media/ideology.png', file: 'ideology.jpg' },
  { url: 'https://tvkassets.minsky.studio/media/puducherry_campaign.jpg', file: 'puducherry_campaign.jpg' },
  { url: 'https://tvkassets.minsky.studio/media/trichy_campaign_1.jpg', file: 'trichy_campaign.jpg' },
  { url: 'https://tvkassets.minsky.studio/media/perambur_nomination.jpg', file: 'perambur_nomination.jpg' },
];

const mediaDir = path.join(__dirname, '..', 'public', 'media');
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  for (const asset of assets) {
    const dest = path.join(mediaDir, asset.file);
    try {
      await download(asset.url, dest);
      console.log(`Downloaded ${asset.file}`);
    } catch (e) {
      console.error(`Failed to download ${asset.file}:`, e);
    }
  }
}

main();
