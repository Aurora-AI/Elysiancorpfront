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
const OPACITY_POWER = 1.8;
const FOCUS_THRESHOLD = 0.4;

export function useChamberWindow(chamberIndex: number): ChamberWindow {
  const { progress } = useCameraProgress();

  return useMemo(() => {
    const center = (chamberIndex + 0.5) / TOTAL;
    const halfWindow = 0.5 / TOTAL;
    const distFromCenter = Math.abs(progress - center);

    // raw: linear 0→1 over the visibility window
    const raw = Math.max(0, 1 - distFromCenter / (halfWindow + FADE_BAND));

    // plateau for blur: garante que a tela fique perfeitamente focada por muito mais tempo
    const plateau = halfWindow * 0.7; // 70% da área da câmara fica com blur zero
    const blurDist = Math.max(0, distFromCenter - plateau);
    const blurRaw = Math.max(0, 1 - blurDist / (halfWindow + FADE_BAND - plateau));

    // opacity uses a power curve so crossovers are crisp (44% → 22% at midpoint)
    const normalized = raw ** OPACITY_POWER;

    const isFocused = distFromCenter < halfWindow * FOCUS_THRESHOLD;
    const scale = 0.95 + raw * 0.05;   // subtle scale on raw (smooth)
    
    // blur: 0 durante o plateau, e sobe de forma mais amena nas bordas (max 8px)
    const blur  = (1 - blurRaw) * 8;   
    const opacity = normalized;          // opacity on powered curve (sharp)

    return { visibility: normalized, isFocused, scale, blur, opacity };
  }, [progress, chamberIndex]);
}
