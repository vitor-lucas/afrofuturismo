// uso: node int.js <id> '<json views [{n,x,z,yaw,pitch,lv,y}]>'  -> /tmp/i_<id>_<n>.png
const { chromium } = require('playwright'); const fs = require('fs');
const id = process.argv[2], views = JSON.parse(process.argv[3] || '[]');
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const p = await b.newPage({ viewport: { width: +(process.env.VW || 900), height: +(process.env.VH || 540) } });
  const logs = []; p.on('console', m => { const t = m.text(); if (m.type() === 'error' || m.type() === 'warning') { if (!/ERR_FAILED|Failed to load resource/.test(t)) logs.push(m.type() + ': ' + t.slice(0, 400)); } }); p.on('pageerror', e => logs.push('PAGEERR: ' + String(e.stack || e).slice(0, 900)));
  await p.route('**/three.min.js', r => r.fulfill({ path: '/home/claude/vila/vendor/three.min.js', contentType: 'application/javascript' }));
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">' + fs.readFileSync('/home/claude/vila/dist/fragment.html', 'utf8') + '</body></html>';
  await p.route('https://vila.test/', r => r.fulfill({ body: html, contentType: 'text/html' }));
  await p.goto('https://vila.test/', { waitUntil: 'load' });
  await p.waitForFunction(() => window.__V || window.__err, null, { timeout: 120000 }).catch(() => logs.push('TIMEOUT waiting __V'));
  await p.waitForTimeout(300); await p.evaluate(() => { if (window.__V) __V.auto(false); });
  const t0 = Date.now(); const info = await p.evaluate(async (id) => { try { const I = __V.getInterior(id); return { ok: 1, rooms: I.rooms.length, cols: I.cols.length, hots: I.hots.map(h => h.id), lights: I.lights.length, spawn: I.spawn, bb: I.bb }; } catch (e) { return { err: String(e.stack || e).slice(0, 800) }; } }, id);
  console.log('build', Date.now() - t0, 'ms', JSON.stringify(info).slice(0, 1500));
  if (info.err) { await b.close(); return; }
  await p.evaluate((id) => { __V.enterBuilding(id); }, id); await p.waitForTimeout(1500);
  for (const v of views) {
    const r = await p.evaluate((v) => { const G = __V.G; if (v.js) { try { const q = eval(v.js); if (q !== undefined) return q; } catch (e) { return 'ERR ' + e; } } if (v.x != null) { const I = G.in; const lv = v.lv || 0; G.P.x = v.x; G.P.z = v.z; G.P.lv = lv; G.P.y = v.y != null ? v.y : I.y(lv); G.P.yaw = v.yaw || 0; G.P.pitch = v.pitch || 0; } for (let i = 0; i < 6; i++) __V.frame(.03); return { room: G.room && G.room.name, y: G.P.y, lv: G.P.lv, tgt: G.target && G.target.label }; }, v);
    if (v.n) { await p.screenshot({ path: `/tmp/i_${id}_${v.n}.png`, timeout: 120000 }); }
    console.log(v.n || 'step', JSON.stringify(r));
  }
  logs.slice(0, 15).forEach(l => console.log(l)); await b.close();
})();
