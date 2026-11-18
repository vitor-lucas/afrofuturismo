/* ============================================================
   CÉU, AMBIENTE (IBL) E CICLO DIA/NOITE
   ============================================================ */
const SKY_VS = 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }';
const SKY_FS = `
varying vec3 vDir;
uniform vec3 uTop, uHor, uBot, uSun, uSunCol; uniform float uSunK, uEnc, uClouds, uTime;
float h21(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*vn(p); p*=2.03; a*=.5; } return s; }
void main(){
  vec3 d = normalize(vDir); float y = d.y;
  vec3 col = mix(uHor, uTop, pow(clamp(y,0.,1.), .5));
  col = mix(col, uBot, 1. - smoothstep(-.22, 0., y));
  float sd = max(dot(d, uSun), 0.);
  col += uSunCol * (pow(sd, 700.) * 2.2 + pow(sd, 10.) * .22 * uSunK);
  if (uClouds > 0.) {
    vec2 uv = d.xz / max(y + .14, .06) * .55 + vec2(uTime * .004, 0.);
    float c = smoothstep(.50, .80, fbm(uv * 1.5));
    float a = c * smoothstep(0., .22, y) * uClouds;
    col = mix(col, mix(uHor * 1.05 + .05, vec3(1.), .55), a * .75);
  }
  if (uEnc > .5) col = pow(col, vec3(2.2));
  gl_FragColor = vec4(col, 1.);
}`;
const skyU = () => ({ uTop: { value: new T.Color() }, uHor: { value: new T.Color() }, uBot: { value: new T.Color() }, uSun: { value: new T.Vector3(.5, .7, .4).normalize() }, uSunCol: { value: new T.Color(1, .93, .8) }, uSunK: { value: 1 }, uEnc: { value: 0 }, uClouds: { value: 1 }, uTime: { value: 0 } });
const TOD = {
  day: { top: 0x5E9BD6, hor: 0xD9E7E9, bot: 0xB8C3AE, fog: 0xD3E2E4, sunCol: 0xFFF0D0, sunI: 2.5, sunPos: [.55, .78, .38], hemiSky: 0xFFF3DE, hemiGnd: 0x6E5C40, hemiI: .5, exp: 1.0, env: 1.0, stars: 0 },
  night: { top: 0x040815, hor: 0x16223D, bot: 0x080D18, fog: 0x0D152B, sunCol: 0x9DB4FF, sunI: .55, sunPos: [-.45, .62, -.55], hemiSky: 0x4A5F92, hemiGnd: 0x16110C, hemiI: .42, exp: 1.25, env: .5, stars: 1 },
};
const cA = new T.Color(), cB = new T.Color();
const mixHex = (a, b, t) => cA.set(a).lerp(cB.set(b), t);

