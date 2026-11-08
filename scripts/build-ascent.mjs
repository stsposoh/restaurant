import { mkdir, stat } from 'node:fs/promises';
import sharp from 'sharp';
import { keyGreen, removeIslands } from './lib/chroma.mjs';

const SRC = 'references/03-ascent';
const OUT = 'public/ascent';
const KEYED = ['A2', 'A3', 'A4', 'A6', 'A7', 'A8'];
const PLAIN = ['A1', 'A5'];
const DESPILL_ALL = ['A2', 'A6'];

await mkdir(OUT, { recursive: true });
const mb = (b) => (b / 1024 / 1024).toFixed(2);
let total = 0;

for (const id of PLAIN) {
  const out = `${OUT}/${id}.webp`;
  await sharp(`${SRC}/${id}_v1.jpg`).webp({ quality: 78, effort: 5 }).toFile(out);
  const { size } = await stat(out);
  total += size;
  console.log(`${id}: ${mb(size)} MB`);
}

for (const id of KEYED) {
  const { data, info } = await sharp(`${SRC}/${id}_v1.jpg`).raw().toBuffer({ resolveWithObject: true });
  const rgba = keyGreen(data, info.width, info.height, { despillAll: DESPILL_ALL.includes(id) });
  const removed = removeIslands(rgba, info.width, info.height);
  const out = `${OUT}/${id}.webp`;
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 80, alphaQuality: 90, effort: 5 })
    .toFile(out);
  const { size } = await stat(out);
  total += size;
  console.log(`${id}: ${mb(size)} MB (removed ${removed} px of islands)`);
}

console.log(`total: ${mb(total)} MB`);
