import { STAGES } from '@/data/lex-pipeline';

export const STAGE_COUNT = STAGES.length;

/**
 * Map overall scroll progress [0,1] to the active stage and the progress
 * within that stage. Five equal bands. Deterministic and pure.
 */
export function stageAt(progress: number): { index: number; local: number } {
  const p = Math.min(1, Math.max(0, progress));
  if (p >= 1) return { index: STAGE_COUNT - 1, local: 1 };
  const band = 1 / STAGE_COUNT;
  const index = Math.floor(p / band);
  const local = (p - index * band) / band;
  return { index, local };
}
