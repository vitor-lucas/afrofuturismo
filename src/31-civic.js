/* ============================================================
   EDIFÍCIOS CÍVICOS (fachadas externas)
   ============================================================ */
function bMuseu(c) {
  const W = 24, D = 24, hw = W / 2, hd = D / 2;
  c.box('pedraQ', W + 2.4, .3, D + 2.4, 0, 0, 0); c.box('terra', W, 8, D, 0, .3, 0); c.col(0, 0, W, D);
  [-1, 1].forEach(sg => { c.box('friso', 7.4, 1.1, .12, sg * 8.2, 4.8, hd + .05); c.box('friso', 7.4, 1.1, .12, sg * 8.2, 4.8, -hd - .05, PI); });
  [-4.2, 4.2, -8.4, 8.4].forEach(x => pilaster(c, x, hd, 1.3, 8.7, 'terra'));
  [-4.2, 4.2, -8.4, 8.4].forEach(x => pilaster(c, x, -hd, 1.3, 8.7, 'terra', PI));
  [-8, -3, 3, 8].forEach(z => { pilaster(c, hw, z, 1.2, 8.7, 'terra', PI / 2); pilaster(c, -hw, z, 1.2, 8.7, 'terra', -PI / 2); });
  [6.4, 7.2, 8.0].forEach(y => { toronRow(c, -11.4, 11.4, y, hd, .9, 0); });
  [-1, 1].forEach(sg => { const x = sg * (hw - .2); c.cyl('terra', 1.0, 1.75, 12.6, x, .3, hd - .2, 18); c.cyl('ouro', 1.1, 1.1, .22, x, 12.9, hd - .2, 18); c.cone('terra', 1.0, 1.1, x, 13.1, hd - .2, 10, 0);
    for (let k = 0; k < 8; k++) { const a = k * TAU / 8; c.box('madeiraE', .11, .11, .6, x + Math.sin(a) * 1.25, 8.6, hd - .2 + Math.cos(a) * 1.25, a); c.box('madeiraE', .11, .11, .6, x + Math.sin(a) * 1.15, 10.4, hd - .2 + Math.cos(a) * 1.15, a); } });
  // portal dourado
  c.box('metalP', 4.8, 5.9, .12, 0, .3, hd + .03); c.box('ouro', .35, 6.4, .55, -2.65, .3, hd + .25); c.box('ouro', .35, 6.4, .55, 2.65, .3, hd + .25); c.box('ouro', 5.65, .45, .55, 0, 6.3, hd + .25);
  doorF(c, 0, .3, hd + .1, 4.4, 4.6, 0, { glass: true, fr: 'metalP' }); c.box('vidroT', 4.4, 1.1, .06, 0, 4.95, hd + .1);
  c.box('concE', 7.8, .28, 3.2, 0, 6.9, hd + 1.6); c.cyl('ouro', .12, .12, 6.6, -3.5, .3, hd + 3.0, 10); c.cyl('ouro', .12, .12, 6.6, 3.5, .3, hd + 3.0, 10);
  steps(c, 0, hd + .9, 9, 4, .1, .55, 'pedraQ'); c.col(-3.5, hd + 3, .4, .4); c.col(3.5, hd + 3, .4, .4);
  sign(c, 'MUSEU DE ANCESTRALIDADE\nE FUTUROS NEGROS', -3.3, 7.35, hd + .2, 6.6, .8, 0);
  // fendas de luz
  [-10.6, -6.4, 6.4, 10.6].forEach(x => winF(c, x, 1.7, hd, .8, 3.1, 0, { nosill: false }));
  [-6, 0, 6].forEach(z => { winF(c, hw, 1.7, z, .8, 3.1, PI / 2); winF(c, -hw, 1.7, z, .8, 3.1, -PI / 2); });
  // laje, platibanda e volume superior em vidro (o futuro sobre a terra)
  c.box('conc', W + .6, .3, D + .6, 0, 8.3, 0); parapet(c, W + .6, D + .6, 0, 8.6, 0, .35, .9, 'terra');
  c.box('vidro', 15, 3.4, 15, 0, 8.6, -2); [-7.5, 7.5].forEach(x => [-9.5, 5.5].forEach(z => c.box('gTur', .18, 3.5, .18, x, 8.6, z)));
  for (let i = 1; i < 6; i++) { c.box('metalP', .1, 3.4, .1, -7.5 + i * 2.5, 8.6, 5.52); c.box('metalP', .1, 3.4, .1, 7.52, 8.6, -9.5 + i * 2.5); c.box('metalP', .1, 3.4, .1, -7.52, 8.6, -9.5 + i * 2.5); }
  c.box('gTur', 15.2, .1, .1, 0, 8.65, 5.55); c.box('conc', 15.6, .25, 15.6, 0, 12.0, -2); pvArray(c, 0, 12.25, -2, 13.5, 13.5, 5, 3, .25);
  tr(c, -9.5, hd + 5.5, 1.1); tr(c, 9.5, hd + 5.5, 1.1);
  return { W: 27, D: 27, fd: D, H: 13, doors: [[0, hd + 3.6, 'museu']], lbl: 14, sign: 'MUSEU DE\nANCESTRALIDADE', R: 18 };
}

