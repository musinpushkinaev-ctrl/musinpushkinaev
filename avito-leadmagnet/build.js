// Сборка PDF: подставляет картинки из img/ (img1.png, img2.jpg …) вместо заглушек и печатает A4.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const dir = __dirname;
const exts = ['png', 'jpg', 'jpeg', 'webp'];

function findImg(name) {
  for (const e of exts) {
    const p = path.join(dir, 'img', `${name}.${e}`);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

(async () => {
  let html = fs.readFileSync(path.join(dir, 'leadmagnet.html'), 'utf8');
  html = html.replace(/<div class="([^"]*\bart\b[^"]*)" data-img="(\w+)">[^<]*<\/div>/g, (m, cls, name) => {
    const p = findImg(name);
    if (!p) return m;
    return `<div class="${cls} has-img" data-img="${name}"><img src="file://${p}"></div>`;
  });
  const tmp = path.join(dir, '.build.html');
  fs.writeFileSync(tmp, html);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
  await page.pdf({ path: path.join(dir, 'Почему-твой-Авито-молчит.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  fs.unlinkSync(tmp);
  console.log('PDF готов');
})();
