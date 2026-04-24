import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const SectionConversion: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background Parallax
      gsap.to(parallaxRef.current, {
        y: -100,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        }
      });

      // Text reveal
      gsap.fromTo(contentRef.current, 
        { y: 60, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.5, 
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen bg-stone overflow-hidden"
      id="conversion"
    >
      {/* Background Transition to Dark (Conquista Narrativa) */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone via-ink to-ink z-0"></div>

      {/* Parallax Decorator */}
      <div 
        ref={parallaxRef}
        className="absolute inset-0 z-0 opacity-10 flex items-center justify-center"
      >
        <div className="text-[30vw] font-display text-parchment/20 select-none transform rotate-12">
          ELYSIAN
        </div>
      </div>

      <div className="container relative mx-auto px-6 md:px-20 min-h-screen flex items-center z-10">
        <div ref={contentRef} className="max-w-4xl">
          <span className="text-[10px] font-mono text-gold tracking-[0.6em] mb-12 block uppercase">
            04 // CONQUISTA NARRATIVA
          </span>
          <h2 className="text-6xl md:text-8xl font-display text-parchment leading-tight mb-16">
            O amanhã já foi <br /> <span className="italic text-gold">auditado</span>.
          </h2>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-12">
            <button className="group relative px-12 py-5 border border-parchment/30 overflow-hidden bg-transparent hover:border-gold transition-colors duration-500">
              <span className="relative z-10 text-[12px] font-mono text-parchment tracking-[0.4em] uppercase group-hover:text-gold transition-colors duration-500">
                Certificar Ativo
              </span>
              <div className="absolute inset-0 bg-parchment scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-bottom opacity-[0.05]"></div>
            </button>
            
            <p className="text-[10px] font-mono text-parchment/40 max-w-[280px] uppercase tracking-[0.2em] leading-loose">
              Acesso restrito a detentores de chaves soberanas. Requer validação biométrica Aurora.
            </p>
          </div>
        </div>
      </div>

      {/* Forensic Border */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-parchment/10"></div>
    </section>
  );
};
