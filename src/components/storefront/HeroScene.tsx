"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function createJar(material: THREE.Material, gold: THREE.Material) {
  const vessel = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.72, 1.15, 32), material);
  const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.68, 0.16, 32), material);
  shoulder.position.y = 0.65;
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.73, 0.73, 0.15, 32), gold);
  lid.position.y = 0.82;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.035, 8, 32), gold);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.75;
  vessel.add(body, shoulder, lid, rim);
  return vessel;
}

function createBottle(material: THREE.Material, gold: THREE.Material, tall = false) {
  const vessel = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(tall ? 0.42 : 0.48, tall ? 0.48 : 0.54, tall ? 1.8 : 1.45, 32),
    material,
  );
  const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(tall ? 0.3 : 0.37, tall ? 0.42 : 0.48, 0.22, 32), material);
  shoulder.position.y = tall ? 0.98 : 0.8;
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.3, 24), material);
  neck.position.y = tall ? 1.23 : 1.04;
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.15, 24), gold);
  cap.position.y = tall ? 1.46 : 1.25;
  vessel.add(body, shoulder, neck, cap);
  return vessel;
}

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = (navigator.hardwareConcurrency || 8) <= 4 || Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    if (reducedMotion || lowPower || mobile) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b0b0a, 5, 11);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 1.05, 7.1);

    scene.add(new THREE.HemisphereLight(0x6b5b45, 0x070707, 1.7));
    const keyLight = new THREE.PointLight(0xf2cc77, 22, 8, 2);
    keyLight.position.set(2.8, 3.8, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(512, 512);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x9a6a2a, 14, 7, 2);
    rimLight.position.set(-3.2, 1.3, -1.5);
    scene.add(rimLight);

    const darkGlass = new THREE.MeshPhysicalMaterial({ color: 0x24211d, roughness: 0.22, metalness: 0.26, clearcoat: 0.55 });
    const amberGlass = new THREE.MeshPhysicalMaterial({ color: 0x6b3d1e, roughness: 0.26, metalness: 0.18, clearcoat: 0.6, transmission: 0.05 });
    const creamGlass = new THREE.MeshPhysicalMaterial({ color: 0xbca98a, roughness: 0.38, metalness: 0.1, clearcoat: 0.45 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xd1a64e, roughness: 0.25, metalness: 0.8 });

    const products = new THREE.Group();
    const jar = createJar(amberGlass, gold);
    jar.position.set(-1.3, 0.62, 0.15);
    jar.rotation.z = -0.05;
    jar.scale.setScalar(1.05);
    const pickleJar = createJar(darkGlass, gold);
    pickleJar.position.set(0.1, 0.54, -0.38);
    pickleJar.scale.setScalar(0.88);
    const oil = createBottle(gold, darkGlass, false);
    oil.position.set(1.32, 0.88, 0.22);
    oil.rotation.z = 0.05;
    oil.scale.setScalar(0.94);
    const shampoo = createBottle(creamGlass, gold, true);
    shampoo.position.set(2.05, 1.05, -0.18);
    shampoo.rotation.z = -0.03;
    shampoo.scale.setScalar(0.82);
    products.add(jar, pickleJar, oil, shampoo);
    products.rotation.y = -0.2;
    scene.add(products);

    const floor = new THREE.Mesh(new THREE.CircleGeometry(4.1, 64), new THREE.MeshStandardMaterial({ color: 0x0e0d0c, roughness: 0.52, metalness: 0.12 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.04;
    floor.receiveShadow = true;
    scene.add(floor);

    const resize = () => {
      const width = canvas.clientWidth || 640;
      const height = canvas.clientHeight || 560;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.26;
      targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.12;
    };
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });

    let frame = 0;
    let lastRender = 0;
    const animate = (time: number) => {
      frame = requestAnimationFrame(animate);
      if (time - lastRender < 32) return;
      lastRender = time;
      pointerX += (targetX - pointerX) * 0.05;
      pointerY += (targetY - pointerY) * 0.05;
      products.rotation.y = -0.2 + pointerX + Math.sin(time * 0.00035) * 0.035;
      products.rotation.x = pointerY;
      renderer.render(scene, camera);
    };
    setActive(true);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener("pointermove", onPointerMove);
      observer.disconnect();
      renderer.dispose();
      [darkGlass, amberGlass, creamGlass, gold].forEach((material) => material.dispose());
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
      });
    };
  }, []);

  return (
    <div className="hero-scene" aria-hidden="true">
      <div className={`hero-static-scene ${active ? "hero-static-scene-hidden" : ""}`}>
        <div className="fallback-vessel fallback-jar fallback-jar-left" />
        <div className="fallback-vessel fallback-jar fallback-jar-center" />
        <div className="fallback-vessel fallback-bottle fallback-bottle-oil" />
        <div className="fallback-vessel fallback-bottle fallback-bottle-shampoo" />
      </div>
      <canvas ref={canvasRef} className={`hero-canvas ${active ? "hero-canvas-ready" : ""}`} />
    </div>
  );
}
