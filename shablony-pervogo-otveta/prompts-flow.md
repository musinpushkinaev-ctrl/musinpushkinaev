# Промпты для Flow: «3 шаблона первого ответа»

PDF уже готов без генерации: вся графика нарисована кодом в стиле «Чертёж роста». Промпты ниже для «вау-слоя»: 3D-иллюстрация на обложку PDF и картинка для поста в Telegram, где будет лежать лидмагнит.

Хвост из паспорта стиля уже вшит в каждый промпт. Текста на картинках нет, все надписи делает вёрстка.

---

## cover: обложка PDF (16:10, горизонтально)

Встаёт в тёмный блок обложки под заголовком. Сохраните как `img/cover.png` (или .jpg) и запустите `node build.js`: картинка заменит графику из кода.

```
On a dark desk lies a smartphone screen-up. On the left side of the frame, crumpled grey paper speech bubbles and a single torn receipt-like note are scattered in chaos. Toward the right they unfold and stack into one neat, precise paper message card with five clean layered lines, standing upright like a small architectural model, and next to it a brushed steel old-style telephone handset rests on a blueprint sheet. A thin glowing electric blue line #2E8BFF runs horizontally through the scene, passing from the chaotic bubbles to the ordered card. Photorealistic 3D render, deep navy graphite background #0F1B2D, dramatic rim light, real materials (paper, brushed steel, blueprint paper, matte concrete), soft directional cinematic light, generous negative space, single focal object, transformation from chaos to order in one frame, no people, no text, no letters, no numbers, no logos, minimal, premium editorial
```

## post: картинка для поста в Telegram (4:5)

```
A concrete workbench seen from slightly above. On the left: a pile of rough unsorted materials, scattered paving stones, a cut piece of asphalt and wooden planks. On the right the same materials are assembled into three neat small architectural models standing in a row: a tiny wooden sauna house, a stack of perfectly aligned paving stones, a smooth asphalt sample slab. In front of each model lies a clean paper card. One thin glowing electric blue line #2E8BFF runs along the edge of the workbench connecting all three models. A person's hand from the right edge places the last card. Photorealistic 3D render, warm concrete background #ECE9E4, deep navy graphite #0F1B2D accents, real materials (concrete, brushed steel, wood, blueprint paper), soft directional cinematic light, generous negative space, transformation from chaos to order in one frame, no people facing camera, no text, no letters, no logos, minimal, premium editorial
```

---

Если вылезли буквы или «логотип», перегенерируйте или допишите в начало: `absolutely no text anywhere`.
