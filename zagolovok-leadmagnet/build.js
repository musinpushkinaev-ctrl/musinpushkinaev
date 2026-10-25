// Сборка PDF: подставляет задания из prompts/*.txt в вёрстку и печатает A4.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const dir = __dirname;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Заголовки разделов выделяем, пустые поля данных подсвечиваем (пустой span, при копировании не мешает)
function fmt(lines) {
  return lines.map(l => {
    if (/^[А-ЯЁ ]{5,}$/.test(l)) return `<span class="sec">${esc(l)}</span>`;
    if (/:\s*$/.test(l) && !/^\d/.test(l) && !/ВЫДАТЬ|ПРАВИЛА/.test(l)) return `${esc(l)} <span class="fld" style="display:inline-block;width:38mm;height:5.5mm;vertical-align:-1mm"></span>`;
    return esc(l);
  }).join('\n');
}

function split(file, marker) {
  const lines = fs.readFileSync(path.join(dir, 'prompts', file), 'utf8').trimEnd().split('\n');
  const i = lines.indexOf(marker);
  return [fmt(lines.slice(0, i)).trimEnd(), fmt(lines.slice(i))];
}

(async () => {
  let html = fs.readFileSync(path.join(dir, 'leadmagnet.html'), 'utf8');
  const [p1a, p1b] = split('zadanie1-poisk.txt', 'ПРАВИЛА ЗАГОЛОВКА');
  const [p2a, p2b] = split('zadanie2-rekomendacii.txt', 'ПРАВИЛА ЗАГОЛОВКА');
  html = html.replace('{{P1A}}', p1a).replace('{{P1B}}', p1b).replace('{{P2A}}', p2a).replace('{{P2B}}', p2b);
  const tmp = path.join(dir, '.build.html');
  fs.writeFileSync(tmp, html);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: path.join(dir, 'Заголовок-по-которому-тебя-находят.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  if (process.argv.includes('--png')) {
    await page.setViewportSize({ width: 794, height: 1123 });
    const n = await page.locator('section.page').count();
    fs.mkdirSync(path.join(dir, '.preview'), { recursive: true });
    for (let k = 0; k < n; k++) await page.locator('section.page').nth(k).screenshot({ path: path.join(dir, '.preview', `p${String(k + 1).padStart(2, '0')}.png`) });
  }
  await browser.close();
  fs.unlinkSync(tmp);
  console.log('PDF готов');
})();
