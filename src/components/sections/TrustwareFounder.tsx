import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAnimationDefaults } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

export const TrustwareFounder: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const anim = getAnimationDefaults();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.founder-portrait', {
        opacity: 0,
        x: -40,
        duration: anim.duration * 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });

      gsap.from('.founder-content', {
        opacity: 0,
        x: 40,
        duration: anim.duration * 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-shell world-luminous py-32 px-px overflow-hidden relative border-t border-ink/5"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center relative z-10">
        
        {/* LEFT: PORTRAIT (5/12) */}
        <div className="lg:col-span-5 founder-portrait relative">
          <div className="aspect-[3/4] bg-white border border-ink/10 overflow-hidden relative group">
            <img 
              src="/assets/rodrigo-portrait.png" 
              alt="Rodrigo Cesar Winhaski" 
              className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-1000 scale-[1.02] group-hover:scale-100"
            />
            {/* FORENSIC OVERLAY */}
            <div className="absolute inset-0 border-[24px] border-parchment pointer-events-none" />
            <div className="absolute bottom-12 left-12 t-mono text-[10px] text-parchment-text bg-black px-4 py-1.5 uppercase tracking-[0.2em] shadow-xl">
              ID: AUR-FOUNDER-01
            </div>
          </div>
          {/* DECORATIVE CROSS */}
          <div className="absolute -top-6 -right-6 w-12 h-12 flex items-center justify-center">
             <div className="w-full h-[0.5px] bg-moss/50 absolute" />
             <div className="h-full w-[0.5px] bg-moss/50 absolute" />
          </div>
        </div>

        {/* RIGHT: NARRATIVE (7/12) */}
        <div className="lg:col-span-7 space-y-12 founder-content">
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <span className="t-mono text-[11px] text-moss uppercase tracking-[0.3em]">
                [ 07 // Authority ]
              </span>
              <div className="h-[0.5px] w-16 bg-moss/30" />
            </div>
            <h2 className="t-display text-6xl md:text-8xl text-ink leading-[0.9] tracking-tighter font-light">
              Arquitetura <br />
              <span className="italic font-light">do</span> <br />
              <span className="italic text-ink/30 font-light text-moss">Controlo.</span>
            </h2>
          </div>

          <div className="space-y-10 max-w-xl">
            <p className="t-editorial text-2xl md:text-3xl text-ink leading-tight font-light italic">
              "A inteligência artificial não substitui a experiência operacional; ela a amplifica para o nível de <span className="text-moss not-italic font-medium">soberania institucional</span>."
            </p>
            
            <div className="space-y-6 t-editorial text-ink/70 text-lg leading-relaxed">
              <p>
                Rodrigo Winhaski é um arquiteto de sistemas com mais de 30 anos de experiência em tecnologia industrial e ambientes de alto risco. 
              </p>
              <p>
                Fundador da Elysian Corp e da Mad Lab Aurora, o seu foco é a construção de infraestruturas soberanas que devolvam o controlo operacional às instituições, eliminando a opacidade das "caixas negras" tecnológicas através de engenharia rigorosa e governação agêntica.
              </p>
            </div>

            <div className="pt-10 border-t border-ink/10 flex items-center gap-8">
               <div className="space-y-1">
                 <div className="t-display text-2xl text-ink font-bold">Rodrigo Winhaski</div>
                 <div className="t-mono text-[11px] text-moss uppercase tracking-widest font-mono">Founder & Architect // Elysian Corp</div>
               </div>
               <div className="flex-1 h-[0.5px] bg-ink/10" />
               <div className="t-mono text-[10px] text-ink/40 uppercase text-right leading-relaxed font-mono">
                 Experience: 30Y+<br />
                 Focus: Sovereign_Architecture
               </div>
            </div>
          </div>
        </div>

      </div>

      {/* Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02] halftone-noise" />
    </section>
  );
};
