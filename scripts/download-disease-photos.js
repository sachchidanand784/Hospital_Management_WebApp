const https = require('https');
const fs = require('fs');
const path = require('path');

const diseasePhotos = [
  {
    id: 'prob-1',
    name: 'blurred-vision.jpg',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-2',
    name: 'eye-redness.jpg',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-3',
    name: 'watery-eyes.jpg',
    url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-4',
    name: 'dry-eyes.jpg',
    url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-5',
    name: 'vision-headache.jpg',
    url: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-6',
    name: 'cloudy-cataract.jpg',
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-7',
    name: 'night-glare.jpg',
    url: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-8',
    name: 'frequent-glass-change.jpg',
    url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-9',
    name: 'eye-floaters.jpg',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-10',
    name: 'flashes-curtain.jpg',
    url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-11',
    name: 'diabetic-retinopathy.jpg',
    url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-12',
    name: 'chemical-injury.jpg',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-13',
    name: 'sudden-vision-loss.jpg',
    url: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-14',
    name: 'penetrating-trauma.jpg',
    url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-15',
    name: 'severe-eye-pain.jpg',
    url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-16',
    name: 'glass-power-check.jpg',
    url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-17',
    name: 'contact-lens.jpg',
    url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-18',
    name: 'reading-difficulty.jpg',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prob-19',
    name: 'computer-eye-strain.jpg',
    url: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80',
    fallback: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?auto=format&fit=crop&w=800&q=80'
  }
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
          const stats = fs.statSync(dest);
          if (stats.size < 5000) {
            reject(new Error(`File too small: ${stats.size} bytes`));
            return;
          }
          console.log(`✓ Saved: ${dest} (${stats.size} bytes)`);
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
  const dir = path.join(__dirname, '../public/images/diseases');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const item of diseasePhotos) {
    const dest = path.join(dir, item.name);
    console.log(`Downloading ${item.name}...`);
    try {
      await download(item.url, dest);
    } catch (e) {
      console.warn(`Primary failed for ${item.name}, trying fallback...`, e.message);
      if (item.fallback) {
        await download(item.fallback, dest);
      }
    }
  }
  console.log('All 19 eye disease photos downloaded successfully!');
}

main().catch(console.error);
