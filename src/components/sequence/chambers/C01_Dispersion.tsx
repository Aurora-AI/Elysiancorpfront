import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useChamberWindow } from '../useChamberWindow';
import { getAnimationDefaults } from '../../../lib/animations';

const FRAGMENTS = ['reunião', 'planilha', 'e-mail', 'decisão', 'contexto', 'memória', 'processo', 'relatório'];

export function C01_Dispersion() {
  const { scale, blur, opacity } = useChamberWindow(0);
  const isReduced = getAnimationDefaults().duration < 0.2;
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (isReduced) return;
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      wordsRef.current.forEach((wordElement) => {
        if (!wordElement) return;
        const rect = wordElement.getBoundingClientRect();
        const wordX = rect.left + rect.width / 2;
        const wordY = rect.top + rect.height / 2;
        const dist = Math.hypot(clientX - wordX, clientY - wordY);
        
        if (dist < 150) {
          const angle = Math.atan2(wordY - clientY, wordX - clientX);
          const force = (150 - dist) * 0.15; // Intensidade controlada
          gsap.to(wordElement, {
            x: Math.cos(angle) * force,
            y: Math.sin(angle) * force,
            duration: 0.8,
            ease: "power2.out",
          });
        } else {
          gsap.to(wordElement, { x: 0, y: 0, duration: 1.2, ease: "power3.out" });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isReduced]);

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
            ref={(el) => { wordsRef.current[i] = el; }}
            className="absolute t-mono text-[13px]"
            style={{
              top: `${10 + (i * 11) % 80}%`,
              left: `${5 + (i * 23) % 75}%`,
              color: 'var(--ink)',
              opacity: 0.1 + (i * 0.04),
              // Adicionando um leve "float" natural contínuo para não ficar totalmente estático sem o mouse
              animation: `float-${i % 3} ${4 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {word}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes float-0 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-8px) translateX(4px)} }
        @keyframes float-1 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(6px) translateX(-6px)} }
        @keyframes float-2 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-4px) translateX(8px)} }
      `}</style>
    </div>
  );
}
