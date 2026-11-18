const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const p = await b.newPage({ viewport: { width: 600, height: 400 } });
  await p.route('**/three.min.js', r => r.fulfill({ path: '/home/claude/vila/vendor/three.min.js', contentType: 'application/javascript' }));
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  const html = '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0">' + fs.readFileSync('/home/claude/vila/dist/fragment.html', 'utf8') + '</body></html>';
  await p.route('https://vila.test/', r => r.fulfill({ body: html, contentType: 'text/html' }));
  await p.goto('https://vila.test/', { waitUntil: 'load' });
  await p.waitForFunction(() => window.__V, null, { timeout: 120000 });
  console.log(JSON.stringify(await p.evaluate(process.argv[2])));
  await b.close();
})();
