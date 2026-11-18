/* ============================================================
   IMPLANTAÇÃO — posição dos edifícios, vegetação, pessoas e ônibus
   Convenção: ângulo 0° = sul (+z), 90° = leste (+x).
   ============================================================ */
const civic = (key, deg, fn, int) => placePolar(key, deg, 58, fn, { int });
function buildCivic() {
  place('praca', 0, 0, 0, bPraca, { apron: false });
  place('monumento', 0, 0, 0, bMonumento, { apron: false, label: false });
  place('palco', 0, -13.2, 0, bPalco, { apron: false, label: false });
  civic('conselho', 22.5, bConselho, 'conselho'); civic('saude', 67.5, bSaude, 'saude'); civic('escola', 112.5, bEscola, 'escola'); civic('museu', 157.5, bMuseu, 'museu');
  civic('cultural', 202.5, bCultural, 'cultural'); civic('inovacao', 247.5, bInovacao, 'inovacao'); civic('mercado', 292.5, bMercado, 'mercado'); civic('biblioteca', 337.5, bBiblioteca, 'biblioteca');
}
function buildPlaces() {
  const house = (key, deg, r, fn, int) => {
    const p = placePolar(key, deg, r, fn, { apron: false, int });
    connectFront(p, 81.05);
  };
  for (let q = 0; q < 4; q++) {
    const b = q * 90;
    if (q !== 3) { house('sobrado', b + 18, 90, bSobrado); house('casaPatio', b + 33, 90, c => bCasaPatio(c, 0)); }
    house('vizinhanca', b + 57, 90, bVizinhanca); house('casaPatio', b + 73, 90, c => bCasaPatio(c, 1));
  }
  connectFront(placePolar('sustent', 292.5, 125, bSustent, { apron: false, int: 'sustent' }), 108.2);
  connectFront(placePolar('horta', 135, 124, bHorta, { apron: false }), 108.2);
  connectFront(placePolar('energia', 45, 126, bEnergia, { apron: false }), 108.2);
  connectFront(placePolar('reservatorio', 225, 124, bReserv, { apron: false }), 108.2);
  place('mobilidade', -16, 119, PI / 2, bMobilidade, { apron: false });
  pavedLink([-11.6, 119], [-5.3, 119], 2.4, true);
  place('portal', 0, 122, 0, bPortal, { apron: false });
  connectFront(place('circulo', 0, -122, 0, bCirculo, { apron: false }), 108.2);
}

// Interseção exata com a calçada circular, inclusive portas fora do eixo.
function connectFront(p, radius) {
  const c = new Ctx(cityB, p.x, p.z, p.ry), targets = p.doors.length ? p.doors.map(d => [d.x, d.z]) : p.access;
  targets.forEach(([x, z]) => {
    const dx = x - p.x, dz = z - p.z, lateral = dx * c.cs - dz * c.sn;
    const end = Math.hypot(p.x, p.z) - Math.sqrt(radius * radius - lateral * lateral);
    const start = Math.min(dx * c.sn + dz * c.cs - .45, p.D / 2 - .35);
    pavedLink(c.w2(lateral, start), c.w2(lateral, end), 2.4, true);
  });
}

