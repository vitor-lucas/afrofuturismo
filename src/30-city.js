/* ============================================================
   CIDADE — planta urbana, terreno, ruas, vegetação, componentes
   Convenção: x leste, z sul; ângulo 0° = sul, 90° = leste.
   Cada edifício é construído em coordenadas locais com a fachada em +z,
   voltada para a praça central.
   ============================================================ */
const EXT = { cols: [], circ: [] }, places = [], spin = [], movers = [];
const WORLD_R = 650;
// Uma única planta alimenta a geometria, o mapa e a reserva de vegetação.
const ROADS = {
  rings: [
    { id: 'central', r0: 21, r1: 27, sw: 2.2 },
    { id: 'bairro', r0: 75, r1: 80, sw: 1.4 },
    { id: 'externo', r0: 102.5, r1: 107.5, sw: 1.4 }
  ],
  avenues: [0, 90, 180, 270].map(deg => ({ deg, r0: 24, r1: deg === 0 ? 142 : 105, w: deg === 0 ? 8 : 6, sw: deg === 0 ? 2 : 1.8 })),
  paths: [], access: []
};
function segmentDistance(x, z, a, b) {
  const dx = b[0] - a[0], dz = b[1] - a[1], q = cl(((x - a[0]) * dx + (z - a[1]) * dz) / (dx * dx + dz * dz || 1), 0, 1);
  return Math.hypot(x - a[0] - q * dx, z - a[1] - q * dz);
}
function onStreet(x, z, pad = 0) {
  const r = Math.hypot(x, z);
  if (ROADS.rings.some(v => r >= v.r0 - v.sw - pad && r <= v.r1 + v.sw + pad)) return true;
  if (ROADS.avenues.some(v => segmentDistance(x, z, polar(v.deg, v.r0), polar(v.deg, v.r1)) < v.w / 2 + v.sw + pad)) return true;
  if((ROADS.streets||[]).some(v=>segmentDistance(x,z,v.a,v.b)<v.w/2+(v.sw||0)+pad))return true;
  return [...ROADS.paths, ...ROADS.access].some(v => !v.landscape && segmentDistance(x, z, v.a, v.b) < v.w / 2 + pad);
}
function pavedLink(a, b, w = 2.4, access = false) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < .02) return;
  W0.box('calcada', w, .08, L + .12, (a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2, Math.atan2(b[0] - a[0], b[1] - a[1]));
  (access ? ROADS.access : ROADS.paths).push({ a, b, w });
}
let cityB, W0, cityG, pickG;
const hy = (x, z) => { const r = Math.hypot(x, z); if (r>613&&r<627)return -.45; if (r < 660) return 0; const k = cl((r - 660) / 120, 0, 1), s = k * k * (3 - 2 * k); return s * (17 + 8 * Math.sin(x * .021 + 1.3) * Math.cos(z * .017) + 5 * Math.sin(x * .05 + z * .04)); };

