import { useChamberWindow } from '../useChamberWindow';

const STAGES = ['CAPTURA', 'ESTRUTURAÇÃO', 'VALIDAÇÃO', 'PERSISTÊNCIA', 'EXECUÇÃO', 'APRENDIZADO'];

export function C03_GovernedFactory() {
  const { scale, blur, opacity } = useChamberWindow(2);

  return (
    <div
      className="absolute inset-0 flex items-center"
      style={{
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

      {/* Right: factory corridor — flat 2D */}
      <div className="absolute right-[8%] top-1/2 -translate-y-1/2 flex flex-col items-center gap-[13px]">
        {STAGES.map((stage, i) => (
          <div key={stage} className="relative flex flex-col items-center">
            <div
              className="t-mono text-[11px] flex items-center justify-center"
              style={{
                width: '220px',
                height: '44px',
                border: `1px solid ${i === 2 ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.2)'}`,
                color: i === 2 ? '#D4AF37' : 'rgba(156,163,175,0.5)',
                backgroundColor: i === 2 ? 'rgba(212,175,55,0.04)' : 'transparent',
                transition: 'all 0.5s ease',
              }}
            >
              {stage}
            </div>
            {i < STAGES.length - 1 && (
              <div style={{ width: '1px', height: '13px', background: 'rgba(212,175,55,0.2)' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
