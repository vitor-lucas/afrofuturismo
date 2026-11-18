/* ============================================================
   PRINCIPAL — inicialização, laço de render, janela
   ============================================================ */
let ren, scene, cam, clock, VW = 1000, VH = 600;
const view = { x: 0, y: 0, z: 0, r: 230, th: .6, ph: .95 }; // câmera orbital (visão urbana)
function buildBuildings() { buildCivic(); buildPlaces(); buildExtras(); }
function setProg(p, txt) { $id('lbar').style.width = Math.round(p * 100) + '%'; if (txt) $id('ltxt').textContent = txt; return nextFrame(); }
function showError(msg) { $id('load').classList.add('hidden'); $id('etxt').textContent = msg; $id('err').classList.remove('hidden'); }
async function boot() {
  try { G.touch = (window.matchMedia && matchMedia('(pointer:coarse)').matches) || 'ontouchstart' in window; } catch (e) { }
  await setProg(.04, 'Iniciando o motor 3D…');
  try { ren = new T.WebGLRenderer({ canvas: $id('c'), antialias: true, powerPreference: 'high-performance' }); }
  catch (e) { return showError('Seu navegador ou dispositivo não conseguiu iniciar o WebGL, que é necessário para o 3D. Tente atualizar o navegador, ativar a aceleração por hardware ou abrir em outro aparelho.'); }
  ren.outputEncoding = T.sRGBEncoding; ren.toneMapping = T.ACESFilmicToneMapping; ren.shadowMap.enabled = true; ren.shadowMap.type = T.PCFSoftShadowMap;
  scene = new T.Scene(); scene.fog = new T.Fog(0xd3e2e4, 200, 560); cam = new T.PerspectiveCamera(48, 1, .5, 1600); clock = new T.Clock();
  await setProg(.12, 'Céu e luz…'); buildSky(scene); bakeEnv(ren);
  iScene = new T.Scene(); iScene.background = new T.Color(0x0e0b08); iScene.environment = envInd;
  await setProg(.25, 'Terreno e ruas…'); registerMetropolis(); buildTerrain(scene);
  cityB = new Batch(); W0 = new Ctx(cityB, 0, 0, 0, 0, EXT.cols); cityG = new T.Group(); pickG = new T.Group(); scene.add(cityG, pickG);
  initVeg(); buildRoads();
  await setProg(.45, 'Edifícios…'); buildCivic();
  await setProg(.62, 'Moradias e espaços abertos…'); buildPlaces();
  await setProg(.78, 'Vegetação, pessoas e transporte…'); buildMetropolis(); buildExtras(); buildUrbanDetails();
  await setProg(.9, 'Montando a cena…'); cityB.build(cityG); Object.values(V).forEach(i => scene.add(i.commit()));
  applyTime(scene, ren, 0);
  try { const q = localStorage.getItem('vila.q'); G.quality = q || 'auto'; const s = parseFloat(localStorage.getItem('vila.sens')); if (s) G.sens = s; } catch (e) { G.quality = 'auto'; }
  loadVisited(); buildLabels(); initInput(); initTransport(); initWorldUI(); initDrawer(); renderStart(); onResize(); addEventListener('resize', onResize); document.addEventListener('fullscreenchange', onResize);
  document.addEventListener('visibilitychange', () => { clock.getDelta(); G.keys = {}; G.joy.x = G.joy.y = 0; G.joy.run = false; ren.shadowMap.needsUpdate = true; });
  resetView();view.r=920;view.ph=.8; setMode('start'); hideLoad(); G.booted = true; initExperience();
  window.__V = { METRO, DISTRICTS, LIFE, NETWORK, LINES, openAtlas, openTransit, boardTransit, openCityLife, openFarm, openEvents, openClimate, openSpaceport, startSpaceflight, ROADS, TRANSIT, FLEET, NAV, findRoute, startRoute, startVehicle, exitVehicle, updateTransport, openReader, openAccess, openThemes, openInnovation, resolvePlace, orbitMotion, frame, auto: v => { AUTO = v; }, view, cam, scene, iScene, ren, places, EXT, G, applyTime: t => applyTime(scene, ren, t), enterBuilding, exitBuilding, getInterior, INT, HOT, INFO, openPanel, tourShow, TOUR, setQuality };
  requestAnimationFrame(loop);
}
function onResize() { const a = $id('app'); VW = a.clientWidth || innerWidth; VH = a.clientHeight || innerHeight; setQuality(G.quality); cam.aspect = VW / VH; cam.updateProjectionMatrix(); }
let AUTO = true;
function loop() { requestAnimationFrame(loop); if (AUTO && !document.hidden) frame(); }
let _miniAt = -1, _labelsAt = -1, _shadowAt = -1, _shadowX = 1e6, _shadowZ = 1e6;
function frame(dtIn) {
  const dt = dtIn != null ? dtIn : Math.min(clock.getDelta(), .1); G.t += dt; if(G.mode!=='ride')NETWORK.clock+=dt; if(LIFE.player&&G.mode!=='fp')LIFE.player.visible=false; monitorQuality(dt); updateExperience(dt);updateSoundscape(dt);updateDiscoveries(); updateMetropolis(dt);
  if (Math.abs(G.tNight - G.tGoal) > .001) { G.tNight += Math.sign(G.tGoal - G.tNight) * Math.min(Math.abs(G.tGoal - G.tNight), dt * .8); if (!G.in) applyTime(scene, ren, G.tNight); }
  if (G.in) { updateInteriorCitizens(dt);if(!updateElevator(dt))fpUpdate(dt); if (!G.reduceMotion) G.in.tick.forEach(f => f(G.t)); if (G.t - _miniAt >= .1) { drawMini(); _miniAt = G.t; } ren.render(iScene, cam); return; }
  if (!G.reduceMotion) { for (const s of spin) s.o.rotation[s.a] += s.v * dt; for (const m of movers) m(dt, G.t); skyU0.uTime.value += dt; } updateUrbanDetails(dt);
  let tx, tz, sh;
  if(G.mode==='space'){updateSpaceflight(dt);tx=cam.position.x;tz=cam.position.z;sh=60;}
  else if(G.mode==='ride'){updateRegionalTransit(dt);tx=G.P.x;tz=G.P.z;sh=60;}
  else if (G.mode === 'drive') { updateTransport(dt); tx=G.P.x; tz=G.P.z; sh=55; if (G.t-_miniAt>=.1) { drawMini(); _miniAt=G.t; } }
  else if (G.mode === 'fp') { fpUpdate(dt); updateAvatar(dt); tx = G.P.x; tz = G.P.z; sh = 55; if (G.t - _miniAt >= .1) { drawMini(); _miniAt = G.t; } }
  else {
    if (G.mode === 'start' && !G.reduceMotion && !modalOpen) { view.th += dt * .035; } if (!G.fly) smoothOrbit(dt); flyUpdate(dt);
    cam.position.set(view.x + view.r * Math.sin(view.ph) * Math.sin(view.th), view.y + view.r * Math.cos(view.ph), view.z + view.r * Math.sin(view.ph) * Math.cos(view.th)); cam.lookAt(view.x, view.y, view.z); tx = view.x; tz = view.z; sh = cl(view.r * .55, 40, 150);
  }
  sky.position.copy(cam.position); stars.position.copy(cam.position);
  sun.target.position.set(tx, 0, tz); sun.position.set(tx + sun.userData.dir.x * 200, sun.userData.dir.y * 200, tz + sun.userData.dir.z * 200);
  const sc = sun.shadow.camera; if (sc.right !== sh) { sc.left = sc.bottom = -sh; sc.right = sc.top = sh; sc.updateProjectionMatrix(); ren.shadowMap.needsUpdate = true; }
  // Sombras em cadência própria; a câmera e o movimento continuam em cada quadro.
  if (sun.castShadow && (G.t - _shadowAt >= (['high','ultra'].includes(G.effectiveQuality) ? 1 / 30 : 1 / 15) || Math.hypot(tx - _shadowX, tz - _shadowZ) > 1)) {
    ren.shadowMap.needsUpdate = true; _shadowAt = G.t; _shadowX = tx; _shadowZ = tz;
  }
  ren.render(scene, cam); if (G.mode !== 'fp' && G.t - _labelsAt >= .05) { updateLabels(); _labelsAt = G.t; }
}
boot().catch(e => { console.error(e); window.__err = String(e && e.stack || e); showError('Ocorreu um erro ao montar a vila: ' + (e && e.message || e)); });
