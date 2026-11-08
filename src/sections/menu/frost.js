import {
  Color,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  SRGBColorSpace,
  Scene,
  ShaderMaterial,
  Texture,
  WebGLRenderer,
} from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uFrom;
  uniform sampler2D uTo;
  uniform float uMix;
  uniform float uFrost;
  uniform float uSeed;
  uniform vec3 uIce;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
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

  // Distances to the nearest and second-nearest cell points.
  vec2 voronoi(vec2 x) {
    vec2 n = floor(x);
    vec2 f = fract(x);
    float f1 = 8.0;
    float f2 = 8.0;
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 r = g + hash2(n + g) - f;
        float d = dot(r, r);
        if (d < f1) {
          f2 = f1;
          f1 = d;
        } else if (d < f2) {
          f2 = d;
        }
      }
    }
    return vec2(sqrt(f1), sqrt(f2));
  }

  void main() {
    vec2 uv = vUv;
    float r = length(uv - 0.5) * 2.0;

    vec2 q = uv * 4.0 + uSeed;
    float warp = fbm(q + fbm(q * 1.7) * 1.2);
    // Frost starts at the rim and in patches, then spreads inward.
    float growth = warp * 0.75 + r * 0.55;
    float front = 1.35 - uFrost * 1.5;
    float cover = smoothstep(front, front + 0.08, growth);

    vec2 cell = voronoi(uv * 22.0 + warp * 3.0);
    float facets = 1.0 - smoothstep(0.0, 0.05, cell.y - cell.x);
    float veins = pow(1.0 - abs(fbm(uv * 9.0 + uSeed * 2.0) * 2.0 - 1.0), 10.0);
    float sparkle = step(0.985, hash(floor(uv * 420.0)));

    vec2 bend = (vec2(fbm(uv * 14.0), fbm(uv * 14.0 + 7.3)) - 0.5) * 0.035 * cover;
    vec3 dish = mix(texture2D(uFrom, uv + bend).rgb, texture2D(uTo, uv + bend).rgb, uMix);

    // The dish shows through thin frost but is fully hidden at peak cover, so the swap is never seen.
    float hidden = smoothstep(0.7, 1.0, uFrost);
    vec3 ice = uIce * (0.18 + 0.32 * warp);
    vec3 frost = dish * 0.45 * (1.0 - hidden) + ice + (facets * 0.16 + veins * 0.4 + sparkle * 0.6) * uIce;
    float rim = smoothstep(0.0, 0.5, cover) * smoothstep(1.0, 0.5, cover);

    vec3 col = mix(dish, frost, cover) + rim * 0.25 * uIce;
    float fade = 1.0 - smoothstep(0.8, 1.0, r);

    gl_FragColor = vec4(col, fade);
    #include <colorspace_fragment>
  }
`;

const toTexture = (img) => {
  const texture = new Texture(img);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
};

export const createFrost = (canvas, images, state) => {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false });
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const textures = images.map(toTexture);
  const uniforms = {
    uFrom: { value: textures[0] },
    uTo: { value: textures[0] },
    uMix: { value: 0 },
    uFrost: { value: 1 },
    uSeed: { value: 0 },
    uIce: { value: new Color('#cdd9e4') },
  };
  scene.add(
    new Mesh(
      new PlaneGeometry(2, 2),
      new ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthWrite: false }),
    ),
  );

  let raf = 0;
  const draw = () => {
    raf = 0;
    uniforms.uFrom.value = textures[state.from];
    uniforms.uTo.value = textures[state.to];
    uniforms.uMix.value = state.mix;
    uniforms.uFrost.value = state.frost;
    uniforms.uSeed.value = state.seed * 3.7;
    renderer.render(scene, camera);
  };

  const render = () => {
    if (!raf) raf = requestAnimationFrame(draw);
  };

  const resize = () => {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    render();
  };

  window.addEventListener('resize', resize);
  resize();
  return { render };
};
