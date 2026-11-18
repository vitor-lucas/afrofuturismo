/* Serviços de bairro com presença no cenário e ações acessíveis pela tecla E. */
const NEIGHBORHOOD={read:new Set(),repairs:0};
try{const s=JSON.parse(localStorage.getItem('vila.neighborhood')||'{}');NEIGHBORHOOD.repairs=+s.repairs||0;NEIGHBORHOOD.read=new Set(Array.isArray(s.read)?s.read:[]);}catch(e){}
function saveNeighborhood(){try{localStorage.setItem('vila.neighborhood',JSON.stringify({read:[...NEIGHBORHOOD.read],repairs:NEIGHBORHOOD.repairs}));}catch(e){}}
function openNeighborhoodService(kind,d){
 if(kind==='library'){openModal(`<h2>Biblioteca de troca · ${esc(d.name)}</h2><p>Escolha uma leitura do acervo educativo.</p><div class="grid">${['museu','biblioteca','cultural','sustent'].map(k=>`<button class="gl" data-shelf="${k}">${esc(INFO[k].t)} ${NEIGHBORHOOD.read.has(k)?'· consultado':''}</button>`).join('')}</div>`);document.querySelectorAll('[data-shelf]').forEach(b=>b.onclick=()=>{NEIGHBORHOOD.read.add(b.dataset.shelf);saveNeighborhood();openReader(b.dataset.shelf);});return;}
 if(kind==='repair'){openModal(`<h2>Oficina de bicicletas · ${esc(d.name)}</h2><p>Faça a checagem educativa de segurança antes de pedalar.</p><label><input id="repair-tires" type="checkbox"> Pneus e rodas conferidos</label><p><label><input id="repair-brakes" type="checkbox"> Freios conferidos</label></p><label><input id="repair-lights" type="checkbox"> Luzes e sinalização conferidas</label><p><button class="btn" id="repair-finish">Concluir revisão</button></p><p>${NEIGHBORHOOD.repairs} revisões registradas neste navegador.</p>`);$id('repair-finish').onclick=()=>{if(!['repair-tires','repair-brakes','repair-lights'].every(id=>$id(id).checked))return toast('Confira os três itens antes de concluir.');NEIGHBORHOOD.repairs++;saveNeighborhood();closeModal();toast('Revisão registrada. Bicicleta pronta para a próxima visita.');};return;}
 if(kind==='water'){openModal(`<h2>Ponto de água · ${esc(d.name)}</h2><p>Abastecimento comunitário e uso responsável da água.</p><button class="btn" id="water-refill">Encher garrafa reutilizável</button><button class="btn" id="water-learn">Conhecer o ciclo da água</button>`);$id('water-refill').onclick=()=>{$id('water-refill').disabled=true;$id('water-refill').textContent='Garrafa abastecida';toast('Abastecimento simulado concluído.');};$id('water-learn').onclick=()=>openReader('reservatorio');return;}
 openEvents();
}
function buildNeighborhoodServices(){
 for(const d of DISTRICTS){const c=new Ctx(cityB,d.x,d.z,d.deg*PI/180,0,EXT.cols);
 // Praça lateral acessível por passeio, fora do eixo de circulação.
 c.box('pPedra',17,.08,17,70,0,50);const start=c.w2(48,61),end=c.w2(70,58);pavedLink(start,end,3,true);
 for(const [x,z,ry] of [[64,45,PI/2],[76,45,-PI/2],[64,54,PI/2],[76,54,-PI/2]]){bench(c,x,z,ry,2);c.col(x,z,.7,2);}
 c.cyl('conc',1.6,1.9,.45,70,.08,50,24);c.cyl('agua',1.4,1.4,.03,70,.54,50,32);c.col(70,50,3.8,3.8);
 const kinds=[['library',64,57,'BIBLIOTECA DE TROCA'],['repair',77,57,'OFICINA DE BICICLETAS'],['water',76,49,'ÁGUA COMUNITÁRIA'],['events',64,49,'AGENDA DO BAIRRO']];
 for(const [kind,x,z,title] of kinds){const p=c.w2(x,z);METRO.targets.push({x:p[0],z:p[1],label:title,action:()=>openNeighborhoodService(kind,d)});c.box('madeiraE',1.5,1.5,.5,x,.15,z);c.col(x,z,1.5,.5);sign(c,title,x,1.3,z+.26,2,.45,0,{bg:'#19392C',fg:'#EED9A8'});if(kind==='library'){for(let i=0;i<9;i++)c.box(['tecidoO','tecidoT','terra'][i%3],.1,.32,.24,x-.6+i*.15,.5,z+.2);}if(kind==='water')c.cyl('aco',.08,.08,.25,x,1.65,z,8);}
 bins(c,79,44);c.col(79,44,1.8,.5);const p=c.w2(70,42);lampPost(p[0],p[1],0,5);
 // Guarda-sóis e mesas de encontro, com suporte completo.
 for(const x of [65,75]){c.cyl('metalP',.05,.08,2.7,x,.08,64,8);c.cone('tecidoO',2.4,.65,x,2.7,64,12,0);c.cyl('madeira',.85,.85,.08,x,.8,64,20);c.cyl('metalP',.1,.12,.8,x,0,64,8);c.col(x,64,1.7,1.7);}
 }
}
