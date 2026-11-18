/* ============================================================
   NÚCLEO — utilidades, texturas procedurais, materiais PBR,
   agrupamento de geometrias, colisores, céu e iluminação
   ============================================================ */
'use strict';
const T = THREE, PI = Math.PI, TAU = PI * 2;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const cl = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
let _s = 20261120;
const rnd = () => (_s = (_s * 16807) % 2147483647) / 2147483647;
const rr = (a, b) => a + (b - a) * rnd();
const pick = a => a[(rnd() * a.length) | 0];
const C3 = h => new T.Color(h).convertSRGBToLinear();
const polar = (deg, r) => { const a = deg * PI / 180; return [r * Math.sin(a), r * Math.cos(a)]; };
const wrapAng = a => ((a + PI) % TAU + TAU) % TAU - PI;

/* ---------- texturas procedurais (tons de cinza, tingidas pelo material) ---------- */
const mkCan = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); return c; };
const sp = (g, W, H, n, col, s = 1.4) => { g.fillStyle = col; for (let i = 0; i < n; i++) g.fillRect(rnd() * W, rnd() * H, rr(.4, s), rr(.4, s)); };
const tile9 = (W, H, x, y, r, fn) => { for (const ox of [-W, 0, W]) for (const oy of [-H, 0, H]) if (x + ox + r > 0 && x + ox - r < W && y + oy + r > 0 && y + oy - r < H) fn(x + ox, y + oy); };
const blot = (g, W, H, n, a, r0 = 20, r1 = 90) => {
  for (let i = 0; i < n; i++) {
    const x = rnd() * W, y = rnd() * H, r = rr(r0, r1), dark = rnd() < .55;
    tile9(W, H, x, y, r, (px, py) => { const k = g.createRadialGradient(px, py, 0, px, py, r); k.addColorStop(0, dark ? `rgba(40,30,20,${a})` : `rgba(255,250,240,${a})`); k.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = k; g.fillRect(px - r, py - r, r * 2, r * 2); });
  }
};
const gv = (v, a = 1) => `rgba(${v | 0},${v | 0},${v | 0},${a})`;
const TXP = {
  earth(g, W, H) { // terra estabilizada em camadas (taipa)
    const n = 10, bh = H / n;
    for (let i = 0; i < n; i++) {
      const v = rr(222, 244); g.fillStyle = gv(v); g.fillRect(0, i * bh, W, bh);
      g.fillStyle = gv(110, .2); g.fillRect(0, (i + 1) * bh - 2, W, 2);
      g.fillStyle = gv(255, .06); g.fillRect(0, i * bh + 1, W, 2);
      for (let k = 0; k < 16; k++) { g.fillStyle = rnd() < .5 ? gv(255, rr(.03, .1)) : gv(60, rr(.04, .12)); g.fillRect(rnd() * W, i * bh + rr(0, bh * .7), rr(20, 120), rr(2, bh * .4)); }
    }
    blot(g, W, H, 26, .07); sp(g, W, H, 1400, gv(60, .22)); sp(g, W, H, 800, gv(255, .2));
    g.strokeStyle = gv(80, .16); g.lineWidth = 1;
    for (let i = 0; i < 6; i++) { let x = rnd() * W, y = rnd() * H; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += rr(-6, 6); y += rr(6, 18); g.lineTo(x, y); } g.stroke(); }
  },
  plaster(g, W, H) { g.fillStyle = gv(232); g.fillRect(0, 0, W, H); blot(g, W, H, 40, .06, 30, 120); sp(g, W, H, 3200, gv(90, .22)); sp(g, W, H, 1800, gv(255, .35)); },
  stone(g, W, H) { // alvenaria de pedra aparelhada
    g.fillStyle = gv(70); g.fillRect(0, 0, W, H);
    let y = 0;
    while (y < H) {
      const rh = Math.min(H - y, rr(.2, .32) * H * .5 + 12); let x = -rr(0, 80);
      while (x < W) {
        const bw = rr(70, 150), v = rr(168, 232); g.fillStyle = gv(v); g.fillRect(x + 2, y + 2, bw - 4, rh - 4);
        const k = g.createLinearGradient(0, y, 0, y + rh); k.addColorStop(0, gv(255, .12)); k.addColorStop(1, gv(0, .12)); g.fillStyle = k; g.fillRect(x + 2, y + 2, bw - 4, rh - 4);
        x += bw;
      }
      y += rh;
    }
    blot(g, W, H, 16, .06); sp(g, W, H, 3000, gv(40, .3));
  },
  concrete(g, W, H) { // concreto com marcas de fôrma
    g.fillStyle = gv(206); g.fillRect(0, 0, W, H); blot(g, W, H, 50, .06, 30, 140);
    for (let i = 0; i < 90; i++) { g.fillStyle = gv(60, rr(.02, .07)); g.fillRect(rnd() * W, 0, rr(1, 3), H); }
    sp(g, W, H, 4000, gv(50, .25)); sp(g, W, H, 2000, gv(255, .3));
    g.strokeStyle = gv(40, .35); g.lineWidth = 2; for (let i = 0; i <= 2; i++) { g.beginPath(); g.moveTo(0, i * H / 2); g.lineTo(W, i * H / 2); g.stroke(); g.beginPath(); g.moveTo(i * W / 2, 0); g.lineTo(i * W / 2, H); g.stroke(); }
    g.fillStyle = gv(40, .5); for (let x = 1; x < 4; x++) for (let y = 1; y < 4; y++) { g.beginPath(); g.arc(x * W / 4, y * H / 4, 2.6, 0, TAU); g.fill(); }
  },
  wood(g, W, H) { // tábuas verticais
    const n = 8, bw = W / n;
    for (let i = 0; i < n; i++) {
      const v = rr(176, 236); g.fillStyle = gv(v); g.fillRect(i * bw, 0, bw, H);
      for (let k = 0; k < 24; k++) { g.strokeStyle = gv(rnd() < .5 ? 60 : 255, rr(.05, .16)); g.lineWidth = rr(.6, 1.6); const x = i * bw + rr(2, bw - 2); g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + rr(-4, 4), H * .3, x + rr(-4, 4), H * .7, x + rr(-3, 3), H); g.stroke(); }
      g.fillStyle = gv(30, .55); g.fillRect(i * bw, 0, 2, H);
    }
  },
  woodH(g, W, H) { // assoalho
    const n = 12, bh = H / n;
    for (let i = 0; i < n; i++) {
      let x = -rr(0, W / 2);
      while (x < W) { const bw = rr(W * .35, W * .6), v = rr(180, 236); g.fillStyle = gv(v); g.fillRect(x, i * bh, bw, bh); g.fillStyle = gv(30, .5); g.fillRect(x, i * bh, 2, bh); for (let k = 0; k < 8; k++) { g.strokeStyle = gv(60, rr(.05, .14)); g.beginPath(); const y = i * bh + rr(2, bh - 2); g.moveTo(x, y); g.lineTo(x + bw, y + rr(-2, 2)); g.stroke(); } x += bw; }
      g.fillStyle = gv(30, .55); g.fillRect(0, i * bh, W, 2);
    }
  },
  tile(g, W, H) { // placas de piso
    const n = 4, s = W / n;
    for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) { g.fillStyle = gv(rr(205, 240)); g.fillRect(x * s, y * s, s, s); const k = g.createLinearGradient(x * s, y * s, x * s + s, y * s + s); k.addColorStop(0, gv(255, .12)); k.addColorStop(1, gv(0, .08)); g.fillStyle = k; g.fillRect(x * s, y * s, s, s); }
    g.fillStyle = gv(70, .6); for (let i = 0; i <= n; i++) { g.fillRect(i * s - 1.5, 0, 3, H); g.fillRect(0, i * s - 1.5, W, 3); }
    blot(g, W, H, 14, .05); sp(g, W, H, 2400, gv(60, .2));
  },
  paver(g, W, H) { // calçada em pavers
    g.fillStyle = gv(80); g.fillRect(0, 0, W, H); const rw = 32, bw = 64;
    for (let r = 0; r < H / rw; r++) for (let c = -1; c < W / bw + 1; c++) { g.fillStyle = gv(rr(176, 236)); g.fillRect(c * bw + (r % 2) * bw / 2 + 2, r * rw + 2, bw - 4, rw - 4); }
    sp(g, W, H, 2400, gv(50, .3));
  },
  brick(g, W, H) { // tijolo cerâmico
    g.fillStyle = gv(95); g.fillRect(0, 0, W, H); const rw = 32, bw = 80;
    for (let r = 0; r < H / rw; r++) for (let c = -1; c < W / bw + 1; c++) { g.fillStyle = gv(rr(170, 240)); g.fillRect(c * bw + (r % 2) * bw / 2 + 3, r * rw + 3, bw - 6, rw - 6); }
    blot(g, W, H, 16, .06); sp(g, W, H, 2400, gv(50, .3));
  },
  asphalt(g, W, H) { g.fillStyle = gv(190); g.fillRect(0, 0, W, H); blot(g, W, H, 30, .05, 20, 80); sp(g, W, H, 7000, gv(30, .5), 1.8); sp(g, W, H, 4000, gv(255, .35), 1.4); },
  grass(g, W, H) { g.fillStyle = gv(200); g.fillRect(0, 0, W, H); blot(g, W, H, 80, .10, 10, 60); for (let i = 0; i < 9000; i++) { g.fillStyle = gv(rr(120, 255), rr(.1, .35)); g.fillRect(rnd() * W, rnd() * H, 1, rr(2, 6)); } },
  roof(g, W, H) { g.fillStyle = gv(210); g.fillRect(0, 0, W, H); const n = 8, s = W / n; for (let i = 0; i < n; i++) { g.fillStyle = gv(150, .6); g.fillRect(i * s, 0, 3, H); g.fillStyle = gv(255, .25); g.fillRect(i * s + 3, 0, 2, H); } blot(g, W, H, 10, .05); },
  pv(g, W, H) { g.fillStyle = gv(200); g.fillRect(0, 0, W, H); g.strokeStyle = gv(255, .55); g.lineWidth = 1.5; const n = 6; for (let i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * W / n, 0); g.lineTo(i * W / n, H); g.stroke(); g.beginPath(); g.moveTo(0, i * H / n); g.lineTo(W, i * H / n); g.stroke(); } },
  soil(g, W, H) { g.fillStyle = gv(190); g.fillRect(0, 0, W, H); blot(g, W, H, 40, .12, 8, 50); sp(g, W, H, 6000, gv(40, .45), 2); sp(g, W, H, 2000, gv(255, .25), 2); },
  slat(g, W, H) { const n = 10, s = W / n; g.fillStyle = gv(40); g.fillRect(0, 0, W, H); for (let i = 0; i < n; i++) { g.fillStyle = gv(rr(190, 240)); g.fillRect(i * s + 2, 0, s - 4, H); } },
};
const TXCACHE = {};
function getTex(name, size = 512) {
  if (TXCACHE[name]) return TXCACHE[name];
  const t = new T.CanvasTexture(mkCan(size, size, TXP[name]));
  t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 8; t.encoding = T.sRGBEncoding;
  return TXCACHE[name] = t;
}

