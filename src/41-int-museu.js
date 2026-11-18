/* ============================================================
   INTERIORES — Museu de Ancestralidade e Futuros Negros / Centro Cultural
   ============================================================ */
IB.prototype.band = function (r, m, y = 3.55, h = .5) { // friso contínuo ao redor de um ambiente (acima das portas)
  const C = this.C, yy = this.y(r.lv) + y, t = .17;
  C.box(m, r.x1 - r.x0, h, .03, (r.x0 + r.x1) / 2, yy, r.z0 + t); C.box(m, r.x1 - r.x0, h, .03, (r.x0 + r.x1) / 2, yy, r.z1 - t);
  C.box(m, .03, h, r.z1 - r.z0, r.x0 + t, yy, (r.z0 + r.z1) / 2); C.box(m, .03, h, r.z1 - r.z0, r.x1 - t, yy, (r.z0 + r.z1) / 2);
};
IB.prototype.banner = function (x, z, m = 'friso', ry = 0, w = .8, h = 3.0) { const y = this.H - h; this.C.box(m, w, h, .03, x, y, z, ry); this.C.box('metalP', w + .1, .05, .06, x, this.H - .05, z, ry); };
IB.prototype.stele = function (x, z, h = 3.2, m = 'pedraQ', w = .7) { const C = this.C; C.box(m, w, .25, w, x, 0, z); C.box(m, w * .8, h, w * .55, x, .25, z); C.box('ouro', w * .45, .06, w * .3, x, h * .6, z + w * .28); C.cone(m, w * .5, .5, x, h + .25, z, 4, PI / 4, 1, .7); this.colO(x, z, w, w, 0); };
IB.prototype.pyramid = function (x, y, z, s = 1, m = 'ocre') { for (let i = 0; i < 4; i++) this.C.box(m, (1.6 - i * .38) * s, .22 * s, (1.6 - i * .38) * s, x, y + i * .22 * s, z); };
IB.prototype.tower = function (x, y, z, w = .6, h = 1.2, m = 'terra', toron = true) { const C = this.C; C.box(m, w, h, w, x, y, z); C.box(m, w * .8, h * .5, w * .8, x, y + h, z); if (toron) for (let k = 0; k < 4; k++) for (const s of [-1, 1]) { C.box('madeiraE', .03, .03, .22, x + s * w * .2, y + .25 + k * h / 4.2, z + w / 2 + .04); C.box('madeiraE', .22, .03, .03, x + w / 2 + .04, y + .25 + k * h / 4.2, z + s * w * .2); } };

