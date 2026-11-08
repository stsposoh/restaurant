# PROMPTS — Red Fox, Hollister Peak

Промпты для генерации в Google Flow. Сценарий и контекст — в [BRIEF.md](BRIEF.md).

**Как пользоваться**
- У каждого промпта есть ID (`K1`, `D3`, `N2`…). Сохраняй результаты в `references/<секция>/` с именем `ID_v1.png`, `ID_v2.png` — так будем обсуждать, что оставить, что переделать.
- К каждому фото-промпту добавляй блок **STYLE** (и **FROZEN**, где указано). Блоки **WORLD** — подставляй, где в промпте стоит `[ИМЯ_БЛОКА]`.
- Формат по умолчанию — 16:9, максимальное разрешение, которое даёт Flow.
- Flow не отдаёт прозрачность: всё, что помечено _cutout_, генерируем на однотонном фоне и потом вырезаем.

---

## 0. Визуальная библия

### STYLE — добавлять к каждому фото
```
Cinematic luxury editorial photography, shot on a large-format digital cinema camera with spherical prime lenses, shallow depth of field, subtle natural film grain in the style of Kodak Vision3 500T. Lit only by practical light sources inside the scene: candles, warm garland lights, fireplace, brass lamps, moonlight on snow. Warm amber highlights, deep blue-ink shadows, rich blacks, nothing flat or overexposed. Quiet, intimate, expensive mood. Photorealistic, highly detailed, 16:9.
Avoid: any text, watermarks, logos, cartoon or CGI look, plastic skin, distorted hands, extra fingers, oversaturated colors, harsh flash, daylight.
```

### FROZEN — добавлять ко всем «застывшим» кадрам
```
Time is frozen in a single instant: every person is perfectly still mid-gesture, like a photograph; champagne droplets, liquids, confetti, gold leaf, sparks and snowflakes are suspended motionless in mid-air.
```

### WORLD — постоянные описания мира
**[RESTAURANT_EXT]**
```
Red Fox, an alpine stone lodge restaurant: walls of dark grey rough-cut stone, a steep snow-covered gabled roof with dark timber eaves and a stone chimney, a large arched multi-pane window in a carved stone surround with frost patterns in its corners, smaller rectangular side windows, warm brass lantern sconces beside the windows, and elegant warm backlit serif letters "RED FOX" on the gable above the arched window. It stands alone on a snowy mountain summit, warm golden light glowing from every window; a small gondola station with a cabin stands beside it, and far below in the valley lie the warm lights of a ski village. (Reference: references/01-hero/building/)
```
**[RESTAURANT_INT]**
```
A grand dining hall with dark oak floors and a double-height timber ceiling, floor-to-ceiling panoramic windows looking onto a moonlit snowy ridge, a massive rough-stone fireplace with a burning fire, a tall Christmas tree with warm white lights and deep red and gold ornaments, brass chandeliers, round tables with white linen, candles and spruce garlands, and along one side a long backlit amber onyx bar with brass details and a tall wall of bottles.
```
**[GUESTS]**
```
elegant guests in black tie and evening gowns — velvet, silk, sequins — aged 30 to 65, diverse
```
**[STAFF]**
```
waiters in dark navy-black waistcoats over crisp white long-sleeved shirts (no jacket), black bow ties and white gloves; bartenders in black waistcoats with rolled-up white sleeves
```
**[DISH] — главное блюдо hero: The Midnight Plateau**
```
The Midnight Plateau: a large round polished silver tray filled with crushed ice; at its centre a whole cooked lobster with a bright coral-red shell, glossy and lacquered with brown butter, crowned with a generous quenelle of black Oscietra caviar and flakes of gold leaf; around it open oysters on the half shell, red currants on the stem, frost-dusted spruce tips, tiny white edible flowers and a single lit sparkler.
```

---

## 1. Hero — видео «The last second of the year»

### Как получить бесшовное видео
Видео нужно сгенерировать — canvas его только показывает: готовый ролик я нарежу на кадры (ffmpeg) и проиграю по скроллу.