/* ---------- padrões coloridos (referências visuais identificadas; sem significados atribuídos) ---------- */
const PAL = ['#B5532F', '#E8B23A', '#2BB5A8', '#1F4D3A', '#14100D', '#F3E8CF'];
const PATT = {
  friso(g, W, H) { // friso geométrico original do projeto
    g.fillStyle = '#3B2316'; g.fillRect(0, 0, W, H); g.fillStyle = '#E8B23A';
    for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(i * W / 4, H / 2); g.lineTo(i * W / 4 + W / 8, H / 4); g.lineTo(i * W / 4 + W / 4, H / 2); g.fill(); g.beginPath(); g.moveTo(i * W / 4, H); g.lineTo(i * W / 4 + W / 8, H * .75); g.lineTo(i * W / 4 + W / 4, H); g.fill(); }
    g.fillStyle = '#2BB5A8'; for (let i = 0; i < 4; i++) g.fillRect(i * W / 4 + W / 10, H * .55, W / 28, H / 8); g.fillStyle = '#B5532F'; g.fillRect(0, 0, W, H / 12);
  },
  kente(g, W, H) { // faixas tecidas (inspirado em tecidos como o kente, de Gana)
    const cols = ['#E8B23A', '#1F4D3A', '#B5532F', '#14100D', '#2BB5A8', '#F3E8CF'], n = 8, s = W / n;
    for (let i = 0; i < n; i++) { g.fillStyle = cols[i % 6]; g.fillRect(i * s, 0, s, H); }
    for (let y = 0; y < H; y += H / 8) for (let i = 0; i < n; i++) { g.fillStyle = cols[(i + 2 + ((y / (H / 8)) | 0)) % 6]; g.fillRect(i * s + s * .2, y + 3, s * .6, H / 8 - 6); }
    g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 1; for (let y = 0; y < H; y += 3) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  },
  mud(g, W, H) { // geometria em preto e creme (inspirada em tecidos tingidos com lama, como o bògòlanfini do Mali)
    g.fillStyle = '#E9DDC0'; g.fillRect(0, 0, W, H); g.fillStyle = '#2a1a10';
    for (let i = 0; i < 4; i++) { const x = i * W / 4; g.fillRect(x + 4, 6, W / 4 - 8, 7); g.fillRect(x + 4, H - 13, W / 4 - 8, 7); g.beginPath(); g.moveTo(x + W / 8, 24); g.lineTo(x + W / 4 - 10, H / 2); g.lineTo(x + W / 8, H - 24); g.lineTo(x + 10, H / 2); g.closePath(); g.fill(); g.fillStyle = '#E9DDC0'; g.beginPath(); g.arc(x + W / 8, H / 2, 6, 0, TAU); g.fill(); g.fillStyle = '#2a1a10'; }
  },
  ndb(g, W, H) { // blocos angulares coloridos (inspirado na pintura mural ndebele, África do Sul)
    g.fillStyle = '#F3E8CF'; g.fillRect(0, 0, W, H); const c = ['#2BB5A8', '#B5532F', '#E8B23A', '#1F4D3A', '#14100D'];
    for (let i = 0; i < 4; i++) { const x = i * W / 4; g.fillStyle = c[i % 5]; g.beginPath(); g.moveTo(x + 4, H - 6); g.lineTo(x + W / 8, 8); g.lineTo(x + W / 4 - 4, H - 6); g.closePath(); g.fill(); g.fillStyle = c[(i + 2) % 5]; g.beginPath(); g.moveTo(x + W / 8 - 14, H - 6); g.lineTo(x + W / 8, H * .45); g.lineTo(x + W / 8 + 14, H - 6); g.closePath(); g.fill(); g.fillStyle = '#14100D'; g.fillRect(x, H - 6, W / 4, 6); }
  },
};
const PTX = {};
function getPatt(name, rx = 1, ry = 1) {
  const k = name + rx + 'x' + ry; if (PTX[k]) return PTX[k];
  const t = new T.CanvasTexture(mkCan(256, 256, PATT[name])); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 8; t.encoding = T.sRGBEncoding; return PTX[k] = t;
}
/* arte original (composições abstratas com a paleta do projeto) */
function artCanvas(w, h, seed, mode) {
  return mkCan(w, h, (g) => {
    let s = seed * 9301 + 49297; const r = () => (s = (s * 16807) % 2147483647) / 2147483647, c = () => PAL[(r() * 6) | 0];
    const m = mode == null ? seed % 4 : mode;
    g.fillStyle = c(); g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9; i++) {
      g.fillStyle = c(); g.beginPath(); const x = w * r(), y = h * r(), z = 40 + r() * h * .35;
      if (m === 0) g.arc(x, y, z, 0, TAU); else if (m === 1) g.rect(x, 0, z / 2, h); else if (m === 2) { g.moveTo(x, y); g.lineTo(x + z, y); g.lineTo(x + z / 2, y - z); } else { g.rect(x, y, z, z * .5); }
      g.fill();
    }
    g.strokeStyle = '#E8B23A'; g.lineWidth = 5; for (let i = 1; i < 5; i++) { g.beginPath(); g.arc(w / 2, h / 2, i * h * .1, 0, TAU); g.stroke(); }
  });
}

