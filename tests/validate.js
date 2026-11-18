// npm install --no-save playwright; CHROMIUM_PATH=/usr/bin/chromium node tests/validate.js
// Testa o HTML final em um servidor local, inclusive sem fontes externas.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const results = {};
(async () => {
 const html = fs.readFileSync(path.join(root, 'dist/vila-afrofuturista-offline.html'));
 const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(html); });
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
 const launch = { headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] };
 if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
 const browser = await chromium.launch(launch);
 try {
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1100, height: 740 } });
  page.on('pageerror', e => errors.push(e.message));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.waitForFunction(() => window.__V || window.__err, null, { timeout: 120000 });
  assert.equal(await page.evaluate(() => window.__err), undefined);
  await page.evaluate(() => { __V.auto(false); document.getElementById('s_exp').click(); });
  results.geometry = await page.evaluate(() => {
   scene.updateMatrixWorld(true);
   const materials = [MATS.asfalto, MATS.calcada, MATS.curb, MATS.praca, MATS.pConc, MATS.pPedra], meshes = [];
   scene.traverse(o => { if (o.isMesh && materials.includes(o.material)) meshes.push(o); });
   const ray = new T.Raycaster(new T.Vector3(), new T.Vector3(0, -1, 0), 0, 1.2), failures = [];
   let samples = 0;
   const check = (x, z, label) => {
    samples++; ray.ray.origin.set(x, 1, z);
    let hits = ray.intersectObjects(meshes, false);
    // Uma tolerância de 0,1 mm evita erro numérico na emenda dos arcos.
    if (!hits.length) { ray.ray.origin.x += .0001; ray.ray.origin.z += .0001; hits = ray.intersectObjects(meshes, false); }
    if (!hits.length || hits[0].object.material !== MATS.asfalto) failures.push({ label, x, z, surface: !hits.length ? 'none' : Object.keys(MATS).find(k => MATS[k] === hits[0].object.material) });
    const q = { x, z }; pushOut(q, .38, EXT.cols, -1); pushCircles(q, .38, EXT.circ);
    if (Math.hypot(q.x - x, q.z - z) > .05) failures.push({ label, x, z, collision: true });
   };
   ROADS.rings.forEach(r => {
    for (const radius of [r.r0 + .5, (r.r0 + r.r1) / 2, r.r1 - .5])
     for (let d = 0; d < 360; d += 2) { const [x, z] = polar(d, radius); check(x, z, r.id); }
   });
   ROADS.avenues.forEach(v => {
    const [ex, ez] = polar(v.deg, 1);
    for (let r = v.r0; r <= Math.min(v.r1, 138); r += .8)
     for (const off of [-(v.w / 2 - .5), 0, v.w / 2 - .5]) check(ex * r + ez * off, ez * r - ex * off, 'avenue ' + v.deg);
   });
   return { samples, failures };
  });
  assert.deepEqual(results.geometry.failures, [], 'pista interrompida ou ocupada por um obstáculo');
  results.reachability = await page.evaluate(() => {
   // Busca por caminhos sobre a planta pavimentada; colisores reais do jogador.
   const STEP = .5, N = 573, HALF = 143, seen = new Uint8Array(N * N), queue = new Int32Array(N * N);
   const node = (x, z) => Math.round((z + HALF) / STEP) * N + Math.round((x + HALF) / STEP);
   const links = [...ROADS.paths, ...ROADS.access];
   function free(x, z) {
    const r = Math.hypot(x, z); if (r > WORLD_R - 3) return false;
    const paved = r < 19 || ROADS.rings.some(v => r >= v.r0 - v.sw && r <= v.r1 + v.sw)
     || ROADS.avenues.some(v => segmentDistance(x, z, polar(v.deg, v.r0), polar(v.deg, v.r1)) <= v.w / 2 + v.sw)
     || links.some(v => segmentDistance(x, z, v.a, v.b) <= v.w / 2);
    if (!paved) return false;
    const q = { x, z }; pushOut(q, .38, EXT.cols, -1); pushCircles(q, .38, EXT.circ);
    return Math.hypot(x - q.x, z - q.z) < .04;
   }
   let head = 0, tail = 0; queue[tail++] = node(0, 36); seen[queue[0]] = 1;
   while (head < tail) {
    const n = queue[head++], ix = n % N, iz = Math.floor(n / N);
    for (const [dx, dz] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]) {
     const nx = ix + dx, nz = iz + dz, next = nz * N + nx;
     if (nx < 0 || nz < 0 || nx >= N || nz >= N || seen[next]) continue;
     const x = nx * STEP - HALF, z = nz * STEP - HALF;
     if (free(x, z)) { seen[next] = 1; queue[tail++] = next; }
    }
   }
   const destinations = places.filter(p => p.doors.length || p.access.length), unreachable = [], entrances = [];
   for (const p of destinations) {
    goWalkTo(p.i); fpUpdate(.01); const pos = { x: G.P.x, z: G.P.z };
    let reached = false;
    for (let dx = -.5; dx <= .5; dx += .5) for (let dz = -.5; dz <= .5; dz += .5) if (seen[node(pos.x + dx, pos.z + dz)]) reached = true;
    if (!reached) unreachable.push({ i: p.i, key: p.key, pos });
    if (p.doors.length) entrances.push({ i: p.i, target: G.target?.kind, instance: G.target?.obj?.p?.i });
   }
   return { visitedCells: tail, destinations: destinations.length, unreachable, entrances };
  });
  assert.deepEqual(results.reachability.unreachable, [], 'destino sem caminho pavimentado');
  for (const e of results.reachability.entrances) { assert.equal(e.target, 'door'); assert.equal(e.instance, e.i); }
  // A lista do mapa deve preservar cada instância das 14 moradias.
  results.map = await page.evaluate(() => {
   setMode('orbit'); openMap();
   const houses = places.filter(p => ['casaPatio','sobrado','vizinhanca'].includes(p.key)), failures = [];
   for (const p of houses) {
    openMap(); document.querySelector(`#mapl [data-i="${p.i}"]`).click();
    if (G.selected !== p.i || Math.hypot(G.fly.b.x - p.cx, G.fly.b.z - p.cz) > .01) failures.push(p.i);
   }
   closeCard(); G.fly = null; resetView();
   return { houses: houses.length, labels: document.querySelectorAll('.lbl').length, failures };
  });
  assert.deepEqual(results.map.failures, []);
  assert.equal(results.map.houses, 14);
  assert.equal(results.map.labels, 30);
  // Zoom começa gradualmente e converge para o valor pedido, sem saltar.
  results.zoom = await page.evaluate(() => {
   setMode('orbit'); const render = ren.render; ren.render = () => {}; resetView();
   const before = view.r; document.getElementById('c').dispatchEvent(new WheelEvent('wheel', { deltaY: -100, cancelable: true }));
   frame(1 / 60); const first = view.r;
   for (let i = 0; i < 90; i++) frame(1 / 60);
   const final = view.r; ren.render = render;
   return { before, first, final, expected: before * Math.exp(-.12) };
  });
  assert.ok(results.zoom.before > results.zoom.first && results.zoom.first > results.zoom.final);
  assert.ok(Math.abs(results.zoom.final - results.zoom.expected) < .01);
  // Sombras não precisam reconstruir a cidade em cada quadro estável.
  results.shadowUpdates = await page.evaluate(() => {
   setMode('orbit'); setQuality('med'); G.fly = null; resetView();
   const render = ren.render; let passes = 0;
   ren.render = () => { if (ren.shadowMap.needsUpdate) { passes++; ren.shadowMap.needsUpdate = false; } };
   for (let i = 0; i < 60; i++) frame(1 / 60);
   ren.render = render; return passes;
  });
  assert.ok(results.shadowUpdates >= 12 && results.shadowUpdates <= 16);
  // Montagem, conteúdo e saída dos doze interiores originais.
  results.interiors = [];
  for (const id of await page.evaluate(() => Object.keys(INT))) {
   await page.evaluate(id => enterBuilding(id), id);
   const report = await page.evaluate(() => {
    const I = G.in, bad = [];
    for (const h of I.hots) {
     if (!HOT[h.id]) { bad.push('missing ' + h.id); continue; }
     for (const tab of ['res','det','ref','src']) {
      openPanel({kind:'hot',id:h.id},tab);
      const text = document.getElementById('panel').innerText;
      if (/undefined|\[object Object\]|NaN/.test(text) || text.length < 120) bad.push(h.id + ':' + tab);
     }
    }
    closePanel(); return { id: I.id, points: I.hots.length, bad };
   });
   assert.deepEqual(report.bad, [], id + ': conteúdo inválido');
   assert.equal(await page.evaluate(id => G.in === getInterior(id), id), true);
   await page.evaluate(() => exitBuilding());
   assert.equal(await page.evaluate(() => !!G.in), false);
   results.interiors.push({id, points: report.points});
  }
  // Teclas soltas ao sair da janela evitam movimento preso ao voltar.
  await page.evaluate(() => { G.keys.KeyW = true; G.joy.y = -1; window.dispatchEvent(new Event('blur')); });
  assert.equal(await page.evaluate(() => Object.keys(G.keys).length === 0 && G.joy.y === 0), true);
  const mobile = await browser.newContext({ viewport: {width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true });
  const mp = await mobile.newPage(); mp.on('pageerror', e => errors.push(e.message));
  await mp.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await mp.goto(`http://127.0.0.1:${server.address().port}/`);
  await mp.waitForFunction(() => window.__V || window.__err, null, {timeout:120000});
  await mp.evaluate(() => { __V.auto(false); document.getElementById('s_exp').click(); document.getElementById('t_walk').click(); });
  results.mobile = await mp.evaluate(() => {
   const ids = ['app','joy','ebtn','mini','tools'], boxes = {};
   for (const id of ids) { const r = document.getElementById(id).getBoundingClientRect(); boxes[id] = { x:r.x, y:r.y, w:r.width, h:r.height }; }
   return { quality: G.quality, touch:G.touch, width:innerWidth, height:innerHeight, scrollWidth:document.documentElement.scrollWidth, boxes };
  });
  assert.equal(results.mobile.quality,'low'); assert.equal(results.mobile.touch,true);
  assert.ok(results.mobile.scrollWidth <= results.mobile.width);
  for(const [id,r] of Object.entries(results.mobile.boxes)) { assert.ok(r.x >= 0 && r.y >= 0 && r.x+r.w <= 391 && r.y+r.h <= 845, id+' fora da tela'); }
  await mp.setViewportSize({width:844,height:390});
  await mp.evaluate(() => onResize());
  results.landscape = await mp.evaluate(() => ({height:document.getElementById('app').clientHeight,viewport:innerHeight}));
  assert.equal(results.landscape.height,results.landscape.viewport);
  assert.deepEqual(errors, []);
  results.pageErrors = errors;
  const out = process.env.REPORT_PATH;
  if (out) fs.writeFileSync(out, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
 } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(e => { console.error(e); process.exitCode = 1; });
