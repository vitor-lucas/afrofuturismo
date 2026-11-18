/* ============================================================
   JOGADOR E MODOS — órbita urbana, primeira pessoa, interiores, visita guiada
   ============================================================ */
const G = { mode: 'start', in: null, room: null, P: { x: 0, y: 0, z: 36, yaw: 0, pitch: 0, lv: 0, bob: 0 }, keys: {}, joy: { x: 0, y: 0, run: false }, sens: 1, quality: 'auto', effectiveQuality: 'med', labels: true, selected: null, hover: null, target: null, ret: null, tour: -1, tourRet: null, fly: null, tNight: 0, tGoal: 0, visited: new Set(), t: 0, reduceMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, touch: false, locked: false, modalClose: null, busy: false };
let iScene = null;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const nextFrame = () => new Promise(r => requestAnimationFrame(() => r()));
const SHORT = { museu: 'Museu', cultural: 'Centro Cultural', inovacao: 'Inovação', escola: 'Escola', mercado: 'Mercado', saude: 'Saúde', biblioteca: 'Biblioteca', conselho: 'Conselho', sustent: 'Sustentabilidade', horta: 'Horta', energia: 'Energia', reservatorio: 'Reservatório', mobilidade: 'Mobilidade', portal: 'Portal', circulo: 'Círculo da Memória', praca: 'Praça Central', sobrado: 'Sobrado', casaPatio: 'Casa-pátio', vizinhanca: 'Vizinhança' };
const PRI = { museu: 3, cultural: 3, inovacao: 3, escola: 3, mercado: 3, saude: 3, biblioteca: 3, conselho: 3, sustent: 3, praca: 3, portal: 2, circulo: 2, horta: 2, energia: 2, reservatorio: 2, mobilidade: 2, sobrado: 1, casaPatio: 1, vizinhanca: 1 };

/* ---------- transições ---------- */
async function fade(fn) { const f = $id('fade'); G.busy = true; f.classList.add('on'); await sleep(360); try { await fn(); } catch (e) { console.error(e); toast('Algo deu errado: ' + (e && e.message || e), 5000); } await sleep(80); f.classList.remove('on'); G.busy = false; }
function showLoad(msg) { const l = $id('load'); $id('ltxt').textContent = msg; $id('lbar').style.width = '60%'; l.classList.remove('hidden'); }
function hideLoad() { $id('load').classList.add('hidden'); }

