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

    // raw: linear 0→1 over the visibility window
    const raw = Math.max(0, 1 - distFromCenter / (halfWindow + FADE_BAND));

    // opacity uses a power curve so crossovers are crisp (44% → 22% at midpoint)
    const normalized = raw ** 1.8;

    const isFocused = distFromCenter < halfWindow * 0.4;
    const scale = 0.95 + raw * 0.05;   // subtle scale on raw (smooth)
    const blur  = (1 - raw) * 12;       // blur on raw (smooth)
    const opacity = normalized;          // opacity on powered curve (sharp)

    return { visibility: normalized, isFocused, scale, blur, opacity };
  }, [progress, chamberIndex]);
}
