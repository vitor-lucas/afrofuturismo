/* ============================================================
   INTERIOR — Escola do Futuro
   Eixo central: recepção → pátio aberto (horta pedagógica) → auditório.
   Oeste: informática, sala de aula A, laboratório de ciências.
   Leste: biblioteca, sala de aula B, história e cultura africana.
   ============================================================ */
/* carteiras em fileiras: alunos olham para -z local (ry gira o conjunto) */
IB.prototype.deskRows = function (cx, cz, cols, rows, ry, lv = 0, dx = 1.55, dz = 1.2, m = 'madeira') {
  const cs = Math.cos(ry), sn = Math.sin(ry);
  for (let i = 0; i < cols; i++) for (let k = 0; k < rows; k++) { const lx = (i - (cols - 1) / 2) * dx, lz = (k - (rows - 1) / 2) * dz, x = cx + lx * cs + lz * sn, z = cz - lx * sn + lz * cs; this.table(x, z, 1.1, .55, .72, ry, m, lv); this.chair(x + sn * .6, z + cs * .6, ry + PI, lv); }
  return this;
};
IB.prototype.seatRow = function (x0, x1, z, n, ry = PI, lv = 0, m = 'tecidoV') { const y = this.y(lv); for (let i = 0; i < n; i++) { const x = x0 + (x1 - x0) * (n === 1 ? .5 : i / (n - 1)), s = this.C.sub(x, y, z, ry); s.box(m, .48, .08, .46, 0, .42, 0); s.box(m, .48, .5, .07, 0, .48, -.22); s.box('metalP', .06, .42, .06, 0, 0, 0); } return this; };
IB.prototype.treeIn = function (x, z, s = 1, lv = 0) { const y = this.y(lv); this.cyl('tronco', .3 * s, .45 * s, 3.2 * s, x, 0, z, true, 12, lv); for (let k = 0; k < 6; k++) { const a = k * 1.05; this.C.ico(['fA', 'fB', 'fC', 'fD'][k % 4], 1.5 * s, x + Math.sin(a) * 1.3 * s, y + 3.9 * s + (k % 2) * .4 * s, z + Math.cos(a) * 1.3 * s, 1, .75, 1, 1); } this.C.ico('fB', 1.7 * s, x, y + 4.6 * s, z, 1, .7, 1, 1); return this; };

