# DEV BRIEF — Red Fox landing, Phase 8: Finale — 00:00

Continues [DEV-BRIEF-PHASE-7.md](DEV-BRIEF-PHASE-7.md). Concept: [../BRIEF.md](../BRIEF.md) §3 and §6.9. Same rules: load **frontend-design** before visual decisions, check library docs via Context7 / Ref, follow `CLAUDE.md`.

---

## 1. Goal

The payoff of the whole site. The clock strikes midnight and **time unfreezes**: the snow that has hung motionless since the hero starts to fall, fireworks open over the ridge, a huge `Red Fox` wordmark. Then contacts and credits.

Light: cold night → flashes of the fireworks.

## 2. Assets

`references/09-finale/F1_sky.jpg` (night sky, restaurant small on the summit) → `public/finale/F1.webp` via `scripts/build-photos.mjs`.

## 3. Scroll and the strike

- Pinned ~3 viewports, full-bleed F1.
- 0–20%: the frozen snow layer fades back in over the sky (still motionless).
- **Strike (~35%)**: the site-wide clock switches from `23:59:59.xxx` to `00:00:00.000`; the snow begins to fall; fireworks start; the wordmark freezes into place letter by letter; the closing line, CTA and footer appear.
- Scrolling back above the strike stops time again: the clock returns to `23:59:59.xxx`, snow freezes where it is, fireworks stop.

## 4. Shared code touched

- `src/lib/snow.js`: a `falling` state — points fall with per-point speed and a slight sway, wrapping vertically; time-based only while falling; render stays on-demand otherwise.
- `src/lib/scroll-clock.js`: a midnight override (`00:00:00.000`).

Re-check the hero and Ascent snow after the change.

## 5. Fireworks (three.js)

Separate transparent canvas over F1. CPU-simulated bursts (rocket rising from the ridge → spherical burst with gravity, drag, fade and short tails), additive blending, colours `--candle` and `--snow` only. A new burst every ~0.7–1.4 s. Runs only after the strike and while the section is on screen.

## 6. Content (EN) — draft, fictional

- Closing line: "Happy New Year from 2847 metres." + CTA "Book your table" (the main CTA, `--fox`).
- Wordmark `Red Fox`, Zodiak, ~20vw, sentence case like the nav wordmark — set across the sky, not the lower third, so the restaurant on the summit stays visible.
- Footer: "Red Fox, summit of Hollister Peak, upper gondola station" · `hello@redfox.example` · "Instagram @redfox.hollister" (plain text, not a link — the account doesn't exist).
- Credits: *"Old Fashioned Clock" by Mark Peters*, CC BY 4.0, linked to the Sketchfab model and the licence (required by the licence).
- Honest note: "A design concept. Red Fox and Hollister Peak are fictional."

## 7. Reduced motion

No pin, no fireworks, no falling snow. The section shows its post-midnight state statically; the clock still switches to `00:00:00.000` when the section is reached.

## 8. Acceptance criteria

1. `npm run dev` / `npm run build` clean; no console errors or warnings.
2. Earlier phases unaffected — snow in hero/Invitation/Ascent still frozen and correctly coloured.
3. Strike happens at one scroll position in both directions; clock, snow, fireworks and wordmark switch together.
4. Fireworks and falling snow stop when the section leaves the screen.
5. Attribution present and linked.
6. Reduced-motion fallback.
7. Screenshots (Playwright, DPR 2): before strike, just after, fireworks in full; reduced motion.
