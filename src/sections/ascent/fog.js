import { Color, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer } from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uDensity;
  uniform float uOffset;
  uniform vec2 uResolution;
  uniform vec3 uShadow;
  uniform vec3 uLight;
  uniform vec3 uWarm;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = vUv * vec2(uResolution.x / uResolution.y, 1.0) * 2.4;
    p.y += uOffset * 4.0;
    float n = fbm(p + fbm(p * 0.7 + 3.1) * 0.9);

    float alpha = clamp(uDensity * (0.6 + 0.8 * n) * 1.45, 0.0, 1.0);
    vec3 col = mix(uShadow, uLight, smoothstep(0.25, 0.85, n));
    float underglow = smoothstep(0.75, 0.0, vUv.y) * (1.0 - uOffset) * 0.4;
    col = mix(col, uWarm, underglow * n);

    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`;

export const createFog = (canvas, state) => {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false });
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = {
    uDensity: { value: 0 },
    uOffset: { value: 0 },
    uResolution: { value: new Vector2(1, 1) },
    uShadow: { value: new Color('#2a3a52') },
    uLight: { value: new Color('#9aa8ba') },
    uWarm: { value: new Color('#e8a853') },
  };
  scene.add(
    new Mesh(
      new PlaneGeometry(2, 2),
      new ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthWrite: false }),
    ),
  );

  let raf = 0;
  let visible = false;

  const draw = () => {
    raf = 0;
    uniforms.uDensity.value = state.density;
    uniforms.uOffset.value = state.offset;
    const show = state.density > 0.001;
    if (show !== visible) {
      canvas.style.visibility = show ? 'visible' : 'hidden';
      visible = show;
    }
    if (show) renderer.render(scene, camera);
  };

  const render = () => {
    if (!raf) raf = requestAnimationFrame(draw);
  };

  const resize = () => {
    // The fog is soft noise; rendering at a reduced resolution is invisible and much cheaper.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2) * 0.5);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    uniforms.uResolution.value.set(canvas.clientWidth, canvas.clientHeight);
    render();
  };

  window.addEventListener('resize', resize);
  resize();
  return { render };
};
