/* ============================================================
   PRAÇA CENTRAL E ESPAÇOS ABERTOS (monumento, palco, horta, energia,
   água, mobilidade, portal de entrada, círculo da memória)
   ============================================================ */
const CROP = ['#4C8C3A', '#6AA35A', '#8BC34A', '#3E7F4E', '#C9503A', '#E8B23A', '#5E9150'];
const ringGeo = (r0, r1, seg = 64) => new T.RingGeometry(r0, r1, seg);
function artPanel(c, w, h, x, y, z, ry, seed, mode) { // painel de arte abstrata (obra fictícia, sem referência a artistas reais)
  const tex = new T.CanvasTexture(artCanvas(512, Math.round(512 * h / w), seed, mode)); tex.encoding = T.sRGBEncoding; tex.anisotropy = 8;
  const m = new T.MeshStandardMaterial({ map: tex, roughness: .8 }); m.envMapIntensity = .5; m.userData = { env0: .5 }; envMats.push(m);
  const me = new T.Mesh(new T.PlaneGeometry(w, h), m); me.matrixAutoUpdate = false; me.matrix.copy(c.M4(x, y + h / 2, z, ry)); me.matrixWorldNeedsUpdate = true; me.receiveShadow = true; cityG.add(me); return me;
}
function fence(c, x0, z0, x1, z1, h = 1.1, m = 'madeiraE', step = 2.6) { // cerca de ripas com duas travessas
  const L = Math.hypot(x1 - x0, z1 - z0), a = Math.atan2(x1 - x0, z1 - z0), n = Math.max(1, Math.round(L / step)), sx = Math.sin(a), sz = Math.cos(a);
  for (let i = 0; i <= n; i++) c.box(m, .12, h, .12, x0 + sx * L * i / n, 0, z0 + sz * L * i / n);
  [.35, h - .12].forEach(y => c.box(m, .06, .08, L, (x0 + x1) / 2, y, (z0 + z1) / 2, a));
}
function crops(c, x, z, w, d, y, n) { for (let i = 0; i < n; i++) { const [wx, wz] = c.w2(x + (rnd() - .5) * w, z + (rnd() - .5) * d); V.bush.add(wx, y + .16, wz, .28, .24 + rnd() * .1, .28, rnd() * 3, pick(CROP)); } }

/* ---------- Monumento central: coluna de terra com copa de lanternas ---------- */
function bMonumento(c) {
  c.cyl('pedraQ', 5.2, 5.4, .3, 0, 0, 0, 40); c.cyl('pPedra', 4.4, 4.6, .3, 0, .3, 0, 40); c.cyl('pedraQ', 3.5, 3.7, .3, 0, .6, 0, 40);
  EXT.circ.push({ x: c.x0, z: c.z0, r: 3.9 });
  // coluna de terra batida, afilada, com frisos geométricos (padrão inspirado em têxteis; sem significado atribuído)
  c.cyl('terra', 1.15, 1.6, 10.4, 0, .9, 0, 24); [3.2, 5.6, 8].forEach((y, i) => c.cyl('friso', 1.42 - i * .08, 1.45 - i * .08, .85, 0, y, 0, 24));
  for (let k = 0; k < 16; k++) { const a = k * TAU / 16; c.box('madeiraE', .13, .13, .9, Math.sin(a) * 1.62, 1.6 + (k % 2) * .5, Math.cos(a) * 1.62, a); }
  // copa: oito braços que sobem e se abrem como galhos de uma árvore estilizada, terminando em lanternas
  for (let k = 0; k < 8; k++) {
    const a = k * TAU / 8, tilt = .62 + (k % 2) * .2, len = 4.4 + (k % 2) * .9, sy = 11.0, cx = Math.sin(a) * (1 + Math.sin(tilt) * len * .5), cz = Math.cos(a) * (1 + Math.sin(tilt) * len * .5), cy = sy + Math.cos(tilt) * len * .5;
    c.box('metalP', .17, len, .17, cx, cy - len / 2, cz, a, tilt);
    c.sph('gOuro', .34, Math.sin(a) * (1 + Math.sin(tilt) * len), sy + Math.cos(tilt) * len + .1, Math.cos(a) * (1 + Math.sin(tilt) * len), 1, 1, 1, 10);
  }
  c.cyl('ouro', 1.0, 1.1, .3, 0, 11.0, 0, 24); c.sph('gOuro', .65, 0, 12.2, 0, 1, 1, 1, 12);
  return { W: 10, D: 10, H: 14, lbl: 15, R: 6 };
}