function bCultural(c) {
  const W = 24, D = 22, hw = W / 2, hd = D / 2;
  c.box('pedra', W + 2, .25, D + 2, 0, 0, 0); c.col(0, 0, W, D);
  // bloco de galerias (ocre) com pintura mural
  c.box('rebocoO', 12, 7, D, -6, .25, 0);
  c.box('ndb', 6.5, 2.7, .1, -9, 2.2, hd + .05); c.box('mud', 4.2, 1.1, .1, -3.2, 1.2, hd + .05); c.box('kente', 1.0, 4.5, .1, -1.05, 1.0, hd + .05);
  [-10.5, -7.5].forEach(x => winF(c, x, 1.0, hd, 1.8, 1.0, 0, { shade: .5, nomull: true }));
  [-5, 0, 5].forEach(z => winF(c, -hw, 1.4, z, 2.0, 3.0, -PI / 2, { shade: .6 }));
  [0, -6].forEach(z => c.box('friso', 12, .8, .1, -6, 6.1, hd + .05));
  // sheds (dentes de serra) com vidro para luz natural difusa
  for (let i = 0; i < 3; i++) { const x = -10 + i * 4; c.box('telhaM', 3.9, .16, D - .4, x, 7.5, 0, 0, 0, .28); c.box('vidro', .08, 1.2, D - .6, x - 1.95, 7.28, 0); }
  parapet(c, 12, D, -6, 7.25, 0, .25, .35, 'rebocoO');
  // foyer em vidro (rotunda)
  c.cyl('vidroT', 5.5, 5.5, 6, 6, .25, 5.5, 32); for (let k = 0; k < 20; k++) { const a = k * TAU / 20; c.box('metalP', .1, 6, .1, 6 + Math.sin(a) * 5.55, .25, 5.5 + Math.cos(a) * 5.55); }
  [2.4, 6.1].forEach(y => c.cyl('ouro', 5.7, 5.7, .2, 6, y, 5.5, 32)); c.cyl('telhaM', 6.1, 6.1, .35, 6, 6.25, 5.5, 32); c.cyl('conc', 5.6, 5.6, .2, 6, 6.6, 5.5, 32);
  pvArray(c, 6, 6.8, 5.5, 7, 7, 3, 3, .3);
  // torre de palco
  c.box('terra', 12, 10, 11, 6, .25, -5.5); c.box('ndb', 5, 3.2, .1, 6, 5.5, .06); parapet(c, 12, 11, 6, 10.25, -5.5, .35, .7, 'terra');
  c.box('metalP', 6.5, .3, 1.6, 6, 8.2, 1.2); // pórtico
  // entrada
  c.box('vidro', 3.6, 3.4, .3, 6, .25, hd - .1); c.box('ouro', 3.9, .3, .45, 6, 3.7, hd - .05); c.box('concE', 6, .25, 3, 6, 4.5, hd + .9); c.cyl('aco', .1, .1, 4.3, 3.2, .25, hd + 2.2, 8); c.cyl('aco', .1, .1, 4.3, 8.8, .25, hd + 2.2, 8);
  steps(c, 6, hd + .3, 6, 3, .08, .5, 'pedra');
  sign(c, 'CENTRO CULTURAL\nE DE ARTES', 6, 4.8, hd + 1.0, 5.6, .7, 0);
  tr(c, -9.5, hd + 5, 1.1); tr(c, 11, hd + 5, 1); tr(c, -1, hd + 7, 1.2, { ipe: true });
  return { W: 26, D: 24, fd: D, H: 11, doors: [[6, hd + 2.6, 'cultural']], lbl: 11, sign: 'CENTRO CULTURAL\nE DE ARTES' };
}

