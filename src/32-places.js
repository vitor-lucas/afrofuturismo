/* ============================================================
   MAIS EDIFÍCIOS, MORADIAS, ESPAÇOS PRODUTIVOS E PRAÇA CENTRAL
   ============================================================ */
function bMercado(c) {
  const W = 24, D = 22, hw = W / 2, hd = D / 2;
  c.box('pConc', W + 1.6, .2, D + 1.6, 0, 0, 0); c.col(0, 0, W, D);
  [-10, -3.4, 3.4, 10].forEach(x => [-8, 0, 8].forEach(z => c.cyl('madeiraE', .28, .3, 5.2, x, .2, z, 10)));
  c.box('terra', W, 3.2, .5, 0, .2, -hd + .25); [-1, 1].forEach(sg => { c.box('terra', .5, 1.3, D, sg * (hw - .25), .2, 0); c.box('madeira', .15, 1.6, D - .6, sg * (hw - .25), 1.5, 0); });
  c.box('madeiraE', W + .8, .35, D + .8, 0, 5.3, 0);
  c.cone('telhaM', 12.2 * Math.SQRT2, 2.2, 0, 5.65, 0, 4, PI / 4, 1, (D / 2 + .5) / (W / 2 + .5));
  c.box('vidro', 10, 1.5, 8.4, 0, 6.2, 0); c.box('madeiraE', 10.4, .25, 8.8, 0, 7.7, 0); c.cone('telhaM', 5.3 * Math.SQRT2, 1.5, 0, 7.95, 0, 4, PI / 4, 1, 4.4 / 5.2);
  [-9, -4.6, 0, 4.6, 9].forEach((x, i) => { c.box(i % 2 ? 'kente' : 'tecido', 4.2, .1, 2.6, x, 3.5, hd + 1.0, 0, .38); c.box(['tecidoO', 'tecidoT', 'tecidoV', 'tecido', 'tecidoO'][i], 4.2, .06, .5, x, 3.62, hd - .1); });
  [-4.2, 4.2].forEach(x => c.cyl('madeiraE', .26, .26, 5.1, x, .2, hd - .6, 10)); c.box('madeiraE', 9.2, .55, .45, 0, 4.7, hd - .6); sign(c, 'MERCADO COMUNITÁRIO', 0, 4.65, hd - .36, 7.6, .62, 0);
  // bancas externas
  [[-10.5, hd + 3.4], [10.5, hd + 3.4]].forEach(([x, z], i) => { c.box('madeira', 2.4, 1, 1.3, x, 0, z); c.box(i ? 'tecidoT' : 'tecido', 2.9, .1, 2.2, x, 2.4, z, 0, .12); [-1.2, 1.2].forEach(dx => c.cyl('madeiraE', .05, .05, 2.4, x + dx, 0, z + .95, 6)); for (let k = 0; k < 6; k++) c.sph(['tecido', 'tecidoO', 'verde', 'tecidoV'][k % 4], .17, x - .9 + k * .36, 1.18, z, 1, .8, 1, 8); c.col(x, z, 2.4, 1.3); });
  c.cyl('aco', 1.2, 1.2, 3, -hw - 1, .2, -4, 14); c.cyl('aco', 1.2, 1.2, 3, -hw - 1, .2, 4, 14);
  planterBox(c, -5, hd + 4.5, 3, 1); planterBox(c, 5, hd + 4.5, 3, 1); tr(c, -12.5, hd + 4.5, 1); tr(c, 12.5, hd + 6, 1);
  return { W: 26, D: 24, fd: D, H: 10, doors: [[0, hd + 1.4, 'mercado']], lbl: 10, sign: 'MERCADO\nCOMUNITÁRIO' };
}

