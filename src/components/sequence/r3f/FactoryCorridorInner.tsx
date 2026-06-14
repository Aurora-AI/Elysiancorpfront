import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { STAGES } from './stages';
const GOLD = '#D4AF37';
const CORRIDOR_DEPTH = 30;

interface StageNodeProps {
  label: string;
  index: number;
  total: number;
  activeIndex: number;
}

function StageNode({ label, index, total, activeIndex }: StageNodeProps) {
  const z = -((index / (total - 1)) * CORRIDOR_DEPTH);
  const isActive = index === activeIndex;

  return (
    <group position={[0, 0, z]}>
      <mesh>
        <boxGeometry args={[4, 0.8, 0.04]} />
        <meshBasicMaterial
          color={isActive ? GOLD : '#1A1A17'}
          transparent
          opacity={isActive ? 0.12 : 0.06}
        />
      </mesh>
      <mesh position={[0, 0.4, 0.02]}>
        <boxGeometry args={[4, 0.01, 0.01]} />
        <meshBasicMaterial color={isActive ? GOLD : '#333'} transparent opacity={isActive ? 0.8 : 0.3} />
      </mesh>
      <mesh position={[0, -0.4, 0.02]}>
        <boxGeometry args={[4, 0.01, 0.01]} />
        <meshBasicMaterial color={isActive ? GOLD : '#333'} transparent opacity={isActive ? 0.8 : 0.3} />
      </mesh>
      <Text
        position={[0, 0, 0.05]}
        fontSize={0.18}
        color={isActive ? GOLD : '#4A4A4A'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        {label}
      </Text>
    </group>
  );
}

interface CameraRigProps {
  chamberProgress: number;
}

function CameraRig({ chamberProgress }: CameraRigProps) {
  // We keep a lightweight local ref for mouse to avoid React state updates
  const mouse = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(({ camera }) => {
    const targetZ = 5 - chamberProgress * (CORRIDOR_DEPTH + 7);
    
    // Asymmetrical base offset
    const targetX = 0.6 + (mouse.current.x * 0.4);
    const targetY = -0.2 + (mouse.current.y * 0.2);

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.lookAt(targetX * 0.5, 0, targetZ - 10);
    
    // HTML-in-Canvas Sync (getElementTransform)
    // Se houvesse elementos DOM, atualizaríamos suas refs aqui usando:
    // const vector = new THREE.Vector3(x, y, z);
    // vector.project(camera);
    // const px = (vector.x * 0.5 + 0.5) * window.innerWidth;
    // const py = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
    // htmlElementRef.current.style.transform = `translate3d(${px}px, ${py}px, 0)`;
  });
  return null;
}

interface FactoryCorridorInnerProps {
  chamberProgress: number;
  activeStage: number;
}

export function FactoryCorridorInner({ chamberProgress, activeStage }: FactoryCorridorInnerProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 55 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <CameraRig chamberProgress={chamberProgress} />
      <ambientLight intensity={0.15} />
      
      {/* Volumetric / Directional Lights */}
      <pointLight position={[2, 0, 5]} intensity={0.6} color="#D4AF37" distance={15} />
      <pointLight position={[-2, 1, 0]} intensity={0.4} color="#4E5B4B" distance={10} />
      {STAGES.map((stage, i) => (
        <StageNode
          key={stage}
          label={stage}
          index={i}
          total={STAGES.length}
          activeIndex={activeStage}
        />
      ))}
      <gridHelper
        args={[40, 20, '#1A1A17', '#111']}
        position={[0, -1.2, -(CORRIDOR_DEPTH / 2)]}
      />
    </Canvas>
  );
}