/* ---------- vegetação instanciada ---------- */
const V = {};
const LEAF = ['#2F6B44', '#3E7F4E', '#28593A', '#5E9150', '#4A8A5A', '#6AA35A', '#33724A'];
function initVeg() {
  const trunkG = new T.CylinderGeometry(.14, .26, 1, 7); trunkG.translate(0, .5, 0);
  const leafM = new T.MeshStandardMaterial({ color: 0xffffff, roughness: .92 }); leafM.envMapIntensity = .5; envMats.push(leafM); leafM.userData = { env0: .5 };
  const ico1 = new T.IcosahedronGeometry(1, 1), ico0 = new T.IcosahedronGeometry(1, 0);
  V.trunk = new Inst(trunkG, M('tronco'), 900); V.c1 = new Inst(ico1, leafM, 900); V.c2 = new Inst(ico1, leafM, 900); V.c3 = new Inst(ico1, leafM, 900);
  V.bush = new Inst(ico1, leafM, 2200); V.flw = new Inst(new T.IcosahedronGeometry(1, 0), leafM, 1600, false);
  V.forT = new Inst(trunkG, M('tronco'), 700, false); V.forC = new Inst(ico1, leafM, 700, false);
  V.reed = new Inst(new T.CylinderGeometry(.02, .035, 1, 4), leafM, 900, false);
}
const FLW = ['#E8B23A', '#C8603B', '#F3E8CF', '#2BB5A8', '#B23A6A', '#E8B23A'];
function treeAt(x, z, s = 1, o = {}) {
  const th = (1.7 + rnd() * .8) * s, ry = rnd() * TAU, ipe = o.ipe || rnd() < .07;
  V.trunk.add(x, 0, z, s * (.9 + rnd() * .3), th, s * (.9 + rnd() * .3), ry);
  const base = ipe ? '#E3B22C' : pick(LEAF), r1 = (1.5 + rnd() * .3) * s;
  V.c1.add(x, th + r1 * .5, z, r1, r1 * .85, r1, ry, base);
  V.c2.add(x + (rnd() - .5) * 1.5 * s, th + r1 * 1.15, z + (rnd() - .5) * 1.5 * s, r1 * .78, r1 * .7, r1 * .78, ry, ipe ? '#EDC23A' : pick(LEAF));
  V.c3.add(x + (rnd() - .5) * 1.7 * s, th + r1 * .35, z + (rnd() - .5) * 1.7 * s, r1 * .7, r1 * .6, r1 * .7, ry, ipe ? '#D9A423' : pick(LEAF));
  if (!o.nocol) EXT.circ.push({ x, z, r: .38 * s });
}
function forestAt(x, z, s) { const y = hy(x, z) - .3; V.forT.add(x, y, z, s, 2.4 * s, s, 0); V.forC.add(x, y + 2.4 * s + 1.1 * s, z, 3.0 * s, 2.5 * s, 3.0 * s, rnd() * 3, pick(LEAF)); }
function bushAt(x, z, s = 1, col = null) { V.bush.add(x, .35 * s, z, .6 * s, .45 * s, .6 * s, rnd() * 3, col || pick(LEAF)); }
function flowerAt(x, y, z, col) { V.flw.add(x, y, z, .09, .09, .09, 0, col || pick(FLW)); }
function bedFlowers(x, z, w, d, n = 14) { for (let i = 0; i < n; i++) { const px = x + (rnd() - .5) * w, pz = z + (rnd() - .5) * d; bushAt(px, pz, .45, pick(['#3E7F4E', '#4A8A5A'])); flowerAt(px, .5, pz); } }
function baobab(c, x, z, s = 1) { // árvore de copa larga e tronco robusto (referência à "árvore da palavra")
  c.cyl('tronco', .95 * s, 1.35 * s, 3.2 * s, x, 0, z, 14);
  for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + .3; c.cyl('tronco', .12 * s, .28 * s, 3 * s, x + Math.sin(a) * .7 * s, 3.0 * s, z + Math.cos(a) * .7 * s, 6) }
  const cols = ['fA', 'fB', 'fC', 'fD'];
  for (let i = 0; i < 7; i++) { const a = i * TAU / 7; c.ico(cols[i % 4], 2.3 * s, x + Math.sin(a) * 2.5 * s, 6.1 * s + (i % 2) * .5, z + Math.cos(a) * 2.5 * s, 1, .55, 1); }
  c.ico('fB', 2.8 * s, x, 6.5 * s, z, 1, .5, 1); EXT.circ.push({ x: c.w2(x, z)[0], z: c.w2(x, z)[1], r: 1.3 * s });
}

