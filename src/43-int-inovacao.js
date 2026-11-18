/* ============================================================
   INTERIOR — Centro de Inovação e Tecnologia
   Térreo: recepção/exposição, átrio de colaboração (pé-direito duplo),
   robótica, fabricação digital, energia renovável, materiais sustentáveis.
   Pavimento superior: laboratório de agricultura e água + terraço experimental.
   ============================================================ */
INT.inovacao = I => {
  I.name = 'Centro de Inovação e Tecnologia'; I.H = 4.2; I.lvY = [0, 4.6]; const o = { dh: 3.0, th: .3 };
  const hall = I.room('Recepção e exposição', -7, 5, 7, 13, { f: 'pConc', tint: 'gBranco', lights: [[-3.5, 9], [3.5, 9]], lc: 0xE6F0FF });
  const atr = I.room('Átrio · Colaboração entre pesquisadores', -7, -13, 7, 5, { f: 'pMad', h: 8.8, lights: [[0, 0], [0, -8]], li: 1.25, ld: 17, lc: 0xFFEBD0 });
  const rob = I.room('Laboratório de robótica', -15, 0, -7, 13, { f: 'pConc', tint: 'gBranco', lc: 0xE6F0FF }), fab = I.room('Oficina de fabricação digital', -15, -13, -7, 0, { f: 'pConc', tint: 'gBranco', lc: 0xE6F0FF });
  const ene = I.room('Laboratório de energia renovável', 7, 0, 15, 13, { f: 'pConc', tint: 'gBranco', lc: 0xE6F0FF }), mat = I.room('Pesquisa em materiais sustentáveis', 7, -13, 15, 0, { f: 'pConc', tint: 'gBranco', lc: 0xFFF0D8 });
  const agr = I.room('Tecnologias para agricultura e água', -15, -13, -7, 13, { lv: 1, f: 'pConc', tint: 'gVerde', lights: [[-11, 6], [-11, -4]], lc: 0xE4FFE8 });
  const mez = I.room('Mezanino', -7, -13, 7, -10, { lv: 1, f: 'pMad', noCeil: true });
  const ter = I.room('Terraço experimental', 7, -13, 15, 13, { lv: 1, f: 'pConc', noCeil: true }); I.sky(0, 0);
  // perímetro (térreo)
  I.wx(13, -15, 15, { ...o, doors: [[0, 4.4, 3.2]], wins: [[-11, 3, 1, 3.4], [-4.5, 2.4, 1.2, 3.4], [4.5, 2.4, 1.2, 3.4], [11, 3, 1, 3.4]] });
  I.wx(-13, -15, 15, { ...o, wins: [[-11, 3, 1, 3.4], [-3.5, 3, 1, 3.4], [3.5, 3, 1, 3.4], [11, 3, 1, 3.4]] });
  I.wz(-15, -13, 13, { ...o, wins: [[-9, 2.6, 1, 3.4], [-3, 2.6, 1, 3.4], [4, 2.6, 1, 3.4], [10, 2.6, 1, 3.4]] }); I.wz(15, -13, 13, { ...o, wins: [[-9, 2.6, 1, 3.4], [-3, 2.6, 1, 3.4], [4, 2.6, 1, 3.4], [10, 2.6, 1, 3.4]] });
  // divisórias (térreo)
  I.wx(0, -15, -7, o); I.wx(0, 7, 15, o); I.wx(5, -7, 7, { ...o, doors: [[0, 4.4, 3.2]] });
  I.wz(-7, -13, 13, { ...o, doors: [[9, 2.6], [2.5, 2.6], [-6, 2.6]] }); I.wz(7, -13, 13, { ...o, doors: [[9, 2.6], [2.5, 2.6], [-6, 2.6]] });
  // pavimento superior
  I.wx(5, -7, 7, { ...o, lv: 1, wins: [[-4, 3, 1, 3.4], [0, 3, 1, 3.4], [4, 3, 1, 3.4]] }); I.wx(-13, -15, 7, { ...o, lv: 1, wins: [[-11, 3, 1, 3.4], [-3.5, 3, 1, 3.4], [3.5, 3, 1, 3.4]] });
  I.wx(13, -15, -7, { ...o, lv: 1, wins: [[-11, 3, 1, 3.4]] }); I.wz(-15, -13, 13, { ...o, lv: 1, wins: [[-9, 2.6, 1, 3.4], [-3, 2.6, 1, 3.4], [4, 2.6, 1, 3.4], [10, 2.6, 1, 3.4]] });
  I.wz(-7, -13, 13, { ...o, lv: 1, doors: [[-11.5, 2.4]], wins: [[-6.5, 4, 1, 3.4], [0, 4, 1, 3.4], [7.5, 3, 1, 3.4], [11, 3, 1, 3.4]] }); I.wz(7, -13, 5, { ...o, lv: 1, doors: [[-11.5, 2.4]] }); I.wz(7, 5, 13, { ...o, lv: 1, h: 1.2 });
  I.wx(-13, 7, 15, { ...o, lv: 1, h: 1.2 }); I.wx(13, 7, 15, { ...o, lv: 1, h: 1.2 }); I.wz(15, -13, 13, { ...o, lv: 1, h: 1.2 });
  I.band(hall, 'gTur', 3.7, .1); I.band(rob, 'gTur', 3.7, .08); I.band(fab, 'gTerra', 3.7, .08); I.band(ene, 'gVerde', 3.7, .08); I.band(mat, 'gOuro', 3.7, .08);
  I.exitAt(0, 12.2, 1.8).spawnAt(0, 11.6, 0);
  // escada para o mezanino (sobe para o norte) e guarda-corpo do mezanino
  I.stairs(-6.6, -10, -4.8, -2.7, 'n', 0, { m: 'pEsc' }); I.col(-4.6, -10.14, 7, -10, 1); I.col(-7, -10.14, -6.7, -10, 1);
  I.C.box('vidro', 11.5, 1.0, .04, 1.3, 4.6, -10.04); I.C.box('metalP', 11.5, .05, .06, 1.3, 5.6, -10.04);

  /* ---- Recepção e exposição ---- */
  I.counter(-4.6, 7.2, 4, .8, 0, 'madeiraE'); I.plaque('RECEPÇÃO', 'Centro de pesquisa aberto à comunidade. Visitas livres.', -4.6, 1.15, 5.18, 0, 1.9, .6); I.hot('inov_recepcao', -4.6, 8.6, 1.5);
  I.table(4, 8.6, 3.2, 1.8, .9, 0, 'conc');
  { const y = .9; I.C.box('verde', 3.0, .02, 1.6, 4, y, 8.6); [[3, 8.1, 'terra'], [3.6, 8.9, 'ocre'], [4.3, 8.2, 'rebocoO'], [4.9, 8.9, 'terra'], [3.3, 9.3, 'rebocoB'], [4.8, 8.2, 'rebocoV']].forEach(([x, z, m]) => I.C.box(m, .3, .18 + (x * 7 % 3) * .05, .26, x, y + .02, z)); I.turbineModel(4.1, y + .02, 8.6, 1); I.C.box('pv', .7, .02, .4, 3.2, y + .16, 8.8, 0, -.45); }
  I.hot('inov_maquete', 4, 8.6, 1.4, { up: .1 }); I.plaque('MICRORREDE (MAQUETE)', 'Como a energia circula entre os prédios.', 4, .95, 7.62, 0, 1.4, .4, { fs: 14 });
  I.screen(6.82, 1.5, 11.4, -PI / 2, 2.0, 1.1, 'PAINEL DA VILA (SIMULADO)', 'Números ilustrativos, não são medições reais.'); I.plant(-6.2, 12.2, 1.2); I.plant(6.2, 12.2, 1.2);
  I.seat(-3.5, 11.6, 2.2); I.banner(-6.82, 9.5, 'gTur', PI / 2, .6, 3.2);

  /* ---- Átrio · colaboração ---- */
  I.roundTable(2.5, -2, 1.5, 8); I.plaque('MURAL DE IDEIAS', 'Quem passa pode deixar uma pergunta ou uma proposta.', 6.82, 1.4, -3.5, -PI / 2, 2.4, 1.3);
  for (let k = 0; k < 14; k++) I.C.box(['gOuro', 'gTur', 'gTerra', 'gVerde'][k % 4], .22, .22, .02, 6.8, 2.2 + Math.floor(k / 4) * .3, -2.4 - (k % 4) * .55 - (k % 3) * .02, -PI / 2);
  I.hot('inov_colab', 2.5, -2, 1.6, { r: 3.6 });
  I.sofa(-2.6, -8.4, 2.4, 0, 'tecidoT'); I.sofa(1.2, -8.4, 2.4, 0, 'tecidoO'); I.table(-.7, -6.5, 1.2, .8, .45, 0); I.plant(-6.2, -12.2, 1.4); I.plant(6.2, -12.2, 1.4); I.plant(6.2, 3.6, 1.2);
  I.geo('gTur', new T.TorusGeometry(2.2, .04, 6, 48), 0, 6.8, -2, 0, PI / 2); I.geo('gOuro', new T.TorusGeometry(1.5, .03, 6, 48), 0, 6.3, -2, 0, PI / 2);
  I.band(atr, 'friso', 3.7, .5);

  /* ---- Robótica ---- */
  I.bench(-11, 8.6, 3.4, .9); I.robotArm(-12, .83, 8.6, 1.1); I.desk(-14.3, 6.6, 1.4, PI / 2); I.desk(-14.3, 4.2, 1.4, PI / 2);
  I.rug(-10.5, 3.6, 4.4, 3.2, 'azul'); I.box('branco', .5, .16, .36, -10.5, .14, 3.6); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => I.cyl('preto', .06, .06, .04, -10.5 + a * .2, .02, 3.6 + b * .15, false, 10)); I.sph('gTur', .06, -10.5, .36, 3.6);
  I.shelf(-7.4, 11.5, 1.8, -PI / 2, 4, 2.0, 0, false); I.hot('inov_robotica', -11, 6.4, 1.5, { r: 3.4 }); I.plaque('ROBÓTICA', 'Máquinas que ajudam em tarefas pesadas e repetitivas.', -14.82, 1.4, 11, PI / 2, 1.8, .6);
  I.plant(-14.2, 1.2, 1);

  /* ---- Fabricação digital ---- */
  I.bench(-12.6, -3, 3.2, .9); I.printer3d(-13.6, .83, -3); I.printer3d(-12.4, .83, -3); I.printer3d(-11.2, .83, -3); I.bench(-10.2, -9.5, 2.8, 1.1, PI / 2); I.box('aco', 1.0, .5, 1.4, -10.2, .83, -9.5); I.box('gTerra', .8, .02, .02, -10.2, 1.2, -9.5);
  I.bench(-13, -9.8, 2.6, .9, 0); I.box('metalP', 1.1, .35, .7, -13, .83, -9.8); I.box('gTerra', .6, .01, .02, -13, 1.1, -9.8); I.shelf(-14.6, -6, 2.4, PI / 2, 4, 2.0, 0, false);
  for (let k = 0; k < 8; k++) I.box(['terra', 'gTur', 'branco', 'gOuro'][k % 4], .18, .18 + (k % 3) * .06, .18, -14.65, .5 + (k % 4) * .5, -7.1 + k * .28);
  I.hot('inov_fabricacao', -11.5, -5.5, 1.5, { r: 3.4 }); I.plaque('FABRICAÇÃO DIGITAL', 'Impressoras 3D, corte a laser e fresadora.', -14.82, 1.4, -11, PI / 2, 1.8, .6); I.plant(-7.8, -.8, .9);

  /* ---- Energia renovável ---- */
  [1.6, 2.9, 4.2].forEach(zz => { I.box('branco', .6, 2.2, 1.1, 14.5, 0, zz, 0, true); I.box('gVerde', .02, .06, .9, 14.19, 1.8, zz); I.box('gVerde', .02, .06, .9, 14.19, 1.5, zz); });
  I.bench(10.6, 8.4, 3.0, 1.0); I.C.box('pv', 1.0, .03, .7, 10.2, .9, 8.4, 0, -.5); I.turbineModel(11.4, .83, 8.4, 1.1);
  I.screen(14.82, 1.4, 8.5, -PI / 2, 2.2, 1.1, 'GERAÇÃO × CONSUMO (SIMULADO)', 'Sol, vento e baterias em equilíbrio.');
  I.box('metalP', .7, 1.0, 1.6, 12.4, 0, 1.2, 0, true); I.box('gVerde', .02, .05, 1.2, 12.04, .7, 1.2); I.box('gOuro', .02, .05, 1.2, 12.04, .55, 1.2);
  I.hot('inov_energia', 10.8, 6.0, 1.6, { r: 3.4 }); I.plaque('ENERGIA RENOVÁVEL', 'Sol, vento e armazenamento.', 7.18, 1.45, 4.8, PI / 2, 1.5, .6); I.plant(14.2, 1.1, 1);

  /* ---- Materiais sustentáveis ---- */
  I.sampleWall(14.8, 1.0, -6, -PI / 2, ['terra', 'tijolo', 'palha', 'madeira', 'ocre', 'conc', 'cobre', 'areia', 'marrom', 'rebocoO', 'madeiraC', 'pedra'], 4, .5);
  I.bench(10.2, -4.4, 3.0, 1.0); [0, 1, 2, 3].forEach(k => I.box('terra', .28, .14, .14, 9.3 + k * .45, .83, -4.4)); I.box('metalP', .6, .9, .5, 12.0, .83, -4.4);
  for (let k = 0; k < 7; k++) I.cyl('palha', .07, .07, 2.2, 9 + k * .16, 0, -10.8, false, 8); I.box('madeiraE', 1.3, .1, .4, 9.55, 0, -10.8, 0, true);
  I.table(11.6, -8.6, 2.0, 1.0, .85, 0, 'conc'); [0, 1, 2].forEach(k => I.box(['terra', 'tijolo', 'ocre'][k], .3, .2, .15, 11 + k * .5, .85, -8.6)); I.hot('inov_materiais', 10.8, -6.4, 1.5, { r: 3.4 });
  I.plaque('MATERIAIS SUSTENTÁVEIS', 'Terra, bambu, madeira certificada e reaproveitados.', 7.18, 1.45, -6, PI / 2, 1.7, .62); I.plant(14.2, -12.1, 1);

  /* ---- Mezanino ---- */
  I.seat(-2, -11.6, 2.2, 0, 1); I.seat(3, -11.6, 2.2, 0, 1); I.plant(6.2, -12.2, 1, 1); I.plaque('MEZANINO', 'Vista do átrio e acesso ao laboratório de agricultura e ao terraço.', 0, 1.6, -12.82, 0, 2.8, .5, { lv: 1, fs: 16 });
  I.C.box('branco', 1, .01, 1, 0, 4.6, -12.8);

  /* ---- Laboratório de agricultura e água (pavimento superior) ---- */
  { const L = 1;
    for (let k = 0; k < 3; k++) I.growRack(-14.5, 6.6 + k * 2.2, 1.9, PI / 2, L, k % 2 ? 'fC' : 'fB');
    I.bench(-10.4, 8.6, 3.2, 1.0, 0, L); I.monitor(-10.9, .95, 8.6, 0, .6, L); I.tank(-8.2, 10.9, .8, 1.5, L, 'aco'); I.limb('metalP', -8.2, 5.7, -8.2, 6.2, .1, 10.9, L); I.limb('azul', -8.2, 6.2, -10.4, 6.2, .06, 10.9, L);
    I.bed(-10.8, 2.0, 3.0, 1.0, L, .55, 'fA', true); I.bed(-10.8, -.4, 3.0, 1.0, L, .55, 'fB', true); I.table(-10.5, -5.0, 2.6, .9, .85, 0, 'conc', L); [0, 1, 2].forEach(k => { I.cyl('vidro', .07, .07, .22, -11.3 + k * .5, .9, -5.0, false, 10, L); });
    I.screen(-14.82, 1.5, -2, PI / 2, 2.2, 1.1, 'SENSORES DE SOLO (SIMULADO)', 'Umidade, temperatura e nutrientes.', { lv: L }); I.hot('inov_agro', -10.8, 4.0, 1.5, { lv: L, r: 3.6 });
    I.plaque('AGRICULTURA E ÁGUA', 'Plantar bem usando menos água.', -7.18, 1.45, 1.5, -PI / 2, 1.8, .6, { lv: L }); I.plant(-14.2, -11.8, 1.1, L); }

  /* ---- Terraço experimental ---- */
  { const L = 1; I.bed(11, 8.6, 4.4, 1.2, L, .55, 'fB', true); I.bed(11, 6.0, 4.4, 1.2, L, .55, 'fC', true); I.bed(11, 3.4, 4.4, 1.2, L, .55, 'fA', false);
    I.C.cyl('metalP', .03, .04, 3.0, 13.8, 4.6, -9.5, 8); [0, 1, 2].forEach(k => { I.C.box('gOuro', .1, .05, .05, 13.8 + Math.sin(k * 2.09) * .22, 7.5, -9.5 + Math.cos(k * 2.09) * .22, k * 2.09); }); I.C.box('branco', .22, .14, .1, 13.8, 7.0, -9.5);
    for (let k = 0; k < 4; k++) I.C.box('pv', 1.7, .05, 1.0, 9 + k * 1.8, 5.3, -4.6, 0, -.45); I.tank(14.2, -11.8, .9, 1.6, L, 'aco'); I.tank(14.2, -9.8, .9, 1.6, L, 'aco'); I.cyl('terra', .5, .4, .6, 10, 0, -11.5, true, 14, L);
    I.hot('inov_terraco', 11, -.6, 1.6, { lv: L, r: 4.0 }); I.plaque('TERRAÇO EXPERIMENTAL', 'Teste ao ar livre: canteiros, painéis solares e cisternas.', 8.6, .9, 11.6, PI, 2.4, .5, { lv: L, fs: 15 }); I.C.box('madeiraE', 2.4, .5, .12, 8.6, 5.2 + .2, 12.7, PI); }
};
