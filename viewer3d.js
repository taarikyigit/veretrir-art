/* ═══════════════════════════════════════════════════════════════
   viewer3d.js — Three.js 3D Model Viewer Class
   Compatible with index.html lightbox
═══════════════════════════════════════════════════════════════ */

class Viewer3D {
  constructor(canvasId, modelPath) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error('Canvas not found:', canvasId);
      return;
    }
    
    this.modelPath = modelPath;
    this.animationId = null;
    
    this.init();
    this.loadModel();
    this.animate();
  }
  
  init() {
    const W = this.canvas.parentElement.clientWidth || 600;
    const H = this.canvas.parentElement.clientHeight || 500;
    
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf5f5f5);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    this.camera.position.set(0, 1, 3);
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas, 
      antialias: true 
    });
    this.renderer.setSize(W, H);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    
    // Controls
    this.controls = new THREE.OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 10;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    this.scene.add(directionalLight);
    
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-5, 5, -5);
    this.scene.add(backLight);
    
    // Handle resize
    this.onResize = () => {
      const W = this.canvas.parentElement.clientWidth || 600;
      const H = this.canvas.parentElement.clientHeight || 500;
      this.camera.aspect = W / H;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(W, H);
    };
    window.addEventListener('resize', this.onResize);
  }
  
  loadModel() {
    const ext = this.modelPath.split('.').pop().toLowerCase();
    
    if (ext === 'glb' || ext === 'gltf') {
      const loader = new THREE.GLTFLoader();
      loader.load(
        this.modelPath,
        (gltf) => {
          this.model = gltf.scene;
          this.centerAndScaleModel();
          this.scene.add(this.model);
        },
        undefined,
        (error) => console.error('Error loading GLTF:', error)
      );
    } else if (ext === 'obj') {
      const loader = new THREE.OBJLoader();
      loader.load(
        this.modelPath,
        (obj) => {
          this.model = obj;
          this.centerAndScaleModel();
          this.scene.add(this.model);
        },
        undefined,
        (error) => console.error('Error loading OBJ:', error)
      );
    } else if (ext === 'fbx') {
      const loader = new THREE.FBXLoader();
      loader.load(
        this.modelPath,
        (fbx) => {
          this.model = fbx;
          this.centerAndScaleModel();
          this.scene.add(this.model);
        },
        undefined,
        (error) => console.error('Error loading FBX:', error)
      );
    }
  }
  
  centerAndScaleModel() {
    if (!this.model) return;
    
    // Center the model
    const box = new THREE.Box3().setFromObject(this.model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    this.model.position.sub(center);
    
    // Scale to fit
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    this.model.scale.setScalar(scale);
    
    // Adjust camera
    this.camera.position.set(0, 1, 3);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }
  
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  
  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    window.removeEventListener('resize', this.onResize);
    
    if (this.model) {
      this.scene.remove(this.model);
      this.model.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    if (this.controls) {
      this.controls.dispose();
    }
  }
}