/* ---------- materiais ---------- */
const MD = {
  terra: { t: 'earth', c: 0xD0724A, r: .95, tile: 2.4, b: .7 }, ocre: { t: 'earth', c: 0xE0B156, r: .95, tile: 2.4, b: .7 },
  areia: { t: 'earth', c: 0xD8C49C, r: .95, tile: 2.4, b: .6 }, marrom: { t: 'earth', c: 0x7A5238, r: .95, tile: 2.4, b: .6 },
  reboco: { t: 'plaster', c: 0xF0E4CC, r: .92, tile: 3, b: .8 }, rebocoB: { t: 'plaster', c: 0xFBF6EA, r: .92, tile: 3, b: .8 },
  rebocoT: { t: 'plaster', c: 0x49B3A8, r: .9, tile: 3, b: .8 }, rebocoO: { t: 'plaster', c: 0xE9B74E, r: .9, tile: 3, b: .8 },
  rebocoR: { t: 'plaster', c: 0xC8603B, r: .9, tile: 3, b: .8 }, rebocoV: { t: 'plaster', c: 0x4E8B63, r: .9, tile: 3, b: .8 },
  pedra: { t: 'stone', c: 0xA79F92, r: .9, tile: 2.2, b: 2 }, pedraQ: { t: 'stone', c: 0xC4AE8A, r: .9, tile: 2.2, b: 2 },
  conc: { t: 'concrete', c: 0xB5B1A8, r: .88, tile: 3, b: 1 }, concE: { t: 'concrete', c: 0x77746E, r: .85, tile: 3, b: 1 }, concD: { t: 'concrete', c: 0x8A877F, r: .8, tile: 3, b: 1, side: 2 }, madD: { t: 'wood', c: 0xA0693E, r: .75, tile: 1.6, b: .8, side: 2 }, palha: { t: 'earth', c: 0xD9B66A, r: 1, tile: 1.2, b: .4 }, terraD: { t: 'earth', c: 0xD0724A, r: .95, tile: 2.4, b: 1.2, side: 2 },
  madeira: { t: 'wood', c: 0xA0693E, r: .75, tile: 1.6, b: .8 }, madeiraE: { t: 'wood', c: 0x5A3722, r: .75, tile: 1.6, b: .8 }, madeiraC: { t: 'wood', c: 0xCFA06A, r: .75, tile: 1.6, b: .8 },
  tijolo: { t: 'brick', c: 0xCC7447, r: .92, tile: 2, b: 1.6 },
  pPedra: { t: 'tile', c: 0xDCD0B8, r: .45, tile: 2.4, b: .3 }, pEsc: { t: 'tile', c: 0x6A5E52, r: .4, tile: 2.4, b: .3 }, pTur: { t: 'tile', c: 0x6FB2AA, r: .4, tile: 2.4, b: .3 },
  pMad: { t: 'woodH', c: 0xBC8446, r: .55, tile: 2.2, b: .4 }, pConc: { t: 'concrete', c: 0xA8A59F, r: .35, tile: 3, b: .3 },
  asfalto: { t: 'asphalt', c: 0x4A4642, r: .95, tile: 4, b: 1, poly: -2 }, calcada: { t: 'paver', c: 0xD2C2A0, r: .9, tile: 2, b: 1, poly: -4 },
  praca: { t: 'tile', c: 0xCDBB98, r: .7, tile: 3, b: .6, poly: -4 }, grama: { t: 'grass', c: 0x86A85A, r: 1, tile: 6, b: 1.2 },
  gramaE: { t: 'grass', c: 0x5F8A48, r: 1, tile: 6, b: 1.2 }, terraSolo: { t: 'soil', c: 0x7C5A3C, r: 1, tile: 2, b: 1.6, poly: -3 },
  cascalho: { t: 'soil', c: 0xB9AE9A, r: 1, tile: 2, b: 1.6, poly: -3 },
  metalP: { c: 0x1D1B19, m: .85, r: .38 }, aco: { c: 0xB9BCBD, m: .9, r: .3 }, ouro: { c: 0xD0A040, m: 1, r: .32 }, cobre: { c: 0xB86B45, m: .95, r: .35 },
  telhaM: { t: 'roof', c: 0x4C5155, m: .6, r: .45, tile: 2, b: .6 },
  vidro: { c: 0x294B52, m: .15, r: .05, env: 1.8 }, vidroT: { c: 0x457473, m: .12, r: .06, env: 1.6 },
  pv: { t: 'pv', c: 0x1A2F55, m: .8, r: .22, tile: 1.6, env: 1.4 },
  tronco: { t: 'wood', c: 0x6A4630, r: .95, tile: 1.4, b: 1 },
  fA: { c: 0x2F6B44, r: .9 }, fB: { c: 0x3E7F4E, r: .9 }, fC: { c: 0x28593A, r: .9 }, fD: { c: 0x5E9150, r: .9 },
  agua: { c: 0x315D61, m: .05, r: .08, env: 1.6 }, branco: { c: 0xF4F0E6, r: .7 }, preto: { c: 0x181513, r: .6 },
  papel: { c: 0xEFE6D2, r: .8 }, tecido: { c: 0xB5532F, r: .95 }, tecidoT: { c: 0x2BB5A8, r: .95 }, tecidoO: { c: 0xE8B23A, r: .95 }, tecidoV: { c: 0x1F4D3A, r: .95 },
  azul: { c: 0x2B62A8, r: .5 }, vermelho: { c: 0xC03A2B, r: .5 }, verde: { c: 0x2C8A4B, r: .5 }, amarelo: { c: 0xE8B923, r: .5 },
  friso: { pat: 'friso', c: 0xffffff, r: .8, tile: 1.1 }, kente: { pat: 'kente', c: 0xffffff, r: .9, tile: 1.5 }, mud: { pat: 'mud', c: 0xffffff, r: .9, tile: 1.2 }, ndb: { pat: 'ndb', c: 0xffffff, r: .85, tile: 2.2 },
  sombra: { c: 0x000000, r: 1, decal: true }, curb: { t: 'paver', c: 0xB8AA8A, r: .9, tile: 2, b: 1, side: 2 }, marca: { c: 0xF2EEE2, r: .8, poly: -8 }, marcaT: { c: 0x2BB5A8, r: .8, poly: -8 },
};
const MATS = {}, glows = [], envMats = [];
function M(n) {
  if (MATS[n]) return MATS[n];
  const d = MD[n]; if (!d) throw new Error('material? ' + n);
  const o = { color: C3(d.c), roughness: d.r == null ? .9 : d.r, metalness: d.m || 0 };
  if (d.pat) o.map = getPatt(d.pat);
  if (d.t) { o.map = getTex(d.t); if (d.b) { o.bumpMap = o.map; o.bumpScale = d.b * .035; o.roughnessMap=o.map; } }
  if (d.decal) { o.transparent = true; o.opacity = .35; o.depthWrite = false; }
  const m = ['aco','ouro','cobre','vidro','vidroT','agua'].includes(n)?new T.MeshPhysicalMaterial({...o,clearcoat:n==='agua'?.8:.4,clearcoatRoughness:.12}):new T.MeshStandardMaterial(o); m.envMapIntensity = d.env || .6; m.userData = { tile: d.tile || 2, cast: !d.decal, glass: !!d.env && !d.t, env0: m.envMapIntensity };
  if (d.side) m.side = T.DoubleSide;
  if (d.poly) { m.polygonOffset = true; m.polygonOffsetFactor = d.poly; m.polygonOffsetUnits = d.poly; }
  envMats.push(m); return MATS[n] = m;
}
/* materiais emissivos (acendem à noite) */
const GLD = { gOuro: [0xE8B23A, 1], gTur: [0x2BB5A8, 1], gTerra: [0xE0703A, .8], gLuz: [0xFFE2A8, 1.3], gBranco: [0xFFF4DC, 1.4], gAzul: [0x6EA8FF, .8], gVerde: [0x7DDC8A, .8] };
function GL(n) {
  if (MATS[n]) return MATS[n];
  const [c, k] = GLD[n]; const m = new T.MeshStandardMaterial({ color: C3(c), emissive: C3(c), emissiveIntensity: .4 * k, roughness: .5 });
  m.userData = { tile: 2, k, cast: false }; glows.push(m); return MATS[n] = m;
}
const getMat = n => (typeof n !== 'string' ? n : GLD[n] ? GL(n) : M(n));
/* vidro iluminado/escuro das janelas: acende à noite */
const winMats = [];
function WM(lit) { const k = lit ? 'winLit' : 'winDark'; if (MATS[k]) return MATS[k]; const m = new T.MeshStandardMaterial({ color: C3(lit ? 0xD9A85C : 0x1B3238), emissive: C3(0xFFC878), emissiveIntensity: 0, roughness: .08, metalness: .85 }); m.envMapIntensity = 1.7; m.userData = { tile: 2, lit, cast: false, glass: true, env0: 1.7 }; winMats.push(m); envMats.push(m); return MATS[k] = m; }

