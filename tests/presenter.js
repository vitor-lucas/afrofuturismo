const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');
const token = 'AFRO-' + crypto.randomBytes(24).toString('base64url');
const hash = crypto.createHash('sha256').update(token).digest('hex');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
let checks = 0;
function check(value, message) { assert.ok(value, message); checks++; }

function environment() {
  const d = new JSDOM(fs.readFileSync('src/00-shell.html', 'utf8'), { url: 'https://example.test/afrofuturismo/', runScripts: 'outside-only' });
  const w = d.window;
  const e = js => vm.runInContext(js, d.getInternalVMContext());
  let now = 1000000;
  w.Date.now = () => now;
  Object.defineProperty(w, 'crypto', { value: { subtle: crypto.webcrypto.subtle }, configurable: true });
  w.TextEncoder = TextEncoder;
  e(`
    var calls=[], $id=id=>document.getElementById(id), esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    var IC={eye:'',tour:'',info:'',map:'',book:'',play:''};
    var G={booted:true,busy:false,mode:'orbit',in:null,tGoal:0,keys:{}};
    var METRO={autoDay:true}, ATLAS={}, EXPERIENCE={}, TRANSIT={}, modalOpen=false, view={}, places=[];
    var PRESENTER_ACCESS={tokenHash:'${hash}',sessionMs:7200000};
    function openModal(html,onClose){$id('mbox').innerHTML='<button id="mx">Fechar</button>'+html;$id('modal').classList.remove('hidden');modalOpen=true;G.modalClose=onClose;$id('mx').onclick=closeModal;return $id('mbox');}
    function closeModal(){$id('modal').classList.add('hidden');modalOpen=false;var f=G.modalClose;G.modalClose=null;if(f)f();}
    function toast(s){calls.push(['toast',s]);}
    function startExplore(){calls.push(['explore']);closeModal();G.in=null;G.mode='orbit';}
    function flyTo(p,o){calls.push(['fly',p]);}
    function leaveInterior(){calls.push(['leave']);G.in=null;}
    function setMode(m){G.mode=m;}
    var enterDelay=0;
    async function enterBuilding(id){G.busy=true;await new Promise(r=>setTimeout(r,enterDelay));G.in={name:id};G.mode='fp';G.busy=false;}
    function toggleDay(){G.tGoal=G.tGoal?0:1;METRO.autoDay=false;}
    function openResearch(){calls.push(['research']);openModal('<h2>Pesquisas</h2>');}
    function openSources(){calls.push(['credits']);openModal('<h2>Créditos</h2>');}
    function openAtlas(){} function openMap(){} function openThemes(){} function openMobility(){}
    function openGlossary(){} function tourStart(){} function openConcept(){}
  `);
  e(fs.readFileSync('src/54-tour.js', 'utf8'));
  e('places=TOUR.filter(s=>s.enter).map(s=>({key:s.place,int:s.enter,cx:0,cz:0,doors:[]}));');
  e(fs.readFileSync('src/75-presenter.js', 'utf8'));
  const source = fs.readFileSync('src/60-ui.js', 'utf8');
  e(source.slice(source.indexOf('function renderStart()')));
  e('initPresenter(); renderStart();');
  return { d, w, q: id => w.document.getElementById(id), e, advance: ms => { now += ms; } };
}
async function submit(t, value) {
  t.q('presenter-token').value = value;
  t.q('presenter-login').dispatchEvent(new t.w.Event('submit', { bubbles: true, cancelable: true }));
  for (let i = 0; i < 100 && t.q('presenter-submit')?.disabled; i++) await wait(5);
}
async function main() {
  const t = environment();
  try {
    check(t.q('s_presenter'), 'Entrada na tela inicial');
    check(t.w.document.querySelectorAll('#start .btns button').length === 8, 'Menu original preservado');
    t.e('initPresenter()'); check(t.w.document.querySelectorAll('#presenter-stage').length === 1, 'Inicialização idempotente');
    t.e('presenterStart(0)'); check(!t.e('PRESENTER.active') && t.e('modalOpen'), 'Acesso direto exige token');
    await submit(t, 'invalido'); check(!t.e('PRESENTER.active') && t.q('presenter-token').getAttribute('aria-invalid') === 'true', 'Token inválido recusado');
    check(t.q('presenter-token').value === '', 'Campo do token limpo após validação');
    t.q('presenter-show-token').click(); check(t.q('presenter-token').type === 'text', 'Mostrar token');
    t.q('presenter-show-token').click(); check(t.q('presenter-token').type === 'password', 'Ocultar token');
    await submit(t, '  ' + token + '  ');
    check(t.e('PRESENTER.active') && t.w.document.documentElement.dataset.presenting === 'true', 'Token correto inicia apresentação');
    check(t.e('PRESENTER_STEPS.length') === 15, 'Roteiro de quinze etapas');
    check(t.w.localStorage.length === 0 && t.w.sessionStorage.length === 0 && !t.w.location.href.includes(token), 'Token não persiste nem aparece na URL');
    t.advance(5000); t.e('presenterTick()'); check(t.q('presenter-clock').textContent === '00:00:05', 'Cronômetro avança');
    t.q('presenter-pause').click(); t.advance(5000); t.e('presenterTick()'); check(t.q('presenter-clock').textContent === '00:00:05', 'Pausa mantém tempo');
    t.q('presenter-pause').click(); t.advance(2000); t.e('presenterTick()'); check(t.q('presenter-clock').textContent === '00:00:07', 'Botão retoma cronômetro');
    t.q('presenter-next').click(); check(t.e('PRESENTER.step') === 1 && t.e('calls.at(-1)[0]') === 'fly', 'Próxima etapa move câmera');
    t.q('presenter-prev').click(); check(t.e('PRESENTER.step') === 0 && t.q('presenter-prev').disabled, 'Limite inicial do roteiro');
    t.e('presenterGo(-1); presenterGo(100); presenterGo(NaN)'); check(t.e('PRESENTER.step') === 0, 'Índices inválidos recusados');
    let legacyKeys = 0; t.w.addEventListener('keydown', () => legacyKeys++);
    t.w.dispatchEvent(new t.w.KeyboardEvent('keydown', { code: 'ArrowRight', bubbles: true, cancelable: true }));
    check(t.e('PRESENTER.step') === 1 && legacyKeys === 0, 'Atalhos não acionam movimentação do jogo');
    t.w.dispatchEvent(new t.w.KeyboardEvent('keydown', { code: 'ArrowRight', repeat: true, bubbles: true, cancelable: true }));
    check(t.e('PRESENTER.step') === 1, 'Tecla pressionada não salta etapas');
    t.q('presenter-step').dispatchEvent(new t.w.KeyboardEvent('keydown', { code: 'ArrowRight', bubbles: true, cancelable: true }));
    check(t.e('PRESENTER.step') === 1, 'Seleção mantém navegação nativa por teclado');
    t.q('presenter-step').value = '3'; t.q('presenter-step').dispatchEvent(new t.w.Event('change'));
    check(t.e('PRESENTER.step') === 3 && t.q('presenter-interior'), 'Seleção direta do museu');
    await t.e('presenterInterior()'); check(t.e('!!G.in') && t.e('PRESENTER.compact'), 'Visita ao interior recolhe o texto');
    await t.e('presenterInterior()'); check(!t.e('G.in') && t.e('G.mode') === 'orbit', 'Volta ao exterior');
    t.e('G.busy=true; presenterGo(4)'); check(t.e('PRESENTER.step') === 3, 'Não muda destino durante transição'); t.e('G.busy=false');
    t.q('presenter-compact').click(); t.q('presenter-notes').click(); check(!t.q('presenter-note').hidden, 'Roteiro de fala acessível');
    t.q('presenter-notes').click(); check(t.q('presenter-note').hidden, 'Roteiro de fala pode ser ocultado');
    await t.e('presenterFullscreen()'); check(t.e('calls.at(-1)[1]').includes('indisponível'), 'Tela cheia indisponível tem alternativa');
    t.e('presenterGo(13)'); t.q('presenter-resource').click(); check(t.e('calls.at(-1)[0]') === 'research', 'Pesquisa integrada');
    t.e('closeModal();presenterGo(14)'); t.q('presenter-resource').click(); check(t.e('calls.at(-1)[0]') === 'credits', 'Créditos integrados');
    t.e('closeModal(); presenterNext()'); check(t.q('presenter-finish') && t.e('PRESENTER.runningSince') === null, 'Conclusão pausa o relógio');
    t.q('presenter-restart').click(); check(t.e('PRESENTER.step') === 0 && t.e('PRESENTER.elapsed') === 0, 'Recomeçar zera roteiro e relógio');
    t.w.dispatchEvent(new t.w.KeyboardEvent('keydown', { code: 'Escape', bubbles: true, cancelable: true }));
    check(t.q('presenter-options-lock'), 'Escape abre opções'); t.q('presenter-continue').click();
    t.e('G.tGoal=1; METRO.autoDay=false'); t.advance(7200000); t.e('presenterTick()');
    check(!t.e('PRESENTER.active') && !t.e('presenterHasAccess()') && !t.w.document.documentElement.dataset.presenting, 'Expiração encerra e bloqueia');
    check(t.e('G.tGoal') === 0 && t.e('METRO.autoDay'), 'Saída restaura iluminação anterior');
    t.e('presenterGo(5)'); check(t.e('modalOpen') && !t.e('PRESENTER.active'), 'Sessão expirada não navega');
    await submit(t, token); t.e('presenterGo(3); enterDelay=30');
    const pending = t.e('presenterInterior()'); t.e('presenterStop()'); await pending;
    check(!t.e('PRESENTER.active') && !t.e('G.in') && t.e('G.mode') === 'orbit', 'Sair durante transição não deixa interior aberto');
    t.e('openPresenter()'); for (let i = 0; i < 5; i++) await submit(t, 'AFRO-' + 'x'.repeat(32));
    await submit(t, token); check(!t.e('PRESENTER.active') && t.q('presenter-login-status').textContent.includes('Aguarde'), 'Pausa após tentativas inválidas');
    t.advance(30001); await submit(t, token); check(t.e('PRESENTER.active'), 'Tentativas liberadas após intervalo');
    t.e('presenterStop(); G.booted=false; openPresenter()'); await submit(t, token);
    t.e('presenterGo(3)'); check(t.e('PRESENTER.active') && !t.q('presenter-interior'), 'Apresentação em texto funciona sem WebGL');
    t.q('presenter-lock').click(); check(!t.e('presenterHasAccess()') && t.q('presenter-stage').classList.contains('hidden'), 'Sair bloqueia e oculta controles');
    const second = environment(); try { check(!second.e('presenterHasAccess()'), 'Nova página não herda acesso'); } finally { second.d.window.close(); }
    const css = fs.readFileSync('src/00-shell.html', 'utf8');
    check(css.includes('max-width:359px') && css.includes('max-height:500px') && css.includes('env(safe-area-inset-bottom)'), 'Regras para telas pequenas, paisagem e área segura presentes');
  } finally { t.d.window.close(); }
  // Integração com todos os módulos reais e o modal do site, sem renderização GPU.
  const d = new JSDOM(fs.readFileSync('src/00-shell.html', 'utf8'), { url: 'https://example.test/afrofuturismo/#apresentador', runScripts: 'outside-only' });
  try {
    const w = d.window, e = js => vm.runInContext(js, d.getInternalVMContext());
    Object.defineProperty(w, 'crypto', { value: { subtle: crypto.webcrypto.subtle } });
    w.TextEncoder = TextEncoder;
    w.matchMedia = () => ({ matches: false });
    e(fs.readFileSync('vendor/three.min.js', 'utf8'));
    const source = fs.readdirSync('src').filter(n => /^\d\d-.*\.js$/.test(n)).sort().map(n => {
      const s = fs.readFileSync('src/' + n, 'utf8');
      return n === '09-presenter-config.js' ? s.replace(/"tokenHash": "[a-f0-9]+"/, `"tokenHash": "${hash}"`) : s;
    }).join('\n').replace(/boot\(\)\.catch\(e => \{[\s\S]*?\}\);\s*$/, '');
    e(source);
    e('initPresenter();renderStart();presenterReady()');
    const full = { w, q: id => w.document.getElementById(id) };
    check(e('modalOpen') && full.q('presenter-login'), 'Link direto abre o modal real');
    await submit(full, token);
    check(e('PRESENTER.active') && !e('modalOpen'), 'Login funciona com todos os módulos reais');
    e('presenterOptions()'); check(full.q('presenter-continue'), 'Modal real recebe opções do apresentador');
    full.q('presenter-options-lock').click();
    check(!e('PRESENTER.active') && !e('presenterHasAccess()'), 'Bloqueio funciona na aplicação completa');
  } finally { d.window.close(); }
  console.log(`${checks} verificações de apresentação passaram (DOM, token, sessão, roteiro, transições e integração com os módulos reais).`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