/* ---------- componentes arquitetônicos ---------- */
function winF(c, x, y, z, w, h, ry = 0, o = {}) {
  const s = c.sub(x, y, z, ry), t = Math.min(.09, w * .12), fr = o.fr || 'metalP', lit = o.lit != null ? o.lit : rnd() < .4;
  s.box(WM(lit), w - t, h - t, .04, 0, t / 2, .02);
  s.box(fr, t, h, .1, -w / 2 + t / 2, 0, .07); s.box(fr, t, h, .1, w / 2 - t / 2, 0, .07); s.box(fr, w, t, .1, 0, 0, .07); s.box(fr, w, t, .1, 0, h - t, .07);
  if (w > 1.4 && !o.nomull) s.box(fr, .05, h, .08, 0, 0, .07);
  if (h > 1.8 && !o.nomull) s.box(fr, w, .05, .08, 0, h * .62, .07);
  if (!o.nosill) s.box(o.sill || 'conc', w + .22, .07, .26, 0, -.07, .13);
  if (o.shade) s.box('concE', w + .5, .06, o.shade, 0, h + .06, o.shade / 2);
  if (o.rail) { s.box('metalP', w, .05, .05, 0, .95, o.rail); }
}
function doorF(c, x, y, z, w, h, ry = 0, o = {}) {
  const s = c.sub(x, y, z, ry), fr = o.fr || 'ouro';
  if (o.glass) { s.box('vidro', w - .2, h - .15, .05, 0, .02, .03); s.box('metalP', .06, h - .15, .07, 0, .02, .05); }
  else s.box(o.leaf || 'madeiraE', w - .2, h - .12, .09, 0, 0, .05);
  s.box(fr, .1, h, .14, -w / 2 + .05, 0, .07); s.box(fr, .1, h, .14, w / 2 - .05, 0, .07); s.box(fr, w, .12, .14, 0, h - .12, .07); s.box('conc', w + .3, .05, .55, 0, -.02, .26);
  if (!o.glass) s.box('ouro', .05, .8, .05, w * .3, h * .45, .12);
}
function steps(c, x, z, w, n, rise = .16, run = .36, m = 'pedra', ry = 0) { const s = c.sub(x, 0, z, ry); for (let i = 0; i < n; i++) s.box(m, w, rise * (n - i), run, 0, 0, run * i + run / 2); }
function toronRow(c, x0, x1, y, z, step = .9, ry = 0, m = 'madeiraE') { const s = c.sub(0, 0, z, ry); for (let x = x0; x <= x1 + .01; x += step) s.box(m, .13, .13, .85, x, y, .35); }
function pilaster(c, x, z, w, h, m = 'terra', ry = 0, taper = true) { const s = c.sub(x, 0, z, ry); s.box(m, w, h * .6, .9, 0, 0, .35); s.box(m, w * (taper ? .82 : 1), h * .4, .8, 0, h * .6, .3); s.box(m, w * .9, .35, .95, 0, h, .35); }
function parapet(c, w, d, x, y, z, t = .4, h = 1, m = 'terra') { c.box(m, w, h, t, x, y, z - d / 2 + t / 2); c.box(m, w, h, t, x, y, z + d / 2 - t / 2); c.box(m, t, h, d - t * 2, x - w / 2 + t / 2, y, z); c.box(m, t, h, d - t * 2, x + w / 2 - t / 2, y, z); }
function pvArray(c, x, y, z, w, d, nx, nz, tilt = .42) {
  const pw = w / nx, pd = d / nz, sn = Math.sin(tilt), cs = Math.cos(tilt);
  // O ponto mais baixo fica acima da cobertura, inclusive em painéis longos.
  const cy = y + .2 + sn * (pd - .08) / 2 + cs * .03;
  for (let k = 0; k < nz; k++) {
    const pz = z - d / 2 + pd * (k + .5);
    for (let i = 0; i < nx; i++) c.box('pv', pw - .08, .06, pd - .08, x - w / 2 + pw * (i + .5), cy - .03, pz, 0, -tilt);
    [-1, 1].forEach(side => {
      const rz = pz + side * pd * .32 * cs, top = cy + side * pd * .32 * sn - cs * .03;
      c.box('aco', w - .12, .05, .07, x, top - .05, rz);
      for (let i = 0; i <= 3; i++) c.box('aco', .05, top - y - .05, .05, x - w * .46 + w * .92 * i / 3, y, rz);
    });
  }
}

