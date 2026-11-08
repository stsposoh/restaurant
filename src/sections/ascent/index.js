import { gsap } from 'gsap';
import { snowState } from '../../lib/snow-state.js';
import { loadLazyImages } from '../../lib/lazy-images.js';

const PIN_VH = 6.5;
const JOURNEY = 0.82;
const ALT_FROM = 1200;
const ALT_TO = 2847;
const ALT_END = 0.76;

// Layer tops in vh: [from, to, start, end] in timeline progress. Jumps between segments
// happen while the fog fully covers the frame (FOG_FULL).
const FOG_FULL = [0.44, 0.54];
const LAYERS = {
  sky: [[-40, 0, 0, JOURNEY]],
  far: [
    [7, 52, 0, 0.44],
    [30, 34, 0.5, JOURNEY],
  ],
  mid: [[18, 130, 0, 0.42]],
  village: [[24, 200, 0, 0.38]],
  clouds: [
    [-60, 10, 0, 0.46],
    [40, 52, 0.5, JOURNEY],
  ],
  summit: [[120, 12, 0.5, JOURNEY]],
  spruce: [[33, 330, 0, 0.3]],
};

const vh = (value) => () => (window.innerHeight * value) / 100;
const vw = (value) => () => (window.innerWidth * value) / 100;

const formatMetres = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f');

// Slower through the middle of the climb (inside the cloud), faster at both ends.
const altitudeEase = (t) => t + 0.06 * Math.sin(2 * Math.PI * t);

export const mountAscent = ({ root, reducedMotion }) => {
  const q = (selector) => root.querySelector(selector);
  const layer = (name) => q(`[data-layer="${name}"]`);
  const metres = q('.ascent__metres');
  const altitude = { value: 0 };
  const fogState = { density: 0, offset: 0 };
  let fog = null;

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    paused: reducedMotion,
    scrollTrigger: reducedMotion
      ? undefined
      : {
          trigger: root,
          start: 'top top',
          end: () => `+=${window.innerHeight * PIN_VH}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: ({ progress }) => {
            snowState.rise = Math.min(1, progress / JOURNEY);
          },
        },
  });

  for (const [name, segments] of Object.entries(LAYERS)) {
    segments.forEach(([from, to, start, end], i) => {
      tl.fromTo(
        layer(name),
        { y: vh(from) },
        { y: vh(to), duration: end - start, immediateRender: i === 0 },
        start,
      );
    });
  }

  tl.fromTo(q('.ascent__night'), { opacity: 0 }, { opacity: 0.85, duration: 0.3 }, 0.5);
  tl.fromTo(q('.ascent__shade'), { opacity: 0 }, { opacity: 0.4, duration: 0.3 }, 0.5);

  tl.fromTo(
    altitude,
    { value: 0 },
    {
      value: 1,
      duration: ALT_END,
      ease: altitudeEase,
      onUpdate: () => {
        metres.textContent = formatMetres(Math.round(ALT_FROM + (ALT_TO - ALT_FROM) * altitude.value));
      },
    },
    0,
  );

  const renderFog = () => fog?.render();
  tl.fromTo(fogState, { offset: 0 }, { offset: 1, duration: JOURNEY, onUpdate: renderFog }, 0);
  tl.fromTo(fogState, { density: 0 }, { density: 1, duration: 0.07, ease: 'sine.in', onUpdate: renderFog }, FOG_FULL[0] - 0.07);
  tl.to(fogState, { density: 0, duration: 0.1, ease: 'sine.out', onUpdate: renderFog }, FOG_FULL[1]);

  tl.to(q('.ascent__caption'), { opacity: 0, filter: 'blur(8px)', duration: 0.06 }, 0.1);

  const gondola = q('.ascent__gondola');
  gsap.set(gondola, { scale: 0.45, rotation: -9, transformOrigin: '50.5% 60%' });
  tl.fromTo(gondola, { x: vw(-3), y: vh(3) }, { x: vw(4), y: vh(-2), duration: JOURNEY }, 0);
  tl.to(gondola, { x: vw(14), y: vh(12), scale: 3.2, rotation: 0, duration: 0.1, ease: 'power2.in' }, 0.78);

  tl.to(q('.ascent__readout'), { opacity: 0, duration: 0.04 }, 0.8);
  tl.fromTo(q('.ascent__seam'), { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.03, ease: 'power2.out' }, 0.85);
  tl.fromTo(
    q('.ascent__doors'),
    { clipPath: 'inset(0% 50% 0% 50%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.09, ease: 'power2.inOut' },
    0.87,
  );
  tl.to(q('.ascent__seam'), { opacity: 0, duration: 0.04 }, 0.91);
  tl.fromTo(q('.ascent__doors-dim'), { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.95);
  tl.fromTo(snowState, { opacity: 1 }, { opacity: 0, duration: 0.07 }, 0.87);
  tl.to({}, { duration: 0 }, 1);

  if (reducedMotion) {
    tl.progress(0.77);
    metres.textContent = formatMetres(ALT_TO);
  }

  const load = () => {
    loadLazyImages(root);
    if (reducedMotion) return;
    import('./fog.js').then(({ createFog }) => {
      fog = createFog(q('.ascent__fog'), fogState);
    });
  };

  return { load };
};
