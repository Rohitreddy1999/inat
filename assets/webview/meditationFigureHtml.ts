export function getMeditationFigureHtml(glowColor: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<script type="importmap">
{"imports":{"three":"https://unpkg.com/three@0.184.0/build/three.module.js","three/addons/controls/OrbitControls.js":"https://unpkg.com/three@0.184.0/examples/jsm/controls/OrbitControls.js"}}
</script>
<style>html,body{margin:0;padding:0;width:100%;height:100%;background:transparent!important;overflow:hidden}canvas{width:100%!important;height:100%!important;background:transparent!important}#c{position:fixed;inset:0;width:100%;height:100%;display:block}</style>
</head>
<body>
<canvas id="c"></canvas>
<script type="module">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let glowColor = '${glowColor}';
// Iris purple has lower inherent luminosity — boost glow 25% to match Volt and Plasma
const irisBoost = (glowColor === '#8B5CF6' || glowColor === '#8b5cf6') ? 1.35 : 1.0;
const SURGE = new THREE.Color(glowColor);
const GLACIAL = new THREE.Color(glowColor).offsetHSL(0, 0, 0.18);

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
scene.background = null;
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
camera.position.set(0, 1.2, 3.7);
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 1.05, 0);
controls.enableDamping = true;
controls.enabled = false;
controls.minDistance = 1.6; controls.maxDistance = 12;
controls.maxPolarAngle = Math.PI * 0.55;

const J = {
  hips:[0,.78,0], spine1:[0,.96,.02], spine2:[0,1.12,.03], chest:[0,1.26,.02],
  neck:[0,1.36,.01], head:[0,1.52,0],
  shL:[-.22,1.28,.01], shR:[.22,1.28,.01],
  elL:[-.31,1.04,.09], elR:[.31,1.04,.09],
  haL:[-.33,.86,.24], haR:[.33,.86,.24],
  knL:[-.42,.80,.18], knR:[.42,.80,.18],
  ftL:[-.16,.62,.34], ftR:[.16,.60,.36]
};
const PRIMARY = [
  ['hips','spine1'],['spine1','spine2'],['spine2','chest'],['chest','neck'],['neck','head'],
  ['chest','shL'],['chest','shR'],['shL','elL'],['shR','elR'],['elL','haL'],['elR','haR'],
  ['hips','knL'],['hips','knR'],['knL','ftR'],['knR','ftL'],['ftL','ftR'],
  ['haL','knL'],['haR','knR']
];
function v3(a){ return new THREE.Vector3(a[0],a[1],a[2]); }
const rng = (()=>{ let s=42; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; })();
const BONES = PRIMARY.map(([a,b])=>{
  const len = v3(J[a]).distanceTo(v3(J[b]));
  return [a,b,.045, Math.max(6, Math.round(len*55))];
});

const pts = [];
for (const [a,b,r,n] of BONES){
  const A=v3(J[a]), B=v3(J[b]);
  for(let i=0;i<n;i++){
    const t = rng();
    const p = A.clone().lerp(B, t);
    const th = rng()*Math.PI*2, rr = Math.sqrt(rng())*r;
    p.x += Math.cos(th)*rr; p.z += Math.sin(th)*rr*0.9; p.y += (rng()-0.5)*r*0.7;
    pts.push(p);
  }
}
{
  const H = v3(J.head);
  for(let i=0;i<40;i++){
    const u=rng()*2-1, th=rng()*Math.PI*2, s=Math.sqrt(1-u*u), r=.105+(rng()-.5)*.02;
    pts.push(new THREE.Vector3(H.x+Math.cos(th)*s*r, H.y+u*r*1.15, H.z+Math.sin(th)*s*r));
  }
}

const jKeys = Object.keys(J);
const anchorPts = jKeys.map(k=>v3(J[k]));
const sampleSourcePts = pts.concat(anchorPts);

