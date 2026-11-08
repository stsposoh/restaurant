import { mkdir, readdir, stat } from 'node:fs/promises';
import sharp from 'sharp';
import { keyGreen, removeIslands } from './lib/chroma.mjs';

const SRC = 'references/04-menu';
const OUT = 'public/menu';
const DISH_SIZE = 1600;
const INGREDIENT_MAX = 640;
const DESPILL_ALL = ['I2_spruce', 'I10_ice'];
// Green dill on a green screen does not survive the key.
const SKIP = ['I11_dill'];

await mkdir(`${OUT}/ingredients`, { recursive: true });
const kb = (b) => `${Math.round(b / 1024)} KB`;
let total = 0;

for (const file of (await readdir(`${SRC}/dishes`)).filter((f) => f.endsWith('.jpg')).sort()) {
  const out = `${OUT}/${file.replace('_v1.jpg', '.webp')}`;
  await sharp(`${SRC}/dishes/${file}`).resize(DISH_SIZE, DISH_SIZE).webp({ quality: 80, effort: 5 }).toFile(out);
  const { size } = await stat(out);
  total += size;
  console.log(`${out}: ${kb(size)}`);
}

for (const file of (await readdir(`${SRC}/ingredients`)).filter((f) => f.endsWith('.jpg')).sort()) {
  const id = file.replace('.jpg', '');
  if (SKIP.includes(id)) continue;
  const { data, info } = await sharp(`${SRC}/ingredients/${file}`).raw().toBuffer({ resolveWithObject: true });
  const rgba = keyGreen(data, info.width, info.height, { despillAll: DESPILL_ALL.includes(id) });
  removeIslands(rgba, info.width, info.height, 0.01);

  const keyed = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
  const out = `${OUT}/ingredients/${id}.webp`;
  await sharp(keyed)
    .trim({ threshold: 1 })
    .resize(INGREDIENT_MAX, INGREDIENT_MAX, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 90, effort: 5 })
    .toFile(out);
  const { size } = await stat(out);
  total += size;
  console.log(`${out}: ${kb(size)}`);
}

console.log(`total: ${(total / 1024 / 1024).toFixed(2)} MB`);
