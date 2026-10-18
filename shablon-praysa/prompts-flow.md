# Промпты для Flow: «Шаблон прайса для услуг на Авито»

PDF уже готов без генерации: вся графика нарисована кодом в стиле «Чертёж роста». Промпты ниже для «вау-слоя»: 3D-иллюстрация на обложку и картинка для поста в Telegram.

Хвост из паспорта стиля уже вшит в каждый промпт. Текста на картинках нет, все надписи делает вёрстка.

---

## cover: обложка PDF (16:10, горизонтально)

Встаёт в тёмный блок обложки. Сохраните как `img/cover.png` (или .jpg) и запустите `node build.js`: картинка заменит графику из кода. Звёздочку Gemini в углу убрать до сборки, оригинал положить в `img/src/`.

```
On a dark desk, on the left side of the frame, three crumpled blank paper price tags lie in a messy heap. Toward the right they turn into one tall, precise stack of forty thin identical paper strips, perfectly aligned like a ruled ledger, held together by a brushed steel binder clip and standing upright on a blueprint sheet like a small architectural model. The strips are divided into four neat blocks by slightly thicker steel separators. A thin glowing electric blue line #2E8BFF runs horizontally through the scene, from the crumpled tags to the ordered stack. Photorealistic 3D render, deep navy graphite background #0F1B2D, dramatic rim light, real materials (paper, brushed steel, blueprint paper, matte concrete), soft directional cinematic light, generous negative space, single focal object, transformation from chaos to order in one frame, no people, no text, no letters, no numbers, no logos, minimal, premium editorial
```

## post: картинка для поста в Telegram (4:5)

```
A concrete workbench seen from slightly above. On the left: a scattered pile of real work items, an electrical socket, a coil of cable, a ceramic tile, a roofing sheet offcut, a wooden plank, a handful of crushed stone. On the right the same items are laid out in a strict grid, each one sitting in its own cell of a ruled blueprint sheet, rows grouped into neat blocks like a price list made of objects. One thin glowing electric blue line #2E8BFF runs along the edge of the grid. Photorealistic 3D render, warm concrete background #ECE9E4, deep navy graphite #0F1B2D accents, real materials (concrete, brushed steel, wood, blueprint paper), soft directional cinematic light, generous negative space, transformation from chaos to order in one frame, no people facing camera, no text, no letters, no numbers, no logos, minimal, premium editorial
```

---

Если вылезли буквы или «логотип», перегенерируйте или допишите в начало: `absolutely no text anywhere`.
