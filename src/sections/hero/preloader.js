import { gsap } from 'gsap';

const TICK_MS = 900;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const tickTo = (secEl, value) =>
  gsap
    .timeline()
    .to(secEl, { yPercent: -40, opacity: 0, duration: 0.18, ease: 'power2.in' })
    .add(() => {
      secEl.textContent = value;
    })
    .fromTo(secEl, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.3, ease: 'power3.out' });

export const runPreloader = async (el, ready, { animate }) => {
  const secEl = el.querySelector('.preloader__sec');

  if (!animate) {
    secEl.textContent = '59';
    await ready;
    el.remove();
    return;
  }

  await wait(TICK_MS);
  await tickTo(secEl, '58');
  await Promise.all([ready, wait(TICK_MS)]);
  await tickTo(secEl, '59');
  await wait(450);
  await gsap.to(el, { opacity: 0, duration: 0.9, ease: 'power2.inOut' });
  el.remove();
};
