import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAnimationDefaults } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

export const TrustwareReality: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const anim = getAnimationDefaults();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance
      gsap.from('.reality-header', {
        opacity: 0,
        y: 30,
        duration: anim.duration,
        ease: anim.ease,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });

      // Terminal Reveal
      gsap.from(terminalRef.current, {
        opacity: 0,
        scale: 0.98,
        duration: anim.duration * 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: terminalRef.current,
          start: 'top 75%',
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [anim.duration, anim.ease]);

  return (
    <section
      ref={sectionRef}
      className="section-shell world-luminous py-32 px-px overflow-hidden flex flex-col items-center relative"
    >
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-20 relative z-10">
        
        {/* LEFT: TEXT ARCHITECTURE (5/12) */}
        <div className="lg:col-span-5 space-y-12 reality-header">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="t-mono text-[11px] text-ink/40 uppercase tracking-widest">
                [ 03 // Reality Proof ]
              </span>
              <div className="h-[0.5px] w-12 bg-ink/20" />
            </div>
            <h2 className="t-display text-6xl md:text-8xl text-ink leading-[0.9] tracking-tighter">
              O Fim da <br />
              <span className="italic font-light">Notificação</span> <br />
              <span className="italic font-light text-moss">Passiva.</span>
            </h2>
          </div>

          <div className="space-y-8 max-w-sm">
            <p className="t-editorial text-xl text-ink/80 leading-relaxed">
              O mercado entrega dados sensíveis a caixas negras probabilísticas na nuvem e utiliza software passivo que depende de humanos para agir. A Elysian inverte esta lógica. Em vez de enviar lembretes, a nossa malha agêntica executa a operação. Em vez de externalizar a memória para a nuvem, mantemos os segredos num <span className="italic">Local Vault</span> encriptado. O especialista decide, o sistema governa, o modelo apenas processa.
            </p>
            <div className="pt-8 border-t border-ink/10">
              <span className="t-mono text-[11px] text-moss uppercase tracking-widest font-mono font-bold">
                System Authority: 70% // Cognitive Delegation: 30%
              </span>
            </div>
          </div>
        </div>


        {/* RIGHT: FORENSIC TERMINAL (7/12) */}
        <div className="lg:col-span-7 flex items-center justify-center">
          <div 
            ref={terminalRef}
            className="w-full aspect-video relative"
          >
            {/* INJECTED CLIENT-ONLY ISLAND */}
            {children}
          </div>
        </div>
      </div>

      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none">
        <span className="t-brand text-[22vw] text-ink select-none leading-none">LEX</span>
      </div>
      
      {/* Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02] halftone-noise" />
    </section>
  );
};
