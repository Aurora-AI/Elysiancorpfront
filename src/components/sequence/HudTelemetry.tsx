import { useCameraProgress } from './useCameraProgress';

const CHAMBER_LABELS: Record<number, string> = {
  0: 'STAGE: CONTEXT',
  1: 'STAGE: GOVERNANCE',
  2: 'STAGE: FACTORY',
  3: 'STAGE: TRUTH',
  4: 'STAGE: CATEGORY',
};

export function HudTelemetry() {
  const { activeChamber, worldTone } = useCameraProgress();
  const label = CHAMBER_LABELS[activeChamber] ?? 'STAGE: INIT';
  const isDark = worldTone === 'dark';

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 32px',
          pointerEvents: 'none',
          transition: 'color 0.7s ease',
          color: isDark ? 'var(--silver-technical)' : 'rgba(26,26,23,0.4)',
        }}
        aria-hidden="true"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span className="t-mono" style={{ fontSize: '13px' }}>[ PROTOCOL: TRUSTWARE ]</span>
          <div style={{
            width: '64px',
            height: '1px',
            background: isDark ? 'rgba(212,175,55,0.3)' : 'rgba(26,26,23,0.1)',
            transition: 'background 0.7s ease',
          }} />
          <span className="t-mono" style={{ fontSize: '13px', color: isDark ? 'var(--gold-sovereign)' : 'inherit' }}>
            [ {label} ]
          </span>
        </div>
        <span className="t-mono" style={{ fontSize: '13px' }}>ELYSIAN CORP © 2026</span>
      </div>
      <span className="sr-only" aria-label={`Protocol Trustware. ${label}. Elysian Corp 2026.`}>
        Protocol Trustware. {label}. Elysian Corp 2026.
      </span>
    </>
  );
}
