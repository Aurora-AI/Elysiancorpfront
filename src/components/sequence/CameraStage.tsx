import { type ReactNode } from 'react';
import { getAnimationDefaults } from '../../lib/animations';

interface CameraStageProps {
  children: ReactNode;
  active?: boolean;
}

export function CameraStage({ children, active = false }: CameraStageProps) {
  const anim = getAnimationDefaults();
  const isReduced = anim.duration < 0.2;

  if (isReduced) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {children}
      </div>
    );
  }

  return (
    <div
      id="camera-stage"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 10,
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'auto' : 'none',
        transition: 'opacity 0.5s ease',
      }}
    >
      {children}
    </div>
  );
}
