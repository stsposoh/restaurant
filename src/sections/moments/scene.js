import {
  BufferGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  Fog,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  SRGBColorSpace,
  Scene,
  Texture,
  Vector3,
  WebGLRenderer,
} from 'three';

const INK = '#0e1624';
const Y_JITTER = [0.35, -0.3, 0.45, -0.4, 0.2, -0.25, 0.4, -0.35];
const PARTICLES = 700;
// Inner edge clearance from the camera axis; must exceed the cursor sway (0.35) so the camera never enters a photo.
const AISLE = 0.45;
const BASE_TURN = 0.14;
const PUSH_TURN = 0.35;
const FLUTTER_ROLL = 0.05;
const FLUTTER_PITCH = 0.06;

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const dotTexture = () => {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.6)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new CanvasTexture(c);
};

export const createMomentsScene = (canvas, images, spacing) => {
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setClearColor(INK);
  const scene = new Scene();
  scene.fog = new Fog(INK, 8, 20);
  const camera = new PerspectiveCamera(45, 1, 0.1, 60);

  const planes = images.map((img, i) => {
    const texture = new Texture(img);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;
    const aspect = img.naturalWidth / img.naturalHeight;
    const height = aspect < 1 ? 2.6 : 1.95;
    const width = height * aspect;
    const side = i % 2 === 0 ? -1 : 1;
    const mesh = new Mesh(new PlaneGeometry(width, height), new MeshBasicMaterial({ map: texture }));
    mesh.position.set(side * (width / 2 + AISLE + (i % 3) * 0.12), Y_JITTER[i % Y_JITTER.length], -i * spacing);
    mesh.rotation.y = -side * BASE_TURN;
    mesh.userData.corner = new Vector3(-width / 2, -height / 2, 0);
    mesh.userData.side = side;
    // Per-photo amplitude and direction so the flutter doesn't move them in lockstep.
    mesh.userData.flutter = (i % 2 === 0 ? 1 : -1) * (0.7 + ((i * 37) % 7) / 10);
    scene.add(mesh);
    return mesh;
  });

  const lastZ = planes.at(-1).position.z;
  const positions = [];
  const colors = [];
  const snow = new Color('#eef2f5');
  const gold = new Color('#e8a853');
  for (let i = 0; i < PARTICLES; i++) {
    positions.push((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 7, 8 - Math.random() * (8 - lastZ + 10));
    const c = Math.random() < 0.25 ? gold : snow;
    colors.push(c.r, c.g, c.b);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  scene.add(
    new Points(
      geometry,
      new PointsMaterial({ size: 0.045, map: dotTexture(), vertexColors: true, transparent: true, opacity: 0.8, depthWrite: false }),
    ),
  );

  const resize = () => {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  };
  resize();

  const corner = new Vector3();
  const render = (cameraZ, pointer, flutter) => {
    camera.position.set(pointer.x * 0.35, -pointer.y * 0.2, cameraZ);
    camera.lookAt(pointer.x * 0.1, 0, cameraZ - 10);
    camera.updateMatrixWorld();

    const captions = planes.map((plane) => {
      const ahead = cameraZ - plane.position.z;
      // The approaching camera pushes the photo aside (turns its inner edge away); the push
      // and the scroll-speed flutter are both caused by the viewer, so they freeze when scrolling stops.
      const push = smoothstep(6, 0.8, ahead);
      const { side, flutter: k } = plane.userData;
      plane.rotation.set(
        -Math.sign(plane.position.y) * 0.06 * push + flutter * FLUTTER_PITCH * k,
        -side * (BASE_TURN + PUSH_TURN * push),
        flutter * FLUTTER_ROLL * k * (0.4 + push),
      );
      plane.updateMatrixWorld();
      corner.copy(plane.userData.corner);
      plane.localToWorld(corner);
      corner.project(camera);
      // Captions are DOM above the canvas, so far ones would show through nearer photos.
      const captionFade = 1 - smoothstep(6, 10, ahead);
      return {
        x: ((corner.x + 1) / 2) * canvas.clientWidth,
        y: ((1 - corner.y) / 2) * canvas.clientHeight,
        // Hide the caption once its corner is about to pass the camera, where the projection breaks down.
        opacity: smoothstep(0.6, 1.5, ahead) * captionFade,
      };
    });
    renderer.render(scene, camera);
    return captions;
  };

  window.addEventListener('resize', resize);
  return { render, resize };
};
