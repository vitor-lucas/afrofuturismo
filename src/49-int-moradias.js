/* ============================================================
   INTERIORES — três tipologias de moradia
   Casa-pátio (térrea) · Sobrado com comércio (2 pavimentos) ·
   Bloco de vizinhança (2 pavimentos, espaços compartilhados).
   Os números dos medidores são simulados.
   ============================================================ */
const dgMeter = (g, W, H, title, sub, rows) => {
  dgBase(g, W, H, title, sub); g.textBaseline = 'middle';
  rows.forEach(([n, v, c, t], i) => { const y = H * .4 + i * H * .17; g.fillStyle = '#9FD6CC'; g.font = Math.round(H * .07) + 'px system-ui,sans-serif'; g.textAlign = 'left'; g.fillText(n, W * .04, y); g.fillStyle = '#23404C'; g.fillRect(W * .36, y - H * .04, W * .42, H * .08); g.fillStyle = c; g.fillRect(W * .36, y - H * .04, W * .42 * v, H * .08); g.fillStyle = '#F0D8A0'; g.fillText(t, W * .8, y); });
};

INT.casaPatio = I => {
  I.name = 'Casa-pátio'; I.H = 3.4; const o = { dh: 2.2, th: .25 };
  const L = (x, z, c = 0xFFE4BC, d = 10) => ({ lights: [[x, z]], lc: c, li: .95, ld: d });
  const sala = I.room('Sala de estar', -7.5, 2.5, -1.5, 7.5, { f: 'pMad', ...L(-4.5, 5) }), hall = I.room('Entrada', -1.5, 2.5, 1.5, 7.5, { f: 'pEsc', ...L(0, 5, 0xFFE8C8, 8) }), jan = I.room('Sala de jantar', 1.5, 2.5, 7.5, 7.5, { f: 'pMad', ...L(4.5, 5) });
  const q1 = I.room('Quarto 1', -7.5, -3, -2.5, 2.5, { f: 'pMad', ...L(-5, -.3, 0xFFE8D0, 9) }), q2 = I.room('Quarto 2', -7.5, -7.5, -2.5, -3, { f: 'pMad', ...L(-5, -5.3, 0xFFE8D0, 8) });
  const coz = I.room('Cozinha', 2.5, -3, 7.5, 2.5, { f: 'pConc', ...L(5, -.3, 0xFFF2DC, 9) }), ban = I.room('Banheiro e área de serviço', 2.5, -7.5, 7.5, -3, { f: 'pConc', ...L(5, -5.3, 0xF2F8FF, 8) });
  I.room('Pátio central', -2.5, -7.5, 2.5, 2.5, { f: 'pEsc', noCeil: true }); I.sky(0, -2);
  I.wx(7.5, -7.5, 7.5, { ...o, doors: [[0, 1.6, 2.3]], wins: [[-4.5, 1.6, 1.2, 2.4], [4.5, 1.6, 1.2, 2.4]] });
  I.wz(-7.5, -7.5, 7.5, { ...o, wins: [[-5.2, 1.2, 1.2, 2.4], [-.6, 1.2, 1.2, 2.4]] }); I.wz(7.5, -7.5, 7.5, { ...o, wins: [[-5.2, 1.2, 2.0, 2.8], [5, 1.6, 1.2, 2.4]] }); I.wx(-7.5, -7.5, 7.5, { ...o, wins: [[-5, 1.4, 2.0, 2.8], [5, 1.4, 2.0, 2.8]] });
  I.wz(-1.5, 2.5, 7.5, { ...o, doors: [[5, 2.2, 2.3]] }); I.wz(1.5, 2.5, 7.5, { ...o, doors: [[5, 2.2, 2.3]] });
  I.wx(2.5, -7.5, -1.5, { ...o, doors: [[-5, 1.1, 2.2]] }); I.wx(2.5, -1.5, 1.5, { ...o, doors: [[0, 1.8, 2.3]] }); I.wx(2.5, 1.5, 7.5, { ...o, doors: [[5, 2.4, 2.3]] });
  I.wx(-3, -7.5, -2.5, o); I.wx(-3, 2.5, 7.5, o);
  I.wz(-2.5, -7.5, 2.5, { ...o, doors: [[-.5, 1.5, 2.2], [-5.2, 1.5, 2.2]], wins: [[1.45, .9, 1.2, 2.2]] }); I.wz(2.5, -7.5, 2.5, { ...o, doors: [[-.5, 1.5, 2.2], [-5.2, 1.5, 2.2]], wins: [[1.45, .9, 1.2, 2.2]] });
  I.band(sala, 'friso', 3.0, .15); I.band(jan, 'friso', 3.0, .15);
  I.exitAt(0, 6.7, 1.8).spawnAt(0, 6.0, 0);

  /* sala de estar */
  I.sofa(-4.9, 6.85, 2.6, PI); I.table(-4.9, 5.0, 1.2, .6, .4, 0); I.rug(-4.9, 5.0, 3.4, 2.4, 'tecidoV'); I.sofa(-2.4, 3.35, .9, -PI / 2); I.shelf(-7.2, 4.6, 2.4, PI / 2, 4, 1.8); I.plant(-7.0, 7.0, 1.2);
  I.plaque('SALA DE ESTAR', 'Janelas e porta abertas para a sala, o pátio e a rua.', -3.0, 1.8, 2.68, 0, 1.8, .6, { fs: 14 }); I.hot('cp_sala', -4.9, 4.9, 1.3, { r: 3.4 });
  /* entrada e jantar */
  I.plant(1.0, 7.0, 1.2); I.rug(0, 5, 1.6, 3, 'tecidoO'); I.table(4.6, 5.0, 2.0, 1.0, .75, 0, 'madeira'); [3.9, 4.6, 5.3].forEach(x => { I.chair(x, 4.1, 0); I.chair(x, 5.9, PI); }); I.cabinet(7.15, 6.5, 1.6, .9, -PI / 2, 0, 'madeiraE', .45);
  I.C.cyl('metalP', .012, .012, .9, 4.6, 2.5, 5.0, 6); I.C.cyl('gLuz', .32, .2, .16, 4.6, 2.35, 5.0, 14);
  /* cozinha */
  I.kitchenRow(7.05, -.4, 4.0, -PI / 2); I.fridge(7.0, 2.0, -PI / 2); I.table(4.8, .4, 1.3, .9, .75, 0, 'madeira'); [4.5, 5.1].forEach(x => { I.chair(x, -.35, 0); I.chair(x, 1.15, PI); });
  I.diagram(4.4, 1.0, -2.85, 0, 2.8, 1.3, (g, W, H) => dgMeter(g, W, H, 'MEDIDOR DA CASA (SIMULADO)', 'Números inventados para a visita', [['Energia agora', .32, '#F0D27A', '0,4 kW'], ['Solar no telhado', .6, '#7FD1A8', '0,9 kW'], ['Água da cisterna', .55, '#5FB0E8', '55%']]), 0, .5);
  I.hot('cp_cozinha', 4.8, .9, 1.4, { r: 3.2 }); I.hot('cp_energia', 4.4, -2.2, 1.7, { r: 2.4 });
  /* quartos */
  I.bedF(-6.2, -.4, PI / 2, 0, 1.5); I.nightstand(-7.1, -1.5, PI / 2); I.nightstand(-7.1, .7, PI / 2); I.cabinet(-4.6, -2.55, 1.8, 2.0, 0, 0, 'madeiraE', .55); I.table(-3.6, 1.7, 1.2, .6, .75, 0); I.chair(-3.6, 1.15, 0); I.hot('cp_quarto', -5.2, .4, 1.3, { r: 3.6 });
  I.bedF(-5.4, -6.3, 0, 0, 1.5, 'tecidoO'); I.nightstand(-6.5, -7.1, 0); I.nightstand(-4.3, -7.1, 0); I.cabinet(-4.8, -3.4, 1.8, 2.0, PI, 0, 'madeiraE', .55);
  I.plaque('QUARTO 1', 'Janela alta e porta para o pátio: ventilação cruzada.', -4.3, 1.7, -2.5, PI / 2, 1.4, .5, { fs: 13 });
  /* banheiro e área de serviço */
  I.toilet(7.1, -4.2, -PI / 2); I.basin(7.1, -5.5, -PI / 2); I.shower(6.9, -6.9, 0); I.washer(3.3, -7.05, 0); I.plant(3.2, -3.6, 1.0); I.hot('cp_banheiro', 5.2, -5.2, 1.4, { r: 3.2 });
  /* pátio */
  I.treeIn(0, -3.2, .95); I.seat(-1.8, -3.2, 1.5, PI / 2); I.seat(1.8, -3.2, 1.5, -PI / 2); I.tank(-1.9, -6.8, .4, 1.3, 0, 'conc', true); I.C.cyl('metalP', .04, .04, 1.9, -1.9, 1.3, -7.3, 8); I.plant(1.9, -6.8, 1.3); I.plant(-1.8, 1.7, 1.1); I.plant(1.8, 1.7, 1.1);
  I.diagram(0, .9, -7.35, 0, 3.0, 1.9, (g, W, H) => {
    dgBase(g, W, H, 'POR QUE A CASA É FRESCA', 'Esquema didático · sem escala'); const gy = H * .88; g.fillStyle = '#5E8A47'; g.fillRect(0, gy, W, H - gy);
    g.fillStyle = '#C9A06A'; g.fillRect(W * .04, H * .4, W * .2, gy - H * .4); g.fillRect(W * .76, H * .4, W * .2, gy - H * .4); g.fillStyle = '#F5E6C8'; g.fillRect(W * .26, H * .4, W * .48, gy - H * .4); g.fillStyle = '#7A4B2A'; g.fillRect(W * .02, H * .36, W * .26, H * .05); g.fillRect(W * .72, H * .36, W * .26, H * .05);
    g.fillStyle = '#2F6B2F'; g.beginPath(); g.arc(W * .5, H * .5, H * .15, 0, 7); g.fill(); g.fillStyle = '#6B4A2C'; g.fillRect(W * .49, H * .6, W * .02, gy - H * .6);
    dgArrow(g, W * .12, H * .78, W * .3, H * .78, '#9FD6CC', 4); dgArrow(g, W * .7, H * .78, W * .88, H * .78, '#9FD6CC', 4); dgArrow(g, W * .15, H * .75, W * .15, H * .5, '#FF9A7A', 4); dgArrow(g, W * .85, H * .75, W * .85, H * .5, '#FF9A7A', 4);
    dgNote(g, W * .3, H * .22, 'Ar quente sobe e sai pelo alto', '#FF9A7A', 20); dgNote(g, W * .3, H * .9, 'Ar fresco entra pelas portas e janelas baixas', '#9FD6CC', 18); dgNote(g, W * .06, H * .27, 'Beiral dá sombra', '#F0D8A0', 18);
  }, 0, .45); I.hot('cp_ventilacao', 0, -6.2, 1.6, { r: 2.4 }); I.hot('cp_patio', 0, -1.5, 1.6, { r: 3.4 });
};

