import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const SRC = 'references/05-night-clock/old_fashioned_clock_-_4096px2.glb';
const OUT = 'public/night';
const BRASS_U = [0.28, 0.415];
const BRASS = [184, 137, 58];
const LACQUER = [13, 15, 19];

const align4 = (n) => (n + 3) & ~3;

// Parse the GLB, drop images/textures, compact the binary chunk.
const glb = await readFile(SRC);
const jsonLength = glb.readUInt32LE(12);
const json = JSON.parse(glb.subarray(20, 20 + jsonLength).toString());
const binStart = 20 + jsonLength + 8;

const KEEP = ['POSITION', 'NORMAL', 'TEXCOORD_0'];
const COMPONENTS = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };
const accessors = [];
const bufferViews = [];
const chunks = [];
let offset = 0;

// Re-pack every kept accessor into its own tight buffer view; indices drop to 16 bit.
const pack = (index, isIndices) => {
  const a = json.accessors[index];
  const view = json.bufferViews[a.bufferView];
  const n = COMPONENTS[a.type];
  const size = a.componentType === 5125 || a.componentType === 5126 ? 4 : 2;
  const stride = view.byteStride || n * size;
  const base = binStart + (view.byteOffset || 0) + (a.byteOffset || 0);
  let bytes;
  let componentType = a.componentType;
  if (isIndices && a.componentType === 5125) {
    bytes = Buffer.alloc(a.count * 2);
    for (let i = 0; i < a.count; i++) bytes.writeUInt16LE(glb.readUInt32LE(base + i * 4), i * 2);
    componentType = 5123;
  } else {
    bytes = Buffer.alloc(a.count * n * size);
    for (let i = 0; i < a.count; i++) glb.copy(bytes, i * n * size, base + i * stride, base + i * stride + n * size);
  }
  const padded = Buffer.alloc(align4(bytes.length));
  bytes.copy(padded);
  chunks.push(padded);
  bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: bytes.length, target: isIndices ? 34963 : 34962 });
  offset += padded.length;
  const { byteOffset, ...rest } = a;
  accessors.push({ ...rest, bufferView: bufferViews.length - 1, componentType });
  return accessors.length - 1;
};

json.meshes.forEach((mesh) =>
  mesh.primitives.forEach((primitive) => {
    primitive.attributes = Object.fromEntries(KEEP.map((k) => [k, pack(primitive.attributes[k], false)]));
    primitive.indices = pack(primitive.indices, true);
  }),
);
json.accessors = accessors;
json.bufferViews = bufferViews;
json.buffers = [{ byteLength: offset }];
delete json.images;
delete json.textures;
delete json.samplers;
json.materials = [{ name: 'Clock_MTL' }];

const jsonBytes = Buffer.from(JSON.stringify(json));
const jsonChunk = Buffer.alloc(align4(jsonBytes.length), 0x20);
jsonBytes.copy(jsonChunk);
const binChunk = Buffer.concat(chunks);
const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + jsonChunk.length + 8 + binChunk.length, 8);
const chunkHeader = (length, type) => {
  const h = Buffer.alloc(8);
  h.writeUInt32LE(length, 0);
  h.writeUInt32LE(type, 4);
  return h;
};

await mkdir(OUT, { recursive: true });
await writeFile(
  `${OUT}/clock.glb`,
  Buffer.concat([header, chunkHeader(jsonChunk.length, 0x4e4f534a), jsonChunk, chunkHeader(binChunk.length, 0x004e4942), binChunk]),
);

// Textures from the original atlas.
const images = JSON.parse(glb.subarray(20, 20 + jsonLength).toString());
const imageBytes = (i) => {
  const view = images.bufferViews[images.images[i].bufferView];
  return glb.subarray(binStart + (view.byteOffset || 0), binStart + (view.byteOffset || 0) + view.byteLength);
};

const SIZE = 2048;
const { data, info } = await sharp(imageBytes(0)).resize(SIZE, SIZE).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const ORM = 512;
const orm = Buffer.alloc(ORM * ORM * 3);
const step = SIZE / ORM;

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const o = (y * SIZE + x) * 4;
    const [r, g, b] = [data[o], data[o + 1], data[o + 2]];
    const u = x / SIZE;
    const v = y / SIZE;
    const inDial = u < 0.29 && v < 0.29;
    const isWood = !inDial && r > b + 6 && r >= g;
    let kind = 'other';
    if (isWood) {
      const lum = (r + g + b) / 3 / 110;
      const brass = v < 0.5 && u >= BRASS_U[0] && u < BRASS_U[1];
      const base = brass ? BRASS : LACQUER;
      const k = brass ? 0.82 + 0.25 * lum : 0.85 + 0.4 * lum;
      data[o] = Math.min(255, base[0] * k);
      data[o + 1] = Math.min(255, base[1] * k);
      data[o + 2] = Math.min(255, base[2] * k);
      kind = brass ? 'brass' : 'lacquer';
    }
    if (x % step === 0 && y % step === 0) {
      const p = ((y / step) * ORM + x / step) * 3;
      // glTF metallicRoughness: G = roughness, B = metalness.
      orm[p] = 255;
      orm[p + 1] = kind === 'brass' ? 90 : kind === 'lacquer' ? 70 : 160;
      orm[p + 2] = kind === 'brass' ? 255 : 0;
    }
  }
}

const outputs = [
  ['clock-base.webp', sharp(data, { raw: info }).webp({ quality: 85, alphaQuality: 90 })],
  ['clock-normal.webp', sharp(imageBytes(2)).resize(1024, 1024).webp({ quality: 90 })],
  ['clock-orm.webp', sharp(orm, { raw: { width: ORM, height: ORM, channels: 3 } }).webp({ lossless: true })],
];
for (const [name, pipeline] of outputs) await pipeline.toFile(`${OUT}/${name}`);

let total = 0;
for (const name of ['clock.glb', ...outputs.map(([n]) => n)]) {
  const { size } = await stat(`${OUT}/${name}`);
  total += size;
  console.log(`${name}: ${Math.round(size / 1024)} KB`);
}

for (const file of ['N1_1830_gondola', 'N2_1900_terrace', 'N3_2030_dinner', 'N4_2130_jazz', 'N5_2300_torches', 'N6_2330_flambe']) {
  const out = `${OUT}/${file.slice(0, 2)}.webp`;
  await sharp(`references/05-night-clock/${file}.jpg`).resize(1600).webp({ quality: 80 }).toFile(out);
  const { size } = await stat(out);
  console.log(`${out}: ${Math.round(size / 1024)} KB`);
}
console.log(`clock total: ${(total / 1024 / 1024).toFixed(2)} MB`);
