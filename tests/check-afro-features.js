/* Vérification DOM/Three.js en Node, sans navigateur ni rendu GPU. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {JSDOM}=require('jsdom'),root=path.resolve(__dirname,'..');
const dom=new JSDOM(fs.readFileSync(path.join(root,'src/00-shell.html'),'utf8'),{url:'https://vila.test/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;w._quick=process.argv.includes('--geometry');w._routesOnly=process.argv.includes('--routes');w._assert=assert;w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
const ctx=new Proxy({measureText:s=>({width:String(s).length*8}),createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}}),getImageData:(x,y,a,b)=>({data:new Uint8ClampedArray(a*b*4)}),createImageData:(a,b)=>({data:new Uint8ClampedArray(a*b*4)}),createPattern:()=>({})},{get:(o,k)=>k in o?o[k]:(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
w.HTMLCanvasElement.prototype.getContext=function(){return ctx;};
w.eval(fs.readFileSync(path.join(root,'vendor/three.min.js'),'utf8'));
const source=fs.readdirSync(path.join(root,'src')).filter(n=>/^\d\d-.*\.js$/.test(n)).sort().map(n=>fs.readFileSync(path.join(root,'src',n),'utf8')).join('\n').replace(/boot\(\)\.catch\(e => \{[\s\S]*?\}\);\s*$/,'');
const geometrySource=fs.readFileSync(path.join(root,'tests/validate.js'),'utf8').split('results.geometry = await page.evaluate(() => {')[1].split('\n  });')[0];
w.eval(source+'\nwindow.geometryTest=()=>{'+geometrySource+'};\n'+fs.readFileSync(path.join(root,'tests/world-scenarios.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'tests/afro-features-scenarios.js'),'utf8'));
w.testPromise.then(report=>{fs.writeFileSync(path.join(root,'tests/afro-features-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));dom.window.close();}).catch(e=>{console.error(e);dom.window.close();process.exitCode=1;});
