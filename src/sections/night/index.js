import { gsap } from 'gsap';
import { splitChars } from '../../lib/split.js';

const START = 18 * 3600 + 30 * 60;
const LAST_MINUTE = 23 * 3600 + 59 * 60;
const VH_PER_UNIT = 0.75;
const TAU = Math.PI * 2;
const CENTRE = { x: 0, y: 0, scale: 1, rx: 0, ry: 0, rz: 0 };
const SIDE_POSES = [
  { rx: -0.1, ry: 0.55, rz: 0.04 },
  { rx: 0.08, ry: 0.7, rz: -0.05 },
  { rx: -0.05, ry: 0.6, rz: 0.06 },
  { rx: 0.12, ry: 0.75, rz: -0.03 },
  { rx: -0.08, ry: 0.5, rz: 0.05 },
  { rx: 0.06, ry: 0.65, rz: -0.06 },
];

const ease = gsap.parseEase('power2.inOut');
const lerp = (a, b, t) => a + (b - a) * t;
const segment = (f, from, to) => Math.min(1, Math.max(0, (f - from) / (to - from)));
const lerpPose = (a, b, t) => Object.fromEntries(Object.keys(a).map((k) => [k, lerp(a[k], b[k], t)]));
const sideOf = (i) => (i % 2 === 0 ? 1 : -1);
const sidePose = (i) => {
  const side = sideOf(i);
  const p = SIDE_POSES[i];
  return { x: side * 2.1, y: 0.15, scale: 0.55, rx: p.rx, ry: -side * p.ry, rz: p.rz };
};

const pad = (n) => String(n).padStart(2, '0');
const formatTime = (t) => `${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}:${pad(Math.floor(t % 60))}`;

const buildPhases = (minutes) => {
  const phases = [];
  minutes.forEach((m, i) => {
    const at = START + m * 60;
    const gap = i === 0 ? 0 : m - minutes[i - 1];
    const close = i > 0 && gap <= 30;
    const nextClose = i < minutes.length - 1 && minutes[i + 1] - m <= 30;
    const from = i === 0 ? START : START + (minutes[i - 1] + 5) * 60;
    phases.push({ type: 'run', dur: i === 0 ? 0.35 : 0.35 + (Math.min(gap, 90) / 90) * 0.45, from, to: at, i, close });
    phases.push({ type: 'arrive', dur: 0.6, at, eventAt: at, i, close });
    phases.push({ type: 'reveal', dur: 0.4, from: at, to: at + 180, eventAt: at, i });
    phases.push({ type: 'hold', dur: 0.3, from: at + 180, to: at + 300, eventAt: at, i });
    phases.push({ type: 'leave', dur: 0.5, at: at + 300, eventAt: at, i, nextClose });
  });
  const lastEvent = START + (minutes.at(-1) + 5) * 60;
  phases.push({ type: 'run', dur: 0.6, from: lastEvent, to: LAST_MINUTE, i: -1 });
  phases.push({ type: 'tick', dur: 1.1, from: LAST_MINUTE });
  phases.push({ type: 'freeze', dur: 0.7 });
  return phases;
};

const stateAt = (phases, total, progress) => {
  let x = progress * total;
  let phase = phases.at(-1);
  for (const p of phases) {
    if (x <= p.dur) {
      phase = p;
      break;
    }
    x -= p.dur;
  }
  const f = Math.min(1, Math.max(0, x / phase.dur));
  const s = { time: 0, seconds: 0, clock: CENTRE, photo: { index: 0, x: 0, ry: 0, sweep: 0, light: 0, start: 0 }, event: -1, finale: false };
  const i = phase.i;
  // The sweep starts where the minute hand points at the event time.
  const photoFor = (sweep, light) => ({
    index: i,
    x: -sideOf(i) * 1.0,
    ry: sideOf(i) * 0.16,
    sweep,
    light,
    start: (((phase.eventAt / 60) % 60) / 60) * TAU,
  });

  switch (phase.type) {
    case 'run':
      s.time = lerp(phase.from, phase.to, f);
      s.clock = phase.close ? sidePose(i - 1) : CENTRE;
      break;
    case 'arrive':
      s.time = phase.at;
      // The clock clears the photo's area before the photo appears, so the two never intersect.
      s.clock = lerpPose(phase.close ? sidePose(i - 1) : CENTRE, sidePose(i), ease(segment(f, 0, 0.65)));
      s.photo = photoFor(0, segment(f, 0.55, 1) * 0.6);
      break;
    case 'reveal':
      s.time = lerp(phase.from, phase.to, f);
      s.clock = sidePose(i);
      s.photo = photoFor(f, 0.6 + 0.4 * f);
      s.event = i;
      break;
    case 'hold':
      s.time = lerp(phase.from, phase.to, f);
      s.clock = sidePose(i);
      s.photo = photoFor(1, 1);
      s.event = i;
      break;
    case 'leave':
      s.time = phase.at;
      // Mirror of 'arrive': the photo is gone before the clock moves back across its area.
      s.clock = phase.nextClose ? sidePose(i) : lerpPose(sidePose(i), CENTRE, ease(segment(f, 0.35, 1)));
      s.photo = photoFor(1, 1 - segment(f, 0, 0.4));
      break;
    case 'tick':
      s.seconds = Math.min(59, Math.floor(f * 60));
      s.time = phase.from + s.seconds;
      break;
    default:
      s.seconds = 59;
      s.time = LAST_MINUTE + 59;
      s.finale = true;
  }
  if (phase.type !== 'tick' && phase.type !== 'freeze') s.time = Math.floor(s.time / 60) * 60;
  s.night = (s.time - START) / (LAST_MINUTE + 59 - START);
  return s;
};

