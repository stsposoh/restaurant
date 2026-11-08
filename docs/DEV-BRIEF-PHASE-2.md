# DEV BRIEF — Red Fox landing, Phase 2: Invitation + The Ascent

Continues [DEV-BRIEF.md](DEV-BRIEF.md) (phase 1: scaffold + hero — done). Concept and sections: [../BRIEF.md](../BRIEF.md) §6.2–6.3. Same rules: load **frontend-design** before visual decisions, check library docs via Context7 / Ref, follow `CLAUDE.md`.

---

## 1. Goal of phase 2

Two cold-light sections that continue the hero without a cut:

1. **Invitation** — a typographic pause: the hero image goes dark, the frozen snow stays, the invitation copy builds in word by word.
2. **The Ascent** — a pinned, multi-layer parallax ride in the gondola from the valley (1 200 m) to the summit (2 847 m), through a cloud layer, ending with the cabin doors opening into the next section (Menu).

Plus one piece of shared infrastructure: the frozen-snow WebGL layer moves from the hero into a **global fixed layer** that lives across Hero → Invitation → Ascent.

## 2. Constraints

Unchanged from phase 1: desktop only (1280×800 … 1728×1117, DPR 2), EN copy, no sound, vanilla JS + GSAP/ScrollTrigger + Lenis + three.js, `prefers-reduced-motion` respected.

## 3. Shared snow layer (refactor of phase-1 code)

- Move the particles canvas out of `.hero` into a page-level fixed canvas (`.snow`), above section backgrounds and imagery, below text.
- The particles stay **static in time** (never fall); they move only with the viewer:
  - cursor → depth parallax (as now);
  - Hero scroll → camera dolly back (as now);
  - Ascent scroll → camera rises (points drift down by depth — the viewer is ascending).
- Visible over Hero, Invitation and Ascent; fades out as the doors open into Menu (the Menu interior is warm and indoors — no snow).
- Render only while visible (opacity > 0) and while something changed — same rule as phase 1.

**Blast radius:** touches `src/sections/hero/` (particles mount, dolly mapping). Re-run phase-1 checks (§7 of DEV-BRIEF) after the refactor.

## 4. Hero exit (small change to phase 1)

Extend the hero pin by ~0.75 viewport after the final hold: the closing title and CTA leave, the frame canvas fades to `--ink`. The hero then unpins on a dark screen — Invitation starts on the same ink background with the snow still in place.

## 5. Invitation

**Copy (BRIEF.md §6.2, kept verbatim):**
> Some moments deserve to last forever. Spend the last second of 2026 with us — 2847 metres above the world.

- Pinned for ~2 viewports. Left-aligned, Zodiak Light, large (≈ 4–4.5vw), ≤ 20ch per line, sitting in the lower half of the frame — consistent with the hero's subtitle composition.
- Scroll-scrubbed word reveal using the hero's "freeze into place" vocabulary: each word goes from blurred and faint to sharp and full snow-white. Not a fade-up; no per-section entrance tricks beyond this one.
- No eyebrow, no button. The only thing on screen is the sentence and the snow.

## 6. The Ascent

### 6.1 Assets (`references/03-ascent/`, 2752×1536 JPG)

| ID | Content | Background | Treatment |
|---|---|---|---|
| A0 | full reference scene | — | reference only, not shipped |
| A1 | twilight sky | none | as is |
| A2 | far range, alpenglow | green `#00FF00` | chroma key; **remove baked-in moon** |
| A3 | mid mountains | green | chroma key |
| A4 | village "island" with rock underside | green | chroma key; **remove moon**; bottom edge must always be hidden behind A5/A6 |
| A5 | cloud band | black | ship as opaque, composite with `mix-blend-mode: screen` |
| A6 | foreground spruce tops | green | chroma key |
| A7 | gondola cabin + horizontal cable | green | chroma key; cable is tilted in layout by rotating the layer |
| A8 | summit with restaurant | green | chroma key; **remove moon** |

