import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three';
import { gsap } from 'gsap';
import { snowState } from './snow-state.js';

const COUNT = 600;
const GOLD_SHARE = 0.18;
const Y_MIN = -8;
const Y_RANGE = 23;
const FALL_SPEED = 1.2;

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aGold;
  attribute float aSpeed;
  uniform vec2 uPointer;
  uniform float uPixelRatio;
  uniform float uFall;
  varying float vAlpha;
  varying float vGold;
  varying float vSoft;

  void main() {
    vec3 p = position;
    // uFall advances only after midnight; while it is constant every flake hangs still.
    p.y = ${Y_MIN.toFixed(1)} + mod(p.y - ${Y_MIN.toFixed(1)} - uFall * aSpeed, ${Y_RANGE.toFixed(1)});
    p.x += sin(uFall * 0.6 + aSpeed * 40.0) * 0.25 * min(uFall, 1.0);
    float depth = smoothstep(-12.0, 6.0, p.z);
    p.xy += uPointer * mix(0.08, 0.9, depth);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (14.0 / -mv.z);

    vAlpha = mix(0.22, 0.85, depth);
    vGold = aGold;
    vSoft = smoothstep(0.55, 1.0, depth);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uSnow;
  uniform vec3 uCandle;
  varying float vAlpha;
  varying float vGold;
  varying float vSoft;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float edge = mix(0.12, 0.5, vSoft);
    float a = (1.0 - smoothstep(0.5 - edge, 0.5, d)) * vAlpha * mix(1.0, 0.55, vSoft);
    if (a < 0.01) discard;
    gl_FragColor = vec4(mix(uSnow, uCandle, vGold), a);
    #include <colorspace_fragment>
  }
`;

const rand = (min, max) => min + Math.random() * (max - min);

export const createSnow = (canvas) => {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
  const scene = new Scene();
  const camera = new PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 10;

  const positions = [];
  const sizes = [];
  const gold = [];
  const speeds = [];
  for (let i = 0; i < COUNT; i++) {
    positions.push(rand(-14, 14), rand(Y_MIN, Y_MIN + Y_RANGE), rand(-12, 6));
    sizes.push(rand(1.2, 3.6));
    gold.push(Math.random() < GOLD_SHARE ? 1 : 0);
    speeds.push(rand(0.6, 1.4));
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('aSize', new Float32BufferAttribute(sizes, 1));
  geometry.setAttribute('aGold', new Float32BufferAttribute(gold, 1));
  geometry.setAttribute('aSpeed', new Float32BufferAttribute(speeds, 1));

  const uniforms = {
    uPointer: { value: new Vector2() },
    uPixelRatio: { value: 1 },
    uFall: { value: 0 },
    uSnow: { value: new Color('#eef2f5') },
    uCandle: { value: new Color('#e8a853') },
  };

  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
  });
  scene.add(new Points(geometry, material));

  const pointer = { x: 0, y: 0 };
  const current = uniforms.uPointer.value;
  const rendered = { dolly: -1, rise: -1, opacity: -1 };
  let dirty = true;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    uniforms.uPixelRatio.value = dpr;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    dirty = true;
  };

  const tick = (time, deltaTime) => {
    const { dolly, rise, falling } = snowState;
    const opacity = Math.max(snowState.opacity, snowState.finale);
    if (opacity !== rendered.opacity) {
      canvas.style.opacity = opacity;
      rendered.opacity = opacity;
    }
    if (opacity <= 0.001) return;

    const dx = pointer.x - current.x;
    const dy = pointer.y - current.y;
    if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) {
      current.x += dx * 0.06;
      current.y += dy * 0.06;
      dirty = true;
    }
    if (dolly !== rendered.dolly || rise !== rendered.rise) dirty = true;
    if (falling) {
      uniforms.uFall.value += (deltaTime / 1000) * FALL_SPEED;
      dirty = true;
    }
    if (!dirty) return;

    camera.position.z = 10 + dolly * 3;
    camera.position.y = rise * 7;
    renderer.render(scene, camera);
    rendered.dolly = dolly;
    rendered.rise = rise;
    dirty = false;
  };

  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
  });
  window.addEventListener('resize', resize);
  resize();
  gsap.ticker.add(tick);
};
