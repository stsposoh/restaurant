# Hero — один длинный пролёт (Extend)

Первое видео генерируем от **K1_v3**, дальше **продлеваем (Extend)** — каждая часть начинается ровно там, где закончилась предыдущая. Один непрерывный кадр без склеек.

**Правила, которые сработали в P1 (держим во всех частях):**
1. Первая строка — `ONE SINGLE CONTINUOUS SHOT — a oner with no cuts`.
2. Люди — «как восковые фигуры», сцена — «остановленный кадр фильма».
3. **Одно простое движение камеры на часть** — иначе модель режет кадр.
4. Камера медленная — меньше «оживления» людей.

**Официант:** тёмный жилет поверх белой рубашки с длинным рукавом, без пиджака, чёрная бабочка, белые перчатки. В старых референсах он во фраке — одежду оттуда не брать.

**Порядок:** генерируешь часть → кладёшь в `references/01-hero/masters/` → я проверяю → Extend следующей частью. Если Flow предлагает несколько вариантов — бери тот, где люди двигаются меньше всего и нет смены ракурса.

| Часть | Движение камеры | Референсы (по желанию) |
|---|---|---|
| P1 | прямой отъезд с подъёмом от омара — ✅ готово | старт `K1_v3` |
| P2 | медленный облёт стола по дуге влево, сверху | `K3_v2` (гости) |
| P3 | полёт вперёд через зал к ёлке, мимо танцующей пары | `K4_v5` |
| P4 | камера смотрит в зал и пятится вправо вдоль бара (стойка справа в кадре) | `K5_v2` |
| P5 | камера смотрит в зал и пятится **задом** сквозь окно наружу | `K6_v1` |
| P6 | продолжает пятиться снаружи, не разворачиваясь, — снизу в кадр входит лиса со спины | `K6_v1` |
| P7 | подъём вверх и назад над вершиной | `K7_v3` |

---

## Сообщение 0 — вводное (первым в проекте, без генерации)
```
We are going to create one continuous cinematic shot, generated in seven parts that each extend the previous one. Please remember this world, these rules and this camera path for every part in this project.

CONCEPT: New Year's Eve at Red Fox, a luxury restaurant on the summit of Hollister Peak, a high alpine ski resort. It is 23:59:59 — the last second of the year — and time has completely stopped. The whole scene is a perfectly still tableau, like a paused film frame; every person is as motionless as a wax figure in a museum; champagne, droplets, confetti, gold leaf, flames and snowflakes hang motionless in mid-air. The ONLY thing that moves is the camera: one unbroken, slow gliding shot — a oner with no cuts — that weaves through the frozen celebration.

CAMERA PATH (one simple camera move per part):
Part 1 — pulls straight back and up from a close-up of a red lobster on a silver tray held by a waiter.
Part 2 — slowly orbits in an arc to the left around the table, seen from slightly above, revealing six guests frozen in delight.
Part 3 — glides forward across the dining hall towards the Christmas tree, passing a couple frozen mid-dance.
Part 4 — still facing into the hall, drifts backwards and to the right alongside a long backlit amber onyx bar; bartenders frozen behind the counter, guests frozen on stools in front of it.
Part 5 — still facing into the hall, moves BACKWARDS through a tall panoramic window behind it, so it ends up outside in the snowy night, looking in through the glass at the frozen party.
Part 6 — keeps moving backwards outside, without turning, until a red fox sitting in the snow enters the foreground with its back to the camera, looking in through the window.
Part 7 — rises up and back high above the summit, revealing the whole glowing restaurant with "RED FOX" letters on its gable.

INTERIOR: a grand alpine lodge dining hall — dark wooden floors, timber-beamed ceiling, brass candle chandeliers, a massive stone fireplace, a tall Christmas tree with warm lights and red and gold ornaments, tall windows with a full moon over snowy mountains, a grandfather clock, round tables with white linen, candles and spruce garlands, and a long backlit amber onyx bar with brass details and a tall wall of bottles.
EXTERIOR: a dark timber gabled lodge with a large glass facade, a stone side wall and chimney, alone on a rocky snowy summit, warm golden windows, a small gondola station beside it.
PEOPLE: elegant guests in black tie and evening gowns — velvet, silk, sequins — aged 30 to 65, diverse. Waiters wear dark navy-black waistcoats over crisp white long-sleeved shirts (no jacket), black bow ties and white gloves. Bartenders wear black waistcoats with rolled-up white sleeves.
THE DISH: a cooked lobster with a glossy coral-red shell, three mounds of black caviar with gold leaf on its back, on crushed ice on a large polished silver tray with red currants, frosted spruce and tiny white flowers.

STYLE: cinematic luxury, photorealistic, shallow depth of field, subtle Kodak Vision3 500T film grain, lit only by candles, chandeliers, garland lights, the fireplace and moonlight on snow; warm amber highlights, deep blue-ink shadows, rich blacks; 16:9.
AVOID in every part: any moving person, blinking, breathing, changing expressions, moving fabric, falling or drifting particles, cuts, changes of angle, zooms, camera shake, extra or duplicated people, text other than the RED FOX letters.

Reply "ready" and wait for Part 1.
```

---

## FROZEN — дописывать в конец каждой части
```
Nothing in the scene moves at all: the people are as still as wax figures — no blinking, no breathing, no change of expression, no movement of heads, hands or fabric; confetti, droplets, gold leaf and snowflakes hang fixed in mid-air and never fall or drift; flames are frozen. Only the camera moves, slowly and steadily, in one unbroken movement. No cuts, no change of angle, no zoom, no shake. Cinematic, photorealistic, warm candlelight with deep blue shadows, 16:9.
```