export const mountNight = ({ root, reducedMotion }) => {
  const events = [...root.querySelectorAll('.event')];
  const photos = events.map((el) => el.querySelector('.event__img'));
  const readout = root.querySelector('.night__readout');
  const finale = root.querySelector('.night__finale');
  const list = root.querySelector('.night__events');
  let scene = null;
  let state = null;

  const load = () => {
    root.querySelectorAll('img[data-src]').forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
    if (reducedMotion) return;
    Promise.all([import('./scene.js'), ...photos.map((img) => img.decode())]).then(async ([{ createNightScene }]) => {
      scene = await createNightScene(root.querySelector('.night__canvas'), photos);
      draw();
    });
  };

  if (reducedMotion) {
    root.classList.add('night--static');
    return { load };
  }

  const minutes = events.map((el) => Number(el.dataset.minute));
  const phases = buildPhases(minutes);
  const total = phases.reduce((sum, p) => sum + p.dur, 0);
  const pointer = { x: 0, y: 0 };
  const pointerTarget = { x: 0, y: 0 };
  let visible = false;
  let activeEvent = -1;
  let finaleShown = false;

  const titles = events.map((el) => splitChars(el.querySelector('.event__title')));
  const lines = events.map((el) => el.querySelectorAll('.event__time, .event__line'));
  const finaleTitle = splitChars(finale.querySelector('.night__frozen-title'));
  gsap.set(finale, { autoAlpha: 0 });

  const showEvent = (next) => {
    const prev = activeEvent;
    activeEvent = next;
    if (prev >= 0) {
      const out = events[prev];
      gsap.killTweensOf([out, ...titles[prev], ...lines[prev]]);
      gsap.to(out, { autoAlpha: 0, filter: 'blur(8px)', duration: 0.4 });
    }
    if (next < 0) return;
    const inc = events[next];
    gsap.killTweensOf([inc, ...titles[next], ...lines[next]]);
    gsap.set(inc, { autoAlpha: 1, filter: 'blur(0px)' });
    gsap.fromTo(
      titles[next],
      { opacity: 0, filter: 'blur(12px)', x: (k) => (k - titles[next].length / 2) * 4 },
      { opacity: 1, filter: 'blur(0px)', x: 0, duration: 0.9, stagger: 0.022, ease: 'power3.out' },
    );
    gsap.fromTo(lines[next], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.2, ease: 'power2.out' });
  };

  const showFinale = (on) => {
    finaleShown = on;
    gsap.killTweensOf([finale, ...finaleTitle]);
    if (!on) {
      gsap.to(finale, { autoAlpha: 0, duration: 0.4 });
      return;
    }
    gsap.set(finale, { autoAlpha: 1 });
    gsap.fromTo(
      finaleTitle,
      { opacity: 0, filter: 'blur(12px)' },
      { opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.03, ease: 'power3.out' },
    );
  };

  const draw = () => {
    if (!scene || !state) return;
    const { readout: r, photoCorner } = scene.render({ ...state, pointer });
    readout.style.transform = `translate(${r.x}px, ${r.y}px) translate(-50%, 0)`;
    list.style.transform = `translate(${photoCorner.x}px, ${photoCorner.y + 24}px)`;
  };

  const update = (progress) => {
    state = stateAt(phases, total, progress);
    readout.textContent = formatTime(state.time);
    if (state.event !== activeEvent) showEvent(state.event);
    if (state.finale !== finaleShown) showFinale(state.finale);
    draw();
  };

  gsap.set(events, { autoAlpha: 0 });
  update(0);

  gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: () => `+=${window.innerHeight * total * VH_PER_UNIT}`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: ({ progress }) => update(progress),
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
    const dx = pointerTarget.x - pointer.x;
    const dy = pointerTarget.y - pointer.y;
    if (Math.abs(dx) < 0.0005 && Math.abs(dy) < 0.0005) return;
    pointer.x += dx * 0.06;
    pointer.y += dy * 0.06;
    draw();
  });
  window.addEventListener('resize', () => {
    scene?.resize();
    draw();
  });

  return { load };
};
