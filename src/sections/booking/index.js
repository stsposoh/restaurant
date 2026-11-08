import { gsap } from 'gsap';
import foxMark from '../../../assets/logo/redfox-mark.svg?raw';

const MIN_GUESTS = 1;
const MAX_GUESTS = 6;
const QR_SIZE = 25;
const MIDNIGHT = new Date(2027, 0, 1);

const pad = (n) => String(n).padStart(2, '0');

const hash = (text) => {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
};

const random = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// A decorative QR-like pattern: three finder squares plus seeded modules. Not scannable.
const drawQr = (svg, seed) => {
  const next = random(hash(seed));
  const finder = (x, y) => (cx, cy) => {
    const dx = cx - x;
    const dy = cy - y;
    if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null;
    const ring = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
    return ring !== 2;
  };
  const finders = [finder(0, 0), finder(QR_SIZE - 7, 0), finder(0, QR_SIZE - 7)];
  let path = '';
  for (let y = 0; y < QR_SIZE; y++) {
    for (let x = 0; x < QR_SIZE; x++) {
      const fixed = finders.map((f) => f(x, y)).find((v) => v !== null);
      const on = fixed ?? (finders.every((f) => f(x - 1, y) === null && f(x, y - 1) === null) && next() > 0.52);
      if (on) path += `M${x} ${y}h1v1h-1z`;
    }
  }
  svg.innerHTML = `<path d="${path}"/>`;
};

export const mountBooking = ({ root, reducedMotion }) => {
  const form = root.querySelector('.ticket__front');
  const back = root.querySelector('.ticket__back');
  const inner = root.querySelector('.ticket__inner');
  const nameInput = form.elements.name;
  const error = root.querySelector('#booking-error');
  const guestsOut = form.querySelector('.stepper__value');
  const stepButtons = [...form.querySelectorAll('[data-step]')];
  const seatsEl = root.querySelector('.booking__seats');
  const countdownEl = root.querySelector('.booking__countdown');
  const announce = root.querySelector('[data-announce]');
  let guests = Number(guestsOut.textContent);
  let seatsLeft = Number(seatsEl.textContent);
  let booked = false;

  root.querySelectorAll('[data-mark]').forEach((el) => {
    el.innerHTML = foxMark;
  });
  drawQr(root.querySelector('[data-qr]'), root.querySelector('[data-qr]').dataset.qr);

  const setGuests = (value) => {
    guests = Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, value));
    guestsOut.textContent = guests;
    stepButtons[0].disabled = guests === MIN_GUESTS;
    stepButtons[1].disabled = guests === MAX_GUESTS;
  };
  stepButtons.forEach((button) => button.addEventListener('click', () => setGuests(guests + Number(button.dataset.step))));
  setGuests(guests);

  const tick = () => {
    const ms = MIDNIGHT - Date.now();
    if (ms <= 0) {
      countdownEl.parentElement.textContent = 'Happy New Year';
      return;
    }
    const s = Math.floor(ms / 1000);
    const days = Math.floor(s / 86400);
    countdownEl.textContent = `${days} ${days === 1 ? 'day' : 'days'}, ${pad(Math.floor(s / 3600) % 24)}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
  };
  tick();
  setInterval(tick, 1000);

  const flip = (toBack) => {
    form.inert = toBack;
    back.inert = !toBack;
    gsap.to(inner, { rotationY: toBack ? 180 : 0, duration: reducedMotion ? 0 : 1.1, ease: 'power3.inOut' });
  };

  nameInput.addEventListener('input', () => {
    if (!nameInput.value.trim()) return;
    nameInput.removeAttribute('aria-invalid');
    error.textContent = '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.setAttribute('aria-invalid', 'true');
      error.textContent = 'Add the name for the booking.';
      nameInput.focus();
      return;
    }
    const gondola = form.elements.gondola.value;
    const table = (hash(name) % 30) + 1;
    if (!booked) {
      seatsLeft -= guests;
      booked = true;
    }
    seatsEl.textContent = Math.max(0, seatsLeft);
    const values = { name, guests: String(guests), gondola, table: String(table) };
    back.querySelectorAll('[data-out]').forEach((el) => {
      el.textContent = values[el.dataset.out];
    });
    drawQr(back.querySelector('[data-qr-out]'), `${name}-${guests}-${gondola}`);
    flip(true);
    announce.textContent = `Table booked for ${name}, ${guests} ${guests === 1 ? 'guest' : 'guests'}, gondola at ${gondola}.`;
    back.querySelector('.ticket__booked').focus({ preventScroll: true });
  });

  back.querySelector('.ticket__edit').addEventListener('click', () => {
    seatsLeft += guests;
    booked = false;
    seatsEl.textContent = seatsLeft;
    flip(false);
    nameInput.focus({ preventScroll: true });
  });
};