INT.museu = I => {
  I.name = 'Museu de Ancestralidade e Futuros Negros'; I.H = 4.6; const o = { dh: 3.2, th: .3 };
  const hall = I.room('Recepção e hall', -8, 6, 8, 15, { f: 'pPedra', lights: [[-4, 10.5], [4, 10.5]] }), cafe = I.room('Café e loja', -16, 6, -8, 15, { f: 'pMad', lc: 0xFFD9A0 }), edu = I.room('Sala educativa', 8, 6, 16, 15, { f: 'pMad' });
  const gc = I.room('Galeria central', -3, -9, 3, 6, { f: 'pEsc', lights: [[0, 3], [0, -2], [0, -7]] });
  const r1 = I.room('Sala 1 · Civilizações africanas', -16, -9, -3, -1.5, { f: 'pEsc', lc: 0xFFD9A0 }), r2 = I.room('Sala 2 · Arquitetura e conhecimentos ancestrais', -16, -1.5, -3, 6, { f: 'pMad' });
  const r3 = I.room('Sala 3 · Diáspora africana e Brasil', 3, -9, 16, -1.5, { f: 'pEsc', lc: 0xFFD9A0 }), r4 = I.room('Sala 4 · O futuro negro', 3, -1.5, 16, 6, { f: 'pConc', lc: 0xBFE8FF, tint: 'gAzul' });
  const r5 = I.room('Sala 5 · Galeria de personalidades', -16, -15, 16, -9, { f: 'pTur', lights: [[-9, -12], [0, -12], [9, -12]] });
  // paredes externas
  I.wx(15, -16, 16, { ...o, doors: [[0, 4.4]] }); I.wx(-15, -16, 16, { ...o, wins: [[-12, 2.4, 1.2, 3.2], [-6, 2.4, 1.2, 3.2], [0, 2.4, 1.2, 3.2], [6, 2.4, 1.2, 3.2], [12, 2.4, 1.2, 3.2]] });
  I.wz(-16, -15, 15, { ...o, wins: [[-5, 2.4, 1.2, 3.2], [2, 2.4, 1.2, 3.2], [10.5, 2.4, 1.2, 3.2]] }); I.wz(16, -15, 15, { ...o, wins: [[-5, 2.4, 1.2, 3.2], [2, 2.4, 1.2, 3.2], [10.5, 2.4, 1.2, 3.2]] });
  // paredes internas
  I.wx(6, -16, 16, { ...o, doors: [[0, 6]] }); I.wz(-8, 6, 15, { ...o, doors: [[10.5, 3]] }); I.wz(8, 6, 15, { ...o, doors: [[10.5, 3]] });
  I.wz(-3, -9, 6, { ...o, doors: [[-5, 3], [2, 3]] }); I.wz(3, -9, 6, { ...o, doors: [[-5, 3], [2, 3]] });
  I.wx(-1.5, -16, -3, { ...o, doors: [[-9.5, 2.6]] }); I.wx(-1.5, 3, 16, { ...o, doors: [[9.5, 2.6]] }); I.wx(-9, -16, 16, { ...o, doors: [[0, 6], [-9.5, 3], [9.5, 3]] });
  // frisos de cor por sala (padrões inspirados em têxteis; sem significado atribuído)
  I.band(hall, 'friso'); I.band(r1, 'kente'); I.band(r2, 'ndb'); I.band(r3, 'mud'); I.band(r4, 'gTur', 3.7, .12); I.band(r5, 'friso'); I.band(gc, 'ouro', 3.9, .06); I.band(edu, 'mud'); I.band(cafe, 'ndb');
  I.exitAt(0, 14.2, 1.8).spawnAt(0, 12.8, 0);

  /* ---- Hall ---- */
  I.counter(-4.2, 12.6, 4, .8, 0, 'madeiraE'); I.plaque('RECEPÇÃO', 'Bem-vinda, bem-vindo. Esta visita tem 5 salas e é livre.', -4.2, 1.15, 12.2, 0, 1.6, .55); I.hot('museu_recepcao', -4.2, 11.4, 1.4);
  I.rug(0, 9.6, 5.4, 5.4, 'tecidoO'); I.cyl('pedraQ', 1.9, 2.0, .35, 0, 0, 9.6, true, 32);
  { const t = 0; I.cyl('praca', 1.5, 1.5, .06, 0, .35, 9.6, false, 32); I.cyl('pedraQ', .12, .16, .7, 0, .4, 9.6, false, 8); I.sph('gOuro', .1, 0, 1.15, 9.6);
    for (let k = 0; k < 8; k++) { const a = k * TAU / 8 + .39, r = 1.05; I.box(['terra', 'ocre', 'rebocoT', 'terra', 'rebocoO', 'rebocoR', 'terra', 'rebocoB'][k], .32, .22 + (k % 3) * .06, .26, Math.sin(a) * r, .41, 9.6 + Math.cos(a) * r, a); } }
  I.hot('maquete', 0, 9.6, 1.2, { r: 3.2, up: .1 });
  I.plaque('LINHA DO TEMPO', 'Dos reinos africanos ao futuro negro — com datas, fatos e referências.', -5.6, 1.2, 14.8, PI, 1.5, 1.0); I.hot('linha_tempo', -5.6, 13.6, 1.7);
  I.banner(-6.5, 8, 'friso', PI / 2, 1, 3.4); I.banner(6.5, 8, 'kente', -PI / 2, 1, 3.4); I.plant(-7.2, 14.2, 1.2); I.plant(7.2, 14.2, 1.2); I.plant(7.2, 7, 1); I.plant(-7.2, 7, 1);
  I.seat(5, 13.4, 2.4); I.plaque('SAÍDA', 'Pressione E perto da porta', 0, 3.55, 14.78, PI, 1.6, .38, { fs: 18 });

  /* ---- Café e loja ---- */
  I.counter(-14.6, 8.2, 4.6, .8, PI / 2, 'madeiraE'); [[-11, 9], [-11, 12.5], [-13.6, 13]].forEach(([x, z]) => { I.table(x, z, .9, .9, .74, 0, 'madeira'); I.chair(x - .7, z, PI / 2); I.chair(x + .7, z, -PI / 2); }); I.plant(-9, 7.2, 1); I.plant(-15.2, 14.2, 1.1);
  I.plaque('CAFÉ DA TERRA', 'Cacau, café e frutas da horta comunitária da vila.', -12, 2.0, 5.82, PI, 1.7, .5);

  /* ---- Sala educativa ---- */
  I.rug(12, 10.5, 5, 4, 'tecidoV'); [[10.2, 9.2], [13.8, 9.2], [10.2, 12.2], [13.8, 12.2]].forEach(([x, z]) => { I.table(x, z, 1.5, .9); I.chair(x, z + .85, PI); I.chair(x, z - .85, 0); });
  I.plaque('PAINEL DO GLOSSÁRIO', 'Termos-chave desta visita: ancestralidade, diáspora, quilombo, afrofuturismo...', 15.82, 1.2, 8, -PI / 2, 1.5, .9); I.hot('glossario_parede', 15, 8, 1.7);
  I.plaque('UBUNTU', 'Eu sou porque nós somos.', 12, 1.3, 14.82, PI, 1.7, .75); I.hot('ubuntu', 12, 13.8, 1.7); I.plant(8.9, 14.2, 1);

  /* ---- Galeria central ---- */
  for (let z = -7; z <= 3; z += 4) { I.banner(-2.55, z, z % 8 ? 'kente' : 'friso', PI / 2, .9, 3.2); I.banner(2.55, z, z % 8 ? 'mud' : 'ndb', -PI / 2, .9, 3.2); }
  I.rug(0, -1.5, 1.4, 14, 'tecidoT'); I.seat(0, -2, 1.6, 0);

  /* ---- Sala 1 · Civilizações africanas ---- */
  { const s = I.C.sub(0, 0, 0); I.rug(-9.5, -5.2, 7.6, 4.2, 'tecidoO');
    I.box('pedraQ', 2.2, .5, 1.4, -13.5, 0, -7.2, 0, true); I.pyramid(-14.1, .5, -7.2, .55); I.pyramid(-13.3, .5, -7.2, .7); I.pyramid(-12.6, .5, -7.0, .5); I.hot('kush', -13.5, -6.2, 1.5, { up: .2 });
    I.stele(-10.2, -7.4, 3.4); I.hot('aksum', -10.2, -6.1, 2.0);
    I.geo('pedra', new T.CylinderGeometry(1.9, 1.9, 1.7, 28, 1, true, .5, 2.2), -6.2, .85, -6.4, 0); I.geo('pedra', new T.CylinderGeometry(1.6, 1.6, 1.5, 24, 1, true, .7, 1.8), -6.2, .75, -6.4, 0); I.cone('pedra', .7, 1.7, -6.9, 0, -5.3); I.hot('zimbabue', -6.2, -5.6, 1.4);
    const vt = I.vitrine(-12, -3.2, 1.7, .9, .95); I.box('madeiraE', .6, .05, .4, -12.2, .95, -3.2, .3); I.box('papel', .5, .03, .36, -12.2, 1.0, -3.2, .3); I.box('papel', .5, .03, .36, -11.8, 1.0, -3.2, -.2); I.shelf(-14.8, -2.6, 2.4, PI / 2, 4, 2.2); I.hot('timbuktu', -12, -2.4, 1.6, { up: .2 });
    I.box('pedraQ', 1.7, .35, .35, -7.0, 0, -3.2, 0, true); I.box('ouro', 1.5, 1.4, .08, -7.0, .35, -3.2, 0); realMuseumImage(I,0,-7,.55,-3.1,0,1.5,1.65); I.hot('benin', -7.0, -2.4, 1.5, { up: .2 });
    I.plaque('MANSA MUSA', 'Mali, século XIV · peregrinação a Meca em 1324–25', -14, 1.2, -8.82, 0, 1.6, .8); I.hot('mansa_musa', -14, -7.8, 1.6); I.plant(-4, -2.5, 1); }

  realMuseumImage(I,1,-11.5,1.2,-8.78,0,2.3,2);realMuseumImage(I,2,-5,1.2,-8.78,0,2.3,2);
  /* ---- Sala 2 · Arquitetura e conhecimentos ancestrais ---- */
  { I.rug(-9.5, 2.2, 7, 4.4, 'tecido'); I.table(-13.2, .2, 2.0, 1.1, .8, 0, 'madeiraE'); I.tower(-13.5, .82, .2, .75, 1.3, 'terra'); I.tower(-12.6, .82, .5, .45, .9, 'ocre'); I.tower(-14.2, .82, -.1, .45, .8, 'terra'); I.hot('terra_crua', -13.2, 1.3, 1.9, { up: .3 });
    I.box('terra', .6, 3.2, 3.0, -15.45, 0, 3.0, 0); for (let k = 0; k < 5; k++) for (let j = 0; j < 4; j++) I.box('madeiraE', .55, .07, .07, -15.0, .55 + k * .55, 1.9 + j * .72); I.hot('toron', -14.4, 3.0, 1.8);
    I.cyl('terra', 1.0, 1.15, 1.5, -8.4, 0, 4.2, true, 20); I.cone('palha', 1.35, 1.1, -8.4, 1.5, 4.2, 18, 0); I.hot('batammaliba', -8.4, 3.0, 2.2, { up: .1 });
    I.pattern(-9.5, 1.0, 5.82, PI, 3.2, 1.7, 'ndb'); I.plaque('PINTURA NDEBELE', 'Casas pintadas por mulheres, África do Sul', -9.5, .55, 5.8, PI, 2.6, .36, { fs: 14 }); I.hot('ndebele', -9.5, 4.9, 1.6);
    I.box('rebocoB', 2.2, 1.0, 1.6, -5.3, 0, 1.2, 0, true); for (let k = 0; k < 4; k++) I.box('gAzul', .08, .02, 1.2, -5.7 + k * .35, 1.0, 1.2); I.box('terra', 1.6, .5, 1.0, -5.3, 1.0, 1.2); I.hot('ventilacao', -5.3, 2.4, 1.8);
    I.shelf(-9, -1.12, 3.0, 0, 3, 1.4, 0, false); I.box('terra', 1.1, .6, .7, -9.5, 1.4, -1.0, 0); I.hot('taipa_brasil', -9.5, -.3, 1.9, { up: .2 }); I.plant(-4, 5, 1); }

  /* ---- Sala 3 · Diáspora africana e Brasil ---- */
  { I.rug(9.5, -5.2, 9, 4.8, 'tecidoV');
    I.plaque('TRAVESSIA E DIÁSPORA', 'Entre os séculos XVI e XIX, milhões de africanos foram levados à força para as Américas.', 5.6, 1.1, -8.82, 0, 2.2, 1.1); I.hot('diaspora_travessia', 5.6, -7.8, 1.7);
    I.plaque('PALMARES', 'Serra da Barriga, atual Alagoas — Zumbi dos Palmares (†1695)', 13.6, 1.1, -8.82, 0, 2.2, 1.1); I.hot('palmares', 13.6, -7.8, 1.7);
    I.cyl('madeiraE', 1.45, 1.5, .7, 9.5, 0, -5.2, true, 28); I.cyl('terraSolo', 1.35, 1.35, .05, 9.5, .7, -5.2, false, 28); for (let k = 0; k < 7; k++) { const a = k * TAU / 7; I.cyl('terra', .13, .13, .12, 9.5 + Math.sin(a) * .85, .73, -5.2 + Math.cos(a) * .85, false, 8); I.cone('palha', .17, .15, 9.5 + Math.sin(a) * .85, .85, -5.2 + Math.cos(a) * .85, 8, 0); } I.cyl('terra', .22, .22, .14, 9.5, .73, -5.2, false, 10); I.hot('quilombo', 9.5, -4.0, 1.4, { up: .1 });
    I.plaque('CEARÁ, 1884', 'O Ceará aboliu a escravidão em 1884, quatro anos antes da Lei Áurea.', 15.82, 1.1, -5.2, -PI / 2, 2.0, 1.1); I.hot('abolicao_ceara', 14.9, -5.2, 1.6);
    I.cyl('madeira', .32, .26, .9, 6.0, 0, -3.4, true, 14); I.cyl('terra', .33, .33, .04, 6.0, .9, -3.4, false, 14); I.cyl('madeira', .26, .22, .7, 7.0, 0, -3.1, true, 14); I.hot('tradicoes', 6.5, -2.6, 1.3, { up: .2 });
    I.plaque('LEI 10.639/2003', 'Torna obrigatório o ensino de história e cultura afro-brasileira.', 12.6, 1.2, -1.68, PI, 2.2, 1.0); I.hot('lei_10639', 12.6, -2.6, 1.7); I.plant(15.2, -2.4, 1); }

  /* ---- Sala 4 · O futuro negro ---- */
  { I.rug(9.5, 2.3, 8.5, 5, 'tecidoT');
    I.cyl('metalP', 1.2, 1.3, .7, 9.5, 0, 2.3, true, 28); I.cyl('gTur', 1.1, 1.1, .03, 9.5, .7, 2.3, false, 28); I.ico('gTur', .38, 9.5, 1.7, 2.3, 1, 1, 1, 1); I.geo('gTur', new T.TorusGeometry(.7, .02, 6, 40), 9.5, 1.7, 2.3, 0, PI / 2); I.geo('gAzul', new T.TorusGeometry(.95, .015, 6, 40), 9.5, 1.5, 2.3, 0, PI / 2.6); I.hot('cidade_futuro', 9.5, 3.8, 1.9, { up: .5 });
    I.screen(15.78, 1.0, 1.5, -PI / 2, 2.2, 1.3, 'AFROFUTURISMO', 'Estética e movimento que imagina futuros com protagonismo negro.'); I.hot('afrofuturismo', 14.9, 1.5, 1.6);
    I.screen(13.4, 1.0, -1.32, 0, 2.0, 1.2, 'AFRICANFUTURISM', 'Termo proposto por Nnedi Okorafor em 2019.'); I.hot('africanfuturism', 13.4, -.4, 1.6);
    I.screen(5.6, 1.0, -1.32, 0, 2.0, 1.2, 'CIÊNCIA NEGRA', 'Cientistas, inventoras e engenheiros que mudaram o mundo.'); I.hot('ciencia_negra', 5.6, -.4, 1.6);
    I.screen(9.5, 1.0, 5.82, PI, 2.4, 1.1, 'WAKANDA É FICÇÃO', 'País imaginário dos quadrinhos e do cinema.', { bg: '#2b1030', fg: '#E8B2FF', tc: '#F2DCFF' }); I.hot('wakanda', 9.5, 5.0, 1.6);
    I.screen(14.8, 1.0, 5.82, PI, 1.8, 1.1, 'SANKOFA', 'Ir buscar o que ficou para trás.'); I.hot('sankofa', 14.6, 5.0, 1.6); I.plant(3.9, 5.2, 1.1); }

  /* ---- Sala 5 · Galeria de personalidades ---- */
  { const P = [['dragao_do_mar', 'Dragão do Mar', 'Ceará · 1884'], ['luiz_gama', 'Luiz Gama', 'abolicionista e advogado'], ['tebas', 'Tebas', 'mestre de obras'], ['carolina', 'Carolina Maria de Jesus', 'escritora'], ['lelia', 'Lélia Gonzalez', 'intelectual'], ['milton_santos', 'Milton Santos', 'geógrafo'], ['enedina', 'Enedina Alves Marques', 'engenheira'], ['kere', 'Francis Kéré', 'arquiteto'], ['jaqueline', 'Jaqueline Goes de Jesus', 'biomédica'], ['sonia', 'Sônia Guimarães', 'física']];
    P.forEach(([id, n, sub], i) => { const x = -14.4 + i * 3.2; I.plaque(n,sub,x,1.25,-14.82,0,1.5,1.6,{fs:20}); I.plaque(n, sub, x, .5, -14.82, 0, 1.5, .55, { fs: 16 }); I.hot(id, x, -13.4, 1.4); });
    I.rug(0, -11.6, 14, 1.4, 'tecidoV'); I.seat(-6, -11.6, 2.4, 0); I.seat(6, -11.6, 2.4, 0); I.plant(-15, -10, 1.1); I.plant(15, -10, 1.1);
    I.plaque('PERSONALIDADES', 'Painéis biográficos. Não são apresentados retratos substitutos.', 0, 2.4, -9.2, PI, 3.2, .5, { fs: 14 }); }
};

