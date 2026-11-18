/* Plantas por programa, identificadas individualmente e ligadas à mesma envoltória. */
function buildIndividualInterior(I,p){
 I.name=INFO[p.key].t;I.H=3.6;I.lvY=p.levels||[0,3.8];const seed=p.i,mirror=seed%2?1:-1,split=seed%3===0?-1:1,mat=['pMad','pPedra','pConc','pTur'][seed%4];
 const layouts={home:'domestic',office:'work',lab:'research',university:'learning',clinic:'care',restaurant:'dining',shop:'market',culture:'gallery',factory:'workshop',greenhouse:'cultivation',station:'mobility',spaceport:'orbital'};const program=layouts[p.type]||'gallery';
 for(let lv=0;lv<I.lvY.length;lv++){
  const y=I.y(lv);I.room(program==='gallery'?'Galeria e circulação':'Hall e circulação',-6,-7,6,7,{lv,f:mat,tint:seed%2?'gLuz':'gTur'});I.perim(-6,-7,6,7,{lv,m:['rebocoB','terra','rebocoT','ocre'][seed%4],doors:lv?{}:{s:[[0,1.8]]},wins:{n:[[-3.7,1.6],[3.7,1.6]],e:[[-3,2],[4,2]],w:[[-3,2],[4,2]]}});
  const room=(name,a,b,c,d)=>I.room(name,a,b,c,d,{lv,f:mat,noCeil:true});
  if(program==='domestic'){
   I.wx(split,-6,-1.2,{lv,doors:[[-3,1.4]]});I.wx(split,1.2,6,{lv,doors:[[3,1.4]]});I.wz(mirror*1.5,-7,split,{lv,doors:[[-2,1.4]]});room('Sala e jantar',-6,split,6,7);room('Quarto',-6,-7,mirror*1.5,split);I.sofa(-3.8,5.7,2.5,PI,'tecidoT',lv);I.table(3.5,4,2,1,.75,0,'madeira',lv);I.chair(3.5,5,PI,lv);I.kitchenRow(5.4,-4,4,-PI/2,lv);I.bedF(-4,-4.5,0,lv,1.5);
  }else if(program==='care'){
   I.wz(-1.8,-7,1,{lv,doors:[[-3,1.4]]});I.wz(1.8,-7,1,{lv,doors:[[-3,1.4]]});I.wx(1,-6,-1.5,{lv,doors:[[-3.5,1.4]]});I.wx(1,1.5,6,{lv,doors:[[3.5,1.4]]});for(const x of [-4,4]){I.bedF(x,-4.5,0,lv,1.2);I.desk(x,3,1.5,0,lv);}room('Consultório',-6,-7,-1.5,1);room('Sala de cuidado',1.5,-7,6,1);
  }else if(program==='learning'){
   I.wx(0,-6,6,{lv,doors:[[0,2]]});room('Sala de aula',-6,-7,6,0);room('Biblioteca de estudo',-6,0,6,7);for(const x of [-3.5,3.5])for(const z of [-4.5,-1.8]){I.table(x,z,2,.8,.75,0,'madeira',lv);I.chair(x,z+1,PI,lv);}I.shelf(-5.6,3.5,4,PI/2,5,2.6,lv);I.table(3.4,4,2,1,.75,0,'madeira',lv);
  }else if(program==='dining'||program==='market'){
   I.wz(mirror*2,-7,1,{lv,doors:[[-3,1.5]]});I.kitchenRow(mirror*5.3,-3,5,-mirror*PI/2,lv);for(const x of [-3,3])for(const z of [2.5,5.5]){if(program==='dining'){I.table(x,z,1.4,.9,.75,0,'madeira',lv);I.chair(x-.9,z,PI/2,lv);I.chair(x+.9,z,-PI/2,lv);}else I.shelf(x,z,2,0,3,1.8,lv);}
  }else if(program==='gallery'){
   for(const x of [-3,3])for(const z of [-3.5,2]){I.C.cyl('pedraQ',.6,.7,.7,x,y,z,20);I.C.ico(['cobre','terra','madeira'][seed%3],.5,x,y+1.2,z,1,1.3,1,2);I.colO(x,z,1.4,1.4,0,lv);}I.seat(0,4,3,0,lv);room('Exposição',-6,-7,6,2);
  }else if(program==='cultivation'){
   for(const x of [-4,-2.3,2.3,4])for(let z=-4;z<=4;z+=2){I.C.box('madeira',1,.3,1.4,x,y,z);I.plant(x,z,.7,lv);I.colO(x,z,1,1.4,0,lv);}I.desk(4,5.6,1.5,0,lv);
  }else{
   const rows=program==='workshop'?2:3;for(let row=0;row<rows;row++)for(const side of [-1,1]){const x=side*(program==='research'?3:3.8),z=-4+row*3;I.desk(x,z,program==='workshop'?2.5:1.7,side*PI/2,lv);I.chair(x-side,z,-side*PI/2,lv);}if(program==='mobility')I.sofa(0,4.5,3,PI,'tecidoO',lv);room(program==='research'?'Laboratório':'Atividades',-6,-7,6,2);
  }
  I.screen(0,1,-6.8,0,1.3,.8,'ELEVADOR',String(lv+1)+'º nível',{lv});metroHot(I,p,'lift'+lv,'Elevador',0,-5.4,lv,()=>openElevator(I));metroHot(I,p,'terminal'+lv,'Terminal e referências',0,3.5,lv,()=>openCulturalContext(p));I.plant(-5.2,6,1,lv);
 }
 I.exitAt(0,6.4,1.6).spawnAt(0,5.7,0);I.liftCabin=new T.Mesh(new T.BoxGeometry(2.4,.12,2),M('aco'));I.liftCabin.position.set(0,.03,-5.5);I.g.add(I.liftCabin);I.plaque(p.identity?.name||'IDENTIDADE DO ESPAÇO',BUILDING_TYPES[p.type][1]+' · '+DISTRICTS[p.district].name+' · unidade '+p.i,0,1.4,6.8,PI,2.2,1.1,{fs:15});
}
