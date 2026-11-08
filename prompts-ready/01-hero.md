# Hero — готовые промпты для Flow

Одна генерация = один блок. Копируй блок целиком. Блоки уже собраны из [PROMPTS.md](../PROMPTS.md) — ничего подставлять не нужно.

**Порядок строго сверху вниз** — каждый следующий кадр использует предыдущий как референс.

| Шаг | ID | Референсы (прикрепить в Flow) | Куда сохранить |
|---|---|---|---|
| 1 | M1 | — | `references/01-hero/masters/M1_v1.png` |
| 2 | M2 | — | `references/01-hero/masters/M2_v1.png` |
| 3 | K1 | M1 | `references/01-hero/keyframes/K1_v1.png` |
| 4 | K2 | K1, M1 | `…/keyframes/K2_v1.png` |
| 5 | K3 | K2, M1 | `…/keyframes/K3_v1.png` |
| 6 | K4 | K3, M1 | `…/keyframes/K4_v1.png` |
| 7 | K5 | K4, M1 | `…/keyframes/K5_v1.png` |
| 8 | K6 | K5, M2 | `…/keyframes/K6_v1.png` |
| 9 | K7 | K6, M2 | `…/keyframes/K7_v1.png` |
| 10 | S1–S6 | начальный и конечный кадр | `references/01-hero/video/S1_v1.mp4` … |

Формат всех кадров — 16:9.

---

## Вариант A — чат (Flow помнит контекст)

Сначала одно сообщение **«Сцена»** — описание мира и правил, без генерации. Потом по одному короткому сообщению на кадр. Референсы из таблицы выше всё равно прикрепляй — они надёжнее памяти чата.
Если по ходу чата стиль начнёт «уплывать» (другие люди, другой зал, пропал эффект заморозки) — генерируй этот кадр полным блоком из **варианта B** ниже.

### Сообщение 0 — Сцена
```
We are going to create a series of 16:9 keyframes for one continuous cinematic shot. Please remember this world and these rules for every image in this conversation.

STORY: New Year's Eve at Red Fox, a luxury restaurant on the summit of Hollister Peak, a high alpine ski resort. It is 23:59:59 — the last second of the year — and time has frozen. Every person is perfectly still mid-gesture like a photograph; champagne droplets, liquids, confetti, gold leaf, sparks, flames and snowflakes are suspended motionless in mid-air. Only the camera moves: one continuous backward pull-back from a dish to the whole mountain.

EXTERIOR: a modern alpine restaurant of dark charred timber and floor-to-ceiling glass, steep snow-covered gabled roof, alone on the rocky summit, warm golden light pouring from panoramic windows, a small gondola station beside it with its cable descending into the dark valley, a vast moonlit range of snowy peaks, ski-village lights far below, a starry sky.

INTERIOR: a grand dining hall with dark oak floors and a double-height timber ceiling, panoramic windows onto a moonlit snowy ridge, a massive rough-stone fireplace, a tall Christmas tree with warm white lights and deep red and gold ornaments, brass chandeliers, round tables with white linen, candles and spruce garlands, and a long backlit amber onyx bar with brass details and a tall wall of bottles.

PEOPLE: elegant guests in black tie and evening gowns — velvet, silk, sequins — aged 30 to 65, diverse. Waiters in tailored black jackets, white shirts, black bow ties and white gloves. Bartenders in black waistcoats with rolled-up white sleeves.

THE DISH — "The Midnight Plateau": a large round polished silver tray of crushed ice; at its centre a whole cooked lobster with a bright coral-red shell lacquered with brown butter, crowned with black Oscietra caviar and gold leaf; around it open oysters, red currants on the stem, frost-dusted spruce tips, tiny white edible flowers and a single lit sparkler.

STYLE for every image: cinematic luxury editorial photography, large-format digital cinema camera, spherical prime lenses, shallow depth of field, subtle Kodak Vision3 500T film grain. Lit only by practical sources inside the scene — candles, warm garland lights, fireplace, brass lamps, moonlight on snow. Warm amber highlights, deep blue-ink shadows, rich blacks. Quiet, intimate, expensive. Photorealistic, 16:9.
AVOID in every image: any text (except the RED FOX sign when asked), watermarks, logos, cartoon or CGI look, plastic skin, distorted hands, extra fingers, oversaturated colors, harsh flash, daylight.

Reply "ready" and wait for my first frame.
```

