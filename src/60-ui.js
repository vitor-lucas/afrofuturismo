/* ============================================================
   INTERFACE — HUD, cartões, painéis, glossário, mapa, menu
   ============================================================ */
const $id = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SV = d => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const IC = {
  menu: SV('<path d="M4 6h16M4 12h16M4 18h16"/>'), book: SV('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>'), map: SV('<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>'),
  help: SV('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>'), sun: SV('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  moon: SV('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'), walk: SV('<circle cx="13" cy="4.5" r="1.8"/><path d="m9 21 2-6 3 2v4M11 15l1-5 3 2 3 1M12 10 9 12l-2 3"/>'),
  exit: SV('<path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9"/>'), x: SV('<path d="M6 6l12 12M18 6 6 18"/>'), tour: SV('<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>'),
  eye: SV('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'), full: SV('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'), home: SV('<path d="m3 11 9-8 9 8M5 10v10h14V10"/>'),
  info: SV('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>'), play: SV('<path d="M7 4v16l13-8z"/>'), left: SV('<path d="m15 5-7 7 7 7"/>'), right: SV('<path d="m9 5 7 7-7 7"/>'), door: SV('<path d="M5 21V4l9-2v19M5 21h14M14 12h.01"/>'),
};
const btn = (ic, label, id, cls = '') => `<button class="btn ${cls}" id="${id}" aria-label="${esc(label)}" title="${esc(label)}">${IC[ic]}<span class="lab">${esc(label)}</span></button>`;

/* ---------- formatação de texto: selos F/R/A/P/X e termos do glossário ---------- */
const miniBadge = k => `<span class="badge ${k}" title="${esc(BADGES[k])}"><i><b>${k}</b></i>${esc(BADGES[k])}</span>`;
function fmt(t) {
  return String(t).split('\n').map(par => `<p>${esc(par).replace(/\{([FRAPX])\}\s*/g, (m, k) => miniBadge(k).replace('class="badge', 'style="font-size:10.5px;padding:1px 7px 1px 5px;margin-right:6px;vertical-align:1px" class="badge') + ' ')}</p>`).join('');
}
const badgeRow = list => `<div class="badges">${[...new Set(list)].map(miniBadge).join('')}</div>`;
const termChips = ids => ids && ids.length ? `<div class="chips">${ids.filter(i => GLOS[i]).map(i => `<button class="chip term-btn" data-term="${i}">${esc(GLOS[i].t)}</button>`).join('')}</div>` : '';

/* ---------- progresso (pontos explorados) ---------- */
const TOTAL_HOT = () => Object.keys(HOT).length + Object.keys(INFO).length;
function loadVisited() { try { const v = JSON.parse(localStorage.getItem('vila.vis') || '[]'); v.forEach(x => G.visited.add(x)); } catch (e) { } }
function markVisited(k) { if (G.visited.has(k)) return; G.visited.add(k); try { localStorage.setItem('vila.vis', JSON.stringify([...G.visited])); } catch (e) { } updateProgress(); }
function updateProgress() { const el = $id('progress'); if (el) { const p=visitProgress(); el.textContent = `${p.places}/${Object.keys(INFO).length} locais · ${p.interiors}/${Object.keys(INT).length} interiores · ${p.content}/${Object.keys(HOT).length} conteúdos`; } }

/* ---------- toast ---------- */
let toastT = 0;
function toast(msg, ms = 2600) { const el = $id('toast'); el.textContent = msg; el.classList.remove('hidden'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.add('hidden'), ms); }

/* ---------- ferramentas do HUD (mudam conforme o modo) ---------- */
function renderTools() {
  const m = G.mode, inside = !!G.in; let h = '';
  if (m === 'orbit') h = btn('tour', 'Visita guiada', 't_tour', 'primary') + btn('walk', 'Caminhar', 't_walk') + btn('map', 'Mapa', 't_map') + btn('book', 'Glossário', 't_glos') + btn(G.tGoal ? 'sun' : 'moon', G.tGoal ? 'Dia' : 'Noite', 't_day') + btn('eye', 'Rótulos', 't_lbl') + btn('menu', 'Menu', 't_menu');
  else if (inside) h = btn('exit', 'Sair do edifício', 't_exit', 'primary') + btn('map', 'Mapa', 't_map') + btn('book', 'Glossário', 't_glos') + btn('help', 'Ajuda', 't_help') + btn('menu', 'Menu', 't_menu');
  else if (m === 'fp') h = btn('home', 'Visão urbana', 't_orbit', 'primary') + btn('map', 'Mapa', 't_map') + btn('book', 'Glossário', 't_glos') + btn(G.tGoal ? 'sun' : 'moon', G.tGoal ? 'Dia' : 'Noite', 't_day') + btn('menu', 'Menu', 't_menu');
  if (m === 'drive') h = btn('home','Visão urbana','t_orbit') + btn('map','Mapa','t_map') + btn('menu','Menu','t_menu');
  if (!inside && m !== 'start') h = btn('play','Transportes · V','t_vehicle') + h;
  $id('tools').innerHTML = h;
  const on = (id, f) => { const e = $id(id); if (e) e.onclick = f; };
  on('t_vehicle',openMobility); on('t_tour', () => tourStart()); on('t_walk', () => goWalkFromOrbit()); on('t_map', () => openAtlas()); on('t_glos', () => openGlossary()); on('t_day', () => toggleDay()); on('t_lbl', () => { G.labels = !G.labels; toast(G.labels ? 'Rótulos ligados' : 'Rótulos desligados'); });
  on('t_menu', () => openNavigator()); on('t_exit', () => exitBuilding()); on('t_help', () => openHelp()); on('t_orbit', () => goOrbit());
}
function renderHelp() {
  const m = G.mode, inside = !!G.in;
  if (m === 'drive') { $id('help').textContent='W/S acelerar e ré · A/D virar · Espaço frear · E descer · V transportes'; return; }
  $id('help').innerHTML = m === 'orbit'
    ? '<kbd>Arrastar</kbd> girar · <kbd>Shift</kbd>+arrastar ou botão direito: mover · <kbd>Roda</kbd> zoom · <b>clique</b> num edifício para saber mais'
    : (G.touch ? 'Joystick: andar · arraste a tela: olhar · botão <b>E</b>: interagir' : '<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> andar · <kbd>Mouse</kbd> olhar (clique para capturar) · <kbd>Shift</kbd> correr · <kbd>E</kbd> interagir · <kbd>M</kbd> mapa · <kbd>G</kbd> glossário · <kbd>F</kbd> tela cheia · <kbd>Esc</kbd> menu');
}

/* ---------- cartão rápido (camada 1) ---------- */
function openCard(ref) {
  const p = resolvePlace(ref), key = p && p.key, inf = INFO[key]; if (!p || !inf) return closeCard();
  rememberDestination(key); G.selected = p.i; markVisited('p:' + key);
  const can = p.int || (p.doors && p.doors.length);
  $id('card').innerHTML = `<button class="x" id="cx" aria-label="Fechar">${IC.x}</button><div class="sub">${esc(placeAddress(p))}</div><h3>${esc(inf.t)}</h3>${badgeRow(inf.b)}<p>${esc(inf.q)}</p><div class="row"><button class="btn primary sm" id="c_more">${IC.info}Detalhes</button>${(p.int || (p.doors && p.doors[0] && p.doors[0].int)) ? `<button class="btn sm" id="c_in">${IC.door}Entrar</button>` : ''}<button class="btn sm" id="c_walk">${IC.walk}Ir até lá</button><button class="btn sm" id="c_route">Traçar rota</button><button class="btn sm" id="c_share">Copiar link</button><button class="btn sm" id="c_favorite">Favorito</button></div>`;
  $id('card').classList.remove('hidden');
  $id('cx').onclick = closeCard; $id('c_more').onclick = () => openPanel({ kind: 'place', key });
  const intId = p.int || (p.doors && p.doors[0] && p.doors[0].int); if (intId) $id('c_in').onclick = () => { closeCard(); const d = p.doors[0]; enterBuilding(intId, { x: d.x, z: d.z, ry: d.ry, key }); };
  $id('c_route').onclick=()=>startRoute(p.i); $id('c_share').onclick=()=>sharePlace(p.key);$id('c_favorite').onclick=()=>toggleFavorite(p.key);
  $id('c_walk').onclick = () => { closeCard(); goWalkTo(p.i); };
}
function closeCard() { $id('card').classList.add('hidden'); G.selected = null; }

/* ---------- painel detalhado (camadas 2 e 3) ---------- */
let PNL = null;
function openPanel(src, tab = 'res') {
  PNL = { src, tab }; renderPanel(); $id('panel').classList.remove('off');
}
function closePanel() { $id('panel').classList.add('off'); PNL = null; }
function renderPanel() {
  const { src, tab } = PNL; let t, sub, b, q, det, ask, g, s;
  if (src.kind === 'place') { const i = INFO[src.key]; t = i.t; sub = i.sub; b = i.b; q = i.q; det = i.a; ask = i.refl; g = i.g; s = i.s; markVisited('p:' + src.key); }
  else { const h = HOT[src.id]; t = h.t; sub = 'Ponto de interesse'; b = h.b; q = h.q; det = h.d; ask = [h.ask].filter(Boolean); g = h.g; s = h.s; markVisited('h:' + src.id); }
  const tabs = [['res', 'Resumo'], ['det', src.kind === 'place' ? 'Os 8 aspectos' : 'Detalhes'], ['ref', 'Refletir'], ['src', 'Fontes']];
  let body = '';
  if (tab === 'res') body = `<div class="quick">${esc(q)}</div><h4>Como ler este conteúdo</h4>${badgeRow(b)}<p style="font-size:13.5px;color:var(--ink2)">${[...new Set(b)].map(k => `<b>${BADGES[k]}:</b> ${BADGE_HELP[k]}`).join('<br>')}</p>${g && g.length ? `<h4>Termos</h4>${termChips(g)}` : ''}<p style="margin-top:14px"><button class="btn sm" data-goto="det">${IC.right}Ver detalhes</button></p>`;
  else if (tab === 'det') body = src.kind === 'place' ? det.map((x, i) => `<details ${i === 0 ? 'open' : ''}><summary>${esc(ASP[i])}</summary><div>${fmt(x)}</div></details>`).join('') : fmt(det);
  else if (tab === 'ref') body = `<h4>Perguntas para refletir</h4>${ask.map(a => `<div class="ask">${esc(a)}</div>`).join('') || '<p>—</p>'}<p style="font-size:13.5px;color:var(--ink2)">Converse com colegas e com a sua família. Não há resposta única.</p>${g && g.length ? `<h4>Termos para aprofundar</h4>${termChips(g)}` : ''}`;
  else body = `<h4>Fontes e leituras</h4><ul class="src">${(s || []).map(k => `<li>${esc(SRC[k] || k)}</li>`).join('') || '<li>Conteúdo de interpretação e proposta desta vila; não depende de fonte externa específica.</li>'}</ul><p class="src">${esc(SRC_NOTE)}</p>`;
  $id('panel').innerHTML = `<button class="x" id="px" aria-label="Fechar painel">${IC.x}</button><header><div class="sub">${esc(sub)}</div><h2>${esc(t)}</h2></header><div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button class="tab" role="tab" data-tab="${k}" aria-selected="${k === tab}">${l}</button>`).join('')}</div><div id="pbody"><button class="btn sm" id="panel-speak">Ouvir resumo</button>${body}</div>`;
  $id('panel-speak').onclick=()=>readText(t+'. '+q);
  $id('panel').querySelector('#px').onclick = closePanel;
  $id('panel').querySelectorAll('.tab').forEach(e => e.onclick = () => { PNL.tab = e.dataset.tab; renderPanel(); });
  $id('panel').querySelectorAll('[data-goto]').forEach(e => e.onclick = () => { PNL.tab = e.dataset.goto; renderPanel(); });
  $id('panel').querySelectorAll('.term-btn').forEach(e => e.onclick = () => showTerm(e.dataset.term));
}

/* ---------- modais ---------- */
let modalOpen = false;
function openModal(html, onClose) {
  if(modalOpen&&G.modalClose){const cleanup=G.modalClose;G.modalClose=null;cleanup();}
  clearInterval(ATLAS.timer);ATLAS.timer=0;
  if (!modalOpen) EXPERIENCE.focus=document.activeElement;
  G.keys={}; TRANSIT.touch={gas:0,steer:0,brake:false};
  $id('mbox').innerHTML = `<button class="x" id="mx" aria-label="Fechar">${IC.x}</button>${html}`; $id('modal').classList.remove('hidden'); modalOpen = true; G.modalClose = onClose || null;
  $id('mx').onclick = closeModal; $id('modal').onmousedown = e => { if (e.target.id === 'modal') closeModal(); };
  const w = $id('mbox'); w.scrollTop = 0; try { document.exitPointerLock && document.exitPointerLock(); } catch (e) { }
  $id('modal').setAttribute('aria-label', w.querySelector('h2')?.textContent || 'Informações');
  $id('mx').focus();
  w.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeModal();}if(e.key!=='Tab')return;const nodes=[...w.querySelectorAll('button:not(:disabled),input,select,a[href],summary,[tabindex="0"]')].filter(n=>!n.hidden),first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}};
  return w;
}
function closeModal() { $id('modal').classList.add('hidden'); modalOpen = false; const f = G.modalClose; G.modalClose = null; if (f) f(); if(EXPERIENCE.focus?.isConnected)EXPERIENCE.focus.focus(); if (G.mode === 'fp' && !isTouch()) { try { $id('c').focus(); } catch (e) { } } }
const isTouch = () => !!G.touch;

function showTerm(id) {
  const g = GLOS[id]; if (!g) return;
  const back = modalOpen; const w = openModal(`<div class="sub" style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink2)">Glossário</div><h2>${esc(g.t)}</h2>${badgeRow([g.b])}<p>${esc(g.d)}</p><p><button class="btn sm" id="tg">${IC.book}Abrir glossário completo</button></p>`);
  $id('tg').onclick = () => openGlossary(); markVisited('g:' + id);
}
function openGlossary(q = '') {
  const w = openModal(`<h2>Glossário</h2><p style="margin:0;color:var(--ink2)">Termos usados nesta vila. Toque em um deles para ler o significado.</p><input class="search" id="gq" placeholder="Buscar termo…" value="${esc(q)}" aria-label="Buscar termo"><div class="grid" id="gg"></div>`);
  const draw = () => { const v = $id('gq').value.trim().toLowerCase(); const ids = Object.keys(GLOS).filter(k => !v || GLOS[k].t.toLowerCase().includes(v) || GLOS[k].d.toLowerCase().includes(v)).sort((a, b) => GLOS[a].t.localeCompare(GLOS[b].t, 'pt')); $id('gg').innerHTML = ids.map(k => `<button class="gl" data-k="${k}"><b>${esc(GLOS[k].t)}</b><span class="badge ${GLOS[k].b}" style="margin-top:4px"><i><b>${GLOS[k].b}</b></i>${esc(BADGES[GLOS[k].b])}</span></button>`).join('') || '<p>Nenhum termo encontrado.</p>'; $id('gg').querySelectorAll('.gl').forEach(e => e.onclick = () => showTerm(e.dataset.k)); };
  $id('gq').oninput = draw; draw(); if (!isTouch()) setTimeout(() => { try { $id('gq').focus(); } catch (e) { } }, 50);
}
function openHelp() {
  openModal(`<h2>Como usar</h2><table class="leg"><tr><td><b>Visão urbana</b></td><td>Arraste para girar · Shift+arrastar (ou botão direito) para mover · roda ou pinça para aproximar · clique em um edifício para ver o resumo.</td></tr>
  <tr><td><b>Caminhar</b></td><td><kbd>W A S D</kbd> ou setas ↑↓ andam; ←→ giram · <kbd>Shift</kbd> corre · mouse olha (clique na cena para capturar o mouse; se o navegador não permitir, arraste para olhar).</td></tr>
  <tr><td><b>Interagir</b></td><td><kbd>E</kbd> abre portas de edifícios, a saída e os objetos com losango dourado.</td></tr>
  <tr><td><b>Atalhos</b></td><td><kbd>M</kbd> mapa · <kbd>G</kbd> glossário · <kbd>F</kbd> tela cheia · <kbd>T</kbd> dia/noite · <kbd>H</kbd> ajuda · <kbd>Esc</kbd> menu/fechar.</td></tr>
  <tr><td><b>Celular</b></td><td>Joystick à esquerda para andar, arraste à direita para olhar, botão <b>E</b> para interagir.</td></tr></table>
  <h3 style="font:700 18px var(--f-head);margin:18px 0 6px">Selos de conteúdo</h3><p>Cada afirmação tem um selo, para você saber o que é fato e o que é imaginação:</p>
  <table class="leg">${Object.keys(BADGES).map(k => `<tr><td>${miniBadge(k)}</td><td>${esc(BADGE_HELP[k])}</td></tr>`).join('')}</table>`);
}
function openConcept() {
  openModal(`<div class="sub" style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);font-weight:700">Arquitetura, cidades e futuros negros</div><h2>O conceito da Vila Afrofuturista</h2>
  <p>Esta vila é uma <b>maquete navegável</b> que imagina como poderia ser uma cidade planejada a partir de saberes africanos e afro-brasileiros, com tecnologia a serviço da comunidade. Ela foi feita para o Dia da Consciência Negra (20 de novembro).</p>
  <p><b>Afrofuturismo</b> é imaginar futuros em que pessoas negras são protagonistas. Aqui isso se traduz em quatro pilares:</p>
  <div class="pill4"><div><b style="color:var(--clay)">Ancestralidade</b>Terra, pedra e madeira, pátios e formas inspiradas em tradições reais, com respeito e sem inventar significados.</div><div><b style="color:var(--leaf)">Comunidade</b>Praça, mercado, conselho e moradias em rede: decidir e cuidar juntos.</div><div><b style="color:var(--indigo)">Tecnologia</b>Dados, energia e saúde digital, sempre com propósito social e acesso aberto.</div><div><b style="color:var(--teal)">Sustentabilidade</b>Água, energia, alimentos e resíduos em ciclos fechados e baratos.</div></div>
  <h3 style="font:700 18px var(--f-head);margin:18px 0 6px">Fato, referência, interpretação, proposta ou ficção?</h3><p>Para não confundir história com imaginação, todo conteúdo tem um selo:</p><table class="leg">${Object.keys(BADGES).map(k => `<tr><td>${miniBadge(k)}</td><td>${esc(BADGE_HELP[k])}</td></tr>`).join('')}</table>
  <h3 style="font:700 18px var(--f-head);margin:18px 0 6px">Cuidado com os símbolos</h3><p>Padrões gráficos desta vila são <b>inspirados</b> em tecidos e pinturas africanas, mas não reproduzem símbolos específicos nem lhes atribuem significados. Para conhecer os significados reais, consulte as fontes.</p>
  <p><button class="btn primary" id="cc1">${IC.tour}Iniciar visita guiada</button> <button class="btn" id="cc2">${IC.eye}Explorar a cidade</button></p>`);
  $id('cc1').onclick = () => { closeModal(); tourStart(); }; $id('cc2').onclick = () => { closeModal(); startExplore(); };
}
function openMenu() {
  const inside = !!G.in;
  openModal(`<h2>Menu</h2><div class="grid" style="margin-top:12px">${[['Continuar', 'play', 'm_go'], inside ? ['Sair do edifício', 'exit', 'm_exit'] : (G.mode === 'fp' ? ['Visão urbana', 'home', 'm_orb'] : ['Caminhar pela vila', 'walk', 'm_walk']), ['Mapa', 'map', 'm_map'], ['Glossário', 'book', 'm_glos'], ['Visita guiada', 'tour', 'm_tour'], ['Conceito', 'info', 'm_con'], ['Ajuda e controles', 'help', 'm_help'], ['Configurações', 'menu', 'm_set'], ['Fontes e créditos', 'book', 'm_src'], ['Metrópole e distritos','map','m_metro'], ['Vida comunitária','info','m_life'], ['Transportes limpos','play','m_vehicle'], ['Percursos por tema','tour','m_themes'], ['Visita em texto e busca','book','m_reader'], ['Conforto e acessibilidade','eye','m_access'], ['Laboratório sustentável','sun','m_innov'], ['Retomar caminhada','walk','m_resume']].map(([l, i, id]) => `<button class="btn" id="${id}" style="justify-content:flex-start;border-radius:14px">${IC[i]}${l}</button>`).join('')}</div><p style="margin-top:14px;font-size:13px;color:var(--ink2)">${visitProgress().content} conteúdos lidos, ${visitProgress().places} locais e ${visitProgress().interiors} interiores visitados. O progresso fica salvo neste navegador.</p>`);
  const on = (id, f) => { const e = $id(id); if (e) e.onclick = f; };
  on('m_metro',openMetropolis); on('m_life',openCityLife); on('m_vehicle',openMobility); on('m_themes',openThemes); on('m_reader',()=>openReader()); on('m_access',openAccess); on('m_innov',openInnovation); on('m_resume',resumeVisit);
  on('m_go', closeModal); on('m_exit', () => { closeModal(); exitBuilding(); }); on('m_orb', () => { closeModal(); goOrbit(); }); on('m_walk', () => { closeModal(); goWalkFromOrbit(); }); on('m_map', openMap); on('m_glos', () => openGlossary()); on('m_tour', () => { closeModal(); tourStart(); }); on('m_con', openConcept); on('m_help', openHelp); on('m_set', openSettings); on('m_src', openSources);
}
function openSettings() {
  openModal(`<h2>Configurações</h2><p><b>Qualidade gráfica</b><br>Automática ajusta o detalhe ao desempenho. Ultra amplia a resolução até 8,3 milhões de pixels, com sombras de até 4096 px; depende da capacidade do aparelho.</p><div class="row" id="qrow" style="display:flex;gap:8px;flex-wrap:wrap">${[['auto','Automática'], ['low', 'Baixa'], ['med', 'Média'], ['high', 'Alta'], ['ultra','Ultra HD']].map(([k, l]) => `<button class="btn ${G.quality === k ? 'primary' : ''}" data-q="${k}">${l}</button>`).join('')}</div>
  <p style="margin-top:18px"><b>Sensibilidade do mouse</b><br><input aria-label="Sensibilidade do mouse" type="range" id="sens" min="0.4" max="2.4" step="0.1" value="${G.sens}" style="width:min(320px,100%)"></p>
  <p><label><input type="checkbox" id="lblchk" ${G.labels ? 'checked' : ''}> Mostrar rótulos na visão urbana</label></p>
  <p><button class="btn" id="resetp">Zerar progresso de exploração</button></p>`);
  $id('qrow').querySelectorAll('button').forEach(b => b.onclick = () => { setQuality(b.dataset.q); openSettings(); });
  $id('sens').oninput = e => { G.sens = +e.target.value; try { localStorage.setItem('vila.sens', G.sens); } catch (x) { } };
  $id('lblchk').onchange = e => { G.labels = e.target.checked; };
  $id('resetp').onclick = () => { G.visited.clear(); try { localStorage.removeItem('vila.vis'); } catch (e) { } updateProgress(); toast('Progresso zerado'); };
}
function openSources() {
  openModal(`<h2>Fontes e créditos</h2>${developerCredits()}<p>${esc(SRC_NOTE)}</p><ul class="src">${Object.keys(SRC).map(k => `<li>${esc(SRC[k])}</li>`).join('')}</ul>
  <h3 style="font:700 18px var(--f-head);margin:18px 0 6px">Limites desta maquete</h3><p style="font-size:14px;color:var(--ink2)">Os edifícios, os interiores e as tecnologias são interpretações criadas para esta atividade. Nenhuma obra de arte, retrato ou símbolo real foi reproduzido: as imagens são composições abstratas. As datas e os fatos históricos foram selecionados de fontes de referência e devem ser conferidos antes de citação.</p>`);
}