function canvasTex(w, h, fn) { const t = new T.CanvasTexture(mkCan(w, h, fn)); t.encoding = T.sRGBEncoding; t.anisotropy = 8; return t; }
function sign(c, text, x, y, z, w, h, ry = 0, o = {}) {
  const tex = canvasTex(512, Math.round(512 * h / w), (g, W, H) => { g.fillStyle = o.bg || '#14100D'; g.fillRect(0, 0, W, H); g.strokeStyle = o.fg || '#E8B23A'; g.lineWidth = 6; g.strokeRect(8, 8, W - 16, H - 16); g.fillStyle = o.fg || '#E8B23A'; g.textAlign = 'center'; g.textBaseline = 'middle'; const lines = text.split('\n'); const fs = Math.min(H / (lines.length + .6), 62); g.font = `800 ${fs}px "Bricolage Grotesque", system-ui, sans-serif`; lines.forEach((l, i) => g.fillText(l, W / 2, H / 2 + (i - (lines.length - 1) / 2) * fs * 1.15)); });
  const m = new T.MeshStandardMaterial({ map: tex, roughness: .6, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: .3 }); m.userData = { k: .6 }; glows.push(m);
  const me = new T.Mesh(new T.PlaneGeometry(w, h), m); me.matrixAutoUpdate = false; me.matrix.copy(c.M4(x, y + h / 2, z, ry)); me.matrixWorldNeedsUpdate = true; me.castShadow = false; cityG.add(me); return me;
}
function lampPost(x, z, ry = 0, h = 4.8) { W0.cyl('metalP', .05, .08, h, x, 0, z, 8); const [dx, dz] = [Math.sin(ry) * .55, Math.cos(ry) * .55]; W0.box('metalP', .08, .06, .6, x + dx * .5, h - .05, z + dz * .5, ry); W0.box('gLuz', .34, .09, .22, x + dx, h - .12, z + dz, ry); }
function bench(c, x, z, ry = 0, w = 1.8) { const s = c.sub(x, 0, z, ry); s.box('madeira', w, .06, .5, 0, .44, 0); s.box('madeira', w, .3, .05, 0, .5, -.22, 0, -.12); s.box('metalP', .06, .44, .46, -w / 2 + .15, 0, 0); s.box('metalP', .06, .44, .46, w / 2 - .15, 0, 0); }
function bins(c, x, z, ry = 0) { const s = c.sub(x, 0, z, ry), cs = ['azul', 'vermelho', 'verde', 'amarelo']; cs.forEach((m, i) => { s.box(m, .38, .85, .38, (i - 1.5) * .44, 0, 0); s.box('metalP', .4, .05, .4, (i - 1.5) * .44, .85, 0); }); }
function bikeRack(c, x, z, ry = 0, n = 6) { const s = c.sub(x, 0, z, ry); for (let i = 0; i < n; i++) { s.box('aco', .04, .8, .04, i * .6, 0, -.3); s.box('aco', .04, .8, .04, i * .6, 0, .3); s.box('aco', .04, .04, .64, i * .6, .8, 0); } s.box('conc', n * .6 + .3, .04, .9, (n - 1) * .3, 0, 0); }
function planterBox(c, x, z, w, d, ry = 0, h = .6, m = 'conc') { const s = c.sub(x, 0, z, ry); s.box(m, w, h, d, 0, 0, 0); s.box('terraSolo', w - .2, .06, d - .2, 0, h, 0); const [wx, wz] = c.w2(x, z); bedFlowers(wx, wz, w - .5, d - .5, Math.round(w * d * 2)); if (c.cols) c.col(x, z, w, d, ry); }
function evCharger(c, x, z, ry = 0) { const s = c.sub(x, 0, z, ry); s.box('aco', .35, 1.3, .22, 0, 0, 0); s.box('gTur', .2, .08, .02, 0, 1.0, .12); s.box('gTur', .06, .06, .02, 0, 1.18, .12); }