function bSaude(c) {
  const W = 22, D = 18, hw = W / 2, hd = D / 2;
  c.box('pedra', W + 2, .22, D + 2, 0, 0, 0); c.col(0, 0, W, D);
  const wing = (w, d, x, z) => { c.box('rebocoB', w, 4.4, d, x, .22, z); c.box('gramaE', w - .4, .3, d - .4, x, 4.62, z); parapet(c, w, d, x, 4.62, z, .2, .6, 'rebocoB'); };
  wing(W, 8, 0, 5); wing(W, 3, 0, -7.5); wing(7, 7, -7.5, -1.5); wing(7, 7, 7.5, -1.5);
  c.box('terraSolo', 8, .1, 6, 0, .22, -2.5); bedFlowers(...c.w2(0, -2.5), 7, 5, 26); // jardim de descanso (interno)
  for (let x = -9; x <= 9; x += 3) { winF(c, x, .9, hd, 1.9, 2.6, 0, { shade: .55, sill: 'pedraQ' }); }
  for (let x = -9.6; x <= 9.6; x += .8) { if (Math.abs(x) < 2.3) continue; c.box('madeiraC', .1, 3.6, .3, x, .6, hd + .3); }
  doorF(c, 0, .22, hd, 3.4, 2.9, 0, { glass: true, fr: 'madeiraC' }); c.box('madeiraC', 7, .22, 3.4, 0, 3.4, hd + 1.7); [-3.1, 3.1].forEach(x => c.cyl('madeiraC', .1, .1, 3.3, x, .22, hd + 3.2, 8));
  c.box('pedraQ', 5, .14, 4, 0, .22, hd + 2); c.box('aco', .05, .9, 3.6, -2.4, .3, hd + 2.2); c.box('aco', .05, .9, 3.6, 2.4, .3, hd + 2.2);
  sign(c, 'CENTRO DE SAÚDE\nE BEM-ESTAR', 0, 4.2, hd + .3, 6.4, .6, 0, { bg: '#0f3a37', fg: '#C9F2EC' });
  pvArray(c, -6.5, 5.3, 5, 7, 5.5, 3, 2, .3); pvArray(c, 6.5, 5.3, 5, 7, 5.5, 3, 2, .3);
  c.cyl('aco', 1.1, 1.1, 2.8, hw + 1.4, .22, -6, 14);
  planterBox(c, -7, hd + 3.6, 4.5, 1.1); planterBox(c, 7, hd + 3.6, 4.5, 1.1); tr(c, -11.5, hd + 4, 1); tr(c, 11.5, hd + 4.5, 1, { ipe: true });
  return { W: 24, D: 20, fd: D, H: 6, doors: [[0, hd + 3.6, 'saude']], lbl: 6.5, sign: 'CENTRO DE\nSAÚDE' };
}

function bBiblioteca(c) {
  const W = 20, D = 18, hw = W / 2, hd = D / 2;
  c.box('pedra', W + 2, .25, D + 2, 0, 0, 0); c.col(0, 0, W, D);
  c.box('pedra', W, 6.5, D, 0, .25, 0); c.box('vidro', 12.4, 5, .2, 0, 1, hd + .04);
  for (let x = -6.2; x <= 6.3; x += .62) { if (Math.abs(x) < 1.8) continue; c.box('madeiraE', .2, 5.4, .3, x, .8, hd + .45); }
  c.box('madeiraE', 13, .3, .3, 0, 6.2, hd + .45); c.box('friso', 20, .9, .1, 0, 5.6, hd + .02);
  [-8.2, 8.2].forEach(x => { winF(c, x, 1.6, hd, 1.0, 3.4, 0, {}); }); [-5, 0, 5].forEach(z => { winF(c, hw, 1.6, z, 1.2, 3.2, PI / 2); winF(c, -hw, 1.6, z, 1.2, 3.2, -PI / 2); });
  c.box('conc', W + 1.2, .35, D + 1.2, 0, 6.75, 0); c.box('vidro', 10, 1.9, 8, 0, 7.1, -1); c.box('concE', 10.6, .25, 8.6, 0, 9.0, -1); c.cone('telhaM', 5.4 * Math.SQRT2, 1.6, 0, 9.25, -1, 4, PI / 4, 1, 4.4 / 5.4);
  pvArray(c, 0, 7.1, 5.4, 12, 4, 5, 1, .3);
  doorF(c, 0, .25, hd + .02, 3.0, 3.0, 0, { glass: true, fr: 'madeiraE' }); steps(c, 0, hd + .5, 5, 3, .08, .5, 'pedra');
  c.box('madeiraE', 13, .26, 3.4, 0, 3.6, hd + 1.2); [-6.2, -2.1, 2.1, 6.2].forEach(x => c.cyl('madeiraE', .13, .13, 3.5, x, .25, hd + 2.8, 8)); sign(c, 'BIBLIOTECA SANKORÉ', 0, 3.7, hd + 2.93, 7.2, .52, 0);
  bench(c, -8, hd + 3.2); bench(c, 8, hd + 3.2); tr(c, -11, hd + 4, 1.3); tr(c, 11, hd + 6, 1);
  return { W: 22, D: 20, fd: D, H: 11, doors: [[0, hd + 3.0, 'biblioteca']], lbl: 11, sign: 'BIBLIOTECA\nSANKORÉ' };
}