/* ---------- modos ---------- */
function setMode(m) {
  if(m!=='ride'&&NETWORK.trip){scene.remove(NETWORK.trip.mesh);NETWORK.trip=null;$id('ridehud')?.classList.add('hidden');}
  if(m!=='space'&&SPACE){scene.remove(SPACE.g);SPACE=null;}
  if (G.mode === 'drive' && m !== 'drive') detachVehicle();
  if (m !== 'fp') cancelRoute();
  document.documentElement.dataset.mode = m;
  G.P.vx=G.P.vz=0; G.keys = {}; G.joy.x = G.joy.y = 0; G.joy.run = false;
  G.mode = m; const fp = m === 'fp';
  $id('start').classList.toggle('hidden', m !== 'start'); $id('hud').classList.toggle('hidden', m === 'start');
  $id('cross').classList.toggle('hidden', !fp); ['mini', 'progress'].forEach(k => $id(k).classList.toggle('hidden', !(fp || m === 'drive'))); $id('prompt').classList.add('hidden'); $id('help').classList.toggle('hidden', G.tour >= 0);
  $id('touch').classList.toggle('hidden', !(fp && G.touch)); $id('c').className = fp ? 'fp' : '';
  cam.near = fp ? .1 : .5; cam.fov = fp ? 72 : m === 'drive' ? 62 : 48; cam.updateProjectionMatrix();
  $id('labels').style.display = (m === 'orbit' || m === 'start') ? '' : 'none';
  renderTools(); renderHelp(); updateWhere(); updateProgress();
}
function updateWhere() {
  const wk = $id('wk'), wn = $id('wn');
  if (G.in) { wk.textContent = G.in.name; wn.textContent = G.room ? G.room.name : G.in.name; }
  else if(G.mode==='ride'||G.mode==='space'){wk.textContent='Viagem';wn.textContent=G.mode==='space'?'Lançamento orbital':'Transporte público';}
  else if (G.mode === 'drive') { wk.textContent = 'Mobilidade limpa'; wn.textContent = FLEET[TRANSIT.vehicle.type].name; }
  else if (G.mode === 'fp') { wk.textContent = 'Vila Afrofuturista · caminhando'; wn.textContent = nearestPlaceName(G.P.x, G.P.z); }
  else { wk.textContent = 'Vila Afrofuturista'; wn.textContent = G.tour >= 0 ? 'Visita guiada' : 'Visão urbana'; }
}
function resetView() { clearOrbitMotion(); Object.assign(view, { x: 0, y: 0, z: 0, r: 230, th: .6, ph: .95 }); G.fly = null; }
function startExplore() { beforeTravel(); endTheme(); closeModal(); closeCard(); closePanel(); tourClear(); if (G.in) { leaveInterior(); } resetView(); setMode('orbit'); }
async function goOrbit() { beforeTravel();
  closeModal(); closePanel(); tourClear();
  if (G.in) await fade(() => { leaveInterior(); view.x = G.ret ? G.ret.x : 0; view.z = G.ret ? G.ret.z : 0; view.r = 90; view.ph = 1.0; setMode('orbit'); });
  else { view.x = G.P.x; view.z = G.P.z; view.y = 0; view.r = 120; view.ph = 1.0; view.th = G.P.yaw + PI; setMode('orbit'); }
}
function goWalkFromOrbit() { beforeTravel(); closeCard(); closePanel(); G.P = { x: 0, y: 0, z: 36, yaw: 0, pitch: -.05, lv: 0, bob: 0 }; G.in = null; setMode('fp'); toast(G.touch ? 'Use o joystick para andar' : 'Clique na cena para capturar o mouse · E interage', 3600); }
function goWalkTo(ref) { beforeTravel();
  const p = resolvePlace(ref); if (!p) return; closeCard(); let x, z;
  if (p.doors.length || p.access.length) { const d = p.doors[0] || { x: p.access[0][0], z: p.access[0][1], ry: p.ry }; x = d.x + Math.sin(d.ry) * 1.5; z = d.z + Math.cos(d.ry) * 1.5; } else { const r = Math.hypot(p.cx, p.cz) || 1; x = p.cx - p.cx / r * (p.r + 6); z = p.cz - p.cz / r * (p.r + 6); if (r < 1) { x = 0; z = 24; } }
  const dx = p.cx - x, dz = p.cz - z; G.P = { x, y: 0, z, yaw: Math.atan2(-dx, -dz), pitch: -.03, lv: 0, bob: 0 }; G.in = null; setMode('fp');
}

/* ---------- interiores ---------- */
function interiorLook(on) {
  if (on) { envMats.forEach(m => m.envMapIntensity = (m.userData.env0 || .75) * .55); glows.forEach(m => m.emissiveIntensity = 1.5 * (m.userData.k || 1)); ren.toneMappingExposure = 1.05; }
  else applyTime(scene, ren, G.tNight);
}
function leaveInterior() { if (G.in) { iScene.remove(G.in.g); G.in = null; G.room = null; interiorLook(false); } }
async function enterBuilding(id, ret) {
  if (G.busy) return; beforeTravel(); closePanel(); closeCard(); const building=places.find(p=>p.int===id&&(ret?.key?p.key===ret.key:true));const entrance=building?.doors[0];G.ret=ret||(entrance?{x:entrance.x,z:entrance.z,ry:entrance.ry,key:building.key}:G.ret);
  await fade(async () => {
    showLoad('Construindo o interior…'); await sleep(40);
    const I = getInterior(id); hideLoad();
    if (G.in) iScene.remove(G.in.g);
    iScene.add(I.g); G.in = I; interiorLook(true); G.P = { x: I.spawn.x, y: I.y(0), z: I.spawn.z, yaw: I.spawn.yaw, pitch: 0, lv: 0, bob: 0 };
    G.room = I.roomAt(G.P.x, G.P.z, 0); G.tour >= 0 && tourHide(); setMode('fp'); markVisited('i:' + id);
    toast(I.name, 2600);
  });
}
async function exitBuilding() {
  if (!G.in || G.busy) return; closePanel();
  await fade(() => {
    leaveInterior(); const r = G.ret;
    if (G.tourRet != null) { const i = G.tourRet; G.tourRet = null; setMode('orbit'); tourShow(i); return; }
    if (r) { G.P = { x: r.x + Math.sin(r.ry) * 1.6, y: 0, z: r.z + Math.cos(r.ry) * 1.6, yaw: r.ry + PI, pitch: -.03, lv: 0, bob: 0 }; }
    else G.P = { x: 0, y: 0, z: 36, yaw: 0, pitch: 0, lv: 0, bob: 0 };
    setMode('fp');
  });
}

