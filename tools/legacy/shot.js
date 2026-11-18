const { chromium } = require('playwright'); const fs=require('fs');
const out = process.argv[2] || '/tmp/shot.png';
const js = process.argv[3] || '';
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--enable-webgl'] });
  const p = await b.newPage({ viewport: { width: +(process.env.VW||1100), height: +(process.env.VH||620) } });
  const logs=[]; p.on('console', m => { const t=m.text(); if(m.type()==='error'||m.type()==='warning'||t.startsWith('LOG')) logs.push(m.type()+': '+t.slice(0,400)); }); p.on('pageerror', e => logs.push('PAGEERR: ' + String(e.stack||e).slice(0,600)));
  await p.route('**/three.min.js', r => r.fulfill({ path: '/home/claude/vila/vendor/three.min.js', contentType: 'application/javascript' }));
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync('/home/claude/vila/dist/fragment.html', 'utf8') + '</body></html>';
  await p.route('https://vila.test/', r => r.fulfill({ body: html, contentType: 'text/html' }));
  await p.goto('https://vila.test/', { waitUntil: 'load' });
  await p.waitForFunction(() => window.__V || window.__err, null, { timeout: 60000 }).catch(()=>logs.push('TIMEOUT waiting __V'));
  await p.waitForTimeout(300);
  await p.evaluate(() => { if (window.__V) __V.auto(false); });
  if (js) { const r = await p.evaluate(js); if (r !== undefined) console.log('EVAL', JSON.stringify(r).slice(0, 1500)); }
  await p.evaluate(() => { if (window.__V) { __V.frame(.016); __V.frame(.016); } });
  const err = await p.evaluate(() => window.__err || null); if (err) console.log('BOOT ERR', err);
  await p.screenshot({ path: out, timeout: 120000 });
  logs.slice(0, 15).forEach(l => console.log(l));
  await b.close();
})();
