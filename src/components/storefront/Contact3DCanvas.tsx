"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function Contact3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL support safely
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0b0a, 0.04);

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Main 3D Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xfff2d4, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffdf9e, 2.5);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc9a84c, 2.0);
    rimLight.position.set(-6, -4, -3);
    scene.add(rimLight);

    const amberLight = new THREE.PointLight(0xe8aa42, 3.2, 12);
    amberLight.position.set(1, 0.5, 1);
    scene.add(amberLight);

    // --- 1. Translucent Amber & Gold Nectar Droplet (Core Sculptural Element) ---
    const coreGeometry = new THREE.IcosahedronGeometry(1.4, 16);
    const corePositionAttribute = coreGeometry.getAttribute("position");
    const originalPositions = corePositionAttribute.array.slice();

    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xd49838),
      emissive: new THREE.Color(0x3a200a),
      emissiveIntensity: 0.4,
      roughness: 0.18,
      metalness: 0.12,
      transmission: 0.65,
      thickness: 1.6,
      ior: 1.45,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    rootGroup.add(coreMesh);

    // Inner Glowing Nucleus
    const nucleusGeom = new THREE.SphereGeometry(0.68, 24, 24);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0xffd369,
      emissive: 0xe6a117,
      emissiveIntensity: 0.85,
      roughness: 0.25,
      metalness: 0.6,
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeom, nucleusMat);
    coreMesh.add(nucleusMesh);

    // --- 2. Golden Concentric Orbit Rings ---
    const ringGroup = new THREE.Group();
    rootGroup.add(ringGroup);

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd6b258,
      metalness: 0.92,
      roughness: 0.2,
      emissive: 0x2e230e,
      emissiveIntensity: 0.25,
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.02, 16, 120), goldMaterial);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    ringGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.75, 0.015, 16, 120), goldMaterial);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    ringGroup.add(ring2);

    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(3.15, 0.012, 16, 120), goldMaterial);
    ring3.rotation.y = Math.PI / 2.4;
    ring3.rotation.z = -Math.PI / 8;
    ringGroup.add(ring3);

    // --- 3. Floating Botanical Leaf Sculptures ---
    function createLeafGeometry(): THREE.BufferGeometry {
      const shape = new THREE.Shape();
      shape.moveTo(0, -0.55);
      shape.bezierCurveTo(0.32, -0.28, 0.42, 0.18, 0, 0.55);
      shape.bezierCurveTo(-0.42, 0.18, -0.32, -0.28, 0, -0.55);

      const extrudeSettings = {
        depth: 0.035,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.025,
        bevelThickness: 0.025,
      };
      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    const leafMat1 = new THREE.MeshStandardMaterial({
      color: 0x3d5a36,
      roughness: 0.35,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });
    const leafMat2 = new THREE.MeshStandardMaterial({
      color: 0x577249,
      roughness: 0.4,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const leafGeom = createLeafGeometry();
    const leaves: THREE.Mesh[] = [];
    const leafData = [
      { pos: [2.1, 1.3, 0.7], rot: [0.3, 0.8, 0.4], scale: 0.85, mat: leafMat1, speed: 0.7 },
      { pos: [-2.3, 0.8, -0.6], rot: [-0.4, 0.5, -0.3], scale: 0.9, mat: leafMat2, speed: 0.85 },
      { pos: [1.7, -1.7, -0.5], rot: [0.6, -0.4, 0.7], scale: 0.75, mat: leafMat1, speed: 0.65 },
      { pos: [-1.8, -1.4, 0.8], rot: [-0.5, -0.6, 0.2], scale: 0.8, mat: leafMat2, speed: 0.9 },
      { pos: [0.2, 2.4, -0.6], rot: [0.2, 0.1, 0.8], scale: 0.7, mat: leafMat1, speed: 0.75 },
    ];

    leafData.forEach((data) => {
      const leaf = new THREE.Mesh(leafGeom, data.mat);
      leaf.position.set(data.pos[0], data.pos[1], data.pos[2]);
      leaf.rotation.set(data.rot[0], data.rot[1], data.rot[2]);
      leaf.scale.setScalar(data.scale);
      rootGroup.add(leaf);
      leaves.push(leaf);
    });

    // --- 4. Swirling Golden Pollen Particles ---
    const particleCount = 150;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.7 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    // Canvas particle texture
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 32;
    pCanvas.height = 32;
    const ctx = pCanvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255, 225, 140, 1)");
      gradient.addColorStop(0.3, "rgba(220, 175, 75, 0.8)");
      gradient.addColorStop(0.8, "rgba(180, 130, 40, 0.2)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(pCanvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.16,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffe89e,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    rootGroup.add(particles);

    // --- Parallax & Animation Loop ---
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId: number;
    let isVisible = true;

    const onPointerMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetX = Math.max(-1, Math.min(1, nx));
      targetY = Math.max(-1, Math.min(1, ny));
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave, { passive: true });

    // IntersectionObserver to freeze animation offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Damped pointer rotation
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;

      rootGroup.rotation.y = currentX * 0.4 + elapsed * (prefersReducedMotion ? 0 : 0.1);
      rootGroup.rotation.x = currentY * 0.3 + Math.sin(elapsed * 0.4) * 0.04;

      // Organic droplet distortion
      if (!prefersReducedMotion) {
        const positions = corePositionAttribute.array as Float32Array;
        const count = corePositionAttribute.count;
        for (let i = 0; i < count; i++) {
          const u = originalPositions[i * 3];
          const v = originalPositions[i * 3 + 1];
          const w = originalPositions[i * 3 + 2];
          const wave = Math.sin(elapsed * 1.4 + u * 2.0 + v * 1.5) * 0.07;
          positions[i * 3] = u * (1 + wave);
          positions[i * 3 + 1] = v * (1 + wave);
          positions[i * 3 + 2] = w * (1 + wave);
        }
        corePositionAttribute.needsUpdate = true;

        // Rings counter-rotation
        ring1.rotation.z = elapsed * 0.16;
        ring2.rotation.y = -elapsed * 0.12;
        ring3.rotation.x = elapsed * 0.08;

        // Leaves fluttering
        leaves.forEach((leaf, idx) => {
          const speed = leafData[idx].speed;
          leaf.position.y = leafData[idx].pos[1] + Math.sin(elapsed * speed + idx) * 0.1;
          leaf.rotation.z = leafData[idx].rot[2] + Math.cos(elapsed * speed * 0.8 + idx) * 0.12;
        });

        // Particles rotation
        particles.rotation.y = -elapsed * 0.07;
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentElement === container) {
          container.removeChild(renderer.domElement);
        }
      }

      coreGeometry.dispose();
      coreMaterial.dispose();
      nucleusGeom.dispose();
      nucleusMat.dispose();
      leafGeom.dispose();
      leafMat1.dispose();
      leafMat2.dispose();
      goldMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[480px] lg:min-h-[560px] flex items-center justify-center overflow-hidden select-none pointer-events-auto">
      {/* Radial ambient backglow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(201, 168, 76, 0.22) 0%, rgba(212, 155, 61, 0.08) 42%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      {/* WebGL Canvas or Fallback */}
      {webglSupported ? (
        <div ref={containerRef} className="relative z-10 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing" />
      ) : (
        /* CSS Fallback when WebGL is unsupported or disabled */
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-8">
          <div
            className="w-48 h-48 rounded-full border border-[#c9a84c]/40 animate-pulse flex items-center justify-center"
            style={{
              background: "radial-gradient(circle, rgba(201,168,76,0.28) 0%, rgba(45,30,12,0.6) 70%)",
              boxShadow: "0 0 50px rgba(201,168,76,0.25)",
            }}
          >
            <div className="w-32 h-32 rounded-full border border-[#d49b3d]/60 rotate-45 flex items-center justify-center">
              <span className="font-display text-xs uppercase tracking-[0.25em] text-[#e8c872]">
                Noor Herbal Care
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Art Tag */}
      <div
        className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2 rounded-full border border-[#3a352c]/80 bg-[#161412]/80 backdrop-blur-md px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#c9a84c] pointer-events-none shadow-lg"
        aria-hidden="true"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
        Botanical Luxury Atelier
      </div>
    </div>
  );
}
