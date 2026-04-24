import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAnimationDefaults } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  {
    id: 'LEX',
    title: 'ElysianLex',
    subtitle: 'Legal Intelligence',
    description: 'Automação de auditoria jurídica e análise de corpus documental em escala TB.',
    tag: 'BLUE_OCEAN_01',
    icon: '§'
  },
  {
    id: 'SILENT',
    title: 'Silent Operator',
    subtitle: 'Executive CRM',
    description: 'Gestão invisível de relacionamentos e automação de secretaria executiva de alto nível.',
    tag: 'SVRN_CRM_02',
    icon: 'Ω'
  },
  {
    id: 'FORGE',
    title: 'Agent Forge',
    subtitle: 'Engineering Pipeline',
    description: 'Infraestrutura para criação e orquestração de agentes autônomos determinísticos.',
    tag: 'ENG_SOV_03',
    icon: 'Δ'
  },
  {
    id: 'VALT',
    title: 'Sovereign Vault',
    subtitle: 'Data Integrity',
    description: 'Armazenamento imutável e certificação de ativos de dados para auditoria externa.',
    tag: 'DATA_TRUST_04',
    icon: '◊'
  }
];

export const TrustwarePortfolio: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const anim = getAnimationDefaults();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.portfolio-header', {
        opacity: 0,
        y: 20,
        duration: anim.duration,
        ease: anim.ease,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });

      gsap.from('.bento-item', {
        opacity: 0,
        y: 30,
        scale: 0.98,
        duration: anim.duration,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: '.portfolio-grid',
          start: 'top 75%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-shell world-luminous py-32 px-px overflow-hidden flex flex-col items-center relative"
    >
      <div className="max-w-7xl w-full space-y-24 relative z-10">
        
        {/* HEADER */}
        <div className="portfolio-header space-y-8 text-center max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-4">
            <span className="t-mono text-[11px] text-emerald uppercase tracking-[0.3em]">
              [ 04 // Ecossistema de Soluções ]
            </span>
            <div className="h-16 w-[0.5px] bg-emerald/30" />
          </div>
          <h2 className="t-display text-6xl md:text-8xl text-ink leading-[0.9] tracking-tighter">
            Portfólio de <br />
            <span className="italic font-light">Impacto</span>
          </h2>
          <p className="t-editorial text-xl text-ink/60 leading-relaxed italic max-w-xl mx-auto">
            Soluções verticais desenhadas para onde a falha não é uma opção.
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="portfolio-grid grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-full md:min-h-[650px]">
          
          {/* ELYSIAN LEX - BIG CELL (2x2) */}
          <div className="bento-item md:col-span-2 md:row-span-2 bg-white/60 backdrop-blur-md border border-ink/5 p-12 flex flex-col justify-between group hover:bg-black transition-all duration-700 relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <span className="t-mono text-[11px] text-emerald group-hover:text-emerald transition-colors uppercase tracking-[0.2em]">Vertical: Legal Tech</span>
              <div className="t-display text-[12rem] text-ink/[0.03] group-hover:text-emerald/[0.05] transition-colors absolute -top-12 -right-8 pointer-events-none">{PRODUCTS[0].icon}</div>
              <h3 className="t-display text-6xl text-ink group-hover:text-parchment-text transition-colors font-bold">{PRODUCTS[0].title}</h3>
              <p className="t-editorial text-lg text-ink/70 group-hover:text-parchment-text/60 transition-colors max-w-xs">{PRODUCTS[0].description}</p>
            </div>
            <div className="flex items-center justify-between relative z-10">
              <span className="t-mono text-[10px] text-emerald group-hover:text-emerald tracking-widest">{PRODUCTS[0].tag}</span>
              <div className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center group-hover:border-emerald/30 group-hover:bg-emerald/10 transition-all duration-500">
                <svg className="w-4 h-4 text-ink group-hover:text-emerald transition-colors" fill="none" viewBox="0 0 12 12"><path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

          {/* SILENT OPERATOR (2x1) */}
          <div className="bento-item md:col-span-2 bg-white/40 backdrop-blur-md border border-ink/5 p-12 flex flex-col justify-between group hover:bg-black transition-all duration-700 relative overflow-hidden">
             <div className="flex justify-between items-start relative z-10">
               <div className="space-y-2">
                 <h3 className="t-display text-4xl text-ink group-hover:text-parchment-text transition-colors font-bold">{PRODUCTS[1].title}</h3>
                 <p className="t-mono text-[11px] text-ink/40 group-hover:text-emerald/50 transition-colors uppercase tracking-widest">{PRODUCTS[1].subtitle}</p>
               </div>
               <span className="t-display text-5xl text-ink/10 group-hover:text-emerald/10 transition-colors">{PRODUCTS[1].icon}</span>
             </div>
             <p className="t-editorial text-base text-ink/60 group-hover:text-parchment-text/60 transition-colors max-w-sm relative z-10">{PRODUCTS[1].description}</p>
          </div>

          {/* AGENT FORGE (1x1) */}
          <div className="bento-item bg-white/40 backdrop-blur-md border border-ink/5 p-12 flex flex-col justify-between group hover:bg-black transition-all duration-700 relative overflow-hidden">
             <h3 className="t-display text-3xl text-ink group-hover:text-parchment-text transition-colors leading-none font-bold">{PRODUCTS[2].title}</h3>
             <p className="t-mono text-[10px] text-ink/40 group-hover:text-emerald/50 transition-colors leading-tight uppercase tracking-widest">{PRODUCTS[2].subtitle}</p>
          </div>

          {/* SOVEREIGN VAULT (1x1) */}
          <div className="bento-item bg-white/40 backdrop-blur-md border border-ink/5 p-12 flex flex-col justify-between group hover:bg-black transition-all duration-700 relative overflow-hidden">
             <h3 className="t-display text-3xl text-ink group-hover:text-parchment-text transition-colors leading-none font-bold">{PRODUCTS[3].title}</h3>
             <p className="t-mono text-[10px] text-ink/40 group-hover:text-emerald/50 transition-colors leading-tight uppercase tracking-widest">{PRODUCTS[3].subtitle}</p>
          </div>

        </div>
      </div>

      {/* Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02] halftone-noise" />
    </section>
  );
};
