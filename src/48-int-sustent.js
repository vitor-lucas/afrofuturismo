/* ============================================================
   INTERIOR — Centro de Sustentabilidade
   Recepção e monitoramento · energia (solar, vento, baterias) ·
   água (cisterna, filtro, zona de raízes) · compostagem · horta.
   Painéis explicativos são esquemas didáticos; os números do painel
   de monitoramento são simulados (dados fictícios).
   ============================================================ */
const dgBase = (g, W, H, title, sub) => {
  g.fillStyle = '#10222B'; g.fillRect(0, 0, W, H); g.textBaseline = 'top'; g.fillStyle = '#F0D8A0'; g.font = 'bold ' + Math.round(H * .075) + 'px system-ui,sans-serif'; g.fillText(title, W * .03, H * .035);
  if (sub) { g.font = Math.round(H * .046) + 'px system-ui,sans-serif'; g.fillStyle = '#9FD6CC'; g.fillText(sub, W * .03, H * .035 + H * .092); }
};
const dgNode = (g, cx, cy, w, h, label, col, tc = '#10222B', sub = '') => {
  const x = cx - w / 2, y = cy - h / 2, r = h * .22; g.fillStyle = col; g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r); g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h); g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.fill();
  g.fillStyle = tc; g.textAlign = 'center'; g.textBaseline = 'middle'; const fs = Math.round(h * .27); g.font = 'bold ' + fs + 'px system-ui,sans-serif';
  if (sub) { g.fillText(label, cx, cy - fs * .55); g.font = Math.round(fs * .74) + 'px system-ui,sans-serif'; g.fillText(sub, cx, cy + fs * .62); } else g.fillText(label, cx, cy); g.textAlign = 'left'; g.textBaseline = 'top';
};
const dgArrow = (g, x1, y1, x2, y2, col = '#F0D27A', lw = 6, both = false) => {
  const a = Math.atan2(y2 - y1, x2 - x1), hs = lw * 2.6; g.strokeStyle = col; g.fillStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2 - Math.cos(a) * hs * .6, y2 - Math.sin(a) * hs * .6); g.stroke();
  const head = (x, y, ang) => { g.beginPath(); g.moveTo(x, y); g.lineTo(x - Math.cos(ang - .45) * hs, y - Math.sin(ang - .45) * hs); g.lineTo(x - Math.cos(ang + .45) * hs, y - Math.sin(ang + .45) * hs); g.closePath(); g.fill(); };
  head(x2, y2, a); if (both) head(x1, y1, a + Math.PI);
};
const dgNote = (g, x, y, txt, col = '#9FD6CC', fs = 18) => { g.fillStyle = col; g.font = fs + 'px system-ui,sans-serif'; g.textAlign = 'left'; g.textBaseline = 'top'; g.fillText(txt, x, y); };