/* ---------- registro de lugares ---------- */
function place(key, x, z, ry, fn, o = {}) {
  const c = new Ctx(cityB, x, z, ry, 0, EXT.cols), meta = fn(c) || {}, i = places.length;
  const p = { key, x, z, ry, i, access: (meta.access || []).map(d => c.w2(d[0], d[1])), W: meta.W || 10, D: meta.D || 10, H: meta.H || 8, int: o.int || meta.int || null, label: o.label !== false, lblY: meta.lbl || meta.H || 8, doors: [], rr: o.r || 0, hasApron: !!(o.r && o.apron !== false), deg: o.deg != null ? o.deg : null };
  (meta.doors || []).forEach(d => { const [wx, wz] = c.w2(d[0], d[1]); p.doors.push({ x: wx, z: wz, int: d[2] || p.int, ry: ry + (d[3] || 0) }); });
  const [cx, cz] = c.w2(meta.pcx || 0, meta.pcz || 0); p.cx = cx; p.cz = cz; p.r = meta.R || Math.max(p.W, p.D) * .62;
  const pr = new T.Mesh(new T.BoxGeometry(p.W + 1.5, p.H, p.D + 1.5), new T.MeshBasicMaterial()); pr.position.set(cx, p.H / 2, cz); pr.rotation.y = ry; pr.layers.set(1); pr.userData.pi = i; pickG.add(pr);
  if (o.r && o.apron !== false) apron(c, meta.W || 10, meta.fd || meta.D || 10, o.r);
  if (meta.sign) { const at = meta.stele || [-4.8, (meta.fd || meta.D) / 2 + 5.4]; stele(c, at[0], at[1], meta.sign); }
  places.push(p); return p;
}
function resolvePlace(ref) { return typeof ref === 'number' ? places[ref] : places.find(p => p.key === ref); }
function stele(c, x, z, text) { c.box('pedraQ', 2.9, .3, .8, x, 0, z); c.box('pedraQ', 2.7, 1.9, .3, x, .3, z); sign(c, text, x, .75, z + .152, 2.3, 1.15, 0, { bg: '#2a1a10' }); c.col(x, z, 2.9, .8); }
function tr(c, x, z, s = 1, o) { const [wx, wz] = c.w2(x, z); if (!onStreet(wx, wz, .8 * s)) treeAt(wx, wz, s, o); }
function pipe(c, m, r, len, x, y, z, axis = 'z') { const g = new T.CylinderGeometry(r, r, len, 10); c.geoM(m, g, x, y, z, 0, axis === 'z' ? PI / 2 : 0, axis === 'x' ? PI / 2 : 0, TAU * r, len); }
function turbine(c, x, z, h = 12, s = 1) { // aerogerador com rotor animado
  c.cyl('branco', .12 * s, .3 * s, h, x, 0, z, 10); const [wx, wz] = c.w2(x, z), g = new T.Group(); g.position.set(wx, h, wz); g.rotation.y = c.ry; const r = new T.Group(); r.position.z = .5 * s; g.add(r);
  const bm = M('branco'); for (let k = 0; k < 3; k++) { const b = new T.Group(); b.rotation.z = k * TAU / 3; const me = new T.Mesh(new T.BoxGeometry(.2 * s, 4.6 * s, .06 * s), bm); me.position.y = 2.4 * s; me.castShadow = true; b.add(me); r.add(b); }
  const hub = new T.Mesh(new T.SphereGeometry(.28 * s, 10, 8), bm); hub.position.z = .1; r.add(hub); const nac = new T.Mesh(new T.BoxGeometry(.36 * s, .36 * s, 1.2 * s), bm); nac.castShadow = true; g.add(nac); cityG.add(g); spin.push({ o: r, a: 'z', v: 1.3 + rnd() * .5 });
}
const faceCenter = (x, z) => (x || z) ? Math.atan2(-x, -z) : 0;
function placePolar(key, deg, r, fn, o = {}) { const [x, z] = polar(deg, r); return place(key, x, z, o.ry != null ? o.ry : faceCenter(x, z), fn, { ...o, r, deg }); }
const APRON_START = 29.3;
function apron(c, W, D, r) { // caminho de acesso entre o anel viário e o edifício
  const L = r - D / 2 - APRON_START - .6; if (L < 1) return;
  pavedLink(c.w2(0, D / 2 + .1), c.w2(0, r - 28.5), 4.4, true); c.box('praca', Math.min(W * .8, 16), .07, 4.4, 0, 0, D / 2 + 2.5);
  ROADS.access.push({ a: c.w2(-Math.min(W * .8, 16) / 2, D / 2 + 2.5), b: c.w2(Math.min(W * .8, 16) / 2, D / 2 + 2.5), w: 4.4, forecourt: true });
  const side = 3.4; [-1, 1].forEach(sd => { for (let k = 0; k < Math.floor(L / 10); k++) { const [wx, wz] = c.w2(sd * 4.4, D / 2 + 6 + k * 9); lampPost(wx, wz, c.ry + (sd > 0 ? -PI / 2 : PI / 2)); } });
}

