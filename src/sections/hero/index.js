import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitChars } from '../../lib/split.js';
import { snowState } from '../../lib/snow-state.js';
import { createFrames } from './frames.js';
import { createFrameCanvas } from './frame-canvas.js';
import { runPreloader } from './preloader.js';

const VIDEO_SECONDS = 30.5;
const FRAMES_VH = 5.5;
const HOLD_VH = 1.25;
const EXIT_VH = 0.75;
const PIN_VH = FRAMES_VH + HOLD_VH + EXIT_VH;
const FRAMES_END = FRAMES_VH / PIN_VH;
const HOLD = HOLD_VH / PIN_VH;
const HOLD_END = FRAMES_END + HOLD;
const EXIT = EXIT_VH / PIN_VH;
const PARALLAX_PX = 14;

const at = (seconds) => (seconds / VIDEO_SECONDS) * FRAMES_END;

const charsHidden = (chars) => ({
  opacity: 0,
  filter: 'blur(14px)',
  x: (i) => (i - chars.length / 2) * 5,
});
const charsShown = { opacity: 1, filter: 'blur(0px)', x: 0 };

export const mountHero = async ({ root, preloader, lenis, reducedMotion }) => {
  const media = root.querySelector('.hero__media');
  const titles = Object.fromEntries(
    [...root.querySelectorAll('[data-title]')].map((el) => [el.dataset.title, el]),
  );

  let frameCanvas;
  const frames = createFrames({ onLoad: (i) => frameCanvas?.onFrameLoaded(i) });
  frameCanvas = createFrameCanvas(root.querySelector('.hero__frames'), frames);

  if (reducedMotion) {
    root.classList.add('hero--static');
    frameCanvas.setFrame(frames.count - 1);
    await runPreloader(preloader, frames.loadLast(), { animate: false });
    frameCanvas.refresh();
    return;
  }

  lenis?.stop();

  const introChars = splitChars(titles.intro);
  const servedChars = splitChars(titles.served);
  const stopsChars = splitChars(titles.stops);
  const closingLines = [...titles.closing.querySelectorAll('.title__line')].map(splitChars);
  const cta = titles.closing.querySelector('.hero__cta');

  gsap.set(introChars, charsHidden(introChars));

  const hold = { amount: 0 };
  const pointer = { x: 0, y: 0 };
  const moveX = gsap.quickTo(media, 'x', { duration: 0.9, ease: 'power3.out' });
  const moveY = gsap.quickTo(media, 'y', { duration: 0.9, ease: 'power3.out' });
  const applyParallax = () => {
    moveX(-pointer.x * PARALLAX_PX * hold.amount);
    moveY(-pointer.y * PARALLAX_PX * hold.amount);
  };
  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    applyParallax();
  });

  const playhead = { frame: 0 };
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: () => `+=${window.innerHeight * PIN_VH}`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: ({ progress }) => {
        snowState.dolly = progress;
      },
    },
  });

  tl.to(
    playhead,
    {
      frame: frames.count - 1,
      duration: FRAMES_END,
      onUpdate: () => frameCanvas.setFrame(Math.round(playhead.frame)),
    },
    0,
  );

  const reveal = (chars, start, length) =>
    tl.fromTo(
      chars,
      charsHidden(chars),
      { ...charsShown, duration: length * 0.6, stagger: { amount: length * 0.4 }, ease: 'power2.out' },
      start,
    );
  const leave = (el, start) =>
    tl.to(el, { opacity: 0, filter: 'blur(10px)', y: -18, duration: at(1.4), ease: 'power1.in' }, start);

  leave(titles.intro, at(1.6));
  reveal(servedChars, at(3.2), at(2.6));
  leave(titles.served, at(8.6));
  reveal(stopsChars, at(10.4), at(2.6));
  leave(titles.stops, at(15.6));
  reveal(closingLines[0], at(23.4), at(3));
  reveal(closingLines[1], at(25.6), at(3));
  tl.fromTo(cta, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: HOLD * 0.4, ease: 'power2.out' }, at(29.2));

  tl.to(media, { scale: 1.04, duration: HOLD }, FRAMES_END);
  tl.to(hold, { amount: 1, duration: HOLD * 0.5, onUpdate: applyParallax }, FRAMES_END);
  tl.to(titles.closing, { opacity: 0, filter: 'blur(10px)', y: -18, duration: EXIT * 0.5, ease: 'power1.in' }, HOLD_END);
  tl.to(media, { opacity: 0, duration: EXIT * 0.8, ease: 'power1.inOut' }, HOLD_END + EXIT * 0.15);
  tl.to({}, { duration: 0 }, 1);

  await runPreloader(preloader, frames.loadFirstPass(), { animate: true });
  frameCanvas.refresh();
  frames.loadRest();
  lenis?.start();
  ScrollTrigger.refresh();

  gsap.to(introChars, { ...charsShown, duration: 1.6, stagger: 0.035, ease: 'power3.out' });
};
