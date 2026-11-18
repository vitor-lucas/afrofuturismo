// O token é mostrado apenas no terminal. Somente seu hash vai para o site público.
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const token = 'AFRO-' + crypto.randomBytes(24).toString('base64url');
const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
const config = { tokenHash, sessionMs: 2 * 60 * 60 * 1000 };
fs.writeFileSync(path.resolve(__dirname, '../src/09-presenter-config.js'),
  '// Bloqueio local de controles; o site e este hash são públicos.\nconst PRESENTER_ACCESS = Object.freeze(' + JSON.stringify(config, null, 2) + ');\n');
console.log(token);