Чтобы склейки были незаметны, работаем **от ключевых кадров**:
1. **Мастер-кадры** (`M1`, `M2`) — общий план зала и экстерьера. Выбираем лучшие и дальше подаём их в Flow как референсы (ingredients), чтобы зал, люди и ресторан были одинаковыми во всех кадрах.
2. **Ключевые кадры** `K1…K7` — статичные изображения, точки, через которые пройдёт камера.
3. **Видеосегменты** `S1…S6` — режим «кадры → видео» (Frames to Video): **начальный кадр = `K(n)`, конечный кадр = `K(n+1)`**. Конец одного сегмента — это пиксель в пиксель начало следующего, поэтому шва нет.
   _Если в Flow нет режима с конечным кадром — используем Extend от последнего кадра; проверь, какие режимы доступны у тебя._
4. Мне нужны все `S1…S6` в `references/01-hero/video/` — склейку, нарезку на кадры и выравнивание скорости делаю я.

**Камера:** весь ролик — **один непрерывный отъезд назад** (камера смотрит вперёд и пятится): блюдо → поднос → стол → зал → бар → сквозь окно наружу → общий план вершины. Скорость постоянная, без резких ускорений. Небольшие торможения на стыках не страшны — при скролле я их выровняю.

**Правило:** всё в кадре абсолютно неподвижно. Если в генерации кто-то моргнул, улыбнулся или пошевелился — это брак, перегенерируем.

### Мастер-кадры

**M1 — зал, общий план** → `01-hero/masters/`
```
Wide establishing shot of [RESTAURANT_INT] on New Year's Eve, just before midnight. Every table is full of [GUESTS], laughing, toasting, champagne glasses raised; [STAFF] move between tables; gold and deep red confetti hangs in the air. Camera at standing eye level from the middle of the room.
```
+ STYLE + FROZEN

**M2 — экстерьер, общий план** → `01-hero/masters/`
```
Wide aerial view at night of [RESTAURANT_EXT] The restaurant glows like a lantern against the dark blue night. Above the main windows a large illuminated sign reads "RED FOX" in elegant serif capital letters. Around it a vast moonlit range of snowy peaks, a deep valley far below with the tiny warm lights of a ski village, a clear sky full of stars.
```
+ STYLE. _Если надпись на вывеске выходит кривой — сгенерируй вариант с пустой светящейся вывеской, логотип наложим в коде._

### Ключевые кадры (стиль: STYLE + FROZEN для всех, референсы — M1/M2)

**K1 — макро блюда**
```
Extreme macro close-up of the lobster at the centre of [DISH] Glossy brown-butter glaze on the bright coral-red cooked shell, black caviar pearls catching candlelight, gold leaf flakes. A single drop of champagne sauce hangs suspended in mid-air above the lobster; sparks from the sparkler and tiny gold leaf flakes float frozen around it. Very shallow depth of field, warm bokeh of candles and garland lights behind.
```

**K2 — поднос в руках официанта**
```
Medium close shot: the whole of [DISH] held by the white-gloved hands of a waiter in a tailored black jacket, the tray frozen a few centimetres above a white-linen table as he sets it down. Candles, crystal glasses and spruce garlands on the table. Sparkler sparks and gold leaf frozen in the air above the tray. The waiter's face is just outside the top of the frame.
```

**K3 — гости в восторге**
```
Wider shot from slightly above and behind the waiter's shoulder: a round table of six [GUESTS] reacting with delight to [DISH] being set down in front of them, frozen mid-reaction — a woman with her hand to her chest, a man mid-laugh with his head tilted back, two guests raising champagne coupes, one leaning in to look. Gold and red confetti and champagne droplets hang motionless in the air above the table.
```

**K4 — зал**
```
The camera has pulled further back and slightly higher: the table from K3 now sits in the middle of [RESTAURANT_INT] Around it other tables of [GUESTS] frozen mid-toast and mid-laughter; a waiter frozen mid-stride with a bottle of champagne; a couple frozen mid-dance near the Christmas tree; confetti suspended throughout the room. The fireplace fire is frozen still.
```