/* ---------- tempo ---------- */
function toggleDay() { METRO.autoDay=false; G.tGoal = G.tGoal ? 0 : 1; renderTools(); toast(G.tGoal ? 'Noite: as lanternas e janelas acendem' : 'Dia'); }

/* ---------- qualidade ---------- */
function setQuality(q) { selectQuality(q); }

/* ---------- interação ---------- */
function findTarget() {
  const P = G.P, fx = -Math.sin(P.yaw), fz = -Math.cos(P.yaw); let best = null, bs = -9;
  const consider = (kind, obj, x, z, r, label, minDot, bonus = 0) => {
    const dx = x - P.x, dz = z - P.z, d = Math.hypot(dx, dz); if (d > r) return; const dot = (dx * fx + dz * fz) / (d || 1); if (d > 1.1 && dot < minDot) return;
    const score = (1 - d / r) * .5 + dot * .5 + bonus; if (score > bs) { bs = score; best = { kind, obj, label, x, z }; }
  };
  if (G.in) {
    const I = G.in;
    for (const h of I.hots) {
      if (h.lv !== P.lv) continue; const dx = h.x - P.x, dz = h.z - P.z; if (dx * dx + dz * dz > h.r * h.r) continue;
      let blocked = false; for (const b of I.cols) { if (b.lv >= 0 && b.lv !== P.lv) continue; if (Math.min(b.hw, b.hd) > .17 || Math.max(b.hw, b.hd) < 1.0) continue; if (segHitsBox(P.x, P.z, h.x, h.z, b)) { blocked = true; break; } }
      if (!blocked) consider('hot', h, h.x, h.z, h.r, 'Examinar: ' + (HOT[h.id] ? HOT[h.id].t : h.id), .3);
    }
    if (I.exit && (I.exit.lv || 0) === (P.lv || 0)) consider('exit', I.exit, I.exit.x, I.exit.z, I.exit.r + 1.2, 'Sair do edifício', -1, .3);
  } else {
    for (const p of places) {
      const inf = INFO[p.key]; if (!inf) continue;
      for (const d of p.doors) if (d.int || p.int) consider('door', { p, d }, d.x, d.z, 4.4, 'Entrar: ' + inf.t, .3, 1);
      if (p.key !== 'palco') consider('place', p, p.cx, p.cz, p.r + 7, 'Saber mais: ' + inf.t, .55);
    }
  }
  {const w=worldTarget();if(w)best=w;}
  G.target = best;
  const pr = $id('prompt'); if (best && !modalOpen) { pr.textContent = (G.touch ? 'Toque em E · ' : 'E · ') + best.label; pr.classList.remove('hidden'); } else pr.classList.add('hidden');
}
function interact() {
  const t = G.target; if(t?.kind==='world'&&!G.busy&&!modalOpen){t.action();return;} if (!t || G.busy || modalOpen) return;
  if (t.kind === 'hot') { const h = HOT[t.obj.id]; if (!h) return toast('Conteúdo em preparação'); if(h.run){h.run();markVisited('h:'+t.obj.id);return;} if (h.act === 'glossary') { markVisited('h:' + t.obj.id); return openGlossary(); } openPanel({ kind: 'hot', id: t.obj.id }); try { document.exitPointerLock(); } catch (e) { } }
  else if (t.kind === 'exit') exitBuilding();
  else if (t.kind === 'door') enterBuilding(t.obj.d.int || t.obj.p.int, { x: t.obj.d.x, z: t.obj.d.z, ry: t.obj.d.ry, key: t.obj.p.key });
  else if (t.kind === 'place') { openPanel({ kind: 'place', key: t.obj.key }); try { document.exitPointerLock(); } catch (e) { } }
}