/* ---------- Praça: espelho d'água, pontes, bancos, murais, árvores ---------- */
function bPraca(c) {
  const Y = .1, P = c.sub(0, Y, 0);
  c.flat('pedraQ', ringGeo(4.9, 9.0, 64), 0, Y + .02, 0, 12); c.flat('pPedra', ringGeo(9.0, 9.6, 64), 0, Y + .05, 0, 10); c.flat('agua', ringGeo(5.6, 8.5, 64), 0, Y + .08, 0, 12);
  c.cyl('pedraQ', 9.0, 9.0, .06, 0, Y, 0, 64, true); c.cyl('pedraQ', 9.6, 9.6, .1, 0, Y, 0, 64, true);
  [0, 90, 180, 270].forEach(d => { const a = d * PI / 180; c.box('pPedra', 2.4, .11, 4.6, Math.sin(a) * 7, Y, Math.cos(a) * 7, a); });
  // intarsias de latão no piso
  [11.2, 15.2, 17.7].forEach(r => c.flat('ouro', ringGeo(r, r + .12, 96), 0, Y + .03, 0, 4));
  // bancos em anel, voltados ao monumento (sem o trecho do palco)
  for (let k = 0; k < 16; k++) { const deg = k * 22.5 + 11.25; if (deg > 150 && deg < 210) continue; const a = deg * PI / 180, r = 12.2, x = Math.sin(a) * r, z = Math.cos(a) * r; bench(P, x, z, a + PI, 2.2); c.col(x, z, 2.2, .6, a + PI); }
  // murais de arte abstrata fictícia
  [45, 135, 225, 315].forEach((d, i) => {
    const a = d * PI / 180, r = 16.2, x = Math.sin(a) * r, z = Math.cos(a) * r, ry = a + PI, s = c.sub(x, Y, z, ry);
    s.box('pedraQ', 7.6, .3, 1.1, 0, 0, 0); s.box('terra', 7.2, 3.5, .45, 0, .3, 0); s.box('pedraQ', 7.6, .26, .7, 0, 3.8, 0);
    artPanel(s, 6.5, 3.0, 0, .55, .235, 0, 13 + i * 7, i % 4);
    c.col(x, z, 7.6, 1.1, ry); planterBox(c, Math.sin(a) * 14.0, Math.cos(a) * 14.0, 5.4, .9, ry);
  });
  // árvores e postes de luz no perímetro
  for (let k = 0; k < 8; k++) { const a = (22.5 + 45 * k) * PI / 180; tr(c, Math.sin(a) * 17.2, Math.cos(a) * 17.2, 1.05); }
  for (let k = 0; k < 16; k++) { const a = (11.25 + 22.5 * k) * PI / 180; lampPost(Math.sin(a) * 18.4, Math.cos(a) * 18.4, a + PI); }
  return { W: 38, D: 38, H: .4, lbl: 2, R: 19 };
}

/* ---------- Palco com concha acústica ---------- */
function bPalco(c) {
  const R = 5.2, Y = .8;
  c.box('pConc', 2 * R, Y, 7.8, 0, 0, -1.3); c.box('madeiraE', 2 * R - .4, .06, 7.4, 0, Y, -1.3); c.col(0, -1.3, 2 * R, 7.8);
  steps(c, 0, 2.6, 5, 3, Y / 3, .45, 'pedraQ');
  c.geoM('concD', new T.CylinderGeometry(R + .1, R + .1, 5.4, 28, 1, true, PI / 2, PI), 0, Y + 2.7, -1.3 + 0, 0, 0, 0, 8, 5);
  c.geoM('madD', new T.CylinderGeometry(R - .35, R - .35, 4.8, 28, 1, true, PI / 2, PI), 0, Y + 2.7, -1.3, 0, 0, 0, 8, 5);
  c.flat('concD', new T.CircleGeometry(R + .3, 28, 0, PI), 0, Y + 5.4, -1.3, 10);
  [-R + .2, R - .2].forEach(x => c.cyl('metalP', .1, .1, 5.2, x, Y, 2.3, 8));
  c.box('metalP', 2 * R, .25, .25, 0, Y + 5.0, 2.3);
  [-3.6, -1.2, 1.2, 3.6].forEach(x => { c.box('aco', .28, .28, .28, x, Y + 4.7, 2.2); c.box('gBranco', .2, .05, .2, x, Y + 4.64, 2.2); });
  sign(c, 'PALCO DA PRAÇA', 0, Y + 5.45, 2.3, 4.4, .6, 0, { bg: '#2a1a10' });
  return { W: 11, D: 10, H: 7, lbl: 7.5, pcz: -1.3, R: 7 };
}

