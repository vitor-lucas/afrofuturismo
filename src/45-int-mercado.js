/* ============================================================
   INTERIOR — Mercado Comunitário
   Galpão com 12 bancas, praça de encontro ao ar livre, cozinha comunitária
   e espaço de trocas. Produtos modelados em 3D.
   ============================================================ */
const STALL_CLOTH = ['kente', 'mud', 'ndb', 'friso', 'tecidoT', 'tecidoO', 'tecidoV', 'vermelho'];
IB.prototype.stall = function (x, z, ry, kind, name, w = 3.6, k = 0) {
  const c = this.C.sub(x, 0, z, ry), cs = Math.cos(ry), sn = Math.sin(ry), W2 = (lx, lz) => [x + lx * cs + lz * sn, z - lx * sn + lz * cs];
  c.box('madeiraE', w, .95, .6, 0, 0, .75); c.box('madeira', w + .1, .06, .72, 0, .95, .75); c.box('madeiraE', w, 2.3, .1, 0, 0, -.9);
  [.62, 1.24, 1.86].forEach(y => c.box('madeira', w - .2, .04, .42, 0, y, -.68)); [-1, 1].forEach(a => [-.9, 1.12].forEach(b => c.cyl('madeiraC', .06, .06, 2.85, a * (w / 2 + .02), 0, b, 8)));
  c.box(STALL_CLOTH[k % STALL_CLOTH.length], w + .5, .05, 2.5, 0, 2.78, .12, 0, -.14); c.box('madeiraC', w + .5, .1, .1, 0, 2.86, -1.1); c.box('madeiraC', w + .5, .1, .1, 0, 2.62, 1.3);
  const [sx, sz] = W2(0, 1.4); this.plaque(name, '', sx, 2.2, sz, ry, Math.min(w, 2.6), .42, { fs: 20 });
  this.colO(...W2(0, .1), w + .2, 2.2, ry);
  const Y = 1.01, Z = .75, B = (m, bw, bh, bd, px, py, pz, r = 0) => c.box(m, bw, bh, bd, px, py, pz, r);
  const sph = (m, r, px, py, pz, a = 1, b = 1, d = 1) => c.sph(m, r, px, py, pz, a, b, d, 8);
  if (kind === 'fruta') { const cols = ['amarelo', 'vermelho', 'verde', 'ocre']; cols.forEach((m, i) => { const px = (i - 1.5) * .8; c.cyl('palha', .3, .24, .14, px, Y, Z, 12); for (let j = 0; j < 7; j++) sph(m, .09, px + Math.sin(j * 1.3) * .17, Y + .2 + (j > 3 ? .1 : 0), Z + Math.cos(j * 1.3) * .12 * (j > 3 ? 0 : 1)); }); for (let j = 0; j < 3; j++) B('amarelo', .5, .05, .09, 1.2, 1.9 + j * .03, -.65, j * .15 - .15); }
  else if (kind === 'raiz') { ['marrom', 'terra', 'ocre'].forEach((m, i) => { const px = (i - 1) * 1.0; c.cyl('palha', .32, .26, .12, px, Y, Z, 12); for (let j = 0; j < 6; j++) sph(m, .08, px + (j - 2.5) * .08, Y + .16 + (j % 2) * .06, Z + (j % 3 - 1) * .1, 2.6, 1, 1); }); [.62, 1.24].forEach(y => { for (let j = 0; j < 5; j++) sph('marrom', .09, -1.2 + j * .6, y + .12, -.68, 1.6, 1, 1); }); }
  else if (kind === 'grao') { [['palha', 'ocre'], ['palha', 'branco'], ['palha', 'vermelho'], ['palha', 'marrom']].forEach(([sk, gr], i) => { const px = (i - 1.5) * .8; B(sk, .55, .45, .38, px, Y, Z); B(gr, .46, .04, .3, px, Y + .45, Z); c.cone(gr, .2, .14, px, Y + .49, Z, 10, 0); }); for (let j = 0; j < 6; j++) c.cyl('vidro', .06, .06, .2, -1.4 + j * .5, .62, -.68, 8), c.cyl(['ocre', 'branco', 'vermelho', 'marrom', 'ocre', 'amarelo'][j], .05, .05, .14, -1.4 + j * .5, .62, -.68, 8); }
  else if (kind === 'hortalica') { for (let i = 0; i < 4; i++) { const px = (i - 1.5) * .8; c.cyl('palha', .3, .24, .12, px, Y, Z, 12); for (let j = 0; j < 5; j++) c.ico(['fA', 'fB', 'fC', 'fA'][i], .13, px + Math.sin(j * 1.7) * .16, Y + .22, Z + Math.cos(j * 1.7) * .11, 1, 1.2, 1, 0); } for (let j = 0; j < 6; j++) sph('vermelho', .07, -1.3 + j * .15, 1.18, Z + .2); }
  else if (kind === 'tempero') { ['vermelho', 'amarelo', 'verde', 'marrom', 'ocre', 'vermelho', 'verde'].forEach((m, i) => { const px = (i - 3) * .45; c.cyl('vidro', .09, .09, .26, px, Y, Z, 10); c.cyl(m, .075, .075, .22, px, Y + .01, Z, 10); c.cyl('madeira', .095, .095, .04, px, Y + .26, Z, 10); }); for (let j = 0; j < 8; j++) c.cyl('palha', .03, .02, .5, -1.4 + j * .4, 2.28, .3, 6); for (let j = 0; j < 6; j++) sph(['vermelho', 'amarelo', 'verde'][j % 3], .08, -1.2 + j * .45, 1.9, -.68); }
  else if (kind === 'doce') { for (let i = 0; i < 4; i++) { const px = (i - 1.5) * .8; c.cyl('madeira', .26, .22, .1, px, Y, Z, 12); for (let j = 0; j < 5; j++) sph('marrom', .08, px + Math.sin(j * 1.5) * .14, Y + .17, Z + Math.cos(j * 1.5) * .1, 1.5, 1, 1); } for (let j = 0; j < 5; j++) { c.cyl('vidro', .09, .09, .22, -1.2 + j * .55, 1.24, -.68, 10); c.cyl('ocre', .075, .075, .18, -1.2 + j * .55, 1.25, -.68, 10); } }
  else if (kind === 'tecido') { ['kente', 'mud', 'ndb', 'friso', 'tecidoT', 'tecidoO'].forEach((m, i) => { c.box(m, .5, 1.5, .02, (i - 2.5) * .55, .62, -.78); }); c.box('madeiraC', 3.3, .05, .05, 0, 2.2, -.8); ['mud', 'kente', 'tecidoV', 'ndb'].forEach((m, i) => { c.box(m, .7, .06 * (3 + i % 2), .5, (i - 1.5) * .8, Y, Z - .05); }); c.box('madeiraC', .04, .04, .04, 0, 0, 0); }
  else if (kind === 'ceramica') { [[-1.2, .3], [-.6, .22], [0, .28], [.6, .2], [1.2, .26]].forEach(([px, r], i) => { c.sph(['terra', 'ocre', 'terraD', 'terra', 'ocre'][i], r, px, Y + r, Z, 1, 1.05, 1, 10); c.cyl(['terra', 'ocre', 'terraD', 'terra', 'ocre'][i], r * .5, r * .6, .1, px, Y + r * 1.9, Z, 10); }); [.62, 1.24].forEach(y => { for (let j = 0; j < 5; j++) c.cyl(['terra', 'ocre'][j % 2], .14, .1, .24, -1.3 + j * .65, y + .04, -.68, 10); }); }
  else if (kind === 'cesta') { for (let i = 0; i < 4; i++) { const px = (i - 1.5) * .8; c.cyl('palha', .3 - i * .02, .22, .22 + i * .03, px, Y, Z, 14); c.cyl('madeira', .31 - i * .02, .31 - i * .02, .03, px, Y + .2 + i * .03, Z, 14); } for (let j = 0; j < 5; j++) c.cyl('palha', .2, .17, .18, -1.3 + j * .65, 1.86 + .04, -.68, 12); }
  else if (kind === 'tambor') { [[-1.1, .22, .7], [-.55, .18, .6], [1.1, .2, .5]].forEach(([px, r, h]) => { c.cyl('madeira', r, r * .8, h, px, Y, Z, 14); c.cyl('branco', r + .01, r + .01, .03, px, Y + h, Z, 14); }); for (let j = 0; j < 3; j++) B('madeiraE', .04, 1.3, .04, -.2 + j * .2, 1.0, -.76, 0); for (let j = 0; j < 3; j++) sph('ocre', .1, -.2 + j * .2, 1.55 - j * 0.0, -.72); }
  else if (kind === 'conta') { for (let i = 0; i < 5; i++) { const px = (i - 2) * .6; c.cyl('madeiraE', .03, .03, .5, px, Y, Z, 6); for (let j = 0; j < 8; j++) sph(['vermelho', 'amarelo', 'azul', 'verde', 'ocre', 'branco', 'gTur', 'gOuro'][(i + j) % 8], .045, px + Math.sin(j) * .1, Y + .06 + j * .06, Z + Math.cos(j) * .1); } for (let j = 0; j < 12; j++) sph(['vermelho', 'amarelo', 'azul', 'verde'][j % 4], .04, -1.2 + j * .2, 1.5, -.7); }
  return this;
};