Build script `scripts/build-ascent.mjs` (sharp, raw pixels): green-dominance key → alpha with a soft edge, green-spill suppression on edge pixels, moon areas cleared by explicit rectangles, output WebP with alpha to `public/ascent/`. Report per-layer and total weight (target ≤ 3.5 MB total). A single moon is not reintroduced in this phase.

### 6.2 Scene and scroll

- Pinned for ~6 viewports. DOM layers (`<img>`, transformed by GSAP) for the images; one WebGL canvas for the cloud fog.
- The camera rises with the cabin: the gondola stays roughly at the visual centre on a tilted cable (drifts slightly up-right along it); the world moves down past it, each layer at its own rate (sky slowest → spruce fastest).

| Progress | What the viewer sees | Light |
|---|---|---|
| 0–0.25 | Valley: village lights below, mid mountains, spruce passing in front | dusk violet-pink |
| 0.25–0.45 | Village and spruce sink out of frame; far range grows; cloud band rises toward the cabin | cooling |
| 0.45–0.62 | **Through the cloud**: full-screen fog shader (fbm noise, scroll-driven density, warm underglow from the valley) swallows the frame and clears | — |
| 0.62–0.85 | Above the clouds: cloud sea below, sky darkens to night, summit A8 with the lit restaurant rises from below | night, cold |
| 0.85–1.0 | Arrival: the cabin closes in, then the **doors open** into the next section | warm seam of light |

- **Altimeter:** `1 200 m → 2 847 m`, tabular Switzer figures, left lower third, eased with the ascent (not linear — slower in the cloud). Integer metres with a thin space as thousands separator, as written in BRIEF.
- **One caption** at the start, from the real programme (BRIEF.md §6.5): `Last gondola up, 18:30`. No other copy in the section.
- **Doors transition:** the cabin zooms in until its glass fills the frame; a warm layer (candle glow on `--ink`) opens over it through a vertical split from the centre (`clip-path: inset(0 50% 0 50%)` → `inset(0)`), with a thin `--candle` line of light in the seam. The glow then settles to plain `--ink`, so the Menu section (also `--ink`, no top border) scrolls in without a seam. This is the warm/cold temperature switch described in BRIEF §5. Phase 3 should start Menu on `--ink` (or move the doors layer into Menu if it needs a different first frame).

### 6.3 Performance

- Load Ascent images after the hero's first-pass frames are ready (low priority), not on initial load.
- Fog shader renders only while its section is in its active range.
- Transforms only (`translate3d`, `scale`, `opacity`) on layers; no layout-affecting animation.

## 7. Reduced motion

- Hero: unchanged phase-1 fallback.
- Invitation: full sentence shown statically.
- Ascent: one static composition (above the clouds, summit and gondola visible), altimeter reads `2 847 m`, no fog animation, no doors animation, no snow.

## 8. Acceptance criteria — verify before reporting done

1. `npm run dev` / `npm run build` clean; no console errors or warnings.
2. Phase-1 criteria still pass after the snow refactor (hero scrub, titles, particles off-screen stop).
3. Hero → Invitation has no visual cut: the frame fades to ink, snow continuous across the boundary.
4. Invitation words reveal in order with scroll, both directions.
5. Ascent: no green fringes or moon remnants on layers; village underside never visible; layers never show an edge of the image at 1440×900 and 1728×1117.
6. Fog fully covers the frame at its peak and clears; altimeter reaches exactly `2 847 m`.
7. Doors reveal the Menu section; snow is gone once the doors are open.
8. Reduced-motion fallback works for both sections.
9. Report: Ascent asset weights; screenshots (Playwright, DPR 2) — Invitation mid-reveal, Ascent valley, in-cloud, above clouds, doors half-open.

## 9. Out of scope

Menu, The Night, Frozen Moments, Chef, Booking, Finale content; reintroducing a moon; gondola sway physics; sound.
