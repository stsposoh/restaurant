# DEV BRIEF — Red Fox landing, Phase 7: Book your table (ski pass)

Continues [DEV-BRIEF-PHASE-6.md](DEV-BRIEF-PHASE-6.md). Concept: [../BRIEF.md](../BRIEF.md) §6.8. Same rules: load **frontend-design** before visual decisions, follow `CLAUDE.md`.

---

## 1. Goal

The conversion point of the whole site. The booking form is a ski pass / gondola ticket lying under a warm lamp: name, guests, arrival gondola, QR, fox. A live seat counter and a countdown to the real New Year. On submit the ticket flips and shows the issued pass.

Demo only: **no backend**. The booking lives in page memory; the seat counter drops by the number of guests for this visit.

## 2. Layout

- Normal flow, one viewport, no pin. Warm light: a soft `--candle` pool from above on the ticket; everything else `--ink`.
- Left column, lower third: `h2` "Book your table" (Zodiak, large); one line with the date and what is included; `24 of 120 seats left`; `Midnight in 53 days, 04:12:09` (live, tabular figures).
- Right: the ticket (~46vw). Light card (snow tinted warm by the lamp) with ink text — physically lit, so it doesn't break the dark-site rule. Lanyard hole at the top, a perforated stub on the right with a QR pattern and seat number, the fox mark + `Red Fox` wordmark, `Hollister Peak, 2847 m`, `31 December 2026`.
- Fox colour only on the submit button (the main CTA) and the mark.

## 3. Form

| Field | Control | Rules |
|---|---|---|
| Name for the booking | text input | required; error "Add the name for the booking." |
| Guests | stepper − / + | 1–6, default 2 |
| Gondola up | three radio options 17:30 / 18:00 / 18:30 (last gondola) | default 18:00 |

Submit: "Book your table". Proper labels, visible focus, errors and the result announced via `aria-live`.

## 4. The issued pass (back of the ticket)

Flip (rotateY, ~1 s) to the back: "Table booked" (the result names the action, "Book your table") with the name, guests, gondola time, seat (e.g. `Table 14`), the QR pattern (decorative, generated from the name), and "Edit booking" which flips back. Focus moves to the pass heading. Seats left drops by the number of guests (seats are counted per person).

Countdown: to 1 January 2027, 00:00 local time; after that it reads "Happy New Year".

## 5. Reduced motion

No flip animation — the faces swap instantly. Countdown still updates (it is information, not decoration).

## 6. Acceptance criteria

1. `npm run dev` / `npm run build` clean; no console errors or warnings.
2. Earlier phases unaffected (spot-check).
3. Empty name → error shown and announced, no flip. Valid → flip, pass shows exactly what was entered, seats 24 → 22 for two guests. Edit booking flips back with values kept.
4. Keyboard-only flow works (tab order, stepper buttons, radios, submit, edit).
5. Countdown is correct against the system clock.
6. Reduced-motion fallback.
7. Screenshots (Playwright, DPR 2): form, error state, issued pass; reduced motion.
