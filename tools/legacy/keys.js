const fs=require('fs'),vm=require('vm');const d='/home/claude/vila/src/';
const files=fs.readdirSync(d).filter(f=>/^5\d[a-z]?-/.test(f)&&f.endsWith('.js')&&!/51-info|54-tour/.test(f));
let code=files.map(f=>fs.readFileSync(d+f,'utf8')).join('\n');
code+="\n;this.__r={SRC,GLOS,HOT}";
const ctx={};vm.createContext(ctx);vm.runInContext(code,ctx);
const {SRC,GLOS,HOT}=ctx.__r;let bad=0;
Object.entries(HOT).forEach(([id,c])=>{c.g.forEach(k=>{if(!GLOS[k]){console.log('GLOS?',id,k);bad++}});c.s.forEach(k=>{if(!SRC[k]){console.log('SRC?',id,k);bad++}});
 const tags=(c.d.match(/\{[A-Z]\}/g)||[]);const bl=new Set(c.b);tags.forEach(t=>{const l=t[1];if(!bl.has(l)){console.log('BADGE?',id,l,'not in',c.b.join(''))}});});
console.log('hotspots',Object.keys(HOT).length,'bad',bad);