/* ---------- agrupamento estático de geometrias (um desenho por material) ---------- */
const CUBE = (() => {
  const faces = [[[1, 0, 0], [0, 0, -1], [0, 1, 0]], [[-1, 0, 0], [0, 0, 1], [0, 1, 0]], [[0, 1, 0], [1, 0, 0], [0, 0, -1]], [[0, -1, 0], [1, 0, 0], [0, 0, 1]], [[0, 0, 1], [1, 0, 0], [0, 1, 0]], [[0, 0, -1], [-1, 0, 0], [0, 1, 0]]];
  const P = [], N = [], U = [], D = []; // D: [qual eixo escalar em u, em v]
  faces.forEach(([n, r, u]) => {
    const c = n.map(v => v * .5); const bl = c.map((v, i) => v - .5 * r[i] - .5 * u[i]), br = c.map((v, i) => v + .5 * r[i] - .5 * u[i]), tr = c.map((v, i) => v + .5 * r[i] + .5 * u[i]), tl = c.map((v, i) => v - .5 * r[i] + .5 * u[i]);
    P.push(...bl, ...br, ...tr, ...tl); for (let i = 0; i < 4; i++) N.push(...n); U.push(0, 0, 1, 0, 1, 1, 0, 1);
    D.push([r.map(Math.abs), u.map(Math.abs)]);
  });
  return { P, N, U, D };
})();
class Batch {
  constructor() { this.m = new Map(); }
  acc(mat) { let a = this.m.get(mat); if (!a) this.m.set(mat, a = { p: [], n: [], u: [], i: [], c: 0 }); return a; }
  box(mat, w, h, d, e) { // e: Matrix4.elements
    const a = this.acc(mat), tile = mat.userData.tile || 2, s = [w, h, d], b = a.c;
    for (let v = 0; v < 24; v++) {
      const x = CUBE.P[v * 3] * w, y = CUBE.P[v * 3 + 1] * h, z = CUBE.P[v * 3 + 2] * d;
      a.p.push(e[0] * x + e[4] * y + e[8] * z + e[12], e[1] * x + e[5] * y + e[9] * z + e[13], e[2] * x + e[6] * y + e[10] * z + e[14]);
      const nx = CUBE.N[v * 3], ny = CUBE.N[v * 3 + 1], nz = CUBE.N[v * 3 + 2];
      a.n.push(e[0] * nx + e[4] * ny + e[8] * nz, e[1] * nx + e[5] * ny + e[9] * nz, e[2] * nx + e[6] * ny + e[10] * nz);
      const f = (v / 4) | 0, du = CUBE.D[f][0], dv = CUBE.D[f][1];
      a.u.push(CUBE.U[v * 2] * (du[0] * s[0] + du[1] * s[1] + du[2] * s[2]) / tile, CUBE.U[v * 2 + 1] * (dv[0] * s[0] + dv[1] * s[1] + dv[2] * s[2]) / tile);
    }
    for (let f = 0; f < 6; f++) { const o = b + f * 4; a.i.push(o, o + 1, o + 2, o, o + 2, o + 3); }
    a.c += 24;
  }
  geo(mat, g, mx, su = 1, sv = su) { // geometria genérica (su, sv: tamanho em metros que o UV 0..1 cobre)
    const a = this.acc(mat), P = g.attributes.position, N = g.attributes.normal, U = g.attributes.uv, e = mx.elements, b = a.c, tile = mat.userData.tile || 2;
    for (let v = 0; v < P.count; v++) {
      const x = P.getX(v), y = P.getY(v), z = P.getZ(v); a.p.push(e[0] * x + e[4] * y + e[8] * z + e[12], e[1] * x + e[5] * y + e[9] * z + e[13], e[2] * x + e[6] * y + e[10] * z + e[14]);
      const nx = N.getX(v), ny = N.getY(v), nz = N.getZ(v); a.n.push(e[0] * nx + e[4] * ny + e[8] * nz, e[1] * nx + e[5] * ny + e[9] * nz, e[2] * nx + e[6] * ny + e[10] * nz);
      a.u.push(U ? U.getX(v) * su / tile : 0, U ? U.getY(v) * sv / tile : 0);
    }
    if (g.index) for (let i = 0; i < g.index.count; i++) a.i.push(b + g.index.getX(i)); else for (let i = 0; i < P.count; i++) a.i.push(b + i);
    a.c += P.count; g.dispose();
  }
  build(parent, opt = {}) {
    const out = [];
    this.m.forEach((a, mat) => {
      if (!a.c) return;
      const g = new T.BufferGeometry();
      g.setAttribute('position', new T.BufferAttribute(new Float32Array(a.p), 3)); g.setAttribute('normal', new T.BufferAttribute(new Float32Array(a.n), 3)); g.setAttribute('uv', new T.BufferAttribute(new Float32Array(a.u), 2));
      g.setIndex(new T.BufferAttribute(a.c > 65535 ? new Uint32Array(a.i) : new Uint16Array(a.i), 1)); g.computeBoundingSphere(); g.computeBoundingBox();
      const me = new T.Mesh(g, mat); me.castShadow = opt.cast !== false && mat.userData.cast !== false; me.receiveShadow = opt.receive !== false;
      if (mat.userData.decal) me.renderOrder = 1; me.matrixAutoUpdate = false; parent.add(me); out.push(me);
    });
    this.m.clear(); return out;
  }
}
/* construtor com transformação local→mundo + colisores */
const _o1 = new T.Vector3(1, 1, 1), _q = new T.Quaternion(), _e = new T.Euler(), _m4 = new T.Matrix4(), _p3 = new T.Vector3();
class Ctx {
  constructor(batch, x = 0, z = 0, ry = 0, y0 = 0, cols = null) { this.B = batch; this.x0 = x; this.z0 = z; this.ry = ry; this.y0 = y0; this.base = new T.Matrix4().compose(new T.Vector3(x, y0, z), new T.Quaternion().setFromEuler(new T.Euler(0, ry, 0)), _o1); this.cols = cols; this.cs = Math.cos(ry); this.sn = Math.sin(ry); }
  M4(x, y, z, ry = 0, rx = 0, rz = 0) { _e.set(rx, ry, rz, 'YXZ'); _q.setFromEuler(_e); _p3.set(x, y, z); return new T.Matrix4().multiplyMatrices(this.base, _m4.compose(_p3, _q, _o1)); }
  w2(x, z) { return [this.x0 + x * this.cs + z * this.sn, this.z0 - x * this.sn + z * this.cs]; } // local→mundo (x,z)
  box(m, w, h, d, x, y, z, ry = 0, rx = 0, rz = 0) { this.B.box(getMat(m), w, h, d, this.M4(x, y + h / 2, z, ry, rx, rz).elements); return this; }
  cyl(m, rt, rb, h, x, y, z, seg = 20, open = false) { const g = new T.CylinderGeometry(rt, rb, h, seg, 1, open); this.B.geo(getMat(m), g, this.M4(x, y + h / 2, z), TAU * Math.max(rt, rb), h); return this; }
  cone(m, r, h, x, y, z, seg = 4, ry = PI / 4, sx = 1, sz = 1) { const g = new T.CylinderGeometry(0, r, h, seg, 1); g.rotateY(ry); g.scale(sx, 1, sz); this.B.geo(getMat(m), g, this.M4(x, y + h / 2, z), TAU * r, h); return this; }
  sph(m, r, x, y, z, sx = 1, sy = 1, sz = 1, seg = 10) { const g = new T.SphereGeometry(r, seg, Math.max(5, seg - 3)); g.scale(sx, sy, sz); this.B.geo(getMat(m), g, this.M4(x, y, z), TAU * r, PI * r); return this; }
  ico(m, r, x, y, z, sx = 1, sy = 1, sz = 1, det = 1) { const g = new T.IcosahedronGeometry(r, det); g.scale(sx, sy, sz); this.B.geo(getMat(m), g, this.M4(x, y, z, rnd() * 3), 2 * r, 2 * r); return this; }
  geoM(m, g, x, y, z, ry = 0, rx = 0, rz = 0, su = 1, sv = su) { this.B.geo(getMat(m), g, this.M4(x, y, z, ry, rx, rz), su, sv); return this; }
  // plano horizontal (piso/rua); su,sv = dimensões em metros do UV
  flat(m, g, x, y, z, su = 20, sv = su) { g.rotateX(-PI / 2); this.B.geo(getMat(m), g, this.M4(x, y, z), su, sv); return this; }
  sub(x, y, z, ry = 0) { const c = Object.create(Ctx.prototype); c.B = this.B; c.base = this.M4(x, y, z, ry); c.cols = null; c.x0 = this.x0; c.z0 = this.z0; c.ry = this.ry + ry; return c; }
  col(x, z, w, d, ry = 0) { if (!this.cols) return; const [wx, wz] = this.w2(x, z), a = this.ry + ry; this.cols.push({ cx: wx, cz: wz, hw: w / 2, hd: d / 2, c: Math.cos(a), s: Math.sin(a) }); return this; }
}
/* instanciamento */
class Inst {
  constructor(geo, mat, max, cast = true) { this.mesh = new T.InstancedMesh(geo, mat, max); this.mesh.castShadow = cast; this.mesh.receiveShadow = true; this.n = 0; this.max = max; this.mesh.frustumCulled = false; this.col = new T.Color(); this._d = new T.Object3D(); }
  add(x, y, z, sx = 1, sy = sx, sz = sx, ry = 0, color = null) { if (this.n >= this.max) return; const d = this._d; d.position.set(x, y, z); d.rotation.set(0, ry, 0); d.scale.set(sx, sy, sz); d.updateMatrix(); this.mesh.setMatrixAt(this.n, d.matrix); if (color != null) this.mesh.setColorAt(this.n, this.col.set(color).convertSRGBToLinear()); this.n++; }
  set(i, x, y, z, sx = 1, sy = sx, sz = sx, ry = 0, color = null) { const d = this._d; d.position.set(x, y, z); d.rotation.set(0, ry, 0); d.scale.set(sx, sy, sz); d.updateMatrix(); this.mesh.setMatrixAt(i, d.matrix); if (color != null) this.mesh.setColorAt(i, this.col.set(color).convertSRGBToLinear()); }
  commit() { this.mesh.count = this.n; this.mesh.instanceMatrix.needsUpdate = true; if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true; return this.mesh; }
}

