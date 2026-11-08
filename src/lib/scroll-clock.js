import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const createScrollClock = (el) => {
  const time = el.querySelector('.scroll-clock__time');
  const ms = el.querySelector('.scroll-clock__ms');
  let last = -1;
  let midnight = false;

  const write = (value) => {
    time.textContent = midnight ? '00:00:00' : '23:59:59';
    ms.textContent = `.${String(midnight ? 0 : value).padStart(3, '0')}`;
  };

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: ({ progress }) => {
      const value = Math.round(progress * 999);
      if (value === last) return;
      last = value;
      write(value);
    },
  });

  return {
    setMidnight: (on) => {
      if (on === midnight) return;
      midnight = on;
      write(Math.max(0, last));
    },
  };
};
