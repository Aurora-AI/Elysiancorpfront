import React, { useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const ConcaveScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = null; // Let CSS handle the background if needed, or set to null for transparency

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Concave Geometry
    const geometry = new THREE.PlaneGeometry(22, 12, 64, 32);
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = -Math.pow(x, 2) * 0.04 - Math.pow(y, 2) * 0.02;
        positions.setZ(i, z);
    }
    positions.needsUpdate = true;

    // Material: Parchment
    const material = new THREE.MeshStandardMaterial({
        color: '#F4F1EA',
        roughness: 0.85,
        metalness: 0.05,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0 // Start invisible for the Rule of Silence
    });

    const screen = new THREE.Mesh(geometry, material);
    scene.add(screen);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight('#D4AF37', 2, 25);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // GSAP quickTo for ultra-smooth mouse parallax
    const xTo = gsap.quickTo(screen.rotation, "y", { duration: 1.2, ease: "power3.out" });
    const yTo = gsap.quickTo(screen.rotation, "x", { duration: 1.2, ease: "power3.out" });

    const onMouseMove = (event: MouseEvent) => {
        const mx = (event.clientX / window.innerWidth) * 2 - 1;
        const my = -(event.clientY / window.innerHeight) * 2 + 1;
        xTo(mx * 0.12);
        yTo(-my * 0.06);
    };
    window.addEventListener('mousemove', onMouseMove);

    // Entrance Animation (Rule of Silence: 0.8s)
    gsap.to(material, {
        opacity: 1,
        duration: 2.5,
        delay: 0.8,
        ease: "power2.inOut"
    });

    gsap.from(screen.position, {
        z: -2,
        duration: 3,
        delay: 0.8,
        ease: "expo.out"
    });

    // Animation Loop (Focus only on Render)
    let raf = 0;
    const animate = () => {
        raf = requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(raf);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        mountRef.current?.removeChild(renderer.domElement);
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100vh', position: 'absolute', inset: 0 }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

// Removed default export for named export uniformity
