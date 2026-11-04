// Сборка: самодостаточный HTML (картинки вшиты) + PDF. Запуск: node avito-cena/build.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const dir = __dirname;
const outDir = path.join(dir, 'dist');
fs.mkdirSync(outDir, { recursive: true });

let body = fs.readFileSync(path.join(dir, 'cena-bez-pobega.html'), 'utf8');
body = body.replace(/src="(img\/[^"]+\.jpg)"/g, (m, p) =>
  `src="data:image/jpeg;base64,${fs.readFileSync(path.join(dir, p)).toString('base64')}"`);

const head = '<!doctype html>\n<html lang="ru">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n';
const html = head + body.replace('</style>', '</style>\n</head>\n<body>') + '\n</body>\n</html>\n';
const htmlPath = path.join(outDir, 'Цена-без-побега.html');
fs.writeFileSync(htmlPath, html);

// PDF: одна длинная страница шириной телефона — без разрывов карточек
const print = `<style>
  html,body{ background:#0E0D0B !important; -webkit-print-color-adjust:exact; print-color-adjust:exact }
  body{ padding:10mm 12mm !important }
  .btn, .fields, .warn{ display:none !important }
  .ad, .case, .reason, .part, .row, .script, .callout, .final, .photo, .field-shot, .check label, table tr, .toc div{ break-inside:avoid }
  h2{ break-after:avoid }
  .tag{ animation:none !important }
  .pdf-only{ display:block !important }
</style>`;
const pdfHtml = html
  .replace('</head>', print + '</head>')
  .replace('<form class="builder"', '<p class="note pdf-only" style="display:none">Интерактивный конструктор работает в HTML-версии гайда. Ниже — что он соберёт на примере плитки.</p><form class="builder"');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 720, height: 1000 } });
  const tmp = path.join(outDir, '.pdf.html');
  fs.writeFileSync(tmp, pdfHtml);
  await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  const h = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight)) + 2;
  await page.pdf({ path: path.join(outDir, 'Цена-без-побега.pdf'), printBackground: true, width: '720px', height: h + 'px', margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await browser.close();
  fs.unlinkSync(tmp);
  console.log('готово:', fs.readdirSync(outDir));
})();
