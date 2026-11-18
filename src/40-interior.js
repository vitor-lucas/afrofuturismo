/* ============================================================
   MOTOR DE INTERIORES — construtor de plantas (paredes com vãos, pisos,
   escadas, mobiliário, pontos de interesse e luzes). Cada interior é
   construído sob demanda, em cena própria, e guardado em cache.
   Convenção: x leste, z sul; entrada pelo lado sul (z+); yaw 0 = olhar para o norte (-z).
   ============================================================ */
const VF = new T.MeshStandardMaterial({ color: 0xE4F0EE, emissive: 0xCFE6EA, emissiveIntensity: .85, roughness: .25 }); // vidro fosco iluminado (interior sem vista externa)
const BOOKC = ['#C8603B', '#2BB5A8', '#E8B23A', '#B23A6A', '#F3E8CF', '#3E6FB0', '#6AA35A', '#7A4EA3', '#8A5A3A'];

function wrapText(g, text, maxW) { const out = []; String(text).split('\n').forEach(par => { let line = ''; par.split(' ').forEach(w => { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; }); out.push(line); }); return out; }
function plaqueTex(title, text, w, h, o = {}) { // placa de parede com título e texto
  const pxm = 220, W = Math.round(w * pxm), H = Math.round(h * pxm);
  return canvasTex(W, H, (g) => {
    g.fillStyle = o.bg || '#17120E'; g.fillRect(0, 0, W, H); g.strokeStyle = o.fg || '#E8B23A'; g.lineWidth = 4; g.strokeRect(6, 6, W - 12, H - 12);
    g.fillStyle = o.fg || '#E8B23A'; g.textBaseline = 'top'; let y = 16; const pad = 18, fs = o.fs || Math.max(16, Math.min(34, H / 8));
    g.font = `800 ${fs * 1.12}px "Bricolage Grotesque", system-ui, sans-serif`; wrapText(g, title, W - pad * 2).forEach(l => { g.fillText(l, pad, y); y += fs * 1.25; });
    if (text) { y += 4; g.fillStyle = o.tc || '#EDE3D0'; g.font = `500 ${fs * .8}px "Instrument Sans", system-ui, sans-serif`; wrapText(g, text, W - pad * 2).forEach(l => { if (y < H - 10) g.fillText(l, pad, y); y += fs * 1.0; }); }
  });
}

