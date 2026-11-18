// teste ponta a ponta: node e2e.js  -> relatório no stdout, capturas em /tmp/e2e_*.png
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const p = await b.newPage({ viewport: { width: 1000, height: 600 } });
  const logs = []; p.on('console', m => { const t = m.text(); if ((m.type() === 'error' || m.type() === 'warning') && !/ERR_FAILED|Failed to load resource/.test(t)) logs.push(m.type() + ': ' + t.slice(0, 300)); }); p.on('pageerror', e => logs.push('PAGEERR: ' + String(e.stack || e).slice(0, 700)));
  await p.route('**/three.min.js', r => r.fulfill({ path: '/home/claude/vila/vendor/three.min.js', contentType: 'application/javascript' }));
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">' + fs.readFileSync('/home/claude/vila/dist/fragment.html', 'utf8') + '</body></html>';
  await p.route('https://vila.test/', r => r.fulfill({ body: html, contentType: 'text/html' }));
  await p.goto('https://vila.test/', { waitUntil: 'load' });
  await p.waitForFunction(() => window.__V || window.__err, null, { timeout: 120000 });
  await p.waitForTimeout(300); await p.evaluate(() => __V.auto(false));
  await p.screenshot({ path: '/tmp/e2e_start.png' });
  const ids = await p.evaluate(() => Object.keys(__V.INT));
  console.log('interiores:', ids.join(','));
  const bad = [];
  for (const id of ids) {
    await p.evaluate(id => __V.enterBuilding(id), id); await p.waitForTimeout(1200);
    const hots = await p.evaluate(() => __V.G.in.hots.map(h => ({ id: h.id, x: h.x, z: h.z, lv: h.lv, r: h.r })));
    let ok = 0, unreach = [], missing = [], panelBad = [];
    for (const h of hots) {
      const r = await p.evaluate(h => {
        const G = __V.G, I = G.in, HOT = __V.HOT; if (!HOT[h.id]) return { miss: 1 };
        G.P.x = h.x; G.P.z = h.z; G.P.lv = h.lv; G.P.y = I.y(h.lv); G.P.yaw = 0; for (let i = 0; i < 3; i++) __V.frame(.03);
        const tg = G.target; const reach = !!(tg && tg.kind === 'hot' && tg.obj.id === h.id);
        const near = tg && tg.kind === 'hot' ? tg.obj.id : (tg ? tg.kind : null);
        const probs = []; const o = HOT[h.id];
        for (const tab of ['res', 'det', 'ref', 'src']) { __V.openPanel({ kind: 'hot', id: h.id }, tab); const t = document.getElementById('panel').innerText; if (/undefined|\[object|\{[FRAPX]\}|NaN/.test(t) || t.length < 120) probs.push(tab + ':' + t.length); }
        document.getElementById('px') && document.getElementById('px').click();
        return { reach, near, probs, title: o.t, badges: o.b.join('') };
      }, h);
      if (r.miss) missing.push(h.id); else { ok++; if (!r.reach) unreach.push(h.id + '→' + r.near); if (r.probs.length) panelBad.push(h.id + ' ' + r.probs.join(',')); }
    }
    console.log(id.padEnd(12), 'hot', hots.length, 'ok', ok, missing.length ? 'FALTA:' + missing : '', unreach.length ? 'INALCANÇÁVEL:' + unreach : '', panelBad.length ? 'PAINEL:' + panelBad : '');
    await p.evaluate(() => __V.exitBuilding()); await p.waitForTimeout(900);
    const st = await p.evaluate(() => ({ in: !!__V.G.in, mode: __V.G.mode }));
    if (st.in) bad.push('não saiu de ' + id);
  }
  console.log('falhas de saída:', bad.length ? bad : 'nenhuma');
  logs.slice(0, 20).forEach(l => console.log(l)); console.log('console errors:', logs.length);
  await b.close();
})();