INT.mercado = I => {
  I.name = 'Mercado Comunitário'; I.H = 5.5; const o = { dh: 3.4, th: .3 };
  const hall = I.room('Galpão das bancas', -16, -3, 16, 13, { f: 'pConc', lights: [[-9, 1.5], [9, 1.5], [-9, 9.5], [9, 9.5]], lc: 0xFFE2B8, li: 1.15, ld: 20 });
  const plz = I.room('Praça de encontro', -8, -12, 8, -3, { f: 'pPedra', noCeil: true }); I.sky(0, 0);
  const tro = I.room('Espaço de trocas', -16, -12, -8, -3, { f: 'pMad', lc: 0xFFD9A0 }), coz = I.room('Cozinha comunitária', 8, -12, 16, -3, { f: 'pConc', tint: 'gBranco', lc: 0xFFF0D8 });
  I.wx(13, -16, 16, { ...o, doors: [[0, 4.4, 3.6]], wins: [[-11, 4, 3.4, 5.0], [-5, 4, 3.4, 5.0], [5, 4, 3.4, 5.0], [11, 4, 3.4, 5.0]] });
  I.wz(-16, -12, 13, { ...o, wins: [[-7, 4, 3.4, 5.0], [2, 4, 3.4, 5.0], [9, 4, 3.4, 5.0]] }); I.wz(16, -12, 13, { ...o, wins: [[-7, 3, 1.2, 3.4], [2, 4, 3.4, 5.0], [9, 4, 3.4, 5.0]] });
  I.wx(-12, -16, 16, o);
  I.wx(-3, -16, -8, { ...o, doors: [[-12, 2.4]] }); I.wx(-3, 8, 16, { ...o, doors: [[12, 2.4]] }); I.wz(-8, -12, -3, { ...o, doors: [[-7.5, 2.2]] }); I.wz(8, -12, -3, { ...o, doors: [[-7.5, 2.2]] });
  I.band(hall, 'friso', 4.6, .5); I.band(tro, 'mud', 3.9, .4); I.band(coz, 'gOuro', 3.9, .05);
  I.exitAt(0, 12.2, 1.8).spawnAt(0, 11.4, 0);
  // vigas de madeira e panos suspensos
  [-12, -4, 4, 12].forEach((x, i) => { I.C.box('madeiraC', .28, .34, 25, x, 4.9, .5); [.6, 5.2, 10.6].forEach((z, j) => I.C.box(STALL_CLOTH[(i * 3 + j) % 8], .03, 1.1, .9 + j * .1, x, 3.8, z)); });
  // bancas: fileira norte (viradas ao sul) e sul (viradas ao norte)
  const kN = [['fruta', 'FRUTAS DA REGIÃO'], ['raiz', 'RAÍZES E TUBÉRCULOS'], ['grao', 'GRÃOS E FARINHAS'], ['hortalica', 'HORTALIÇAS'], ['tempero', 'TEMPEROS E ERVAS'], ['doce', 'CACAU E DOCES']], kS = [['tecido', 'TECIDOS E PANOS'], ['ceramica', 'CERÂMICA'], ['cesta', 'CESTARIA'], ['tambor', 'INSTRUMENTOS'], ['conta', 'CONTAS E ADORNOS'], ['tecido', 'COSTURA E MODA']];
  const xS = [-13.2, -8.9, -4.6, 4.6, 8.9, 13.2];
  xS.forEach((x, i) => { I.stall(x, 0.4, 0, kN[i][0], kN[i][1], 3.6, i); I.stall(x, 7.6, PI, kS[i][0], kS[i][1], 3.6, i + 3); });
  I.hot('mer_frutas', -11, 2.4, 1.7, { r: 3.4 }); I.hot('mer_graos', -4.6, 2.4, 1.7, { r: 3.2 }); I.hot('mer_tecidos', -13.2, 5.4, 1.9, { r: 3.2 }); I.hot('mer_artesanato', -6.8, 5.4, 1.7, { r: 3.4 }); I.hot('mer_tambor', 4.6, 5.4, 1.7, { r: 3.2 });
  I.hot('mer_entrada', 0, 9.6, 1.6, { r: 3.4 }); I.plaque('MERCADO COMUNITÁRIO', 'Produtos da vila e do entorno. Preço justo, troca e conversa.', 0, 2.1, 12.82, PI, 3.6, .8, { fs: 18 });
  I.plant(-14.6, 12, 1.4); I.plant(14.6, 12, 1.4); I.seat(-4.2, 11.6, 2.2); I.seat(4.2, 11.6, 2.2); I.cyl('terra', .45, .4, .8, 8, 0, 11, true, 14); I.cyl('agua', .4, .4, .05, 8, .8, 11, false, 14);
  I.plaque('ALIMENTO DE QUEM PRODUZ', 'Agricultura familiar e agroecológica em primeiro lugar.', 15.82, 1.6, 6.5, -PI / 2, 2.4, .8, { fs: 16 });

  /* ---- Praça de encontro ---- */
  I.treeIn(0, -7.6, 1.0); I.seat(-2.6, -7.6, 1.8, PI / 2); I.seat(2.6, -7.6, 1.8, -PI / 2); I.seat(0, -5.0, 2.0, 0); I.seat(0, -10.2, 2.0, PI); I.seat(-6, -4.5, 2.0, 0); I.seat(6, -4.5, 2.0, 0);
  I.rug(0, -7.6, 8, 5.5, 'tecidoO'); I.pattern(-6.82, 1.4, -7.8, PI / 2, 2.4, 1.4, 'kente'); I.pattern(6.82, 1.4, -7.8, -PI / 2, 2.4, 1.4, 'mud'); I.hot('mer_praca', 0, -4.2, 1.9, { r: 4.2 });
  I.plaque('PRAÇA DE ENCONTRO', 'Aqui se conversa, se negocia e se comemora.', 0, 1.9, -11.82, 0, 3.0, .6, { fs: 16 });

  /* ---- Espaço de trocas ---- */
  I.shelf(-15.5, -8.2, 3.0, PI / 2, 4, 2.1, 0, false); for (let k = 0; k < 14; k++) I.box(['terra', 'tecidoV', 'azul', 'ocre', 'verde', 'tecidoT', 'vermelho'][k % 7], .22, .22, .28, -15.55, .5 + Math.floor(k / 5) * .5, -9.6 + (k % 5) * .55);
  I.table(-11.5, -8, 2.6, 1.0, .85, 0, 'madeiraE'); I.C.box('aco', .6, .05, .3, -11.5, .85, -8); I.C.cyl('aco', .02, .02, .4, -11.5, .9, -8, 6); I.C.box('branco', .5, .02, .03, -11.5, 1.3, -8);
  I.plaque('BANCO DE TROCAS E MOEDA SOCIAL', 'Troque o que sobra pelo que falta. Pontos de troca valem em toda a vila.', -11.5, 1.5, -11.82, 0, 3.6, .9, { fs: 15 }); I.hot('mer_trocas', -11.5, -6.2, 1.6, { r: 3.6 }); I.chair(-11.5, -6.8, 0); I.plant(-8.8, -3.8, .9);

  /* ---- Cozinha comunitária ---- */
  I.counter(11, -11.2, 6.5, .8, 0, 'madeiraE'); [9.6, 11.1, 12.6].forEach(x => { I.C.box('aco', .8, .04, .6, x, 1.11, -11.2); I.C.cyl('gTerra', .13, .13, .02, x - .15, 1.15, -11.2, 12); I.C.cyl('gTerra', .13, .13, .02, x + .15, 1.15, -11.2, 12); });
  I.table(12, -7, 4.2, 1.2, .85, 0, 'madeira'); [-1.5, -.5, .5, 1.5].forEach(k => { I.chair(12 + k, -5.9, PI); I.chair(12 + k, -8.1, 0); }); I.cyl('aco', .3, .26, .38, 9.4, 1.11, -11.2, false, 12); I.cyl('aco', .25, .22, .3, 11.2, 1.11, -11.2, false, 12);
  I.box('branco', .9, 1.9, .8, 15.2, 0, -10.4, 0, true); I.box('gAzul', .5, .08, .02, 14.78, 1.4, -10.4); for (let k = 0; k < 6; k++) I.C.box('aco', .03, .22, .03, 9.5 + k * .55, 2.0, -11.78); I.C.box('aco', 3.2, .03, .03, 11.2, 2.4, -11.78);
  I.plaque('COZINHA COMUNITÁRIA', 'Refeições a preço social e oficinas de culinária.', 8.18, 1.7, -4.8, PI / 2, 2.2, .8, { fs: 15 }); I.hot('mer_cozinha', 12, -5, 1.7, { r: 3.8 });
};

