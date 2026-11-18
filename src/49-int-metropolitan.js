/* Interiores sob demanda com identidade por edifício e controles funcionais. */
const HOME_STATE={};
function registerMetroContent(p){const levels=p.type==='office'?3:2;for(let lv=0;lv<levels;lv++)for(const [id,title] of [['lift','Elevador'],['light','Iluminação'],['screen','Terminal comunitário'],['object','Atividades'],['door','Porta articulada']])HOT[p.key+'_'+id+lv]={t:title+' · '+INFO[p.key].t,q:'Interação do pavimento '+(lv+1)+'.',d:'Entre neste edifício e use E junto ao objeto. Esta é uma proposta ficcional da metrópole.',b:['P'],s:[]};}

function metroHot(I,p,id,title,x,z,lv,run){const key=p.key+'_'+id;HOT[key]={t:title,q:'Interação funcional deste ambiente ficcional.',d:'Use o controle para experimentar o sistema. Dados são locais a esta visita.',b:['P'],ask:'Como esta tecnologia pode melhorar a vida cotidiana?',s:[],run};I.hot(key,x,z,1.1,{lv,r:2.6});}
function buildMetroInterior(I,p){
 I.name=INFO[p.key].t;I.H=3.5;I.lvY=p.levels||[0,3.8];const home=p.type==='home',lab=['lab','university','factory'].includes(p.type),state=HOME_STATE[p.key]||(HOME_STATE[p.key]={lights:true,screen:true});
 for(let lv=0;lv<I.lvY.length;lv++){
  const y=I.y(lv),names=home?(lv?['Escritório','Quarto','Varanda','Quarto de hóspedes']:['Sala','Cozinha','Quarto','Banheiro']):p.type==='clinic'?['Recepção','Consultório','Pesquisa em saúde','Sala de cuidado']:p.type==='restaurant'?['Salão','Cozinha','Horta de temperos','Convivência']:p.type==='greenhouse'?['Cultivo','Hidroponia','Sementes','Monitoramento']:lab?['Estudo','Laboratório','Oficina','Sala de projetos']:['Recepção','Exposição','Biblioteca','Reunião'];
  I.room('Circulação e elevador',-1.5,-7,1.5,7,{lv,f:'pEsc'});
  const areas=[[-6,1,-1.5,7],[1.5,1,6,7],[-6,-7,-1.5,1],[1.5,-7,6,1]];
  areas.forEach((a,i)=>I.room(names[i],...a,{lv,f:home?'pMad':'pConc',tint:lv%2?'gTur':'gLuz'}));
  I.perim(-6,-7,6,7,{lv,m:p.district%2?'rebocoT':'rebocoB',doors:lv?{}:{s:[[0,1.8]]},wins:{n:[[-3.7,1.6],[3.7,1.6]],e:[[-3,2],[4,2]],w:[[-3,2],[4,2]]}});
  [-1.5,1.5].forEach(x=>I.wz(x,-7,7,{lv,doors:[[-3,1.4],[4,1.4]]}));I.wx(1,-6,-1.5,{lv});I.wx(1,1.5,6,{lv});
  if(home){I.sofa(-4.6,5.8,2.2,PI,'tecidoT',lv);I.table(-4,3.7,1.5,.8,.55,0,'madeira',lv);I.kitchenRow(5.4,4,4,-PI/2,lv);I.bedF(-4,-4.5,0,lv,1.5);I.toilet(5,-5.5,-PI/2,lv);I.basin(5,-3,-PI/2,lv);I.desk(-4,1.8,1.4,0,lv);}
  else{for(const x of [-4,4])for(const z of [-4,4]){I.desk(x,z,1.6,0,lv);I.chair(x,z+.9,PI,lv);}I.sofa(-4.4,6,2,PI,'tecidoO',lv);if(p.type==='clinic')I.bedF(4,-5,0,lv,1.2);if(p.type==='greenhouse')for(let z=-5;z<6;z+=2)I.plant(5,z,1.2,lv);if(['culture','shop'].includes(p.type))I.shelf(-5.7,-4,3,PI/2,4,2,lv);}
  I.plant(-5.2,6.2,1,lv);I.plaque(names[0]+' · '+(lv+1)+'º nível','Geometrias originais, materiais naturais e tecnologia comunitária.',-4,1.4,1.17,0,2.8,.7,{lv});
  I.screen(0,1,-6.8,0,1.2,.7,'ELEVADOR','E para escolher o nível',{lv});
  metroHot(I,p,'lift'+lv,'Elevador',0,-5.4,lv,()=>openElevator(I));
  metroHot(I,p,'light'+lv,'Iluminação do ambiente',0,4.5,lv,()=>{state.lights=!state.lights;I.g.traverse(o=>{if(o.isPointLight)o.intensity=state.lights?1.1:.08;});toast(state.lights?'Iluminação ligada':'Iluminação reduzida');});
  metroHot(I,p,'screen'+lv,home?'Computador doméstico':'Terminal comunitário',-3,2.5,lv,()=>openInnovation());
  metroHot(I,p,'object'+lv,p.type==='spaceport'?'Navegação orbital':p.type==='greenhouse'?'Cultivo hidropônico':'Mesa de atividades',3,2.5,lv,()=>p.type==='spaceport'?openSpaceport():p.type==='greenhouse'?openFarm():openActivities());
  // Porta interna articulada: a malha e o colisor mudam juntos.
  const hinge=new T.Group();hinge.position.set(-1.5,y,3.3);const door=new T.Mesh(new T.BoxGeometry(.08,2.5,1.35),M('madeira'));door.position.set(0,1.25,.675);hinge.add(door);I.g.add(hinge);let opened=true;hinge.rotation.y=PI/2;const col={cx:-1.5,cz:4,hw:.1,hd:.7,c:1,s:0,lv};
  metroHot(I,p,'door'+lv,'Abrir ou fechar porta',-.3,3.6,lv,()=>{if(!opened&&Math.hypot(G.P.x+1.5,G.P.z-4)<1)return;opened=!opened;hinge.rotation.y=opened?PI/2:0;if(opened){const i=I.cols.indexOf(col);if(i>=0)I.cols.splice(i,1);}else I.cols.push(col);toast(opened?'Porta aberta':'Porta fechada');});
 }
 const variation=p.designVariant||0;if(p.type==='culture'){for(let i=0;i<3;i++){I.seat(-4,2+i*1.1,1.5,PI/2);I.plant(4,2+i*1.1,.7);}}else if(p.type==='university'){I.table(4,5,2,1,.75);I.chair(3,5,PI/2);I.chair(5,5,-PI/2);}I.rug(-3.7,4,2.4,2.8,['tecido','tecidoT','tecidoO','tecidoV','pMad'][variation]);
 const ctx=p.context||CULTURAL_CONTEXT[p.district];I.plaque(ctx.title,ctx.text,0,1.3,6.8,PI,2.2,1.1,{fs:16});metroHot(I,p,'context','Referência cultural',0,5,0,()=>openCulturalContext(p));
 I.exitAt(0,6.4,1.6).spawnAt(0,5.7,0);
 I.liftCabin=new T.Mesh(new T.BoxGeometry(2.4,.12,2),M('aco'));I.liftCabin.position.set(0,.03,-5.5);I.g.add(I.liftCabin);
 if(I.lvY[1]===3.8){I.stairs(-1.2,-2,1.2,2,'n',0);}
}
function openElevator(I){openModal(`<h2>Elevador</h2><p>Escolha um nível.</p><div class="row">${I.lvY.map((y,i)=>`<button class="btn" data-floor="${i}">${i===0?'Térreo':i===I.lvY.length-1?'Pavimento superior':'Pavimento intermediário'}</button>`).join('')}</div>`);document.querySelectorAll('[data-floor]').forEach(b=>b.onclick=()=>{closeModal();G.lift={I,from:G.P.y,to:I.y(+b.dataset.floor),lv:+b.dataset.floor,t:0};G.P.x=0;G.P.z=-5.4;G.keys={};});}
function updateElevator(dt){if(!G.lift)return false;const l=G.lift;if(G.in!==l.I){G.lift=null;return false;}l.t=Math.min(1,l.t+dt/2);const t=l.t*l.t*(3-2*l.t);G.P.y=lerp(l.from,l.to,t);l.I.liftCabin.position.y=G.P.y+.03;cam.position.set(G.P.x,G.P.y+1.62,G.P.z);cam.rotation.set(0,G.P.yaw,0,'YXZ');if(l.t===1){G.P.lv=l.lv;G.P.y=l.to;G.lift=null;G.room=l.I.roomAt(G.P.x,G.P.z,G.P.lv);updateWhere();}return true;}