const uniformsBase = () => ({
  uTime:{value:0}, uEnergy:{value:.7}, uBright:{value:1}, uPulse:{value:1},
  uReflect:{value:0}, uPrimary:{value:0}, uSurge:{value:SURGE}, uGlacial:{value:GLACIAL}
});
const VERT_COMMON = \`
  uniform float uTime, uEnergy, uReflect, uPrimary;
  attribute float aRank;
  varying vec3 vColor; varying float vVis;
  uniform vec3 uSurge, uGlacial;
  vec4 place(vec3 pos){
    vec4 wp = modelMatrix * vec4(pos,1.0);
    if(uReflect > 0.5){
      float depth = max(0.0,-wp.y);
      wp.x += sin(wp.y*9.0 + uTime*1.6)*0.035*depth*2.0;
      wp.z += cos(wp.y*7.0 + uTime*1.1)*0.025*depth*2.0;
    }
    float g = clamp((abs(wp.y)-0.58)/0.95, 0.0, 1.0);
    vColor = mix(uSurge, uGlacial, g);
    float secVis = 1.0 - smoothstep(uEnergy-0.06, uEnergy+0.001, aRank);
    vVis = mix(secVis, 1.0, uPrimary);
    if(uReflect > 0.5) vVis *= 0.5 * exp(wp.y*0.9);
    return wp;
  }
\`;

function makeLineMat(reflect, primary){
  return new THREE.ShaderMaterial({
    uniforms: Object.assign(uniformsBase(), {uReflect:{value:reflect?1:0}, uPrimary:{value:primary?1:0}}),
    vertexShader: VERT_COMMON + \`
      void main(){ gl_Position = projectionMatrix * viewMatrix * place(position); }\`,
    fragmentShader: \`
      uniform float uBright, uPulse;
      varying vec3 vColor; varying float vVis;
      void main(){
        float a = vVis * 1.0 * uBright * uPulse;
        gl_FragColor = vec4(vColor * a, a);
      }\`,
    transparent:true, blending:THREE.AdditiveBlending, depthWrite:false
  });
}

function jitterVec(r){ return new THREE.Vector3((rng()-0.5)*2*r,(rng()-0.5)*2*r,(rng()-0.5)*2*r); }
function bonePerp(A,B){
  const axis = B.clone().sub(A).normalize();
  const up = Math.abs(axis.y) < 0.9 ? new THREE.Vector3(0,1,0) : new THREE.Vector3(1,0,0);
  const u = new THREE.Vector3().crossVectors(axis, up).normalize();
  const v = new THREE.Vector3().crossVectors(axis, u).normalize();
  return [u,v];
}
function tubeStrand(A,B,radius,angle,segs){
  const [u,v] = bonePerp(A,B);
  const off = u.clone().multiplyScalar(Math.cos(angle)).addScaledVector(v, Math.sin(angle)).multiplyScalar(radius);
  const jig = radius*0.55;
  const p0 = A.clone().addScaledVector(off, 0.3);
  const p1 = A.clone().lerp(B,0.33).add(off).add(jitterVec(jig));
  const p2 = A.clone().lerp(B,0.66).add(off).add(jitterVec(jig));
  const p3 = B.clone().addScaledVector(off, 0.3);
  return new THREE.CatmullRomCurve3([p0,p1,p2,p3]).getPoints(segs);
}
function pushPoly(poly,posArr,rankArr){
  const r = rng();
  for(let i=0;i<poly.length-1;i++){
    posArr.push(poly[i].x,poly[i].y,poly[i].z, poly[i+1].x,poly[i+1].y,poly[i+1].z);
    if(rankArr) rankArr.push(r,r);
  }
}
function addStrand(A,B,jitter,segs,posArr,rankArr){
  const m1 = A.clone().lerp(B,0.33).add(jitterVec(jitter));
  const m2 = A.clone().lerp(B,0.66).add(jitterVec(jitter*0.9));
  pushPoly(new THREE.CatmullRomCurve3([A,m1,m2,B]).getPoints(segs), posArr, rankArr);
}
const basePos = [], secPos = [], secRank = [];
const BONE_RADIUS = {
  'hips|spine1':.075,'spine1|spine2':.075,'spine2|chest':.075,
  'chest|neck':.045,'neck|head':.035,
  'chest|shL':.05,'chest|shR':.05,
  'shL|elL':.045,'shR|elR':.045,
  'elL|haL':.04,'elR|haR':.04,
  'hips|knL':.045,'hips|knR':.045,
  'knL|ftR':.035,'knR|ftL':.035,
  'ftL|ftR':.035,'haL|knL':.03,'haR|knR':.03
};
const LEG_DENSE = new Set(['hips|knL','hips|knR','knL|ftR','knR|ftL']);
const K_TOTAL = 9, BASE_STRANDS = 3;
for(const [a,b] of PRIMARY){
  const A=v3(J[a]), B=v3(J[b]);
  const key = a+'|'+b;
  const radius = BONE_RADIUS[key] ?? 0.05;
  const kTotal = LEG_DENSE.has(key) ? 8 : K_TOTAL;
  const baseN = LEG_DENSE.has(key) ? 4 : BASE_STRANDS;
  for(let s=0;s<kTotal;s++){
    const angle = (s/kTotal)*Math.PI*2 + rng()*0.35;
    const poly = tubeStrand(A,B,radius,angle,6);
    pushPoly(poly, s<baseN ? basePos : secPos, s<baseN ? null : secRank);
  }
}
const BASE_TUFTS=4, EXTRA_TUFTS=6, TUFT_LEN=0.075;
for(const p of anchorPts){
  for(let s=0;s<BASE_TUFTS;s++){
    const end = p.clone().addScaledVector(jitterVec(1).normalize(), TUFT_LEN*(0.6+rng()*0.7));
    addStrand(p,end, TUFT_LEN*0.35, 4, basePos, null);
  }
  for(let s=0;s<EXTRA_TUFTS;s++){
    const end = p.clone().addScaledVector(jitterVec(1).normalize(), TUFT_LEN*(0.7+rng()*0.9));
    addStrand(p,end, TUFT_LEN*0.4, 4, secPos, secRank);
  }
}
const primaryLineGeo = new THREE.BufferGeometry();
primaryLineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(basePos),3));
primaryLineGeo.setAttribute('aRank', new THREE.BufferAttribute(new Float32Array(basePos.length/3).map(()=>rng()),1));
const filamentSecGeo = new THREE.BufferGeometry();
filamentSecGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(secPos),3));
filamentSecGeo.setAttribute('aRank', new THREE.BufferAttribute(new Float32Array(secRank),1));

function makePointMat(reflect, primary){
  return new THREE.ShaderMaterial({
    uniforms: Object.assign(uniformsBase(), {uReflect:{value:reflect?1:0}, uPrimary:{value:primary?1:0}}),
    vertexShader: VERT_COMMON + \`
      attribute float aSize;
      void main(){
        vec4 wp = place(position);
        vec4 mv = viewMatrix * wp;
        float tw = 1.0 + 0.25*sin(uTime*2.2 + aRank*40.0);
        gl_PointSize = aSize * tw * (24.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }\`,
    fragmentShader: \`
      uniform float uBright, uPulse;
      varying vec3 vColor; varying float vVis;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float glow = pow(max(0.0, 1.0 - d*1.25), 1.45);
        float core = pow(max(0.0, 1.0 - d*2.7), 2.0);
        float a = vVis * uBright * uPulse;
        vec3 col = vColor * glow * a + vec3(1.0) * core * a * 0.82;
        gl_FragColor = vec4(col, glow * a);
      }\`,
    transparent:true, blending:THREE.AdditiveBlending, depthWrite:false
  });
}
const N = pts.length;
const pPos = new Float32Array(N*3), pRank = new Float32Array(N), pSize = new Float32Array(N);
pts.forEach((p,i)=>{ pPos.set([p.x,p.y,p.z], i*3); pRank[i]=rng(); pSize[i]=3.8+rng()*4.5; });
const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos,3));
pGeo.setAttribute('aRank', new THREE.BufferAttribute(pRank,1));
pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize,1));

const aPos = new Float32Array(anchorPts.length*3), aRank = new Float32Array(anchorPts.length), aSize = new Float32Array(anchorPts.length);
anchorPts.forEach((p,i)=>{ aPos.set([p.x,p.y,p.z], i*3); aRank[i]=rng(); aSize[i]=8.5+rng()*2.0; });
const anchorGeo = new THREE.BufferGeometry();
anchorGeo.setAttribute('position', new THREE.BufferAttribute(aPos,3));
anchorGeo.setAttribute('aRank', new THREE.BufferAttribute(aRank,1));
anchorGeo.setAttribute('aSize', new THREE.BufferAttribute(aSize,1));

const figure = new THREE.Group();
const figPts = new THREE.Points(pGeo, makePointMat(false,false));
const figFilSec = new THREE.LineSegments(filamentSecGeo, makeLineMat(false,false));
const figFilBase = new THREE.LineSegments(primaryLineGeo, makeLineMat(false,true));
const figAnchors = new THREE.Points(anchorGeo, makePointMat(false,true));
figure.add(figPts, figFilSec, figFilBase, figAnchors);
figure.position.y = 0.25;
scene.add(figure);

const reflection = new THREE.Group();
const refPts = new THREE.Points(pGeo, makePointMat(true,false));
const refFilSec = new THREE.LineSegments(filamentSecGeo, makeLineMat(true,false));
const refFilBase = new THREE.LineSegments(primaryLineGeo, makeLineMat(true,true));
const refAnchors = new THREE.Points(anchorGeo, makePointMat(true,true));
reflection.add(refPts, refFilSec, refFilBase, refAnchors);
reflection.scale.y = -1;
// scene.add(reflection); // disabled: no water surface on Home screen

function radialTexture(stops, size=256){
  const cv = document.createElement('canvas'); cv.width=cv.height=size;
  const ctx = cv.getContext('2d');
  const g = ctx.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);
  for(const [o,c] of stops) g.addColorStop(o,c);
  ctx.fillStyle=g; ctx.fillRect(0,0,size,size);
  return new THREE.CanvasTexture(cv);
}
const auraMat = new THREE.SpriteMaterial({
  map: radialTexture([[0,'rgba(120,215,255,0.32)'],[0.35,'rgba(80,200,220,0.10)'],[1,'rgba(0,0,0,0)']]),
  blending:THREE.AdditiveBlending, depthWrite:false, transparent:true, opacity:0.35
});
const aura = new THREE.Sprite(auraMat);
aura.position.set(0,1.05,0); aura.scale.set(2.4,2.4,1);
scene.add(aura);

{
  const NS=1600, sp=new Float32Array(NS*3), ss=new Float32Array(NS), sr=new Float32Array(NS);
  for(let i=0;i<NS;i++){
    const th=rng()*Math.PI*2, ph=Math.acos(rng()*0.95), r=55+rng()*25;
    sp.set([Math.sin(ph)*Math.cos(th)*r, Math.cos(ph)*r*0.9+2.0, Math.sin(ph)*Math.sin(th)*r], i*3);
    ss[i]=0.6+rng()*2.0; sr[i]=rng();
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(sp,3));
  g.setAttribute('aSize',new THREE.BufferAttribute(ss,1));
  g.setAttribute('aRank',new THREE.BufferAttribute(sr,1));
  const m=new THREE.ShaderMaterial({
    uniforms:{uTime:{value:0}},
    vertexShader:\`attribute float aSize; attribute float aRank; uniform float uTime;
      varying float vA;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        vA = 0.45 + 0.55*sin(uTime*(0.4+aRank*1.6) + aRank*80.0);
        gl_PointSize = aSize * (260.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }\`,
    fragmentShader:\`varying float vA;
      void main(){
        float d=length(gl_PointCoord-0.5);
        float a=pow(max(0.0,1.0-d*2.0),3.0)*vA;
        gl_FragColor=vec4(vec3(0.75,0.85,1.0)*a, a);
      }\`,
    transparent:true, blending:THREE.AdditiveBlending, depthWrite:false
  });
  scene.add(new THREE.Points(g,m));
  window.__starsMat = m;
}

function nebula(color1,color2,x,y,z,s,op){
  const mat = new THREE.SpriteMaterial({
    map: radialTexture([[0,color1],[0.5,color2],[1,'rgba(0,0,0,0)']], 512),
    blending:THREE.AdditiveBlending, depthWrite:false, transparent:true, opacity:op
  });
  const sp = new THREE.Sprite(mat);
  sp.position.set(x,y,z); sp.scale.set(s,s*0.65,1);
  scene.add(sp);
}
nebula('rgba(70,140,220,0.30)','rgba(40,80,160,0.10)', -18, 16, -55, 70, 0.5);
nebula('rgba(61,245,166,0.16)','rgba(30,120,110,0.06)', 22, 22, -60, 55, 0.4);
nebula('rgba(130,212,255,0.20)','rgba(60,90,180,0.07)', 4, 30, -70, 90, 0.35);

const waterMat = new THREE.ShaderMaterial({
  uniforms:{ uTime:{value:0}, uGlacial:{value:GLACIAL}, uPulse:{value:1}, uEnergy:{value:.7}, uMix:{value:0} },
  vertexShader:\`varying vec2 vUv; varying vec3 vWp;
    void main(){ vUv=uv; vec4 wp=modelMatrix*vec4(position,1.0); vWp=wp.xyz;
      gl_Position=projectionMatrix*viewMatrix*wp; }\`,
  fragmentShader:\`
    uniform float uTime, uPulse, uEnergy, uMix; uniform vec3 uGlacial;
    varying vec2 vUv; varying vec3 vWp;
    float ripple(vec2 p, vec2 origin, float period, float phase, float speed, float amp){
      float age = mod(uTime + phase, period);
      float r = length(p - origin);
      float front = age*speed;
      float width = 0.10 + age*0.16;
      float decay = amp * exp(-age*0.85) / (1.0 + r*0.55);
      float ring = exp(-pow((r-front)/width, 2.0)) * decay;
      float trail = 0.0;
      if(r < front){
        float behind = front - r;
        trail = sin(behind*16.0 - age*4.0) * exp(-behind*3.2) * decay * 0.4;
      }
      return ring + trail;
    }
    void main(){
      vec3 base = vec3(0.012,0.025,0.05);
      vec2 p = vWp.xz;
      float w = sin(p.x*3.1+uTime*0.9)*sin(p.y*2.7-uTime*0.7)
              + 0.5*sin(p.x*7.3-uTime*1.4)*sin(p.y*6.1+uTime*1.1)
              + 0.35*sin(p.x*13.7+p.y*11.3+uTime*0.6);
      float r = length(p);
      float fade = smoothstep(14.0, 4.0, r);
      float glint = pow(max(0.0, w*0.42+0.5), 9.0)*0.035*fade*fade;
      float amp = (0.16 + 0.22*uEnergy) * (0.5 + 0.5*uMix);
      float rings = ripple(p, vec2(0.0,0.0), 6.98, 0.0, 1.9, amp);
      rings += ripple(p, vec2(0.12,-0.06), 6.98, 2.3, 1.6, amp*0.6) * step(0.15, uEnergy);
      rings += ripple(p, vec2(-0.09,0.08), 6.98, 4.6, 2.2, amp*0.45) * step(0.4, uEnergy);
      float rip = sin(r*10.0 - uTime*1.8)*exp(-r*1.3);
      float halo = exp(-r*1.9)*(0.10+0.06*rip)*uPulse*(0.3+uEnergy);
      float caustic = pow(clamp(rings,0.0,1.0), 1.6) * 0.9;
      vec2 shadowP = p - vec2(0.08, 0.14);
      float shadow = exp(-dot(shadowP,shadowP)*1.1) * 0.4;
      vec3 col = base * (1.0 - shadow);
      col += uGlacial*(glint + halo + rings*0.5 + caustic);
      col = mix(vec3(0.004,0.012,0.039)*(1.0-shadow*0.6), col, fade);
      gl_FragColor = vec4(col, 1.0);
    }\`,
});
const water = new THREE.Mesh(new THREE.PlaneGeometry(40,40,1,1), waterMat);
water.rotation.x = -Math.PI/2;
// scene.add(water); // ripple disabled for Home screen — keep for Graduation

const NT = 1100;
const tStart = new Float32Array(NT*3), tSeed = new Float32Array(NT);
for(let i=0;i<NT;i++){
  const p = sampleSourcePts[Math.floor(rng()*sampleSourcePts.length)];
  tStart.set([p.x,p.y,p.z], i*3); tSeed[i]=rng();
}
const tGeo = new THREE.BufferGeometry();
tGeo.setAttribute('position', new THREE.BufferAttribute(tStart,3));
tGeo.setAttribute('aSeed', new THREE.BufferAttribute(tSeed,1));
const tMat = new THREE.ShaderMaterial({
  uniforms:{ uTime:{value:0}, uMix:{value:0}, uSurge:{value:SURGE}, uGlacial:{value:GLACIAL} },
  vertexShader:\`
    attribute float aSeed; uniform float uTime, uMix;
    varying float vA; varying vec3 vColor; uniform vec3 uSurge, uGlacial;
    void main(){
      float life = 4.5;
      float age = mod(uTime*(0.7+aSeed*0.5) + aSeed*life, life);
      float rise = age*age*0.22 + age*0.25;
      vec3 pos = position + vec3(
        sin(age*2.1 + aSeed*40.0)*0.12*age,
        rise,
        cos(age*1.7 + aSeed*31.0)*0.12*age);
      vec4 wp = modelMatrix * vec4(pos,1.0);
      float g = clamp((wp.y-0.6)/2.2, 0.0, 1.0);
      vColor = mix(uSurge, uGlacial, g);
      vA = uMix * smoothstep(0.0,0.35,age) * (1.0-age/life);
      vec4 mv = viewMatrix * wp;
      gl_PointSize = (1.2+aSeed*1.8) * (16.0 / -mv.z);
      gl_Position = projectionMatrix * mv;
    }\`,
  fragmentShader:\`
    varying float vA; varying vec3 vColor;
    void main(){
      float d=length(gl_PointCoord-0.5);
      float a=pow(max(0.0,1.0-d*2.0),2.5)*vA;
      gl_FragColor=vec4(vColor*a + vec3(1.0)*pow(max(0.0,1.0-d*5.0),2.0)*a*0.6, a);
    }\`,
  transparent:true, blending:THREE.AdditiveBlending, depthWrite:false
});
const transcendPts = new THREE.Points(tGeo, tMat);
transcendPts.frustumCulled = false;
figure.add(transcendPts);

const state = { energy:.9, transcend:false, rotation:true, transcendMix:0 };

const clock = new THREE.Clock();
const secondaryMats = [figPts.material, refPts.material, figFilSec.material, refFilSec.material];
const primaryMats = [figFilBase.material, figAnchors.material, refFilBase.material, refAnchors.material];
const allFigureMats = secondaryMats.concat(primaryMats);
function resize(){
  const w=innerWidth, h=innerHeight;
  renderer.setSize(w,h,false);
  camera.aspect=w/h; camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

function tick(){
  requestAnimationFrame(tick);
  const t = clock.getElapsedTime();
  const breath = 1 + 0.014*Math.sin(t*0.9);
  const pulse = 0.85 + 0.15*Math.sin(t*0.9);
  const bright = (0.40 + state.energy*1.05 + state.transcendMix*0.35) * 1.5 * irisBoost;
  const primBright = (0.63 + 0.5*state.energy + state.transcendMix*0.25) * 1.5 * irisBoost;
  state.transcendMix += ((state.transcend?1:0) - state.transcendMix) * 0.04;

  figure.scale.setScalar(breath);
  // reflection.scale.set(breath,-breath,breath);
  if(state.rotation){
    const maxRotation = 0.31;
    figure.rotation.y = Math.sin(t * 0.25) * maxRotation;
    // reflection.rotation.y = figure.rotation.y;
  }

  for(const m of allFigureMats){ m.uniforms.uTime.value=t; m.uniforms.uEnergy.value=state.energy; m.uniforms.uPulse.value=pulse; }
  for(const m of secondaryMats) m.uniforms.uBright.value=bright;
  for(const m of primaryMats) m.uniforms.uBright.value=primBright;
  auraMat.opacity = (0.10 + 0.26*state.energy) * pulse * 1.35 * irisBoost + state.transcendMix*0.13;
  aura.scale.setScalar(2.4*breath + state.transcendMix*0.5);
  waterMat.uniforms.uTime.value=t; waterMat.uniforms.uPulse.value=pulse;
  waterMat.uniforms.uEnergy.value=state.energy; waterMat.uniforms.uMix.value=state.transcendMix;
  if(window.__starsMat) window.__starsMat.uniforms.uTime.value=t;
  tMat.uniforms.uTime.value=t; tMat.uniforms.uMix.value=state.transcendMix;

  controls.update();
  renderer.render(scene, camera);
}
tick();
</script>
</body>
</html>`
}