### Кадры
| ID | Сообщение |
|---|---|
| M1 | `Frame M1: wide establishing shot of the interior at eye level from the middle of the room — every table full of frozen celebrating guests, waiters between tables, confetti hanging in the air.` |
| M2 | `Frame M2: wide aerial night view of the exterior, the restaurant glowing like a lantern, a large illuminated sign above the main windows reading "RED FOX" in elegant serif capitals.` |
| K1 | `Frame K1: extreme macro of the lobster on The Midnight Plateau — glossy glaze, caviar pearls catching candlelight; a single drop of champagne sauce suspended above the lobster, sparks and gold leaf frozen around it, warm bokeh of the hall behind.` |
| K2 | `Frame K2: the camera has pulled back — the whole tray, same dish as K1, held by a waiter's white-gloved hands, frozen a few centimetres above a white-linen table as he sets it down; his face just outside the top of the frame.` |
| K3 | `Frame K3: pulled back further, over the waiter's shoulder — six guests around the table frozen in delight at the tray: a woman with her hand to her chest, a man mid-laugh head tilted back, two raising champagne coupes, one leaning in. Confetti and champagne droplets hang above the table.` |
| K4 | `Frame K4: pulled back and higher — the same table now in the middle of the hall; other tables frozen mid-toast, a waiter mid-stride with champagne, a couple mid-dance by the Christmas tree, confetti throughout, the fireplace flames frozen.` |
| K5 | `Frame K5: the camera keeps moving backwards alongside the onyx bar, which fills the right foreground; the hall deeper in frame. Three bartenders frozen mid-performance: a bottle spinning in mid-air, a long arc of cocktail from a raised shaker frozen in the air, a flaming orange-peel spray frozen. Ice and drops suspended; guests on bar stools frozen laughing.` |
| K6 | `Frame K6: outside, just beyond the panoramic glass, looking in at the warm frozen celebration; snow on the window ledge, snowflakes frozen in the air; in the foreground a red fox sits in deep snow with its back to the camera, looking in, fur rim-lit by the warm light. Cold blue moonlight outside.` |
| K7 | `Frame K7: the camera has risen high — wide aerial night view of the whole glowing restaurant on the summit with the RED FOX sign, a tiny fox silhouette in the snow before the windows, the snowy range, valley lights, stars, snowflakes frozen close to the camera.` |

Видео S1–S6 — в конце файла (одинаково для обоих вариантов).

---

## Вариант B — полные блоки (каждый промпт самодостаточен)

## M1 — зал, общий план
```
Wide establishing shot of a grand mountain-top restaurant dining hall on New Year's Eve, just before midnight. Dark oak floors and a double-height timber ceiling, floor-to-ceiling panoramic windows looking onto a moonlit snowy ridge, a massive rough-stone fireplace with a burning fire, a tall Christmas tree with warm white lights and deep red and gold ornaments, brass chandeliers, round tables with white linen, candles and spruce garlands, and along one side a long backlit amber onyx bar with brass details and a tall wall of bottles. Every table is full of elegant guests in black tie and evening gowns — velvet, silk, sequins — aged 30 to 65, diverse, laughing, toasting, champagne glasses raised. Waiters in tailored black jackets, white shirts, black bow ties and white gloves move between the tables. Gold and deep red confetti hangs in the air. Camera at standing eye level from the middle of the room.
Time is frozen in a single instant: every person is perfectly still mid-gesture, like a photograph; champagne droplets, liquids, confetti, gold leaf, sparks and snowflakes are suspended motionless in mid-air.
Cinematic luxury editorial photography, shot on a large-format digital cinema camera with spherical prime lenses, shallow depth of field, subtle natural film grain in the style of Kodak Vision3 500T. Lit only by practical light sources inside the scene: candles, warm garland lights, fireplace, brass lamps, moonlight on snow. Warm amber highlights, deep blue-ink shadows, rich blacks, nothing flat or overexposed. Quiet, intimate, expensive mood. Photorealistic, highly detailed, 16:9.
Avoid: any text, watermarks, logos, cartoon or CGI look, plastic skin, distorted hands, extra fingers, oversaturated colors, harsh flash, daylight.
```

