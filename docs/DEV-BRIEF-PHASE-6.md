# DEV BRIEF — Red Fox landing, Phase 6: Chef

Continues [DEV-BRIEF-PHASE-5.md](DEV-BRIEF-PHASE-5.md). Concept: [../BRIEF.md](../BRIEF.md) §6.7. Same rules: load **frontend-design** before visual decisions, check library docs via Context7 / Ref, follow `CLAUDE.md`.

---

## 1. Goal

A separate section for the (fictional) head chef: portrait mask reveal, a quote about cooking at altitude, 2–3 facts. The chef is frozen mid-gesture salting a plate — the crystals hang in the air (already in the photo).

Light: warm, a single lamp.

## 2. Assets

`references/07-chef/C1_portrait.jpg` (3:4) and `C2_hands.jpg` (16:9) → `public/chef/` via a shared `scripts/build-photos.mjs` (replaces `build-moments.mjs`; handles moments and chef).

## 3. Content (EN) — **draft copy, the chef is fictional; names and facts to be approved**

- Quote: "At 2847 metres water boils at ninety degrees. The mountain sets the pace — we simply listen." (The boiling point is real physics: ~90.5 °C at that altitude.)
- Attribution: Anselm Brandt, head chef.
- Facts (plain sentences, not stat tiles):
  - Every ingredient rides up on the first gondola, at 6:40 in the morning.
  - Spruce tips, juniper and lingonberries are picked on the slopes below the restaurant.
  - Seven courses, cooked for a single sitting of 120 guests.

## 4. Layout and motion

- **Stage 1 (pinned ~2.5 viewports).** Portrait on the right (~80vh tall). It is revealed **by its own lamp**: a soft radial mask centred on the lamp in the photo grows downward with scroll, so the light literally floods the chef out of the dark (BRIEF §5: everything is lit by a source inside the world). Quote on the left in the lower third, Zodiak, word-by-word "freeze into place" (same vocabulary as the Invitation); attribution after it.
- **Stage 2 (normal flow).** C2 as a wide cinematic band; the three facts in a row beneath it, small Switzer, no numbers-as-decoration.
- One bold move only — the lamp reveal. Everything else quiet.

## 5. Reduced motion

No pin; portrait fully visible; quote static.

## 6. Acceptance criteria

1. `npm run dev` / `npm run build` clean; no console errors or warnings.
2. Earlier phases unaffected (spot-check).
3. Lamp reveal starts at the lamp and ends with the portrait fully visible; reverses on scroll up.
4. Quote words reveal in order, both directions.
5. Reduced-motion fallback.
6. Screenshots (Playwright, DPR 2): reveal start, mid, end; stage 2; reduced motion.
