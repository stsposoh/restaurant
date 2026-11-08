import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'references/01-hero/frames-1920';
const OUT = 'public/hero';
const QUALITY = 76;
const FIRST_PASS_STEP = 8;

const files = (await readdir(SRC)).filter((f) => f.endsWith('.jpg')).sort();
await mkdir(OUT, { recursive: true });

let total = 0;
let firstPass = 0;

for (const [i, file] of files.entries()) {
  const out = path.join(OUT, file.replace('.jpg', '.webp'));
  await sharp(path.join(SRC, file)).webp({ quality: QUALITY, effort: 5 }).toFile(out);
  const { size } = await stat(out);
  total += size;
  if (i % FIRST_PASS_STEP === 0 || i === files.length - 1) firstPass += size;
}

const mb = (b) => (b / 1024 / 1024).toFixed(1);
console.log(`${files.length} frames → ${OUT}`);
console.log(`total: ${mb(total)} MB, avg ${(total / files.length / 1024).toFixed(0)} KB`);
console.log(`first pass (every ${FIRST_PASS_STEP}th + last): ${mb(firstPass)} MB`);
