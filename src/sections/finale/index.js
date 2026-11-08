import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitChars } from '../../lib/split.js';
import { snowState } from '../../lib/snow-state.js';
import { loadLazyImages } from '../../lib/lazy-images.js';

const PIN_VH = 3;
const STRIKE = 0.35;

export const mountFinale = ({ root, clock, reducedMotion }) => {
  const stage = root.querySelector('.finale__stage');
  const sky = root.querySelector('.finale__sky');
  let fireworks = null;
  let struck = false;
  let visible = false;

  const load = () => {
    loadLazyImages(root);
    if (reducedMotion) return;
    import('./fireworks.js').then(({ createFireworks }) => {
      fireworks = createFireworks(root.querySelector('.finale__fireworks'));
      fireworks.setRunning(struck && visible);
    });
  };

  if (reducedMotion) {
    ScrollTrigger.create({ trigger: stage, start: 'top center', onToggle: ({ isActive }) => clock.setMidnight(isActive), end: 'max' });
    return { load };
  }

  const chars = splitChars(root.querySelector('.finale__wordmark'));
  const reveal = root.querySelectorAll('.finale__line, .finale__cta');
  gsap.set(chars, { opacity: 0, filter: 'blur(14px)', yPercent: 12 });
  gsap.set(reveal, { autoAlpha: 0, y: 14 });

  const strike = (on) => {
    struck = on;
    clock.setMidnight(on);
    snowState.falling = on;
    fireworks?.setRunning(on && visible);
    gsap.killTweensOf([...chars, ...reveal]);
    if (on) {
      gsap.to(chars, { opacity: 1, filter: 'blur(0px)', yPercent: 0, duration: 1.2, stagger: 0.06, ease: 'power3.out' });
      gsap.to(reveal, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, delay: 0.5, ease: 'power2.out' });
    } else {
      gsap.to(chars, { opacity: 0, filter: 'blur(14px)', yPercent: 12, duration: 0.5 });
      gsap.to(reveal, { autoAlpha: 0, y: 14, duration: 0.4 });
    }
  };

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: () => `+=${window.innerHeight * PIN_VH}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          snowState.finale = Math.min(1, progress / 0.2);
          if (progress >= STRIKE !== struck) strike(progress >= STRIKE);
        },
        onLeaveBack: () => {
          snowState.finale = 0;
          if (struck) strike(false);
        },
      },
    })
    .fromTo(sky, { scale: 1.06 }, { scale: 1, duration: 1 }, 0);

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    fireworks?.setRunning(struck && visible);
    snowState.falling = struck && visible;
  }).observe(stage);

  return { load };
};