let sky, skyMat, stars, sun, hemi, skyU0, envDay, envNight, envInd;
function buildSky(scene) {
  skyU0 = skyU();
  skyMat = new T.ShaderMaterial({ uniforms: skyU0, vertexShader: SKY_VS, fragmentShader: SKY_FS, side: T.BackSide, depthWrite: false, fog: false });
  sky = new T.Mesh(new T.SphereGeometry(460, 32, 20), skyMat); sky.renderOrder = -10; sky.frustumCulled = false; scene.add(sky);
  const sp = []; for (let i = 0; i < 700; i++) { const u = rnd() * 2 - 1, a = rnd() * TAU, r = Math.sqrt(1 - u * u); if (u < .02) { i--; continue; } sp.push(Math.cos(a) * r * 440, u * 440, Math.sin(a) * r * 440); }
  const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(sp, 3));
  stars = new T.Points(g, new T.PointsMaterial({ color: 0xffffff, size: 1.8, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, fog: false })); stars.frustumCulled = false; stars.renderOrder = -9; scene.add(stars);
  sun = new T.DirectionalLight(0xfff0d0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .05;
  const sc = sun.shadow.camera; sc.near = 1; sc.far = 420; scene.add(sun, sun.target);
  hemi = new T.HemisphereLight(0xfff3de, 0x6e5c40, .5); scene.add(hemi);
}
function bakeEnv(ren) {
  // ambiente por imagem equirretangular (gradiente + sol), convertido em IBL com PMREM
  const pm = new T.PMREMGenerator(ren), es = new T.Scene();
  const hx = h => '#' + ('000000' + h.toString(16)).slice(-6);
  const bake = (top, hor, bot, sunc, sunr, sp, glow) => {
    const W = 512, H = 256, cv = mkCan(W, H, g => {
      const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, hx(top)); gr.addColorStop(.5, hx(hor)); gr.addColorStop(.56, hx(bot)); gr.addColorStop(1, hx(bot)); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      const d = new T.Vector3(...sp).normalize(), th = Math.acos(d.y), ph = Math.atan2(d.z, -d.x), x = ((ph / TAU) % 1 + 1) % 1 * W, y = th / PI * H;
      if (sunr > 0) for (const ox of [-W, 0, W]) { const k = g.createRadialGradient(x + ox, y, 0, x + ox, y, sunr); k.addColorStop(0, hx(sunc)); k.addColorStop(.35, hx(sunc) + 'aa'); k.addColorStop(1, hx(sunc) + '00'); g.fillStyle = k; g.fillRect(x + ox - sunr, y - sunr, sunr * 2, sunr * 2); }
      if (glow) { const k = g.createLinearGradient(0, 0, 0, H * .3); k.addColorStop(0, hx(glow)); k.addColorStop(1, hx(glow) + '00'); g.fillStyle = k; g.fillRect(0, 0, W, H * .3); }
    });
    const t = new T.CanvasTexture(cv); t.encoding = T.sRGBEncoding; es.clear();
    const dome = new T.Mesh(new T.SphereGeometry(50, 32, 20), new T.MeshBasicMaterial({ map: t, side: T.BackSide })); es.add(dome);
    const out = pm.fromScene(es, 0.0).texture; dome.geometry.dispose(); dome.material.dispose(); t.dispose(); return out;
  };
  envDay = bake(TOD.day.top, TOD.day.hor, TOD.day.bot, 0xFFF4DC, 60, TOD.day.sunPos);
  envNight = bake(TOD.night.top, TOD.night.hor, TOD.night.bot, 0xBFD0FF, 22, TOD.night.sunPos);
  envInd = bake(0x6A5A4C, 0xD8BE9A, 0x7A6652, 0xFFE6C0, 0, [0, 1, 0], 0xFFE9C8);
  pm.dispose();
}
let tNight = 0, tNightGoal = 0;
function applyTime(scene, ren, t) {
  const D = TOD.day, N = TOD.night, k = t;
  skyU0.uTop.value.copy(mixHex(D.top, N.top, k)); skyU0.uHor.value.copy(mixHex(D.hor, N.hor, k)); skyU0.uBot.value.copy(mixHex(D.bot, N.bot, k));
  skyU0.uSunCol.value.copy(mixHex(D.sunCol, N.sunCol, k)).multiplyScalar(lerp(1, .45, k)); skyU0.uClouds.value = G.effectiveQuality === 'low' ? 0 : lerp(1, .18, k);
  skyU0.uSun.value.set(lerp(D.sunPos[0], N.sunPos[0], k), lerp(D.sunPos[1], N.sunPos[1], k), lerp(D.sunPos[2], N.sunPos[2], k)).normalize();
  const f = mixHex(D.fog, N.fog, k); scene.fog.color.copy(f).convertSRGBToLinear();
  stars.material.opacity = cl((k - .35) * 1.6, 0, 1);
  sun.color.copy(mixHex(D.sunCol, N.sunCol, k)); sun.intensity = lerp(D.sunI, N.sunI, k) * (METRO.weather==='storm'?.35:METRO.weather==='rain'?.6:1); sun.userData.dir = skyU0.uSun.value.clone();
  hemi.color.copy(mixHex(D.hemiSky, N.hemiSky, k)); hemi.groundColor.copy(mixHex(D.hemiGnd, N.hemiGnd, k)); hemi.intensity = lerp(D.hemiI, N.hemiI, k);
  ren.toneMappingExposure = lerp(D.exp, N.exp, k);
  const ek = lerp(D.env, N.env, k); envMats.forEach(m => m.envMapIntensity = (m.userData.env0 || .75) * ek);
  scene.environment = k < .5 ? envDay : envNight;
  glows.forEach(m => m.emissiveIntensity = lerp(.35, 2.4, k) * m.userData.k);
  winMats.forEach(m => m.emissiveIntensity = m.userData.lit ? lerp(.05, 1.15, k) : 0);
  scene.userData.night = k;
}

