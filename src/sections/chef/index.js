import { gsap } from 'gsap';
import { splitWords } from '../../lib/split.js';

const PIN_VH = 2.5;

export const mountChef = ({ root, reducedMotion }) => {
  const load = () => {
    root.querySelectorAll('img[data-src]').forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  };
  if (reducedMotion) return { load };

  const stage = root.querySelector('.chef__stage');
  const words = splitWords(root.querySelector('.chef__quote'));

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
      },
    })
    .fromTo(root.querySelector('.chef__portrait'), { '--light': -18 }, { '--light': 150, duration: 0.7, ease: 'power1.in' }, 0)
    .fromTo(
      words,
      { opacity: 0, filter: 'blur(12px)', y: 10 },
      { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.1, stagger: { amount: 0.4 }, ease: 'power2.out' },
      0.3,
    )
    .fromTo(root.querySelector('.chef__by'), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.82)
    .to({}, { duration: 0 }, 1);

  return { load };
};
