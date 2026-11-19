// Сборка PDF «Профиль»: картинки из img/ (если их нет, подтягиваются с CDN Higgsfield и сохраняются), формат 9:16 под телефон.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const dir = __dirname;
const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3M1JNbhSu74Ia2MH0XXy8yUv1SL/';
const remote = {
  '1.png': CDN + 'hf_20261119_124001_fa5d3db8-3df9-4f15-92f4-305039a7a705.png',
  '2.png': CDN + 'hf_20261119_124002_46b536ef-6556-4c5e-aaeb-3fb12a6a31b7.png',
  '3.png': CDN + 'hf_20261119_124001_83fb36a6-b415-4838-8410-753b99a2368b.png',
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
