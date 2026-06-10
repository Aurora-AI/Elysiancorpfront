import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const STAGES = ['CAPTURA', 'ESTRUTURAÇÃO', 'VALIDAÇÃO', 'PERSISTÊNCIA', 'EXECUÇÃO', 'APRENDIZADO'];
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
  useFrame(({ camera }) => {
    const targetZ = 5 - chamberProgress * (CORRIDOR_DEPTH + 7);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);
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
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 5]} intensity={0.8} color={GOLD} />
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
