// Generates favicon / PWA icons / default Open Graph image into public/.
// Run after changing the brand: `npm run assets`.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const BG = '#0d1117';
const ACCENT = '#00b8d9';

const mark = (size, { rounded = true, pad = 0 } = {}) => {
  const r = rounded ? size * 0.22 : 0;
  const inner = size - pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs><radialGradient id="g" cx="30%" cy="20%" r="90%"><stop offset="0" stop-color="${ACCENT}" stop-opacity=".35"/><stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/></radialGradient></defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="${BG}"/>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#g)"/>
  <text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="Inter, DejaVu Sans, Arial, sans-serif" font-weight="800" font-size="${inner * 0.42}" letter-spacing="${-inner * 0.01}" fill="${ACCENT}">EB</text>
</svg>`;
};

await writeFile('public/favicon.svg', mark(64));
await sharp(Buffer.from(mark(32))).png().toFile('public/icons/favicon-32.png');
await sharp(Buffer.from(mark(192))).png().toFile('public/icons/icon-192.png');
await sharp(Buffer.from(mark(512))).png().toFile('public/icons/icon-512.png');
await sharp(Buffer.from(mark(512, { rounded: false, pad: 80 }))).png().toFile('public/icons/icon-maskable-512.png');
await sharp(Buffer.from(mark(180, { rounded: false }))).png().toFile('public/icons/apple-touch-icon.png');

// favicon.ico: a single 32x32 PNG wrapped in an ICO container.
const png = await sharp(Buffer.from(mark(32))).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
await writeFile('public/favicon.ico', Buffer.concat([header, png]));

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="a" cx="15%" cy="0%" r="80%"><stop offset="0" stop-color="${ACCENT}" stop-opacity=".30"/><stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/></radialGradient>
    <radialGradient id="b" cx="100%" cy="100%" r="70%"><stop offset="0" stop-color="#3b82f6" stop-opacity=".18"/><stop offset="1" stop-color="#3b82f6" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity=".05"/></pattern>
  </defs>
  <rect width="1200" height="630" fill="${BG}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#a)"/>
  <rect width="1200" height="630" fill="url(#b)"/>
  <rect x="96" y="120" width="88" height="88" rx="20" fill="${ACCENT}" fill-opacity=".12" stroke="${ACCENT}" stroke-opacity=".4"/>
  <text x="140" y="178" text-anchor="middle" font-family="Inter, DejaVu Sans, Arial, sans-serif" font-weight="800" font-size="38" fill="${ACCENT}">EB</text>
  <text x="96" y="330" font-family="Inter, DejaVu Sans, Arial, sans-serif" font-weight="800" font-size="88" fill="#e6edf3" letter-spacing="-2">Erfan Banaei</text>
  <text x="96" y="400" font-family="Inter, DejaVu Sans, Arial, sans-serif" font-weight="500" font-size="40" fill="${ACCENT}">Software Developer</text>
  <text x="96" y="530" font-family="Inter, DejaVu Sans, Arial, sans-serif" font-size="28" fill="#8b949e">erfanbanaei.ir</text>
</svg>`;
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile('public/og.png');
console.log('assets generated');