---

## P1 — отъезд от омара ✅
```
ONE SINGLE CONTINUOUS SHOT — a oner with no cuts and no edits. A frozen moment: time has stopped, the scene is a perfectly still tableau, like a paused film frame; the people are as motionless as wax figures in a museum.
Start exactly on the attached image. The camera slowly pulls straight back and slightly up from the red lobster, in one smooth unbroken movement. As it pulls back, the frozen waiter holding the silver tray is revealed, then the white-linen table below the tray, and at the edges of the frame the frozen guests seated around the table, statue-still, caught mid-laugh and mid-toast with raised champagne coupes. Confetti and gold leaf hang motionless in the air.
Nothing in the scene moves at all: no blinking, no breathing, no change of expression, no movement of heads, hands or fabric; no falling particles; candle flames frozen. Only the camera moves, slowly and steadily. No cuts, no change of angle, no zoom, no shake. Cinematic, photorealistic, warm candlelight with deep blue shadows, 16:9.
```

## P2 — облёт стола (Extend)
```
ONE SINGLE CONTINUOUS SHOT — continue the same take with no cut. The scene stays a perfectly still frozen tableau; the people are wax figures.
From exactly where the previous part ends, the camera slowly orbits in a smooth arc to the left around the table, staying slightly above head height, always facing the table. As it orbits, it reveals all six guests frozen in delight at the lobster — a woman in a sequinned gown with her hand to her chest, a man mid-laugh with his head tilted back, two guests holding raised champagne coupes, one leaning in — and the waiter, in his dark waistcoat and white shirt, frozen setting down the silver tray.
```
+ FROZEN

## P3 — через зал к ёлке (Extend)
```
ONE SINGLE CONTINUOUS SHOT — continue the same take with no cut. The scene stays a perfectly still frozen tableau; the people are wax figures.
From exactly where the previous part ends, the camera slowly glides forward away from the table, across the dining hall between other candlelit tables of guests frozen mid-toast, towards the tall Christmas tree by the stone fireplace, passing close beside a couple frozen mid-dance — her silk gown caught mid-swirl and perfectly still.
```
+ FROZEN

## P4 — вдоль бара (Extend)
```
ONE SINGLE CONTINUOUS SHOT — continue the same take with no cut. The scene stays a perfectly still frozen tableau; the people are wax figures.
From exactly where the previous part ends, the camera keeps facing into the dining hall and slowly drifts BACKWARDS and to the right, alongside a long backlit amber onyx bar. The bar counter runs along the right side of the frame; the dining hall with the Christmas tree and frozen guests stays visible on the left and in the background.
Clear layout of the bar: the bartenders stand ONLY BEHIND the counter, between the counter and the tall wall of bottles. The guests sit ONLY IN FRONT of the counter, on tall stools on the hall side. Nobody else is behind the counter.
Three bartenders in black waistcoats with rolled-up white sleeves, frozen like wax figures in simple, elegant poses: one holds a cocktail shaker raised high at shoulder level; one is polishing a crystal coupe with a white cloth; one has just released a single bottle that hangs perfectly still in mid-air just above his open hand. No liquid is being poured, nothing is splashing. Two guests on bar stools are frozen mid-laugh, glasses in hand.
The bottle in the air does not spin, fall or move — it is fixed in place like everything else.
```
+ FROZEN

## P5 — сквозь окно (Extend)
```
ONE SINGLE CONTINUOUS SHOT — continue the same take with no cut. The scene stays a perfectly still frozen tableau.
From exactly where the previous part ends: a slow DOLLY OUT (reverse tracking shot). The camera does NOT rotate or pan at all — its direction of view is locked on the frozen party inside for the entire shot; the camera only travels backwards, away from what it sees.
What the viewer sees, in order: the frozen guests, the bar and the Christmas tree slowly get smaller and further away; then the dark timber frame of a tall window slides into view from all four edges of the picture and surrounds the scene; then a thin sheet of glass with soft reflections passes across the view; finally we are outside, still looking at the same frozen party, now framed by the window — with a snowy window ledge along the bottom, frost in the corners of the glass and snowflakes hanging motionless in the dark blue air in front of it.
At no moment do we see the outside landscape, the mountains or the sky in front of the camera — the view always stays on the warm, golden interior.
```
+ FROZEN

## P6 — лиса (Extend)
```
ONE SINGLE CONTINUOUS SHOT — continue the same take with no cut. The scene stays a perfectly still frozen tableau.
From exactly where the previous part ends, outside, the camera still faces the restaurant window and keeps moving slowly BACKWARDS and slightly down, away from the glass — it never turns around and never looks away from the window. As it moves back, a red fox sitting perfectly still in the deep snow comes into view at the bottom of the frame in the foreground, with its back to the camera, looking in through the tall glowing window at the warm, golden, frozen celebration inside. The camera ends just behind the fox: the fox in the foreground, the glowing window and the frozen party beyond it. Snowflakes hang motionless in the air; cold blue moonlight on the snow, warm light from the window rimming the fox's fur.
```
+ FROZEN

## P7 — над вершиной (Extend)
```
ONE SINGLE CONTINUOUS SHOT — continue the same take with no cut. The scene stays a perfectly still frozen tableau.
From exactly where the previous part ends, the camera slowly rises up and back from behind the fox, high into the night sky, revealing the whole glowing timber-and-glass restaurant on the rocky mountain summit with elegant backlit letters "RED FOX" on its gable, the small gondola station beside it, the tiny fox in the snow before the windows, the vast moonlit range of snowy peaks and the warm lights of the ski village far below, under a sky full of stars. Snowflakes hang motionless close to the camera.
```
+ FROZEN
