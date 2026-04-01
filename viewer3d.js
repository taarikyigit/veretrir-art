/* ═══════════════════════════════════════════════════════════════════
   VIEWER3D.JS — Three.js 3D model viewer
   Loads .glb files, supports rotate/zoom, optional fullscreen
═══════════════════════════════════════════════════════════════════ */

/* Three.js is loaded from CDN in artworks.html when a model is present.
   This file sets up the viewer when openViewer() is called.           */

let _viewer = null;

function openViewer(modelPath) {
  if (!modelPath) return;
  const overlay = document.getElementById('viewerOverlay');
  overlay.classList.add('open');

  // Lazy-load Three.js + GLTFLoader if not already present
  if (typeof THREE === 'undefined') {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', () => {
      loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js', () => {
        loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js', () => {
          initViewer(modelPath);
        });
      });
    });
  } else {
    initViewer(modelPath);
  }
}

function closeViewer() {
  const overlay = document.getElementById('viewerOverlay');
  overlay.classList.remove('open');
  if (_viewer) {
    cancelAnimationFrame(_viewer.raf);
    _viewer.renderer.dispose();
    _viewer = null;
    const canvas = document.getElementById('viewer3d');
    canvas.getContext('webgl') && canvas.getContext('webgl').getExtension('WEBGL_lose_context')?.loseContext();
  }
}

function initViewer(modelPath) {
  const canvas = document.getElementById('viewer3d');
  const W = canvas.clientWidth || window.innerWidth;
  const H = canvas.clientHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene  = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);

  const camera = new THREE.PerspectiveCamera(40, W/H, 0.01, 1000);
  camera.position.set(0, 0, 3);

  // lights
  const ambL = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambL);
  const dirL = new THREE.DirectionalLight(0xffffff, 1.2);
  dirL.position.set(5, 8, 6);
  scene.add(dirL);
  const fillL = new THREE.DirectionalLight(0xd0ccc0, 0.4);
  fillL.position.set(-4, -2, -4);
  scene.add(fillL);

  // orbit controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 0.5;
  controls.maxDistance = 20;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.6;

  // load model
  const loader = new THREE.GLTFLoader();
  loader.load(
    modelPath,
    gltf => {
      const model = gltf.scene;
      // center + fit
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size   = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      model.position.sub(center);
      const scale  = 1.8 / maxDim;
      model.scale.setScalar(scale);
      scene.add(model);
      camera.position.set(0, 0, 2.5);
      controls.update();
    },
    undefined,
    err => {
      console.warn('3D model could not be loaded:', modelPath, err);
    }
  );

  // animate loop
  function loop() {
    _viewer.raf = requestAnimationFrame(loop);
    controls.update();
    renderer.render(scene, camera);
  }

  // resize
  window.addEventListener('resize', () => {
    if (!_viewer) return;
    const W2 = canvas.clientWidth || window.innerWidth;
    const H2 = canvas.clientHeight || window.innerHeight;
    camera.aspect = W2 / H2;
    camera.updateProjectionMatrix();
    renderer.setSize(W2, H2);
  });

  _viewer = { renderer, raf:null };
  loop();
}

function loadScript(src, cb) {
  const s = document.createElement('script');
  s.src = src;
  s.onload = cb;
  document.head.appendChild(s);
}
