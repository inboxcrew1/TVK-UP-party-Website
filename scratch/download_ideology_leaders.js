const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, '../public/media');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const images = [
  { url: 'https://tvkvijay.com/page-ideology/leaders/periyar.png', file: 'leader_periyar.png' },
  { url: 'https://tvkvijay.com/page-ideology/leaders/kamarajar.png', file: 'leader_kamarajar.png' },
  { url: 'https://tvkvijay.com/page-ideology/leaders/ambedkar.png', file: 'leader_ambedkar.png' },
  { url: 'https://tvkvijay.com/page-ideology/leaders/velu-nachiyar.png', file: 'leader_velunachiyar.png' },
  { url: 'https://tvkvijay.com/page-ideology/leaders/anjalai-ammal.png', file: 'leader_anjalai.png' },
  { url: 'https://tvkassets.minsky.studio/media/DEmocracy.png', file: 'pillar_democracy.png' },
  { url: 'https://tvkassets.minsky.studio/media/Equitable%20Social%20Justice.png', file: 'pillar_justice.png' },
  { url: 'https://tvkassets.minsky.studio/media/Equality.png', file: 'pillar_equality.png' },
  { url: 'https://tvkassets.minsky.studio/media/Secularism.png', file: 'pillar_secularism.png' },
  { url: 'https://tvkassets.minsky.studio/media/Right%20to%20State%20Autonomy.png', file: 'pillar_autonomy.png' },
];

images.forEach(({ url, file }) => {
  const dest = path.join(targetDir, file);
  const fileStream = fs.createWriteStream(dest);
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded ${file}`);
      });
    } else {
      console.error(`Failed to download ${url}: status ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error(`Error downloading ${url}:`, err.message);
  });
});
