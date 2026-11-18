/* Perfis de imagem e ajuste automático com histerese. */
const QUALITY={tiers:['low','med','high','ultra'],elapsed:0,sum:0,count:0,fast:0,lastChange:-30};
function selectQuality(q){
 q=['auto',...QUALITY.tiers].includes(q)?q:'auto';G.quality=q;
 try{localStorage.setItem('vila.q',q);}catch(e){}
 applyQuality(q==='auto'?(G.effectiveQuality|| (G.touch?'low':'med')):q);
}
function applyQuality(q){
 G.effectiveQuality=q;const dpr=window.devicePixelRatio||1,limit=q==='ultra'?8294400:q==='high'?5000000:2400000;
 const desired=q==='low'?Math.min(dpr,.8):q==='med'?Math.min(dpr,1.25):q==='high'?Math.min(dpr,2):Math.max(1.5,Math.min(dpr,2.5));
 const maxTexture=ren.capabilities.maxTextureSize||4096,pr=Math.min(desired,Math.sqrt(limit/(VW*VH)),maxTexture/Math.max(VW,VH));
 ren.setPixelRatio(pr);ren.setSize(VW,VH,false);$id('c').style.width='100%';$id('c').style.height='100%';
 ren.shadowMap.autoUpdate=false;ren.shadowMap.needsUpdate=true;sun.castShadow=q!=='low';
 const sz=Math.min(maxTexture,q==='ultra'?4096:q==='high'?2048:1024);
 if(sun.shadow.mapSize.x!==sz){sun.shadow.mapSize.set(sz,sz);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null;}}
 skyU0.uClouds.value=q==='low'?0:lerp(1,.18,G.tNight);
 const aniso=Math.min(ren.capabilities.getMaxAnisotropy(),q==='ultra'?16:q==='low'?2:8);
 // As texturas compartilham o objeto: atualizar a imagem também atualiza bump maps.
 const size=q==='ultra'?1024:512,seed=_s;
 Object.entries(TXCACHE).forEach(([name,t])=>{if(t.image.width!==size){t.image=mkCan(size,size,TXP[name]);t.needsUpdate=true;}if(t.anisotropy!==aniso){t.anisotropy=aniso;t.needsUpdate=true;}});_s=seed;
 applySurfaceDetail(q);QUALITY.lastChange=G.t;QUALITY.elapsed=QUALITY.sum=QUALITY.count=QUALITY.fast=0;URBAN.last=-1;
}
function monitorQuality(dt){
 if(G.quality!=='auto'||dt<=0||G.busy||modalOpen)return;
 QUALITY.elapsed+=dt;QUALITY.sum+=Math.min(dt,.1);QUALITY.count++;
 if(QUALITY.elapsed<3)return;const average=QUALITY.sum/QUALITY.count,index=Math.min(2,QUALITY.tiers.indexOf(G.effectiveQuality));
 QUALITY.fast=average<.019?QUALITY.fast+QUALITY.elapsed:0;
 if(average>.033&&index>0&&G.t-QUALITY.lastChange>5)applyQuality(QUALITY.tiers[index-1]);
 else if(QUALITY.fast>18&&index<2&&G.t-QUALITY.lastChange>20)applyQuality(QUALITY.tiers[index+1]);
 QUALITY.elapsed=QUALITY.sum=QUALITY.count=0;
}
