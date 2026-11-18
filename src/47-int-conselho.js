/* ============================================================
   INTERIOR — Casa do Conselho
   Átrio de acolhimento, plenária circular, sala de comissões
   e mesa de orçamento participativo (valores fictícios).
   ============================================================ */
INT.conselho = I => {
  I.name = 'Casa do Conselho'; I.H = 9; const o = { dh: 3.2, th: .3 };
  const atr = I.room('Átrio de acolhimento', -10, 2, 4, 12, { f: 'pPedra', h: 4.4, lights: [[-3, 7], [-3, 10]], lc: 0xFFE8C8, li: 1.0, ld: 13 });
  const pl = I.room('Plenária circular', -10, -12, 10, 2, { f: 'pMad', h: 9, noCeil: false, ceilHole: [-2.2, -7.2, 2.2, -2.8], lights: [[0, -9]], lc: 0xFFF0D8, li: 1.4, ld: 24 });
  const com = I.room('Sala de comissões', 4, 2, 10, 12, { f: 'pMad', h: 4.2, lc: 0xFFE2B8 });
  I.sky(0, -5);
  I.wx(12, -10, 10, { ...o, doors: [[0, 3.6, 3.4]], wins: [[-7.6, 2.0, 1.4, 3.0], [7.6, 2.0, 1.4, 3.0]] });
  I.wz(-10, 2, 12, { ...o, wins: [[4.6, 2.0, 1.2, 2.8], [10.8, 1.6, 1.2, 2.8]] }); I.wz(10, 2, 12, { ...o, wins: [[3.6, 1.6, 1.2, 2.8], [10.6, 1.6, 1.2, 2.8]] });
  I.wz(-10, -12, 2, { ...o, wins: [[-9, 3, 5.2, 8], [-5, 3, 5.2, 8], [-1, 3, 5.2, 8]] }); I.wz(10, -12, 2, { ...o, wins: [[-9, 3, 5.2, 8], [-5, 3, 5.2, 8], [-1, 3, 5.2, 8]] });
  I.wx(-12, -10, 10, { ...o, wins: [[-6, 3, 5.2, 8], [0, 3, 5.2, 8], [6, 3, 5.2, 8]] });
  I.wx(2, -10, 10, { ...o, doors: [[0, 4.4, 3.6]] }); I.wz(4, 2, 12, { ...o, doors: [[7, 2.2]] });
  I.band(atr, 'friso', 3.9, .3); I.band(pl, 'kente', 4.6, .4); I.band(com, 'friso', 3.7, .3);
  I.exitAt(0, 11.2, 1.8).spawnAt(0, 10.4, 0);
  // luzes de enchimento da plenária (altura de pessoas)
  [[-5.5, -5], [5.5, -5], [0, -10], [0, -0.4]].forEach(([x, z]) => I.light(x, 3.4, z, 0xFFE2B8, .75, 12));

  /* ---- átrio ---- */
  I.counter(-4.4, 11.1, 3.0, .8, 0, 'madeiraE'); I.plaque('RECEPÇÃO', 'Informe-se sobre as reuniões e peça apoio para participar.', -4.4, 1.7, 11.82, PI, 2.4, .7, { fs: 16 });
  I.seat(2.6, 9.4, 2.0, 0); I.seat(2.6, 5.4, 2.0, 0); I.plant(3.0, 11.3, 1.3); I.plant(-9.2, 11.2, 1.4); I.plant(-0.3, 3.0, 1.2);
  I.board(-7, 1.0, 2.18, 0, 4.0, 1.9, 'PAUTA E DECISÕES (EXEMPLO)', 'Horta da escola · aprovada · prazo: março. Linha de ônibus até o mercado · em debate. Reforma da quadra · aguardando orçamento. As atas ficam abertas a qualquer pessoa.');
  I.hot('cons_mural', -7, 4.2, 1.5, { r: 3.0 }); I.hot('cons_entrada', -0.6, 8.4, 1.6, { r: 3.2 });
  // piso tátil da porta até a plenária
  I.C.box('amarelo', .4, .012, 9.2, 0, 0, 6.8); I.C.box('amarelo', 1.6, .012, .4, 0, 0, 2.4);
  // cantinho das crianças
  I.rug(-7.6, 8.2, 3.6, 3.4, 'tecidoV'); I.rug(-7.6, 8.2, 2.4, 2.2, 'tecidoO');
  I.table(-7.6, 8.2, 1.0, .7, .45, 0, 'madeiraE'); [[-8.4, 8.2, PI / 2], [-6.8, 8.2, -PI / 2], [-7.6, 7.5, 0], [-7.6, 8.9, PI]].forEach(([x, z, r]) => I.cyl('azul', .16, .16, .28, x, 0, z, false, 10));
  ['vermelho', 'amarelo', 'verde', 'azul'].forEach((m, i) => I.box(m, .22, .22, .22, -9.1 + i * .3, 0, 6.9 + (i % 2) * .26, i * .4));
  I.shelf(-9.68, 10.0, 1.8, PI / 2, 3, 1.0); I.plaque('CANTINHO DAS CRIANÇAS', 'Cuidado infantil enquanto as famílias participam.', -9.8, 1.5, 8.0, PI / 2, 2.4, .7, { fs: 15 });
  I.hot('cons_cuidado', -7.6, 8.2, 1.2, { r: 3.4 });

  /* ---- plenária circular ---- */
  const cx = 0, cz = -5;
  [3.9, 5.2, 6.5].forEach(R => { const n = Math.floor((2 * Math.PI - 1.3) * R / 1.45), da = (2 * Math.PI - 1.3) / n; for (let i = 0; i < n; i++) { const a = .65 + da * (i + .5); [1, -1].forEach(sg => { const A = a * sg; I.box('madeira', 1.3, .08, .44, cx + Math.sin(A) * R, .42, cz + Math.cos(A) * R, A, true); }); I.C.box('madeiraE', .06, .42, .38, cx + Math.sin(a) * R, 0, cz + Math.cos(a) * R, a); I.C.box('madeiraE', .06, .42, .38, cx + Math.sin(-a) * R, 0, cz + Math.cos(-a) * R, -a); } });
  I.cyl('madeiraE', 1.45, 1.45, .08, cx, .66, cz, true, 24); I.C.cyl('madeiraE', .3, .5, .66, cx, 0, cz, 14); I.C.cyl('ouro', 1.5, 1.5, .02, cx, .74, cz, 24);
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; I.chair(cx + Math.sin(a) * 2.15, cz + Math.cos(a) * 2.15, a + PI); }
  I.cyl('tecidoV', 2.9, 2.9, .02, cx, 0, cz, false, 36);
  // lanterna central: anel de luz suspenso sob a abertura zenital
  for (let k = 0; k < 24; k++) { const a = k * Math.PI / 12; I.C.box('gLuz', .62, .09, .12, cx + Math.sin(a) * 2.3, 5.8, cz + Math.cos(a) * 2.3, a); } [0, 2.1, 4.2].forEach(a => I.C.cyl('metalP', .015, .015, 3.2, cx + Math.sin(a) * 2.3, 5.9, cz + Math.cos(a) * 2.3, 6));
  I.pattern(0, 2.0, -11.82, 0, 7.2, 2.4, 'friso'); I.plaque('PLENÁRIA CIRCULAR', 'Em roda, todas as pessoas se veem.', 0, 4.1, -11.82, 0, 4.4, .8, { fs: 20 });
  I.screen(-9.82, 1.7, -3.0, PI / 2, 2.6, 1.3, 'LIBRAS E LEGENDA AO VIVO (PROPOSTA)', 'Tela com intérprete e transcrição das falas.');
  I.hot('cons_plenaria', 0, -0.9, 1.4, { r: 3.4 }); I.hot('cons_lanterna', 0, -7.4, 1.8, { r: 2.4 });

  /* ---- sala de comissões ---- */
  I.table(7, 7, 1.3, 4.6, .75, 0, 'madeiraE'); for (let k = 0; k < 4; k++) { I.chair(5.9, 5.1 + k * 1.25, PI / 2); I.chair(8.1, 5.1 + k * 1.25, -PI / 2); }
  [[0, .12, 'ouro'], [1, .22, 'vermelho'], [2, .17, 'verde'], [3, .26, 'azul']].forEach(([k, h, m]) => { I.C.cyl(m, .22, .22, h, 7, .75, 5.6 + k * 1.05, 14); I.C.cyl('gOuro', .22, .22, .01, 7, .75 + h, 5.6 + k * 1.05, 14); });
  I.board(9.82, 1.1, 7, -PI / 2, 3.4, 1.8, 'ORÇAMENTO PARTICIPATIVO (EXEMPLO FICTÍCIO)', 'Fichas: Saúde 30 · Escola 25 · Cultura 20 · Mobilidade 25. Os valores são inventados para ensinar o processo.');
  I.plaque('SALA DE COMISSÕES', 'Grupos de trabalho por tema.', 4.18, 1.8, 10.3, PI / 2, 1.6, .6, { fs: 14 }); I.plant(9.3, 11.2, 1.3);
  I.hot('cons_orcamento', 7, 7, 1.4, { r: 3.6 });
};