/* ---------- atualização em primeira pessoa ---------- */
function fpUpdate(dt) {
  dt=cl(dt,0,.05);
  const P = G.P, k = G.keys, I = G.in;
  if (!modalOpen) {
    P.yaw += ((k.ArrowLeft ? 1 : 0) - (k.ArrowRight ? 1 : 0)) * 1.9 * dt;
    let f = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0) - G.joy.y, s = (k.KeyD ? 1 : 0) - (k.KeyA ? 1 : 0) + G.joy.x; const l = Math.hypot(f, s); if (l > 1) { f /= l; s /= l; }
    const sp = (k.ShiftLeft || k.ShiftRight || G.joy.run ? 5.4 : 3.1) * (I ? .92 : 1), sn = Math.sin(P.yaw), cs = Math.cos(P.yaw);
    const blend=1-Math.exp(-(f||s?14:20)*dt);P.vx=lerp(P.vx||0,(-sn*f+cs*s)*sp,blend);P.vz=lerp(P.vz||0,(-cs*f-sn*s)*sp,blend);
    const dx = P.vx * dt, dz = P.vz * dt, n = Math.max(1, Math.ceil(Math.hypot(dx, dz) / .12)), q = { x: P.x, z: P.z };
    for (let i = 0; i < n; i++) {
      q.x += dx / n; q.z += dz / n;
      if (I) { pushOut(q, .32, I.cols, P.lv); const bb = I.bb; q.x = cl(q.x, bb[0] + .4, bb[2] - .4); q.z = cl(q.z, bb[1] + .4, bb[3] - .4); }
      else { resolveExteriorCollision(q,.38); const r = Math.hypot(q.x, q.z); if (r > WORLD_R - 3) { q.x *= (WORLD_R - 3) / r; q.z *= (WORLD_R - 3) / r; } }
    }
    const moved = Math.hypot(q.x - P.x, q.z - P.z); P.x = q.x; P.z = q.z; P.bob += moved * 2.1;
  }
  if (I) { const fl = I.floorAt(P.x, P.z, P.lv); P.lv = fl.lv; P.y += (fl.y - P.y) * Math.min(1, dt * 14); const r = I.roomAt(P.x, P.z, P.lv); if (r !== G.room) { G.room = r; updateWhere(); } }
  else { const w = $id('wn'); if ((G.t | 0) % 1 === 0 && Math.floor(G.t * 2) !== G._wt) { G._wt = Math.floor(G.t * 2); updateWhere(); } P.y = 0; }
  P.pitch = cl(P.pitch, -1.35, 1.35);
  const bob = G.reduceMotion ? 0 : Math.sin(P.bob) * .035; cam.position.set(P.x, P.y + 1.62 + bob, P.z); cam.rotation.set(P.pitch, P.yaw, 0, 'YXZ');
  findTarget();
}

