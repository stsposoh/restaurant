# DEV BRIEF — Red Fox landing, Phase 5: Frozen Moments

Continues [DEV-BRIEF-PHASE-4.md](DEV-BRIEF-PHASE-4.md). Concept: [../BRIEF.md](../BRIEF.md) §6.6. Same rules: load **frontend-design** before visual decisions, check library docs via Context7 / Ref, follow `CLAUDE.md`.

---

## 1. Goal

A gallery in depth: eight frozen moments hang in 3D space; scroll flies the camera through them (three.js). Mixed light — sparklers and candle warmth inside, snow outside.

## 2. Assets

`references/06-frozen-moments/G1…G8_*.jpg` — 3:4 (1792×2400) and 16:9 (2752×1536) alternating. `scripts/build-moments.mjs`: WebP, long side 1600, q≈80 → `public/moments/`. Target ≤ 2 MB. Loaded after the hero's first pass.

## 3. Scene

- Pinned ~6 viewports. Photos are planes along −z (~5 units apart), alternating left/right with small vertical and rotation jitter, sized by their real aspect.
- The camera moves forward with scroll and drifts slightly with the cursor. Far photos dissolve into `--ink` (fog); a photo fades out just before the camera reaches it, so nothing clips.
- A sparse cloud of frozen snow and gold dust fills the space between the photos (static in time; depth comes only from the camera moving through it — the site's core idea).
- Render on demand; nothing renders off-screen or idle.

## 4. Captions — timecodes

Each photo carries one caption: a timecode `23:59:59.xxx` (tabular Switzer), placed under the photo's lower-left corner and following it in screen space. **The milliseconds equal the value the site-wide scroll clock shows at the moment the camera passes that photo** — computed from real scroll positions on refresh, so caption and clock agree. No other copy; a visually hidden `h2` "Frozen moments" and alt texts for structure.

## 5. Reduced motion

No pin, no WebGL: the eight photos as a static two-column gallery with their timecodes.

## 6. Acceptance criteria

1. `npm run dev` / `npm run build` clean; no console errors or warnings.
2. Phases 1–4 still pass (spot-check).
3. Camera passes all eight photos in order; no clipping; both directions.
4. Captions follow their photos; each timecode matches the scroll clock when that photo is passed (±2 ms).
5. No rendering when idle or off-screen.
6. Reduced-motion fallback.
7. Report asset weight; screenshots (Playwright, DPR 2): entering, mid-flight, last photo; reduced motion.

## 7. Out of scope

Chef, Booking, Finale.
