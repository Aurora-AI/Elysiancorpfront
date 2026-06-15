import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCameraProgress, type WorldTone as WorldToneType } from './useCameraProgress';
import { getAnimationDefaults } from '../../lib/animations';

const DEBOUNCE_MS = 200;

const WORLD_COLORS: Record<WorldToneType, { bg: string; color: string }> = {
  light: { bg: '#F8F7F3', color: '#1A1A17' },
  dark:  { bg: '#0D0D0C', color: '#E5E7EB' },
};

export function WorldTone() {
  const { worldTone } = useCameraProgress();
  const prevTone = useRef<WorldToneType | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isReduced = getAnimationDefaults().duration < 0.2;

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      if (prevTone.current === worldTone) return;
      prevTone.current = worldTone;

      const { bg, color } = WORLD_COLORS[worldTone];
      gsap.to(document.body, {
        backgroundColor: bg,
        color,
        duration: isReduced ? 0.01 : 1.8,
        ease: 'expo.inOut',
      });
    }, isReduced ? 0 : DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [worldTone, isReduced]);

  return null;
}