INT.sustent = I => {
  I.name = 'Centro de Sustentabilidade'; I.H = 5; const o = { dh: 3.2, th: .3 };
  const rec = I.room('Recepção e monitoramento', -14, 3, 0, 12, { f: 'pPedra', h: 4.2, lights: [[-9, 8]], lc: 0xFFF0D8, li: 1.0, ld: 15 });
  const ene = I.room('Energia: sol, vento e baterias', 0, 3, 14, 12, { f: 'pConc', h: 5, lights: [[5, 7.5], [10, 7.5]], lc: 0xFFF4E0, li: 1.0, ld: 14 });
  const agu = I.room('Água: chuva, filtro e reúso', -14, -4, 2, 3, { f: 'pConc', h: 4.4, lights: [[-8, -0.5]], lc: 0xE8F4FF, li: 1.0, ld: 15, ceilHole: [-4.6, -3.4, 0.2, -1.8] });
  const bio = I.room('Compostagem', 2, -4, 14, 3, { f: 'pConc', h: 4.4, lights: [[8, -0.5]], lc: 0xFFF0D0, li: 1.0, ld: 14 });
  const hor = I.room('Horta comunitária', -14, -12, 14, -4, { f: 'terraSolo', h: 5, noCeil: true });
  I.sky(0, -8);
  // perímetro
  I.wx(12, -14, 14, { ...o, doors: [[-5, 3.0, 3.2]], wins: [[-1.8, 1.6, 1.4, 2.8], [2.2, 1.6, 1.4, 2.8], [12.3, 1.6, 1.4, 2.8]] });
  I.wz(-14, 3, 12, { ...o, wins: [[11.0, 1.4, 1.4, 2.8]] }); I.wz(14, 3, 12, { ...o, wins: [[8.2, 2.4, 2.2, 3.6]] });
  I.wz(-14, -4, 3, { ...o, wins: [[-0.5, 5.0, 3.5, 4.2]] }); I.wz(14, -4, 3, { ...o, wins: [[-0.5, 4.4, 3.5, 4.2]] });
  I.wz(-14, -12, -4, { ...o, h: 2.6 }); I.wz(14, -12, -4, { ...o, h: 2.6 }); I.wx(-12, -14, 14, { ...o, h: 2.6 });
  // divisórias
  I.wz(0, 3, 12, { ...o, doors: [[7.5, 2.6]] }); I.wx(3, -14, 14, { ...o, doors: [[-7, 2.4], [7, 2.4]] }); I.wz(2, -4, 3, { ...o, doors: [[-0.5, 2.4]] }); I.wx(-4, -14, 14, { ...o, doors: [[-7, 2.6], [8, 2.6]] });
  I.band(rec, 'friso', 3.8, .25); I.band(ene, 'friso', 4.6, .25); I.band(agu, 'friso', 4.0, .25); I.band(bio, 'friso', 4.0, .25);
  I.exitAt(-5, 11.2, 1.8).spawnAt(-5, 10.4, 0);

  /* ---- recepção e monitoramento ---- */
  I.counter(-10.2, 11.1, 3.0, .8, 0, 'madeiraE'); I.plaque('CENTRO DE SUSTENTABILIDADE', 'Água, energia e alimentos funcionam juntos nesta vila.', -10.2, 1.7, 11.82, PI, 2.8, .8, { fs: 16 });
  I.plant(-12.8, 11.2, 1.4); I.plant(-2.4, 11.2, 1.4); I.seat(-2.2, 6.2, 2.0, 0);
  I.diagram(-13.82, .9, 7.2, PI / 2, 5.0, 2.6, (g, W, H) => {
    dgBase(g, W, H, 'CORTE: O EDIFÍCIO COMO SISTEMA', 'Esquema didático · sem escala');
    const gy = H * .86; g.fillStyle = '#4C7A3C'; g.fillRect(0, gy, W, H - gy);
    g.fillStyle = '#C9A06A'; g.fillRect(W * .2, H * .46, W * .5, gy - H * .46); g.fillStyle = '#F5E6C8'; g.fillRect(W * .26, H * .54, W * .13, gy - H * .54); g.fillRect(W * .52, H * .54, W * .13, gy - H * .54);
    g.fillStyle = '#7A4B2A'; g.beginPath(); g.moveTo(W * .16, H * .46); g.lineTo(W * .45, H * .3); g.lineTo(W * .74, H * .46); g.closePath(); g.fill();
    g.fillStyle = '#2F6FB5'; g.beginPath(); g.moveTo(W * .24, H * .42); g.lineTo(W * .44, H * .31); g.lineTo(W * .5, H * .335); g.lineTo(W * .3, H * .445); g.closePath(); g.fill();
    g.fillStyle = '#7FA7C9'; g.fillRect(W * .78, H * .6, W * .1, gy - H * .6); g.fillStyle = '#3F8FC8'; g.fillRect(W * .78, H * .74, W * .1, gy - H * .74);
    dgArrow(g, W * .72, H * .47, W * .8, H * .6, '#9FD6CC', 4); dgNote(g, W * .62, H * .62, 'Calha → cisterna', '#9FD6CC', 20);
    g.fillStyle = '#FFD25A'; g.beginPath(); g.arc(W * .1, H * .3, H * .07, 0, 7); g.fill(); dgArrow(g, W * .15, H * .34, W * .27, H * .41, '#FFD25A', 4);
    dgNote(g, W * .03, H * .43, 'Sol: painéis no telhado', '#FFD25A', 20); dgNote(g, W * .04, H * .9, 'Vento cruza as salas e sai pelo alto', '#BFE3A0', 20);
    dgArrow(g, W * .19, H * .7, W * .27, H * .7, '#BFE3A0', 4); dgArrow(g, W * .66, H * .7, W * .74, H * .7, '#BFE3A0', 4); dgNote(g, W * .76, H * .5, 'Cisterna', '#C8E8FF', 20); dgNote(g, W * .06, H * .75, 'Horta', '#BFE3A0', 20);
  }); I.hot('sus_integracao', -12, 7.2, 1.7, { r: 3.6 });
  I.diagram(-11.1, .9, 3.18, 0, 4.2, 2.2, (g, W, H) => {
    dgBase(g, W, H, 'PAINEL DA VILA (SIMULADO)', 'Números inventados para a visita');
    const bars = [['Bateria', .78, '#7FD1A8'], ['Cisterna', .64, '#5FB0E8'], ['Solar agora', .52, '#F0D27A'], ['Horta (umidade)', .41, '#BFE3A0']]; g.textBaseline = 'middle';
    bars.forEach(([n, v, c], i) => { const y = H * .36 + i * H * .155; g.fillStyle = '#9FD6CC'; g.font = Math.round(H * .062) + 'px system-ui,sans-serif'; g.textAlign = 'left'; g.fillText(n, W * .04, y); g.fillStyle = '#23404C'; g.fillRect(W * .34, y - H * .035, W * .56, H * .07); g.fillStyle = c; g.fillRect(W * .34, y - H * .035, W * .56 * v, H * .07); g.fillStyle = '#10222B'; g.fillText(Math.round(v * 100) + '%', W * .36, y); });
  }, 0, .5); I.hot('sus_monitor', -11.1, 5.4, 1.7, { r: 3.4 });
  I.board(-2.9, 1.0, 3.18, 0, 3.8, 1.9, 'TRÊS IDEIAS', 'Reduzir o que se gasta · reaproveitar o que sobra · regenerar o que a vila usa: água, solo e energia.');
  I.hot('sus_entrada', -6, 9.2, 1.6, { r: 3.4 });

  /* ---- energia ---- */
  I.diagram(7, 1.0, 11.82, PI, 6.0, 2.6, (g, W, H) => {
    dgBase(g, W, H, 'DO SOL À TOMADA', 'Fluxo de energia da vila · esquema didático'); const y = H * .55;
    dgNode(g, W * .08, y, W * .12, H * .2, 'Sol', '#F0D27A'); dgNode(g, W * .27, y, W * .16, H * .2, 'Painéis', '#7FB3E8', '#10222B', 'nos telhados'); dgNode(g, W * .47, y, W * .15, H * .2, 'Inversor', '#CFCFCF'); dgNode(g, W * .67, y, W * .15, H * .2, 'Baterias', '#7FD1A8'); dgNode(g, W * .89, y, W * .17, H * .27, 'Usos', '#F2C9A0', '#10222B', 'edifícios');
    dgNode(g, W * .27, H * .85, W * .16, H * .14, 'Vento', '#BFE3A0'); dgNode(g, W * .47, H * .25, W * .18, H * .13, 'Rede elétrica', '#E8E0C8');
    dgArrow(g, W * .14, y, W * .19, y); dgArrow(g, W * .35, y, W * .39, y); dgArrow(g, W * .55, y, W * .59, y); dgArrow(g, W * .75, y, W * .8, y); dgArrow(g, W * .33, H * .82, W * .43, y + H * .1, '#BFE3A0'); dgArrow(g, W * .47, H * .32, W * .47, y - H * .11, '#E8E0C8', 5, true);
  }, 0, .4); I.hot('sus_energia', 7, 10, 1.7, { r: 3.2 });
  I.pedestal(4.6, 6.4, 1.0, .9); I.C.box('metalP', .06, .5, .06, 4.6, .9, 6.7); I.C.box('pv', 1.5, .05, 1.0, 4.6, 1.3, 6.4, 0, -.5, 0); I.C.sph('gOuro', .13, 3.3, 2.3, 5.1, 1, 1, 1, 10); I.hot('sus_solar', 6.6, 6.4, 1.7, { r: 3.4 });
  I.pedestal(8.4, 6.4, .8, .9); I.turbineModel(8.4, .9, 6.4, 1.5); I.plaque('SALA DE ENERGIA', 'Do sol à tomada.', .18, 1.8, 4.6, PI / 2, 1.6, .6, { fs: 15 });
  [5, 7.2, 9.4].forEach(z => { I.cabinet(13.68, z, 1.6, 1.9, -PI / 2, 0, 'metalP', .7); [0, .3, .6].forEach(k => I.C.box('gVerde', .03, .06, .03, 13.3, 1.6 + k * .1 - .1, z - .3 + k * .3)); }); I.cabinet(13.68, 11.0, 1.2, 1.5, -PI / 2, 0, 'branco', .5); I.hot('sus_baterias', 12.2, 7.6, 1.8, { r: 3.4 });

  /* ---- água ---- */
  I.diagram(-13.82, .9, -0.5, PI / 2, 5.6, 2.4, (g, W, H) => {
    dgBase(g, W, H, 'O CAMINHO DA ÁGUA', 'Chuva e águas cinzas · esquema didático'); const y1 = H * .42, y2 = H * .8;
    dgNode(g, W * .1, y1, W * .14, H * .17, 'Chuva', '#9AD0F5'); dgNode(g, W * .29, y1, W * .16, H * .17, 'Calhas', '#CFCFCF'); dgNode(g, W * .48, y1, W * .17, H * .17, 'Filtro', '#E8D9A8'); dgNode(g, W * .67, y1, W * .16, H * .17, 'Cisterna', '#5FB0E8'); dgNode(g, W * .89, y1, W * .19, H * .2, 'Usos', '#F2C9A0', '#10222B', 'descarga · limpeza');
    dgNode(g, W * .1, y2, W * .15, H * .17, 'Pias', '#CFCFCF'); dgNode(g, W * .3, y2, W * .18, H * .17, 'Caixa de gordura', '#E8E0C8'); dgNode(g, W * .52, y2, W * .18, H * .17, 'Zona de raízes', '#7FD1A8'); dgNode(g, W * .77, y2, W * .17, H * .17, 'Reúso', '#BFE3A0', '#10222B', 'irrigação');
    [[.17, .21], [.37, .4], [.57, .59], [.75, .8]].forEach(([a, b]) => dgArrow(g, W * a, y1, W * b, y1, '#9FD6CC')); [[.18, .21], [.39, .43], [.61, .68]].forEach(([a, b]) => dgArrow(g, W * a, y2, W * b, y2, '#BFE3A0'));
  }, 0, .4); I.hot('sus_agua', -11.0, -0.5, 1.7, { r: 3.2 });
  I.tank(-3.2, 1.7, 1.1, 2.4, 0, 'conc', true); I.C.cyl('metalP', .07, .07, 2.0, -3.2, 2.4, 0.9, 8); I.C.box('metalP', 2.6, .07, .07, -4.5, 4.35, 0.9); I.C.cyl('metalP', .07, .07, 2.0, -5.8, 2.4, 0.9, 8); I.hot('sus_cisterna', -3.2, .0, 1.6, { r: 3.0 });
  [0, 1, 2].forEach(k => { const x = -11.4 + k * .8; I.C.cyl('metalP', .27, .27, .08, x, 0, 1.9, 14); I.C.cyl('cascalho', .22, .22, .5, x, .08, 1.9, 14); I.C.cyl('areia', .22, .22, .5, x, .58, 1.9, 14); I.C.cyl('preto', .22, .22, .5, x, 1.08, 1.9, 14); I.C.cyl('metalP', .27, .27, .08, x, 1.58, 1.9, 14); I.C.cyl('metalP', .05, .05, .5, x, 1.66, 1.9, 8); I.colO(x, 1.9, .5, .5, 0, 0); });
  I.bed(-2.2, -2.6, 4.6, 1.6, 0, .55, 'fC'); I.C.box('agua', 4.2, .02, .24, -2.2, .56, -1.95); I.hot('sus_raizes', -2.2, -1.0, 1.6, { r: 3.4 });
  I.plaque('SALA DA ÁGUA', 'Chuva guardada, água cinza tratada.', -13.82, 1.8, 2.2, PI / 2, 1.8, .55, { fs: 14 });

  /* ---- compostagem ---- */
  [4.5, 6.3, 8.1].forEach((x, i) => { const s = I.C.sub(x, 0, -1.2, 0); s.box('madeira', 1.6, 1.1, .06, 0, 0, -.65); s.box('madeira', .06, 1.1, 1.3, -.77, 0, 0); s.box('madeira', .06, 1.1, 1.3, .77, 0, 0); s.box('madeira', 1.5, .12, .05, 0, .1, .65); s.box('madeira', 1.5, .12, .05, 0, .5, .65); s.box(['terraD', 'terra', 'terraSolo'][i], 1.48, [.9, .7, .45][i], 1.2, 0, .05, 0); I.colO(x, -1.2, 1.6, 1.3, 0, 0); });
  ['1 · FRESCO', '2 · MATURANDO', '3 · PRONTO'].forEach((t, i) => I.plaque(t, '', 4.5 + i * 1.8, 1.25, -0.52, 0, 1.4, .3, { fs: 13 }));
  [0, 1, 2].forEach(k => I.C.box('preto', 1.0, .22, .7, 11.6, .3 * k, -2.4)); I.C.box('metalP', 1.1, .05, .8, 11.6, .9, -2.4); I.C.sph('fA', .12, 11.4, .98, -2.4, 1, .6, 1, 6);
  I.diagram(13.82, .9, -0.5, -PI / 2, 4.4, 2.4, (g, W, H) => {
    dgBase(g, W, H, 'O CICLO DO ALIMENTO', 'Nada se perde, tudo se transforma'); const cx = W * .5, cy = H * .6, rx = W * .34, ry = H * .27, L = [['Restos', '#E8D9A8'], ['Compostagem', '#C9A06A'], ['Composto', '#8A6B4A'], ['Horta', '#7FD1A8'], ['Alimentos', '#F2C9A0'], ['Cozinha', '#E8E0C8']];
    L.forEach(([t, c], i) => { const a = -Math.PI / 2 + i * Math.PI / 3, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry, b = -Math.PI / 2 + (i + 1) * Math.PI / 3, x2 = cx + Math.cos(b) * rx, y2 = cy + Math.sin(b) * ry; const mx = (x + x2) / 2, my = (y + y2) / 2; dgArrow(g, x + (x2 - x) * .3, y + (y2 - y) * .3, x + (x2 - x) * .7, y + (y2 - y) * .7, '#F0D27A', 4); dgNode(g, x, y, W * .2, H * .13, t, c); });
  }, 0, .4); I.hot('sus_compost', 7.0, 0.5, 1.6, { r: 4.2 });
  I.plaque('COMPOSTAGEM', 'Restos viram adubo.', 2.18, 1.7, 1.9, PI / 2, 1.6, .55, { fs: 14 });

  /* ---- horta comunitária ---- */
  [-8.3, -3.9, 3.9, 8.3].forEach((x, i) => [-6.4, -9.4].forEach((z, k) => I.bed(x, z, 3.2, 1.1, 0, .55, ['fA', 'fB', 'fC', 'fD'][(i + k) % 4], i === 1 && k === 0)));
  I.treeIn(0, -8.6, .9); I.seat(-1.8, -7.0, 1.6, PI / 2); I.seat(1.8, -7.0, 1.6, -PI / 2);
  I.tank(-13.0, -5.2, .42, .95, 0, 'azul', false); I.tank(-13.0, -6.6, .42, .95, 0, 'azul', false); I.tank(13.0, -5.2, .42, .95, 0, 'azul', false);
  I.plaque('HORTA COMUNITÁRIA', 'Cultivo coletivo, adubo da compostagem, água da cisterna.', 0, 1.6, -11.82, 0, 4.4, .75, { fs: 17 }); I.hot('sus_horta', 0, -5.6, 1.5, { r: 4.4 });
};
