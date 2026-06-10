import { createContext, useContext } from 'react';

export type WorldTone = 'dark' | 'light';

export interface CameraProgress {
  progress: number;
  activeChamber: number;
  worldTone: WorldTone;
}

const WORLD_MAP: Record<number, WorldTone> = {
  0: 'light',
  1: 'dark',
  2: 'dark',
  3: 'light',
  4: 'dark',
};

export function progressToChamber(progress: number, total = 5): number {
  return Math.min(Math.floor(progress * total), total - 1);
}

export function chamberToWorldTone(chamber: number): WorldTone {
  return WORLD_MAP[chamber] ?? 'dark';
}

export const CameraProgressContext = createContext<CameraProgress>({
  progress: 0,
  activeChamber: 0,
  worldTone: 'light',
});

export function useCameraProgress(): CameraProgress {
  return useContext(CameraProgressContext);
}
