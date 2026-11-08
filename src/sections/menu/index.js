import { gsap } from 'gsap';
import { splitChars } from '../../lib/split.js';

const PIN_VH = 8;
const INTRO = 0.5;
const HOLD = 0.55;
const DRIFT_PX = 60;
const CURSOR_PX = 26;

const charsHidden = (chars) => ({
  opacity: 0,
  filter: 'blur(12px)',
  x: (i) => (i - chars.length / 2) * 4,
});
const charsShown = { opacity: 1, filter: 'blur(0px)', x: 0 };

// Course units: -INTRO…0 is the first dish thawing, then each course holds for HOLD and
// spends the rest of its unit on a frost transition into the next one.
const stateAt = (progress, count) => {
  const u = progress * (count + INTRO) - INTRO;
  if (u < 0) return { from: 0, to: 0, mix: 0, frost: -u / INTRO, seed: 0, active: 0, local: 0 };

  const i = Math.min(Math.floor(u), count - 1);
  const local = u - i;
  if (i === count - 1 || local < HOLD) return { from: i, to: i, mix: 0, frost: 0, seed: 0, active: i, local };

  const t = (local - HOLD) / (1 - HOLD);
  return {
    from: i,
    to: i + 1,
    mix: t < 0.5 ? 0 : 1,
    frost: Math.min(1, (1 - Math.abs(2 * t - 1)) * 1.25),
    seed: i + 1,
    active: t < 0.5 ? i : i + 1,
    local,
  };
};

export const mountMenu = ({ root, reducedMotion }) => {
  const courses = [...root.querySelectorAll('.course')];
  const images = courses.map((course) => course.querySelector('.course__img'));
  const ingredients = [...root.querySelectorAll('.ingredient')];
  const dish = root.querySelector('.menu__dish');
  const state = { from: 0, to: 0, mix: 0, frost: 1, seed: 0 };
  let frost = null;
  let active = -1;

  const load = () => {
    root.querySelectorAll('img[data-src]').forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
    if (reducedMotion) return;
    Promise.all([import('./frost.js'), ...images.map((img) => img.decode())]).then(([{ createFrost }]) => {
      frost = createFrost(root.querySelector('.menu__canvas'), images, state);
    });
  };

  if (reducedMotion) {
    root.classList.add('menu--static');
    return { load };
  }

  const titles = courses.map((course) => splitChars(course.querySelector('.course__title')));
  const lines = courses.map((course) => course.querySelectorAll('.course__meta, .course__desc, .course__wine'));
  const byCourse = courses.map((_, i) => ingredients.filter((el) => Number(el.dataset.course) === i));

  gsap.set(ingredients, { opacity: 0, scale: 0.85, filter: 'blur(10px)' });

  const showCourse = (next, instant) => {
    const prev = active;
    active = next;
    const duration = instant ? 0 : 1;

    if (prev >= 0) {
      const out = courses[prev];
      gsap.killTweensOf([out, ...titles[prev], ...lines[prev]]);
      gsap.to(out, {
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.4 * duration,
        onComplete: () => out.classList.remove('is-active'),
      });
      gsap.to(byCourse[prev], { opacity: 0, scale: 0.85, filter: 'blur(10px)', duration: 0.5 * duration, overwrite: 'auto' });
    }

    const inc = courses[next];
    gsap.killTweensOf([inc, ...titles[next], ...lines[next]]);
    inc.classList.add('is-active');
    gsap.set(inc, { opacity: 1, filter: 'blur(0px)' });
    gsap.fromTo(titles[next], charsHidden(titles[next]), {
      ...charsShown,
      duration: 0.9 * duration,
      stagger: 0.025 * duration,
      ease: 'power3.out',
    });
    gsap.fromTo(
      lines[next],
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6 * duration, stagger: 0.08 * duration, delay: 0.25 * duration, ease: 'power2.out' },
    );
    gsap.to(byCourse[next], {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.9 * duration,
      stagger: 0.1 * duration,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  const drift = ingredients.map((el) => gsap.quickSetter(el, 'y', 'px'));
  const applyDrift = (local) => {
    ingredients.forEach((el, i) => drift[i]((0.5 - local) * DRIFT_PX * Number(el.dataset.depth)));
  };

  gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: () => `+=${window.innerHeight * PIN_VH}`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: ({ progress }) => {
        const s = stateAt(progress, courses.length);
        Object.assign(state, s);
        frost?.render();
        applyDrift(s.local);
        if (s.active !== active) showCourse(s.active, false);
      },
    },
  });

  const cursorTargets = ingredients.map((el) => {
    const img = el.querySelector('img');
    return {
      depth: Number(el.dataset.depth),
      x: gsap.quickTo(img, 'x', { duration: 0.9, ease: 'power3.out' }),
      y: gsap.quickTo(img, 'y', { duration: 0.9, ease: 'power3.out' }),
    };
  });
  const dishX = gsap.quickTo(dish, 'x', { duration: 1.2, ease: 'power3.out' });
  const dishY = gsap.quickTo(dish, 'y', { duration: 1.2, ease: 'power3.out' });
  window.addEventListener('pointermove', (e) => {
    const px = (e.clientX / window.innerWidth) * 2 - 1;
    const py = (e.clientY / window.innerHeight) * 2 - 1;
    cursorTargets.forEach(({ depth, x, y }) => {
      x(px * CURSOR_PX * depth);
      y(py * CURSOR_PX * depth);
    });
    dishX(px * CURSOR_PX * 0.15);
    dishY(py * CURSOR_PX * 0.15);
  });

  showCourse(0, true);
  return { load };
};
