const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const run = (command, args) => execFileSync(command, args, { cwd: root, stdio: 'inherit' });
run(process.execPath, ['build.js']);
run(process.platform === 'win32' ? 'python' : 'python3', ['scripts/package-downloads.py']);
run(process.execPath, ['scripts/validate-pages.js']);
for (const name of ['index.html', 'vila-afrofuturista.html']) {
  fs.copyFileSync(path.join(root, 'dist/index.html'), path.join(root, name));
}
fs.cpSync(path.join(root, 'dist/downloads'), path.join(root, 'downloads'), { recursive: true });
fs.writeFileSync(path.join(root, '.nojekyll'), '');
console.log('GitHub Pages pronto na raiz: index.html, versão compatível e downloads.');
