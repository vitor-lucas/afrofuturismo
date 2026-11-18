const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, 'src');
const files = fs.readdirSync(dir).filter(f => /^\d\d-.*\.js$/.test(f)).sort();
const js = files.map(f => `/* >>> ${f} */\n` + fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
const shell = fs.readFileSync(path.join(dir, '00-shell.html'), 'utf8');
const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
const frag = shell.replace('<!--SCRIPTS-->', () => `<script src="${CDN}"></script>\n<script>\n${js}\n</script>`);
fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'dist', 'fragment.html'), frag);
const loader = fs.readFileSync(path.join(__dirname, 'vendor', 'GLTFLoader.js'), 'utf8');
const three = fs.readFileSync(path.join(__dirname, 'vendor', 'three.min.js'), 'utf8');
const off = `<!doctype html>\n<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>Metrópole Afrofuturista — Explore os oito distritos</title><meta name="description" content="Explore uma metrópole 3D educativa com oito distritos, transportes, interiores, cultura, agricultura e sustentabilidade."></head><body>\n` + shell.replace('<!--SCRIPTS-->', () => `<script>\n${three}\n${loader}\n</script>\n<script>\n${js}\n</script>`) + `\n</body></html>`;
fs.writeFileSync(path.join(__dirname, 'dist', 'vila-afrofuturista-offline.html'), off);
console.log('build ok', files.join(' '), (frag.length / 1024 | 0) + 'KB fragment');

fs.copyFileSync(path.join(__dirname, 'dist', 'vila-afrofuturista-offline.html'), path.join(__dirname, 'dist', 'index.html'));
