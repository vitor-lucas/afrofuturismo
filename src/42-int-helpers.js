/* ============================================================
   INTERIORES — auxiliares adicionais (céu aberto, diagramas, laboratório, cozinha…)
   ============================================================ */
/* domo de céu para pátios e terraços abertos dentro de um interior */
IB.prototype.sky = function (cx = 0, cz = 0) {
  const tex = canvasTex(8, 256, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#4E8FD0'); gr.addColorStop(.5, '#B7D6E8'); gr.addColorStop(.58, '#E4EEEA'); gr.addColorStop(1, '#8FAE7A'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  const me = new T.Mesh(new T.SphereGeometry(180, 24, 16), new T.MeshBasicMaterial({ map: tex, side: T.BackSide, depthWrite: false, fog: false }));
  me.position.set(cx, 0, cz); me.renderOrder = -10; me.frustumCulled = false; this.g.add(me); return this;
};
/* painel desenhado em canvas (diagramas, fluxos, quadros) */
IB.prototype.diagram = function (x, y, z, ry, w, h, fn, lv = 0, k = .3) {
  const px = 190, tex = canvasTex(Math.round(w * px), Math.round(h * px), fn), m = new T.MeshStandardMaterial({ map: tex, roughness: .6, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: k });
  const me = new T.Mesh(new T.PlaneGeometry(w, h), m); me.matrixAutoUpdate = false; me.matrix.copy(this.C.M4(x, y + this.y(lv) + h / 2, z, ry)); me.matrixWorldNeedsUpdate = true; this.g.add(me); return me;
};
/* quadro de aula (verde) com linhas de texto */
IB.prototype.board = function (x, y, z, ry, w, h, title, lines, lv = 0) {
  this.C.sub(x, y + this.y(lv), z, ry).box('madeiraE', w + .12, h + .12, .05, 0, -.06, -.04);
  return this.plaque(title, lines, x, y, z, ry, w, h, { bg: '#1F3A2E', fg: '#F3E8CF', tc: '#E8F1E4', lv, fs: Math.max(15, Math.min(28, h * 38)) });
};
/* segmento entre dois pontos no plano XY (braços articulados, tubulações) */
IB.prototype.limb = function (m, ax, ay, bx, by, th, z, lv = 0) {
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy), th2 = Math.atan2(-dx, dy);
  this.C.box(m, th, len, th, (ax + bx) / 2, (ay + by) / 2 - len / 2 + this.y(lv), z, 0, 0, th2); return this;
};
IB.prototype.robotArm = function (x, y, z, s = 1, lv = 0) {
  const c = this.C, yy = y + this.y(lv);
  c.cyl('metalP', .2 * s, .24 * s, .16 * s, x, yy, z, 14); c.cyl('gTur', .17 * s, .17 * s, .03 * s, x, yy + .16 * s, z, 14);
  this.limb('branco', x, y + .17 * s, x + .22 * s, y + .75 * s, .1 * s, z, lv); this.limb('branco', x + .22 * s, y + .75 * s, x + .6 * s, y + 1.02 * s, .08 * s, z, lv);
  c.sph('gOuro', .07 * s, x + .22 * s, yy + .75 * s, z); c.sph('gOuro', .06 * s, x + .6 * s, yy + 1.02 * s, z); c.box('aco', .05 * s, .16 * s, .05 * s, x + .66 * s, yy + .86 * s, z - .04 * s); c.box('aco', .05 * s, .16 * s, .05 * s, x + .66 * s, yy + .86 * s, z + .04 * s);
  return this;
};
/* bancada de laboratório com tampo escuro e luz de trabalho */
IB.prototype.bench = function (x, z, w = 2.4, d = .9, ry = 0, lv = 0, top = 'preto') {
  const s = this.C.sub(x, this.y(lv), z, ry); s.box('metalP', w, .78, d, 0, 0, 0); s.box(top, w + .06, .05, d + .06, 0, .78, 0); s.box('gBranco', w * .7, .015, .03, 0, .6, d / 2 + .005);
  this.colO(x, z, w, d, ry, lv); return this;
};
IB.prototype.monitor = function (x, y, z, ry = 0, w = .55, lv = 0, m = 'gAzul') { const s = this.C.sub(x, y + this.y(lv), z, ry); s.box('metalP', w, w * .6, .03, 0, 0, 0); s.box(m, w - .06, w * .6 - .06, .02, 0, .03, .02); s.box('metalP', .05, .14, .05, 0, -.14, 0); return this; };
IB.prototype.printer3d = function (x, y, z, lv = 0) { const c = this.C.sub(x, y + this.y(lv), z, 0); c.box('metalP', .5, .04, .5, 0, 0, 0); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => c.box('aco', .03, .5, .03, a * .23, .04, b * .23)); c.box('aco', .5, .03, .03, 0, .54, 0); c.box('gTerra', .12, .12, .12, 0, .06, 0); c.box('vidro', .46, .4, .02, 0, .08, .24); return this; };
/* gavetas/armário baixo */
IB.prototype.cabinet = function (x, z, w = 1.6, h = 1.0, ry = 0, lv = 0, m = 'madeiraE', d = .5) { const s = this.C.sub(x, this.y(lv), z, ry); s.box(m, w, h, d, 0, 0, 0); for (let i = 0; i < Math.round(w / .5); i++) s.box('ouro', .12, .02, .02, -w / 2 + .25 + i * .5, h * .7, d / 2 + .01); this.colO(x, z, w, d, ry, lv); return this; };
/* mesa redonda com cadeiras */
IB.prototype.roundTable = function (x, z, r = 1.2, n = 6, lv = 0, m = 'madeira') { const y = this.y(lv); this.C.cyl(m, r, r, .06, x, y + .72, z, 28); this.C.cyl('metalP', .1, .18, .72, x, y, z, 10); this.colO(x, z, r * 2 - .3, r * 2 - .3, 0, lv); for (let k = 0; k < n; k++) { const a = k * TAU / n; this.chair(x + Math.sin(a) * (r + .5), z + Math.cos(a) * (r + .5), a + PI, lv); } return this; };
/* canteiro elevado com terra, plantas e opcional sensor */
IB.prototype.bed = function (x, z, w, d, lv = 0, h = .55, crop = 'fB', sensor = false) {
  const y = this.y(lv); this.box('conc', w, h, d, x, 0, z, 0, true, lv); this.C.box('terraSolo', w - .16, .05, d - .16, x, y + h, z);
  const nx = Math.max(2, Math.round(w / .5)), nz = Math.max(1, Math.round(d / .5)); for (let i = 0; i < nx; i++) for (let k = 0; k < nz; k++) this.C.ico(crop, .17, x - w / 2 + (i + .5) * w / nx, y + h + .2, z - d / 2 + (k + .5) * d / nz, 1, 1.1, 1, 0);
  if (sensor) { this.C.cyl('metalP', .015, .015, .5, x, y + h, z, 6); this.C.box('gVerde', .08, .05, .04, x, y + h + .5, z); }
  return this;
};
/* tambor / reservatório cilíndrico */
IB.prototype.tank = function (x, z, r = .8, h = 1.6, lv = 0, m = 'aco', water = true) { this.cyl(m, r, r, h, x, 0, z, true, 24, lv); if (water) this.C.box('gAzul', .05, h * .7, .02, x, this.y(lv) + h * .15, z + r + .01); return this; };
/* painel de amostras de materiais (grade) */
IB.prototype.sampleWall = function (x, y, z, ry, mats, cols = 4, cell = .42, lv = 0) { const s = this.C.sub(x, y + this.y(lv), z, ry), rows = Math.ceil(mats.length / cols); s.box('madeiraE', cols * cell + .1, rows * cell + .1, .04, 0, -.05, -.03); mats.forEach((m, i) => { s.box(m, cell - .06, cell - .06, .05, (i % cols - (cols - 1) / 2) * cell, Math.floor(i / cols) * cell, 0); }); return this; };
/* aerogerador em miniatura (rotor no plano XY, voltado para +z) */
IB.prototype.turbineModel = function (x, y, z, s = 1, lv = 0) { const c = this.C, yy = y + this.y(lv); c.cyl('branco', .014 * s, .022 * s, .7 * s, x, yy, z, 8); c.sph('branco', .045 * s, x, yy + .72 * s, z); for (let k = 0; k < 3; k++) { const a = k * 2.094 + .4, L = .3 * s; c.box('branco', .02 * s, L, .008 * s, x - Math.sin(a) * L / 2, yy + .72 * s + Math.cos(a) * L / 2 - L / 2, z + .04 * s, 0, 0, a); } return this; };
/* estante de cultivo com luz de LED (prateleiras abertas) */
IB.prototype.growRack = function (x, z, w = 2.4, ry = 0, lv = 0, crop = 'fB') { const c = this.C.sub(x, this.y(lv), z, ry); [-1, 1].forEach(a => [-1, 1].forEach(b => c.box('metalP', .04, 2.0, .04, a * (w / 2 - .03), 0, b * .27)));
  for (let k = 0; k < 3; k++) { const y = .25 + k * .62; c.box('aco', w, .04, .6, 0, y, 0); c.box('gVerde', w - .2, .02, .06, 0, y + .5, -.1); for (let i = 0; i < Math.round(w / .24); i++) c.ico(k % 2 ? 'fA' : crop, .09, -w / 2 + .15 + i * .24, y + .14, 0, 1, 1.2, 1, 0); }
  this.colO(x, z, w, .6, ry, lv); return this; };