INT.sobrado = I => {
  I.name = 'Sobrado com comércio'; I.H = 3.2; I.lvY = [0, 3.5]; const o = { dh: 2.3, th: .25 }, u = { ...o, lv: 1 };
  const hall = I.room('Entrada da moradia e escada', -4, -6, -1.6, 6.4, { f: 'pEsc', ceilHole: [-3.45, .85, -1.75, 5.25], lights: [[-2.8, -3]], lc: 0xFFE8C8, li: .9, ld: 9 });
  const loja = I.room('Loja-ateliê (térreo)', -1.6, -6, 4, 6.4, { f: 'pMad', lights: [[1.2, 1.2]], lc: 0xFFE8C8, li: 1.0, ld: 11 });
  const sala = I.room('Sala de estar (2º andar)', -4, 1, 4, 5.2, { lv: 1, f: 'pMad', h: 3, hole: [-3.4, 1, -1.8, 5.2], lights: [[1.4, 3.1]], lc: 0xFFE4BC, li: .95, ld: 10 });
  I.room('Varanda', -4, 5.2, 4, 6.4, { lv: 1, f: 'pEsc', noCeil: true }); I.sky(0, 0);
  const coz = I.room('Cozinha (2º andar)', -4, -2, 1.6, 1, { lv: 1, f: 'pConc', h: 3, lights: [[-1.2, -.5]], lc: 0xFFF2DC, li: .9, ld: 8 }), ban = I.room('Banheiro (2º andar)', 1.6, -2, 4, 1, { lv: 1, f: 'pConc', h: 3, lights: false });
  const q1 = I.room('Quarto 1 (2º andar)', -4, -6, 0, -2, { lv: 1, f: 'pMad', h: 3, lights: [[-2, -4]], lc: 0xFFE8D0, li: .85, ld: 8 }), q2 = I.room('Quarto 2 (2º andar)', 0, -6, 4, -2, { lv: 1, f: 'pMad', h: 3, lights: [[2, -4]], lc: 0xFFE8D0, li: .85, ld: 8 });
  // paredes do térreo
  I.wx(6.4, -4, 4, { ...o, doors: [[-2.8, 1.1, 2.2], [1.6, 1.5, 2.3]], wins: [[3.1, 1.2, .9, 2.3]] }); I.wz(-4, -6, 6.4, { ...o, wins: [[-3.2, 1.0, 1.2, 2.3]] }); I.wz(4, -6, 6.4, { ...o, wins: [[0, 1.4, 1.2, 2.4], [-4, 1.2, 1.2, 2.4]] }); I.wx(-6, -4, 4, { ...o, wins: [[.5, 1.4, 1.2, 2.4]] });
  I.wz(-1.6, -6, 6.4, { ...o, doors: [[-3.2, 1.1, 2.2]] });
  // paredes do pavimento superior
  I.wx(-6, -4, 4, { ...u, wins: [[-2, 1.0, 1.4, 2.4], [2, 1.0, 1.2, 2.2]] }); I.wz(-4, -6, 5.2, { ...u, wins: [[-4, 1.0, 1.2, 2.2], [3.2, 1.4, 1.2, 2.4]] }); I.wz(4, -6, 5.2, { ...u, wins: [[-5.2, 1.0, 1.2, 2.2], [-.5, .8, 1.4, 2.2], [3.2, 1.4, 1.2, 2.4]] });
  I.wz(-4, 5.2, 6.4, { ...u, h: 1.1 }); I.wz(4, 5.2, 6.4, { ...u, h: 1.1 }); I.wx(5.2, -4, 4, { ...u, doors: [[0, 2.4, 2.3]] });
  I.wx(1, -4, 4, { ...u, doors: [[-2.6, 1.8, 2.3], [.2, 1.2, 2.3], [2.8, .9, 2.2]] }); I.wx(-2, -4, 4, { ...u, doors: [[-2, .9, 2.2], [.9, .9, 2.2]] }); I.wz(0, -6, -2, u); I.wz(1.6, -2, 1, u);
  I.exitAt(-.6, 6.0, 3.4).spawnAt(-2.6, 5.9, 0);
  I.stairs(-3.4, 1, -1.8, 5.2, 'n', 0, { m: 'pEsc' });
  // guarda-corpo da varanda
  I.C.box('metalP', 8, .05, .05, 0, 4.45, 6.35); for (let k = 0; k < 17; k++) I.C.box('metalP', .03, .95, .03, -3.9 + k * .49, 3.5, 6.35); I.col(-4, 6.3, 4, 6.45, 1);

  /* térreo: loja-ateliê */
  I.counter(3.2, .6, 2.8, .7, PI / 2, 'madeiraE'); I.plaque('ATELIÊ E LOJA', 'Costura, conserto e venda de panos e roupas.', 3.84, 1.9, .6, -PI / 2, 2.2, .6, { fs: 14 });
  I.rack(.8, -5.5, 2.4, 0); I.rack(-1.2, -.5, 2.4, PI / 2); I.table(1.2, 3.0, 1.6, .9, .8, 0, 'madeira'); ['tecidoV', 'tecidoO', 'tecidoT', 'kente'].forEach((m, i) => I.C.box(m, .5, .08 + i * .04, .35, .7 + (i % 2) * .5, .8, 2.85 + (i > 1 ? .35 : 0)));
  I.table(2.8, -4.6, 1.5, .8, .8, 0); I.chair(2.8, -3.95, PI); I.C.box('preto', .32, .22, .16, 2.5, .8, -4.6); I.C.box('metalP', .06, .2, .16, 2.4, 1.02, -4.6); I.C.cyl('tecidoV', .17, .12, .9, 3.2, 0, 4.9, 12); I.C.sph('areia', .12, 3.2, .98, 4.9, 1, 1.1, 1, 10); I.plant(-.8, 5.9, 1.2);
  I.hot('sob_loja', 1.2, .9, 1.5, { r: 4.2 });
  /* térreo: entrada e escada */
  I.plant(-3.4, -1.0, 1.1); I.plaque('ESCADA PARA A MORADIA', 'A entrada da casa é separada da loja.', -2.8, 1.7, -5.84, 0, 2.2, .6, { fs: 14 }); I.hot('sob_escada', -2.8, 5.6, 1.3, { r: 2.8 });
  /* sala de estar */
  I.sofa(3.4, 3.2, 2.4, -PI / 2); I.table(1.9, 3.2, .6, 1.1, .4, 0); I.rug(1.9, 3.2, 2.6, 3.2, 'tecidoV', 1); I.shelf(2.6, 4.95, 1.6, PI, 4, 1.8, 1); I.plant(-.9, 4.7, 1.2, 1); I.hot('sob_sala', 1.8, 3.2, 1.5, { r: 3.4, lv: 1 });
  I.plaque('SALA DE ESTAR', 'Luz e ar vêm da varanda e das janelas altas.', -.8, 1.9, 1.15, 0, 1.4, .5, { lv: 1, fs: 13 });
  /* varanda */
  I.plant(-3.4, 5.8, .9, 1); I.plant(3.4, 5.8, .9, 1); I.table(0, 5.8, .7, .5, .5, 0, 'madeiraE', 1); I.stool(-.6, 5.8, .45, 1); I.stool(.6, 5.8, .45, 1); I.hot('sob_varanda', 0, 5.8, 1.5, { r: 2.6, lv: 1 });
  /* cozinha */
  I.kitchenRow(-3.575, -.5, 2.6, PI / 2, 1); I.fridge(-2.9, -1.5, 0, 1); I.table(-.6, -.5, 1.1, .8, .75, 0, 'madeira', 1); [-1.0, -.2].forEach(x => { I.chair(x, -1.25, 0, 1); I.chair(x, .35, PI, 1); });
  I.diagram(1.45, 1.0, -.5, -PI / 2, 1.5, .95, (g, W, H) => dgMeter(g, W, H, 'MEDIDOR (SIMULADO)', 'Dados inventados', [['Energia', .3, '#F0D27A', '0,3 kW'], ['Água', .45, '#5FB0E8', '2 L/min']]), 1, .5); I.hot('sob_cozinha', -.9, -.5, 1.5, { r: 3.2, lv: 1 });
  /* quartos e banheiro */
  I.bedF(-2.4, -4.8, 0, 1, 1.5); I.nightstand(-3.4, -5.6, 0, 1); I.nightstand(-1.4, -5.6, 0, 1); I.cabinet(-3.6, -3.2, 1.6, 2.0, PI / 2, 1, 'madeiraE', .55); I.hot('sob_quarto', -2.2, -4.0, 1.4, { r: 3.2, lv: 1 });
  I.bedF(2.6, -4.8, 0, 1, 1.5, 'tecidoO'); I.nightstand(1.6, -5.6, 0, 1); I.nightstand(3.6, -5.6, 0, 1); I.cabinet(3.6, -3.2, 1.6, 2.0, -PI / 2, 1, 'madeiraE', .55);
  I.toilet(3.62, -1.4, -PI / 2, 1); I.basin(3.62, -.2, -PI / 2, 1); I.shower(2.0, -1.4, 0, 1); I.hot('sob_banheiro', 2.8, -.6, 1.4, { r: 2.0, lv: 1 });
};

