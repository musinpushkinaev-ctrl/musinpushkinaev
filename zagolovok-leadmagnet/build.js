// Сборка: каждая .card → PNG 1080×1350 (для директа/ТГ) + обе карточки одним PDF.
const path = require('path');
const { chromium } = require('playwright');

const dir = __dirname;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(dir, 'cards.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const cards = await page.$$('.card');
  for (let i = 0; i < cards.length; i++) {
    await cards[i].screenshot({ path: path.join(dir, `zagolovok-${i + 1}.png`) });
  }
  await page.pdf({ path: path.join(dir, 'Ограничители-для-заголовков.pdf'), printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log(`Готово: ${cards.length} PNG + PDF`);
})();
