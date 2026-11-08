import './styles/tokens.css';
import './styles/base.css';
import './styles/hero.css';
import './styles/invitation.css';
import './styles/ascent.css';
import './styles/menu.css';
import './styles/night.css';
import './styles/moments.css';
import './styles/chef.css';
import './styles/booking.css';
import './styles/finale.css';
import logoMono from '../assets/logo/redfox-mark-mono.svg?raw';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createScroll, reducedMotion } from './lib/scroll.js';
import { createScrollClock } from './lib/scroll-clock.js';
import { mountHero } from './sections/hero/index.js';
import { mountInvitation } from './sections/invitation/index.js';
import { mountAscent } from './sections/ascent/index.js';
import { mountMenu } from './sections/menu/index.js';
import { mountNight } from './sections/night/index.js';
import { mountMoments } from './sections/moments/index.js';
import { mountChef } from './sections/chef/index.js';
import { mountBooking } from './sections/booking/index.js';
import { mountFinale } from './sections/finale/index.js';

history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

document.querySelector('[data-logo]').innerHTML = logoMono;

const lenis = createScroll();

const heroReady = mountHero({
  root: document.querySelector('.hero'),
  preloader: document.querySelector('.preloader'),
  lenis,
  reducedMotion,
});
mountInvitation({ root: document.querySelector('.invitation'), reducedMotion });
const ascent = mountAscent({ root: document.querySelector('.ascent'), reducedMotion });
const menu = mountMenu({ root: document.querySelector('.menu'), reducedMotion });
const night = mountNight({ root: document.querySelector('.night'), reducedMotion });
const moments = mountMoments({ root: document.querySelector('.moments'), reducedMotion });
const chef = mountChef({ root: document.querySelector('.chef'), reducedMotion });
mountBooking({ root: document.querySelector('.booking'), reducedMotion });
const clock = createScrollClock(document.querySelector('.scroll-clock'));
const finale = mountFinale({ root: document.querySelector('.finale'), clock, reducedMotion });

// Static (reduced-motion) sections grow as their images load after `load`, so triggers must re-measure.
if (reducedMotion) {
  let timer = 0;
  new ResizeObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(() => ScrollTrigger.refresh(), 150);
  }).observe(document.body);
}

heroReady.then(() => {
  ascent.load();
  menu.load();
  night.load();
  moments.load();
  chef.load();
  finale.load();
  if (!reducedMotion) {
    import('./lib/snow.js').then(({ createSnow }) => createSnow(document.querySelector('.snow')));
  }
});