/* ---------- vegetação ---------- */
function blocked(x, z, pad = 0) {
  const r = Math.hypot(x, z);
  if (r < 31 || r > WORLD_R - 2 || onStreet(x, z, Math.max(0, pad) + 1.1)) return true;
  const ang = Math.atan2(x, z) * 180 / PI;
  for (const p of places) {
    if (p.key === 'praca' || p.key === 'monumento' || p.key === 'palco') continue;
    if (Math.hypot(x - p.cx, z - p.cz) < p.r + 2.5 + pad) return true;
    if (p.hasApron) { const da = Math.abs(wrapAng((ang - p.deg) * PI / 180)) * r; if (da < 7 + pad && r < p.rr + 4) return true; }
  }
  return false;
}
function scatter(n, r0, r1, spacing, fn, tries = 4000) {
  const pts = []; let k = 0;
  while (pts.length < n && k++ < tries) {
    const a = rnd() * TAU, r = Math.sqrt(r0 * r0 + rnd() * (r1 * r1 - r0 * r0)), x = Math.sin(a) * r, z = Math.cos(a) * r;
    if (blocked(x, z, .5) || pts.some(p => (p[0] - x) ** 2 + (p[1] - z) ** 2 < spacing * spacing)) continue;
    pts.push([x, z]); fn(x, z);
  }
  return pts;
}
function buildVeg() {
  // fileiras de árvores ao longo das avenidas
  [0, 90, 180, 270].forEach(d => { const a = d * PI / 180, ex = Math.sin(a), ez = Math.cos(a), off = d === 0 ? 9.6 : 8.4;
    for (const [r0, r1] of [[36, 70], [88, 98]]) for (let r = r0; r < r1; r += 11) [-1, 1].forEach(sg => { const x = ex * r + ez * off * sg, z = ez * r - ex * off * sg; if (!blocked(x, z, -1.5)) treeAt(x, z, .8 + rnd() * .2); }); });
  scatter(52, 31, 72, 7, (x, z) => treeAt(x, z, .7 + rnd() * .35));       // parque interno
  scatter(96, 83, 140, 7.5, (x, z) => treeAt(x, z, .8 + rnd() * .5));        // anel externo
  scatter(130, 31, 140, 4.5, (x, z) => bushAt(x, z, .7 + rnd() * .6));      // arbustos
  scatter(18, 31, 72, 9, (x, z) => bedFlowers(x, z, 5 + rnd() * 3, 3 + rnd() * 2, 22));
  // mata ao redor (fora da área navegável)
  for (let i = 0; i < 660; i++) { const a = rnd() * TAU, r = 670 + Math.pow(rnd(), .8) * 120; forestAt(Math.sin(a) * r, Math.cos(a) * r, 1.3 + rnd() * 1.1); }
  for (let i = 0; i < 160; i++) { const a = rnd() * TAU, r = 138 + rnd() * 10, x = Math.sin(a) * r, z = Math.cos(a) * r; bushAt(x, z, 1.5 + rnd() * .9, pick(['#28593A', '#2F6B44', '#33724A'])); }
}

/* ---------- pessoas (instanciadas) ---------- */
const SKIN = ['#3B2417', '#4E3020', '#6B4128', '#8A5A3A', '#A8734A', '#C08A5F'], CLOTH = ['#C8603B', '#2BB5A8', '#E8B23A', '#B23A6A', '#F3E8CF', '#3E6FB0', '#6AA35A', '#7A4EA3', '#D9D2C0', '#1F4D3A'], PANTS = ['#2A2A36', '#3A3A4C', '#5A4636', '#1E3A5A', '#6B6B6B'];
function buildPeople() {
  const mat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: .85 }); mat.envMapIntensity = .5; mat.userData = { env0: .5 }; envMats.push(mat);
  const N = 56, mk = (g, y) => { g.translate(0, y, 0); return g; };
  const legs = new Inst(mk(new T.CylinderGeometry(.075, .065, .55, 6), -.275), mat, N*2), arms = new Inst(mk(new T.CylinderGeometry(.055,.045,.5,6),-.25),mat,N*2), hair = new Inst(new T.SphereGeometry(.14,8,6),mat,N), body = new Inst(mk(new T.CylinderGeometry(.2, .17, .62, 8), .31), mat, N), head = new Inst(new T.SphereGeometry(.12, 8, 6), mat, N);
  const paths = [];
  const circ = (r, n) => { for (let i = 0; i < n; i++) paths.push({ k: 'c', r, a: rnd() * TAU, w: (rnd() < .5 ? -1 : 1) * (.9 + rnd() * .5) / r }); };
  circ(20, 6); circ(28, 6); circ(74.3, 4); circ(80.7, 4); circ(108.2, 6); circ(13.6, 7);
  const line = (x0, z0, x1, z1, n) => { for (let i = 0; i < n; i++) paths.push({ k: 'l', x0, z0, x1, z1, u: rnd(), v: (.9 + rnd() * .5) / Math.hypot(x1 - x0, z1 - z0), dir: 1 }); };
  [0, 90, 180, 270].forEach(d => { const a = d * PI / 180, ex = Math.sin(a), ez = Math.cos(a), off = d === 0 ? 5 : 3.9; [-1, 1].forEach(sg => { line(ex * 32 + ez * off * sg, ez * 32 - ex * off * sg, ex * 70 + ez * off * sg, ez * 70 - ex * off * sg, 1); line(ex * 86 + ez * off * sg, ez * 86 - ex * off * sg, ex * 98 + ez * off * sg, ez * 98 - ex * off * sg, 1); }); });
  [45, 135, 225, 315].forEach(d => { const a = d * PI / 180; line(Math.sin(a) * 31, Math.cos(a) * 31, Math.sin(a) * 71, Math.cos(a) * 71, 1); line(Math.sin(a) * 84, Math.cos(a) * 84, Math.sin(a) * 100, Math.cos(a) * 100, 1); });
  const ppl = paths.slice(0, N).map((p, i) => Object.assign(p, { sc: i % 9 === 0 ? .85 : 1.3 + rnd() * .12, ph: rnd() * TAU }));
  ppl.forEach((p, i) => { p.sk = pick(SKIN); const sc = p.sc; const pants=pick(PANTS);for(let j=0;j<2;j++){legs.add(0,0,0,sc,sc,sc,0,pants);arms.add(0,0,0,sc,sc,sc,0,p.sk);}hair.add(0,0,0,sc,sc*.8,sc,0,'#21170F'); body.add(0, 0, 0, sc, sc, sc, 0, pick(CLOTH)); head.add(0, 0, 0, sc, sc, sc, 0, p.sk); });
  scene.add(legs.commit(), arms.commit(), hair.commit(), body.commit(), head.commit()); [legs, arms, hair, body, head].forEach(i => { i.mesh.castShadow = true; });
  movers.push((dt, t) => {
    ppl.forEach((p, i) => {
      let x, z, hx, hz;
      if (p.k === 'c') { p.a += p.w * dt; x = Math.sin(p.a) * p.r; z = Math.cos(p.a) * p.r; const s = Math.sign(p.w); hx = Math.cos(p.a) * s; hz = -Math.sin(p.a) * s; }
      else { p.u += p.v * p.dir * dt; if (p.u > 1) { p.u = 1; p.dir = -1; } if (p.u < 0) { p.u = 0; p.dir = 1; } x = p.x0 + (p.x1 - p.x0) * p.u; z = p.z0 + (p.z1 - p.z0) * p.u; hx = (p.x1 - p.x0) * p.dir; hz = (p.z1 - p.z0) * p.dir; }
      const ry = Math.atan2(hx, hz), sc = p.sc, bob = Math.abs(Math.sin(t * 7 + p.ph)) * .025 * sc, y = .1 + bob;
      const stride=Math.sin(t*7+p.ph)*.42;
      for(let side=0;side<2;side++){const sg=side?1:-1;for(const [inst,height,off,angle] of [[legs,.56,.095,sg*stride],[arms,1.1,.21,-sg*stride]]){const o=inst._d;o.position.set(x+Math.cos(ry)*off*sc*sg,y+height*sc,z-Math.sin(ry)*off*sc*sg);o.rotation.set(angle,ry,0,'YXZ');o.scale.setScalar(sc);o.updateMatrix();inst.mesh.setMatrixAt(i*2+side,o.matrix);}}
      hair.set(i,x,y+1.39*sc,z,sc,sc*.8,sc,ry);body.set(i, x, y + .55 * sc, z, sc, sc, sc, ry); head.set(i, x, y + (.55 + .62 + .15) * sc, z, sc, sc, sc, ry);
    });
    arms.mesh.instanceMatrix.needsUpdate=hair.mesh.instanceMatrix.needsUpdate=legs.mesh.instanceMatrix.needsUpdate = body.mesh.instanceMatrix.needsUpdate = head.mesh.instanceMatrix.needsUpdate = true;
  });
}