**K5 — бар**
```
The camera continues backwards along the long backlit amber onyx bar of [RESTAURANT_INT], which fills the right side of the frame in the foreground, the full dining hall visible deeper in the frame. Three bartenders frozen mid-performance: one with a bottle spinning in mid-air above his hand, one pouring a long arc of cocktail from a shaker held high into a coupe — the stream frozen in the air, one spraying a flaming orange peel over a glass — the flame frozen. Ice cubes and drops suspended in the air. Guests at the bar frozen laughing on tall stools.
```

**K6 — снаружи, у окна, лиса**
```
Outside at night, just beyond the floor-to-ceiling glass of the restaurant: we look in through the panoramic window at the warm, golden, frozen New Year's celebration inside — the bar, the tables, the Christmas tree. Snow lies on the window ledge; snowflakes hang motionless in the air. In the foreground, sitting in the deep snow with its back to the camera, a red fox looks in through the window, its fur lit by the warm light from inside.
```

**K7 — вершина, общий план**
Тот же промпт, что **M2** (можно использовать M2 как есть, если композиция подходит), плюс:
```
Snowflakes hang motionless in the air close to the camera. The fox is a tiny silhouette in the snow in front of the glowing windows.
```

### Видеосегменты (Frames to Video)

Общий суффикс ко всем сегментам — **VIDEO_FROZEN**:
```
Time is completely frozen. Absolutely nothing in the scene moves — people, faces, hands, liquids, confetti, sparks, flames, snowflakes all stay perfectly still like a photograph. Only the camera moves: one smooth, continuous, constant-speed backward dolly, no cuts, no zoom, no shake. Cinematic, photorealistic, warm candlelight with deep blue shadows.
```

| ID | Начало → конец | Движение камеры |
|---|---|---|
| **S1** | K1 → K2 | `The camera slowly pulls back from the extreme macro of the lobster, revealing the whole silver tray and the white-gloved waiter's hands holding it above the table.` |
| **S2** | K2 → K3 | `The camera keeps pulling back and rises slightly, over the waiter's shoulder, revealing the six delighted guests around the table.` |
| **S3** | K3 → K4 | `The camera keeps pulling back and rises, the table shrinking into the middle of the grand dining hall full of frozen celebrating guests and suspended confetti.` |
| **S4** | K4 → K5 | `The camera keeps moving backwards and drifts to the right, gliding alongside the long backlit onyx bar where bartenders are frozen mid-performance.` |
| **S5** | K5 → K6 | `The camera keeps moving backwards and passes smoothly through the panoramic window glass to the outside, into the snowy night; snowflakes hang still in the air and a red fox sits in the snow looking in.` |
| **S6** | K6 → K7 | `The camera pulls back and rises high into the night sky, revealing the whole glowing restaurant on the mountain summit, the vast snowy range and the valley lights far below.` |

К каждой строке — **+ VIDEO_FROZEN**.

---

## 3. The Ascent — слои параллакса

