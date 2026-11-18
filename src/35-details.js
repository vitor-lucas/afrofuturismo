/* Infraestrutura e detalhes próximos, sem ocupar as pistas conectadas. */
const URBAN={details:[],birds:[],ripples:[],last:-1};
function buildUrbanDetails(){
 // Faixa ciclável contínua, pintada no anel externo e ligada à chegada sul.
 W0.flat('marcaT',ringGeo(103.2,103.4,256),0,.115,0,20);
 for(let z=110;z<137;z+=3)W0.box('marcaT',.16,.008,1.8,3.35,.116,z);
 [0,90,180,270].forEach((deg,i)=>{
  const [x,z]=polar(deg+5,110.5),c=new Ctx(cityB,x,z,deg*PI/180);
  // Abrigos ficam além da calçada; acesso livre pelo lado voltado à pista.
  c.box('pConc',5,.08,2.8,0,.02,1.6);[-2,2].forEach(dx=>c.cyl('metalP',.065,.065,2.7,dx,.1,2.5,8));
  c.box('concE',5,.12,3,0,2.8,1.5);pvArray(c,0,2.93,1.5,4.6,2.5,3,1,.12);bench(c,0,2,PI,2.8);
  c.box('vidroT',4.6,1.6,.06,0,.8,2.65);c.col(0,2.3,4.7,.8);
  sign(c,['SUL · SABERES','LESTE · ÁGUAS','NORTE · MEMÓRIAS','OESTE · COMUNIDADE'][i],0,2.05,0,4,.5,PI,{bg:'#123832',fg:'#C7F4DC'});
  sign(c,'LINHA CIRCULAR\n100% ELÉTRICA',-2.2,1.2,.2,1.1,.8,PI,{bg:'#123832',fg:'#C7F4DC'});
  const [ax,az]=polar(deg,40),street=new Ctx(cityB,ax,az,deg*PI/180);
  const name=['ALAMEDA DOS SABERES','ALAMEDA DAS ÁGUAS','ALAMEDA DAS MEMÓRIAS','ALAMEDA DA COMUNIDADE'][i];
  street.cyl('metalP',.05,.06,2.4,6.8,0,0,8);sign(street,name,6.8,2,0,3,.45,0,{bg:'#123832',fg:'#E8EDDC'});
 });
 // Recarga solar junto ao portal, fora da faixa de circulação.
 const station=new Ctx(cityB,9,113,0,0,EXT.cols);station.box('pConc',4,.08,5,0,0,0);
 [-1.5,1.5].forEach(x=>station.cyl('aco',.07,.07,3.1,x,.08,-1.8,8));station.box('concE',4,.12,4.8,0,3.15,0);pvArray(station,0,3.28,0,3.6,4.3,2,2,.12);
 evCharger(station,0,-1.4,PI);station.col(0,-1.4,.7,.6);sign(station,'RECARGA SOLAR',0,2.5,2.4,3,.45,0,{bg:'#123832',fg:'#C7F4DC'});
 // Números de fachada e acabamento de captação de chuva nas moradias.
 places.filter(p=>['casaPatio','sobrado','vizinhanca'].includes(p.key)).forEach(p=>{
  const c=new Ctx(cityB,p.x,p.z,p.ry),db=new Batch(),dc=new Ctx(db,p.x,p.z,p.ry);
  sign(c,String(p.i+1).padStart(2,'0'),-p.W*.32,2.1,p.D/2+.06,.55,.35,0,{bg:'#123832',fg:'#E8EDDC'});
  dc.box('aco',p.W+.2,.08,.12,0,Math.min(p.H-1,5.8),-p.D/2-.08);
  [-1,1].forEach(s=>dc.cyl('aco',.045,.045,Math.min(p.H-1,5.8),s*(p.W/2-.2),.15,-p.D/2-.12,8));
  // Detalhes de ferragens junto às portas usam as coordenadas reais de cada instância.
  p.doors.forEach(d=>{const dctx=new Ctx(db,d.x,d.z,d.ry);dctx.box('aco',.055,.32,.08,.38,1.1,.045);dctx.box('gLuz',.18,.1,.16,-.65,2.35,.16);});
  const group=new T.Group();db.build(group);cityG.add(group);URBAN.details.push({group,x:p.cx,z:p.cz});
 });
 // Jardins filtrantes fora dos caminhos e dos volumes dos edifícios.
 scatter(16,34,136,9,(x,z)=>{
  const c=new Ctx(cityB,x,z,rnd()*TAU),w=2.6,d=1.6;
  c.box('cascalho',w,.04,d,0,.02,0);c.box('terraSolo',w-.3,.04,d-.3,0,.05,0);
  for(let i=0;i<10;i++){const [px,pz]=c.w2((rnd()-.5)*2,(rnd()-.5));V.reed.add(px,.2,pz,.6,.5+rnd()*.4,.6,rnd()*TAU,'#75A86A');}
  c.box('aco',.9,.015,.16,0,.1,d/2);for(let j=0;j<8;j++)c.box('preto',.035,.018,.14,-.38+j*.11,.11,d/2);
 });
 // Coleta seletiva em pontos livres: volumes também participam da colisão.
 scatter(8,34,133,16,(x,z)=>{bins(W0,x,z,0);W0.col(x,z,1.8,.45);});
 // Anéis leves sugerem ondas; nenhum efeito de tela ou pós-processamento pesado.
 const water=places.find(p=>p.key==='reservatorio');if(water){for(let j=0;j<3;j++){const mesh=new T.Mesh(new T.RingGeometry(1,1.025,64),new T.MeshBasicMaterial({color:0xB4E4DA,transparent:true,opacity:.25,depthWrite:false,side:T.DoubleSide}));mesh.rotation.x=-PI/2;mesh.position.set(water.cx,.22,water.cz);scene.add(mesh);URBAN.ripples.push(mesh);}}
 for(let i=0;i<12;i++){const b=new T.Group();const mat=getMat('preto');[-1,1].forEach(side=>{const wing=new T.Mesh(new T.BoxGeometry(.6,.025,.16),mat);wing.position.x=side*.27;b.add(wing);});scene.add(b);URBAN.birds.push({g:b,a:rnd()*TAU,r:35+rnd()*60,y:18+rnd()*12,phase:rnd()*TAU});}
}
function updateUrbanDetails(dt){
 if(G.t-URBAN.last>.35){URBAN.last=G.t;const q=G.effectiveQuality,max=q==='ultra'?175:q==='high'?105:q==='med'?60:0;URBAN.details.forEach(d=>d.group.visible=Math.hypot(cam.position.x-d.x,cam.position.z-d.z)<max);}
 URBAN.birds.forEach((b,i)=>{b.g.visible=G.effectiveQuality!=='low';if(!G.reduceMotion)b.a+=dt*.045;const t=G.reduceMotion?0:G.t;b.g.position.set(Math.sin(b.a)*b.r,b.y+Math.sin(t*.5+b.phase),Math.cos(b.a)*b.r);b.g.rotation.y=b.a+PI/2;b.g.children.forEach((w,j)=>w.rotation.z=Math.sin(t*5+b.phase)*.35*(j?1:-1));});
 URBAN.ripples.forEach((m,i)=>{const f=G.reduceMotion?i/3:((G.t*.18+i/3)%1);m.scale.setScalar(.5+f*4);m.material.opacity=(1-f)*.22;});
}
