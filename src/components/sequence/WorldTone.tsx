import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCameraProgress, type WorldTone as WorldToneType } from './useCameraProgress';
import { getAnimationDefaults } from '../../lib/animations';

const WORLD_COLORS: Record<WorldToneType, { bg: string; color: string }> = {
  light: { bg: '#F8F7F3', color: '#1A1A17' },
  dark:  { bg: '#000000', color: '#F2F2F2' },
};

export function WorldTone() {
  const { worldTone } = useCameraProgress();
  const prevTone = useRef<WorldToneType>('light');
  const anim = getAnimationDefaults();

  useEffect(() => {
    if (prevTone.current === worldTone) return;
    prevTone.current = worldTone;

    const { bg, color } = WORLD_COLORS[worldTone];
    const isReduced = anim.duration < 0.2;

    gsap.to(document.body, {
      backgroundColor: bg,
      color,
      duration: isReduced ? 0.01 : 1.8,
      ease: 'expo.inOut',
    });
  }, [worldTone, anim.duration]);

  return null;
}
