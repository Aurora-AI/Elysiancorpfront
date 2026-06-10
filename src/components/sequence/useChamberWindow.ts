import { useMemo } from 'react';
import { useCameraProgress } from './useCameraProgress';

export interface ChamberWindow {
  visibility: number;
  isFocused: boolean;
  scale: number;
  blur: number;
  opacity: number;
}

const TOTAL = 5;
const FADE_BAND = 0.08;

export function useChamberWindow(chamberIndex: number): ChamberWindow {
  const { progress } = useCameraProgress();

  return useMemo(() => {
    const center = (chamberIndex + 0.5) / TOTAL;
    const halfWindow = 0.5 / TOTAL;
    const distFromCenter = Math.abs(progress - center);
    const normalized = Math.max(0, 1 - distFromCenter / (halfWindow + FADE_BAND));
    const isFocused = distFromCenter < halfWindow * 0.4;
    const scale   = 0.95 + normalized * 0.05;
    const blur    = (1 - normalized) * 12;
    const opacity = normalized;
    return { visibility: normalized, isFocused, scale, blur, opacity };
  }, [progress, chamberIndex]);
}