/* ============================================================ CENTRO CULTURAL ============================================================ */
INT.cultural = I => {
  I.name = 'Centro Cultural e de Artes'; I.H = 5; const o = { dh: 3, th: .3 };
  const hall = I.room('Foyer', -12, 4, 12, 12, { f: 'pMad', lc: 0xFFD9A0 }), aud = I.room('Auditório', -12, -12, 4, 4, { f: 'pEsc', lights: [[-8, -4], [0, -4], [-4, -9]], lc: 0xFFC890 }), gal = I.room('Galeria de arte', 4, -12, 12, 4, { f: 'pConc', lights: [[8, -2], [8, -8]] });
  I.wx(12, -12, 12, { ...o, doors: [[0, 4]] }); I.wx(-12, -12, 12, o); I.wz(-12, -12, 12, { ...o, wins: [[8, 2.4, 1.2, 3.2]] }); I.wz(12, -12, 12, { ...o, wins: [[8, 2.4, 1.2, 3.2], [-4, 2.4, 1.2, 3.2], [-8, 2.4, 1.2, 3.2]] });
  I.wx(4, -12, 12, { ...o, doors: [[-8, 3.4], [8, 3]] }); I.wz(4, -12, 4, { ...o, doors: [[-4, 3]] });
  I.band(hall, 'kente', 3.9, .5); I.band(aud, 'mud', 4.2, .4); I.band(gal, 'ndb', 4.1, .5);
  I.exitAt(0, 11.2, 1.8).spawnAt(0, 9.8, 0);
  // foyer
  I.counter(-8, 8.2, 3.6, .7, 0, 'madeiraE'); I.plaque('INGRESSOS GRATUITOS', 'A programação é aberta à comunidade.', -8, 1.15, 7.9, 0, 1.6, .55); I.plant(-11, 10.8, 1.2); I.plant(11, 10.8, 1.2); I.seat(8, 10.5, 2.4);
  I.plaque('PROGRAMAÇÃO', 'Música, dança, teatro, cinema e oficinas', 6, 1.3, 4.18, 0, 2.4, 1.0); I.hot('cultural_programacao', 6, 5.0, 1.7);
  I.rug(0, 8, 6, 3, 'tecidoO'); I.banner(-3, 6, 'kente', 0, 1.2, 3.8); I.banner(3, 6, 'friso', 0, 1.2, 3.8);
  // auditório (palco ao norte, plateia degraus)
  I.box('madeiraE', 11, .8, 4.2, -4, 0, -9.9, 0, true); I.box('pMad', 10.8, .04, 4.0, -4, .8, -9.9); I.hot('palco_auditorio', -4, -7.4, 1.6);
  for (let k = 0; k < 5; k++) { I.box('pConc', 10.5, .2 + k * .2, 1.2, -4, 0, -4.6 + k * 1.5 - .0); for (let j = 0; j < 8; j++) I.box('tecido', .5, .1, .5, -8.3 + j * 1.2, .3 + k * .2, -4.6 + k * 1.5 + .1); }
  I.box('terra', 4.5, 3.2, .3, -4, .8, -11.8); I.pattern(-4, 1.3, -11.6, 0, 4.2, 1.8, 'mud'); [-8.4, 0.4].forEach(x => { I.box('aco', .3, .3, .3, x, 4.0, -8.5); }); I.plaque('AUDITÓRIO', 'Capacidade imaginada: 120 pessoas', -4, 3.9, 3.8, PI, 2.2, .45, { fs: 14 });
  // galeria
  I.art(9, 1.2, -11.82, 0, 2.0, 1.6, 71, 0); I.art(6, 1.2, -11.82, 0, 1.4, 1.6, 83, 1); I.art(11.84, 1.2, -4, -PI / 2, 2.2, 1.6, 97, 2); I.art(4.16, 1.2, -9.5, PI / 2, 1.6, 1.6, 41, 3); I.hot('galeria_arte', 8, -5, 1.6, { up: .3 });
  I.pedestal(8, -3, .8, 1.0); I.sph('gOuro', .22, 8, 1.35, -3); I.table(10.6, 1, 1.2, .6, .9); I.plant(11.2, -11.2, 1);
  // oficina de percussão / dança num canto do foyer
  [-4, -2.6, -1.2].forEach((x, i) => I.cyl('madeira', .24 + i * .02, .2, .75 + i * .08, x, 0, 8.5 + i * .3, true, 14)); I.hot('oficina_percussao', -2.6, 7.8, 1.2, { up: .3 });
};