function bInovacao(c) {
  const W = 20, D = 20, hw = W / 2, hd = D / 2;
  c.box('conc', W + 2.4, .25, D + 2.4, 0, 0, 0); c.col(0, 0, W, D);
  c.box('conc', W, 4.5, D, 0, .25, 0); c.box('vidro', 15, 3.4, .25, 0, .8, hd + .02);
  for (let i = 0; i <= 10; i++) c.box('metalP', .1, 3.6, .3, -7.5 + i * 1.5, .75, hd + .2);
  c.box('concE', 20.4, .3, 20.4, 0, 4.75, 0);
  // torre
  c.box('conc', 12, 12.5, 12, -3, 5.05, -3); c.box('vidro', 11.4, 10.6, .12, -3, 6.0, 3.05); c.box('vidro', .12, 10.6, 11.4, 3.05, 6.0, -3);
  for (let i = 0; i <= 11; i++) { c.box('metalP', .16, 11.6, .55, -8.5 + i, 5.5, 3.32); c.box('metalP', .55, 11.6, .16, 3.32, 5.5, -8.5 + i); }
  // bloco em balanço
  c.box('conc', 12, 3.6, 8, 4, 9, 5.2); c.box('vidroT', 11.4, 2.2, .1, 4, 9.7, 9.25); c.box('gTur', 12.1, .1, .1, 4, 8.95, 9.28); for (let i = 0; i <= 8; i++) c.box('metalP', .08, 2.3, .14, -1.7 + i * 1.425, 8.6 + .1, 9.3); c.cyl('aco', .2, .2, 8.8, 8.8, .25, 8.4, 10); c.cyl('aco', .2, .2, 8.8, -.6, .25, 8.4, 10);
  // cobertura: energia e ventilação passiva
  c.box('conc', 12.4, .3, 12.4, -3, 17.55, -3); pvArray(c, -3, 17.85, -3, 9.4, 8.4, 4, 3, .32);
  [[-7.5, -7.5], [-5.2, -7.5], [-7.5, -5.2]].forEach(([x, z]) => { c.cyl('concE', .55, .85, 3.4, x, 17.85, z, 12); c.cyl('metalP', .95, .95, .18, x, 21.25, z, 12); });
  parapet(c, 12.4, 12.4, -3, 17.85, -3, .2, .5, 'conc');
  // jardins verticais e janelas do embasamento
  [-9.5, 9.5].forEach(x => { winF(c, x, 1.0, hd, 1.4, 2.4, 0, {}); });
  [-5, 0, 5].forEach(z => { winF(c, hw, 1.2, z, 2.2, 2.2, PI / 2, { shade: .5 }); winF(c, -hw, 1.2, z, 2.2, 2.2, -PI / 2, { shade: .5 }); });
  doorF(c, 0, .25, hd + .05, 3.2, 3.0, 0, { glass: true, fr: 'metalP' }); c.box('conc', 5, .14, 2.6, 0, .25, hd + 1.4); sign(c, 'CENTRO DE INOVAÇÃO\nE TECNOLOGIA', 0, 3.55, hd + .3, 7, .9, 0);
  c.box('concE', 6.6, .3, 2.4, 0, 3.4, hd + 1.2); c.cyl('aco', .08, .08, 3.2, -3.1, .25, hd + 2.3, 8); c.cyl('aco', .08, .08, 3.2, 3.1, .25, hd + 2.3, 8);
  planterBox(c, -7, hd + 2.4, 4, 1.2); planterBox(c, 7, hd + 2.4, 4, 1.2); tr(c, -10.5, hd + 5.5, 1); tr(c, 10.5, hd + 5.5, 1);
  return { W: 22, D: 22, fd: D, H: 22, doors: [[0, hd + 3.0, 'inovacao']], lbl: 22, sign: 'CENTRO DE\nINOVAÇÃO' };
}

