import { useChamberWindow } from '../useChamberWindow';
import { getAnimationDefaults } from '../../../lib/animations';

export function C05_Category() {
  const { scale, blur, opacity } = useChamberWindow(4);
  const isReduced = getAnimationDefaults().duration < 0.2;

  return (
    <div
      style={isReduced ? {
        position: 'relative', height: '100vh', width: '100%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#000000',
      } : {
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
        willChange: 'transform, filter, opacity',
        backgroundColor: '#000000',
      }}
    >
      <div className="max-w-[860px] w-full px-[8vw] flex flex-col items-center text-center space-y-[34px]">
        <span className="t-label text-[13px]" style={{ color: 'rgba(156,163,175,0.4)', letterSpacing: '0.4em' }}>
          [ 05 // THE CATEGORY ]
        </span>

        <h2 className="t-brand" style={{ fontSize: 'clamp(3.5rem,10vw,8rem)', color: '#E5E7EB', lineHeight: 0.9, letterSpacing: '-0.02em' }}>
          Memória<br />
          <span style={{ color: 'var(--moss-bright)', fontStyle: 'italic' }}>Operacional</span><br />
          Validada.
        </h2>

        <p className="t-editorial text-[18px] leading-relaxed" style={{ color: 'rgba(156,163,175,0.7)', maxWidth: '520px' }}>
          Não somos CRM, copiloto ou plataforma de IA.
          Construímos a infraestrutura que transforma{' '}
          <span style={{ color: 'rgba(242,242,242,0.9)' }}>conhecimento confiável</span>{' '}
          em <span style={{ color: 'rgba(242,242,242,0.9)' }}>execução confiável</span>.
        </p>

        <a
          href="mailto:rodrigo@elysiancorp.com"
          className="t-mono text-[13px] px-8 py-4"
          style={{
            color: 'var(--moss-bright)',
            border: '1px solid rgba(78,91,75,0.5)',
            borderRadius: '2px',
            textDecoration: 'none',
            transition: 'background 0.5s ease, color 0.5s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(78,91,75,0.12)';
            (e.currentTarget as HTMLAnchorElement).style.color = '#6B7A66';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--moss-bright)';
          }}
        >
          [ REQUEST PARTNERSHIP ]
        </a>

        <div className="flex gap-[21px] pt-[21px]" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {['ARTIFACT: 2026.Q2.CERT', 'STRATEGY: MAD LAB AURORA', 'INDUSTRIAL INTELLIGENCE'].map((label) => (
            <span key={label} className="t-mono text-[9px]" style={{ color: 'rgba(156,163,175,0.25)' }}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
