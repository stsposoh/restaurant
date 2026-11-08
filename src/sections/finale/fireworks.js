import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  OrthographicCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';
import { gsap } from 'gsap';

const MAX = 1400;
const TAIL = 4;
const TAIL_STEP = 0.02;
const GRAVITY = 110;
const DRAG = 1.3;
const COLORS = ['#e8a853', '#eef2f5', '#f3c97d'].map((c) => new Color(c));

const vertexShader = /* glsl */ `
  attribute float aAlpha;
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vAlpha = aAlpha;
    vColor = aColor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = (1.0 - smoothstep(0.1, 0.5, d)) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * a, a);
    #include <colorspace_fragment>
  }
`;

const rand = (a, b) => a + Math.random() * (b - a);

export const createFireworks = (canvas) => {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false });
  const scene = new Scene();
  const camera = new OrthographicCamera(0, 1, 0, 1, -1, 1);

  const p = {
    x: new Float32Array(MAX),
    y: new Float32Array(MAX),
    vx: new Float32Array(MAX),
    vy: new Float32Array(MAX),
    life: new Float32Array(MAX),
    maxLife: new Float32Array(MAX),
    size: new Float32Array(MAX),
    color: new Uint8Array(MAX),
    rocket: new Uint8Array(MAX),
  };
  let cursor = 0;

  const count = MAX * TAIL;
  const position = new BufferAttribute(new Float32Array(count * 3), 3);
  const alpha = new BufferAttribute(new Float32Array(count), 1);
  const size = new BufferAttribute(new Float32Array(count), 1);
  const color = new BufferAttribute(new Float32Array(count * 3), 3);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', position);
  geometry.setAttribute('aAlpha', alpha);
  geometry.setAttribute('aSize', size);
  geometry.setAttribute('aColor', color);
  const uniforms = { uPixelRatio: { value: 1 } };
  scene.add(
    new Points(
      geometry,
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        premultipliedAlpha: true,
      }),
    ),
  );

  let width = 1;
  let height = 1;
  const resize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    uniforms.uPixelRatio.value = dpr;
    camera.right = width;
    camera.bottom = height;
    camera.updateProjectionMatrix();
  };
  resize();

  const spawn = (x, y, vx, vy, life, s, c, rocket = 0) => {
    const i = cursor;
    cursor = (cursor + 1) % MAX;
    p.x[i] = x;
    p.y[i] = y;
    p.vx[i] = vx;
    p.vy[i] = vy;
    p.life[i] = life;
    p.maxLife[i] = life;
    p.size[i] = s;
    p.color[i] = c;
    p.rocket[i] = rocket;
  };

  const scale = () => width / 1440;
  const launch = () => {
    const x = rand(0.15, 0.85) * width;
    const flight = rand(0.8, 1.1);
    const rise = rand(0.32, 0.5) * height;
    // Initial speed that decelerates under gravity to roughly zero at the burst height.
    spawn(x, height * 0.62, rand(-20, 20) * scale(), -(rise / flight + (GRAVITY * flight) / 2), flight, 3.5, 0, 1);
  };

  const burst = (x, y) => {
    const c = Math.floor(Math.random() * COLORS.length);
    const n = Math.round(rand(130, 180));
    const speed = rand(280, 380) * scale();
    for (let k = 0; k < n; k++) {
      const a = Math.random() * Math.PI * 2;
      const v = speed * (0.55 + Math.random() * 0.45);
      spawn(x, y, Math.cos(a) * v, Math.sin(a) * v, rand(1.3, 2.1), rand(3, 4.6), Math.random() < 0.2 ? 1 : c);
    }
  };

  let running = false;
  let nextLaunch = 0;
  let clock = 0;

  const step = (dt) => {
    clock += dt;
    if (clock >= nextLaunch) {
      launch();
      if (Math.random() < 0.3) launch();
      nextLaunch = clock + rand(0.7, 1.4);
    }
    const drag = Math.exp(-DRAG * dt);
    for (let i = 0; i < MAX; i++) {
      if (p.life[i] <= 0) continue;
      p.life[i] -= dt;
      if (p.rocket[i] && p.life[i] <= 0) {
        burst(p.x[i], p.y[i]);
        continue;
      }
      if (!p.rocket[i]) {
        p.vx[i] *= drag;
        p.vy[i] *= drag;
      }
      p.vy[i] += GRAVITY * dt;
      p.x[i] += p.vx[i] * dt;
      p.y[i] += p.vy[i] * dt;
    }

    for (let i = 0; i < MAX; i++) {
      const fade = p.life[i] > 0 ? Math.min(1, p.life[i] / (p.maxLife[i] * 0.6)) : 0;
      const c = COLORS[p.color[i]];
      for (let t = 0; t < TAIL; t++) {
        const v = i * TAIL + t;
        position.setXYZ(v, p.x[i] - p.vx[i] * t * TAIL_STEP, p.y[i] - p.vy[i] * t * TAIL_STEP, 0);
        alpha.setX(v, fade * (1 - t / TAIL));
        size.setX(v, p.size[i] * (1 - t * 0.15));
        color.setXYZ(v, c.r, c.g, c.b);
      }
    }
    position.needsUpdate = true;
    alpha.needsUpdate = true;
    size.needsUpdate = true;
    color.needsUpdate = true;
    renderer.render(scene, camera);
  };

  const tick = (time, deltaTime) => step(Math.min(deltaTime, 50) / 1000);

  window.addEventListener('resize', resize);
  return {
    setRunning: (on) => {
      if (on === running) return;
      running = on;
      if (on) {
        nextLaunch = clock;
        gsap.ticker.add(tick);
      } else {
        gsap.ticker.remove(tick);
      }
    },
  };
};
