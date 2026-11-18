/* ============================================================
   INTERIORES — mobiliário doméstico (cama, banheiro, cozinha, lavanderia…)
   Convenção: o "fundo" de cada peça fica em -z local.
   ry = 0 encosta a peça na parede norte; PI/2 na oeste; -PI/2 na leste; PI na sul.
   ============================================================ */
IB.prototype.bedF = function (x, z, ry = 0, lv = 0, w = 1.5, m = 'tecidoV') {
  const s = this.C.sub(x, this.y(lv), z, ry);
  s.box('madeiraE', w + .1, .3, 2.1, 0, 0, 0); s.box('madeiraE', w + .1, .95, .08, 0, 0, -1.02); s.box('branco', w, .2, 2.0, 0, .3, .02); s.box(m, w + .06, .07, 1.25, 0, .5, .4);
  s.box('branco', .55, .12, .36, -w * .24, .5, -.74); s.box('branco', .55, .12, .36, w * .24, .5, -.74);
  this.colO(x, z, w + .1, 2.1, ry, lv); return this;
};
IB.prototype.nightstand = function (x, z, ry = 0, lv = 0) { const s = this.C.sub(x, this.y(lv), z, ry); s.box('madeiraE', .45, .5, .4, 0, 0, 0); s.box('gOuro', .12, .02, .12, 0, .5, 0); s.cyl('gLuz', .1, .06, .16, 0, .52, 0, 8); this.colO(x, z, .45, .4, ry, lv); return this; };
IB.prototype.toilet = function (x, z, ry = 0, lv = 0) {
  const s = this.C.sub(x, this.y(lv), z, ry); s.box('branco', .4, .42, .2, 0, .2, -.26); s.cyl('branco', .2, .14, .4, 0, 0, .02, 12); s.box('branco', .4, .04, .44, 0, .4, .02); s.box('metalP', .06, .03, .04, 0, .64, -.27);
  this.colO(x, z, .45, .7, ry, lv); return this;
};
IB.prototype.basin = function (x, z, ry = 0, lv = 0) { const s = this.C.sub(x, this.y(lv), z, ry); s.cyl('branco', .08, .12, .78, 0, 0, -.05, 10); s.box('branco', .55, .12, .42, 0, .78, 0); s.cyl('metalP', .015, .015, .2, 0, .9, -.14, 6); s.box('metalP', .02, .02, .1, 0, 1.08, -.1); s.box('azul', .5, .005, .36, 0, .9, 0); this.colO(x, z, .55, .45, ry, lv); return this; };
IB.prototype.shower = function (x, z, ry = 0, lv = 0, w = .95) {
  const s = this.C.sub(x, this.y(lv), z, ry); s.box('pConc', w, .06, w, 0, 0, 0); s.box('tecidoT', w, 1.8, .02, 0, .1, w / 2); s.box('metalP', w, .04, .04, 0, 1.92, w / 2); s.cyl('metalP', .015, .015, 1.2, 0, 1.0, -w / 2 + .08, 6); s.cyl('metalP', .1, .1, .03, 0, 2.2, -w / 2 + .2, 10); s.box('metalP', .02, .02, .2, 0, 2.2, -w / 2 + .1);
  this.colO(x, z, w, w, ry, lv); return this;
};
IB.prototype.fridge = function (x, z, ry = 0, lv = 0) { const s = this.C.sub(x, this.y(lv), z, ry); s.box('branco', .7, 1.8, .7, 0, 0, 0); s.box('metalP', .02, .5, .03, -.28, .9, .36); s.box('metalP', .02, .35, .03, -.28, 1.3, .36); s.box('preto', .66, .01, .01, 0, 1.15, .355); this.colO(x, z, .7, .7, ry, lv); return this; };
IB.prototype.kitchenRow = function (x, z, w, ry = 0, lv = 0) {
  const s = this.C.sub(x, this.y(lv), z, ry); s.box('madeiraE', w, .86, .6, 0, 0, 0); s.box('pedraQ', w + .04, .04, .64, 0, .86, .01);
  s.box('aco', .6, .02, .4, -w / 2 + .6, .9, .02); s.cyl('metalP', .015, .015, .22, -w / 2 + .6, .9, -.2, 6); s.box('metalP', .02, .02, .12, -w / 2 + .6, 1.1, -.14);
  s.box('preto', .6, .015, .5, w / 2 - .7, .9, 0); [[-.15, -.12], [.15, -.12], [-.15, .12], [.15, .12]].forEach(([a, b]) => s.cyl('metalP', .06, .06, .012, w / 2 - .7 + a, .915, b, 10));
  for (let i = 0; i < Math.floor(w / .6); i++) s.box('madeiraC', .5, 0.7, .3, -w / 2 + .35 + i * .6, 1.5, -.15);
  this.colO(x, z, w, .6, ry, lv); return this;
};
IB.prototype.washer = function (x, z, ry = 0, lv = 0) { const s = this.C.sub(x, this.y(lv), z, ry); s.box('branco', .6, .85, .6, 0, 0, 0); s.sph('azul', .2, 0, .42, .3, 1, 1, .2, 12); s.box('metalP', .2, .04, .01, 0, .78, .3); this.colO(x, z, .6, .6, ry, lv); return this; };
IB.prototype.clothesline = function (x, z, len = 3, ry = 0, lv = 0) {
  const s = this.C.sub(x, this.y(lv), z, ry); s.cyl('metalP', .03, .03, 2.1, -len / 2, 0, 0, 6); s.cyl('metalP', .03, .03, 2.1, len / 2, 0, 0, 6); s.box('metalP', len, .015, .015, 0, 2.0, 0);
  ['tecidoV', 'tecidoO', 'tecidoT', 'branco', 'kente'].forEach((m, i) => s.box(m, .4, .55, .02, -len / 2 + .5 + i * (len - 1) / 4, 1.42, 0)); return this;
};
IB.prototype.cobogo = function (x, y, z, ry = 0, w = 3.2, h = 1.6, lv = 0, m = 'rebocoB') {
  const s = this.C.sub(x, y + this.y(lv), z, ry), c = .32, nx = Math.round(w / c), ny = Math.round(h / c);
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const px = (i - (nx - 1) / 2) * c, py = j * c; s.box(m, c, .06, .06, px, py, 0); s.box(m, c, .06, .06, px, py + c - .06, 0); s.box(m, .06, c - .12, .06, px - c / 2 + .03, py + .06, 0); s.box(m, .06, c - .12, .06, px + c / 2 - .03, py + .06, 0); s.box(m, .06, .06, .16, px, py + c / 2 - .03, 0); }
  return this;
};
IB.prototype.stool = function (x, z, h = .45, lv = 0, m = 'madeiraE') { this.cyl(m, .18, .15, h, x, 0, z, true, 10, lv); return this; };
IB.prototype.rack = function (x, z, w, ry = 0, lv = 0, cols = ['tecidoV', 'tecidoO', 'tecidoT', 'kente', 'vermelho', 'azul']) { // prateleira baixa com rolos de tecido
  const s = this.C.sub(x, this.y(lv), z, ry); s.box('madeiraE', w, 1.5, .04, 0, 0, -.28); [.4, .85, 1.3].forEach(y => { s.box('madeiraE', w, .04, .5, 0, y, 0); for (let i = 0; i < Math.floor(w / .3); i++) s.cyl(cols[(i + Math.round(y * 3)) % cols.length], .09, .09, .38, -w / 2 + .2 + i * .3, y + .04, 0, 10); });
  s.box('madeiraE', .04, 1.5, .5, -w / 2, 0, 0); s.box('madeiraE', .04, 1.5, .5, w / 2, 0, 0); this.colO(x, z, w, .5, ry, lv); return this;
};