INT.vizinhanca = I => {
  I.name = 'Bloco de vizinhança'; I.H = 3.4; I.lvY = [0, 3.7]; const o = { dh: 2.3, th: .25 }, u = { ...o, lv: 1 };
  const hall = I.room('Hall de entrada', -3, -2, 3, 8, { f: 'pEsc', ceilHole: [-.9, 2.45, .9, 7.45], lights: [[-1.7, 3], [1.7, 0]], lc: 0xFFE8C8, li: .85, ld: 9 });
  const sala = I.room('Sala comunitária', -9, -2, -3, 8, { f: 'pMad', lights: [[-6, 1.5], [-6, 5.5]], lc: 0xFFE4BC, li: .9, ld: 9 }), lav = I.room('Lavanderia compartilhada', 3, -2, 9, 8, { f: 'pConc', lights: [[6, 3]], lc: 0xF4F8FF, li: 1.0, ld: 12 });
  I.room('Pátio comunitário', -9, -8, 9, -2, { f: 'terraSolo', noCeil: true }); I.sky(0, -5);
  const hs = I.room('Hall superior e circulação aberta', -3, -2, 3, 8, { lv: 1, f: 'pEsc', h: 3, hole: [-.9, 2.5, .9, 7.4], lights: [[-1.8, 5], [1.8, 0]], lc: 0xFFE8C8, li: .85, ld: 9 });
  const sa = I.room('Apartamento A · sala e cozinha', -9, 2.6, -3, 8, { lv: 1, f: 'pMad', h: 3, lights: [[-6, 5.3]], lc: 0xFFE4BC, li: .9, ld: 9 }), qa = I.room('Apartamento A · quarto', -6.2, -2, -3, 2.6, { lv: 1, f: 'pMad', h: 3, lights: [[-4.6, .3]], lc: 0xFFE8D0, li: .8, ld: 7 }), ba = I.room('Apartamento A · banheiro', -9, -2, -6.2, 2.6, { lv: 1, f: 'pConc', h: 3, lights: false });
  const sb = I.room('Apartamento B · sala e cozinha', 3, 2.6, 9, 8, { lv: 1, f: 'pMad', h: 3, lights: [[6, 5.3]], lc: 0xFFE4BC, li: .9, ld: 9 }), qb = I.room('Apartamento B · quarto', 3, -2, 6.2, 2.6, { lv: 1, f: 'pMad', h: 3, lights: [[4.6, .3]], lc: 0xFFE8D0, li: .8, ld: 7 }), bb = I.room('Apartamento B · banheiro', 6.2, -2, 9, 2.6, { lv: 1, f: 'pConc', h: 3, lights: false });
  // térreo
  I.wx(8, -9, 9, { ...o, doors: [[0, 2.0, 2.3]], wins: [[-6, 1.6, 1.1, 2.4], [6, 1.6, 1.1, 2.4]] }); I.wz(-9, -2, 8, { ...o, wins: [[6.5, 1.2, 1.2, 2.4]] }); I.wz(9, -2, 8, { ...o, wins: [[6.5, 1.4, 1.2, 2.4], [1, 1.4, 1.2, 2.4]] });
  I.wz(-9, -8, -2, { ...o, h: 2.6 }); I.wz(9, -8, -2, { ...o, h: 2.6 }); I.wx(-8, -9, 9, { ...o, h: 2.6 });
  I.wz(-3, -2, 8, { ...o, doors: [[5, 1.6, 2.3]] }); I.wz(3, -2, 8, { ...o, doors: [[5, 1.6, 2.3]] }); I.wx(-2, -9, 9, { ...o, doors: [[-6, 1.6, 2.3], [0, 1.8, 2.3], [6, 1.6, 2.3]] });
  // pavimento superior
  I.wx(8, -9, 9, { ...u, wins: [[-6, 1.6, 1.1, 2.4], [0, 3.0, .9, 2.7], [6, 1.6, 1.1, 2.4]] }); I.wz(-9, -2, 8, { ...u, wins: [[5.3, 1.4, 1.2, 2.4], [.4, .8, 1.6, 2.4]] }); I.wz(9, -2, 8, { ...u, wins: [[5.3, 1.4, 1.2, 2.4], [.4, .8, 1.6, 2.4]] });
  I.wx(-2, -9, 9, { ...u, wins: [[-4.6, 1.2, 1.2, 2.4], [4.6, 1.2, 1.2, 2.4], [0, 3.0, 1.0, 2.5]] });
  I.wz(-3, -2, 8, { ...u, doors: [[5, 1.6, 2.3]] }); I.wz(3, -2, 8, { ...u, doors: [[5, 1.6, 2.3]] }); I.wx(2.6, -9, -3, { ...u, doors: [[-7.6, .8, 2.2], [-4.6, .9, 2.2]] }); I.wx(2.6, 3, 9, { ...u, doors: [[7.6, .8, 2.2], [4.6, .9, 2.2]] }); I.wz(-6.2, -2, 2.6, u); I.wz(6.2, -2, 2.6, u);
  I.exitAt(0, 7.6, 1.6).spawnAt(1.9, 7.1, 0);
  I.stairs(-.8, 2.6, .8, 7.3, 'n', 0, { m: 'pEsc' });
  I.band(sala, 'kente', 3.0, .25); I.band(hall, 'friso', 3.05, .15);

  /* térreo: hall */
  for (let i = 0; i < 6; i++) { I.C.box('metalP', .3, .3, .1, -2.85 + (i % 3) * .38, 1.0 + Math.floor(i / 3) * .36, -1.82); I.C.box('amarelo', .04, .02, .02, -2.78 + (i % 3) * .38, 1.2 + Math.floor(i / 3) * .36, -1.76); }
  I.plaque('CORREIO E AVISOS', 'Caixas de correio e quadro de avisos dos moradores.', -2.0, 1.9, -1.82, 0, 1.7, .5, { fs: 13 }); I.plant(2.5, 7.4, 1.2); I.plant(-2.5, 7.4, 1.2); I.hot('viz_entrada', 0, .8, 1.6, { r: 3.4 });
  /* térreo: sala comunitária */
  I.table(-6, 4.0, 4.0, 1.0, .75, 0, 'madeira'); [-7.2, -6, -4.8].forEach(x => { I.chair(x, 3.1, 0); I.chair(x, 4.9, PI); }); I.rug(-6, 4.0, 5.0, 3.0, 'tecidoV');
  I.kitchenRow(-8.575, 6.6, 2.6, PI / 2); I.fridge(-8.5, 4.9, PI / 2); I.rug(-6.0, .6, 3.2, 2.2, 'tecidoO'); ['vermelho', 'amarelo', 'verde', 'azul'].forEach((m, i) => I.box(m, .28, .28, .28, -7 + i * .6, 0, .3 + (i % 2) * .5, i * .5)); I.shelf(-8.7, -.8, 1.6, PI / 2, 3, 1.0);
  I.diagram(-8.82, .9, 1.5, PI / 2, 4.0, 2.0, (g, W, H) => {
    dgBase(g, W, H, 'O QUE O BLOCO COMPARTILHA', 'Esquema didático'); const y = H * .62;
    dgNode(g, W * .13, y, W * .2, H * .2, 'Telhado verde', '#7FD1A8'); dgNode(g, W * .38, y, W * .2, H * .2, 'Cisterna', '#5FB0E8'); dgNode(g, W * .63, y, W * .2, H * .2, 'Solar coletivo', '#F0D27A'); dgNode(g, W * .88, y, W * .2, H * .2, 'Medição individual', '#E8E0C8');
    dgArrow(g, W * .24, y, W * .28, y, '#9FD6CC', 4); dgArrow(g, W * .49, y, W * .53, y, '#9FD6CC', 4); dgArrow(g, W * .74, y, W * .77, y, '#9FD6CC', 4); dgNote(g, W * .05, H * .85, 'Cada família paga só o que usa; o que é comum é dividido.', '#F0D8A0', 18);
  }, 0, .45); I.hot('viz_sala', -6, 3.6, 1.4, { r: 3.8 });
  /* térreo: lavanderia */
  [.6, 1.3, 2.0, 2.7].forEach(z => I.washer(8.575, z, -PI / 2)); I.table(5.5, 1.0, 2.0, .9, .9, 0, 'metalP'); I.clothesline(6, 5.4, 3.6, 0); I.clothesline(6, 6.8, 3.6, 0); I.tank(3.7, 3.6, .6, 1.6, 0, 'conc', true); I.hot('viz_lavanderia', 6.8, 3.0, 1.4, { r: 3.8 });
  I.plaque('LAVANDERIA COMPARTILHADA', 'Menos máquinas, menos energia e menos custo para todos.', 3.18, 1.8, 1.1, PI / 2, 2.6, .6, { fs: 14 });
  /* térreo: pátio */
  I.bed(-6.5, -6, 3.4, 1.2, 0, .55, 'fA'); I.bed(-2.5, -6, 3.4, 1.2, 0, .55, 'fB'); I.bed(6.5, -6, 3.4, 1.2, 0, .55, 'fC'); I.treeIn(2.5, -5, .85); I.tank(7.9, -3.3, .8, 1.8, 0, 'conc', true); I.seat(-4.5, -3.2, 1.6, PI); I.seat(0.3, -3.3, 1.6, PI);
  I.cabinet(-8.3, -3.3, 1.2, .9, 0, 0, 'madeiraE', .6); I.plaque('PÁTIO COMUNITÁRIO', 'Horta, cisterna e composteira usadas por todo o bloco.', 0, 1.6, -7.82, 0, 3.4, .6, { fs: 15 }); I.hot('viz_pateio', 0, -4.2, 1.5, { r: 5 });
  /* hall superior */
  I.cobogo(0, .85, 7.86, PI, 3.0, 1.6, 1); I.plant(-2.4, 7.2, 1.1, 1); I.plant(2.4, 7.2, 1.1, 1); I.plaque('CIRCULAÇÃO ABERTA', 'O cobogó deixa o vento passar e filtra o sol.', -2.0, 1.8, -1.85, 0, 1.6, .5, { lv: 1, fs: 13 }); I.hot('viz_cobogo', 1.9, 6.2, 1.5, { r: 3.0, lv: 1 });
  /* apartamentos A e B */
  I.kitchenRow(-8.575, 5.8, 2.8, PI / 2, 1); I.fridge(-8.5, 3.3, PI / 2, 1); I.sofa(-5.0, 7.4, 2.0, PI, 'tecidoO', 1); I.table(-5.0, 5.8, 1.0, .6, .4, 0, 'madeira', 1); I.rug(-5.0, 5.8, 2.8, 2.0, 'tecidoV', 1); I.stool(-7.6, 4.3, .65, 1); I.hot('viz_apto', -6, 5.6, 1.4, { r: 3.6, lv: 1 });
  I.kitchenRow(8.575, 5.8, 2.8, -PI / 2, 1); I.fridge(8.5, 3.3, -PI / 2, 1); I.sofa(5.0, 7.4, 2.0, PI, 'tecidoO', 1); I.table(5.0, 5.8, 1.0, .6, .4, 0, 'madeira', 1); I.rug(5.0, 5.8, 2.8, 2.0, 'tecidoO', 1); I.stool(7.6, 4.3, .65, 1);
  I.bedF(-4.6, -.8, 0, 1, 1.4); I.nightstand(-5.8, -1.6, 0, 1); I.cabinet(-3.4, 1.2, 1.4, 2.0, -PI / 2, 1, 'madeiraE', .55); I.hot('viz_quarto', -4.6, .2, 1.3, { r: 2.6, lv: 1 });
  I.bedF(4.6, -.8, 0, 1, 1.4, 'tecidoO'); I.nightstand(5.8, -1.6, 0, 1); I.cabinet(3.4, 1.2, 1.4, 2.0, PI / 2, 1, 'madeiraE', .55);
  I.toilet(-8.6, -.8, PI / 2, 1); I.basin(-8.6, .7, PI / 2, 1); I.shower(-7.2, -1.4, 0, 1); I.toilet(8.6, -.8, -PI / 2, 1); I.basin(8.6, .7, -PI / 2, 1); I.shower(7.2, -1.4, 0, 1);
};
