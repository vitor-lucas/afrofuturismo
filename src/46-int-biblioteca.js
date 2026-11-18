/* ============================================================
   INTERIOR — Biblioteca Sankoré
   Salão de leitura e acervo, cantos digitais, sala de histórias,
   estúdio de memórias orais e sala de memória (inspirada em Timbuktu).
   Os manuscritos são páginas estilizadas, sem texto real.
   ============================================================ */
IB.prototype.manuscript = function (x, y, z, ry = 0, s = 1) { // livro aberto estilizado (sem texto)
  const c = this.C.sub(x, y, z, ry);
  c.box('madeiraE', .56 * s, .03 * s, .38 * s, 0, 0, 0); c.box('papel', .26 * s, .03 * s, .34 * s, -.14 * s, .03 * s, 0, 0, 0, .06); c.box('papel', .26 * s, .03 * s, .34 * s, .14 * s, .03 * s, 0, 0, 0, -.06);
  for (let i = 0; i < 5; i++) { c.box('preto', .2 * s, .004, .014 * s, -.14 * s, .066 * s, (i - 2) * .06 * s); c.box('preto', .2 * s, .004, .014 * s, .14 * s, .066 * s, (i - 2) * .06 * s); }
  return this;
};
INT.biblioteca = I => {
  I.name = 'Biblioteca Sankoré'; I.H = 5.2; const o = { dh: 3.2, th: .3 };
  const hall = I.room('Salão de leitura e acervo', -10, -2, 10, 12, { f: 'pMad', lights: [[-5, 3], [5, 3], [-5, 9], [5, 9]], lc: 0xFFE6BE, li: 1.1, ld: 16 });
  const his = I.room('Sala de histórias', -10, -12, -2, -2, { f: 'pMad', h: 3.8, lc: 0xFFD8A0 });
  const est = I.room('Estúdio de memórias orais', -2, -12, 4, -2, { f: 'pMad', h: 3.2, lc: 0xFFE6C8 });
  const mem = I.room('Sala de memória · inspirada em Timbuktu', 4, -12, 10, -2, { f: 'pPedra', h: 4.2, lc: 0xFFC27E, li: .9 });
  // perímetro
  I.wx(12, -10, 10, { ...o, doors: [[0, 3.6, 3.4]], wins: [[-6.5, 3, 3.0, 4.4], [6.5, 3, 3.0, 4.4]] });
  I.wz(-10, -2, 12, { ...o, wins: [[1, 3, 3.4, 4.9], [5, 3, 3.4, 4.9], [9, 3, 3.4, 4.9]] }); I.wz(10, -2, 12, { ...o, wins: [[1, 3, 3.4, 4.9], [5, 3, 3.4, 4.9], [9, 3, 3.4, 4.9]] });
  I.wz(-10, -12, -2, { ...o, wins: [[-4.5, 1.6, 1.5, 2.8]] }); I.wz(10, -12, -2, o); I.wx(-12, -10, 10, { ...o, wins: [[-6, 2.4, 1.5, 2.8], [1, 2.4, 1.5, 2.8], [7, .9, 2.4, 3.6]] });
  // divisórias
  I.wx(-2, -10, 10, { ...o, doors: [[-6, 2.4], [1, 2.4], [7, 2.4]] }); I.wz(-2, -12, -2, { ...o, doors: [[-7, 2.2]] }); I.wz(4, -12, -2, { ...o, doors: [[-7, 2.2]] });
  I.band(hall, 'friso', 4.95, .2); I.band(his, 'kente', 3.35, .3); I.band(mem, 'mud', 3.7, .35);
  I.exitAt(0, 11.2, 1.8).spawnAt(0, 10.4, 0);

  /* ---- salão de leitura e acervo ---- */
  [0.9, 3.4, 5.9, 8.4].forEach(z => { I.shelf(-9.68, z, 2.4, PI / 2, 6, 2.6); I.shelf(9.68, z, 2.4, -PI / 2, 6, 2.6); });
  [-4.3, 4.3].forEach(sx => [1.6, 4.2, 6.8].forEach(z => { I.shelf(sx + .18, z, 2.4, PI / 2, 6, 2.2); I.shelf(sx - .18, z, 2.4, -PI / 2, 6, 2.2); }));
  [3.4, 6.6].forEach(tz => { I.table(0, tz, 4.4, 1.1, .75, 0, 'madeira'); [-1.5, -.5, .5, 1.5].forEach(k => { I.chair(k, tz - .85, 0); I.chair(k, tz + .85, PI); }); [-1.4, 1.4].forEach(k => I.C.box('gLuz', .5, .04, .22, k, .75, tz)); });
  [[-4, 3.4], [4, 3.4], [-4, 6.6], [4, 6.6]].forEach(([x, z]) => { I.C.cyl('metalP', .012, .012, 1.1, x, 4.1, z, 6); I.C.cyl('gLuz', .38, .22, .16, x, 3.95, z, 14); });
  I.hot('bib_acervo', -8.3, 4.6, 1.6, { r: 3.4 }); I.hot('bib_leitura', 0, 5.0, 1.3, { r: 3.4 });
  // cantos digitais (lado oeste da entrada)
  [-7.6, -5.0].forEach(x => { I.table(x, 9.8, 1.8, .8, .75, 0, 'madeiraE'); I.monitor(x - .4, .92, 9.62, 0, .6, 0, 'gAzul'); I.monitor(x + .4, .92, 9.62, 0, .6, 0, 'gTur'); I.chair(x - .4, 10.55, PI); I.chair(x + .4, 10.55, PI); });
  I.hot('bib_digital', -6.3, 9.0, 1.5, { r: 3.2 });
  I.plaque('BIBLIOTECA SANKORÉ', 'Entrada livre. Empréstimo gratuito com o cartão da vila.', -6.3, 2.0, 11.82, PI, 3.0, .8, { fs: 17 });
  // balcão de empréstimo (lado leste da entrada)
  I.counter(6.5, 11.1, 3.6, .8, 0, 'madeiraE'); I.plaque('EMPRÉSTIMO E INFORMAÇÕES', 'Peça ajuda para achar um livro ou começar uma pesquisa.', 6.5, 1.7, 11.82, PI, 2.8, .7, { fs: 15 }); I.hot('bib_entrada', 6.5, 9.8, 1.5, { r: 3.2 });
  I.plant(-9.2, 11.2, 1.4); I.plant(9.2, 11.2, 1.4); I.plant(-2.6, 11.3, 1.1); I.plant(2.6, 11.3, 1.1);
  I.plaque('AUTORIAS NEGRAS E INDÍGENAS À ALTURA DOS OLHOS', '', 0, 2.65, -1.82, 0, 5.2, .5, { fs: 14 });

  /* ---- sala de histórias ---- */
  I.cyl('tecidoV', 2.7, 2.7, .02, -6, 0, -7.2, false, 32); I.cyl('tecidoO', 1.9, 1.9, .03, -6, 0, -7.2, false, 32); I.cyl('friso', 1.1, 1.1, .04, -6, 0, -7.2, false, 32);
  I.cyl('madeiraE', .24, .2, .5, -6, .04, -7.2, true, 14); I.cyl('kente', .26, .26, .06, -6, .54, -7.2, false, 14);
  for (let k = 0; k < 9; k++) { const a = k * Math.PI * 2 / 9; I.cyl(['tecidoT', 'tecidoO', 'tecidoV', 'vermelho', 'azul'][k % 5], .3, .3, .16, -6 + Math.sin(a) * 2.1, .04, -7.2 + Math.cos(a) * 2.1, false, 14); }
  I.art(-9.82, 1.9, -7.2, PI / 2, 4.2, 2.6, 7, 0); I.plaque('ÁRVORE DAS HISTÓRIAS', 'Pintura inspirada na ideia de contar em roda, sob uma árvore.', -9.8, .75, -7.2, PI / 2, 3.2, .5, { fs: 14 });
  [-8.4, -5.8, -3.6].forEach(x => I.shelf(x, -11.68, 2.0, 0, 3, 1.3));
  I.plaque('SALA DE HISTÓRIAS', 'Livros para crianças e rodas de contação.', -3.4, 1.9, -2.18, PI, 1.8, .6, { fs: 14 }); I.hot('bib_historias', -6, -7.2, 1.3, { r: 3.8 });
  I.plant(-9.2, -2.9, 1.1);

  /* ---- estúdio de memórias orais ---- */
  [[-1.85, -10.4, PI / 2], [-1.85, -4.6, PI / 2]].forEach(([x, z, ry]) => I.C.box('tecidoT', .08, 1.5, 1.4, x + .1, 1.1, z));
  [[0.2, -11.85], [1.9, -11.85]].forEach(([x, z]) => I.C.box('tecidoT', 1.3, 1.1, .08, x, 1.4, z + .1));
  I.table(1, -7, .9, .9, .45, 0, 'madeiraE'); I.chair(-.3, -7, PI / 2); I.chair(2.3, -7, -PI / 2);
  I.C.cyl('preto', .1, .1, .02, 1, .45, -7, 12); I.C.cyl('metalP', .012, .012, .24, 1, .47, -7, 6); I.C.sph('preto', .04, 1, .73, -7, 1, 1.4, 1, 8); I.C.box('preto', .22, .04, .14, .7, .45, -6.8); I.C.box('gVerde', .03, .01, .03, .64, .49, -6.8);
  I.screen(1, 1.9, -11.8, 0, 2.2, 1.0, 'MEMÓRIAS DA VILA (EXEMPLO)', 'Trechos de entrevistas simulados para a visita.');
  I.plaque('ESTÚDIO DE MEMÓRIAS ORAIS', 'Grave a história de quem mora aqui, com autorização.', -.4, 1.9, -2.18, PI, 1.8, .7, { fs: 14 }); I.hot('bib_estudio', 1, -7, 1.3, { r: 3.4 });
  I.C.box('gTerra', .8, .12, .04, 3.8, 2.75, -7, PI / 2);

  /* ---- sala de memória ---- */
  [5.6, 7, 8.4].forEach((x, i) => { I.vitrine(x, -10.4, 1.2, .8, 1.0); I.manuscript(x, 1.02, -10.4, 0, 1.2); I.C.box('ouro', .5, .004, .01, x, 1.045, -10.1); });
  I.pedestal(7, -5.4, .9, 1.0); I.manuscript(7, 1.03, -5.4, 0, 1.3); I.C.cyl('gOuro', .015, .015, .5, 7, 1.04, -5.7, 6);
  I.pattern(9.82, 1.5, -7, -PI / 2, 3.4, 2.2, 'mud'); I.hot('bib_memoria', 7, -7.4, 1.4, { r: 3.8 }); I.hot('bib_manuscritos', 7, -9.2, 1.5, { r: 2.6 });
  I.plaque('SALA DE MEMÓRIA', 'Páginas estilizadas, sem texto real, em homenagem aos manuscritos de Timbuktu.', 4.18, 1.7, -3.9, PI / 2, 1.8, .9, { fs: 13 });
  I.plaque('MANUSCRITOS (REPRESENTAÇÕES)', 'Não são cópias de documentos reais.', 7, 1.9, -11.82, 0, 3.0, .5, { fs: 13 });
  [[4.6, -2.7], [9.4, -2.7]].forEach(([x, z]) => I.box('rebocoO', .4, 4.0, .4, x, 0, z, 0, true));
};
