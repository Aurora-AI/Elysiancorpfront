import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

// Finer grid → reads as metallic micro-texture instead of competing chunky cubes.
const GRID_SIZE = 90;
const BLOCK_SIZE = 0.16;
const GAP = 0.045;

// Global mouse tracker to bypass any DOM z-index issues
const globalMouse = { x: -999, y: -999 };

if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    globalMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    globalMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

function BlocksMesh() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();
  const reduced = useReducedMotion();

  // Create geometry and material EXPLICITLY to prevent Three.js constructor crashes in SSG/Astro
  const geometry = useMemo(() => new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#1a1a1a', 
    roughness: 0.8, // Matte dark metal
    metalness: 0.5 
  }), []);

  // Create grid data and random phases for "Breathing Core"
  const { positions, phases } = useMemo(() => {
    const pos = [];
    const phs = [];
    const width = GRID_SIZE * (BLOCK_SIZE + GAP);
    const height = GRID_SIZE * (BLOCK_SIZE + GAP);
    const startX = -width / 2;
    const startY = -height / 2;
    
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        pos.push(new THREE.Vector3(
          startX + x * (BLOCK_SIZE + GAP) + (BLOCK_SIZE / 2),
          startY + y * (BLOCK_SIZE + GAP) + (BLOCK_SIZE / 2),
          0
        ));
        // Random phase for sine wave
        phs.push(Math.random() * Math.PI * 2);
      }
    }
    return { positions: pos, phases: phs };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const targetPointer = useRef(new THREE.Vector2(-999, -999));

  // Place blocks at their base grid once so the field is visible even when
  // animation is skipped (prefers-reduced-motion).
  useEffect(() => {
    if (!meshRef.current) return;
    positions.forEach((basePos, i) => {
      dummy.position.copy(basePos);
      dummy.position.z = 0;
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, dummy]);

  useFrame((state) => {
    if (reduced || !meshRef.current) return;

    if (globalMouse.x !== -999) {
      targetPointer.current.x += (globalMouse.x - targetPointer.current.x) * 0.1;
      targetPointer.current.y += (globalMouse.y - targetPointer.current.y) * 0.1;
    }
    
    const vector = new THREE.Vector3(targetPointer.current.x, targetPointer.current.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));

    const time = state.clock.elapsedTime;

    positions.forEach((basePos, i) => {
      const dist = basePos.distanceTo(pos);
      const radius = 4.0;
      const influence = Math.max(0, 1 - Math.pow(dist / radius, 2));
      
      // Breathing core physics — calmer so it stays peripheral to the text.
      const breathe = Math.sin(time * 0.8 + phases[i]) * 0.04;
      
      dummy.position.copy(basePos);
      
      // Hover pushes blocks DOWN, overriding the breathing
      dummy.position.z = breathe - (influence * 1.2);
      
      // Dramatic rotation near the cursor
      dummy.rotation.x = influence * 1.5;
      dummy.rotation.y = influence * 1.5;
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[geometry, material, GRID_SIZE * GRID_SIZE]} 
    />
  );
}

function PointerLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const targetPointer = useRef(new THREE.Vector2(-999, -999));
  const reduced = useReducedMotion();

  useFrame((state) => {
    if (reduced || !lightRef.current) return;

    if (globalMouse.x !== -999) {
      targetPointer.current.x += (globalMouse.x - targetPointer.current.x) * 0.1;
      targetPointer.current.y += (globalMouse.y - targetPointer.current.y) * 0.1;
    }

    const vector = new THREE.Vector3(targetPointer.current.x, targetPointer.current.y, 0.5);
    vector.unproject(state.camera);
    const dir = vector.sub(state.camera.position).normalize();
    const distance = -state.camera.position.z / dir.z;
    const pos = state.camera.position.clone().add(dir.multiplyScalar(distance));

    lightRef.current.position.set(pos.x, pos.y, -1.5);
    
    const isOffscreen = targetPointer.current.x === -999 || (Math.abs(targetPointer.current.x) > 1.2 || Math.abs(targetPointer.current.y) > 1.2);
    // Neutral steel light — calm, no warm "alarm" tone competing with the copy.
    const targetIntensity = isOffscreen ? 0 : 150;

    lightRef.current.intensity += (targetIntensity - lightRef.current.intensity) * 0.1;
  });

  return (
    <pointLight
      ref={lightRef}
      color="#9aa0a6" // Neutral steel core
      intensity={0}
      distance={25}
      decay={2}
    />
  );
}

export const KineticBlocksBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#050505]">
      <Canvas 
        camera={{ position: [0, 0, 12], fov: 45 }} 
        dpr={[1, 2]}
        style={{ pointerEvents: 'none' }}
      >
        {/* Subtle cold ambient light to contrast the warm core */}
        <ambientLight intensity={0.4} color="#a0c0ff" />
        <directionalLight position={[5, 10, 5]} intensity={1.5} color="#223344" />
        
        <BlocksMesh />
        <PointerLight />
      </Canvas>
      
      {/* Dark scrim to isolate the reading column from the reactive field */}
      <div className="absolute inset-0 bg-black/55 z-[1] pointer-events-none" />
      
      {/* Cinematic Grammar: ATM-001 */}
      <div 
        className="absolute inset-0 z-[2] opacity-[0.08] pointer-events-none" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat'
        }}
      />
    </div>
  );
};
