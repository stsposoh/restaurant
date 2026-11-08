import { mkdir, readdir, stat } from 'node:fs/promises';
import sharp from 'sharp';

const SETS = [
  { src: 'references/06-frozen-moments', out: 'public/moments' },
  { src: 'references/07-chef', out: 'public/chef' },
  { src: 'references/09-finale', out: 'public/finale', width: 2560 },
];

for (const { src, out, width = 1600 } of SETS) {
  await mkdir(out, { recursive: true });
  let total = 0;
  for (const file of (await readdir(src)).filter((f) => f.endsWith('.jpg')).sort()) {
    const target = `${out}/${file.slice(0, 2)}.webp`;
    await sharp(`${src}/${file}`).resize(width, width, { fit: 'inside' }).webp({ quality: 80 }).toFile(target);
    const { size } = await stat(target);
    total += size;
    console.log(`${target}: ${Math.round(size / 1024)} KB`);
  }
  console.log(`${out}: ${(total / 1024 / 1024).toFixed(2)} MB`);
}
