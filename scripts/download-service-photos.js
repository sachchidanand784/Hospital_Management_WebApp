const https = require('https');
const fs = require('fs');
const path = require('path');

const servicePhotos = [
  { name: 'general-exam.jpg', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80' },
  { name: 'cataract-phaco.jpg', url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80' },
  { name: 'retina-laser.jpg', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80' },
  { name: 'optometry-glasses.jpg', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80' },
  { name: 'emergency-ocular.jpg', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80' },
  { name: 'glaucoma-tonometry.jpg', url: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?auto=format&fit=crop&w=800&q=80' },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed with ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Saved: ${dest} (${fs.statSync(dest).size} bytes)`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  const dir = path.join(__dirname, '../public/images/services');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const item of servicePhotos) {
    const dest = path.join(dir, item.name);
    console.log(`Downloading ${item.name}...`);
    await download(item.url, dest);
  }
  console.log('All real eye service photos downloaded successfully!');
}

main().catch(console.error);
