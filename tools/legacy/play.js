// uso: node play.js '<json steps>'  passos: {js, click, key, hold:[key,ms], wait, shot:"nome", step:n(frames)}
const { chromium } = require('playwright'); const fs = require('fs');
const steps = JSON.parse(process.argv[2]);
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const p = await b.newPage({ viewport: { width: +(process.env.VW || 1000), height: +(process.env.VH || 600) } });
  const logs = []; p.on('console', m => { const t = m.text(); if (m.type() === 'error' || m.type() === 'warning' || t.startsWith('LOG')) logs.push(m.type() + ': ' + t.slice(0, 300)); }); p.on('pageerror', e => logs.push('PAGEERR: ' + String(e.stack || e).slice(0, 700)));
  await p.route('**/three.min.js', r => r.fulfill({ path: '/home/claude/vila/vendor/three.min.js', contentType: 'application/javascript' }));
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">' + fs.readFileSync('/home/claude/vila/dist/fragment.html', 'utf8') + '</body></html>';
  await p.route('https://vila.test/', r => r.fulfill({ body: html, contentType: 'text/html' }));
  await p.goto('https://vila.test/', { waitUntil: 'load' });
  await p.waitForFunction(() => window.__V || window.__err, null, { timeout: 120000 }).catch(() => logs.push('TIMEOUT waiting __V'));
  await p.waitForTimeout(300); await p.evaluate(() => { if (window.__V) __V.auto(false); });
  const fr = (n) => p.evaluate(n => { for (let i = 0; i < n; i++) __V.frame(.033); }, n);
  for (const s of steps) {
    if (s.js) { const r = await p.evaluate(s.js); if (r !== undefined) console.log((s.shot || 'js'), 'EVAL', JSON.stringify(r).slice(0, 1200)); }
    if (s.click) await p.click(s.click, { timeout: 5000 }).catch(e => logs.push('CLICKFAIL ' + s.click));
    if (s.key) await p.keyboard.press(s.key);
    if (s.hold) { await p.keyboard.down(s.hold[0]); for (let i = 0; i < (s.hold[1] || 30); i++) await fr(1); await p.keyboard.up(s.hold[0]); }
    if (s.wait) await p.waitForTimeout(s.wait);
    if (s.step) await fr(s.step);
    if (s.shot) { await fr(2); await p.screenshot({ path: '/tmp/' + s.shot + '.png', timeout: 120000 }); }
  }
  const err = await p.evaluate(() => window.__err || null); if (err) console.log('BOOT ERR', err);
  logs.slice(0, 20).forEach(l => console.log(l));
  await b.close();
})();
