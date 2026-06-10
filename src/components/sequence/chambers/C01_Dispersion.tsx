import { useChamberWindow } from '../useChamberWindow';

const FRAGMENTS = ['reunião', 'planilha', 'e-mail', 'decisão', 'contexto', 'memória', 'processo', 'relatório'];

export function C01_Dispersion() {
  const { scale, blur, opacity } = useChamberWindow(0);

  return (
    <div
      className="absolute inset-0 flex items-center"
      style={{
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
        willChange: 'transform, filter, opacity',
        backgroundColor: '#F8F7F3',
      }}
    >
      {/* Left: editorial headline */}
      <div className="absolute left-[8%] top-1/2 -translate-y-1/2 max-w-[500px] space-y-[21px]">
        <span className="t-label text-[13px] block" style={{ color: 'rgba(26,26,23,0.4)', letterSpacing: '0.4em' }}>
          [ 01 // THE CATEGORY PROBLEM ]
        </span>
        <h2 className="t-display leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(2.8rem,7vw,5rem)', color: 'var(--ink)' }}>
          O mercado aprendeu a<br />
          escalar respostas.<br />
          <span className="t-accent">Nós construímos controle.</span>
        </h2>
        <p className="t-editorial text-[21px] leading-relaxed" style={{ color: 'rgba(26,26,23,0.6)', maxWidth: '400px' }}>
          Empresas não sofrem por falta de dados. Sofrem por{' '}
          <strong style={{ color: 'var(--ink)' }}>perda de contexto</strong>.
        </p>
      </div>

      {/* Right: floating fragment words */}
      <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[380px] h-[420px] pointer-events-none">
        {FRAGMENTS.map((word, i) => (
          <span
            key={word}
            className="absolute t-mono text-[13px]"
            style={{
              top: `${10 + (i * 11) % 80}%`,
              left: `${5 + (i * 23) % 75}%`,
              color: 'var(--ink)',
              opacity: 0.1 + (i * 0.04),
              animation: `float-${i % 3} ${4 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* CSS animations for fragments */}
      <style>{`
        @keyframes float-0 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-12px) translateX(8px)} }
        @keyframes float-1 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(10px) translateX(-10px)} }
        @keyframes float-2 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-8px) translateX(12px)} }
      `}</style>
    </div>
  );
}
