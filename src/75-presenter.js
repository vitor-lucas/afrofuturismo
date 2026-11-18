/* Apresentação local para GitHub Pages. O conteúdo do site permanece público.
   O token libera a interface; não substitui autorização em um servidor. */
const PRESENTER = {
  active: false, expiresAt: 0, step: 0, elapsed: 0, runningSince: null,
  failures: 0, blockedUntil: 0, initialized: false, timer: null,
  compact: false, notes: false, previousDay: null, previousAutoDay: null,
};
const PRESENTER_STEPS = [
  { title: 'Metrópole Afrofuturista', label: 'Abertura', wide: true,
    text: 'Um futuro imaginado a partir de saberes africanos e afro-brasileiros. Ancestralidade, comunidade, tecnologia e sustentabilidade orientam esta cidade educativa.',
    note: 'Apresente a proposta e os quatro pilares. Explique que a cidade é uma criação educativa: não representa todas as culturas africanas como uma única tradição.' },
  ...TOUR.map(s => ({ title: s.t, label: 'Cidade e arquitetura', place: s.place, enter: s.enter,
    r: s.r, ph: s.ph, dth: s.dth, text: s.p, note: s.q })),
  { title: 'Oito distritos, uma cidade conectada', label: 'Escala metropolitana', wide: true,
    text: 'N’Kanda, Ubuntu, Sankofa, Wakanda Verde, Maat, Kemet, Nzinga e Dandara conectam moradia, cultura, ciência, alimentos e mobilidade. Os distritos são ficcionais.',
    note: 'Mostre como os bairros se conectam. Compare a proposta com deslocamentos e serviços da sua comunidade.' },
  { title: 'Pesquisa, referências e pensamento crítico', label: 'Fundamentação', wide: true, action: 'research',
    text: 'A pesquisa reúne arquitetura, urbanismo, arte, ancestralidade e cultura negra. Diferencie fatos históricos, referências culturais, interpretações e propostas imaginadas.',
    note: 'Abra as pesquisas para consultar o texto completo. Ao citar uma informação histórica, confira a fonte original.' },
  { title: 'Quem constrói este futuro?', label: 'Encerramento', wide: true, action: 'credits',
    text: 'Uma cidade se constrói com pessoas. Conheça a equipe de pesquisa, design, apresentação e desenvolvimento que participa deste projeto.',
    note: 'Apresente os créditos e convide o público a propor uma ação concreta de cuidado, cultura ou sustentabilidade para sua comunidade.' },
];