## M2 — экстерьер, общий план
```
Wide aerial view at night of Red Fox, a modern alpine restaurant built of dark charred timber and floor-to-ceiling glass, with a steep snow-covered gabled roof, perched alone on the rocky summit of a high mountain. Warm golden light pours from its panoramic windows; a small gondola station stands beside it, its cable descending into the dark valley. The restaurant glows like a lantern against the dark blue night. Above the main windows a large illuminated sign reads "RED FOX" in elegant serif capital letters. Around it a vast moonlit range of snowy peaks, a deep valley far below with the tiny warm lights of a ski village, a clear sky full of stars.
Cinematic luxury editorial photography, shot on a large-format digital cinema camera with spherical prime lenses, shallow depth of field, subtle natural film grain in the style of Kodak Vision3 500T. Lit only by practical light sources inside the scene: warm window light, moonlight on snow. Warm amber highlights, deep blue-ink shadows, rich blacks, nothing flat or overexposed. Quiet, expensive mood. Photorealistic, highly detailed, 16:9.
Avoid: any other text, watermarks, cartoon or CGI look, oversaturated colors, daylight.
```
_Если надпись RED FOX выходит кривой — убери из промпта предложение про надпись и замени на: `Above the main windows a large blank illuminated sign panel.`_

## K1 — макро блюда
_Референс: M1 (атмосфера и свет зала)._
```
Extreme macro close-up of a whole cooked lobster with a bright coral-red shell, glossy and lacquered with brown butter, lying on crushed ice on a large polished silver tray, crowned with a generous quenelle of black Oscietra caviar and flakes of gold leaf; open oysters, red currants on the stem, frost-dusted spruce tips and tiny white edible flowers around it, a lit sparkler at the edge. Glossy glaze on the bright coral-red cooked shell, black caviar pearls catching candlelight. A single drop of champagne sauce hangs suspended in mid-air above the lobster; sparks from the sparkler and tiny gold leaf flakes float frozen around it. Very shallow depth of field, warm bokeh of candles and garland lights of the restaurant from the reference image behind.
Time is frozen in a single instant: champagne droplets, gold leaf and sparks are suspended motionless in mid-air.
Cinematic luxury editorial food photography, shot on a large-format digital cinema camera with a macro prime lens, subtle natural film grain in the style of Kodak Vision3 500T. Lit only by candlelight and warm garland lights. Warm amber highlights, deep blue-ink shadows, rich blacks. Photorealistic, highly detailed, 16:9.
Avoid: any text, watermarks, logos, cartoon or CGI look, oversaturated colors, harsh flash, daylight.
```

## K2 — поднос в руках официанта
_Референсы: K1 (то же блюдо), M1 (тот же зал)._
```
Medium close shot: the exact same silver tray with the glazed coral-red lobster, caviar, oysters, red currants, spruce tips and lit sparkler from the reference image, now seen whole, held by the white-gloved hands of a waiter in a tailored black jacket. The tray is frozen a few centimetres above a white-linen table as he sets it down. Candles, crystal glasses and spruce garlands on the table, the restaurant hall from the reference image softly out of focus behind. Sparkler sparks and gold leaf frozen in the air above the tray. The waiter's face is just outside the top of the frame.
Time is frozen in a single instant: the waiter is perfectly still mid-motion; sparks and gold leaf are suspended motionless in mid-air.
Cinematic luxury editorial photography, shot on a large-format digital cinema camera with spherical prime lenses, shallow depth of field, subtle natural film grain in the style of Kodak Vision3 500T. Lit only by candles and warm garland lights. Warm amber highlights, deep blue-ink shadows, rich blacks. Photorealistic, highly detailed, 16:9.
Avoid: any text, watermarks, logos, cartoon or CGI look, plastic skin, distorted hands, extra fingers, oversaturated colors, harsh flash, daylight.
```

## K3 — гости в восторге
_Референсы: K2 (тот же поднос и официант), M1._
```
Wider shot from slightly above and behind the waiter's shoulder: the same waiter and the same silver lobster tray from the reference image, being set down on a round white-linen table. Around the table six elegant guests in black tie and evening gowns — velvet, silk, sequins — aged 30 to 65, diverse, reacting with delight, frozen mid-reaction: a woman with her hand to her chest, a man mid-laugh with his head tilted back, two guests raising champagne coupes, one leaning in to look. Gold and red confetti and champagne droplets hang motionless in the air above the table. The grand restaurant hall from the reference image behind them.
Time is frozen in a single instant: every person is perfectly still mid-gesture, like a photograph; champagne droplets, confetti and sparks are suspended motionless in mid-air.
Cinematic luxury editorial photography, shot on a large-format digital cinema camera with spherical prime lenses, shallow depth of field, subtle natural film grain in the style of Kodak Vision3 500T. Lit only by candles, warm garland lights and the fireplace. Warm amber highlights, deep blue-ink shadows, rich blacks. Quiet, intimate, expensive mood. Photorealistic, highly detailed, 16:9.
Avoid: any text, watermarks, logos, cartoon or CGI look, plastic skin, distorted hands, extra fingers, oversaturated colors, harsh flash, daylight.
```

