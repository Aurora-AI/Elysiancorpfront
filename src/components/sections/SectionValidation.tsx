import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const SectionValidation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const stats = statsRef.current?.querySelectorAll('.stat-item');
      if (stats) {
        gsap.fromTo(stats, 
          { y: 30, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1.5, 
            stagger: 0.15, 
            ease: "power4.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { label: "01 // AUDITORIA", value: "99.8%", detail: "PRECISÃO DETERMINÍSTICA" },
    { label: "02 // LATÊNCIA", value: "<12ms", detail: "RESPOSTA SOBERANA" },
    { label: "03 // VOLUME", value: "4.2PB", detail: "DADOS PROCESSADOS" }
  ];

  return (
    <section 
      ref={containerRef}
      className="section-shell min-h-[70vh] flex items-center halftone-noise relative"
      id="validation"
    >
      {/* Forensic Labels */}
      <div className="absolute top-10 left-10 t-mono text-[9px] text-ink/30">
        REF: ELYSIAN-VAL-2026-V8
      </div>
      <div className="absolute top-10 right-10 t-mono text-[9px] text-ink/30">
        AUTHORITY: CERTIFIED
      </div>

      <div className="w-full max-w-7xl mx-auto px-10">
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item flex flex-col items-start">
              <span className="t-mono text-[10px] text-aureate mb-8">
                {stat.label}
              </span>
              <h2 className="t-headline text-8xl md:text-[110px] text-ink mb-6">
                {stat.value}
              </h2>
              <div className="w-10 h-px bg-ink/10 mb-6" />
              <span className="t-mono text-[11px] text-ink/50">
                {stat.detail}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-10 t-mono text-[9px] text-ink/20">
        [ STAGE: VALIDATION_PROTOCOL ]
      </div>
    </section>
  );
};
