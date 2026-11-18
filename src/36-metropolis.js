/* Planta compartilhada entre geometria, colisão, mapa e navegação. */
const DISTRICTS=[['N’Kanda','Centro metropolitano',0,'conselho'],['Ubuntu','Comunidade',45,'vizinhanca'],['Sankofa','Memória e história',90,'museu'],['Wakanda Verde','Parque ecológico',135,'sustent'],['Maat','Ciência e universidade',180,'inovacao'],['Kemet','Cultura e artes',225,'cultural'],['Nzinga','Indústria circular',270,'sustent'],['Dandara','Agricultura e território rural',315,'horta']].map(([name,description,deg,key],i)=>({name,description,deg,key,i,x:polar(deg,300)[0],z:polar(deg,300)[1],buildings:[]}));
const METRO={region:null,trip:null,weather:'clear',plots:[0,0,0,0],harvest:0,events:[],clock:9,groups:[],doors:[],targets:[],last:0,autoDay:true,plants:[],registered:false};
try{const s=JSON.parse(localStorage.getItem('vila.metro')||'{}');METRO.harvest=Math.max(0,+s.harvest||0);METRO.events=Array.isArray(s.events)?s.events:[];if(Array.isArray(s.plots)&&s.plots.length===4)METRO.plots=s.plots.map(x=>Number.isFinite(x)&&x>0?x:0);}catch(e){}
function saveMetro(){try{localStorage.setItem('vila.metro',JSON.stringify({plots:METRO.plots,harvest:METRO.harvest,events:METRO.events}));}catch(e){toast('Armazenamento local indisponível.');}}
function registerMetropolis(){if(METRO.registered)return;METRO.registered=true;ROADS.streets=[];ROADS.rings.push({id:'metropolitano',r0:292,r1:308,sw:3});ROADS.rings.push({id:'distribuidor',r0:157,r1:163,sw:2});ROADS.rings.push({id:'parque-metropolitano',r0:550,r1:570,sw:3});ROADS.avenues[0].r1=560;}
function metroStreet(a,b,w=6){const L=Math.hypot(b[0]-a[0],b[1]-a[1]);W0.box('asfalto',w,.125,L,(a[0]+b[0])/2,0,(a[1]+b[1])/2,Math.atan2(b[0]-a[0],b[1]-a[1]));ROADS.streets.push({a,b,w,sw:1.5});}
const BUILDING_TYPES={home:['Residência','Moradia e convivência'],office:['Torre comunitária','Trabalho e administração'],lab:['Laboratório','Pesquisa e inovação'],university:['Universidade','Ensino e pesquisa'],clinic:['Hospital','Saúde comunitária'],restaurant:['Restaurante','Alimentação e cultura'],shop:['Mercado','Comércio local'],culture:['Centro cultural','Artes e memória'],factory:['Oficina circular','Produção e recuperação'],greenhouse:['Estufa','Cultivo e biodiversidade'],station:['Estação','Mobilidade integrada'],spaceport:['Porto espacial','Exploração espacial simulada']};
function buildMetropolis(){
 registerSpaceInterior();
 for(const d of DISTRICTS){metroStreet(polar(d.deg+22.5,160),polar(d.deg+22.5,560),12);const p=polar(d.deg+22.5,585);const c=new Ctx(cityB,p[0],p[1],(d.deg+22.5)*PI/180);c.box('pPedra',24,.1,18,0,0,0);for(const side of [-1,1]){bench(c,side*7,0,side*PI/2,3);c.col(side*7,0,.7,3);}sign(c,'PARQUE METROPOLITANO',0,2,-5,8,1,0);pavedLink(polar(d.deg+22.5,573),[p[0],p[1]],3,true);METRO.targets.push({x:p[0],z:p[1],label:'Parque metropolitano',action:openActivities});}

 for(const d of DISTRICTS){metroStreet(polar(d.deg,160),polar(d.deg,300),12);}

 DISTRICTS.forEach(d=>{
  const dc=new Ctx(cityB,d.x,d.z,d.deg*PI/180),batch=new Batch(),c=new Ctx(batch,0,0,0,0,EXT.cols),group=new T.Group();
  // Passeios são desenhados primeiro, para que nenhuma calçada cruze a pista.
  for(const depth of [8,35,61,87,113,139,165,191]){const a=dc.w2(-47,depth),b=dc.w2(47,depth);dc.box('calcada',94,.03,14,0,0,depth);metroStreet(a,b,10);}
  dc.box('calcada',16,.03,207,0,0,106.5);metroStreet(dc.w2(0,3),dc.w2(0,210),12);
  sign(W0,d.name.toUpperCase()+'\n'+d.description,...[d.x,4,d.z],12,2.4,d.deg*PI/180+PI,{bg:'#123832',fg:'#EED9A8'});
  const kinds=[['office','office','clinic','shop'],['home','home','restaurant','home'],['culture','culture','home','shop'],['greenhouse','lab','home','culture'],['lab','university','clinic','spaceport'],['culture','restaurant','culture','shop'],['factory','factory','lab','station'],['greenhouse','home','factory','shop']][d.i];
  for(let row=0;row<7;row++)for(let col=0;col<4;col++){
   const xx=[-36,-18,18,36][col],zz=22+row*26,[x,z]=dc.w2(xx,zz),type=kinds[(col+row)%4],id='metro_'+d.i+'_'+row+'_'+col,ry=d.deg*PI/180+PI;
   const height=type==='office'?32+row*7+col*4:type==='university'?18:type==='home'?9.8:10.2+row*2;
   const p={i:places.length,key:id,type,district:d.i,x,z,cx:x,cz:z,ry,W:12,D:14,H:height,r:9,lblY:height+1,int:id,doors:[{x:x+Math.sin(ry)*7,z:z+Math.cos(ry)*7,ry,int:id}],access:[],metro:true,gridX:xx,gridZ:zz};places.push(p);d.buildings.push(p);
   const title=BUILDING_TYPES[type][0]+' '+d.name+' '+(row*4+col+1);INFO[id]={t:title,sub:BUILDING_TYPES[type][1],q:'Espaço ficcional explorável do distrito '+d.name+'. Entre pela porta para conhecer seus ambientes e interações.',b:['A','P'],a:['Projeto original da metrópole; não é reprodução de um edifício histórico.','A implantação conecta o edifício ao passeio e ao transporte público.','Ambientes internos mobiliados e acessíveis por elevador.','Materiais terrosos, madeira e geometrias originais com acabamento contemporâneo.','Energia solar e gestão compartilhada de recursos são propostas desta simulação.','O espaço participa da rotina de moradores com identidades fictícias.','Tecnologias e indicadores são educativos; não representam medições reais.','Explore os objetos com a tecla E e compartilhe suas observações.'],refl:['Como este espaço pode servir melhor à comunidade?'],g:[],s:[]};SHORT[id]=BUILDING_TYPES[type][0];PRI[id]=1;INT[id]=I=>buildIndividualInterior(I,p);registerMetroContent(p);
   const bc=new Ctx(batch,x,z,ry,0,EXT.cols),mat=['terra','rebocoT','ocre','rebocoB'][(row+col+d.i)%4];
   // A envoltória segue as mesmas dimensões, níveis e vãos da planta interna.
   const levels=type==='office'?[0,Math.round(height/3),Math.round(height*2/3),height-3.7]:height>=12?[0,3.9,7.8]:[0,4.2];p.levels=levels;
   bc.box(mat,12,height,.3,0,.1,-7);bc.box(mat,.3,height,14,-6,.1,0);bc.box(mat,.3,height,14,6,.1,0);
   bc.box(mat,5.1,height,.3,-3.45,.1,7);bc.box(mat,5.1,height,.3,3.45,.1,7);bc.box(mat,1.8,height-2.7,.3,0,2.8,7);
   bc.col(-3.45,7,5.1,.3);bc.col(3.45,7,5.1,.3);bc.col(0,-7,12,.3);bc.col(-6,0,.3,14);bc.col(6,0,.3,14);
   levels.forEach((floor,index)=>{bc.box('concE',12,.18,14,0,floor,0);for(const side of [-1,1])for(const wx of [-3.7,3.7])bc.box('vidroT',1.6,1.6,.05,wx,floor+1.15,side*7.17);});
   for(const floor of levels){for(const side of [-1,1])for(const wx of [-3.7,3.7]){for(const off of [-.86,.86])bc.box('aco',.08,1.8,.14,wx+off,floor+1.05,side*7.22);bc.box('aco',1.8,.08,.14,wx,floor+1.05,side*7.22);bc.box('concE',2,.12,.4,wx,floor+1,side*7.2);}}
   for(const side of [-1,1]){bc.cyl('aco',.055,.055,height,side*5.85,.1,-7.22,8);bc.box('aco',12,.12,.25,0,height,-7.15);}bc.box('concE',12,.3,.5,0,.1,7.2);bc.box('metalP',2,.06,.7,0,.2,7.6);
   bc.box('terra',12.7,.35,14.7,0,height-.4,0);bc.box('concE',12.8,.25,14.8,0,height+.1,0);pvArray(bc,0,height+.4,0,9,10,3,2,.1);for(const side of [-1,1]){bc.box('madeiraE',.15,2.8,.15,side*5.4,.1,8.7);bc.box('madeira',5,.12,2,side*3.3,2.9,8);bc.box('friso',2.2,.5,.06,side*3.5,2.1,7.25);bc.box('terraSolo',2,.25,.5,side*4.2,.2,7.8);for(let k=0;k<4;k++)bc.sph('fB',.25,side*4.2+(k-1.5)*.35,.65,7.8,1,.8,1,8);}
   const dcDoor=new Ctx(batch,x,z,ry);for(const side of [-1,1])dcDoor.box('madeiraE',.12,2.7,.18,side*.96,.1,7.05);dcDoor.box('madeiraE',2.04,.12,.18,0,2.68,7.05);bc.box('concE',3,.15,2,0,2.9,7.4);
   const hinge=new T.Group();const hp=bc.w2(-.9,7.08);hinge.position.set(hp[0],.1,hp[1]);hinge.rotation.y=ry;const door=new T.Mesh(new T.BoxGeometry(1.8,2.5,.08),M('madeira'));door.position.set(.9,1.25,0);hinge.add(door);scene.add(hinge);METRO.doors.push({p,mesh:hinge,open:0});
   sign(W0,String(row*4+col+1).padStart(2,'0'),p.doors[0].x+Math.cos(ry)*1.5,2,p.doors[0].z-Math.sin(ry)*1.5, .65,.4,ry);
   assignBuildingIdentity(p);decorateDistinctBuilding(bc,p);buildIdentityDetails(bc,p);INFO[id].a[0]+=' '+p.context.text;INFO[id].s.push(p.context.source);
   const a=dc.w2(xx,zz-7),b=dc.w2(xx,zz-14);pavedLink(a,b,2.6,true);
   const hit=new T.Mesh(new T.BoxGeometry(12,height,14),new T.MeshBasicMaterial({visible:false}));hit.position.set(x,height/2,z);hit.rotation.y=ry;hit.layers.set(1);hit.userData.pi=p.i;pickG.add(hit);
  }
  for(const side of [-1,1])for(let zz=12;zz<205;zz+=12){const [x,z]=dc.w2(side*52,zz);treeAt(x,z,1.15);lampPost(...dc.w2(side*6,zz),d.deg*PI/180);}
  batch.build(group);scene.add(group);METRO.groups.push({group,d});
  const [px,pz]=dc.w2(0,4);METRO.targets.push({x:px,z:pz,label:'Estação '+d.name,action:()=>openTransit(d.i)});
 });
 buildLivingWorld();buildPublicSpaces();buildNeighborhoodServices();buildRegionalTransport();buildTrafficRules();buildClimate();
}
function openMetropolis(){openAtlas();}
function travelDistrict(i){const d=DISTRICTS[i];if(!d)return;closeModal();closeCard();beforeTravel();endTheme();tourClear();if(G.in)leaveInterior();setMode('orbit');METRO.region=d;G.fly={a:{...view},b:{x:d.x,y:5,z:d.z,r:150,th:d.deg*PI/180+PI,ph:1.05},t:0,d:G.reduceMotion?.01:3};toast(d.name+' · '+d.description);}
function walkDistrict(){const d=METRO.region;if(!d)return goWalkFromOrbit();closeModal();if(G.in)leaveInterior();G.P={x:d.x,y:0,z:d.z,yaw:d.deg*PI/180+PI,pitch:0,lv:0,bob:0};setMode('fp');}
function nearestDistrict(x,z){return DISTRICTS.reduce((a,b)=>Math.hypot(x-b.x,z-b.z)<Math.hypot(x-a.x,z-a.z)?b:a,DISTRICTS[0]);}
function updateMetropolis(dt){
 METRO.clock=(METRO.clock+dt/120)%24;if(METRO.autoDay)G.tGoal=cl((Math.cos((METRO.clock-1)*TAU/24)+.15)*1.2,0,1);
 if(G.in)return;updateLivingWorld(dt);updateTrafficRules();updateClimate(dt);METRO.groups.forEach(({group,d})=>group.visible=Math.hypot(cam.position.x-d.x,cam.position.z-d.z)<(G.effectiveQuality==='low'?400:750));
 METRO.doors.forEach(d=>{d.open=lerp(d.open,(!G.in&&Math.hypot(G.P.x-d.p.doors[0].x,G.P.z-d.p.doors[0].z)<3)||G.in?.id===d.p.int?1:0,Math.min(1,dt*4));d.mesh.rotation.y=d.p.ry+d.open*PI*.45;});
}
