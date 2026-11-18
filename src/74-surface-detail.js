/* Normais derivadas da altura procedural: relevo coerente por material. */
const SURFACE_NORMALS={};
function surfaceNormal(texture,name){
 const image=texture.image;if(!image||!image.width)return null;
 const size=Math.min(512,image.width),cacheKey=name+':'+size;if(SURFACE_NORMALS[cacheKey])return SURFACE_NORMALS[cacheKey];
 const canvas=document.createElement('canvas');canvas.width=canvas.height=size;const g=canvas.getContext('2d');g.drawImage(image,0,0,size,size);const src=g.getImageData(0,0,size,size),out=g.createImageData(size,size),height=(x,y)=>src.data[(((y+size)%size)*size+(x+size)%size)*4]/255;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){const dx=(height(x-1,y)-height(x+1,y))*.8,dy=(height(x,y-1)-height(x,y+1))*.8,l=Math.hypot(dx,dy,1),i=(y*size+x)*4;out.data[i]=(dx/l*.5+.5)*255;out.data[i+1]=(dy/l*.5+.5)*255;out.data[i+2]=(1/l*.5+.5)*255;out.data[i+3]=255;}
 g.putImageData(out,0,0);const normal=new T.CanvasTexture(canvas);normal.wrapS=normal.wrapT=T.RepeatWrapping;normal.encoding=T.LinearEncoding;return SURFACE_NORMALS[cacheKey]=normal;
}
function applySurfaceDetail(q){const enabled=['high','ultra'].includes(q);Object.entries(MATS).forEach(([name,m])=>{const def=MD[name];if(!def?.t||!m.map)return;const normal=enabled?surfaceNormal(m.map,def.t):null;if(m.normalMap!==normal){m.normalMap=normal;if(normal){m.normalScale.set(.35,.35);m.bumpMap=null;}else if(def.b)m.bumpMap=m.map;m.needsUpdate=true;}});}
