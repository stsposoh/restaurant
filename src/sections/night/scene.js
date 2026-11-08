import {
  Box3,
  BoxGeometry,
  CanvasTexture,
  CircleGeometry,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  Scene,
  ShaderMaterial,
  SpotLight,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { drawDial } from './dial.js';

const BASE = import.meta.env.BASE_URL;
const TAU = Math.PI * 2;
const DUSK = new Color('#2a2638');
const NIGHT = new Color('#141c2a');
const CANDLE = new Color('#e8a853');

const photoVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const photoFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uSweep;
  uniform float uStart;
  uniform float uLight;
  uniform float uAspect;
  uniform vec3 uGlow;
  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    float angle = atan(p.x, p.y);
    float a = mod(angle - uStart + 6.28318530718, 6.28318530718) / 6.28318530718;
    float done = step(1.0, uSweep);
    float reveal = max(done, 1.0 - smoothstep(uSweep - 0.012, uSweep, a));
    float edge = exp(-abs(a - uSweep) * 70.0) * (1.0 - done) * smoothstep(0.0, 0.03, uSweep);

    vec2 uv = vUv + normalize(p + 1e-4) * edge * 0.012;
    vec3 photo = texture2D(uMap, uv).rgb;
    vec2 border = smoothstep(0.0, 0.06, vUv) * smoothstep(0.0, 0.06, 1.0 - vUv);
    float vignette = border.x * border.y;

    vec3 col = photo * (0.2 + 0.8 * uLight) + uGlow * edge * 0.8;
    gl_FragColor = vec4(col, max(reveal, edge) * vignette * smoothstep(0.0, 0.3, uLight));
    #include <colorspace_fragment>
  }
