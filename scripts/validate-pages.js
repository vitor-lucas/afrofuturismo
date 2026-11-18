const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist'),html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
assert.ok(/^<!doctype html>/i.test(html),'Falta a página HTML de entrada');assert.ok(html.includes('lang="pt-BR"'));assert.ok(html.includes('Metrópole Afrofuturista'));assert.ok(html.includes('function renderStart()'));assert.ok(html.includes('const MUSEUM_REAL='));assert.ok(html.includes('GLTFLoader'));assert.ok(!html.includes('<!--SCRIPTS-->'));
let scripts=0;for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)){new vm.Script(match[1]);scripts++;}assert.ok(scripts>=2,'Scripts incorporados ausentes');
for(const file of ['downloads/index.html','downloads/vila-afrofuturista.html','downloads/vila-afrofuturista-fontes.zip','downloads/status-100-sugestoes.md'])assert.ok(fs.statSync(path.join(dist,file)).size>0,file+' ausente');
const downloads=fs.readFileSync(path.join(dist,'downloads/index.html'),'utf8');assert.ok(downloads.includes('href="../"'),'Voltar ao site deve respeitar a subpasta do GitHub Pages');assert.ok(!downloads.includes('href="/"'));
assert.equal(fs.readFileSync(path.join(dist,'downloads/vila-afrofuturista.html'),'utf8'),html);console.log(`Pages: entrada, ${scripts} scripts, modelos, imagens, downloads e caminhos relativos conferidos.`);
assert.ok(html.includes('const PRESENTER_ACCESS = Object.freeze('), 'Configuração do apresentador ausente');
assert.ok(html.includes('function initPresenter()') && html.includes('id="s_presenter"'), 'Modo apresentador não integrado');
