const https = require('https');
const fs = require('fs');
const path = require('path');

// 8 distinct eyewear models, each with 3 distinct real clinical/product views
const opticalPhotos = [
  // Model 1: Ray-Ban Wayfarer Classic Black Frame
  {
    name: 'opt-1-front.jpg',
    url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'opt-1-side.jpg',
    url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'opt-1-folded.jpg',
    url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80'
  },

  // Model 2: Essilor Crizal Blue-Light Round Crystal Frame
  {
    name: 'opt-2-front.jpg',
    url: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'opt-2-side.jpg',
    url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'opt-2-folded.jpg',
    url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
  },

  // Model 3: Titan Minimalist Gold Wireframe
  {
    name: 'opt-3-front.jpg',
    url: 'https://images.unsplash.com/photo-1509695503232-9221e6e99140?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'opt-3-side.jpg',
    url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'opt-3-folded.jpg',
    url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80'
  },

  // Model 4: Fastrack Polarized Aviator Sunglasses
  {
    name: 'opt-4-front.jpg',
    url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'opt-4-side.jpg',
    url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'opt-4-folded.jpg',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
  },

  // Model 5: Vincent Chase Tortoiseshell Retro Round Frame
  {
    name: 'opt-5-front.jpg',
    url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'opt-5-side.jpg',
    url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'opt-5-folded.jpg',
    url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
  },

  // Model 6: Oakley Performance Sport Wrap Sunglasses
  {
    name: 'opt-6-front.jpg',
    url: 'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'opt-6-side.jpg',
    url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'opt-6-folded.jpg',
    url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80'
  },

  // Model 7: Vogue Rose-Gold Cat-Eye Designer Frame
  {
    name: 'opt-7-front.jpg',
    url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'opt-7-side.jpg',
    url: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'opt-7-folded.jpg',
    url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80'
  },

  // Model 8: John Jacobs Clubmaster Browline Intellectual Frame
  {
    name: 'opt-8-front.jpg',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'opt-8-side.jpg',
    url: 'https://images.unsplash.com/photo-1509695503232-9221e6e99140?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'opt-8-folded.jpg',
    url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
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
  const dir = path.join(__dirname, '../public/images/optical');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (const item of opticalPhotos) {
    const dest = path.join(dir, item.name);
    console.log(`Downloading ${item.name}...`);
    try {
      await download(item.url, dest);
    } catch (e) {
      console.warn(`Failed for ${item.name}: ${e.message}`);
    }
  }
  console.log('All optical multi-view photos downloaded successfully!');
}

main().catch(console.error);