class IB {
  constructor(id) {
    this.id = id; this.B = new Batch(); this.cols = []; this.C = new Ctx(this.B, 0, 0, 0, 0, null); this.g = new T.Group();
    this.rooms = []; this.segs = []; this.hots = []; this.ramps = []; this.lights = []; this.markPts = []; this.lvY = [0]; this.H = 3.8; this.name = ''; this.spawn = { x: 0, z: 0, yaw: 0 }; this.exit = null;
    this.bb = [1e9, 1e9, -1e9, -1e9]; this.nL = 0; this.tick = [];
  }
  y(lv = 0) { return this.lvY[lv] || 0; }
  ext(x0, z0, x1, z1) { const b = this.bb; b[0] = Math.min(b[0], x0); b[1] = Math.min(b[1], z0); b[2] = Math.max(b[2], x1); b[3] = Math.max(b[3], z1); }
  col(x0, z0, x1, z1, lv = -1) { this.cols.push({ cx: (x0 + x1) / 2, cz: (z0 + z1) / 2, hw: Math.abs(x1 - x0) / 2, hd: Math.abs(z1 - z0) / 2, c: 1, s: 0, lv }); }
  colO(x, z, w, d, ry = 0, lv = -1) { this.cols.push({ cx: x, cz: z, hw: w / 2, hd: d / 2, c: Math.cos(ry), s: Math.sin(ry), lv }); }
  /* piso, forro e luz de um ambiente */
  room(name, x0, z0, x1, z1, o = {}) {
    const lv = o.lv || 0, y = this.y(lv), h = o.h || this.H, C = this.C, fm = o.f || 'pPedra', w = x1 - x0, d = z1 - z0;
    const slab = (a0, b0, a1, b1) => { if (a1 - a0 > .01 && b1 - b0 > .01) C.box(fm, a1 - a0, .25, b1 - b0, (a0 + a1) / 2, y - .25, (b0 + b1) / 2); };
    if (o.hole) { const [hx0, hz0, hx1, hz1] = o.hole; slab(x0, z0, hx0, z1); slab(hx1, z0, x1, z1); slab(hx0, z0, hx1, hz0); slab(hx0, hz1, hx1, z1); } else slab(x0, z0, x1, z1);
    if (!o.noCeil) { const cs = (a0, b0, a1, b1) => { if (a1 - a0 > .01 && b1 - b0 > .01) C.box(o.c || 'branco', a1 - a0, .15, b1 - b0, (a0 + a1) / 2, y + h, (b0 + b1) / 2); };
      if (o.ceilHole) { const [hx0, hz0, hx1, hz1] = o.ceilHole; cs(x0, z0, hx0, z1); cs(hx1, z0, x1, z1); cs(hx0, z0, hx1, hz0); cs(hx0, hz1, hx1, z1); } else cs(x0, z0, x1, z1); }
    this.ext(x0, z0, x1, z1);
    const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, nx = Math.max(1, Math.round(w / 4.5)), nz = Math.max(1, Math.round(d / 4.5)), tile = o.tint || 'gLuz';
    if (!o.noCeil) for (let i = 0; i < nx; i++) for (let k = 0; k < nz; k++) C.box(tile, Math.min(1.6, w / nx * .45), .04, Math.min(.6, d / nz * .3), x0 + w / nx * (i + .5), y + h - .04, z0 + d / nz * (k + .5));
    const r = { name, x0, z0, x1, z1, lv, y, h, id: this.rooms.length }; this.rooms.push(r);
    if (o.lights !== false && !o.noCeil) { const ls = o.lights || (w * d > 150 ? [[cx - w / 4, cz], [cx + w / 4, cz]] : [[cx, cz]]); ls.forEach(([lx, lz]) => this.light(lx, y + h - .5, lz, o.lc || 0xFFE9CC, o.li || 1.0, o.ld || Math.max(w, d) * 1.1)); }
    return r;
  }
  light(x, y, z, color = 0xFFE9CC, i = 1, d = 14) { this.lights.push({ x, y, z, color, i, d }); }
  /* parede com vãos: axis 'x' corre ao longo de x em z=fixed; 'z' corre ao longo de z em x=fixed */
  wall(axis, fixed, a0, a1, o = {}) {
    const lv = o.lv || 0, y = this.y(lv), h = o.h || this.H, th = o.th || .3, m = o.m || 'rebocoB', C = this.C, dh = o.dh || 2.6;
    const ops = [...(o.doors || []).map(([c, w, hh]) => ({ a: c - w / 2, b: c + w / 2, y0: 0, y1: hh || dh, door: 1 })), ...(o.wins || []).map(([c, w, y0, y1]) => ({ a: c - w / 2, b: c + w / 2, y0: y0 == null ? 1 : y0, y1: y1 == null ? 2.7 : y1, win: 1 }))].sort((p, q) => p.a - q.a);
    const box = (p0, p1, ya, yb, mm = m, tt = th) => { const len = p1 - p0, hh = yb - ya; if (len < .01 || hh < .01) return; const cc = (p0 + p1) / 2; axis === 'x' ? C.box(mm, len, hh, tt, cc, y + ya, fixed) : C.box(mm, tt, hh, len, fixed, y + ya, cc); };
    const colr = (p0, p1) => { if (p1 - p0 < .01) return; axis === 'x' ? this.col(p0, fixed - th / 2, p1, fixed + th / 2, lv) : this.col(fixed - th / 2, p0, fixed + th / 2, p1, lv); };
    const base = (p0, p1) => { const len = p1 - p0; if (len < .05 || o.noBase) return; const cc = (p0 + p1) / 2; [-1, 1].forEach(sg => axis === 'x' ? C.box('madeiraE', len, .12, .03, cc, y, fixed + sg * (th / 2 + .015)) : C.box('madeiraE', .03, .12, len, fixed + sg * (th / 2 + .015), y, cc)); };
    let cur = a0; this.ext(axis === 'x' ? a0 : fixed, axis === 'x' ? fixed : a0, axis === 'x' ? a1 : fixed, axis === 'x' ? fixed : a1);
    ops.forEach(op => {
      box(cur, op.a, 0, h); colr(cur, op.a); base(cur, op.a);
      if (op.y1 < h) box(op.a, op.b, op.y1, h); if (op.y0 > 0) { box(op.a, op.b, 0, op.y0); colr(op.a, op.b); }
      if (op.win) { const pw = op.b - op.a - .12, ph = op.y1 - op.y0 - .12; axis === 'x' ? C.box(VF, pw, ph, .05, (op.a + op.b) / 2, y + op.y0 + .06, fixed) : C.box(VF, .05, ph, pw, fixed, y + op.y0 + .06, (op.a + op.b) / 2); box(op.a, op.b, op.y0 - .05, op.y0 + .04, 'madeiraE', th + .1); box(op.a, op.b, op.y1 - .04, op.y1 + .02, 'madeiraE', th + .06); }
      else { [op.a, op.b].forEach(p => box(p - .05, p + .05, 0, op.y1, 'madeiraE', th + .06)); box(op.a, op.b, op.y1 - .1, op.y1, 'madeiraE', th + .06); }
      cur = op.b;
    });
    box(cur, a1, 0, h); colr(cur, a1); base(cur, a1);
    this.segs.push({ axis, fixed, a0, a1, lv, ops: ops.map(p => ({ a: p.a, b: p.b, win: !!p.win })) });
  }
  wx(z, x0, x1, o) { this.wall('x', z, x0, x1, o); } wz(x, z0, z1, o) { this.wall('z', x, z0, z1, o); }
  /* quatro paredes externas de um retângulo; doors: {n:[[c,w]], s:[], e:[], w:[]}, wins idem */
  perim(x0, z0, x1, z1, o = {}) { const dd = o.doors || {}, ww = o.wins || {}; this.wx(z0, x0, x1, { ...o, doors: dd.n, wins: ww.n }); this.wx(z1, x0, x1, { ...o, doors: dd.s, wins: ww.s }); this.wz(x0, z0, z1, { ...o, doors: dd.w, wins: ww.w }); this.wz(x1, z0, z1, { ...o, doors: dd.e, wins: ww.e }); }
  /* escada entre pavimentos: retângulo [x0,z0,x1,z1], dir = sentido da subida (n,s,e,w) */
  stairs(x0, z0, x1, z1, dir, lv0 = 0, o = {}) {
    const ya = this.y(lv0), yb = this.y(lv0 + 1), rise = yb - ya, n = Math.ceil(rise / .18), C = this.C, w = dir === 'n' || dir === 's' ? x1 - x0 : z1 - z0, len = dir === 'n' || dir === 's' ? z1 - z0 : x1 - x0, run = len / n;
    for (let i = 0; i < n; i++) {
      const hh = rise * (i + 1) / n, p = run * (i + .5); let cx, cz, bw, bd;
      if (dir === 'n') { cx = (x0 + x1) / 2; cz = z1 - p; bw = w; bd = run; } else if (dir === 's') { cx = (x0 + x1) / 2; cz = z0 + p; bw = w; bd = run; } else if (dir === 'e') { cz = (z0 + z1) / 2; cx = x0 + p; bw = run; bd = w; } else { cz = (z0 + z1) / 2; cx = x1 - p; bw = run; bd = w; }
      C.box(o.m || 'madeira', bw, hh, bd, cx, ya, cz);
    }
    this.ramps.push({ x0, z0, x1, z1, dir, ya, yb, lv0 });
    const t = .12, R = (a, b, c2, d2, lv) => this.col(a, b, c2, d2, lv);
    // guarda-corpos laterais (sempre) e travas nas extremidades por pavimento
    const ns = dir === 'n' || dir === 's', ang = Math.atan2(rise, len), hl = Math.hypot(len, rise);
    if (ns) { R(x0 - t, z0, x0, z1, -1); R(x1, z0, x1 + t, z1, -1); [x0, x1].forEach(x => C.box('metalP', .06, .05, hl, x, ya + rise / 2 + .93, (z0 + z1) / 2, 0, dir === 'n' ? ang : -ang)); }
    else { R(x0, z0 - t, x1, z0, -1); R(x0, z1, x1, z1 + t, -1); [z0, z1].forEach(z => C.box('metalP', hl, .05, .06, (x0 + x1) / 2, ya + rise / 2 + .93, z, 0, 0, dir === 'e' ? ang : -ang)); }
    for (let i = 1; i < n; i += 2) { const hh = rise * (i + .5) / n, p = run * (i + .5); let px, pz; if (dir === 'n') { px = null; pz = z1 - p; } else if (dir === 's') { px = null; pz = z0 + p; } else if (dir === 'e') { pz = null; px = x0 + p; } else { pz = null; px = x1 - p; }
      (ns ? [x0, x1] : [z0, z1]).forEach(e => C.box('metalP', .035, .9, .035, ns ? e : px, ya + hh, ns ? pz : e)); }
    // fecha o topo pelo pavimento de baixo (não se entra na escada pelo lado alto)
    const top = { n: [x0, z0 - .12, x1, z0], s: [x0, z1, x1, z1 + .12], e: [x1, z0, x1 + .12, z1], w: [x0 - .12, z0, x0, z1] }[dir]; this.col(top[0], top[1], top[2], top[3], lv0);
    // pavimento de cima: protege o vazio pelos lados e pela extremidade baixa; a extremidade alta fica livre (patamar)
    const sides = (dir === 'n' || dir === 's') ? [[x0 - t, z0, x0, z1], [x1, z0, x1 + t, z1]] : [[x0, z0 - t, x1, z0], [x0, z1, x1, z1 + t]];
    const foot = { n: [x0, z1, x1, z1 + t], s: [x0, z0 - t, x1, z0], e: [x0 - t, z0, x0, z1], w: [x1, z0, x1 + t, z1] }[dir];
    sides.concat([foot]).forEach(b => this.col(b[0], b[1], b[2], b[3], lv0 + 1));
    return this.ramps[this.ramps.length - 1];
  }
  /* ---- primitivas e mobiliário ---- */
  box(m, w, h, d, x, y, z, ry = 0, col = false, lv = 0) { this.C.box(m, w, h, d, x, y + this.y(lv), z, ry); if (col) this.colO(x, z, w, d, ry, lv); return this; }
  cyl(m, rt, rb, h, x, y, z, col = false, seg = 18, lv = 0) { this.C.cyl(m, rt, rb, h, x, y + this.y(lv), z, seg); if (col) this.colO(x, z, Math.max(rt, rb) * 2, Math.max(rt, rb) * 2, 0, lv); return this; }
  sph(m, r, x, y, z, sx = 1, sy = 1, sz = 1, lv = 0) { this.C.sph(m, r, x, y + this.y(lv), z, sx, sy, sz, 12); return this; }
  cone(m, r, h, x, y, z, seg = 12, ry = 0, lv = 0) { this.C.cone(m, r, h, x, y + this.y(lv), z, seg, ry); return this; }
  ico(m, r, x, y, z, sx = 1, sy = 1, sz = 1, det = 1, lv = 0) { this.C.ico(m, r, x, y + this.y(lv), z, sx, sy, sz, det); return this; }
  geo(m, g, x, y, z, ry = 0, rx = 0, rz = 0, lv = 0) { this.C.geoM(m, g, x, y + this.y(lv), z, ry, rx, rz, 2, 2); return this; }
  table(x, z, w = 1.6, d = .8, h = .75, ry = 0, m = 'madeira', lv = 0) { const C = this.C, s = C.sub(x, this.y(lv), z, ry); s.box(m, w, .06, d, 0, h - .06, 0); [-1, 1].forEach(a => [-1, 1].forEach(b => s.box('madeiraE', .06, h - .06, .06, a * (w / 2 - .08), 0, b * (d / 2 - .08)))); this.colO(x, z, w, d, ry, lv); return this; }
  chair(x, z, ry = 0, lv = 0, m = 'madeiraE') { const s = this.C.sub(x, this.y(lv), z, ry); s.box(m, .42, .05, .42, 0, .44, 0); s.box(m, .42, .46, .04, 0, .5, -.2); [-1, 1].forEach(a => [-1, 1].forEach(b => s.box('madeiraE', .04, .44, .04, a * .18, 0, b * .18))); return this; }
  seat(x, z, w = 2, ry = 0, lv = 0) { const s = this.C.sub(x, this.y(lv), z, ry); s.box('madeira', w, .06, .5, 0, .43, 0); s.box('metalP', .06, .43, .44, -w / 2 + .15, 0, 0); s.box('metalP', .06, .43, .44, w / 2 - .15, 0, 0); this.colO(x, z, w, .5, ry, lv); return this; }
  sofa(x, z, w = 2.2, ry = 0, m = 'tecidoT', lv = 0) { const s = this.C.sub(x, this.y(lv), z, ry); s.box(m, w, .42, .9, 0, 0, 0); s.box(m, w, .5, .22, 0, .42, -.34); [-1, 1].forEach(a => s.box(m, .2, .26, .9, a * (w / 2 - .1), .42, 0)); this.colO(x, z, w, .9, ry, lv); return this; }
  shelf(x, z, w = 2.4, ry = 0, rows = 5, h = 2.3, lv = 0, books = true) { const s = this.C.sub(x, this.y(lv), z, ry); s.box('madeiraE', w, h, .04, 0, 0, -.17); [-1, 1].forEach(a => s.box('madeiraE', .04, h, .36, a * (w / 2 - .02), 0, 0)); for (let i = 0; i <= rows; i++) s.box('madeira', w, .03, .36, 0, i * (h - .03) / rows, 0);
    if (books) for (let i = 0; i < rows; i++) { let bx = -w / 2 + .1; while (bx < w / 2 - .12) { const bw = .04 + rnd() * .05, bh = .2 + rnd() * .12; s.box(pick(['tecido', 'tecidoT', 'tecidoO', 'tecidoV', 'azul', 'marrom', 'branco']), bw, bh, .22, bx + bw / 2, i * (h - .03) / rows + .03, -.03); bx += bw + .005; if (rnd() < .06) bx += .2; } }
    this.colO(x, z, w, .4, ry, lv); return this; }
  desk(x, z, w = 1.4, ry = 0, lv = 0, m = 'madeira') { this.table(x, z, w, .7, .74, ry, m, lv); const s = this.C.sub(x, this.y(lv), z, ry); s.box('metalP', .5, .02, .32, 0, .74, 0); s.box('gAzul', .46, .3, .02, 0, .78, -.2); return this; }
  counter(x, z, w, d = .8, ry = 0, m = 'madeira', lv = 0, h = 1.05) { const s = this.C.sub(x, this.y(lv), z, ry); s.box('rebocoB', w, h, d, 0, 0, 0); s.box(m, w + .1, .06, d + .1, 0, h, 0); s.box('gOuro', w, .04, .03, 0, h * .6, d / 2 + .01); this.colO(x, z, w, d, ry, lv); return this; }
  plant(x, z, s = 1, lv = 0) { const y = this.y(lv); this.C.cyl('terra', .26 * s, .2 * s, .5 * s, x, y, z, 10); for (let i = 0; i < 5; i++) { const a = i * 1.26; this.C.ico(['fA', 'fB', 'fC'][i % 3], .32 * s, x + Math.sin(a) * .16 * s, y + (.85 + (i % 2) * .22) * s, z + Math.cos(a) * .16 * s, 1, 1.3, 1, 0); } this.colO(x, z, .5 * s, .5 * s, 0, lv); return this; }
  rug(x, z, w, d, m = 'tecido', lv = 0, ry = 0) { this.C.box(m, w, .02, d, x, this.y(lv), z, ry); return this; }
  pedestal(x, z, w = .9, h = 1.0, lv = 0, m = 'pedraQ') { this.C.box(m, w, h, w, x, this.y(lv), z); this.C.box('ouro', w + .06, .03, w + .06, x, this.y(lv) + h, z); this.colO(x, z, w, w, 0, lv); return h + this.y(lv); }
  vitrine(x, z, w = 1.2, d = .8, h = 1.0, lv = 0, ry = 0) { const y = this.y(lv); this.C.box('madeiraE', w, h, d, x, y, z, ry); this.C.box('vidro', w - .06, .5, d - .06, x, y + h, z, ry); this.colO(x, z, w, d, ry, lv); return y + h; }
  plaque(title, text, x, y, z, ry, w = 1.1, h = .7, o = {}) { const tex = plaqueTex(title, text, w, h, o), m = new T.MeshStandardMaterial({ map: tex, roughness: .6, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: .22 }); const me = new T.Mesh(new T.PlaneGeometry(w, h), m); me.matrixAutoUpdate = false; me.matrix.copy(this.C.M4(x, y + this.y(o.lv || 0) + h / 2, z, ry)); me.matrixWorldNeedsUpdate = true; this.g.add(me); return me; }
  art(x, y, z, ry, w, h, seed, mode, lv = 0) { const tex = new T.CanvasTexture(artCanvas(512, Math.round(512 * h / w), seed, mode)); tex.encoding = T.sRGBEncoding; const m = new T.MeshStandardMaterial({ map: tex, roughness: .7 }); const fr = this.C.sub(x, y + this.y(lv), z, ry); fr.box('madeiraE', w + .12, h + .12, .05, 0, -.06, -.03); const me = new T.Mesh(new T.PlaneGeometry(w, h), m); me.matrixAutoUpdate = false; me.matrix.copy(this.C.M4(x, y + this.y(lv) + h / 2, z, ry)); me.matrixWorldNeedsUpdate = true; this.g.add(me); return me; }
  pattern(x, y, z, ry, w, h, pat, lv = 0) { this.C.box(pat, w, h, .06, x, y + this.y(lv), z, ry); return this; }
  screen(x, y, z, ry, w, h, title, text, o = {}) { this.C.sub(x, y + this.y(o.lv || 0), z, ry).box('metalP', w + .1, h + .1, .05, 0, -.05, -.03); return this.plaque(title, text, x, y, z, ry, w, h, { bg: '#0E2230', fg: '#8EE6DA', tc: '#D8F2EE', ...o }); }
  /* ponto de interesse clicável (tecla E) */
  hot(id, x, z, y = 1.3, o = {}) { const lv = o.lv || 0, yy = y + this.y(lv); this.hots.push({ id, x, z, y: yy, lv, r: o.r || 2.4, t: o.t || null }); this.markPts.push([x, yy + (o.up != null ? o.up : .55), z]); return this; }
  spawnAt(x, z, yaw = 0) { this.spawn = { x, z, yaw }; return this; }
  exitAt(x, z, r = 1.6) { this.exit = { x, z, r }; return this; }
  /* finaliza: gera malhas */
  build() {
    this.B.build(this.g);
    this.g.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
    this.mk = new Inst(new T.OctahedronGeometry(.11, 0), GL('gOuro'), Math.max(1, this.markPts.length), false); this.markPts.forEach(p => this.mk.add(p[0], p[1], p[2], 1, 1.5, 1, 0)); this.g.add(this.mk.commit());
    const hs = new T.HemisphereLight(0xFFF1DE, 0x6A5A48, .7); this.g.add(hs);
    this.lights.slice(0, 12).forEach(l => { const p = new T.PointLight(l.color, l.i * 1.15, l.d, 1.6); p.position.set(l.x, l.y, l.z); this.g.add(p); });
    this.tick.push((t) => { const ps = this.markPts, m = this.mk; for (let i = 0; i < ps.length; i++) m.set(i, ps[i][0], ps[i][1] + Math.sin(t * 2 + i) * .06, ps[i][2], 1, 1.5, 1, t * 1.2 + i); m.mesh.instanceMatrix.needsUpdate = true; });
    return this;
  }
  /* altura do piso em (x,z), considerando rampas; devolve {y, lv} */
  floorAt(x, z, lv) {
    for (const r of this.ramps) {
      if (x < r.x0 || x > r.x1 || z < r.z0 || z > r.z1) continue; if (lv !== r.lv0 && lv !== r.lv0 + 1) continue;
      const t = r.dir === 'n' ? (r.z1 - z) / (r.z1 - r.z0) : r.dir === 's' ? (z - r.z0) / (r.z1 - r.z0) : r.dir === 'e' ? (x - r.x0) / (r.x1 - r.x0) : (r.x1 - x) / (r.x1 - r.x0);
      const y = r.ya + cl(t, 0, 1) * (r.yb - r.ya); return { y, lv: t > .5 ? r.lv0 + 1 : r.lv0, ramp: true };
    }
    return { y: this.y(lv), lv };
  }
  roomAt(x, z, lv) { let best = null; for (const r of this.rooms) if (r.lv === lv && x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) { if (!best || (r.x1 - r.x0) * (r.z1 - r.z0) < (best.x1 - best.x0) * (best.z1 - best.z0)) best = r; } return best; }
}

/* registro e cache */
const INT = {}, INTC = {};
function getInterior(id) {
  if (INTC[id]) return INTC[id];
  if (!INT[id]) throw new Error('Interior não definido: ' + id);
  const cached=Object.keys(INTC).filter(k=>k.startsWith('metro_')); if(cached.length>=6){const key=cached.find(k=>INTC[k]!==G.in);if(key){INTC[key].g.traverse(o=>{if(o.geometry)o.geometry.dispose();});delete INTC[key];}}
  const I = new IB(id); INT[id](I); I.build(); I.lvN = I.lvY.length; INTC[id] = I; return I;
}

