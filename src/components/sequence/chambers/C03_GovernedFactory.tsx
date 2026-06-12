import { lazy, Suspense } from 'react';
import { useChamberWindow } from '../useChamberWindow';
import { useCameraProgress } from '../useCameraProgress';
import { getAnimationDefaults } from '../../../lib/animations';
import { STAGES } from '../r3f/stages';

const FactoryCorridor = lazy(() =>
  import('../r3f/FactoryCorridor').then((m) => ({ default: m.FactoryCorridor }))
);

const CHAMBER_INDEX = 2;
const TOTAL_CHAMBERS = 5;
const BAND_START = CHAMBER_INDEX / TOTAL_CHAMBERS;  // 0.4
const BAND_END = (CHAMBER_INDEX + 1) / TOTAL_CHAMBERS;  // 0.6
const REDUCED_MOTION_THRESHOLD = 0.2;

export function C03_GovernedFactory() {
  const { scale, blur, opacity } = useChamberWindow(2);
  const { progress } = useCameraProgress();
  const isReduced = getAnimationDefaults().duration < REDUCED_MOTION_THRESHOLD;

  const chamberProgress = Math.max(0, Math.min(1,
    (progress - BAND_START) / (BAND_END - BAND_START)
  ));
  const activeStage = Math.min(
    Math.floor(chamberProgress * STAGES.length),
    STAGES.length - 1
  );

  return (
    <div
      style={isReduced ? {
        position: 'relative', height: '100vh', width: '100%', flexShrink: 0,
        backgroundColor: '#000000',
      } : {
        position: 'absolute', inset: 0,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
        willChange: 'transform, filter, opacity',
        backgroundColor: '#000000',
      }}
    >
      {/* Left: Álvaro narrative */}
      <div className="absolute left-[8%] top-1/2 -translate-y-1/2 z-10 max-w-[380px] space-y-[21px]">
        <span className="t-label text-[13px] block" style={{ color: 'rgba(156,163,175,0.5)', letterSpacing: '0.4em' }}>
          [ 03 // THE GOVERNED FACTORY ]
        </span>
        <h2 className="t-display leading-[1.05]" style={{ fontSize: 'clamp(2rem,4.5vw,3.4rem)', color: '#E5E7EB' }}>
          Álvaro observa, planeja,<br />
          simula e{' '}
          <span className="t-accent" style={{ color: 'var(--moss-bright)' }}>propõe.</span>
        </h2>
        <p className="t-editorial text-[16px] leading-relaxed" style={{ color: 'rgba(156,163,175,0.6)' }}>
          A produção só muda com gates determinísticos, QA formal e aprovação humana.
        </p>
      </div>

      {/* Right: R3F factory corridor */}
      <div
        className="absolute right-0 top-0"
        style={{ width: '50%', height: '100%', pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <FactoryCorridor chamberProgress={chamberProgress} activeStage={activeStage} />
        </Suspense>
      </div>
    </div>
  );
}
