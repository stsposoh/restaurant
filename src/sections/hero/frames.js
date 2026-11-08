const COUNT = 366;
const FIRST_PASS_STEP = 8;
const CONCURRENCY = 6;

const src = (i) => `${import.meta.env.BASE_URL}hero/${String(i + 1).padStart(4, '0')}.webp`;

export const createFrames = ({ onLoad }) => {
  const images = new Array(COUNT);

  const load = async (i) => {
    const img = new Image();
    img.src = src(i);
    try {
      await img.decode();
    } catch {
      return;
    }
    images[i] = img;
    onLoad?.(i);
  };

  const firstPass = [];
  for (let i = 0; i < COUNT; i += FIRST_PASS_STEP) firstPass.push(i);
  if (firstPass.at(-1) !== COUNT - 1) firstPass.push(COUNT - 1);

  const loadFirstPass = () => Promise.all(firstPass.map(load));

  const loadRest = async () => {
    const queue = [];
    for (let i = 0; i < COUNT; i++) if (!firstPass.includes(i)) queue.push(i);
    const worker = async () => {
      while (queue.length) await load(queue.shift());
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  };

  const loadLast = () => load(COUNT - 1);

  const nearest = (i) => {
    for (let d = 0; d < COUNT; d++) {
      if (images[i - d]) return images[i - d];
      if (images[i + d]) return images[i + d];
    }
    return null;
  };

  return { count: COUNT, loadFirstPass, loadRest, loadLast, nearest };
};
