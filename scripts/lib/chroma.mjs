const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export const keyGreen = (data, width, height, { despillAll = false } = {}) => {
  const rgba = Buffer.alloc(width * height * 4);
  for (let p = 0; p < width * height; p++) {
    const r = data[p * 3];
    const g = data[p * 3 + 1];
    const b = data[p * 3 + 2];
    const spill = g - Math.max(r, b);
    const ratio = g / (r + g + b + 1);
    // Ratio term catches the dark green-tinted sky that a pure dominance key leaves opaque.
    const key = Math.max(smoothstep(25, 90, spill), spill > 8 ? smoothstep(0.42, 0.52, ratio) : 0);
    const alpha = 1 - key;
    rgba[p * 4] = r;
    const neutralG = Math.round((r + b) / 2) + 8;
    rgba[p * 4 + 1] = (despillAll || alpha < 0.98) && g > neutralG ? neutralG : g;
    rgba[p * 4 + 2] = b;
    rgba[p * 4 + 3] = Math.round(alpha * 255);
  }
  return rgba;
};

// Drops small isolated opaque islands (baked-in moon, stars, specks) and keeps the main shapes.
export const removeIslands = (rgba, width, height, minShare = 0.02) => {
  const labels = new Int32Array(width * height).fill(-1);
  const sizes = [];
  const stack = new Int32Array(width * height);

  for (let start = 0; start < width * height; start++) {
    if (labels[start] !== -1 || rgba[start * 4 + 3] < 20) continue;
    const id = sizes.length;
    let size = 0;
    let top = 0;
    stack[top++] = start;
    labels[start] = id;
    while (top) {
      const p = stack[--top];
      size++;
      const x = p % width;
      const neighbours = [x > 0 ? p - 1 : -1, x < width - 1 ? p + 1 : -1, p - width, p + width];
      for (const n of neighbours) {
        if (n < 0 || n >= width * height || labels[n] !== -1 || rgba[n * 4 + 3] < 20) continue;
        labels[n] = id;
        stack[top++] = n;
      }
    }
    sizes.push(size);
  }

  const largest = Math.max(...sizes);
  let removed = 0;
  for (let p = 0; p < width * height; p++) {
    const id = labels[p];
    if (id === -1 && rgba[p * 4 + 3] > 0) rgba[p * 4 + 3] = 0;
    else if (id !== -1 && sizes[id] < largest * minShare) {
      rgba[p * 4 + 3] = 0;
      removed++;
    }
  }
  return removed;
};
