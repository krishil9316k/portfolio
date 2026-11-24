// The hero scene: an AI core at night, with the businesses it runs orbiting around it.
// Data pulses travel from the core to each business, all the time — the "while I sleep" idea.
import * as THREE from 'three';

const NODES = [
  { name: 'Ovrix', color: '#5EEAD4' },
  { name: 'Kaapo', color: '#8B9CFF' },
  { name: 'KRISHIL edu hub', color: '#FFD166' },
  { name: 'God View', color: '#7CC4FF' },
  { name: 'Saathi', color: '#FF9F7A' },
  { name: 'Ruby', color: '#F472B6' },
];

const coreVert = `
varying vec3 vN; varying vec3 vP;
uniform float uTime;
// cheap 3D noise
vec3 hash3(vec3 p){ p = vec3(dot(p,vec3(127.1,311.7,74.7)), dot(p,vec3(269.5,183.3,246.1)), dot(p,vec3(113.5,271.9,124.6))); return fract(sin(p)*43758.5453)*2.0-1.0; }
float noise(vec3 p){ vec3 i=floor(p), f=fract(p); vec3 u=f*f*(3.0-2.0*f);
  return mix(mix(mix(dot(hash3(i),f), dot(hash3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x), mix(dot(hash3(i+vec3(0,1,0)),f-vec3(0,1,0)), dot(hash3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),
             mix(mix(dot(hash3(i+vec3(0,0,1)),f-vec3(0,0,1)), dot(hash3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x), mix(dot(hash3(i+vec3(0,1,1)),f-vec3(0,1,1)), dot(hash3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z); }
void main(){
  float n = noise(normal*2.2 + uTime*0.35);
  vec3 pos = position + normal * n * 0.12;
  vN = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(pos,1.0); vP = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;
const coreFrag = `
varying vec3 vN; varying vec3 vP;
uniform float uTime; uniform vec3 uA; uniform vec3 uB;
void main(){
  float f = pow(1.0 - abs(dot(normalize(-vP), vN)), 2.4);
  float band = 0.5 + 0.5*sin(vP.y*6.0 - uTime*1.6);
  vec3 c = mix(uA, uB, band) * (0.25 + f*1.6);
  gl_FragColor = vec4(c, 0.35 + f*0.65);
}`;

export function initHero(canvas, labelsEl, { reduced = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07080b, 0.035);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  camera.position.set(0, 0.4, 11);

  const world = new THREE.Group();
  scene.add(world);

  // core
  const coreMat = new THREE.ShaderMaterial({
    vertexShader: coreVert, fragmentShader: coreFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uA: { value: new THREE.Color('#5EEAD4') }, uB: { value: new THREE.Color('#8B9CFF') } },
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 24), coreMat);
  world.add(core);
  const shell = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.9, 1)),
    new THREE.LineBasicMaterial({ color: 0x8b9cff, transparent: true, opacity: 0.28 }),
  );
  world.add(shell);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial('#5EEAD4'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55 }));
  glow.scale.set(9, 9, 1);
  world.add(glow);

  // orbits + nodes
  const nodes = NODES.map((n, i) => {
    const radius = 3.1 + (i % 3) * 0.85;
    const tilt = new THREE.Euler((i * 0.55) % 1.2 - 0.4, 0, (i * 0.9) % 1.4 - 0.7);
    const ring = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(Array.from({ length: 160 }, (_, k) => {
        const a = (k / 160) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
      })),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.07 }),
    );
    ring.rotation.copy(tilt);
    world.add(ring);
    const col = new THREE.Color(n.color);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 20), new THREE.MeshBasicMaterial({ color: col }));
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: radial(n.color), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.9 }));
    halo.scale.set(1.1, 1.1, 1);
    dot.add(halo);
    world.add(dot);
    const label = document.createElement('span');
    label.className = 'node';
    label.style.setProperty('--c', n.color);
    label.textContent = n.name;
    labelsEl.appendChild(label);
    return { ...n, radius, tilt, ring, dot, label, col, speed: 0.06 + (i % 4) * 0.018, phase: i * 1.07 };
  });

  // data pulses travelling from the core to the nodes
  const PULSES = 90;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(PULSES * 3), pCol = new Float32Array(PULSES * 3);
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  const pulses = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.09, map: radial('#ffffff'), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  world.add(pulses);
  const pulseState = Array.from({ length: PULSES }, (_, i) => ({ node: i % nodes.length, t: Math.random(), speed: 0.18 + Math.random() * 0.25, back: Math.random() < 0.35 }));

  // stars
  const S = reduced ? 600 : 1600;
  const sPos = new Float32Array(S * 3);
  for (let i = 0; i < S; i++) {
    const r = 30 + Math.random() * 60, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    sPos.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)], i * 3);
  }
  const stars = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(sPos, 3)),
    new THREE.PointsMaterial({ size: 0.12, color: 0xcfd6ff, transparent: true, opacity: 0.55, depthWrite: false, fog: false }));
  scene.add(stars);

  // interaction
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', (e) => { mouse.tx = e.clientX / innerWidth - 0.5; mouse.ty = e.clientY / innerHeight - 0.5; }, { passive: true });
  let scrollP = 0, mobile = false, baseY = 0; // 0..1 how far the hero has scrolled away
  let running = true, visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
  document.addEventListener('visibilitychange', () => { running = !document.hidden; });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep everything in frame on narrow phones
    mobile = w < 900;
    camera.position.z = w < 700 ? 17 : 11;
    world.position.x = mobile ? 0 : 2.7;
    baseY = mobile ? 3.2 : 0;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  const tmp = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), mid = new THREE.Vector3();
  const t0 = performance.now();
  function nodePos(n, t, out) {
    const ang = n.phase + t * n.speed * (reduced ? 0.3 : 1);
    out.set(Math.cos(ang) * n.radius, 0, Math.sin(ang) * n.radius).applyEuler(n.tilt);
    return out;
  }

  function frame() {
    requestAnimationFrame(frame);
    if (!running || !visible) return;
    const t = (performance.now() - t0) / 1000;
    coreMat.uniforms.uTime.value = t;
    core.rotation.y = t * 0.12;
    shell.rotation.y = -t * 0.06;
    shell.rotation.x = Math.sin(t * 0.2) * 0.2;
    glow.material.opacity = 0.45 + Math.sin(t * 1.3) * 0.08;

    for (const n of nodes) nodePos(n, t, n.dot.position);

    // pulses ride a gentle arc from the core to a node (or back)
    for (let i = 0; i < PULSES; i++) {
      const p = pulseState[i];
      p.t += p.speed * 0.016 * (reduced ? 0.4 : 1);
      if (p.t > 1) { p.t = 0; p.node = (Math.random() * nodes.length) | 0; p.back = Math.random() < 0.35; }
      const n = nodes[p.node];
      b.copy(n.dot.position);
      a.set(0, 0, 0);
      mid.copy(b).multiplyScalar(0.5).add(tmp.set(0, 0.9, 0));
      const s = p.back ? 1 - p.t : p.t;
      // quadratic bezier
      const x = (1 - s) * (1 - s) * a.x + 2 * (1 - s) * s * mid.x + s * s * b.x;
      const y = (1 - s) * (1 - s) * a.y + 2 * (1 - s) * s * mid.y + s * s * b.y;
      const z = (1 - s) * (1 - s) * a.z + 2 * (1 - s) * s * mid.z + s * s * b.z;
      pPos[i * 3] = x; pPos[i * 3 + 1] = y; pPos[i * 3 + 2] = z;
      const fade = Math.sin(p.t * Math.PI);
      pCol[i * 3] = n.col.r * fade; pCol[i * 3 + 1] = n.col.g * fade; pCol[i * 3 + 2] = n.col.b * fade;
    }
    pGeo.attributes.position.needsUpdate = true;
    pGeo.attributes.color.needsUpdate = true;

    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    world.rotation.y = mouse.x * 0.5 + t * 0.02;
    world.rotation.x = 0.18 + mouse.y * 0.25;
    world.scale.setScalar(1 - scrollP * 0.25);
    world.position.y = baseY + scrollP * 2.2;
    stars.rotation.y = t * 0.004;

    renderer.render(scene, camera);

    // node labels
    const w = canvas.clientWidth, h = canvas.clientHeight;
    for (const n of nodes) {
      n.dot.getWorldPosition(tmp);
      const behind = tmp.z < -1.2;
      tmp.project(camera);
      const x = (tmp.x * 0.5 + 0.5) * w, y = (-tmp.y * 0.5 + 0.5) * h;
      n.label.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      // keep labels away from the headline: hidden on phones, faded over the text column on desktop
      const overText = x < w * 0.5;
      n.label.style.opacity = mobile ? 0 : Math.max(0, (behind ? 0.25 : overText ? 0.12 : 1) - scrollP * 1.5);
    }
  }
  frame();
  return { setScroll(p) { scrollP = p; } };
}

function radial(hex) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  const col = new THREE.Color(hex);
  const rgb = `${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)}`;
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.25, `rgba(${rgb},0.35)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
