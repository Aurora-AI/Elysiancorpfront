import { useChamberWindow } from '../useChamberWindow';
import { getAnimationDefaults } from '../../../lib/animations';

const PRODUCTS = [
  { name: 'CRM Aurora', desc: 'Intercepta informação. Estrutura. Devolve tempo.' },
  { name: 'Elysian Lex', desc: 'Governança forense para jurídico e compliance.' },
];

export function C04_TruthReturned() {
  const { scale, blur, opacity } = useChamberWindow(3);
  const isReduced = getAnimationDefaults().duration < 0.2;

  return (
    <div
      style={isReduced ? {
        position: 'relative', height: '100vh', width: '100%', flexShrink: 0,
        backgroundColor: '#F8F7F3',
      } : {
        position: 'absolute', inset: 0,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
        willChange: 'transform, filter, opacity',
        backgroundColor: '#F8F7F3',
      }}
    >
      <div className="absolute left-[8%] top-1/2 -translate-y-1/2 max-w-[480px] space-y-6">
        <span className="t-label text-[13px] block" style={{ color: 'var(--text-muted)', letterSpacing: '0.4em' }}>
          [ 04 // TRUTH RETURNED ]
        </span>
        <h2 className="t-display leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(2.8rem,7vw,5rem)', color: 'var(--ink)' }}>
          Damos voz<br />
          <span className="t-accent">à sua empresa.</span>
        </h2>
        <p className="t-editorial text-[21px] leading-relaxed" style={{ color: 'var(--text-secondary)', maxWidth: '440px' }}>
          O produto que não é um CRM. Ele intercepta a informação, estrutura,
          transforma em inteligência aplicada e{' '}
          <strong style={{ color: 'var(--ink)' }}>devolve o tempo ao gestor</strong>.
        </p>
      </div>

      {/* Right: product cards */}
      <div className="absolute right-[8%] top-1/2 -translate-y-1/2 flex flex-col gap-6" style={{ width: '340px' }}>
        {PRODUCTS.map((p, i) => (
          <div
            key={p.name}
            className="relative p-6"
            style={{
              border: '1px solid rgba(26,26,23,0.08)',
              background: '#FFFFFF',
              boxShadow: '0 21px 55px -13px rgba(0,0,0,0.08)',
              marginTop: i === 1 ? '24px' : 0,
            }}
          >
            <span className="t-label text-[11px] block mb-[8px]" style={{ color: 'rgba(26,26,23,0.5)' }}>
              {p.name}
            </span>
            <p className="t-editorial text-[15px] leading-snug" style={{ color: 'rgba(26,26,23,0.8)' }}>
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
