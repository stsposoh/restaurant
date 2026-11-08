# DEV BRIEF — Red Fox landing, Phase 3: The New Year's Menu

Continues [DEV-BRIEF-PHASE-2.md](DEV-BRIEF-PHASE-2.md). Concept: [../BRIEF.md](../BRIEF.md) §6.4 (Frost Reveal, WebGL). Same rules: load **frontend-design** before visual decisions, check library docs via Context7 / Ref, follow `CLAUDE.md`.

---

## 1. Goal

The main showcase of the site: seven courses, one dish at a time. Pinned section; when the course changes, frost creeps over the current dish, covers it completely and thaws into the next one. Text on the left changes with a per-letter animation; cut-out ingredients float around the plate at different depths.

Light temperature: **warm** (candles) — BRIEF §5. No snow in this section (it fades out during the Ascent doors).

## 2. Assets

| Source | Content | Treatment |
|---|---|---|
| `references/04-menu/dishes/D1…D7_v1.jpg` (2048², overhead, plate ~65% of frame, dark blue stone) | the seven dishes | WebP 1600², q≈80 → `public/menu/` |
| `references/04-menu/ingredients/I1…I12_*.jpg` (2752×1536, green screen) | cut-out ingredients | shared chroma key (same as Ascent; key code moves to `scripts/lib/chroma.mjs`), trimmed to the object, max 640 px, WebP with alpha → `public/menu/ingredients/` |

Known risks: **I11 dill** is a green object on a green screen (likely unusable — drop it if the key eats it); **I10 ice** is transparent (keep only if it reads as ice, not as a green-tinted blob).

Build script: `scripts/build-menu.mjs`. Report total weight (target ≤ 3 MB). Load after the hero's first pass, like the Ascent.

## 3. Content (EN)

Names and altitudes from PROMPTS.md §4. Descriptions condensed from the dish prompts. **Wine pairings are draft copy — to be approved by the client.**

| # | Title | Altitude | Description | Wine (draft) |
|---|---|---|---|---|
| 01 | Valley | 1 200 m | Alpine trout smoked over juniper, buttermilk, dill oil, rye crumble | Grüner Veltliner, Wachau |
| 02 | Forest | 1 650 m | Wild mushroom tart, chanterelles and porcini, black truffle, pine salt | Pinot Noir, Burgundy |
| 03 | Meadow under snow | 1 900 m | Celeriac baked in hay, brown butter, toasted hazelnuts, celeriac snow | Chardonnay, Jura |
| 04 | Glacier | 2 300 m | Scallop crudo, green apple granita, horseradish snow | Blanc de Blancs Champagne |
| 05 | The Midnight Lobster | 2 600 m | Lobster tail, champagne beurre blanc, Oscietra caviar, gold leaf | Vintage Champagne |
| 06 | Summit | 2 847 m | Venison loin in a juniper crust, red cabbage, lingonberries, red wine jus | Syrah, Northern Rhône |
| 07 | Hollister Peak | dessert | Baked Alaska shaped as the peak, torched meringue, cloudberry sauce | Tokaji Aszú |

Ingredients per course (two each, chosen from the dish): 01 juniper + salt (dill dropped — the key could not separate it), 02 chanterelle + spruce, 03 hazelnut + salt, 04 ice + salt, 05 caviar + gold leaf, 06 lingonberry + juniper, 07 cloudberry + red currant.

## 4. Layout

- Section pinned for ~8 viewports. The dish is the bold element: a large circle (~84vh) right of centre; the square photo dissolves into `--ink` with a radial falloff so there is no visible frame.
- Text column on the left, lower third (consistent with the hero and Ascent):
  - `Course 03 / 07` and the altitude — small Switzer, tabular figures (numbering is legitimate here: it is a real sequence);
  - title — Zodiak Light, large, per-letter "freeze into place" on change (same vocabulary as the hero);
  - description — Switzer, ≤ 36ch;
  - wine — one sentence, `--candle` (warm light on glass), e.g. "With a glass of Chardonnay, Jura."
- A visually hidden `h2` "The New Year's Menu" for structure; no visible eyebrow.
- A faint warm `--candle` glow behind the plate from the upper left (matches the light in the photos).

## 5. Frost Reveal (WebGL)

One three.js plane, custom shader, rendered on demand (only when a uniform changes).

- Uniforms: `uFrom`, `uTo` (dish textures), `uMix` (0/1 — which dish is shown, switched only while the frost fully covers), `uFrost` (0…1 coverage).
- Frost growth: domain-warped fbm + distance from the rim → frost starts at the rim and in patches, spreads inward.
- Look: crystalline cell edges (cellular noise) + thin dendritic veins (ridged noise), icy blue-white `#cdd9e4`-ish, a bright rim on the growing front, slight refraction of the dish beneath. At full coverage it is opaque so the dish swap is never seen.
- Colour management per three.js docs: textures `SRGBColorSpace`, `#include <colorspace_fragment>` at the end of the shader. **Also apply this to the existing snow and fog shaders** (their token colours currently come out darker than specified).

### Scroll mapping

- Intro (first ~0.5 viewport): the first dish arrives fully frosted and thaws.
- Each course: hold ~55% of its viewport, then a frost transition (cover → swap → thaw) over the remaining 45%.
- Text and ingredients switch at the midpoint of each transition (under full frost), animated in time (not scrubbed), and switch back correctly when scrolling up.

## 6. Ingredients

- Two slots per course around the plate (upper right, lower left), each with a depth factor.
- Parallax: cursor (by depth) + a small vertical drift with scroll inside the course.
- On course change: outgoing ingredients blur/scale out, incoming freeze in.

## 7. Reduced motion

No pin, no WebGL: the seven courses as a static vertical list, each with its dish photo (circular, same radial falloff in CSS) and text.

## 8. Acceptance criteria

1. `npm run dev` / `npm run build` clean; no console errors or warnings.
2. Phases 1–2 still pass (spot-check hero scrub, Ascent doors, snow stops after doors).
3. All 7 dishes appear in order; frost fully covers at each swap (no visible hard cut); works in both scroll directions.
4. Text for the current course is correct in both directions (title, counter, altitude, wine).
5. Ingredients: no green fringes; correct set per course; react to the cursor.
6. WebGL renders only on change; no rendering when the section is off-screen.
7. Reduced-motion fallback: static list of 7 courses.
8. Report: asset weights; screenshots (Playwright, DPR 2) — intro thaw, a course at rest, frost at full cover, a course mid-thaw, last course; reduced-motion.

## 9. Out of scope

The Night (clock), Frozen Moments, Chef, Booking, Finale; final wine list; sound.
