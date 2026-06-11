import { lazy } from 'react';

const FactoryCorridorInner = lazy(() =>
  import('./FactoryCorridorInner').then((m) => ({ default: m.FactoryCorridorInner }))
);

interface FactoryCorridorProps {
  chamberProgress: number;
  activeStage: number;
}

export function FactoryCorridor({ chamberProgress, activeStage }: FactoryCorridorProps) {
  return (
    <FactoryCorridorInner chamberProgress={chamberProgress} activeStage={activeStage} />
  );
}
