import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PIN_VH = 6;
const CAMERA_START = 6;
const SPACING = 5;
const PAST_LAST = 2.5;
// Scroll speed (px/s) that produces full flutter.
const FLUTTER_SPEED = 2500;

const lerp = (a, b, t) => a + (b - a) * t;
const timecode = (y) => {
  const ms = Math.round((y / ScrollTrigger.maxScroll(window)) * 999);
  return `23:59:59.${String(Math.min(999, Math.max(0, ms))).padStart(3, '0')}`;
};

export const mountMoments = ({ root, reducedMotion }) => {
  const items = [...root.querySelectorAll('.moment')];
  const images = items.map((el) => el.querySelector('.moment__img'));
  const times = items.map((el) => el.querySelector('.moment__time'));
  const cameraEnd = -(items.length - 1) * SPACING - PAST_LAST;
  let scene = null;
  let progress = 0;
  let trigger = null;

  const load = () => {
    images.forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
    if (reducedMotion) return;
    Promise.all([import('./scene.js'), ...images.map((img) => img.decode())]).then(([{ createMomentsScene }]) => {
      scene = createMomentsScene(root.querySelector('.moments__canvas'), images, SPACING);
      draw();
    });
  };

  // The timecode is what the site-wide scroll clock reads when this photo is passed.
  const writeTimecodes = () => {
    items.forEach((el, i) => {
      let y;
      if (trigger) {
        const passAt = (CAMERA_START + i * SPACING) / (CAMERA_START - cameraEnd);
        y = trigger.start + (trigger.end - trigger.start) * passAt;
      } else {
        const rect = el.getBoundingClientRect();
        y = rect.top + window.scrollY + rect.height / 2 - window.innerHeight / 2;
      }
      times[i].textContent = timecode(y);
    });
  };
  ScrollTrigger.addEventListener('refresh', writeTimecodes);

  if (reducedMotion) {
    root.classList.add('moments--static');
    return { load };
  }

  const pointer = { x: 0, y: 0 };
  const pointerTarget = { x: 0, y: 0 };
  let visible = false;
  let flutter = 0;
  let flutterTarget = 0;

  const draw = () => {
    if (!scene) return;
    const captions = scene.render(lerp(CAMERA_START, cameraEnd, progress), pointer, flutter);
    captions.forEach((c, i) => {
      times[i].style.transform = `translate(${c.x}px, ${c.y + 14}px)`;
      times[i].style.opacity = c.opacity;
    });
  };

  trigger = ScrollTrigger.create({
    trigger: root,
    start: 'top top',
    end: () => `+=${window.innerHeight * PIN_VH}`,
    pin: true,
    onUpdate: (self) => {
      progress = self.progress;
      flutterTarget = Math.max(-1, Math.min(1, self.getVelocity() / FLUTTER_SPEED));
      draw();
    },
  });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }).observe(root);
  window.addEventListener('pointermove', (e) => {
    pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointerTarget.y = (e.clientY / window.innerHeight) * 2 - 1;
  });
  gsap.ticker.add(() => {
    if (!visible || !scene) return;
    // No scroll updates arrive once scrolling stops, so the target decays and the photos settle.
    flutterTarget *= 0.85;
    const df = flutterTarget - flutter;
    const dx = pointerTarget.x - pointer.x;
    const dy = pointerTarget.y - pointer.y;
    if (Math.abs(dx) < 0.0005 && Math.abs(dy) < 0.0005 && Math.abs(df) < 0.0005 && Math.abs(flutter) < 0.0005) return;
    pointer.x += dx * 0.05;
    pointer.y += dy * 0.05;
    flutter += df * 0.15;
    if (Math.abs(flutter) < 0.0005 && Math.abs(flutterTarget) < 0.0005) flutter = 0;
    draw();
  });
  window.addEventListener('resize', () => {
    scene?.resize();
    draw();
  });

  return { load };
};