/* ---------- mapa da cidade ---------- */
function mapXY(x, z, W) { const k = W / 2 / (WORLD_R+15); return [W / 2 + x * k, W / 2 + z * k]; }
function drawCityMap(cv, opt = {}) {
  const W = cv.width, g = cv.getContext('2d'), k = W / 2 / (WORLD_R+15); g.fillStyle = '#17110b'; g.fillRect(0, 0, W, W);
  g.fillStyle = '#233019'; g.beginPath(); g.arc(W / 2, W / 2, 142 * k, 0, TAU); g.fill();
  const line = (a, b, w, color) => { g.strokeStyle = color; g.lineWidth = Math.max(1, w * k); g.beginPath(); g.moveTo(W / 2 + a[0] * k, W / 2 + a[1] * k); g.lineTo(W / 2 + b[0] * k, W / 2 + b[1] * k); g.stroke(); };
  ROADS.rings.forEach(r => { g.strokeStyle = '#726658'; g.lineWidth = (r.r1 - r.r0 + r.sw * 2) * k; g.beginPath(); g.arc(W / 2, W / 2, (r.r0 + r.r1) / 2 * k, 0, TAU); g.stroke(); g.strokeStyle = '#4b4034'; g.lineWidth = (r.r1 - r.r0) * k; g.stroke(); });
  ROADS.avenues.forEach(v => line(polar(v.deg, v.r0), polar(v.deg, v.r1), v.w, '#4b4034'));
  (ROADS.streets||[]).forEach(v=>line(v.a,v.b,v.w,'#655d50'));
  [...ROADS.paths, ...ROADS.access].forEach(v => line(v.a, v.b, v.w, '#A1957F'));
  g.fillStyle = '#2b3f5a'; g.beginPath(); g.arc(W / 2, W / 2, 9 * k, 0, TAU); g.fill();
  const COL = { museu: '#E8B23A', cultural: '#C8603B', inovacao: '#46C9BC', escola: '#8C9CE8', mercado: '#F08AB0', saude: '#7FC498', biblioteca: '#C98AD6', conselho: '#F0C25A', sustent: '#7FC498' };
  places.forEach((p, i) => { if (['monumento', 'palco'].includes(p.key)) return; const [x, y] = mapXY(p.cx, p.cz, W); g.save(); g.translate(x, y); g.rotate(-p.ry); g.fillStyle = COL[p.key] || '#B7A78C'; const w = Math.max(5, p.W * k), d = Math.max(5, p.D * k); g.fillRect(-w / 2, -d / 2, w, d); g.restore(); });
  if (opt.num) places.forEach((p) => { if (!p.n) return; const [x, y] = mapXY(p.cx, p.cz, W); g.fillStyle = '#fff'; g.font = `700 ${Math.round(W / 38)}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.strokeStyle = '#000'; g.lineWidth = 3; g.strokeText(p.n, x, y); g.fillText(p.n, x, y); });
  drawPublicSpaces(g,W);drawRouteMap(g,W);
  if (opt.me) drawMapPlayer(g, opt.me.x, opt.me.z, opt.me.yaw, W);
}
function drawMapPlayer(g,x,z,yaw,W){const [px,py]=mapXY(x,z,W),r=Math.max(6,W/70);g.save();g.translate(px,py);g.fillStyle='rgba(50,171,255,.22)';g.beginPath();g.arc(0,0,r*2,0,TAU);g.fill();g.fillStyle='#1687EF';g.strokeStyle='#fff';g.lineWidth=Math.max(2,W/250);g.beginPath();g.arc(0,0,r,0,TAU);g.fill();g.stroke();g.save();g.rotate(-yaw);g.fillStyle='#fff';g.beginPath();g.moveTo(0,-r*1.8);g.lineTo(r*.6,-r*.5);g.lineTo(-r*.6,-r*.5);g.closePath();g.fill();g.restore();if(W>400){g.font='bold 14px system-ui';g.textAlign='center';g.fillStyle='#fff';g.strokeStyle='#123629';g.lineWidth=4;g.strokeText('VOCÊ ESTÁ AQUI',0,r*3.2);g.fillText('VOCÊ ESTÁ AQUI',0,r*3.2);}g.restore();}

function openMap() {
  const list = places.filter(p => !['monumento', 'palco'].includes(p.key) && INFO[p.key]); list.forEach((p, i) => p.n = i + 1);
  const w = openModal(`<h2>Mapa da Vila</h2><p style="margin:0 0 10px;color:var(--ink2)">Toque em um lugar da lista ou no mapa. ${G.mode === 'orbit' ? 'A câmera voa até ele.' : 'Escolha um destino para ver seus detalhes e traçar uma rota.'}</p><div class="maprow"><canvas id="mapc" width="720" height="720"></canvas><div class="list" id="mapl">${list.map(p => `<button data-i="${p.i}"><i>${p.n}</i><span><b>${esc(INFO[p.key].t)}</b><br><small style="color:var(--ink2)">${esc(placeAddress(p))}</small></span></button>`).join('')}</div></div>`);
  const cv = $id('mapc'); drawCityMap(cv, { num: true, me: G.mode === 'fp' && !G.in ? { x: G.P.x, z: G.P.z, yaw: G.P.yaw } : null });
  const go = ref => { closeModal(); if (G.in) { toast('Saia do edifício para ir a outro lugar'); return; } if (G.mode === 'fp') openCard(ref); else if(G.mode==='drive'){toast('Pare e desça para visitar um edifício.');} else { if (G.mode === 'start') setMode('orbit'); flyTo(ref); openCard(ref); } };
  $id('mapl').querySelectorAll('button').forEach(b => b.onclick = () => go(+b.dataset.i));
  cv.onclick = e => { const r = cv.getBoundingClientRect(), mx = (e.clientX - r.left) / r.width * cv.width, my = (e.clientY - r.top) / r.height * cv.height; let best = null, bd = 1e9; list.forEach(p => { const [x, y] = mapXY(p.cx, p.cz, cv.width), d = Math.hypot(x - mx, y - my); if (d < bd) { bd = d; best = p; } }); if (best && bd < 40) go(best.i); };
}

/* ---------- minimapa ---------- */
let miniBase = null;
function drawMini() {
  const cv = $id('mm'), g = cv.getContext('2d'), W = cv.width; g.clearRect(0, 0, W, W);
  const P = G.P;
  if (!G.in) { if (!miniBase || miniBase.width !== W) { miniBase = document.createElement('canvas'); miniBase.width = miniBase.height = W; drawCityMap(miniBase); } g.drawImage(miniBase, 0, 0); drawMapPlayer(g, P.x, P.z, P.yaw, W); $id('mml').textContent = nearestPlaceName(P.x, P.z); return; }
  const I = G.in, bb = I.bb, pad = 2, sx = (W - 24) / (bb[2] - bb[0] + pad * 2), sy = (W - 24) / (bb[3] - bb[1] + pad * 2), s = Math.min(sx, sy), ox = W / 2 - (bb[0] + bb[2]) / 2 * s, oz = W / 2 - (bb[1] + bb[3]) / 2 * s, lv = P.lv;
  g.fillStyle = '#120d08'; g.fillRect(0, 0, W, W);
  const X = x => x * s + ox, Z = z => z * s + oz;
  I.rooms.forEach(r => { if (r.lv !== lv) return; g.fillStyle = r === G.room ? 'rgba(232,178,58,.30)' : 'rgba(246,238,221,.10)'; g.fillRect(X(r.x0), Z(r.z0), (r.x1 - r.x0) * s, (r.z1 - r.z0) * s); });
  g.strokeStyle = '#E9DFCB'; g.lineWidth = 3; g.lineCap = 'butt';
  I.segs.forEach(sg => { if (sg.lv !== lv) return; let cur = sg.a0; const draw = (a, b) => { if (b - a < .01) return; g.beginPath(); if (sg.axis === 'x') { g.moveTo(X(a), Z(sg.fixed)); g.lineTo(X(b), Z(sg.fixed)); } else { g.moveTo(X(sg.fixed), Z(a)); g.lineTo(X(sg.fixed), Z(b)); } g.stroke(); }; sg.ops.forEach(o => { draw(cur, o.a); if (o.win) { g.save(); g.strokeStyle = '#5FA9B5'; draw(o.a, o.b); g.restore(); } cur = o.b; }); draw(cur, sg.a1); });
  I.ramps.forEach(r => { if (r.lv0 !== lv && r.lv0 + 1 !== lv) return; g.fillStyle = 'rgba(200,160,100,.6)'; g.fillRect(X(r.x0), Z(r.z0), (r.x1 - r.x0) * s, (r.z1 - r.z0) * s); });
  I.hots.forEach(h => { if (h.lv !== lv) return; g.fillStyle = G.visited.has('h:' + h.id) ? '#7FC498' : '#E8B23A'; g.beginPath(); g.arc(X(h.x), Z(h.z), 3.5, 0, TAU); g.fill(); });
  if (I.exit) { g.fillStyle = '#E08359'; g.fillRect(X(I.exit.x) - 4, Z(I.exit.z) - 4, 8, 8); }
  g.save(); g.translate(X(P.x), Z(P.z)); g.rotate(-P.yaw); g.fillStyle = '#fff'; g.strokeStyle = '#000'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -10); g.lineTo(7, 8); g.lineTo(0, 4); g.lineTo(-7, 8); g.closePath(); g.fill(); g.stroke(); g.restore();
  $id('mml').textContent = (I.lvN > 1 ? `Pavimento ${lv + 1} · ` : '') + (G.room ? G.room.name : I.name);
}
function nearestPlaceName(x, z) { let b = null, bd = 1e9; places.forEach(p => { if (!INFO[p.key] || p.key === 'monumento' || p.key === 'palco') return; const d = Math.hypot(x - p.cx, z - p.cz) - p.r; if (d < bd) { bd = d; b = p; } }); const r = Math.hypot(x, z); if (r < 20) return 'Praça Central'; return b && bd < 14 ? INFO[b.key].t : (r < 82 ? 'Anel viário' : 'Bairros e áreas verdes'); }

/* ---------- tela inicial ---------- */
function renderStart() {
  $id('start').innerHTML = `<div class="in"><div class="kick">Arquitetura, cidades e futuros negros</div><h1>Metrópole Afrofuturista</h1><p>Uma cidade imaginada a partir de saberes africanos e afro-brasileiros, com tecnologia a serviço da comunidade. Explore por fora, entre nos edifícios e aprenda o que é fato, o que é inspiração e o que é imaginação.</p>
  <div class="btns"><button class="btn primary" id="s_metro">Explorar os oito distritos</button><button class="btn primary" id="s_exp">${IC.eye}Explorar a cidade</button><button class="btn" id="s_tour">${IC.tour}Iniciar visita guiada</button><button class="btn" id="s_con">${IC.info}Conhecer o conceito</button><button class="btn" id="s_map">${IC.map}Ver mapa</button><button class="btn" id="s_themes">${IC.tour}Percursos por tema</button><button class="btn" id="s_vehicle">${IC.play}Transportes limpos</button><button class="btn" id="s_glos">${IC.book}Abrir glossário</button></div>
  <div class="fine">Controles: arraste para girar · clique nos edifícios · botão "Caminhar" para andar com WASD e mouse. Funciona também no celular.</div></div>`;
  $id('s_metro').onclick=()=>{startExplore();view.r=700;view.ph=.8;openAtlas();}; $id('s_themes').onclick=openThemes; $id('s_vehicle').onclick=openMobility;
  $id('s_exp').onclick = () => startExplore(); $id('s_tour').onclick = () => tourStart(); $id('s_con').onclick = openConcept; $id('s_map').onclick = openMap; $id('s_glos').onclick = () => openGlossary();
}
