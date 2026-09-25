const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, '../messages/en.json');
const hiPath = path.join(__dirname, '../messages/hi.json');

if (!fs.existsSync(enPath) || !fs.existsSync(hiPath)) {
  console.error('❌ Error: Both messages/en.json and messages/hi.json must exist.');
  process.exit(1);
}

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getKeys(obj[key], `${prefix}${key}.`));
    } else {
      keys.push(`${prefix}${key}`);
    }
  }
  return keys;
}

const enKeys = new Set(getKeys(en));
const hiKeys = new Set(getKeys(hi));

let missingInHi = [];
let missingInEn = [];

for (const k of enKeys) {
  if (!hiKeys.has(k)) missingInHi.push(k);
}

for (const k of hiKeys) {
  if (!enKeys.has(k)) missingInEn.push(k);
}

console.log(`🌐 i18n Check: English keys (${enKeys.size}), Hindi keys (${hiKeys.size})`);

if (missingInHi.length > 0) {
  console.error(`❌ Missing keys in hi.json (${missingInHi.length}):`, missingInHi);
}

if (missingInEn.length > 0) {
  console.error(`❌ Missing keys in en.json (${missingInEn.length}):`, missingInEn);
}

if (missingInHi.length === 0 && missingInEn.length === 0) {
  console.log('✅ i18n Key Parity Check PASSED! Zero missing keys.');
  process.exit(0);
} else {
  process.exit(1);
}