INT.escola = I => {
  I.name = 'Escola do Futuro'; I.H = 4.0; const o = { dh: 2.8, th: .3 };
  const hall = I.room('Recepção', -8, 6, 8, 14, { f: 'pPedra', lights: [[0, 10]], lc: 0xFFEBD0 });
  const pat = I.room('Pátio de convivência e horta pedagógica', -8, -8, 8, 6, { f: 'pPedra', noCeil: true }); I.sky(0, 0);
  const aud = I.room('Auditório', -8, -18, 8, -8, { f: 'pEsc', h: 5.2, lights: [[0, -11], [0, -15]], lc: 0xFFC890, li: 1.1, ld: 14 });
  const inf = I.room('Sala de informática', -20, 6, -8, 14, { f: 'pConc', tint: 'gBranco', lc: 0xE6F0FF }), aA = I.room('Sala de aula A · Matemática e arte', -20, -4, -8, 6, { f: 'pMad' }), lab = I.room('Laboratório de ciências', -20, -18, -8, -4, { f: 'pConc', tint: 'gBranco', lc: 0xEAF4FF, lights: [[-14, -7], [-14, -15]] });
  const bib = I.room('Biblioteca', 8, 6, 20, 14, { f: 'pMad', lc: 0xFFD9A0 }), aB = I.room('Sala de aula B · Língua e literatura', 8, -4, 20, 6, { f: 'pMad' }), his = I.room('História e cultura africana', 8, -18, 20, -4, { f: 'pMad', lc: 0xFFD9A0, lights: [[14, -7], [14, -15]] });
  // perímetro
  I.wx(14, -20, 20, { ...o, doors: [[0, 3.4, 3.0]], wins: [[-14, 3, 1, 3.2], [-5.5, 2, 1.1, 3.2], [5.5, 2, 1.1, 3.2], [14, 3, 1, 3.2]] });
  I.wx(-18, -20, 20, { ...o, wins: [[-16.5, 2.4, 1, 3.2], [-11.5, 2.4, 1, 3.2]] });
  I.wz(-20, -18, 14, { ...o, wins: [[-13, 2.6, 1, 3.2], [-8, 2.6, 1, 3.2], [1, 3.2, 1, 3.2], [10, 3, 1, 3.2]] }); I.wz(20, -18, 14, { ...o, wins: [[-13, 2.6, 1, 3.2], [-8, 2.6, 1, 3.2], [1, 3.2, 1, 3.2], [10, 3, 1, 3.2]] });
  // eixo central
  I.wx(6, -8, 8, { ...o, doors: [[0, 3.6, 3.0]] }); I.wx(-8, -8, 8, { ...o, h: 5.2, doors: [[0, 3.6, 3.0]] });
  I.wz(-8, -18, -8, { ...o, h: 5.2 }); I.wz(8, -18, -8, { ...o, h: 5.2 });
  I.wz(-8, -8, 14, { ...o, doors: [[-6, 2.2], [1, 2.4], [10, 2.2]], wins: [[-2.2, 1.8, 1.1, 3.0], [3.8, 1.8, 1.1, 3.0]] }); I.wz(8, -8, 14, { ...o, doors: [[-6, 2.2], [1, 2.4], [10, 2.2]], wins: [[-2.2, 1.8, 1.1, 3.0], [3.8, 1.8, 1.1, 3.0]] });
  // partições das alas
  [[-20, -8], [8, 20]].forEach(([a, b]) => { I.wx(6, a, b, o); I.wx(-4, a, b, o); });
  I.band(hall, 'friso', 3.5, .45); I.band(aud, 'kente', 4.4, .5); I.band(his, 'ndb', 3.5, .4); I.band(bib, 'mud', 3.5, .4); I.band(aA, 'gOuro', 3.5, .05); I.band(aB, 'gOuro', 3.5, .05); I.band(lab, 'gTur', 3.5, .06); I.band(inf, 'gAzul', 3.5, .06);
  I.exitAt(0, 13.2, 1.8).spawnAt(0, 12.3, 0);

  /* ---- Recepção ---- */
  I.counter(-4.4, 8.2, 3.6, .8, 0, 'madeiraE'); I.plaque('BEM-VINDA, BEM-VINDO', 'Escola de pátio aberto. Aqui, estudar também é cuidar da comunidade.', -4.4, 1.15, 6.18, 0, 2.2, .75, { fs: 17 }); I.hot('esc_recepcao', -4.4, 9.4, 1.5);
  I.rug(0, 9.5, 5, 3, 'tecidoT'); I.seat(5, 12.2, 2.2); I.seat(-5.4, 12.6, 2.2); I.plant(-7.2, 7, 1.1); I.plant(7.2, 7, 1.1); I.plant(7.2, 13, 1.1);
  I.pattern(5.2, 1.0, 6.18, 0, 3.0, 1.6, 'kente'); I.plaque('QUADRO DE AVISOS', 'Horário do auditório · Oficina de percussão · Mutirão da horta, sábado.', 5.2, .3, 6.18, 0, 3.0, .6, { fs: 15 });
  I.art(-7.84, 1.2, 7.6, PI / 2, 1.4, 1.7, 12, 2); I.art(7.84, 1.2, 12, -PI / 2, 1.6, 1.9, 24, 1);

  /* ---- Pátio e horta pedagógica ---- */
  I.treeIn(0, -1, 1.1); [[-1.9, -1], [1.9, -1]].forEach(([x, z]) => I.seat(x, z, 1.5, PI / 2)); I.seat(0, 1.4, 1.8, 0); I.seat(0, -3.4, 1.8, PI);
  I.bed(-5.2, 3.4, 3.2, 1.2, 0, .55, 'fB', true); I.bed(5.2, 3.4, 3.2, 1.2, 0, .55, 'fC', false); I.bed(-5.2, -5.4, 3.2, 1.2, 0, .55, 'fA', true); I.bed(5.2, -5.4, 3.2, 1.2, 0, .55, 'fB', false);
  I.cyl('madeiraE', .45, .45, .8, 6.6, 0, -2.2, true, 14); I.cyl('terraSolo', .38, .38, .02, 6.6, .8, -2.2, false, 14); I.tank(-6.6, -2.2, .5, 1.1, 0, 'azul'); I.plaque('HORTA PEDAGÓGICA', 'Cada turma cuida de um canteiro. A compostagem vem da cozinha.', -3.6, 1.2, 5.84, PI, 2.2, .7, { fs: 15 });
  I.hot('esc_horta', -5.2, 1.6, 1.4, { r: 3.4 }); I.hot('esc_patio', 0, 1.0, 1.9, { r: 3.8 });
  for (let z = -6.6; z <= 4.8; z += 2.3) [-1, 1].forEach(sg => I.C.box('madeiraC', 2.2, .12, .16, sg * 6.9, 3.3, z, 0));
  I.plant(-7.2, 5.2, 1.1); I.plant(7.2, 5.2, 1.1);

  /* ---- Auditório ---- */
  I.box('madeiraE', 15, .6, 3.6, 0, 0, -16.2, 0, true); I.C.box('pMad', 14.8, .03, 3.4, 0, .6, -16.2); I.box('terra', 8, 4.2, .25, 0, .6, -17.8); I.pattern(0, 1.3, -17.66, 0, 7.2, 2.6, 'mud'); I.hot('esc_auditorio', 0, -11.2, 1.5, { r: 4 });
  [-5.4, 5.4].forEach(x => { I.C.cyl('metalP', .03, .03, 4.2, x, 0, -14.4, 6); I.C.box('aco', .35, .3, .3, x, 4.4, -14.4); }); I.plaque('AUDITÓRIO', 'Capacidade imaginada: 100 pessoas. Peças, saraus e assembleias.', 0, 4.0, -8.18, PI, 3.2, .55, { fs: 15 });
  [-12.6, -11.5, -10.4, -9.5].forEach((z, k) => { I.seatRow(-6.5, -1.2, z, 6, PI); I.seatRow(1.2, 6.5, z, 6, PI); }); I.plant(-7.2, -9, 1.2); I.plant(7.2, -9, 1.2);

  /* ---- Informática ---- */
  [[-17, 8], [-14.2, 8], [-11.4, 8], [-17, 11.8], [-14.2, 11.8], [-11.4, 11.8]].forEach(([x, z]) => { I.desk(x, z, 1.4, 0); I.chair(x, z + .7, PI); });
  I.desk(-19.2, 10, 1.6, PI / 2); I.board(-12, 1.3, 6.18, 0, 4.4, 1.2, 'PENSAMENTO COMPUTACIONAL', 'Dividir o problema em partes · achar padrões · criar passos (algoritmos).'); I.hot('esc_informatica', -14, 10, 1.4, { r: 3.8 });
  I.screen(-19.82, 1.2, 12.6, PI / 2, 1.8, 1.0, 'INTERNET COMUNITÁRIA', 'Rede da vila para estudar e criar.'); I.plant(-8.8, 13.2, 1);

  /* ---- Sala de aula A (matemática e arte; quadro a oeste) ---- */
  I.deskRows(-14, 1.2, 5, 4, PI / 2, 0, 1.7, 1.5); I.desk(-18.2, 1.2, 1.6, PI / 2); I.board(-19.82, 1.0, 1.2, PI / 2, 4.6, 1.3, 'HOJE · SIMETRIA E PADRÕES', 'Como as listras de um tecido repetem, giram e se espelham? Desenhe seu padrão.');
  I.pattern(-12, 1.6, 5.82, PI, 3.4, 1.4, 'kente'); I.plaque('PAINEL TEMÁTICO', 'Padrões em tecidos e fachadas: inspirados, sem significados inventados.', -12, .35, 5.8, PI, 3.4, .6, { fs: 15 }); I.hot('esc_sala_a', -14, 1.2, 1.6, { r: 4.2 }); I.plant(-8.8, -3.2, 1);

  /* ---- Laboratório de ciências ---- */
  [[-17, -8], [-13.4, -8], [-17, -13.4], [-13.4, -13.4]].forEach(([x, z]) => { I.bench(x, z, 2.6, 1.1, 0); I.C.cyl('vidro', .06, .06, .2, x - .6, .83, z, 8); I.C.cyl('vidro', .05, .05, .16, x + .1, .83, z + .1, 8); I.C.box('metalP', .16, .3, .16, x + .8, .83, z); I.C.sph('branco', .05, x + .8, 1.15, z - .04); });
  I.shelf(-19.6, -16, 2.6, PI / 2, 4, 2.0, 0, false); [0, 1, 2, 3, 4, 5].forEach(k => I.box(['azul', 'verde', 'amarelo', 'vermelho', 'gTur', 'branco'][k], .16, .22, .16, -19.55, .55 + (k % 3) * .55, -17.0 + k * .38));
  I.board(-14, 1.3, -17.82, 0, 2.6, 1.2, 'MÉTODO CIENTÍFICO', 'Perguntar, observar, testar, registrar e compartilhar.', 0); I.hot('esc_lab', -14.5, -10.8, 1.5, { r: 4 });
  I.cabinet(-8.7, -16.2, 2.4, 1.0, PI / 2); I.plant(-8.9, -4.9, 1);

  /* ---- Biblioteca (literatura africana e afro-brasileira) ---- */
  I.shelf(14, 6.35, 5.2, 0, 5, 2.4); I.shelf(18.8, 6.35, 2.2, 0, 5, 2.4); I.shelf(9.6, 6.35, 2.4, 0, 5, 2.4);
  I.table(13, 10.6, 2.8, 1.0, .75, 0); I.chair(11.9, 11.4, PI); I.chair(14.1, 11.4, PI); I.chair(11.9, 9.8, 0); I.chair(14.1, 9.8, 0); I.table(16.6, 12.6, 1.6, .8, .75, 0); I.chair(16.6, 11.9, 0);
  I.vitrine(16.4, 9, 1.8, 1.0, 1.0); [['tecidoT', 0], ['tecidoO', .4], ['tecidoV', .8], ['azul', 1.2], ['vermelho', 1.6]].forEach(([m, d], k) => I.box(m, .24, .32, .08, 15.7 + d * .6, 1.0, 9.0 - (k % 2) * .1, .15 * k - .3));
  I.plaque('LITERATURA AFRICANA E AFRO-BRASILEIRA', 'Carolina Maria de Jesus · Conceição Evaristo · Chinua Achebe · Mia Couto · Paulina Chiziane', 18.2, 1.4, 13.82, PI, 3.0, 1.0, { fs: 15 });
  I.hot('esc_biblioteca', 13, 9, 1.5, { r: 4 }); I.hot('esc_literatura', 16.4, 9, 1.85, { r: 3, up: .2 }); I.plant(9, 13, 1.1); I.rug(13, 10.6, 4.2, 3.2, 'tecidoO');

  /* ---- Sala de aula B (língua e literatura; quadro a leste) ---- */
  I.deskRows(14, 1.0, 5, 4, -PI / 2, 0, 1.7, 1.5); I.desk(18.2, 1.0, 1.6, -PI / 2); I.board(19.82, 1.0, 1.0, -PI / 2, 4.6, 1.3, 'LEITURA DO DIA', 'Um conto ou poema de autoria negra. O que o texto diz sobre quem escreveu?');
  I.plaque('NOSSO CANTO DE LEITURA', 'Livros escolhidos pela turma. Troque, empreste, devolva.', 12, 1.4, 5.82, PI, 3.0, .7, { fs: 15 }); I.shelf(9.3, 4.6, 1.6, PI / 2, 3, 1.4, 0); I.hot('esc_sala_b', 14, 1.0, 1.6, { r: 4.2 }); I.plant(8.8, -3.2, 1);

  /* ---- História e cultura africana ---- */
  I.diagram(14, 1.0, -17.84, 0, 8.6, 2.6, (g, W, H) => {
    g.fillStyle = '#17120E'; g.fillRect(0, 0, W, H); g.strokeStyle = '#E8B23A'; g.lineWidth = 4; g.strokeRect(6, 6, W - 12, H - 12);
    g.fillStyle = '#E8B23A'; g.font = '800 34px "Bricolage Grotesque", system-ui, sans-serif'; g.textBaseline = 'top'; g.fillText('LINHA DO TEMPO · reinos e impérios (datas aproximadas)', 26, 20);
    const R = [['Kush', -1070, 350, '#C8603B'], ['Aksum', 100, 940, '#2BB5A8'], ['Grande Zimbábue', 1100, 1450, '#E8B23A'], ['Mali', 1235, 1600, '#B23A6A'], ['Songhai', 1464, 1591, '#6AA35A'], ['Benin', 1180, 1897, '#3E6FB0']], a = -1100, b = 1900, x0 = 40, x1 = W - 40, X = y => x0 + (y - a) / (b - a) * (x1 - x0);
    g.font = '600 22px "Instrument Sans", system-ui, sans-serif'; g.strokeStyle = '#5b4d3a'; g.lineWidth = 1; for (let y = -1000; y <= 1900; y += 500) { g.beginPath(); g.moveTo(X(y), 80); g.lineTo(X(y), H - 56); g.stroke(); g.fillStyle = '#B9AA90'; g.fillText((y < 0 ? -y + ' a.C.' : y + ''), X(y) - 20, H - 44); }
    R.forEach(([n, s, e, c], i) => { const yy = 90 + i * 62; g.fillStyle = c; g.fillRect(X(s), yy, X(e) - X(s), 40); g.fillStyle = '#17120E'; g.font = '700 24px "Instrument Sans", system-ui, sans-serif'; const tw = g.measureText(n).width; if (X(e) - X(s) > tw + 20) g.fillText(n, X(s) + 10, yy + 8); else { g.fillStyle = '#F3E8CF'; g.fillText(n, X(e) + 10, yy + 8); } });
  });
  I.hot('esc_historia', 14, -14.6, 1.5, { r: 4 }); I.rug(14, -10, 7, 4.2, 'tecidoV'); I.stele(10, -16.6, 3.0); I.pyramid(17.6, 0, -16.6, 1); I.box('pedraQ', 2.0, .4, 1.2, 17.6, 0, -16.6, 0, true);
  I.cyl('madeira', .32, .26, .9, 12, 0, -7, true, 14); I.cyl('terra', .33, .33, .04, 12, .9, -7, false, 14); I.seat(16, -6.2, 2.4, 0); I.seat(11.2, -12, 2.4, PI / 2);
  I.plaque('LEI 10.639/2003', 'Ensino de história e cultura africana e afro-brasileira é obrigatório.', 19.82, 1.3, -10, -PI / 2, 2.6, .9, { fs: 16 }); I.plant(19.2, -5, 1);
};