Все — 16:9, очень широкие (лучше 21:9, если Flow позволяет), STYLE без FROZEN. Слои с пометкой _cutout_ — на **сплошном ярко-зелёном фоне (#00FF00)**.
_Запасной вариант: сгенерировать одну цельную сцену (A0) и разрезать на слои вручную._

**A0 — цельная сцена (референс для всех слоёв)**
```
A vast alpine valley at blue-hour dusk turning into night: a ski village with warm lights at the bottom, snowy spruce forests climbing the slopes, a gondola cable rising across the frame towards a glowing restaurant on a distant summit, a band of low clouds halfway up the mountain, alpenglow fading to pink on the highest peaks, first stars.
```
**A1 — небо**: `Clear twilight sky gradient from deep violet-pink at the horizon to dark ink blue at the top, first faint stars. No mountains, no land.`
**A2 — дальний хребет** _cutout_: `A distant jagged range of snowy alpine peaks with faint pink alpenglow on the tips, hazy and low-contrast from distance, isolated on a solid flat bright green background.`
**A3 — средние горы** _cutout_: `Mid-distance snowy mountain slopes with patches of dark spruce forest, blue dusk shadows, isolated on a solid flat bright green background.`
**A4 — долина с деревней** _cutout_: `A small alpine ski village in a snowy valley at dusk, warm glowing windows, chalet roofs covered with snow, isolated on a solid flat bright green background.`
**A5 — облака** _cutout_: `A thick horizontal band of soft low clouds and mist, lit from below with faint warm village light, isolated on a solid flat black background.` _(облака на чёрном — для режима наложения screen)_
**A6 — ели переднего плана** _cutout_: `Tall snow-laden spruce tree tops in the dark foreground, silhouetted, isolated on a solid flat bright green background.`
**A7 — гондола** _cutout_: `A single modern glass-and-steel gondola cabin hanging from its cable, warm golden light inside, side view, isolated on a solid flat bright green background.`
**A8 — вершина с рестораном** _cutout_: `[RESTAURANT_EXT] seen from below and from a distance at night, small in frame, isolated on a solid flat bright green background.`

---

## 4. Menu — 7 курсов (Frost Reveal)

Для шейдера все блюда должны быть **в одинаковой композиции**: формат 1:1, строго сверху, тарелка по центру и занимает ~65% кадра, одинаковый фон и свет. Общий префикс:

**DISH_FRAME**
```
Overhead top-down food photograph, perfectly centred, the plate fills about 65% of the frame. Matte dark stoneware plate on a deep blue-black textured stone surface. One soft warm light from the upper left, falling off into darkness at the edges. Fine-dining plating, precise and minimal. 1:1.
```
+ STYLE (вместо 16:9 — 1:1).

| ID | Курс | Промпт (после DISH_FRAME) |
|---|---|---|
| **D1** | I · Valley, 1 200 m | `Alpine trout lightly smoked over juniper, pale pink slices fanned in a pool of buttermilk, bright green dill oil droplets, dark rye crumble, juniper berries.` |
| **D2** | II · Forest, 1 650 m | `A small round wild mushroom tart with glossy chanterelles and porcini, shaved black truffle, a pinch of pine salt, tiny spruce tips.` |
| **D3** | III · Meadow under snow, 1 900 m | `A roasted celeriac disc baked in hay, glazed with brown butter, toasted hazelnuts, a dusting of white celeriac "snow", wisps of hay.` |
| **D4** | IV · Glacier, 2 300 m | `Translucent scallop crudo slices, frozen green apple granita like ice crystals, white horseradish snow, a few drops of green oil.` |
| **D5** | V · The Midnight Lobster, 2 600 m | `Medallions of cooked coral-red lobster tail glossy with champagne beurre blanc, a quenelle of black Oscietra caviar, a few flakes of gold leaf, tiny white flowers.` |
| **D6** | VI · Summit, 2 847 m | `Rosy slices of venison loin with a dark juniper crust, glossy red cabbage purée, bright lingonberries, a sauce of deep red wine reduction.` |
| **D7** | VII · Hollister Peak | `A Baked Alaska shaped as a sharp snowy mountain peak, torched meringue ridges, a pool of golden cloudberry sauce around its base, a dusting of icing sugar like snow.` |

**I1 — ингредиенты для парящих слоёв** _cutout_ (генерировать по одному-два объекта за раз)
```
A single [INGREDIENT] floating, isolated on a solid flat bright green background, sharp focus, soft warm light from the upper left, photorealistic macro.
```
Список `[INGREDIENT]`: juniper berries, sprig of frosted spruce, red lingonberries, red currants on the stem, gold leaf flake, black caviar pearls, coarse sea salt crystals, chanterelle mushroom, toasted hazelnut, shard of clear ice, dill sprig, cloudberry.

---

## 5. The Night — фото событий (часы)

Свет во всех кадрах — тёплый, «под прожектором»: главный объект освещён, края уходят в темноту (на сайте фото будет «выходить на свет»). STYLE без FROZEN.

| ID | Время | Промпт |
|---|---|---|
| **N1** | 18:30 | `A modern glass gondola cabin with warm light inside, climbing its cable above a snowy spruce forest at blue-hour dusk; the summit peaks glow pink with alpenglow; inside, guests in evening wear and fur coats look out.` |
| **N2** | 19:00 | `A snowy outdoor terrace at the summit at dusk: a bar carved from blocks of ice, tall fire bowls burning, [GUESTS] in fur stoles and dark coats holding champagne flutes, the snowy range behind them.` |
| **N3** | 20:30 | `[STAFF] carrying the first plated dishes into [RESTAURANT_INT], the room full of [GUESTS] seated at candlelit tables, warm and intimate.` |
| **N4** | 21:30 | `A jazz singer in a dark velvet gown at a vintage microphone beside the huge stone fireplace, a double-bass player and a pianist behind her, guests listening at candlelit tables.` |
| **N5** | 23:00 | `View from the restaurant terrace at night: a long winding line of ski instructors descending the dark snowy slope holding burning torches, forming a glowing snake of fire down the mountain, stars above.` |
| **N6** | 23:30 | `A Baked Alaska shaped as a snowy mountain peak, flambéed at the table — blue and golden flames rising over the meringue, a waiter's white-gloved hand with the pan, guests' faces lit by the flames.` |

Часы — 3D-модель с Sketchfab (кандидаты — в BRIEF.md, секция 5), генерировать не нужно. Референс стиля — `references/05-night-clock/clock-reference.png`.

---

## 6. Frozen Moments — галерея

STYLE + FROZEN, вертикальные и горизонтальные вперемешку (укажи 3:4 или 16:9 в конце промпта).

| ID | Формат | Промпт |
|---|---|---|
| **G1** | 3:4 | `A tower of crystal champagne coupes, champagne poured from a bottle frozen mid-cascade, droplets suspended in the air, candlelight glinting.` |
| **G2** | 16:9 | `Two guests in evening wear clinking glasses, champagne splashing out frozen in mid-air, gold confetti suspended around them.` |
| **G3** | 3:4 | `Close-up of a woman's hand in a satin glove holding a burning sparkler, sparks frozen in the air, warm bokeh behind.` |
| **G4** | 16:9 | `A bartender's hand releasing a bottle that hangs spinning in mid-air above the backlit onyx bar, ice cubes suspended.` |
| **G5** | 3:4 | `A red fox sitting in deep snow at night, looking towards warm glowing restaurant windows, snowflakes frozen in the air, fur lit by golden light.` |
| **G6** | 16:9 | `A couple frozen mid-dance by the Christmas tree, her silk dress swirling, confetti suspended around them.` |
| **G7** | 3:4 | `A pair of vintage leather ski gloves and a glass of red wine on a windowsill, the snowy moonlit ridge outside, snowflakes frozen beyond the glass.` |
| **G8** | 16:9 | `Close-up of torches carried by skiers on a dark slope, flames and sparks frozen, snow spray frozen in the air behind the skis.` |

---

## 7. Chef

| ID | Формат | Промпт |
|---|---|---|
| **C1** | 3:4 | `Portrait of a head chef in his late forties, short grey-flecked beard, calm focused expression, dark charcoal chef's jacket, in a dark kitchen lit by a single warm lamp. He is frozen mid-gesture finishing a plate with salt: coarse salt crystals hang suspended in the air between his fingers and the plate.` + STYLE + FROZEN |
| **C2** | 16:9 | `Close-up of the chef's hands placing frosted spruce tips with tweezers onto a dish of coral-red lobster, warm lamp light, dark background.` + STYLE |

---

## 9. Финал — 00:00

**F1** — чистый фон под салют (салют рисуем в three.js)
```
[RESTAURANT_EXT] seen from a distance at night, small in the lower third of the frame, a huge empty dark starry sky above the snowy range taking up most of the frame, deep blue night.
```
+ STYLE. _Можно взять K7/M2, если там достаточно неба._

---

## Лого

Лого рисуем вектором (SVG) сами — генерировать не нужно. Если хочешь поискать форму:

**L1 — поиск формы (только как вдохновение)** → `00-logo/`
```
Minimal flat geometric logo mark of a red fox head built from a few triangular facets, the two ears doubling as two snowy mountain peaks with white tips, fox red on a deep ink-blue background, vector, no text.
```