/* ---------- Horta comunitária ---------- */
function bHorta(c) {
  const W = 34, D = 26, hw = 17, hd = 13;
  c.box('terraSolo', W, .05, D, 0, 0, 0); c.box('cascalho', 2.4, .08, D, 0, 0, 0); c.box('cascalho', W, .08, 1.6, 0, 0, -2.2);
  const xs = [5.2, 13.3], zs = [-10.2, -6.4, 1.4, 5.2, 9.0];
  zs.forEach(z => xs.forEach(x => { c.box('madeira', 7.4, .45, 1.5, x, 0, z); c.box('terraSolo', 7.1, .06, 1.2, x, .45, z); crops(c, x, z, 6.8, 1.0, .5, 15); c.col(x, z, 7.4, 1.5); }));
  // estufa
  c.box('terraSolo', 9.4, .06, 6.4, -9.8, 0, -7); c.box('vidroT', 9, 2.6, 6, -9.8, .06, -7); c.box('metalP', 9.2, .14, 6.2, -9.8, 2.66, -7);
  [-4.5, 0, 4.5].forEach(dx => [-3, 3].forEach(dz => c.box('metalP', .1, 2.7, .1, -9.8 + dx, 0, -7 + dz)));
  c.box('madeira', 8, .3, 1.2, -9.8, .0, -9.6); c.box('terraSolo', 7.7, .06, .9, -9.8, .3, -9.6); crops(c, -9.8, -9.6, 7.4, .6, .35, 10); c.col(-9.8, -7, 9.2, 6.2);
  // caixas d'água e composteiras
  [-5.4, -2.6].forEach(z => { c.cyl('aco', 1.0, 1.0, 2.4, -15, 0, z - 6.4 + 1.8, 18); c.col(-15, z - 6.4 + 1.8, 2, 2); });
  [0, 1, 2].forEach(i => { c.box('madeira', 2.4, 1.2, 1.8, -14 + i * 2.7, 0, 2.2); c.box('terraSolo', 2.1, .08, 1.5, -14 + i * 2.7, 1.2, 2.2); c.col(-14 + i * 2.7, 2.2, 2.4, 1.8); });
  // casinha de ferramentas com painel solar
  c.box('rebocoB', 4.2, 2.6, 3.2, -8, 0, 8.6); c.box('concE', 4.8, .18, 3.8, -8, 2.6, 8.6); pvArray(c, -8, 2.6, 8.6, 4.4, 3.2, 2, 1, .2); doorF(c, -8, 0, 10.21, 1.1, 2.1, 0, { fr: 'madeiraE' }); c.col(-8, 8.6, 4.2, 3.2);
  // mesa de sementes
  c.box('madeira', 3.2, .08, 1.0, -13, .8, 8.4); [-1.4, 1.4].forEach(x => [-.35, .35].forEach(z => c.box('madeiraE', .08, .8, .08, -13 + x, 0, 8.4 + z))); c.col(-13, 8.4, 3.2, 1.0);
  // espantalho
  c.box('madeiraE', .08, 1.7, .08, 9.3, 0, -3.6); c.box('madeiraE', 1.3, .07, .07, 9.3, 1.25, -3.6); c.sph('tecidoO', .17, 9.3, 1.78, -3.6); c.cone('madeiraE', .36, .22, 9.3, 1.86, -3.6, 10, 0); c.box('tecido', .5, .6, .2, 9.3, .78, -3.6);
  // cerca e portal de entrada
  fence(c, -hw, -hd, hw, -hd); fence(c, -hw, -hd, -hw, hd); fence(c, hw, -hd, hw, hd); fence(c, -hw, hd, -2.2, hd); fence(c, 2.2, hd, hw, hd);
  c.col(0, -hd, W, .2); c.col(-hw, 0, .2, D); c.col(hw, 0, .2, D); c.col(-9.6, hd, 14.8, .2); c.col(9.6, hd, 14.8, .2);
  [-2.4, 2.4].forEach(x => c.cyl('madeiraE', .14, .14, 2.9, x, 0, hd, 8)); c.box('madeiraE', 5.2, .22, .22, 0, 2.7, hd); sign(c, 'HORTA COMUNITÁRIA', 0, 1.98, hd + .13, 3.6, .66, 0);
  tr(c, 15, 11.4, .9); tr(c, -15.5, 11.6, .9); tr(c, 15.4, -11.4, .9);
  return { W: 34, D: 26, fd: 26, H: 5, lbl: 5, access: [[0, 13]] };
}

