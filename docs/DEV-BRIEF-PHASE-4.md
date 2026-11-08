# DEV BRIEF — Red Fox landing, Phase 4: The Night (clock)

Continues [DEV-BRIEF-PHASE-3.md](DEV-BRIEF-PHASE-3.md). Concept: [../BRIEF.md](../BRIEF.md) §6.5. Same rules: load **frontend-design** before visual decisions, check library docs via Context7 / Ref, follow `CLAUDE.md`.

---

## 1. Goal

The programme of the evening. Pinned section; **scroll = time** from 18:30 to 23:59:59. A 3D wall clock under a single warm spotlight; at each event the clock slides aside and turns in 3D, the light moves to the event photo, which is revealed by a conic "clock sweep". The second hand ticks through the last minute and stops at 23:59:59.

Light temperature: warm (amber spotlight on a dark wall). Background drifts from lilac dusk to deep night.

## 2. Assets

| Source | Treatment |
|---|---|
| `references/05-night-clock/old_fashioned_clock_-_4096px2.glb` (29.6 MB: ~46k verts, 1 material, 3 × 4K PNG) | `scripts/build-clock.mjs`: geometry-only GLB (textures stripped) + our own textures as WebP: recoloured base colour atlas (2048), normal (1024), metal/roughness by region (512). Target ≤ 3 MB total. |
| Atlas regions (from UV ↔ radius analysis) | dial `u < 0.28` (replaced by our dial); ring next to the dial `u 0.28–0.415` (r 0.239–0.30) → **brass**; outer case `u ≥ 0.415` and the back disk → **black lacquer**; hands → black. |
| `N1…N6_*.jpg` (2752×1536) | event photos, WebP 1600 wide → `public/night/` |
| `N7_0000_fireworks.jpg` | not used here (midnight belongs to the finale) |

Model attribution (CC BY 4.0) goes in the footer in the finale phase: *"Old Fashioned Clock" by Mark Peters*.

### Our dial
Canvas texture (2048²): aged ivory face, Roman numerals and a minute track in the spirit of the client reference (`clock-reference.png`), a small fox mark and `Hollister Peak` instead of the maker's name. Numerals set in Zodiak (loaded before drawing). Drawn on a disc just in front of the model's dial.

### Our second hand
Thin brass needle with a counterweight, added in code.

## 3. Programme (EN)

Titles from BRIEF §6.5; one-line descriptions condensed from the photo prompts — **draft copy for client approval**.

| Time | Title | Line |
|---|---|---|
| 18:30 | Last gondola up | The cabins climb through blue dusk as the peaks turn pink. |
| 19:00 | Champagne on the snow terrace | An ice bar, fire bowls and the whole range behind you. |
| 20:30 | Dinner begins | Seven courses, served by candlelight. |
| 21:30 | Live: jazz by the fireplace | Voice, double bass and piano beside the stone hearth. |
| 23:00 | Torchlight descent | The ski school carries fire down the dark slope. |
| 23:30 | Grand dessert — flambé at the table | Hollister Peak, set alight. |
| 23:59:59 | The frozen second | (no photo) the second hand stops; everything holds still. |
| 00:00 · 01:00 | Fireworks over Hollister ridge · After-party | shown dimmed: "Midnight is waiting. Keep scrolling." |

## 4. Scene (three.js)

- Dark wall plane (`--ink` with a subtle plaster noise), one warm `SpotLight` (`--candle`) from upper left with soft shadows: the clock casts a shadow on the wall.
- Clock materials: black lacquer (dark, glossy), brass ring (metallic), our dial, glass kept subtle.
- Event photo: a plane in the same scene, slightly tilted, reacts to the cursor. Shader: conic reveal starting from the minute hand's angle at the event time, a thin glowing edge with slight distortion, brightness tied to the spotlight ("steps into the light").
- When an event is on: the spot target moves to the photo, the clock falls into half-shadow but keeps a rim highlight (weak back light).
- Render on demand (scroll, cursor, resize) and only while the section is on screen.

## 5. Scroll choreography

Pinned ~9 viewports. Time runs only while the clock is centred; during an event it barely moves.

Per event: **run** (clock centred, face-on, time advances) → **arrive** (clock slides to one side, scales down, turns in 3D — side alternates, angles differ each time) → **reveal** (photo sweeps in, text builds) → **hold** → **leave**. For close events (18:30 → 19:00, 23:00 → 23:30) the clock does not return to the centre — it moves straight to the other side.

Finale: 23:30 → 23:59:00 runs quickly, then the last minute is slow and the second hand **ticks** (discrete steps) to 59 and stops. "The frozen second" title; the locked 00:00/01:00 slots appear dimmed.

Text: event time (tabular Switzer), title (Zodiak, per-letter freeze-in), one line. Placed under the photo, aligned with its left edge. A digital `HH:MM:SS` readout sits under the clock and follows it.

## 6. Reduced motion

No pin, no WebGL: the programme as a static list (time, title, line, photo), clock omitted; the final line reads 23:59:59.

## 7. Acceptance criteria

1. `npm run dev` / `npm run build` clean; no console errors or warnings.
2. Phases 1–3 still pass (spot-check).
3. Readout and hands agree with the timeline; time is monotonic with scroll; ends exactly at 23:59:59 with the second hand stopped.
4. Six events reveal in order with the correct photo/text, both directions; sides alternate.
5. Clock reads as black lacquer + brass ring + ivory dial with our numerals, fox mark and `Hollister Peak`; it casts a shadow on the wall.
6. No rendering when the section is off-screen or idle.
7. Assets ≤ 3 MB for the clock, report photo weight.
8. Reduced-motion fallback.
9. Screenshots (Playwright, DPR 2): clock centred, event mid-sweep, event held, the frozen second; reduced motion.

## 8. Out of scope

Frozen Moments, Chef, Booking, Finale (fireworks, attribution footer).
