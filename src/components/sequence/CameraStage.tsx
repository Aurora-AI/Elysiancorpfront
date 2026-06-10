import { type ReactNode } from 'react';
import { getAnimationDefaults } from '../../lib/animations';

interface CameraStageProps {
  children: ReactNode;
}

export function CameraStage({ children }: CameraStageProps) {
  const anim = getAnimationDefaults();
  const isReduced = anim.duration < 0.2;

  if (isReduced) {
    return (
      <div style={{ position: 'relative', width: '100%' }}>
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
      }}
    >
      {children}
    </div>
  );
}