/* ---------- ônibus elétricos no anel secundário ---------- */
function buildShuttles() {
  // Faixas em sentidos opostos. Paradas a cada quadrante, sem saltos de posição.
  [{a:.35,dir:1,r:78.65,v:4.5,type:'shuttle'},{a:3.5,dir:1,r:78.65,v:4.5,type:'shuttle'},{a:1.9,dir:-1,r:76.35,v:4,type:'shuttle'},{a:0,dir:1,r:25.35,v:3.6,type:'car'},{a:PI,dir:-1,r:22.65,v:3.6,type:'car'}].forEach(s=>{
    s.mesh=vehicleModel(s.type);s.distance=0;s.stop=0;s.lastStop=-1;cityG.add(s.mesh);TRANSIT.traffic.push(s);
    const position=()=>{s.mesh.position.set(Math.sin(s.a)*s.r,.04,Math.cos(s.a)*s.r);s.mesh.rotation.y=s.a+s.dir*PI/2;};position();
    movers.push(dt=>{
      const v=TRANSIT.vehicle,a=s.a+s.dir*s.v/s.r*dt,nx=Math.sin(a)*s.r,nz=Math.cos(a)*s.r;
      const occupied=v&&Math.hypot(nx-v.x,nz-v.z)<6;
      if(s.stop>0)s.stop=Math.max(0,s.stop-dt);
      else if(!occupied){s.a=a;s.distance+=s.v*dt;const sector=((Math.round(a/(PI/2))%4)+4)%4;if(s.type==='shuttle'&&Math.abs(wrapAng(a-sector*PI/2))<.014&&sector!==s.lastStop){s.lastStop=sector;s.stop=3.5;}position();s.mesh.userData.wheels.forEach(w=>w.rotation.x=s.distance/.32);}
    });
  });
}
function buildExtras() { buildVeg(); buildPeople(); buildShuttles(); }
