// Сборка PDF «Профиль»: картинки из img/ (если их нет, подтягиваются с CDN Higgsfield и сохраняются), формат 9:16 под телефон.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const dir = __dirname;
const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3M1JNbhSu74Ia2MH0XXy8yUv1SL/';
const remote = {
  'a1.png': CDN + 'hf_20261119_130806_53d07133-783a-4ab9-8937-2a91d190722f.png',
  'a2.png': CDN + 'hf_20261119_130806_b666bdc1-75e7-48c6-8469-323956ec7214.png',
  'a3.png': CDN + 'hf_20261119_130806_1434c50b-b1c5-4427-81cd-4ccc91fc261a.png',
};

(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ proxy });
  const ctx = await browser.newContext({ ignoreHTTPSErrors: false });
  fs.mkdirSync(path.join(dir, 'img'), { recursive: true });
  for (const [name, url] of Object.entries(remote)) {
    const p = path.join(dir, 'img', name);
    if (fs.existsSync(p)) continue;
    const r = await ctx.request.get(url);
    if (!r.ok()) throw new Error(`${name}: HTTP ${r.status()}`);
    fs.writeFileSync(p, await r.body());
    console.log('скачано', name);
  }
  const page = await ctx.newPage();
  await page.goto('file://' + path.join(dir, 'profil.html'), { waitUntil: 'networkidle' });
  await page.pdf({ path: path.join(dir, 'Чек-лист-Профиль.pdf'), width: '720px', height: '1280px', printBackground: true, preferCSSPageSize: true });
  if (process.argv[2] === '--shots') {
    await page.setViewportSize({ width: 720, height: 1280 });
    const n = await page.locator('.page').count();
    for (let i = 0; i < n; i++) await page.locator('.page').nth(i).screenshot({ path: path.join(process.argv[3] || dir, `p${i + 1}.png`) });
  }
  await browser.close();
  console.log('PDF готов');
})();