/* ---------- câmera orbital: voo e rótulos ---------- */
function flyTo(ref, o = {}) {
  const p = resolvePlace(ref); if (!p) return;
  clearOrbitMotion();
  const r = o.r || cl(p.r * 3.2 + 22, 50, 110), ang = (p.cx || p.cz) ? Math.atan2(p.cx, p.cz) : view.th, th = o.th != null ? o.th : ang + PI + (o.dth != null ? o.dth : .45);
  G.fly = { a: { x: view.x, y: view.y, z: view.z, r: view.r, th: view.th, ph: view.ph }, b: { x: p.cx, y: Math.min(p.H || 8, 14) * .3, z: p.cz, r, th, ph: o.ph || 1.12 }, t: 0, d: G.reduceMotion ? .01 : (o.d || 2.1) };
}
function flyUpdate(dt) {
  const f = G.fly; if (!f) return; f.t = Math.min(1, f.t + dt / f.d); const e = f.t < .5 ? 4 * f.t ** 3 : 1 - Math.pow(-2 * f.t + 2, 3) / 2, a = f.a, b = f.b; let dth = wrapAng(b.th - a.th);
  view.x = lerp(a.x, b.x, e); view.y = lerp(a.y, b.y, e); view.z = lerp(a.z, b.z, e); view.r = lerp(a.r, b.r, e) * (1 + Math.sin(e * PI) * .18); view.ph = lerp(a.ph, b.ph, e); view.th = a.th + dth * e; if (f.t >= 1) G.fly = null;
}
const LBL = []; let lblBuilt = false;
function buildLabels() {
  const box = $id('labels'); places.forEach(p => { if (!INFO[p.key] || ['monumento', 'palco'].includes(p.key)) return; const e = document.createElement('div'); e.className = 'lbl'; e.textContent = SHORT[p.key] || INFO[p.key].t; e.onclick = ev => { ev.stopPropagation(); if (G.mode === 'orbit' && G.tour < 0) { flyTo(p.i); openCard(p.i); } }; box.appendChild(e); LBL.push({ el: e, p, w: (e.textContent.length * 7 + 18) }); });
  lblBuilt = true;
}
const _v3 = new T.Vector3();
function updateLabels() {
  const show = (G.mode === 'orbit' || G.mode === 'start') && G.labels; const W = VW, H = VH, items = [];
  for (const k in LBL) { const L = LBL[k]; if (!show || (PRI[L.p.key] === 1 && view.r > 120) || (G.mode === 'start')) { L.el.style.display = 'none'; continue; } _v3.set(L.p.cx, (L.p.lblY || 8) + 3, L.p.cz).project(cam); if (_v3.z > 1 || _v3.z < -1) { L.el.style.display = 'none'; continue; } L.x = (_v3.x * .5 + .5) * W; L.y = (-_v3.y * .5 + .5) * H; if (L.x < -40 || L.x > W + 40 || L.y < 20 || L.y > H + 20) { L.el.style.display = 'none'; continue; } items.push(L); }
  items.sort((a, b) => (PRI[b.p.key] - PRI[a.p.key]) || (a.y - b.y)); const placed = [];
  for (const L of items) { const r = { x0: L.x - L.w / 2, x1: L.x + L.w / 2, y0: L.y - 24, y1: L.y }; if (placed.some(o => r.x0 < o.x1 && r.x1 > o.x0 && r.y0 < o.y1 && r.y1 > o.y0)) { L.el.style.display = 'none'; continue; } placed.push(r); L.el.style.display = ''; L.el.style.left = L.x + 'px'; L.el.style.top = L.y + 'px'; L.el.classList.toggle('on', G.selected === L.p.i || G.hover === L.p.i); }
}

/* ---------- visita guiada ---------- */
function tourClear() { G.tour = -1; G.tourRet = null; $id('tour').classList.add('hidden'); }
function tourHide() { $id('tour').classList.add('hidden'); }
function tourStart() { beforeTravel(); endTheme(); closeModal(); closeCard(); closePanel(); if (G.in) leaveInterior(); G.tourRet = null; resetView(); setMode('orbit'); tourShow(0); }
function tourShow(i) {
  G.tour = i; const s = TOUR[i]; closeCard(); setMode('orbit'); flyTo(s.place, { r: s.r, ph: s.ph, dth: s.dth }); markVisited('t:' + i);
  const last = i === TOUR.length - 1, pl = places.find(q => q.key === s.place), canIn = s.enter && pl;
  $id('tour').innerHTML = `<div class="st">Parada ${i + 1} de ${TOUR.length}</div><h3>${esc(s.t)}</h3><div class="dots">${TOUR.map((_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</div><p>${esc(s.p)}</p><div class="ask">${esc(s.q)}</div><div class="row" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="btn sm" id="tr_p" ${i === 0 ? 'disabled' : ''}>${IC.left}Anterior</button>${canIn ? `<button class="btn sm" id="tr_in">${IC.door}Entrar</button>` : ''}<button class="btn sm" id="tr_i">${IC.info}Detalhes</button><button class="btn primary sm" id="tr_n">${last ? 'Concluir' : 'Próxima'}${IC.right}</button><button class="btn sm ghost" id="tr_x">Sair da visita</button></div>`;
  $id('tour').classList.remove('hidden'); $id('help').classList.add('hidden');
  $id('tr_p').onclick = () => tourShow(i - 1); $id('tr_n').onclick = () => last ? (tourClear(), setMode('orbit'), openSynthesis()) : tourShow(i + 1);
  $id('tr_x').onclick = () => { tourClear(); setMode('orbit'); }; $id('tr_i').onclick = () => openPanel({ kind: 'place', key: s.place });
  if (canIn) $id('tr_in').onclick = () => { G.tourRet = i; const d = pl.doors[0] || { x: pl.cx, z: pl.cz, ry: 0 }; enterBuilding(s.enter, { x: d.x, z: d.z, ry: d.ry, key: s.place }); };
  updateWhere();
}

