import foxMarkUrl from '../../../assets/logo/redfox-mark.svg?url';

const SIZE = 2048;
const NUMERALS = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
const INK = '#1d1a17';

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export const drawDial = async () => {
  await document.fonts.load('300 100px Zodiak');
  const fox = await loadImage(foxMarkUrl);

  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  const c = SIZE / 2;
  const R = SIZE / 2;

  const face = ctx.createRadialGradient(c, c * 0.9, R * 0.1, c, c, R);
  face.addColorStop(0, '#f1e8d4');
  face.addColorStop(0.75, '#e8dcc0');
  face.addColorStop(1, '#d6c6a3');
  ctx.fillStyle = face;
  ctx.beginPath();
  ctx.arc(c, c, R, 0, Math.PI * 2);
  ctx.fill();

  // Age: faint blotches and speckles so the face does not read as flat vector art.
  for (let i = 0; i < 260; i++) {
    const r = 20 + Math.random() * 160;
    const a = Math.random() * Math.PI * 2;
    const d = Math.sqrt(Math.random()) * R;
    const g = ctx.createRadialGradient(c + Math.cos(a) * d, c + Math.sin(a) * d, 0, c + Math.cos(a) * d, c + Math.sin(a) * d, r);
    g.addColorStop(0, `rgba(120, 95, 60, ${0.02 + Math.random() * 0.03})`);
    g.addColorStop(1, 'rgba(120, 95, 60, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SIZE, SIZE);
  }

  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  ctx.lineWidth = 5;
  for (const r of [0.93, 0.86]) {
    ctx.beginPath();
    ctx.arc(c, c, R * r, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    const major = i % 5 === 0;
    ctx.lineWidth = major ? 10 : 4;
    const r0 = R * (major ? 0.855 : 0.865);
    const r1 = R * 0.93;
    ctx.beginPath();
    ctx.moveTo(c + Math.sin(a) * r0, c - Math.cos(a) * r0);
    ctx.lineTo(c + Math.sin(a) * r1, c - Math.cos(a) * r1);
    ctx.stroke();
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `300 ${R * 0.2}px Zodiak`;
  NUMERALS.forEach((numeral, i) => {
    const a = (i / 12) * Math.PI * 2;
    ctx.save();
    ctx.translate(c + Math.sin(a) * R * 0.7, c - Math.cos(a) * R * 0.7);
    ctx.rotate(a);
    ctx.scale(0.72, 1);
    ctx.fillText(numeral, 0, 0);
    ctx.restore();
  });

  const foxSize = R * 0.17;
  ctx.drawImage(fox, c - foxSize / 2, c - R * 0.42, foxSize, foxSize);

  ctx.font = `400 ${R * 0.062}px Zodiak`;
  ctx.fillText('Hollister Peak', c, c + R * 0.3);

  return canvas;
};