/* ---------- terreno e vias ---------- */
function buildTerrain(scene) {
  const SZ = 1680, N = 160, g = new T.PlaneGeometry(SZ, SZ, N, N); g.rotateX(-PI / 2);
  const p = g.attributes.position, col = new Float32Array(p.count * 3), a = C3(0x87AA5C), b = C3(0x6E9650), d = C3(0xB5A666), h = C3(0x5E8247), cc = new T.Color();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), y = hy(x, z); p.setY(i, y);
    const n = .5 + .25 * Math.sin(x * .09 + z * .03) + .25 * Math.sin(z * .11 - x * .05), far = cl((Math.hypot(x, z) - 130) / 120, 0, 1);
    cc.copy(a).lerp(b, n).lerp(d, cl(Math.sin(x * .02 + z * .027) * .5 + .1, 0, .5) * .6).lerp(h, far * .6); col[i * 3] = cc.r; col[i * 3 + 1] = cc.g; col[i * 3 + 2] = cc.b;
  }
  g.setAttribute('color', new T.BufferAttribute(col, 3)); g.computeVertexNormals();
  const t = getTex('grass').clone(); t.needsUpdate = true; t.repeat.set(SZ / 6, SZ / 6);
  const m = new T.MeshStandardMaterial({ map: t, bumpMap: t, bumpScale: 1.2, vertexColors: true, roughness: 1, color: 0xffffff }); m.envMapIntensity = .5; envMats.push(m); m.userData = { env0: .5 };
  const ground = new T.Mesh(g, m); ground.receiveShadow = true; scene.add(ground); return ground;
}
function ringFlat(m, r0, r1, y, seg = 128) { W0.flat(m, new T.RingGeometry(r0, r1, seg), 0, y, 0, r1 * 2); }
function curbRing(r, y0, h, seg = 128) { W0.cyl('curb', r, r, h, 0, y0, 0, seg, true); }
function radialBox(deg, r0, r1, w, m, y, h = .05) { const [cx, cz] = polar(deg, (r0 + r1) / 2); W0.box(m, w, h, r1 - r0, cx, y, cz, deg * PI / 180); }
// Calçadas e bordas interrompidas nos cruzamentos: pista sempre livre.
function ringArc(m, r0, r1, a0, a1, y = .1) {
  const n = Math.max(2, Math.ceil((a1 - a0) * 48)), pos = [], uv = [], ind = [];
  for (let k = 0; k <= n; k++) { const a = lerp(a0, a1, k / n); for (const r of [r0, r1]) { const x = Math.sin(a) * r, z = Math.cos(a) * r; pos.push(x, 0, z); uv.push(x / (r1 * 2) + .5, z / (r1 * 2) + .5); } }
  for (let k = 0; k < n; k++) { const i = k * 2; ind.push(i, i + 1, i + 2, i + 1, i + 3, i + 2); }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); g.setIndex(ind); g.computeVertexNormals();
  W0.geoM(m, g, 0, y, 0, 0, 0, 0, r1 * 2);
}
function openRing(m, r0, r1, y = .1) {
  const cuts = ROADS.avenues.filter(v=>v.r0<=r1&&v.r1>=r0).map(v => ({ a: v.deg * PI / 180, gap: Math.asin((v.w / 2 + .14) / r0) }));
  cuts.forEach((v, i) => { const next = cuts[(i + 1) % cuts.length], end = next.a + (i === cuts.length - 1 ? TAU : 0) - next.gap; ringArc(m, r0, r1, v.a + v.gap, end, y); });
}
function crossing(deg, radius, width, depth = 2.2, radial = true) {
  const a = deg * PI / 180, [cx, cz] = polar(deg, radius), nx = Math.cos(a), nz = -Math.sin(a);
  const n = Math.floor(width / .85);
  for (let k = 0; k < n; k++) { const off = (k - (n - 1) / 2) * .85;
    W0.box('marca', .44, .012, depth, cx + (radial ? nx : Math.sin(a)) * off, .048, cz + (radial ? nz : Math.cos(a)) * off, a + (radial ? 0 : PI / 2));
  }
}
function buildRoads() {
  W0.flat('praca', new T.CircleGeometry(19, 96), 0, .1, 0, 38); curbRing(19, 0, .1);
  ringFlat('calcada', 19, 21, .1); curbRing(21, 0, .1);
  ROADS.rings.forEach((r, ri) => {
    ringFlat('asfalto', r.r0, r.r1, .04, 192);
    if (ri) openRing('calcada', r.r0 - r.sw, r.r0, .1);
    openRing('calcada', r.r1, r.r1 + r.sw, .1);
    if (ri) openRing('curb', r.r0 - .08, r.r0, .112);
    openRing('curb', r.r1, r.r1 + .08, .112);
    // Tracejado tangencial em toda a volta; livre nas bocas dos cruzamentos.
    const radius = (r.r0 + r.r1) / 2, count = Math.round(TAU * radius / 6);
    for (let k = 0; k < count; k++) { const deg = k * 360 / count, a = deg * PI / 180;
      if (ROADS.avenues.some(v => Math.abs(wrapAng(a - v.deg * PI / 180)) * radius < v.w / 2 + 1.2)) continue;
      const [x, z] = polar(deg, radius); W0.box('marca', .13, .012, 1.8, x, .048, z, a + PI / 2);
    }
  });
  ROADS.avenues.forEach(v => {
    const { deg, w, sw } = v, a = deg * PI / 180, [ex, ez] = polar(deg, 1), off = (w + sw) / 2;
    radialBox(deg, v.r0, v.r1, w, 'asfalto', .035, .008);
    // Calçadas laterais só entre os anéis, sem atravessar suas pistas.
    const intervals = [[29.2, 73.6], [81.4, 101.1]];
    if (deg === 0) intervals.push([108.9,157],[163,292],[308,550],[570,v.r1]);
    intervals.forEach(([r0, r1]) => [-1, 1].forEach(sg => {
      const [x, z] = polar(deg, (r0 + r1) / 2);
      W0.box('calcada', sw, .1, r1 - r0, x + ez * off * sg, 0, z - ex * off * sg, a);
      W0.box('curb', .08, .11, r1 - r0, x + ez * (w / 2 + .04) * sg, 0, z - ex * (w / 2 + .04) * sg, a);
    }));
    for (let r = 32; r < v.r1 - 2; r += 6) {
      if (ROADS.rings.some(v => r > v.r0 - 3 && r < v.r1 + 3)) continue;
      const [x, z] = polar(deg, r); W0.box('marca', .14, .012, 2.4, x, .048, z, a);
    }
    [31.2, 71.5, 83.5, 99].forEach(r => crossing(deg, r, w - .5));
    if (deg === 0) crossing(deg, 111, w - .5);
  });
  [45, 135, 225, 315].forEach(deg => {
    pavedLink(polar(deg, 28.5), polar(deg, 74.3), 3);
    pavedLink(polar(deg, 80.7), polar(deg, 101.8), 3.2);
    [77.5, 105].forEach(r => crossing(deg, r, 4.4, 3, false));
  });
  for (let k = 0; k < 16; k++) { const [x, z] = polar(k * 22.5 + 11.25, 28.4); lampPost(x, z, faceCenter(x, z)); }
  [80.7, 108.2].forEach(r => { for (let k = 0; k < 32; k++) { const [x, z] = polar(k * 11.25 + 5.625, r); lampPost(x, z, faceCenter(x, z) + PI); } });
  ROADS.avenues.forEach(v => { for (let r = 38; r < v.r1 - 6; r += 14) {
    if (ROADS.rings.some(v => r > v.r0 - 3 && r < v.r1 + 3)) continue;
    const [ex, ez] = polar(v.deg, 1), s = v.w / 2 + v.sw + .3, [x, z] = polar(v.deg, r); lampPost(x + ez * s, z - ex * s, v.deg * PI / 180 + PI / 2);
  } });
}