`;

const loadTexture = (loader, url) =>
  new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject);
  });

// Measures where a hand points (radians clockwise from 12) in the clock's own frame.
const handAngle = (clock, node, tip) => {
  node.updateWorldMatrix(true, false);
  const world = node.localToWorld(tip.clone());
  const local = clock.worldToLocal(world);
  return Math.atan2(local.x, local.y);
};

const calibrate = (clock, node, tip) => {
  const a0 = handAngle(clock, node, tip);
  node.rotation.y += 0.1;
  const a1 = handAngle(clock, node, tip);
  node.rotation.y -= 0.1;
  const sign = Math.sign(Math.atan2(Math.sin(a1 - a0), Math.cos(a1 - a0)));
  const rest = node.rotation.y;
  return (angle) => {
    node.rotation.y = rest + sign * (angle - a0);
  };
};

export const createNightScene = async (canvas, photos) => {
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 7);

  const wall = new Mesh(new PlaneGeometry(30, 20), new MeshStandardMaterial({ color: DUSK.clone(), roughness: 0.95 }));
  wall.position.z = -0.7;
  wall.receiveShadow = true;
  scene.add(wall);

  const hemi = new HemisphereLight('#7a6a9a', '#0e1624', 0.9);
  scene.add(hemi);
  const spot = new SpotLight(CANDLE, 110, 0, 0.26, 0.55, 2);
  spot.position.set(-3.5, 4.5, 6);
  spot.castShadow = true;
  spot.shadow.mapSize.set(2048, 2048);
  spot.shadow.bias = -0.0004;
  spot.shadow.radius = 6;
  scene.add(spot, spot.target);
  const rim = new DirectionalLight(CANDLE, 0.6);
  rim.position.set(4, 3, -1);
  scene.add(rim);

  const textureLoader = new TextureLoader();
  const [gltf, base, normal, orm, dialCanvas] = await Promise.all([
    new GLTFLoader().loadAsync(`${BASE}night/clock.glb`),
    loadTexture(textureLoader, `${BASE}night/clock-base.webp`),
    loadTexture(textureLoader, `${BASE}night/clock-normal.webp`),
    loadTexture(textureLoader, `${BASE}night/clock-orm.webp`),
    drawDial(),
  ]);
  base.colorSpace = SRGBColorSpace;
  for (const t of [base, normal, orm]) t.flipY = false;

  const material = new MeshStandardMaterial({
    map: base,
    normalMap: normal,
    roughnessMap: orm,
    metalnessMap: orm,
    roughness: 1,
    metalness: 1,
    alphaTest: 0.5,
    side: 2,
  });

  // Normalise the model: diameter 2, centred, face towards +z.
  const model = gltf.scene;
  model.traverse((o) => {
    if (o.isMesh) {
      o.material = material;
      o.castShadow = true;
    }
  });
  const pivot = new Group();
  pivot.add(model);
  const box = new Box3().setFromObject(model);
  const size = box.getSize(new Vector3());
  model.position.sub(box.getCenter(new Vector3()));
  const depthAxis = ['x', 'y', 'z'].reduce((m, k) => (size[k] < size[m] ? k : m), 'x');
  if (depthAxis === 'y') pivot.rotation.x = Math.PI / 2;
  if (depthAxis === 'x') pivot.rotation.y = Math.PI / 2;
  pivot.scale.setScalar(2 / Math.max(size.x, size.y, size.z));

  const clock = new Group();
  clock.add(pivot);
  scene.add(clock);
  clock.updateWorldMatrix(true, true);

  const findMesh = (pattern) => {
    let found = null;
    model.traverse((o) => {
      if (!found && o.isMesh && pattern.test(o.name)) found = o;
    });
    return found;
  };
  const hourNode = findMesh(/Hour/);
  const minuteNode = findMesh(/Minute/);
  // After normalisation this model already faces +z (checked by rendering); its hands sit behind the bbox centre.
  const handDepth = clock.worldToLocal(new Box3().setFromObject(minuteNode).getCenter(new Vector3())).z;

  const setHour = calibrate(clock, hourNode, new Vector3(0, 0, 0.2));
  const setMinute = calibrate(clock, minuteNode, new Vector3(0.15, 0, 0));

  const dialTexture = new CanvasTexture(dialCanvas);
  dialTexture.colorSpace = SRGBColorSpace;
  dialTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const dial = new Mesh(new CircleGeometry(0.645, 96), new MeshStandardMaterial({ map: dialTexture, roughness: 0.8 }));
  dial.position.z = handDepth - 0.012;
  dial.receiveShadow = true;
  clock.add(dial);

  const second = new Object3D();
  second.position.z = handDepth + 0.01;
  const brass = new MeshStandardMaterial({ color: '#b8893a', metalness: 1, roughness: 0.35 });
  const needle = new Mesh(new BoxGeometry(0.008, 0.62, 0.004), brass);
  needle.position.y = 0.21;
  const counterweight = new Mesh(new CircleGeometry(0.035, 32), brass);
  counterweight.position.y = -0.1;
  const hub = new Mesh(new CircleGeometry(0.022, 32), brass);
  hub.position.z = 0.003;
  second.add(needle, counterweight, hub);
  second.traverse((o) => {
    o.castShadow = true;
  });
  clock.add(second);

  const photoTextures = photos.map((img) => {
    const t = new Texture(img);
    t.colorSpace = SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  });
  const photoUniforms = {
    uMap: { value: photoTextures[0] },
    uSweep: { value: 0 },
    uStart: { value: 0 },
    uLight: { value: 0 },
    uAspect: { value: 16 / 9 },
    uGlow: { value: CANDLE.clone() },
  };
  const photo = new Mesh(
    new PlaneGeometry(3.4, 3.4 / (photos[0].naturalWidth / photos[0].naturalHeight)),
    new ShaderMaterial({ vertexShader: photoVertex, fragmentShader: photoFragment, uniforms: photoUniforms, transparent: true }),
  );
  photoUniforms.uAspect.value = photos[0].naturalWidth / photos[0].naturalHeight;
  photo.position.z = 0.15;
  scene.add(photo);

  const target = new Vector3();
  const project = (object, offset) => {
    const v = offset.clone();
    object.localToWorld(v);
    v.project(camera);
    return { x: ((v.x + 1) / 2) * canvas.clientWidth, y: ((1 - v.y) / 2) * canvas.clientHeight };
  };

  const resize = () => {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  };
  resize();

  const render = (s) => {
    const minutes = s.time / 60;
    setMinute((minutes / 60) * TAU);
    setHour((minutes / 720) * TAU);
    second.rotation.z = -(s.seconds / 60) * TAU;

    clock.position.set(s.clock.x, s.clock.y, 0);
    clock.rotation.set(s.clock.rx + s.pointer.y * 0.05, s.clock.ry + s.pointer.x * 0.08, s.clock.rz);
    clock.scale.setScalar(s.clock.scale);

    photo.visible = s.photo.light > 0.001 || s.photo.sweep > 0;
    photo.position.x = s.photo.x;
    photo.position.y = 0.3;
    photo.rotation.set(-s.pointer.y * 0.04, s.photo.ry + s.pointer.x * 0.06, 0);
    photoUniforms.uMap.value = photoTextures[s.photo.index];
    photoUniforms.uSweep.value = s.photo.sweep;
    photoUniforms.uStart.value = s.photo.start;
    photoUniforms.uLight.value = s.photo.light;

    target.lerpVectors(clock.position, photo.position, s.photo.light);
    spot.target.position.copy(target);
    spot.position.set(-3.5 + target.x * 0.6, 4.5, 6);
    rim.intensity = 0.4 + 0.8 * s.photo.light;

    wall.material.color.lerpColors(DUSK, NIGHT, s.night);
    hemi.intensity = 0.9 - 0.5 * s.night;

    renderer.render(scene, camera);
    return {
      readout: project(clock, new Vector3(0, -1.12, 0)),
      photoCorner: project(photo, new Vector3(-1.7, -0.96, 0)),
    };
  };

  window.addEventListener('resize', resize);
  return { render, resize };
};