function bConselho(c) {
  const W = 18, D = 18, hw = W / 2, hd = D / 2;
  c.box('pedraQ', W + 2, .3, D + 2, 0, 0, 0); c.col(0, 0, W, D);
  c.box('rebocoO', W, 5, D, 0, .3, 0); c.box('friso', 18, .8, .1, 0, 3.6, hd + .04);
  [-6.5, -2.2, 2.2, 6.5].forEach(x => c.cyl('madeira', .26, .26, 4.5, x, .3, hd + 1.9, 10)); c.box('madeiraE', 16, .3, 3, 0, 4.8, hd + 1.55);
  doorF(c, 0, .3, hd, 3.0, 3.0, 0, { leaf: 'madeiraE', fr: 'ouro' }); [-6.2, -3.4, 3.4, 6.2].forEach(x => winF(c, x, 1.0, hd, 1.2, 1.8, 0, {})); [-4, 4].forEach(z => { winF(c, hw, 1.2, z, 1.4, 1.8, PI / 2); winF(c, -hw, 1.2, z, 1.4, 1.8, -PI / 2); });
  steps(c, 0, hd + .4, 5.6, 3, .1, .55, 'pedraQ');
  c.box('concE', W + .8, .3, D + .8, 0, 5.3, 0); c.cyl('terra', 7, 7, 3.6, 0, 5.6, 0, 32); for (let k = 0; k < 12; k++) { const a = k * TAU / 12; c.box('gLuz', .55, 1.1, .1, 7.02 * Math.sin(a), 6.6, 7.02 * Math.cos(a), a); }
  c.cone('madeira', 7.7, 3.8, 0, 9.2, 0, 16, 0); c.cyl('vidroT', .8, .8, .6, 0, 12.8, 0, 12); c.cone('ouro', .9, .7, 0, 13.4, 0, 12, 0);
  baobab(c, 8.4, hd + 7.5, .85); bench(c, -8, hd + 3.4); bench(c, 3.5, hd + 8.5, PI);
  return { W: 20, D: 20, fd: D, H: 14, doors: [[0, hd + 3.4, 'conselho']], lbl: 14, sign: 'CASA DO\nCONSELHO' };
}

function bSustent(c) {
  const W = 30, D = 24, hd = D / 2;
  c.box('pConc', W, .12, D, 0, 0, 0);
  // salão principal (madeira, vidro e telhado verde)
  c.box('rebocoB', 16, 5, 10, -5, .12, 7); c.box('vidro', 14, 3.6, .2, -5, .6, 12.02); for (let i = 0; i <= 7; i++) c.box('madeiraC', .15, 4.4, .35, -11 + i * 2, .12, 12.2);
  c.box('madeiraE', 17, .3, 11, -5, 5.1, 7); c.box('gramaE', 15.2, .3, 9.4, -5, 5.4, 7); pvArray(c, -5, 5.8, 7, 12, 7, 5, 2, .3); c.col(-5, 7, 16, 10);
  doorF(c, -5, .12, 12.02, 3, 3, 0, { glass: true, fr: 'madeiraE' }); c.box('madeiraE', 6, .22, 2.8, -5, 3.5, 13.4); [-7.8, -2.2].forEach(x => c.cyl('madeiraE', .1, .1, 3.4, x, .12, 14.6, 8));
  sign(c, 'CENTRO DE\nSUSTENTABILIDADE', -5, 3.62, 13.5, 4.8, .8, 0, { bg: '#1b3a2a', fg: '#E6F4D4' });
  // cisternas, tubulações e ETE por zona de raízes
  [3, 8].forEach(z => { c.cyl('aco', 2.6, 2.6, 5.6, 9, .12, z - 1, 20); c.cyl('metalP', 2.7, 2.7, .25, 9, 5.7, z - 1, 20); c.col(9, z - 1, 5.2, 5.2); });
  pipe(c, 'azul', .16, 7, 3.4, .8, 3.2, 'x'); pipe(c, 'azul', .16, 7, 3.4, 1.0, 7.2, 'x'); pipe(c, 'azul', .16, 5, 9, 5.0, 3.6, 'z'); c.box('agua', 7, .08, 4.4, -10, .1, -6); c.box('pedra', 7.4, .45, .4, -10, .1, -8.4); c.box('pedra', 7.4, .45, .4, -10, .1, -3.6); c.box('pedra', .4, .45, 4.4, -13.5, .1, -6); c.box('pedra', .4, .45, 4.4, -6.5, .1, -6);
  for (let i = 0; i < 34; i++) { const [wx, wz] = c.w2(-13 + rnd() * 6, -8 + rnd() * 4.4); V.reed.add(wx, .05 + .55, wz, 1, .55 + rnd() * .5, 1, rnd() * 3, pick(['#5E9150', '#4A8A5A', '#6AA35A'])); }
  // coberta solar sobre recarga de veículos
  [[8, -8], [8, -4]].forEach(([x, z]) => { c.cyl('aco', .12, .12, 3.6, x - 5.2, .12, z - 1.5, 8); c.cyl('aco', .12, .12, 3.6, x + 5.2, .12, z - 1.5, 8); }); pvArray(c, 8, 3.7, -5.5, 11, 5.6, 6, 2, .15); evCharger(c, 5, -4.5); evCharger(c, 8, -4.5); evCharger(c, 11, -4.5);
  // compostagem, estufa e horta
  [0, 1, 2].forEach(i => { c.box('madeira', 2.4, 1.2, 1.8, -12 + i * 2.6, .12, 1.5); c.box('terraSolo', 2.1, .08, 1.5, -12 + i * 2.6, 1.32, 1.5); c.col(-12 + i * 2.6, 1.5, 2.4, 1.8); });
  c.box('vidroT', 5.6, 2.8, 4, 12, .12, -5.2 + 0); c.box('metalP', 5.8, .14, 4.2, 12, 2.92, -5.2); c.col(12, -5.2, 5.6, 4); // estufa
  turbine(c, -13, -11, 14, 1.2); c.col(-13, -11, .6, .6);
  planterBox(c, -1, 15.2, 5, 1); tr(c, 13, 14, 1); tr(c, -14, 14, 1);
  return { W: 30, D: 26, fd: D, H: 7, doors: [[-5, 14.5, 'sustent']], lbl: 8, sign: 'CENTRO DE\nSUSTENTABILIDADE', stele: [-10, 15], R: 20 };
}

