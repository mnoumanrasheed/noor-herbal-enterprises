"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080706, 0.035);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

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
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5e0, 0.9);
    scene.add(ambientLight);

    const goldPoint = new THREE.PointLight(0xc9a84c, 3.0, 15);
    goldPoint.position.set(4, 3, 4);
    scene.add(goldPoint);

    const warmPoint = new THREE.PointLight(0xd97724, 2.5, 12);
    warmPoint.position.set(-4, -2, 2);
    scene.add(warmPoint);

    // --- Floating Golden Dust Particles (No Dark Orbit Rings) ---
    const particleCount = 240;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    // Particle texture creation (Glowing Gold Particle)
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 32;
    pCanvas.height = 32;
    const ctx = pCanvas.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, "rgba(255, 235, 160, 1)");
      g.addColorStop(0.35, "rgba(201, 168, 76, 0.8)");
      g.addColorStop(0.8, "rgba(160, 110, 30, 0.2)");
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTex = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.22,
      map: particleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffe8a3,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    rootGroup.add(particles);

    // --- Mouse Parallax Handler ---
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId: number;
    let isVisible = true;

    const onPointerMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetX = nx;
      targetY = ny;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      currentX += (targetX - currentX) * 0.035;
      currentY += (targetY - currentY) * 0.035;

      rootGroup.rotation.y = currentX * 0.35 + elapsed * (prefersReducedMotion ? 0 : 0.04);
      rootGroup.rotation.x = currentY * 0.25 + Math.sin(elapsed * 0.3) * 0.02;

      if (!prefersReducedMotion) {
        particles.rotation.y = -elapsed * 0.03;
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", handleResize);

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentElement === container) {
          container.removeChild(renderer.domElement);
        }
      }

      particleGeom.dispose();
      particleMat.dispose();
      particleTex.dispose();
    };
  }, []);

  if (!webglSupported) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-5 pointer-events-none w-full h-full"
      aria-hidden="true"
    />
  );
}