function bEscola(c) {
  const W = 24, D = 24, hw = W / 2, hd = D / 2;
  c.box('praca', 16.4, .08, 16.4, 0, 0, 4); c.box('pedra', W + 1.6, .2, 8.8, 0, 0, -8);
  // ala dos fundos (dois pavimentos)
  c.box('tijolo', W, 3.6, 8, 0, .2, -8); c.box('rebocoB', W, 3.4, 8, 0, 3.8, -8); c.col(0, -8, W, 8);
  for (let x = -9; x <= 9; x += 3) { winF(c, x, 1.0, -4, 1.7, 1.6, 0, { shade: .45 }); winF(c, x, 4.6, -4, 1.7, 1.6, 0, { shade: .45 }); }
  c.box('madeiraC', W, .25, .6, 0, 3.5, -3.4); // marquise do pavimento
  for (let x = -11; x <= 11; x += 2.75) c.cyl('madeiraC', .1, .1, 3.5, x, .2, -3.2, 8);
  // asas laterais (um pavimento, galeria para o pátio)
  [-1, 1].forEach(sg => { const x = sg * 10; c.box('tijolo', 4, 3.6, 16, x, .2, 4); c.col(x, 4, 4, 16);
    c.box('telhaM', 6.4, .2, 17.6, sg * 9.6, 3.9, 4, 0, 0, sg * .1); for (let z = -2; z <= 11.5; z += 3.2) c.cyl('madeiraC', .12, .12, 3.5, sg * 7.4, .2, z, 8);
    for (let z = 0; z <= 11; z += 3.5) winF(c, sg * 8, 1.0, z, 1.4, 1.5, sg * PI / 2 * -1, { shade: .4 }); });
  // telhado borboleta dos fundos, captação e cisternas
  c.box('telhaM', 13.2, .2, 9.4, -6.4, 7.6, -8, 0, 0, .09); c.box('telhaM', 13.2, .2, 9.4, 6.4, 7.6, -8, 0, 0, -.09); c.box('aco', .4, .35, 9.4, 0, 7.2, -8);
  c.cyl('aco', 1.5, 1.5, 3.4, -9.5, .2, -12.6, 16); c.cyl('aco', 1.5, 1.5, 3.4, 9.5, .2, -12.6, 16);
  doorF(c, 0, .2, -4, 3.4, 2.9, 0, { glass: true, fr: 'madeiraC' }); c.box('madeiraC', 7, .22, 3.2, 0, 3.4, -2.4); [-3.2, 3.2].forEach(x => c.cyl('madeiraC', .12, .12, 3.3, x, .2, -1));
  // pátio: árvore, canteiros da horta pedagógica e bancos
  tr(c, 0, 4.5, 1.7); planterBox(c, -5, 8.2, 3.4, 1.2); planterBox(c, 5, 8.2, 3.4, 1.2); planterBox(c, -5.5, 1.4, 2.6, 1.2); planterBox(c, 5.5, 1.4, 2.6, 1.2);
  bench(c, -2.6, 4.5, PI / 2); bench(c, 2.6, 4.5, -PI / 2);
  // portal de entrada com letreiro
  c.box('madeiraE', .5, 4.4, .5, -8.2, .2, hd + .6); c.box('madeiraE', .5, 4.4, .5, 8.2, .2, hd + .6); c.box('madeiraE', 17.4, .6, .5, 0, 4.0, hd + .6); sign(c, 'ESCOLA DO FUTURO', 0, 3.95, hd + .86, 8.8, .72, 0);
  c.col(-8.2, hd + .6, .5, .5); c.col(8.2, hd + .6, .5, .5);
  tr(c, -12.8, hd + 4, 1.2); tr(c, 12.8, hd + 4, 1.2); tr(c, 6, hd + 7, 1, { ipe: true });
  ROADS.access.push({ a: c.w2(0, -4.2), b: c.w2(0, 12.2), w: 16.4, landscape: true });
  return { W: 26, D: 26, fd: D, H: 8.2, doors: [[0, -4 + 2.6, 'escola']], lbl: 8.5, sign: 'ESCOLA DO\nFUTURO', pcx: 0, pcz: -2 };
}

