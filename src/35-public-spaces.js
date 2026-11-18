/* Equipamentos nos espaços entre distritos, integrados ao mapa e à caminhada. */
const PUBLIC_SPACES=[];
function buildPublicSpaces(){
 const kinds=['Praça das artes','Parque de leitura','Quadra comunitária','Jardim de chuva','Feira de produtores','Jardim dos encontros'];
 for(let sector=0;sector<8;sector++)for(let ring=0;ring<3;ring++){
  const angle=sector*45+30.5,radius=[215,365,495][ring],[x,z]=polar(angle,radius),kind=kinds[(sector+ring)%kinds.length],c=new Ctx(cityB,x,z,angle*PI/180,0,EXT.cols);
  const space={x,z,name:kind+' · '+(sector+1),kind};PUBLIC_SPACES.push(space);c.box('pPedra',30,.08,25,0,0,0);
  const [ax,az]=polar(sector*45+22.5,radius);pavedLink([ax,az],[x,z],3.2,true);
  for(const sx of [-1,1])for(const zz of [-8,8]){bench(c,sx*11,zz,sx*PI/2,2.4);c.col(sx*11,zz,.7,2.4);const p=c.w2(sx*16,zz);treeAt(p[0],p[1],1.4);}
  const p=c.w2(13,10);lampPost(p[0],p[1],angle*PI/180,5.4);bins(c,-12,10);c.col(-12,10,1.8,.5);
  sign(c,kind.toUpperCase(),0,1.8,10,9,.8,0,{bg:'#18382E',fg:'#F1DEB2'});
  if(kind==='Quadra comunitária'){
   c.box('marcaT',17,.025,17,0,.1,-1);for(const side of [-1,1]){c.box('marca',17,.012,.12,0,.14,side*8-1);c.box('marca',.12,.012,17,side*8.5,.14,-1);c.cyl('metalP',.06,.08,3.2,side*8,.1,-1,10);c.box('branco',.08,1,1.6,side*8,2.5,-1);c.geoM('ouro',new T.TorusGeometry(.28,.025,8,24),side*7.7,2.6,-1,0,PI/2);c.col(side*8,-1,.3,.3);}METRO.targets.push({x,z,label:'Participar da quadra',action:()=>openPublicSpace(space)});
  }else if(kind==='Feira de produtores'){
   for(const side of [-1,1])for(const zz of [-5,2]){const xx=side*6;c.box('madeira',4,.1,2,xx,.85,zz);for(const dx of [-1.8,1.8])c.cyl('madeiraE',.05,.05,2.7,xx+dx,.08,zz,8);c.box('tecidoO',4.6,.1,3,xx,2.8,zz);c.col(xx,zz,4,2);for(let j=0;j<9;j++)c.sph(j%2?'verde':'vermelho',.12,xx-1.3+j*.3,1.1,zz,1,1,1,8);}
  }else if(kind==='Jardim de chuva'){
   c.box('cascalho',12,.04,14,0,.1,-1);c.box('terraSolo',10,.05,12,0,.14,-1);for(let i=0;i<35;i++){const p=c.w2((rnd()-.5)*9,-1+(rnd()-.5)*11);V.reed.add(p[0],.7,p[1],1,.7+rnd()*.6,1,rnd()*TAU,'#558F65');}
  }else{
   for(const sx of [-1,1]){c.cyl('madeiraE',.08,.08,3,sx*5,.08,-1,10);c.box('madeira',.1,.12,8,sx*5,3,-1);}for(let k=-4;k<=4;k++)c.box('madeira',10,.12,.13,0,3.1,k-1);c.box('pedraQ',3,.5,3,0,.1,-1);c.ico('cobre',1.2,0,2,-1,1,1.4,1,2);c.col(0,-1,3,3);
  }
  if(kind!=='Quadra comunitária')METRO.targets.push({x:x+Math.sin(angle*PI/180)*8,z:z+Math.cos(angle*PI/180)*8,label:space.name,action:()=>openPublicSpace(space)});
 }
}
function openPublicSpace(space){openModal(`<h2>${esc(space.name)}</h2><p>Espaço público de convivência, cultura e cuidado comunitário.</p><div class="row"><button class="btn" id="public-events">Agenda de encontros</button><button class="btn" id="public-read">Leituras e referências</button><button class="btn" id="public-grow">Agricultura comunitária</button></div>`);$id('public-events').onclick=openEvents;$id('public-read').onclick=()=>openReader('cultural');$id('public-grow').onclick=openFarm;}
function drawPublicSpaces(g,W){for(const p of PUBLIC_SPACES){const [x,y]=mapXY(p.x,p.z,W);g.fillStyle=p.kind==='Quadra comunitária'?'#38B6AE':'#8BAC68';g.fillRect(x-4,y-4,8,8);}}