## K4 — зал
_Референсы: K3 (тот же стол и гости), M1._
```
The camera has pulled further back and slightly higher: the same table with the same six guests and the waiter from the reference image now sits in the middle of the grand restaurant hall — dark oak, double-height timber ceiling, panoramic windows onto a moonlit snowy ridge, the stone fireplace, the tall Christmas tree with warm white lights and red and gold ornaments, brass chandeliers, candles and spruce garlands. Around it other tables of elegant guests in black tie and evening gowns frozen mid-toast and mid-laughter; a waiter frozen mid-stride carrying a bottle of champagne; a couple frozen mid-dance near the Christmas tree. Gold and red confetti suspended throughout the room. The fire in the fireplace is frozen still.
Time is frozen in a single instant: every person is perfectly still mid-gesture, like a photograph; champagne droplets, confetti and flames are suspended motionless.
Cinematic luxury editorial photography, shot on a large-format digital cinema camera with spherical prime lenses, shallow depth of field, subtle natural film grain in the style of Kodak Vision3 500T. Lit only by candles, warm garland lights, the fireplace and brass chandeliers. Warm amber highlights, deep blue-ink shadows, rich blacks. Photorealistic, highly detailed, 16:9.
Avoid: any text, watermarks, logos, cartoon or CGI look, plastic skin, distorted hands, extra fingers, oversaturated colors, harsh flash, daylight.
```

## K5 — бар
_Референсы: K4 (тот же зал), M1._
```
The camera continues backwards inside the same restaurant hall from the reference image, now gliding alongside the long backlit amber onyx bar with brass details and a tall wall of bottles, which fills the right side of the frame in the foreground; the full dining hall with the Christmas tree and the frozen celebrating guests is visible deeper in the frame. Three bartenders in black waistcoats with rolled-up white sleeves are frozen mid-performance: one with a bottle spinning in mid-air above his hand, one pouring a long arc of cocktail from a shaker held high into a coupe — the stream frozen in the air, one spraying a flaming orange peel over a glass — the flame frozen. Ice cubes and drops suspended in the air. Guests at the bar frozen laughing on tall stools.
Time is frozen in a single instant: every person is perfectly still mid-gesture, like a photograph; liquids, ice, flames and confetti are suspended motionless in mid-air.
Cinematic luxury editorial photography, shot on a large-format digital cinema camera with spherical prime lenses, shallow depth of field, subtle natural film grain in the style of Kodak Vision3 500T. Lit by the warm amber glow of the backlit onyx bar, candles and garland lights. Warm amber highlights, deep blue-ink shadows, rich blacks. Photorealistic, highly detailed, 16:9.
Avoid: any text, watermarks, logos, cartoon or CGI look, plastic skin, distorted hands, extra fingers, oversaturated colors, harsh flash, daylight.
```

## K6 — снаружи у окна, лиса
_Референсы: K5 (тот же интерьер), M2 (тот же ресторан снаружи)._
```
Outside at night, just beyond the floor-to-ceiling glass of the same restaurant from the reference images: we look in through the panoramic window at the warm, golden, frozen New Year's celebration inside — the backlit onyx bar, the tables of guests, the Christmas tree. Dark charred timber window frames, snow lies on the window ledge, snowflakes hang motionless in the air. In the foreground, sitting in the deep snow with its back to the camera, a red fox looks in through the window, its fur rim-lit by the warm light from inside. Cold blue moonlight on the snow outside, warm amber light inside.
Time is frozen in a single instant: everyone inside is perfectly still; snowflakes are suspended motionless in mid-air.
Cinematic luxury editorial photography, shot on a large-format digital cinema camera with spherical prime lenses, shallow depth of field, subtle natural film grain in the style of Kodak Vision3 500T. Warm amber highlights, deep blue-ink shadows, rich blacks. Photorealistic, highly detailed, 16:9.
Avoid: any text, watermarks, logos, cartoon or CGI look, oversaturated colors, harsh flash, daylight.
```

