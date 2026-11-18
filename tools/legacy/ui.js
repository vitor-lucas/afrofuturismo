// fluxo de interface com cliques reais; capturas /tmp/ui_*.png
const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const mobile = process.env.MOBILE === '1';
  const ctx = await b.newContext(mobile ? { viewport: { width: 390, height: 780 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 } : { viewport: { width: 1100, height: 650 } });
  const p = await ctx.newPage();
  const logs = []; p.on('console', m => { const t = m.text(); if ((m.type() === 'error' || m.type() === 'warning') && !/ERR_FAILED|Failed to load resource/.test(t)) logs.push(m.type() + ': ' + t.slice(0, 300)); }); p.on('pageerror', e => logs.push('PAGEERR: ' + String(e.stack || e).slice(0, 700)));
  await p.route('**/three.min.js', r => r.fulfill({ path: '/home/claude/vila/vendor/three.min.js', contentType: 'application/javascript' }));
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">' + fs.readFileSync('/home/claude/vila/dist/fragment.html', 'utf8') + '</body></html>';
  await p.route('https://vila.test/', r => r.fulfill({ body: html, contentType: 'text/html' }));
  await p.goto('https://vila.test/', { waitUntil: 'load' });
  await p.waitForFunction(() => window.__V || window.__err, null, { timeout: 120000 });
  const T = process.env.MOBILE === '1' ? 'm' : 'd';
  const fr = n => p.evaluate(n => { for (let i = 0; i < n; i++) __V.frame(.033); }, n);
  const shot = async n => { await fr(3); await p.screenshot({ path: `/tmp/ui_${T}_${n}.png`, timeout: 120000 }); };
  const say = (...a) => console.log(...a);
  await p.waitForTimeout(500); await p.evaluate(() => __V.auto(false)); await shot('01start');
  // conceito
  await p.click('#s_con'); await shot('02concept'); await p.click('#mx');
  // glossário (start)
  await p.click('#s_glos'); await shot('03gloss'); say('glossário termos:', await p.evaluate(() => document.querySelectorAll('#mbox .term-btn, #mbox [data-term]').length)); await p.click('#mx');
  // mapa
  await p.click('#s_map'); await shot('04map'); await p.click('#mx');
  // tour completo
  await p.click('#s_tour'); await fr(5); let n = 0, titles = [];
  for (; n < 20; n++) {
    titles.push(await p.evaluate(() => document.querySelector('#tour h3') && document.querySelector('#tour h3').textContent));
    if (n === 0 || n === 7) await shot('05tour' + n);
    const last = await p.evaluate(() => /Concluir|Finalizar|Síntese/i.test(document.getElementById('tr_n').textContent));
    await p.click('#tr_n'); await fr(4);
    if (await p.evaluate(() => !document.getElementById('modal').classList.contains('hidden'))) { n++; break; }
  }
  say('tour paradas:', n, titles.join(' | ')); await shot('06synth'); await p.click('#sy1'); await fr(5);
  say('modo após síntese:', await p.evaluate(() => __V.G.mode));
  await shot('07explore');
  // modo caminhar
  await p.evaluate(() => { const bt = [...document.querySelectorAll('button')].find(b => /Caminhar/.test(b.textContent) && b.offsetParent); if (bt) bt.click(); }); await fr(30); say('modo:', await p.evaluate(() => __V.G.mode));
  for (const key of ['sobrado', 'casaPatio', 'vizinhanca', 'biblioteca', 'conselho', 'saude', 'cultural']) {
    await p.evaluate(key => { const pl = __V.places.find(q => q.key === key); const d = pl.doors[0], G = __V.G; G.P.x = d.x + Math.sin(d.ry) * 2.2; G.P.z = d.z + Math.cos(d.ry) * 2.2; G.P.yaw = d.ry; }, key);
    await fr(4);
    const tg = await p.evaluate(() => __V.G.target && __V.G.target.label);
    await p.keyboard.press('KeyE'); await p.waitForTimeout(1800); await fr(5);
    const st = await p.evaluate(() => ({ inn: __V.G.in && __V.G.in.name, room: __V.G.room && __V.G.room.name }));
    if (key === 'vizinhanca' || key === 'biblioteca') await shot('08in_' + key);
    await p.evaluate(() => { const bt = [...document.querySelectorAll('button')].find(b => /Sair do edif/.test(b.textContent) && b.offsetParent); if (bt) bt.click(); }); await p.waitForTimeout(1600); await fr(5);
    const out = await p.evaluate(() => ({ inn: !!__V.G.in, mode: __V.G.mode, x: Math.round(__V.G.P.x), z: Math.round(__V.G.P.z) }));
    say('porta', key, '| alvo:', tg, '| entrou:', JSON.stringify(st), '| saiu:', JSON.stringify(out));
  }
  logs.slice(0, 20).forEach(l => console.log(l)); console.log('console errors:', logs.length);
  await b.close();
})();
