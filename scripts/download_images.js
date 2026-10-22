const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const showcaseDir = path.join(root, 'public', 'images', 'showcase');
const founderDir = path.join(root, 'public', 'images', 'founder');
const doctorsDir = path.join(root, 'public', 'images', 'doctors');

fs.mkdirSync(showcaseDir, { recursive: true });
fs.mkdirSync(founderDir, { recursive: true });
fs.mkdirSync(doctorsDir, { recursive: true });

const circlePath = path.join(showcaseDir, 'circle.png');
console.log('Downloading circle.png...');
try {
  execSync(`curl.exe -k -s -o "${circlePath}" "https://msmemorialnetralaya.com/wp-content/uploads/2023/07/circle.png"`, { timeout: 30000 });
  console.log('circle.png size:', fs.statSync(circlePath).size);
} catch (e) {
  console.error('circle.png error:', e.message);
}

const uploadDir = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\dfc6b9a5-f6b6-4a99-a356-8672f8c14b70\\.user_uploaded';
if (fs.existsSync(uploadDir)) {
  const files = fs.readdirSync(uploadDir);
  console.log('User upload files found:', files);
  for (const f of files) {
    const full = path.join(uploadDir, f);
    const size = fs.statSync(full).size;
    if (size > 400000) {
      // 695KB is the clinical slit lamp exam photo
      fs.copyFileSync(full, path.join(founderDir, 'dr-madhav-mukund-exam.png'));
      console.log('Saved exam photo:', size, 'bytes');
    } else {
      // 180KB is Dr Madhav Mukund portrait
      fs.copyFileSync(full, path.join(founderDir, 'dr-madhav-mukund-portrait.png'));
      fs.copyFileSync(full, path.join(doctorsDir, 'dr-madhav-mukund.jpg'));
      console.log('Saved portrait photo:', size, 'bytes');
    }
  }
}

console.log('Showcase dir contents:');
console.log(fs.readdirSync(showcaseDir));
console.log('Founder dir contents:');
console.log(fs.readdirSync(founderDir));