/* ---------- Parque de energia: solar fotovoltaica, eólica, baterias ---------- */
function bEnergia(c) {
  const W = 36, D = 28, hw = 18, hd = 14;
  c.box('cascalho', W, .06, D, 0, 0, 0);
  [-9, -4.4, .2].forEach(z => { pvArray(c, 0, .22, z, 30, 3.5, 12, 1, .46); c.col(0, z, 30, 3.4); });
  [-8, 0, 8].forEach((x, i) => { c.box('branco', 6, 2.6, 2.4, x, 0, 9.5); c.box('gTur', 5.6, .12, .06, x, 2.0, 10.72); for (let g = 0; g < 8; g++) c.box('metalP', .5, .6, .06, x - 2.4 + g * .68, .5, 10.72); c.col(x, 9.5, 6, 2.4); });
  c.box('rebocoB', 5.2, 3.2, 3.6, 13.5, 0, 4.5); c.box('concE', 5.8, .2, 4.2, 13.5, 3.2, 4.5); doorF(c, 13.5, 0, 6.31, 1.1, 2.1, 0, { fr: 'madeiraE' }); c.col(13.5, 4.5, 5.2, 3.6);
  turbine(c, -15.2, 7.5, 15, 1.4); c.col(-15.2, 7.5, .8, .8); turbine(c, 15.2, -9.5, 15, 1.4); c.col(15.2, -9.5, .8, .8);
  fence(c, -hw, -hd, hw, -hd, 1.8, 'aco', 3); fence(c, -hw, -hd, -hw, hd, 1.8, 'aco', 3); fence(c, hw, -hd, hw, hd, 1.8, 'aco', 3); fence(c, -hw, hd, -2.5, hd, 1.8, 'aco', 3); fence(c, 2.5, hd, hw, hd, 1.8, 'aco', 3);
  c.col(0, -hd, W, .2); c.col(-hw, 0, .2, D); c.col(hw, 0, .2, D); c.col(-10.3, hd, 15.6, .2); c.col(10.3, hd, 15.6, .2);
  [-2.7, 2.7].forEach(x => c.cyl('aco', .12, .12, 3.2, x, 0, hd, 8)); c.box('aco', 5.8, .2, .2, 0, 3.1, hd); sign(c, 'PARQUE DE ENERGIA', 0, 2.35, hd + .12, 3.8, .66, 0, { bg: '#10233a', fg: '#9FE6D9' });
  return { W: 36, D: 28, fd: 28, H: 16, lbl: 16.5, access: [[0, 14]] };
}