## K7 — вершина, общий план
_Референсы: K6 (окно и лиса), M2 (ресторан и вывеска). Если M2 уже идеально подходит по композиции — можно взять M2 как K7 без генерации._
```
Wide aerial view at night of the same restaurant from the reference images: Red Fox, a modern alpine restaurant of dark charred timber and floor-to-ceiling glass with a steep snow-covered gabled roof, perched alone on the rocky summit of a high mountain, warm golden light pouring from its panoramic windows, a small gondola station beside it with its cable descending into the dark valley. Above the main windows a large illuminated sign reads "RED FOX" in elegant serif capital letters. A tiny silhouette of a fox sits in the snow in front of the glowing windows. Around it a vast moonlit range of snowy peaks, a deep valley far below with the tiny warm lights of a ski village, a clear sky full of stars. Snowflakes hang motionless in the air close to the camera.
Cinematic luxury editorial photography, shot on a large-format digital cinema camera with spherical prime lenses, subtle natural film grain in the style of Kodak Vision3 500T. Warm window light, cold moonlight on snow. Warm amber highlights, deep blue-ink shadows, rich blacks. Photorealistic, highly detailed, 16:9.
Avoid: any other text, watermarks, cartoon or CGI look, oversaturated colors, daylight.
```

---

## Видео S1–S6 (Frames to Video)

Каждый сегмент: **начальный кадр** и **конечный кадр** — из таблицы, промпт — блок ниже.

| ID | Начальный кадр | Конечный кадр |
|---|---|---|
| S1 | K1 | K2 |
| S2 | K2 | K3 |
| S3 | K3 | K4 |
| S4 | K4 | K5 |
| S5 | K5 | K6 |
| S6 | K6 | K7 |

### S1
```
The camera slowly pulls back from the extreme macro of the lobster, revealing the whole silver tray and the white-gloved waiter's hands holding it above the table.
Time is completely frozen. Absolutely nothing in the scene moves — people, faces, hands, liquids, confetti, sparks, flames, snowflakes all stay perfectly still like a photograph. Only the camera moves: one smooth, continuous, constant-speed backward dolly, no cuts, no zoom, no shake. Cinematic, photorealistic, warm candlelight with deep blue shadows.
```
### S2
```
The camera keeps pulling back and rises slightly, over the waiter's shoulder, revealing the six delighted guests around the table.
Time is completely frozen. Absolutely nothing in the scene moves — people, faces, hands, liquids, confetti, sparks, flames, snowflakes all stay perfectly still like a photograph. Only the camera moves: one smooth, continuous, constant-speed backward dolly, no cuts, no zoom, no shake. Cinematic, photorealistic, warm candlelight with deep blue shadows.
```
### S3
```
The camera keeps pulling back and rises, the table shrinking into the middle of the grand dining hall full of frozen celebrating guests and suspended confetti.
Time is completely frozen. Absolutely nothing in the scene moves — people, faces, hands, liquids, confetti, sparks, flames, snowflakes all stay perfectly still like a photograph. Only the camera moves: one smooth, continuous, constant-speed backward dolly, no cuts, no zoom, no shake. Cinematic, photorealistic, warm candlelight with deep blue shadows.
```
### S4
```
The camera keeps moving backwards and drifts to the right, gliding alongside the long backlit onyx bar where bartenders are frozen mid-performance.
Time is completely frozen. Absolutely nothing in the scene moves — people, faces, hands, liquids, confetti, sparks, flames, snowflakes all stay perfectly still like a photograph. Only the camera moves: one smooth, continuous, constant-speed backward dolly, no cuts, no zoom, no shake. Cinematic, photorealistic, warm candlelight with deep blue shadows.
```
### S5
```
The camera keeps moving backwards and passes smoothly through the panoramic window glass to the outside, into the snowy night; snowflakes hang still in the air and a red fox sits in the snow looking in.
Time is completely frozen. Absolutely nothing in the scene moves — people, faces, hands, liquids, confetti, sparks, flames, snowflakes all stay perfectly still like a photograph. Only the camera moves: one smooth, continuous, constant-speed backward dolly, no cuts, no zoom, no shake. Cinematic, photorealistic, warm candlelight with deep blue shadows.
```
### S6
```
The camera pulls back and rises high into the night sky, revealing the whole glowing restaurant on the mountain summit, the vast snowy range and the valley lights far below.
Time is completely frozen. Absolutely nothing in the scene moves — people, faces, hands, liquids, confetti, sparks, flames, snowflakes all stay perfectly still like a photograph. Only the camera moves: one smooth, continuous, constant-speed backward dolly, no cuts, no zoom, no shake. Cinematic, photorealistic, cold moonlight with warm window light.
```