/* ============================================================
   INTERIOR — Centro de Saúde e Bem-estar
   ============================================================ */
INT.saude = I => {
  I.name = 'Centro de Saúde e Bem-estar'; I.H = 3.6; const o = { dh: 2.6, th: .3 };
  const rec = I.room('Recepção e sala de espera', -10, 4, 10, 12, { f: 'pMad', lights: [[-5, 8], [5, 8]], lc: 0xFFF0DC });
  const jar = I.room('Jardim de descanso', -6, -4, 6, 4, { f: 'pPedra', noCeil: true }); I.sky(0, 0);
  const c1 = I.room('Consultório 1', -14, -2, -6, 4, { f: 'pConc', tint: 'gBranco', lc: 0xEAF4FF }), c2 = I.room('Consultório 2', -14, -10, -6, -2, { f: 'pConc', tint: 'gBranco', lc: 0xEAF4FF });
  const vac = I.room('Sala de vacinas', 6, -2, 14, 4, { f: 'pConc', tint: 'gBranco', lc: 0xEAF4FF }), far = I.room('Farmácia viva · plantas medicinais', 6, -10, 14, -2, { f: 'pMad', lc: 0xE8FFE0 }), pre = I.room('Orientação preventiva', -6, -10, 6, -4, { f: 'pMad', lc: 0xFFF0DC });
  I.wx(12, -10, 10, { ...o, doors: [[0, 3.2, 2.8]], wins: [[-6.5, 2.4, 1, 2.8], [6.5, 2.4, 1, 2.8]] }); I.wz(-10, 4, 12, { ...o, wins: [[11, 2.4, 1, 2.8]] }); I.wz(10, 4, 12, { ...o, wins: [[6, 2.4, 1, 2.8]] });
  I.wx(4, -10, 10, { ...o, doors: [[0, 3.2, 2.8]] }); I.wz(-6, -10, 4, { ...o, doors: [[1, 1.8], [-3, 1.6]] }); I.wz(6, -10, 4, { ...o, doors: [[1, 1.8], [-3, 1.6]] }); I.wx(-4, -6, 6, { ...o, doors: [[0, 2.4]] });
  I.wz(-14, -10, 4, { ...o, wins: [[1, 2.2, 1, 2.8]] }); I.wz(14, -10, 4, { ...o, wins: [[1, 2.2, 1, 2.8]] }); I.wx(-10, -14, 14, { ...o, wins: [[-10, 2.4, 1, 2.8], [10, 2.4, 1, 2.8]] });
  I.wx(-2, -14, -6, o); I.wx(-2, 6, 14, o); I.wx(4, -14, -10, { ...o }); I.wx(4, 10, 14, o);
  I.band(rec, 'gVerde', 3.2, .06); I.band(pre, 'mud', 3.0, .35);
  I.exitAt(0, 11.2, 1.8).spawnAt(0, 10.4, 0);

  /* ---- recepção e espera ---- */
  I.counter(-5.2, 6.6, 4.2, .8, 0, 'madeiraE'); I.plaque('ACOLHIMENTO', 'Atendimento por ordem de necessidade. Sem filas longas.', -5.2, 1.15, 4.18, 0, 2.2, .62, { fs: 15 }); I.hot('saude_recepcao', -5.2, 8.0, 1.5, { r: 3.4 });
  [[-7.5, 9.5], [-5.2, 9.5], [-2.9, 9.5], [2.9, 9.5], [5.2, 9.5], [7.5, 9.5]].forEach(([x, z]) => I.seat(x, z, 1.6, PI)); I.rug(6, 6.6, 3.6, 2.4, 'tecidoV'); I.table(6, 6.4, 1.2, .8, .4, 0, 'madeira'); I.plant(-9.2, 11, 1.3); I.plant(9.2, 11, 1.3); I.plant(9.2, 5, 1.1);
  I.screen(9.82, 1.6, 10.4, -PI / 2, 1.9, 1.0, 'SENHAS E AVISOS', 'Campanhas de vacinação, horários e orientações.'); I.plaque('RAMPA E PISO TÁTIL', 'Acesso para cadeiras de rodas, pessoas cegas e idosos (ver NBR 9050).', -9.82, 1.5, 7, PI / 2, 2.0, .7, { fs: 14 });
  I.C.box('amarelo', 1.2, .01, .3, 0, .005, 10.6); I.C.box('amarelo', .3, .01, 1.2, 0, .005, 9.8);

  /* ---- jardim de descanso ---- */
  I.bed(-2.6, 0, 3.2, 1.6, 0, .5, 'fB', false); I.bed(2.6, 0, 3.2, 1.6, 0, .5, 'fC', false); I.C.cyl('conc', 1.0, 1.1, .35, 0, 0, 0, 24); I.C.cyl('agua', .9, .9, .03, 0, .33, 0, 24);
  I.seat(-3.2, 2.9, 2.0, 0); I.seat(3.2, 2.9, 2.0, 0); I.seat(0, -2.9, 2.2, PI); I.cyl('tronco', .12, .18, 2.2, 4.8, 0, -2.8, true, 10); [0, 1, 2, 3].forEach(k => I.C.ico(['fA', 'fB', 'fC', 'fD'][k], 1.0, 4.8 + Math.sin(k * 1.6) * .6, 2.7, -2.8 + Math.cos(k * 1.6) * .6, 1, .8, 1, 1)); I.hot('saude_jardim', 0, 1.8, 1.6, { r: 4 });
  I.plaque('JARDIM DE DESCANSO', 'Dois minutos de verde e silêncio ajudam a baixar a tensão.', 0, 1.7, 3.84, PI, 2.6, .6, { fs: 15 });

  /* ---- consultórios ---- */
  [[-10, 1.2, -13.82, PI / 2, 1], [-10, -6, -13.82, PI / 2, 1]].forEach(([_, z, wx], i) => { const cz = i ? -6 : 1; I.desk(-11.2, cz + 1, 1.4, PI / 2); I.chair(-10.4, cz + 1, PI / 2); I.chair(-12.2, cz + 1.0, -PI / 2); I.box('branco', .75, .5, 1.9, -8.2, 0, cz - 1.0, 0, true); I.C.box('azul', .72, .08, .5, -8.2, .5, cz - 1.0 - .7); I.cabinet(-13.5, cz - 1.4, 1.6, 1.0, PI / 2); I.C.box('gTur', .02, .3, .3, -13.82, 1.4, cz - 1.4); });
  I.plaque('CONSULTÓRIO', 'Atendimento de família e acompanhamento do crescimento.', -9, 1.6, -1.82, 0, 2.2, .6, { fs: 14 }); I.hot('saude_consultorio', -9.2, 1.0, 1.5, { r: 3.4 }); I.plaque('CONSULTÓRIO', 'Pré-natal, atenção à criança e saúde da mulher.', -9, 1.6, -9.82, 0, 2.2, .6, { fs: 14 }); I.plant(-6.8, -9.3, 1);

  /* ---- vacinas ---- */
  I.box('branco', .9, 1.9, .8, 13.3, 0, 2.0, 0, true); I.box('gAzul', .06, .5, .5, 12.85, 1.2, 2.0); I.bench(10.2, 2.8, 2.2, .7, 0, 0, 'branco'); I.chair(10.2, 1.9, PI); I.chair(11.6, 0, -PI / 2); I.table(8.6, -0.6, 1.4, .7, .74, 0, 'madeira'); I.rug(10, .4, 3.4, 2.4, 'tecidoT');
  I.plaque('SALA DE VACINAS', 'Vacina protege você e quem está ao seu redor.', 10, 1.7, -1.82, 0, 2.6, .6, { fs: 14 }); I.hot('saude_vacinas', 9.6, .8, 1.5, { r: 3.4 });

  /* ---- farmácia viva ---- */
  I.shelf(13.6, -6, 5.6, -PI / 2, 4, 2.2, 0, false); for (let r = 0; r < 4; r++) for (let j = 0; j < 12; j++) { I.cyl('vidro', .07, .07, .22, 13.42, .15 + r * .52, -8.4 + j * .44, false, 8); I.cyl(['fA', 'fB', 'marrom', 'ocre', 'fC', 'terra'][(j + r) % 6], .055, .055, .18, 13.42, .17 + r * .52, -8.4 + j * .44, false, 8); }
  I.counter(9.5, -4.2, 3.4, .8, 0, 'madeiraE'); I.cyl('pedraQ', .12, .09, .12, 8.7, 1.11, -4.2, false, 10); I.C.box('madeira', .04, .22, .04, 8.7, 1.2, -4.2, 0, 0, .5); [8.4, 9.6, 10.6].forEach((x, i) => I.plant(x, -9.3, .7 + i * .1)); I.table(9, -7, 2.4, 1.0, .8, 0, 'madeira'); [8.3, 9.0, 9.7].forEach(x => I.C.cyl('fB', .05, .05, .25, x, .86, -7, 6));
   I.hot('saude_farmacia', 9.5, -5.8, 1.5, { r: 3.8 });

  /* ---- orientação preventiva ---- */
  I.board(0, 1.2, -9.82, 0, 5.2, 1.4, 'CUIDAR ANTES DE ADOECER', 'Alimentação · movimento · sono · vacinas · saúde mental · convivência. Pergunte, converse, participe.');
  [-3, 0, 3].forEach(x => I.rug(x, -6.6, 1.8, .8, ['azul', 'verde', 'vermelho'][x / 3 + 1])); I.roundTable(0, -7.6, 1.1, 6, 0); I.hot('saude_prevencao', 0, -6.0, 1.6, { r: 3.6 }); I.plant(-5.2, -9.2, 1); I.plant(5.2, -9.2, 1);
};
