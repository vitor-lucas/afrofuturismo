/* Mobilidade compartilhada. Energia/autonomia são simulações educativas. */
const FLEET = {
 express: {name:'Expresso elétrico',w:1.8,len:4,max:26,accel:5,color:'rebocoR',radius:1},
 car: { name:'Carro elétrico compartilhado', w:1.7, len:3.5, max:18, accel:3.8, color:'rebocoT', radius:.9 },
 bike: { name:'Bicicleta elétrica de carga', w:.75, len:2.2, max:5.5, accel:2, color:'tecidoO', radius:.45 },
 shuttle: { name:'Micro-ônibus elétrico', w:2.0, len:4.8, max:6, accel:1.5, color:'rebocoB', radius:1.1 }
};
const TRANSIT = { vehicle:null, touch:{gas:0,steer:0,brake:false}, traffic:[], distance:0, hudAt:0 };
function vehicleModel(type) {
 const spec={...FLEET[type],color:STUDIO.paint==='original'?FLEET[type].color:STUDIO.paint}, group=new T.Group(), wheels=[];
 const box=(w,h,d,x,y,z,m)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),getMat(m));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;group.add(o);return o;};
 const wheel=(x,z,r)=>{const pivot=new T.Group();pivot.position.set(x,r+.08,z);const tire=new T.Mesh(new T.CylinderGeometry(r,r,type==='bike'?.1:.2,16),M('preto'));tire.rotation.z=PI/2;pivot.add(tire);const hub=new T.Mesh(new T.CylinderGeometry(r*.55,r*.55,type==='bike'?.12:.22,12),M('aco'));hub.rotation.z=PI/2;pivot.add(hub);group.add(pivot);wheels.push(pivot);};
 if(type==='bike') {
  wheel(0,-.8,.34);wheel(0,.8,.34);box(.1,.12,1.65,0,.58,0,'tecidoO');box(.12,.7,.12,0,.85,-.35,'metalP');box(.5,.08,.35,0,1.15,-.35,'preto');box(.09,1.0,.09,0,.95,.7,'metalP');box(.7,.07,.08,0,1.4,.7,'metalP');box(.7,.45,.65,0,.75,.1,'madeira');box(.57,.06,.5,0,.99,.1,'terraSolo');box(.25,.35,.12,0,.63,-.45,'tecidoT');
 } else {
  box(spec.w,.48,spec.len,0,.65,0,spec.color);for(const side of [-1,1]){box(.5,.45,.5,side*spec.w*.24,.92,-.2,'preto');box(.5,.55,.13,side*spec.w*.24,1.15,-.42,'preto');}box(spec.w*.7,.12,.45,0,1.02,spec.len*.25,'metalP');box(spec.w*.83,type==='shuttle'?1.5:.85,spec.len*.62,0,type==='shuttle'?1.58:1.25,-.15,'vidroT');box(spec.w*.88,.1,spec.len*.65,0,type==='shuttle'?2.38:1.73,-.15,spec.color);box(spec.w*.7,.05,spec.len*.45,0,type==='shuttle'?2.46:1.8,-.15,'pv');box(spec.w+.03,.12,spec.len*.82,0,.52,0,'metalP');
  [-1,1].forEach(s=>{wheel(s*spec.w*.5,-spec.len*.3,.32);wheel(s*spec.w*.5,spec.len*.3,.32);box(.3,.12,.08,s*spec.w*.32,.81,spec.len/2+.02,'gBranco');box(.32,.1,.08,s*spec.w*.32,.8,-spec.len/2-.02,'vermelho');box(.12,.07,.3,s*(spec.w*.5+.1),1.15,.55,'metalP');});
  for(let z=-spec.len*.27;z<spec.len*.3;z+=.8)box(spec.w*.86,.07,.07,0,1.6,z,spec.color);
 }
 if(type!=='bike'){box(spec.w*.72,.12,.18,0,.42,spec.len/2+.05,'aco');box(.45,.16,.04,0,.62,spec.len/2+.1,'branco');box(.5,.1,.06,0,.66,-spec.len/2-.04,'preto');for(const side of [-1,1]){box(.04,.035,.3,side*(spec.w*.43+.02),1,.25,'aco');box(.035,.2,spec.len*.65,side*(spec.w*.5+.02),.74,0,spec.color);}} group.userData.wheels=wheels;return group;
}
function driveSurface(x,z,bike=false) {
 const r=Math.hypot(x,z); if(r>WORLD_R-3)return false;
 if((ROADS.streets||[]).some(v=>segmentDistance(x,z,v.a,v.b)<=v.w/2-.1))return true;
 if(ROADS.rings.some(v=>r>=v.r0+(bike?-.8:.08)&&r<=v.r1+(bike?.8:-.08)))return true;
 if(ROADS.avenues.some(v=>segmentDistance(x,z,polar(v.deg,v.r0),polar(v.deg,v.r1))<=v.w/2+(bike?v.sw-.4:-.08)))return true;
 return bike&&ROADS.paths.some(v=>segmentDistance(x,z,v.a,v.b)<v.w/2-.1);
}
function vehicleFree(x,z,a,type) {
 const v=FLEET[type],sn=Math.sin(a),cs=Math.cos(a);
 for(const side of [-1,0,1])for(const end of [-1,0,1]){
  const px=x+sn*end*v.len*.4+cs*side*v.w*.4,pz=z+cs*end*v.len*.4-sn*side*v.w*.4;
  if(!driveSurface(px,pz,type==='bike'))return false;
  const q={x:px,z:pz};resolveExteriorCollision(q,.22);if(Math.hypot(q.x-px,q.z-pz)>.05)return false;
 }
 return true;
}
function openMobility(){
 if(G.in)return toast('Saia do edifício para usar um transporte.');
 openModal(`<h2>Mobilidade limpa</h2><p>Escolha um transporte compartilhado. Use W/S para acelerar ou dar ré, A/D para virar, Espaço para frear e E para descer. No celular, use os pedais e as setas.</p><div class="grid">${Object.entries(FLEET).map(([id,v])=>`<button class="gl" data-vehicle="${id}"><b>${v.name}</b><p>${id==='bike'?'Pedale pelas vias e pelos caminhos compartilhados.':id==='shuttle'?'Dirija ou ative a linha circular com paradas.':'Motor elétrico e recuperação de energia na frenagem.'}</p><small>Até ${Math.round(v.max*3.6)} km/h nesta maquete</small></button>`).join('')}</div><p class="fine">Bateria e consumo são simulados. Recarregue perto do portal, na estação solar.</p>`);
 document.querySelectorAll('[data-vehicle]').forEach(b=>b.onclick=()=>startVehicle(b.dataset.vehicle));
}
function startVehicle(type){
 if(!FLEET[type]||G.in)return false;beforeTravel();closeModal();closeCard();closePanel();tourClear();detachVehicle();
 const v={type,x:2,z:118,a:PI,speed:0,battery:100,auto:false,stop:0,lastStop:-1,distance:0};v.mesh=vehicleModel(type);cityG.add(v.mesh);TRANSIT.vehicle=v;G.vehicle=v;setMode('drive');$id('vehiclehud').classList.remove('hidden');updateTransport(0);return true;
}
function detachVehicle(){if(TRANSIT.vehicle){cityG.remove(TRANSIT.vehicle.mesh);TRANSIT.vehicle.mesh.traverse(o=>{if(o.geometry)o.geometry.dispose();});}TRANSIT.vehicle=null;G.vehicle=null;TRANSIT.touch={gas:0,steer:0,brake:false};if($id('vehiclehud'))$id('vehiclehud').classList.add('hidden');}
function safeVehicleExit(v){
 for(const radius of [2.2,3.2,4.5])for(let k=0;k<16;k++){
  const a=k*TAU/16,x=v.x+Math.sin(a)*radius,z=v.z+Math.cos(a)*radius,q={x,z};
  if(Math.hypot(x,z)>WORLD_R-3)continue;pushOut(q,.38,EXT.cols,-1);pushCircles(q,.38,EXT.circ);
  if(Math.hypot(q.x-x,q.z-z)<.05&&onStreet(x,z))return q;
 }return {x:5.2,z:116};
}
function exitVehicle(){const v=TRANSIT.vehicle;if(!v)return;if(Math.abs(v.speed)>.5)return toast('Pare o veículo antes de descer.');const p=safeVehicleExit(v);detachVehicle();G.P={...G.P,...p,y:0,yaw:0,pitch:0,bob:0,lv:0};setMode('fp');toast('Transporte devolvido. Continue a pé.');}
function toggleAutopilot(){const v=TRANSIT.vehicle;if(!v||v.type!=='shuttle')return;if(Math.abs(v.speed)>.5)return toast('Pare antes de mudar para a linha circular.');v.auto=!v.auto;if(v.auto){beforeTravel();v.x=0;v.z=106.15;v.a=PI/2;v.lastStop=-1;v.stop=3;}toast(v.auto?'Linha circular: quatro paradas, embarque gratuito.':'Direção manual ativada.');}
function chargeVehicle(){const v=TRANSIT.vehicle;if(!v)return;if(Math.abs(v.speed)>.2||Math.hypot(v.x-2,v.z-118)>16)return toast('Pare junto à estação solar, perto do portal, para recarregar.');v.battery=100;toast('Bateria recarregada na simulação.');}
function updateTransport(dt){
 dt=cl(dt,0,.05);
 const v=TRANSIT.vehicle;if(!v||G.mode!=='drive')return false;const spec=FLEET[v.type],k=G.keys;
 if(!modalOpen&&!G.busy){
  const oldSpeed=v.speed,oldX=v.x,oldZ=v.z;
  if(v.auto){
   if(v.stop>0){v.stop=Math.max(0,v.stop-dt);v.speed=0;}else{
    v.speed=lerp(v.speed,spec.max*.7,1-Math.exp(-dt));let a=Math.atan2(v.x,v.z)+v.speed/106.15*dt;v.x=Math.sin(a)*106.15;v.z=Math.cos(a)*106.15;v.a=a+PI/2;
    const sector=((Math.round(a/(PI/2))%4)+4)%4,near=Math.abs(wrapAng(a-sector*PI/2));if(near<.013&&sector!==v.lastStop){v.lastStop=sector;v.stop=4;v.speed=0;}
   }
  }else{
   const gas=(k.KeyW||k.ArrowUp?1:0)-(k.KeyS||k.ArrowDown?1:0)+TRANSIT.touch.gas;
   const steer=(k.KeyA||k.ArrowLeft?1:0)-(k.KeyD||k.ArrowRight?1:0)+TRANSIT.touch.steer,brake=k.Space||TRANSIT.touch.brake;
   v.speed+=((v.battery>0?gas:0)*spec.accel-v.speed*.14)*dt;if(!gas)v.speed*=Math.exp(-dt*.5);if(brake)v.speed=brakeVehicleSpeed(v.speed,dt,['rain','storm'].includes(METRO.weather));
   const limit=Math.min(spec.max,trafficLimit(v.x,v.z)/3.6);v.speed=cl(v.speed,-spec.max*.3,limit);if(signalBlocks(v.x,v.z,v.a))v.speed*=Math.exp(-dt*12);if(Math.abs(v.speed)<.025)v.speed=0;
   const n=Math.max(1,Math.ceil(Math.abs(v.speed)*dt/.12));
   for(let j=0;j<n;j++){
    const grip=['rain','storm'].includes(METRO.weather)?.65:1;v.steer=lerp(v.steer||0,cl(steer,-1,1),1-Math.exp(-dt*8/n));const a=v.a+vehicleSteeringRate(v.speed,v.steer,spec.len*.6,grip<1)*dt/n,x=v.x+Math.sin(a)*v.speed*dt/n,z=v.z+Math.cos(a)*v.speed*dt/n;
    if(vehicleFree(x,z,a,v.type)&&!trafficNear(x,z,v.a,spec.len*.5+2)){v.x=x;v.z=z;v.a=a;}else{v.speed=0;break;}
   }
   if(brake&&oldSpeed>v.speed)v.battery=Math.min(100,v.battery+(oldSpeed-v.speed)*.012);
  }
  const travel=Math.hypot(v.x-oldX,v.z-oldZ);v.distance+=travel;TRANSIT.distance+=travel;v.battery=Math.max(0,v.battery-travel*(v.type==='bike'?.006:.016));
  if(v.battery===0){v.speed*=Math.exp(-dt*2);v.auto=false;}
 }
 v.mesh.position.set(v.x,.04+(G.reduceMotion?0:Math.sin(v.distance*2)*.012),v.z);v.mesh.rotation.y=v.a;if(!G.reduceMotion){v.mesh.rotation.z=lerp(v.mesh.rotation.z,-(v.steer||0)*Math.min(.065,Math.abs(v.speed)*.004),1-Math.exp(-dt*7));v.mesh.rotation.x=lerp(v.mesh.rotation.x,(k.Space||TRANSIT.touch.brake)&&v.speed>0?.025:0,1-Math.exp(-dt*7));}else{v.mesh.rotation.x=v.mesh.rotation.z=0;}v.mesh.userData.wheels.forEach(w=>w.rotation.x=v.distance/.32);
 G.P.x=v.x;G.P.z=v.z;G.P.yaw=v.a+PI;
 const behind=new T.Vector3(v.x-Math.sin(v.a)*9,5.5,v.z-Math.cos(v.a)*9);if(dt===0)cam.position.copy(behind);else cam.position.lerp(behind,1-Math.exp(-dt*6));cam.lookAt(v.x+Math.sin(v.a)*3,1.1,v.z+Math.cos(v.a)*3);
 if(G.t-TRANSIT.hudAt>.12||dt===0){TRANSIT.hudAt=G.t;$id('vstats').textContent=`${spec.name} · ${Math.abs(v.speed*3.6).toFixed(0)} km/h · Bateria ${v.battery.toFixed(0)}% · ${v.distance.toFixed(0)} m${v.auto?' · Linha circular'+(v.stop>0?' — parada':''):''}`;$id('vauto').hidden=v.type!=='shuttle';}
 return true;
}
function trafficNear(x,z,a,r){if(LIFE.people.some(p=>Math.hypot(x-p.x,z-p.z)<r+.4))return true;return TRANSIT.traffic.some(t=>Math.hypot(x-t.mesh.position.x,z-t.mesh.position.z)<r+2.2);}
function transportKey(e){if(e.code==='KeyV'&&!e.repeat){openMobility();return true;}if(G.mode!=='drive')return false;if(e.code==='KeyE'&&!e.repeat){exitVehicle();return true;}if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();return false;}
function initTransport(){
 const el=document.createElement('div');el.id='vehiclehud';el.className='hidden';el.innerHTML='<div id="vstats" role="status"></div><div class="vehicle-actions"><button class="btn" id="vexit">Descer · E</button><button class="btn" id="vcharge">Recarregar</button><button class="btn" id="vauto">Linha circular</button></div><div class="drivepads"><button data-drive="left" aria-label="Virar à esquerda">←</button><button data-drive="right" aria-label="Virar à direita">→</button><button data-drive="back">Ré</button><button data-drive="brake">Freio</button><button data-drive="gas">Acelerar</button></div>';$id('app').appendChild(el);
 $id('vexit').onclick=exitVehicle;$id('vcharge').onclick=chargeVehicle;$id('vauto').onclick=toggleAutopilot;
 el.querySelectorAll('[data-drive]').forEach(b=>{const apply=down=>{const key=b.dataset.drive;if(key==='brake')TRANSIT.touch.brake=down;else if(key==='left'||key==='right')TRANSIT.touch.steer=down?(key==='left'?1:-1):0;else TRANSIT.touch.gas=down?(key==='gas'?1:-1):0;};b.onpointerdown=e=>{b.setPointerCapture(e.pointerId);apply(true);e.preventDefault();};b.onpointerup=b.onpointercancel=()=>apply(false);});
 addEventListener('blur',()=>{TRANSIT.touch={gas:0,steer:0,brake:false};if(TRANSIT.vehicle)TRANSIT.vehicle.speed=0;});
}