/* ---------- Reservatório e lagoa de captação ---------- */
function bReserv(c) {
  const W = 30, D = 26;
  c.box('gramaE', W, .04, D, 0, 0, 0);
  c.flat('agua', new T.CircleGeometry(7.6, 40), 0, .1, 2, 14); c.flat('pedraQ', ringGeo(7.6, 8.4, 40), 0, .12, 2, 8); c.cyl('pedraQ', 7.6, 7.6, .2, 0, 0, 2, 40, true); c.flat('calcada', ringGeo(8.4, 10.2, 40), 0, .1, 2, 8);
  EXT.circ.push({ x: c.w2(0, 2)[0], z: c.w2(0, 2)[1], r: 7.9 });
  for (let i = 0; i < 90; i++) { const a = rnd() * TAU, r = 6.4 + rnd() * 1.6, [wx, wz] = c.w2(Math.sin(a) * r, 2 + Math.cos(a) * r); V.reed.add(wx, .1 + .5, wz, 1, .5 + rnd() * .55, 1, rnd() * 3, pick(['#5E9150', '#4A8A5A', '#6AA35A'])); }
  // passarela de madeira sobre a lagoa
  c.box('madeira', 1.6, .15, 6.2, 0, .5, 7.2 - 4.2 + 2); [-1, 1].forEach(sg => [-.8, 1.5].forEach(z => c.cyl('madeiraE', .06, .06, .5, sg * .7, 0, 2.2 + z)));
  // caixa d'água elevada
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => c.box('conc', .5, 8.5, .5, -9.5 + sx * 1.9, 0, -8.5 + sz * 1.9)); c.box('conc', 4.8, .3, 4.8, -9.5, 8.5, -8.5);
  c.cyl('terra', 2.7, 2.7, 3.6, -9.5, 8.8, -8.5, 28); c.cyl('friso', 2.74, 2.74, .9, -9.5, 10.0, -8.5, 28); c.cone('telhaM', 2.9, 1.2, -9.5, 12.4, -8.5, 20, 0); c.cyl('gAzul', 2.72, 2.72, .12, -9.5, 8.84, -8.5, 28);
  c.box('metalP', .1, 8.6, .1, -7.35, 0, -8.5); for (let k = 0; k < 14; k++) c.box('metalP', .6, .04, .04, -7.35, .5 + k * .6, -8.5); c.col(-9.5, -8.5, 4.8, 4.8);
  // casa de bombas e canais de drenagem vegetados
  c.box('rebocoB', 5, 3, 4, 9.5, 0, -8.5); c.box('concE', 5.6, .2, 4.6, 9.5, 3, -8.5); pvArray(c, 9.5, 3.2, -8.5, 4.6, 3.6, 3, 1, .22); doorF(c, 9.5, 0, -6.51, 1.1, 2.1, 0, { fr: 'madeiraE' }); c.col(9.5, -8.5, 5, 4);
  c.box('cascalho', 1.6, .05, 12, 11.5, .02, 4); c.box('agua', .8, .03, 12, 11.5, .06, 4); for (let i = 0; i < 20; i++) { const [wx, wz] = c.w2(11.5 + (rnd() - .5) * 1.8, -1.5 + rnd() * 11); V.reed.add(wx, .1 + .4, wz, 1, .4 + rnd() * .4, 1, rnd() * 3, '#6AA35A'); }
  [-1, 1].forEach(sg => bench(c, sg * 9.4, 3.2, -sg * PI / 2 + PI, 1.8)); tr(c, -12, 8, 1.1); tr(c, 12, 10, 1.1); tr(c, -11, -1, .9);
  sign(c, 'RESERVATÓRIO E\nLAGOA DE CAPTAÇÃO', -4.2, .0 + 0.9, 12.4, 3.4, 1.0, 0, { bg: '#10233a', fg: '#9FE6D9' }); c.cyl('madeiraE', .1, .1, 1.0, -5.6, 0, 12.3, 8); c.cyl('madeiraE', .1, .1, 1.0, -2.8, 0, 12.3, 8);
  return { W: 30, D: 26, fd: 26, H: 13, lbl: 14, access: [[0, 12.2]] };
}

/* ---------- Ponto de mobilidade: ônibus elétrico, bicicletas, recarga ---------- */
function bMobilidade(c) {
  const W = 18, D = 9;
  c.box('pConc', W, .16, D, 0, 0, 0);
  [-5.5, 5.5].forEach(x => [-1.6, 1.6].forEach(z => c.cyl('metalP', .08, .08, 2.9, x, .16, z - 1.4, 8)));
  c.box('concE', 12.8, .16, 4.6, 0, 3.05, -1.4); pvArray(c, 0, 3.2, -1.4, 12, 4, 6, 1, .2); c.box('vidroT', 11, 2.0, .06, 0, .6, -3.5); bench(c, -2.4, -2.6, 0, 3); bench(c, 2.4, -2.6, 0, 3);
  c.col(-2.4, -2.9, 3, .6); c.col(2.4, -2.9, 3, .6);
  sign(c, 'PONTO DE MOBILIDADE', 0, 3.25, 1.0, 5, .65, 0, { bg: '#10233a', fg: '#9FE6D9' });
  // bicicletas compartilhadas
  bikeRack(c, -7.9, 2.4, PI / 2, 5); for (let i = 0; i < 4; i++) { const z = 2.4 + i * .6, s = c.sub(-7.4, .16, z, PI / 2); s.geoM('metalP', new T.TorusGeometry(.33, .025, 6, 16), 0, .35, .52, PI / 2, 0, 0); s.geoM('metalP', new T.TorusGeometry(.33, .025, 6, 16), 0, .35, -.52, PI / 2, 0, 0); s.box('verde', .05, .05, 1.1, 0, .55, 0); s.box('metalP', .04, .4, .04, 0, .55, -.45); }
  c.col(-7.9, 3.6, 1.2, 3.4);
  [-1, 1, 3].forEach(x => { evCharger(c, 4 + x * 1.2, 3.5, 0); c.col(4 + x * 1.2, 3.5, .5, .4); });
  c.box('marcaT', 6, .01, 2.2, 5.2, .17, 4.0);
  return { W: 18, D: 9, fd: 9, H: 4.5, lbl: 5, R: 11, access: [[0, 4.5]] };
}

