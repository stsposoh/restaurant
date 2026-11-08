# DEV BRIEF — Red Fox landing, Phase 1: scaffold + hero

You are implementing a desktop-only demo landing page for a fictional luxury restaurant. The creative concept, all sections and the visual language are in [../BRIEF.md](../BRIEF.md) (Russian) — read it fully first. This document is the engineering brief for **phase 1 only**.

Before any visual/markup decision, load the **frontend-design** skill and follow it. Follow the project rules in `CLAUDE.md` (English-only code comments, default to no comments; talk to the user in Russian, informal «ты»).

---

## 1. Goal of phase 1

A working project skeleton and a **production-quality hero**: a full-screen, scroll-scrubbed video (image sequence on canvas) with HTML overlays, plus the global scroll infrastructure every later section will reuse. Other sections are **placeholders only** (empty full-height dark blocks with the section name) so scroll length and pinning can be tested.

## 2. Constraints

- **Desktop only.** Target viewports 1280×800 … 1728×1117 CSS px (MacBook 13–16"), DPR 2. Nothing below 1280px.
- **English** copy. **No sound.** No SEO work.
- **Stack:** Vite + vanilla JS (ES modules), GSAP + ScrollTrigger, Lenis, three.js. No UI framework. Use **Context7 / Ref MCP** for current API docs of these libraries — don't rely on memory.
- Respect `prefers-reduced-motion`: show a static hero (final frame + texts), no scrubbing, no particles.

## 3. Design tokens (from BRIEF.md §5 — use exactly)

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0E1624` | page background (never pure/neutral black) |
| `--glacier` | `#2A3A52` | secondary surfaces, lines |
| `--snow` | `#EEF2F5` | text |
| `--candle` | `#E8A853` | warm highlights, active states |
| `--fox` | `#C4471D` | **only** the logo mark and the main "Book your table" CTA |

Typography (proposal, verify availability/licence before use): display — Zodiak (Fontshare) or Gloock (Google Fonts); text/figures — Switzer (Fontshare), tabular figures. Self-host as WOFF2 (the `optimize-webfonts` skill exists for subsetting). Avoid the generic tells listed in the frontend-design skill (ALL-CAPS eyebrows, middot meta strings, monospace labels, `→` on buttons).

## 4. Assets

- Hero source video: `references/01-hero/video/hero_v1.mp4` — 30.5 s, 1280×720, 24 fps, no audio.
- **Hero frames (use these):** `references/01-hero/frames-1920/0001.jpg …` — 12 fps (~366 frames), upscaled with Real-ESRGAN to 1920×1080. If the folder is incomplete when you start, ask the user — the upscale may still be running.
- Write a Node build script (e.g. `scripts/build-frames.mjs` with `sharp`) that converts them to WebP into `public/hero/` (quality ~72–80). Measure total size and report it. Consider a second, lighter set (every 2nd frame) for the initial load.
- Logo mark (SVG): `assets/logo/redfox-mark.svg` (full colour, for dark backgrounds) and `assets/logo/redfox-mark-mono.svg` (single colour via `currentColor`, for nav and small sizes). Pair the mark with a typographic wordmark `Red Fox` set in the display face — the wordmark is HTML text, not part of the SVG.

## 5. Hero spec

**Structure:** a pinned section; full-viewport `<canvas>` (cover-fit, DPR-aware); HTML overlay layer above it; a three.js transparent canvas for particles above the frames but below the text.

**Scroll mapping:** pinned for roughly **6–7 viewport heights** of scroll. Scroll progress → frame index, rendered via `requestAnimationFrame` only when the index changes. Lenis smooth scroll synced with ScrollTrigger. The **last frame is held for the final ~1–1.5 viewports** while the closing titles appear (slow scale 1 → 1.04 on the canvas + slight cursor parallax).

**Loading:** preload every 8th frame first so the scrub works immediately, then fill the rest in the background; draw the nearest loaded frame. Show a minimal preloader (BRIEF.md §6.0: a clock ticking `23:59:57 … 58 … 59` and stopping) until the first-pass frames are ready.

**Overlay timeline** (video time ≈ → text, EN):

| Video time | On screen |
|---|---|
| 0 s → | Nav (wordmark left; a few links right; "Book your table" in `--fox`) visible from the start. Title: **The last second of the year** |
| ~3–10 s | **Served at 23:59:59** |
| ~10–17 s | **Time stops at Red Fox** |
| ~17–23 s | (no text — camera passes backwards through the window) |
| ~23–30.5 s + hold | Closing title **New Year's Eve at 2847 metres** builds in as the facade with the RED FOX sign appears; primary CTA **Book your table** |

Titles are cinematic, left-aligned in the lower third, like film subtitles; one orchestrated reveal per title (not fade-up-everything). Copy may be refined with the frontend-design writing guidance — keep the meaning.

**Frozen particles (three.js):** a sparse layer of snow/gold-dust points that are **static in time** (they never fall) but shift slightly with cursor movement (parallax by depth). This is the concept: time is frozen, only the viewer moves. Keep it subtle; cap DPR at 2; pause rendering when the hero is off-screen.

**Global time indicator:** a small fixed readout `23:59:59.000` whose milliseconds advance with total page scroll progress (0 → 999). Built now, used site-wide.

## 6. Project structure (suggested)

```
index.html
src/
  main.js            # bootstraps Lenis + ScrollTrigger, mounts sections
  styles/            # tokens.css, base.css, sections
  sections/hero/     # frames loader, canvas renderer, overlay timeline, particles
  lib/               # lenis setup, scroll clock, utilities
public/hero/         # generated WebP frames
scripts/build-frames.mjs
```

## 7. Acceptance criteria — verify before reporting done

1. `npm run dev` and `npm run build` work; no console errors or warnings.
2. Scrubbing is smooth in both directions at 1440×900 and 1728×1117 (DPR 2); no blank frames while scrolling fast after initial load.
3. Overlay texts appear at the right moments; final hold shows closing title + CTA.
4. Particles are static in time and react to the cursor; rendering stops off-screen.
5. Reduced-motion fallback works.
6. Placeholder sections exist after the hero in the order from BRIEF.md §6.
7. Report: total hero frame weight, initial-load weight, screenshots (Playwright MCP) of 4 scroll positions.

## 8. Out of scope for phase 1

All other sections' real content (Invitation, Ascent, Menu, Night/Clock, Frozen Moments, Chef, Booking, Finale), the 3D clock, final logo, fonts fine-tuning beyond a first pass.
