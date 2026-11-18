const { chromium } = require('playwright'); const fs = require('fs');
const want = JSON.parse(process.argv[2]); // {museu:["wakanda"],...}
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const p = await b.newPage({ viewport: { width: 600, height: 400 } });
  await p.route('**/three.min.js', r => r.fulfill({ path: '/home/claude/vila/vendor/three.min.js', contentType: 'application/javascript' }));
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const html = '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0">' + fs.readFileSync('/home/claude/vila/dist/fragment.html', 'utf8') + '</body></html>';
  await p.route('https://vila.test/', r => r.fulfill({ body: html, contentType: 'text/html' }));
  await p.goto('https://vila.test/', { waitUntil: 'load' });
  await p.waitForFunction(() => window.__V, null, { timeout: 120000 }); await p.evaluate(() => __V.auto(false));
  for (const id of Object.keys(want)) {
    await p.evaluate(id => __V.enterBuilding(id), id); await p.waitForTimeout(1000);
    const res = await p.evaluate((ids) => {
      const G = __V.G, I = G.in, out = {};
      for (const hid of ids) {
        const h = I.hots.find(q => q.id === hid); let best = null, n = 0;
        for (let dx = -h.r; dx <= h.r; dx += .4) for (let dz = -h.r; dz <= h.r; dz += .4) {
          const x = h.x + dx, z = h.z + dz; if (Math.hypot(dx, dz) > h.r) continue;
          // posição livre? testa colisão pelo mesmo critério do jogador
          let free = true; for (const c of I.cols) { if (c.lv >= 0 && c.lv !== h.lv) continue; if (Math.abs(x - c.x) < c.hw + .3 && Math.abs(z - c.z) < c.hd + .3) { free = false; break; } }
          if (!free) continue;
          for (const yaw of [0, 1.57, 3.14, -1.57]) { G.P.x = x; G.P.z = z; G.P.lv = h.lv; G.P.y = I.y(h.lv); G.P.yaw = yaw; __V.frame(.01); const t = G.target; if (t && t.kind === 'hot' && t.obj.id === hid) { n++; if (!best) best = [+x.toFixed(1), +z.toFixed(1), yaw]; } }
        }
        out[hid] = { n, best, at: [h.x, h.z], r: h.r };
      }
      return out;
    }, want[id]);
    console.log(id, JSON.stringify(res));
    await p.evaluate(() => __V.exitBuilding()); await p.waitForTimeout(700);
  }
  await b.close();
})();
