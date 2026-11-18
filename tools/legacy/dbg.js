const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const p = await (await b.newContext({ viewport: { width: 1100, height: 650 } })).newPage();
  await p.route('**/three.min.js', r => r.fulfill({ path: '/home/claude/vila/vendor/three.min.js', contentType: 'application/javascript' }));
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">' + fs.readFileSync('/home/claude/vila/dist/fragment.html', 'utf8') + '</body></html>';
  await p.route('https://vila.test/', r => r.fulfill({ body: html, contentType: 'text/html' }));
  await p.goto('https://vila.test/', { waitUntil: 'load' }); await p.waitForFunction(() => window.__V, null, { timeout: 120000 }); await p.evaluate(() => __V.auto(false));
  const sc = () => p.evaluate(() => { const o = []; document.querySelectorAll('*').forEach(e => { if (e.scrollLeft || e.scrollTop) o.push(e.tagName + '#' + e.id + '.' + e.className + ' ' + e.scrollLeft + ',' + e.scrollTop); }); return o.concat([document.scrollingElement.scrollLeft + ',' + document.scrollingElement.scrollTop]); });
  await p.click('#s_tour'); await p.waitForTimeout(300); console.log('após start tour', await sc());
  await p.click('#tr_n'); await p.waitForTimeout(300); console.log('após próxima', await sc());
  for (let i = 0; i < 4; i++) { await p.click('#tr_n'); } console.log('após +4', await sc());
  console.log(await p.evaluate(() => { const t = document.getElementById('tour').getBoundingClientRect(); const a = document.getElementById('app').getBoundingClientRect(); return JSON.stringify({ tour: [t.x, t.y, t.width, t.height], app: [a.x, a.y, a.width, a.height], iw: innerWidth }); }));
  await b.close();
})();
