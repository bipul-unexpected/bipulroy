import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeOrb() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 4.8;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !reducedMotion });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    const geometry = new THREE.IcosahedronGeometry(1.25, 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.42,
    });
    const orb = new THREE.Mesh(geometry, material);
    group.add(orb);

    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(240 * 3);
    for (let index = 0; index < particlePositions.length; index += 3) {
      const radius = 1.65 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[index] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[index + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[index + 2] = radius * Math.cos(phi);
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: 0xa855f7, size: 0.025, transparent: true, opacity: 0.7 }),
    );
    group.add(particles);
    scene.add(group);

    const pointer = { x: 0, y: 0 };
    const handlePointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.5;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.35;
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    let animationFrame = 0;
    const render = () => {
      if (!reducedMotion) {
        group.rotation.y += 0.0025;
        group.rotation.x += (pointer.y - group.rotation.x) * 0.02;
        group.position.x += (pointer.x * 0.18 - group.position.x) * 0.02;
      }
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointer);
      geometry.dispose();
      material.dispose();
      particleGeometry.dispose();
      (particles.material as THREE.PointsMaterial).dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} aria-hidden className="pointer-events-none h-[18rem] w-full sm:h-[24rem]" />;
}
