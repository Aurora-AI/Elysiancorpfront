import { lazy } from 'react';

// SSR guard: import.meta.env.SSR is replaced at build time (true in SSR bundle, false in client bundle).
// Rollup eliminates the dead branch, so FactoryCorridorInner (and @react-three/fiber) never enter the SSR bundle.
const FactoryCorridorInner = import.meta.env.SSR
  ? lazy(() => Promise.resolve({ default: () => null }))
  : lazy(() => import('./FactoryCorridorInner').then((m) => ({ default: m.FactoryCorridorInner })));

interface FactoryCorridorProps {
  chamberProgress: number;
  activeStage: number;
}

export function FactoryCorridor({ chamberProgress, activeStage }: FactoryCorridorProps) {
  return (
    <FactoryCorridorInner chamberProgress={chamberProgress} activeStage={activeStage} />
  );
}
