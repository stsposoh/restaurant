import { gsap } from 'gsap';
import { splitWords } from '../../lib/split.js';

const PIN_VH = 2;

export const mountInvitation = ({ root, reducedMotion }) => {
  if (reducedMotion) return;

  const words = splitWords(root.querySelector('.invitation__text'));

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: () => `+=${window.innerHeight * PIN_VH}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
      },
    })
    .fromTo(
      words,
      { opacity: 0, filter: 'blur(12px)', y: 10 },
      { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.12, stagger: { amount: 0.68 }, ease: 'power2.out' },
      0.05,
    )
    .to({}, { duration: 0 }, 1);
};