/* ---------- colisão círculo × caixa orientada ---------- */
function pushOut(p, r, cols, lv = 0) {
  for (let it = 0; it < 2; it++) for (const b of cols) {
    if (b.lv != null && b.lv >= 0 && b.lv !== lv) continue;
    const dx = p.x - b.cx, dz = p.z - b.cz, lx = dx * b.c - dz * b.s, lz = dx * b.s + dz * b.c;
    const qx = cl(lx, -b.hw, b.hw), qz = cl(lz, -b.hd, b.hd), ex = lx - qx, ez = lz - qz, dist = Math.hypot(ex, ez);
    if (dist >= r) continue; let px, pz;
    if (dist > 1e-5) { px = ex / dist * (r - dist); pz = ez / dist * (r - dist); }
    else { const ox = b.hw - Math.abs(lx), oz = b.hd - Math.abs(lz); if (ox < oz) { px = Math.sign(lx || 1) * (ox + r); pz = 0; } else { pz = Math.sign(lz || 1) * (oz + r); px = 0; } }
    p.x += px * b.c + pz * b.s; p.z += -px * b.s + pz * b.c;
  }
}
function pushCircles(p, r, circ) { for (const c of circ) { const dx = p.x - c.x, dz = p.z - c.z, d = Math.hypot(dx, dz), m = r + c.r; if (d < m && d > 1e-5) { p.x = c.x + dx / d * m; p.z = c.z + dz / d * m; } } }
/* linha de visão 2D contra colisores (para não interagir através de paredes) */
function segHitsBox(ax, az, bx, bz, b) {
  const lax = (ax - b.cx) * b.c - (az - b.cz) * b.s, laz = (ax - b.cx) * b.s + (az - b.cz) * b.c, lbx = (bx - b.cx) * b.c - (bz - b.cz) * b.s, lbz = (bx - b.cx) * b.s + (bz - b.cz) * b.c;
  let t0 = 0, t1 = 1; const dx = lbx - lax, dz = lbz - laz;
  for (const [p, q, mn, mx] of [[-dx, lax + b.hw, 0, 0], [dx, b.hw - lax, 0, 0], [-dz, laz + b.hd, 0, 0], [dz, b.hd - laz, 0, 0]]) { if (Math.abs(p) < 1e-9) { if (q < 0) return false; } else { const r = q / p; if (p < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; } } }
  return true;
}