/* ---------- moradias ---------- */
function bCasaPatio(c, v = 0) {
  const W = 12, D = 12, m = ['terra', 'ocre', 'areia'][v % 3], acc = ['rebocoT', 'rebocoV', 'rebocoR'][v % 3];
  c.box('calcada', 13, .08, 13, 0, 0, 0); c.col(0, 4, 12, 4); c.col(-4, -2, 4, 8); c.col(4, -2, 4, 8); c.col(0, -5.85, 4, .3);
  c.box(m, 12, 3.4, 4, 0, .08, 4); c.box(m, 4, 3.4, 8, -4, .08, -2); c.box(m, 4, 3.4, 8, 4, .08, -2); c.box(m, 4, 2.4, .3, 0, .08, -5.85);
  [[12, 4, 0, 4], [4, 8, -4, -2], [4, 8, 4, -2]].forEach(([w, d, x, z]) => { c.box('marrom', w + .5, .3, d + .5, x, 3.48, z); });
  // Embasamento, cobertura e esquadrias também nas faces laterais e de fundo.
  c.box('pedraQ', 12.2, .22, .16, 0, .08, 6.02); c.box('pedraQ', 12.2, .22, .16, 0, .08, -6.02);
  [-1, 1].forEach(sg => {
    c.box('pedraQ', .16, .22, 12.2, sg * 6.02, .08, 0);
    [-3, .6].forEach(z => winF(c, sg * 6.03, 1.0, z, 1.4, 1.25, sg * PI / 2, { fr: acc, nomull: true, shade: .35 }));
    winF(c, sg * 4, 1.0, -6.03, 1.5, 1.25, PI, { fr: acc, nomull: true });
  });
  [[12.5, 4.5, 0, 4], [4.5, 8.5, -4, -2], [4.5, 8.5, 4, -2]].forEach(([w, d, x, z]) => parapet(c, w, d, x, 3.78, z, .12, .2, m));
  c.box('madeiraE', 2.3, .12, 1.3, 0, 2.65, 6.6);
  [-1, 1].forEach(x => c.cyl('madeiraE', .045, .045, 2.57, x, .08, 7.05, 6));
  toronRow(c, -5.6, 5.6, 3.0, 6.0, .8, 0); c.box('pEsc', 4.1, .06, 8, 0, .08, -2);
  c.box('madeiraE', .14, 2.9, .14, -1.9, .08, -5.2); c.box('madeiraE', .14, 2.9, .14, 1.9, .08, -5.2); c.box('madeiraE', .14, 2.9, .14, -1.9, .08, 1.7); c.box('madeiraE', .14, 2.9, .14, 1.9, .08, 1.7); for (let i = 0; i < 6; i++) c.box('madeiraE', 4.2, .1, .1, 0, 2.98, -5.2 + i * 1.38);
  tr(c, 0, -2.2, .55, { nocol: true }); bedFlowers(...c.w2(0, -.6), 2.2, 1.2, 8);
  doorF(c, 0, .08, 6, 1.3, 2.3, 0, { leaf: 'madeiraE', fr: acc }); winF(c, -3.6, 1.0, 6, 1.5, 1.2, 0, { fr: acc, nomull: true }); winF(c, 3.6, 1.0, 6, 1.5, 1.2, 0, { fr: acc, nomull: true });
  winF(c, -2, 1.0, 2.2, 1.2, 1.2, PI / 2, { fr: acc, nomull: true }); winF(c, 2, 1.0, 2.2, 1.2, 1.2, -PI / 2, { fr: acc, nomull: true });
  pvArray(c, 0, 3.78, 4, 8.6, 2.6, 4, 1, .3); c.cyl('aco', .7, .7, 2.4, 6.8, .08, 3, 12); pipe(c, 'metalP', .04, 3, 6.0, 3.4, 3.8, 'x');
  [-5, 5].forEach(x => bedFlowers(...c.w2(x, 7.6), 3, 1.1, 8)); tr(c, -5.2, 7.6, .7); steps(c, 0, 6.3, 2.2, 2, .06, .4, 'pedra');
  return { W: 13, D: 13, fd: 12, H: 4.6, doors: [[0, 8.3, 'casaPatio']], lbl: 5.2, R: 9 };
}
function bSobrado(c) {
  const W = 18, D = 10, hd = 5, cs = ['rebocoR', 'rebocoO', 'rebocoT'];
  c.box('calcada', 19, .08, 11, 0, 0, 0); c.col(0, 0, W, D);
  for (let i = 0; i < 3; i++) {
    const x = -6 + i * 6, m = cs[i];
    c.box(m, 5.9, 7, D, x, .08, 0); c.box('rebocoB', 6.1, .3, D + .5, x, 7.08, 0, 0); parapet(c, 6.1, D + .5, x, 7.38, 0, .2, .5, 'rebocoB');
    doorF(c, x - 1.5, .08, hd, 1.3, 2.3, 0, { leaf: 'madeiraE', fr: 'metalP' }); winF(c, x + 1.1, 1.0, hd, 1.6, 1.3, 0, { fr: 'metalP' });
    c.box('conc', 4.6, .16, 1.4, x, 3.6, hd + .7); c.box('metalP', 4.6, .06, .06, x, 4.6, hd + 1.35); for (let k = 0; k < 9; k++) c.box('metalP', .04, 1.0, .04, x - 2.2 + k * .55, 3.76, hd + 1.35); c.box('metalP', .06, 1, 1.4, x - 2.3, 3.76, hd + .7); c.box('metalP', .06, 1, 1.4, x + 2.3, 3.76, hd + .7);
    doorF(c, x, 3.76, hd, 2.0, 2.4, 0, { glass: true, fr: 'metalP' }); winF(c, x - 2.2, 5.4, hd, 1.0, 1.3, 0, { fr: 'metalP', nomull: true }); winF(c, x + 2.0, 5.4, hd, 1.0, 1.3, 0, { fr: 'metalP', nomull: true });
    // Marquise do pequeno comércio e janela voltada ao quintal.
    c.box('madeiraE', 5.0, .12, 1.2, x, 2.95, hd + .6);
    sign(c, ['ATELIÊ', 'COZINHA', 'OFICINA'][i], x, 2.43, hd + .14, 3.8, .4, 0, { bg: '#322315', fg: '#F5E3BD' });
    [-1.5, 1.5].forEach(dx => { winF(c, x + dx, 1.1, -hd - .03, 1.4, 1.3, PI, { nomull: true }); winF(c, x + dx, 4.6, -hd - .03, 1.4, 1.6, PI, { nomull: true }); });
    pvArray(c, x, 7.9, -1.5, 4.4, 4.5, 2, 1, .3); bedFlowers(...c.w2(x + 1.2, hd + 1.2), 1.7, .65, 5);
  }
  [-9.03, 9.03].forEach(x => { const ry = Math.sign(x) * PI / 2; [-2.5, 2.5].forEach(z => { winF(c, x, 1.1, z, 1.5, 1.3, ry, { nomull: true }); winF(c, x, 4.6, z, 1.5, 1.6, ry, { nomull: true }); }); });
  [-9, -3, 3, 9].forEach(x => c.box('rebocoB', .15, 7, .16, x, .08, hd + .03));
  c.box('pedraQ', 18.2, .2, .14, 0, .08, hd + .04);
  c.box('kente', 18, .5, .1, 0, 6.3, hd + .03);
  tr(c, -9.8, hd + 3, .8); tr(c, 9.8, hd + 3.6, .8); [-6, 0, 6].forEach(x => bench(c, x, hd + 2.8, 0, 1.2));
  return { W: 19, D: 11, fd: D, H: 8, doors: [[-7.5, hd + 2.2, 'sobrado'], [-1.5, hd + 2.2, 'sobrado'], [4.5, hd + 2.2, 'sobrado']], lbl: 8.5, R: 11 };
}
function bVizinhanca(c) {
  const W = 16, D = 14, hw = 8, hd = 7;
  c.box('calcada', 17, .08, 15, 0, 0, 0); c.col(0, -1.5, W, 11); c.col(0, 5.5, W, 3);
  c.box('tijolo', W, 3.6, 11, 0, .08, -1.5); c.box('tijolo', W, 3.6, 3, 0, .08, 5.5); c.box('rebocoV', W, 3.6, 11, 0, 3.9, -1.5); c.box('conc', W + .6, .3, D + .6, 0, 3.68, 0); // pavimento superior recuado (galeria)
  c.box('conc', W + .6, .3, D + .6, 0, 7.5, 0); parapet(c, W + .6, D + .6, 0, 7.8, 0, .22, .6, 'rebocoV');
  for (let x = -7; x <= 7.1; x += 3.5) { c.cyl('madeiraC', .13, .13, 3.6, x, 3.98, hd - .6, 8); }
  c.box('metalP', W, .06, .06, 0, 4.98, hd - .6); for (let x = -7.6; x <= 7.7; x += .5) c.box('metalP', .04, .95, .04, x, 4.0, hd - .6); // Jardineiras apoiadas na galeria, acima do térreo.
  [-5.4, 0, 5.4].forEach(x => { c.box('conc', 2.1, .35, .55, x, 3.98, hd - .9); c.box('terraSolo', 1.95, .04, .4, x, 4.33, hd - .9); [-.65, 0, .65].forEach(dx => c.ico('fB', .28, x + dx, 4.5, hd - .9, 1, .7, .8, 0)); });
  [-1, 1].forEach(sg => {
    c.box('metalP', .05, .95, 2.4, sg * 7.85, 3.98, 5.2); c.box('madeiraC', .09, .07, 2.4, sg * 7.85, 4.93, 5.2);
    [-4.5, -.5, 2.5].forEach(z => { winF(c, sg * 8.03, 1.0, z, 1.5, 1.5, sg * PI / 2, { nomull: true }); winF(c, sg * 8.03, 4.6, z, 1.5, 1.7, sg * PI / 2, { nomull: true }); });
  });
  [-5.5, -2, 2, 5.5].forEach(x => { winF(c, x, 1.0, -7.03, 1.5, 1.5, PI, { nomull: true }); winF(c, x, 4.6, -7.03, 1.5, 1.7, PI, { nomull: true }); });
  c.box('pedraQ', 16.2, .22, .14, 0, .08, hd + .04);
  c.box('madeiraC', 4, .15, 1.2, 0, 2.95, hd + .6);
  doorF(c, 0, .08, hd, 2.6, 2.6, 0, { glass: true, fr: 'madeiraE' });
  [-5.8, -3.2, 3.2, 5.8].forEach(x => winF(c, x, 1.0, hd, 1.2, 1.5, 0, { nomull: true })); [-5.5, -2, 1.5, 5].forEach(x => winF(c, x, 4.4, 4, 1.6, 1.8, 0, { nomull: true }));
  pvArray(c, 0, 8.4, -1.5, 13, 8, 6, 2, .3);
  tr(c, -9.5, hd + 1.3, .9); tr(c, 9.5, hd + 1.3, .9); bikeRack(c, 3, hd + 3.6, 0, 4); planterBox(c, -3.5, hd + 2.4, 3.5, 1);
  return { W: 17, D: 15, fd: 14, H: 8.5, doors: [[0, hd + 2.4, 'vizinhanca']], lbl: 9, R: 11 };
}

