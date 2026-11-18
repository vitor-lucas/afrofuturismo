/* Rotas sobre as mesmas vias e colisores usados pela vila. */
const NAV={route:[],mesh:null,target:null,at:0,grid:null,busy:false,version:0};
const NAV_SIZE=1301,NAV_HALF=650;
function walkSurface(x,z){const r=Math.hypot(x,z);return r<19||ROADS.rings.some(v=>r>=v.r0-v.sw&&r<=v.r1+v.sw)||ROADS.avenues.some(v=>segmentDistance(x,z,polar(v.deg,v.r0),polar(v.deg,v.r1))<=v.w/2+v.sw)||[...ROADS.paths,...ROADS.access,...(ROADS.streets||[]).map(v=>({...v,w:v.w+2*(v.sw||0)}))].some(v=>segmentDistance(x,z,v.a,v.b)<=v.w/2);}
function navIndex(x,z){return Math.round(z+NAV_HALF)*NAV_SIZE+Math.round(x+NAV_HALF);}
function navPoint(n){return [n%NAV_SIZE-NAV_HALF,Math.floor(n/NAV_SIZE)-NAV_HALF];}
function navFree(n){if(n<0||n>=NAV_SIZE*NAV_SIZE)return false;if(!NAV.grid)NAV.grid=new Int8Array(NAV_SIZE*NAV_SIZE);if(NAV.grid[n])return NAV.grid[n]===1;const [x,z]=navPoint(n),q={x,z};let free=Math.hypot(x,z)<WORLD_R-3&&walkSurface(x,z);if(free){pushOut(q,.4,EXT.cols,-1);pushCircles(q,.4,EXT.circ);free=Math.hypot(x-q.x,z-q.z)<.06;}NAV.grid[n]=free?1:-1;return free;}
function nearestNav(x,z){for(let r=0;r<=12;r++)for(let dx=-r;dx<=r;dx++)for(let dz=-r;dz<=r;dz++){if(r&&Math.abs(dx)!==r&&Math.abs(dz)!==r)continue;const n=navIndex(x+dx,z+dz);if(navFree(n))return n;}return -1;}
function routeDestination(p){if(p.doors.length){const d=p.doors[0];return [d.x+Math.sin(d.ry)*1.5,d.z+Math.cos(d.ry)*1.5];}if(p.access.length)return p.access[0];if(p.key==='praca')return [0,18];const r=Math.hypot(p.cx,p.cz);return [p.cx-p.cx/(r||1)*(p.r+3),p.cz-p.cz/(r||1)*(p.r+3)];}
function findRoute(start,end,budget=Infinity){
 const a=nearestNav(...start),b=nearestNav(...end);if(a<0||b<0)return [];
 let tree=NAV.tree;if(!tree||tree.root!==a){const prev=new Int32Array(NAV_SIZE*NAV_SIZE);prev.fill(-2);prev[a]=-1;const queue=new Int32Array(prev.length);queue[0]=a;tree=NAV.tree={root:a,prev,queue,head:0,tail:1};}
 const {prev,queue}=tree;let work=0;
 while(tree.head<tree.tail&&prev[b]===-2&&work++<budget){const n=queue[tree.head++],x=n%NAV_SIZE,z=Math.floor(n/NAV_SIZE);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){const nx=x+dx,nz=z+dz,m=n+dx+dz*NAV_SIZE;if(nx<0||nz<0||nx>=NAV_SIZE||nz>=NAV_SIZE||prev[m]!==-2||!navFree(m))continue;if(dx&&dz&&(!navFree(n+dx)||!navFree(n+dz*NAV_SIZE)))continue;prev[m]=n;queue[tree.tail++]=m;}}
 if(prev[b]===-2)return tree.head<tree.tail?null:[];const out=[];for(let n=b;n!==-1;n=prev[n])out.push(navPoint(n));return out.reverse();
}

async function findRouteAsync(start,end,version){let route;do{if(version!==NAV.version)return [];route=findRoute(start,end,192);if(route===null)await nextFrame();}while(route===null);return route;}
function cancelRoute(){NAV.version++;if(NAV.mesh){scene.remove(NAV.mesh);NAV.mesh.geometry.dispose();NAV.mesh.material.dispose();}NAV.route=[];NAV.mesh=null;NAV.target=null;miniBase=null;const e=$id('routehud');if(e)e.classList.add('hidden');}
function beforeTravel(){cancelRoute();}
async function startRoute(ref){
 if(NAV.busy)return;if(G.in)return toast('Saia do edifício para iniciar uma rota.');if(G.mode==='drive')return toast('Desça do transporte para seguir uma rota a pé.');const p=resolvePlace(ref);if(!p)return;closeModal();closeCard();if(G.mode!=='fp')goWalkFromOrbit();cancelRoute();NAV.busy=true;const version=NAV.version;toast('Traçando caminho…',15000);await nextFrame();
 try{const route=await findRouteAsync([G.P.x,G.P.z],routeDestination(p),version);if(version!==NAV.version)return;if(!route.length)return toast('Não foi encontrado um caminho livre. Aproxime-se de uma via e tente novamente.');NAV.route=route;NAV.target=p;NAV.at=0;const pts=route.map(v=>new T.Vector3(v[0],.2,v[1]));if(pts.length>1){const curve=new T.CurvePath();for(let i=1;i<pts.length;i++)curve.add(new T.LineCurve3(pts[i-1],pts[i]));NAV.mesh=new T.Mesh(new T.TubeGeometry(curve,Math.min(900,pts.length*2),.13,5,false),new T.MeshBasicMaterial({color:0x3ce4cd}));scene.add(NAV.mesh);}miniBase=null;$id('routehud').classList.remove('hidden');updateRoute();}finally{NAV.busy=false;}
}
function updateRoute(){if(!NAV.target||!NAV.route.length)return;const P=G.P;let best=NAV.at,dist=Infinity;for(let i=Math.max(0,NAV.at-3);i<NAV.route.length;i++){const q=NAV.route[i],d=Math.hypot(q[0]-P.x,q[1]-P.z);if(d<dist){dist=d;best=i;}}NAV.at=best;let left=dist;for(let i=best+1;i<NAV.route.length;i++)left+=Math.hypot(NAV.route[i][0]-NAV.route[i-1][0],NAV.route[i][1]-NAV.route[i-1][1]);$id('routeinfo').textContent=`${INFO[NAV.target.key].t} · ${Math.ceil(left)} m${dist>7?' · Volte à linha turquesa':''}`;const end=NAV.route[NAV.route.length-1];if(Math.hypot(P.x-end[0],P.z-end[1])<2.3){toast('Você chegou: '+INFO[NAV.target.key].t);cancelRoute();}}
function drawRouteMap(g,W){if(!NAV.route.length)return;g.save();g.strokeStyle='#42efcb';g.lineWidth=Math.max(2,W/180);g.beginPath();NAV.route.forEach((p,i)=>{const [x,z]=mapXY(...p,W);i?g.lineTo(x,z):g.moveTo(x,z);});g.stroke();g.restore();}