/* ---------- entrada: teclado, mouse, toque ---------- */
const rc = new T.Raycaster(); rc.layers.set(1);
const ndc = new T.Vector2();
function pickPlace(cx, cy) { ndc.set(cx / VW * 2 - 1, -(cy / VH) * 2 + 1); rc.setFromCamera(ndc, cam); const h = rc.intersectObjects(pickG.children, false); return h.length ? places[h[0].object.userData.pi] : null; }
function initInput() {
  const c = $id('c'); G.touch = (window.matchMedia && matchMedia('(pointer:coarse)').matches) || 'ontouchstart' in window;
  addEventListener('keydown', e => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) { if (e.code === 'Escape') closeModal(); return; }
    if (G.mode === 'start') { if (e.code === 'Escape') closeModal(); return; }
    if (e.code === 'Escape') { if (modalOpen) closeModal(); else if ($id('panel') && !$id('panel').classList.contains('off')) closePanel(); else if (!$id('card').classList.contains('hidden')) closeCard(); else if (G.tour >= 0) { tourClear(); setMode('orbit'); } else openMenu(); e.preventDefault(); return; }
    if (modalOpen) return;
    G.keys[resolveControlCode(e.code)] = true; if (transportKey(e)) return; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code) && G.mode === 'fp') e.preventDefault();
    if (e.repeat) return;
    if (e.code === 'KeyE' && G.mode === 'fp') interact(); else if (e.code === 'KeyM') openAtlas(); else if (e.code === 'KeyG') openGlossary(); else if (e.code === 'KeyH') openHelp(); else if (e.code === 'KeyT') toggleDay();
    else if (e.code === 'KeyF') { try { const el = $id('app'); if (document.fullscreenElement) document.exitFullscreen(); else el.requestFullscreen && el.requestFullscreen().catch(() => toast('Tela cheia não disponível aqui')); } catch (x) { } }
    else if (e.code === 'KeyR' && G.mode === 'orbit') { resetView(); }
  });
  addEventListener('keyup', e => { G.keys[resolveControlCode(e.code)] = false; }); addEventListener('blur', () => { G.P.vx=G.P.vz=0; G.keys = {}; G.joy.x = G.joy.y = 0; G.joy.run = false; clearOrbitMotion(); });
  document.addEventListener('pointerlockchange', () => { const was = G.locked; G.locked = document.pointerLockElement === c; if (was && !G.locked && G.mode === 'fp' && !modalOpen && $id('panel').classList.contains('off') && !G.busy && !G.noMenu) openMenu(); });
  /* ponteiros */
  const ptr = new Map(); let down = null, pinch = 0;
  c.addEventListener('contextmenu', e => e.preventDefault());
  c.addEventListener('pointerdown', e => {
    if (G.mode === 'start' || modalOpen) return; c.setPointerCapture && c.setPointerCapture(e.pointerId); ptr.set(e.pointerId, { x: e.clientX, y: e.clientY }); down = { x: e.clientX, y: e.clientY, t: performance.now(), btn: e.button, moved: 0 }; G.fly = null;
    if (ptr.size === 2) { const [a, b] = [...ptr.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); }
    if (G.mode === 'fp' && e.pointerType === 'mouse' && !G.locked) { try { const r = c.requestPointerLock(); if (r && r.catch) r.catch(() => { }); } catch (x) { } }
  });
  c.addEventListener('pointermove', e => {
    const p = ptr.get(e.pointerId);
    if (!p) { if (G.mode === 'orbit' && e.pointerType === 'mouse') { const h = pickPlace(e.clientX, e.clientY); const p = h && ['monumento', 'palco'].includes(h.key) ? resolvePlace('praca') : h; G.hover = p && INFO[p.key] ? p.i : null; c.classList.toggle('pick', G.hover != null); } if (G.locked && G.mode === 'fp') { G.P.yaw -= e.movementX * .0024 * G.sens; G.P.pitch -= e.movementY * .0024 * G.sens; } return; }
    const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY; if (down) down.moved += Math.abs(dx) + Math.abs(dy);
    if (G.mode === 'fp') { const mx = G.locked ? e.movementX : dx, my = G.locked ? e.movementY : dy; const k = (e.pointerType === 'touch' ? .006 : .0036) * G.sens; G.P.yaw -= mx * k; G.P.pitch -= my * k; }
    else if (G.mode === 'orbit') {
      if (ptr.size === 2) { const [a, b] = [...ptr.values()], d = Math.hypot(a.x - b.x, a.y - b.y); if (pinch && d > 1) orbitMotion.zoom += Math.log(pinch / d); pinch = d; panView(dx / 2, dy / 2); }
      else if (e.buttons & 2 || e.shiftKey) panView(dx, dy); else { orbitMotion.th -= dx * .005; orbitMotion.ph -= dy * .004; }
    }
  });
  const up = e => {
    const had = ptr.delete(e.pointerId); if (!had) return;
    if (down && down.moved < 6 && performance.now() - down.t < 450 && G.mode === 'orbit' && ptr.size === 0 && e.button !== 2) { const h = pickPlace(e.clientX, e.clientY); if (h) { const p = ['monumento', 'palco'].includes(h.key) ? resolvePlace('praca') : h; if (INFO[p.key]) { if (G.tour >= 0) openPanel({ kind: 'place', key: p.key }); else { flyTo(p.i); openCard(p.i); } } } else if (G.tour < 0) closeCard(); }
    if (ptr.size < 2) pinch = 0; if (!ptr.size) down = null;
  };
  c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
  c.addEventListener('wheel', e => { if (G.mode === 'orbit') { e.preventDefault(); orbitMotion.zoom = cl(orbitMotion.zoom + e.deltaY * .0012, -1.5, 1.5); G.fly = null; } }, { passive: false });
  /* toque: joystick e botão E */
  const joy = $id('joy'), knob = joy.firstElementChild; let jid = null;
  const jm = e => { const r = joy.getBoundingClientRect(), R = r.width / 2; let x = (e.clientX - r.left - R) / R, y = (e.clientY - r.top - R) / R; const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; } G.joy.x = x; G.joy.y = y; G.joy.run = l > .92; knob.style.transform = `translate(${x * R * .6}px,${y * R * .6}px)`; };
  joy.addEventListener('pointerdown', e => { jid = e.pointerId; joy.setPointerCapture(e.pointerId); jm(e); e.stopPropagation(); }); joy.addEventListener('pointermove', e => { if (e.pointerId === jid) jm(e); });
  const jend = e => { if (e.pointerId !== jid) return; jid = null; G.joy.x = G.joy.y = 0; G.joy.run = false; knob.style.transform = ''; }; joy.addEventListener('pointerup', jend); joy.addEventListener('pointercancel', jend);
  $id('ebtn').addEventListener('click', () => interact());
}
const orbitMotion = { th: 0, ph: 0, zoom: 0, dx: 0, dy: 0 };
function clearOrbitMotion() { Object.keys(orbitMotion).forEach(k => orbitMotion[k] = 0); }
function panView(dx, dy) { orbitMotion.dx += dx; orbitMotion.dy += dy; }
function smoothOrbit(dt) {
  const f = G.reduceMotion ? 1 : 1 - Math.exp(-18 * dt), m = orbitMotion;
  view.th += m.th * f; view.ph = cl(view.ph + m.ph * f, .12, 1.48); view.r = cl(view.r * Math.exp(m.zoom * f), 18, 900);
  applyPan(m.dx * f, m.dy * f);
  Object.keys(m).forEach(k => { m[k] *= 1 - f; if (Math.abs(m[k]) < .00001) m[k] = 0; });
}
function applyPan(dx, dy) { const s = view.r * .0018, sn = Math.sin(view.th), cs = Math.cos(view.th); view.x -= (cs * dx + sn * dy) * s; view.z -= (-sn * dx + cs * dy) * s; const r = Math.hypot(view.x, view.z); if (r > WORLD_R) { view.x *= WORLD_R / r; view.z *= WORLD_R / r; } }