function presenterHasAccess(now = Date.now()) {
  return PRESENTER.expiresAt > now;
}
function presenterClock(now = Date.now()) {
  return PRESENTER.elapsed + (PRESENTER.runningSince === null ? 0 : Math.max(0, now - PRESENTER.runningSince));
}
function presenterFormatTime(ms) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map(n => String(n).padStart(2, '0')).join(':');
}
async function presenterCheckToken(value) {
  if (!globalThis.crypto?.subtle) throw Error('Abra o site por HTTPS para validar o token neste navegador.');
  const token = String(value).trim();
  if (!/^AFRO-[A-Za-z0-9_-]{24,64}$/.test(token)) return false;
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  const digest = Array.from(new Uint8Array(bytes), x => x.toString(16).padStart(2, '0')).join('');
  let different = digest.length ^ PRESENTER_ACCESS.tokenHash.length;
  for (let i = 0; i < digest.length; i++) different |= digest.charCodeAt(i) ^ (PRESENTER_ACCESS.tokenHash.charCodeAt(i) || 0);
  return different === 0;
}
function openPresenter() {
  if (PRESENTER.active && presenterHasAccess()) {
    closeModal();
    $id('presenter-title')?.focus();
    return;
  }
  if (presenterHasAccess()) return presenterStart(0);
  openModal(`<section class="presenter-access"><div class="presenter-eyebrow">ANCESTRALIDADE · CONHECIMENTO · FUTURO</div>
    <h2>Modo apresentador</h2><p>Conduza uma visita à metrópole, dos quatro pilares aos interiores, às pesquisas e à equipe.</p>
    <div class="presenter-access-features"><span>${PRESENTER_STEPS.length} etapas</span><span>Cronômetro</span><span>Teclado e toque</span></div>
    <form id="presenter-login"><label for="presenter-token">Token de acesso</label>
    <div class="presenter-token-row"><input class="search" id="presenter-token" type="password" required maxlength="80" autocomplete="off" autocapitalize="none" spellcheck="false" aria-describedby="presenter-access-help presenter-login-status"><button type="button" class="btn" id="presenter-show-token" aria-label="Mostrar token" aria-pressed="false">Mostrar</button></div>
    <p id="presenter-login-status" role="status" aria-live="polite"></p>
    <button class="btn primary" type="submit" id="presenter-submit">Entrar e apresentar</button></form>
    <p id="presenter-access-help" class="presenter-access-help">O token libera os controles neste navegador por até 2 horas, sem ser salvo. Ao sair ou recarregar, entre novamente. O conteúdo do site é público; este bloqueio local não protege informações privadas.</p></section>`);
  const form = $id('presenter-login'), input = $id('presenter-token'), status = $id('presenter-login-status'), submit = $id('presenter-submit');
  $id('presenter-show-token').onclick = e => {
    const visible = input.type === 'password'; input.type = visible ? 'text' : 'password';
    e.currentTarget.textContent = visible ? 'Ocultar' : 'Mostrar';
    e.currentTarget.setAttribute('aria-label', visible ? 'Ocultar token' : 'Mostrar token');
    e.currentTarget.setAttribute('aria-pressed', String(visible));
  };
  const blocked = Math.ceil((PRESENTER.blockedUntil - Date.now()) / 1000);
  if (blocked > 0) status.textContent = `Muitas tentativas. Aguarde ${blocked} segundos antes de tentar novamente.`;
  form.onsubmit = async e => {
    e.preventDefault();
    if (submit.disabled) return;
    const remaining = Math.ceil((PRESENTER.blockedUntil - Date.now()) / 1000);
    if (remaining > 0) { status.textContent = `Aguarde ${remaining} segundos antes de tentar novamente.`; return; }
    submit.disabled = true; input.setAttribute('aria-invalid', 'false'); status.textContent = 'Verificando acesso…';
    let token = input.value; input.value = '';
    try {
      const valid = await presenterCheckToken(token); token = '';
      if (!modalOpen || $id('presenter-login') !== form) return;
      if (!valid) {
        PRESENTER.failures++;
        if (PRESENTER.failures >= 5) { PRESENTER.blockedUntil = Date.now() + 30000; PRESENTER.failures = 0; }
        input.setAttribute('aria-invalid', 'true');
        status.textContent = PRESENTER.blockedUntil > Date.now() ? 'Muitas tentativas. Aguarde 30 segundos antes de tentar novamente.' : 'Token inválido. Confira o token fornecido pela equipe.';
        input.focus(); return;
      }
      PRESENTER.failures = 0; PRESENTER.blockedUntil = 0;
      PRESENTER.expiresAt = Date.now() + PRESENTER_ACCESS.sessionMs;
      presenterStart(0);
    } catch (error) { if ($id('presenter-login') === form) status.textContent = error.message; }
    finally { token = ''; submit.disabled = false; }
  };
  input.focus();
}
function presenterRequireAccess() {
  if (presenterHasAccess()) return true;
  if (PRESENTER.active) presenterStop('Sessão encerrada. Informe o token para apresentar novamente.');
  else openPresenter();
  return false;
}
function presenterStart(index = 0) {
  if (!presenterRequireAccess() || G.busy) return;
  if (!PRESENTER.active) {
    PRESENTER.previousDay = G.tGoal;
    PRESENTER.previousAutoDay = METRO.autoDay;
    PRESENTER.elapsed = 0; PRESENTER.runningSince = Date.now(); PRESENTER.compact = false; PRESENTER.notes = false;
  }
  PRESENTER.active = true;
  document.documentElement.dataset.presenting = 'true';
  $id('presenter-stage').classList.remove('hidden');
  presenterGo(index);
}
function presenterGo(index) {
  if (!presenterRequireAccess() || !PRESENTER.active || G.busy) return;
  if (!Number.isInteger(index) || index < 0 || index >= PRESENTER_STEPS.length) return;
  const s = PRESENTER_STEPS[index]; PRESENTER.step = index;
  closeModal();
  if (G.booted) {
    startExplore();
    if (s.wide) Object.assign(view, { x: 0, y: 0, z: 0, r: 920, ph: .8 });
    else flyTo(s.place, { r: s.r, ph: s.ph, dth: s.dth });
  }
  renderPresenter();
}
function renderPresenter() {
  if (!PRESENTER.active || !presenterHasAccess()) return;
  const s = PRESENTER_STEPS[PRESENTER.step], canEnter = G.booted && s.enter && places.some(p => p.int === s.enter);
  $id('presenter-stage').innerHTML = `<header class="presenter-topbar"><span class="presenter-badge">MODO APRESENTADOR</span><div class="presenter-clock"><time id="presenter-clock" aria-label="Tempo de apresentação">${presenterFormatTime(presenterClock())}</time><button class="btn sm" id="presenter-pause" aria-pressed="${PRESENTER.runningSince === null}">${PRESENTER.runningSince === null ? 'Retomar' : 'Pausar'}</button></div><button class="btn sm" id="presenter-lock">Sair e bloquear</button></header>
    <section class="presenter-deck${PRESENTER.compact ? ' is-compact' : ''}" aria-label="Controles de apresentação">
    <div class="presenter-deck-meta"><span>${esc(s.label)} · ${PRESENTER.step + 1}/${PRESENTER_STEPS.length}</span><button class="btn sm" id="presenter-compact" aria-expanded="${!PRESENTER.compact}" aria-controls="presenter-content">${PRESENTER.compact ? 'Mostrar texto' : 'Recolher texto'}</button></div>
    <h2 id="presenter-title" tabindex="-1">${esc(s.title)}</h2>
    <div id="presenter-content" ${PRESENTER.compact ? 'hidden' : ''}><p class="presenter-description">${esc(s.text)}</p><div class="presenter-actions">
    ${canEnter ? `<button class="btn sm" id="presenter-interior">${G.in ? 'Voltar ao exterior' : 'Visitar interior'}</button>` : ''}
    ${s.action ? `<button class="btn sm" id="presenter-resource">${s.action === 'research' ? 'Abrir pesquisas' : 'Ver equipe e créditos'}</button>` : ''}
    <button class="btn sm" id="presenter-notes" aria-expanded="${PRESENTER.notes}" aria-controls="presenter-note">Roteiro de fala</button>
    <button class="btn sm" id="presenter-full">Tela cheia</button>${G.booted ? '<button class="btn sm" id="presenter-light">Alternar dia/noite</button>' : ''}</div>
    <p id="presenter-note" class="presenter-note" ${PRESENTER.notes ? '' : 'hidden'}>${esc(s.note)}</p></div>
    <nav class="presenter-navigation" aria-label="Etapas da apresentação"><button class="btn" id="presenter-prev" ${PRESENTER.step === 0 ? 'disabled' : ''} aria-label="Etapa anterior">← <span>Anterior</span></button><div class="presenter-step-picker"><label class="sr-only" for="presenter-step">Ir para etapa</label><select id="presenter-step">${PRESENTER_STEPS.map((step, i) => `<option value="${i}" ${i === PRESENTER.step ? 'selected' : ''}>${i + 1}. ${esc(step.title)}</option>`).join('')}</select></div><button class="btn primary" id="presenter-next">${PRESENTER.step === PRESENTER_STEPS.length - 1 ? 'Concluir' : 'Próxima →'}</button></nav>
    <div class="presenter-progress" role="progressbar" aria-label="Progresso do roteiro" aria-valuemin="1" aria-valuemax="${PRESENTER_STEPS.length}" aria-valuenow="${PRESENTER.step + 1}"><span style="width:${(PRESENTER.step + 1) / PRESENTER_STEPS.length * 100}%"></span></div>
    <small class="presenter-shortcuts">← → etapas · P pausar · F tela cheia · Esc opções${G.booted ? '' : ' · Apresentação em texto: 3D indisponível'}</small></section>
    <div class="sr-only" id="presenter-announcement" role="status" aria-live="polite">Etapa ${PRESENTER.step + 1}: ${esc(s.title)}</div>`;
  $id('presenter-prev').onclick = () => presenterGo(PRESENTER.step - 1);
  $id('presenter-next').onclick = presenterNext;
  $id('presenter-step').onchange = e => presenterGo(Number(e.target.value));
  $id('presenter-lock').onclick = () => presenterStop();
  $id('presenter-pause').onclick = () => presenterPause();
  $id('presenter-compact').onclick = () => { PRESENTER.compact = !PRESENTER.compact; renderPresenter(); $id('presenter-compact').focus(); };
  $id('presenter-notes').onclick = () => { PRESENTER.notes = !PRESENTER.notes; $id('presenter-note').hidden = !PRESENTER.notes; $id('presenter-notes').setAttribute('aria-expanded', String(PRESENTER.notes)); };
  $id('presenter-full').onclick = presenterFullscreen;
  if ($id('presenter-light')) $id('presenter-light').onclick = () => { if (presenterRequireAccess()) toggleDay(); };
  if ($id('presenter-interior')) $id('presenter-interior').onclick = presenterInterior;
  if ($id('presenter-resource')) $id('presenter-resource').onclick = () => { if (presenterRequireAccess()) s.action === 'research' ? openResearch() : openSources(); };
  $id('presenter-title').focus({ preventScroll: true });
}
function presenterNext() {
  if (!presenterRequireAccess() || G.busy) return;
  if (PRESENTER.step < PRESENTER_STEPS.length - 1) return presenterGo(PRESENTER.step + 1);
  presenterPause(true);
  openModal(`<h2>Apresentação concluída</h2><p>Você percorreu ${PRESENTER_STEPS.length} etapas em ${presenterFormatTime(presenterClock())}.</p><p>Qual futuro sua comunidade quer construir?</p><div class="row presenter-actions"><button class="btn primary" id="presenter-finish">Sair e bloquear</button><button class="btn" id="presenter-restart">Recomeçar roteiro</button></div>`);
  $id('presenter-finish').onclick = () => presenterStop();
  $id('presenter-restart').onclick = () => { if (!presenterRequireAccess()) return; PRESENTER.elapsed = 0; PRESENTER.runningSince = Date.now(); presenterGo(0); };
}
function presenterPause(forcePause = false) {
  if (!presenterRequireAccess() || !PRESENTER.active) return;
  const now = Date.now();
  if (PRESENTER.runningSince !== null) { PRESENTER.elapsed = presenterClock(now); PRESENTER.runningSince = null; }
  else if (!forcePause) PRESENTER.runningSince = now;
  const b = $id('presenter-pause');
  if (b) { b.textContent = PRESENTER.runningSince === null ? 'Retomar' : 'Pausar'; b.setAttribute('aria-pressed', String(PRESENTER.runningSince === null)); }
  presenterTick();
}
async function presenterInterior() {
  if (!presenterRequireAccess() || !PRESENTER.active || !G.booted || G.busy) return;
  const index = PRESENTER.step, s = PRESENTER_STEPS[index];
  if (!s.enter) return;
  if (G.in) { leaveInterior(); setMode('orbit'); flyTo(s.place, { r: s.r, ph: s.ph, dth: s.dth }); }
  else {
    const p = places.find(p => p.int === s.enter); if (!p) return;
    const d = p.doors[0] || { x: p.cx, z: p.cz, ry: 0 };
    await enterBuilding(s.enter, { x: d.x, z: d.z, ry: d.ry, key: p.key });
    // A sessão pode terminar durante a transição assíncrona do interior.
    if (!PRESENTER.active || !presenterHasAccess()) { leaveInterior(); setMode('orbit'); return; }
  }
  if (G.in) PRESENTER.compact = true;
  renderPresenter();
}
async function presenterFullscreen() {
  if (!presenterRequireAccess()) return;
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if ($id('app').requestFullscreen) await $id('app').requestFullscreen();
    else toast('Tela cheia indisponível neste navegador. Use a rotação do aparelho para ampliar a cena.');
  } catch (e) { toast('Não foi possível ativar a tela cheia neste navegador.'); }
}
function presenterOptions() {
  if (!presenterRequireAccess()) return;
  openModal(`<h2>Apresentação em andamento</h2><p>O cronômetro pode ser pausado sem encerrar o roteiro.</p><div class="presenter-actions"><button class="btn primary" id="presenter-continue">Continuar</button><button class="btn" id="presenter-options-pause">${PRESENTER.runningSince === null ? 'Retomar' : 'Pausar'} cronômetro</button><button class="btn" id="presenter-options-lock">Sair e bloquear</button></div>`);
  $id('presenter-continue').onclick = closeModal;
  $id('presenter-options-pause').onclick = () => { presenterPause(); closeModal(); };
  $id('presenter-options-lock').onclick = () => presenterStop();
}
function presenterStop(message = 'Modo apresentador encerrado e bloqueado.') {
  PRESENTER.active = false; PRESENTER.expiresAt = 0; PRESENTER.runningSince = null;
  delete document.documentElement.dataset.presenting;
  $id('presenter-stage')?.classList.add('hidden');
  closeModal();
  if (G.booted) {
    // Não altere G.busy: uma transição pendente fará sua própria limpeza.
    if (!G.busy) startExplore();
    G.tGoal = PRESENTER.previousDay ?? G.tGoal;
    METRO.autoDay = PRESENTER.previousAutoDay ?? METRO.autoDay;
  }
  if (G.booted) $id('c')?.focus();
  else $id('presenter-fallback')?.focus();
  toast(message);
}
function presenterTick() {
  if (!PRESENTER.active) return;
  if (!presenterHasAccess()) { presenterStop('Sessão expirada. Entre com o token para apresentar novamente.'); return; }
  const el = $id('presenter-clock'); if (el) el.textContent = presenterFormatTime(presenterClock());
}
function presenterKeydown(e) {
  if (!PRESENTER.active || modalOpen || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.target?.closest?.('input,textarea,select,[contenteditable="true"]')) return;
  const action = { ArrowLeft: () => presenterGo(PRESENTER.step - 1), PageUp: () => presenterGo(PRESENTER.step - 1),
    ArrowRight: presenterNext, PageDown: presenterNext, KeyP: presenterPause, KeyF: presenterFullscreen, Escape: presenterOptions }[e.code];
  if (!action) return;
  e.preventDefault(); e.stopImmediatePropagation();
  if (!e.repeat) action();
}
function presenterReady() {
  if (location.hash === '#apresentador') openPresenter();
}
function initPresenter() {
  if (PRESENTER.initialized) return;
  PRESENTER.initialized = true;
  const stage = document.createElement('div'); stage.id = 'presenter-stage'; stage.className = 'hidden'; $id('app').appendChild(stage);
  const fallback = document.createElement('button'); fallback.id = 'presenter-fallback'; fallback.className = 'btn'; fallback.textContent = 'Modo apresentador em texto'; fallback.onclick = openPresenter; $id('err').firstElementChild.appendChild(fallback);
  addEventListener('keydown', presenterKeydown, true);
  document.addEventListener('visibilitychange', presenterTick);
  addEventListener('pagehide', () => { PRESENTER.expiresAt = 0; PRESENTER.active = false; PRESENTER.runningSince = null; delete document.documentElement.dataset.presenting; stage.classList.add('hidden'); });
  PRESENTER.timer = setInterval(presenterTick, 500);
}
