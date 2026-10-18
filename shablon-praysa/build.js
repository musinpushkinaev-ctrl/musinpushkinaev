// Сборка PDF: если в img/ лежит картинка (cover.png, t1.jpg …), она встаёт в слот .art[data-img] вместо графики из кода.
// Запуск: node build.js            -> PDF
//         node build.js --png      -> ещё и PNG каждой страницы в preview/ для проверки
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const dir = __dirname;
const exts = ['png', 'jpg', 'jpeg', 'webp'];
const OUT = 'shablon-praysa-Avito.pdf';
const PRAYS = require('./data.js');

function findImg(name) {
  for (const e of exts) {
    const p = path.join(dir, 'img', `${name}.${e}`);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// CSV для Excel и Google Таблиц: точка с запятой и BOM, чтобы кириллица открывалась без настроек
function writeCsv() {
  const q = (v) => '"' + String(v).replace(/"/g, '""') + '"';
  const lines = [['Ниша', 'Блок', 'Услуга', 'Единица', 'Цена от, ₽'].map(q).join(';')];
  for (const n of PRAYS) for (const [g, rows] of n.groups) for (const [t, u] of rows) lines.push([n.title, g, t, u, ''].map(q).join(';'));
  fs.writeFileSync(path.join(dir, 'shablon-praysa.csv'), '\ufeff' + lines.join('\r\n') + '\r\n');
}

(async () => {
  writeCsv();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await page.goto('file://' + path.join(dir, 'leadmagnet.html'), { waitUntil: 'networkidle' });
  await page.evaluate((imgs) => {
    document.querySelectorAll('.art[data-img]').forEach((el) => {
      const src = imgs[el.dataset.img];
      if (src) { el.innerHTML = `<img src="file://${src}">`; el.classList.add("has-img"); }
    });
  }, Object.fromEntries([...new Set(await page.$$eval('.art[data-img]', (els) => els.map((e) => e.dataset.img)))].map((n) => [n, findImg(n)])));
  await page.evaluate(() => document.fonts.ready);

  if (process.argv.includes('--png')) {
    const pv = path.join(dir, 'preview');
    fs.mkdirSync(pv, { recursive: true });
    const pages = await page.$$('section.page');
    for (let i = 0; i < pages.length; i++) {
      await pages[i].screenshot({ path: path.join(pv, `p${String(i + 1).padStart(2, '0')}.png`) });
    }
    // проверка переполнения страниц
    const over = await page.$$eval('section.page', (els) => els.map((e, i) => e.scrollHeight > e.clientHeight + 1 ? i + 1 : 0).filter(Boolean));
    console.log('страниц:', pages.length, over.length ? 'ПЕРЕПОЛНЕНЫ: ' + over.join(',') : 'переполнений нет');
  }
  await page.pdf({ path: path.join(dir, OUT), format: 'A4', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log('PDF готов:', OUT);
})();
