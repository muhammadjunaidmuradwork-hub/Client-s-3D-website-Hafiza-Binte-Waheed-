/* ============================================
   THREE.JS HERO 3D SCENE — scroll-linked
   Hafiza Binte Waheed — Quran Academy
   ============================================ */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const isMobile = window.innerWidth <= 768;
  const starCount = isMobile ? 350 : 900;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const colors = [
    0xEDA2A2, 0xC2185B, 0xA8174A, 0xC9A84C,
    0xE8C97A, 0xFFFFFF, 0x7B1040, 0xF7C7C0,
  ];

  // ---- Stars ----
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3]     = (Math.random() - 0.5) * 120;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    const c = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
    starColors[i * 3] = c.r; starColors[i * 3 + 1] = c.g; starColors[i * 3 + 2] = c.b;
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({
    size: isMobile ? 0.28 : 0.38,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  scene.add(stars);

  // ---- Geometric shapes ----
  function createShape(type, size, color, opacity) {
    let geo;
    if (type === 'ring') geo = new THREE.TorusGeometry(size, size * 0.06, 8, 32);
    else if (type === 'octagon') geo = new THREE.CylinderGeometry(size, size, 0.05, 8);
    else geo = new THREE.CylinderGeometry(size, size, 0.03, 6);

    return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color, transparent: true, opacity,
      wireframe: type !== 'ring',
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
  }

  const shapes = [];
  [
    { type: 'ring', size: 8, color: 0xEDA2A2, opacity: 0.18, x: -12, y: 5, z: -10 },
    { type: 'ring', size: 5, color: 0xC9A84C, opacity: 0.22, x: 15, y: -3, z: -8 },
    { type: 'ring', size: 3, color: 0xC2185B, opacity: 0.28, x: -5, y: -8, z: -5 },
    { type: 'octagon', size: 4, color: 0xEDA2A2, opacity: 0.1, x: 10, y: 8, z: -12 },
    { type: 'ring', size: 12, color: 0x7B1040, opacity: 0.07, x: 0, y: 0, z: -20 },
    { type: 'ring', size: 2, color: 0xE8C97A, opacity: 0.25, x: -8, y: 6, z: -4 },
    { type: 'ring', size: 6, color: 0xC2185B, opacity: 0.12, x: 18, y: -8, z: -18 },
  ].forEach((d) => {
    const mesh = createShape(d.type, d.size, d.color, d.opacity);
    mesh.position.set(d.x, d.y, d.z);
    mesh.userData = {
      baseX: d.x, baseY: d.y,
      baseOpacity: d.opacity,
      speed: Math.random() * 0.3 + 0.1,
      phase: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.01,
    };
    shapes.push(mesh);
    scene.add(mesh);
  });

  // ---- Crescent ----
  const crescent = new THREE.Group();
  const outerT = new THREE.Mesh(
    new THREE.TorusGeometry(3.5, 0.12, 8, 48, Math.PI * 1.4),
    new THREE.MeshBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  outerT.rotation.z = Math.PI * 0.3;
  crescent.add(outerT);
  const innerT = new THREE.Mesh(
    new THREE.TorusGeometry(2.8, 0.08, 8, 48, Math.PI * 1.2),
    new THREE.MeshBasicMaterial({ color: 0xE8C97A, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  innerT.rotation.z = Math.PI * 0.5;
  crescent.add(innerT);
  crescent.position.set(5, 4, 0);
  crescent.scale.setScalar(1.5);
  scene.add(crescent);

  // ---- Sparkles ----
  const sparkleGeo = new THREE.BufferGeometry();
  const sparklePos = new Float32Array(100 * 3);
  for (let i = 0; i < 100; i++) {
    sparklePos[i * 3]     = (Math.random() - 0.5) * 80;
    sparklePos[i * 3 + 1] = (Math.random() - 0.5) * 50;
    sparklePos[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }
  sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));
  const sparkleMat = new THREE.PointsMaterial({
    size: 0.55, color: 0xE8C97A, transparent: true, opacity: 0.55,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
  scene.add(sparkles);

  // ---- Mouse + scroll state ----
  const mouse = { x: 0, y: 0 };
  const smoothMouse = { x: 0, y: 0 };
  let scrollProgress = 0;

  document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Scroll-linked hero 3D (via ScrollTrigger if available)
  function bindScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => { scrollProgress = self.progress; },
    });

    gsap.to(camera.position, {
      z: 45,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(bindScroll, 500));
  } else {
    setTimeout(bindScroll, 500);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    smoothMouse.x += (mouse.x - smoothMouse.x) * 0.04;
    smoothMouse.y += (mouse.y - smoothMouse.y) * 0.04;

    camera.position.x = smoothMouse.x * 3 * (1 - scrollProgress * 0.5);
    camera.position.y = -smoothMouse.y * 2 * (1 - scrollProgress * 0.5);
    camera.lookAt(scene.position);

    stars.rotation.y = t * 0.012;
    stars.rotation.x = t * 0.006;
    stars.material.opacity = 0.85 * (1 - scrollProgress * 0.7);

    sparkleMat.opacity = (0.45 + Math.sin(t * 2) * 0.2) * (1 - scrollProgress * 0.6);
    sparkles.rotation.y = -t * 0.018;

    shapes.forEach((s) => {
      const { baseX, baseY, baseOpacity, speed, phase, rotSpeed } = s.userData;
      s.position.y = baseY + Math.sin(t * speed + phase) * 1.8;
      s.position.x = baseX + Math.cos(t * speed * 0.7 + phase) * 1;
      s.rotation.z += rotSpeed;
      s.material.opacity = baseOpacity * (1 - scrollProgress * 0.8);
    });

    crescent.rotation.z = Math.sin(t * 0.3) * 0.1 + scrollProgress * 0.5;
    crescent.position.y = 4 + Math.sin(t * 0.5) * 0.8 - scrollProgress * 8;
    crescent.scale.setScalar(1.5 * (1 - scrollProgress * 0.3));

    renderer.render(scene, camera);
  }

  animate();

  window.HBW = window.HBW || {};
  window.HBW.heroScene = { scene, camera, renderer };
})();