/* ---------- Portal de entrada ---------- */
function bPortal(c) {
  [-1, 1].forEach(sg => {
    const x = sg * 8.6;
    c.box('pedraQ', 4.4, .5, 4.4, x, 0, 0); c.box('terra', 3.4, 9, 3.4, x, .5, 0); c.box('friso', 3.46, .9, 3.46, x, 5.1, 0); c.box('friso', 3.46, .9, 3.46, x, 2.4, 0);
    [3.5, 4.1, 6.9, 7.5].forEach(y => { toronRow(c, x - 1.6, x + 1.6, y, 1.7, .9, 0); toronRow(c, -x - 1.6, -x + 1.6, y, -1.7, .9, PI); });
    c.box('concE', 4.0, .3, 4.0, x, 9.5, 0); c.box('vidro', 1.7, 1.7, 1.7, x, 9.8, 0); c.box('gOuro', .9, .9, .9, x, 10.2, 0); c.cone('telhaM', 1.7, 1.3, x, 11.5, 0, 4, PI / 4);
    c.col(x, 0, 4.4, 4.4);
  });
  c.box('terra', 16.4, 1.5, 2.6, 0, 7.4, 0); c.box('ouro', 16.5, .16, 2.7, 0, 7.36, 0); c.box('ouro', 16.5, .12, 2.7, 0, 8.84, 0);
  sign(c, 'VILA AFROFUTURISTA', 0, 7.65, 1.31, 9.4, 1.0, 0); sign(c, 'VILA AFROFUTURISTA', 0, 7.65, -1.31, 9.4, 1.0, PI);
  [-6.1, 6.1].forEach((x, i) => { c.box(i ? 'tecidoO' : 'tecido', .8, 3.4, .05, x, 3.9, 1.33); c.box(i ? 'tecidoT' : 'tecidoV', .8, 3.4, .05, x, 3.9, -1.33); });
  return { W: 22, D: 5, H: 12, lbl: 13, fd: 5 };
}

/* ---------- Círculo da Memória ---------- */
function bCirculo(c) {
  const Y = .13;
  c.flat('pPedra', new T.CircleGeometry(10.8, 64), 0, Y, 0, 10); c.flat('pedraQ', ringGeo(10.8, 11.5, 64), 0, Y - .01, 0, 10); c.flat('ouro', ringGeo(7.2, 7.32, 64), 0, Y + .02, 0, 4);
  for (let k = 1; k < 12; k++) {
    const a = k * PI / 6, x = Math.sin(a) * 8.7, z = Math.cos(a) * 8.7;
    c.box('pedraQ', 1.35, 3.9, .6, x, Y, z, a); c.box(k % 2 ? 'friso' : 'terra', 1.0, .9, .64, x, Y + 1.9, z, a); c.box('ouro', 1.35, .1, .62, x, Y + 3.9, z, a); c.col(x, z, 1.35, .6, a);
  }
  c.cyl('pedraQ', 3.8, 4.0, .35, 0, Y, 0, 40); c.cyl('agua', 2.9, 2.9, .05, 0, Y + .3, 0, 32); c.cyl('pedraQ', 3.1, 3.1, .12, 0, Y + .35, 0, 32, true);
  c.cyl('terra', .5, .6, 3.2, 0, Y + .35, 0, 16); c.cyl('ouro', .55, .55, .16, 0, Y + 3.55, 0, 16); c.sph('gOuro', .42, 0, Y + 4.1, 0, 1, 1, 1, 12);
  EXT.circ.push({ x: c.x0, z: c.z0, r: 4.1 });
  for (let k = 0; k < 6; k++) { const a = (k * 60 + 30) * PI / 180, x = Math.sin(a) * 5.9, z = Math.cos(a) * 5.9; c.box('pedraQ', 2.4, .45, .6, x, Y, z, a + PI); c.col(x, z, 2.4, .6, a + PI); }
  baobab(c, 0, -14.4, 1.25); tr(c, -13, -3, 1.1); tr(c, 13, -3, 1.1); tr(c, -12, 7, 1); tr(c, 12, 7, 1);
  stele(c, -5.6, 12.6, 'CÍRCULO\nDA MEMÓRIA');
  return { W: 24, D: 24, H: 5, lbl: 6, fd: 22, R: 14, access: [[0, 11.5]] };
}
