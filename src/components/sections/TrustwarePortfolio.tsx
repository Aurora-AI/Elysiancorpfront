import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAnimationDefaults } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  {
    id: 'LEX',
    title: 'Elysian Lex',
    subtitle: 'Forensic Governance',
    description: 'Sistema de governação agêntica para o setor jurídico e compliance. Rastreabilidade imutável e proteção de segredos industriais.',
    tag: 'GOV_LEX_01',
    icon: '§'
  },
  {
    id: 'SILENT',
    title: 'CRM Aurora',
    subtitle: 'Cognitive Ingestion',
    description: 'Automação total do ciclo comercial através do Pipeline de Ingestão Cognitiva. O fim do preenchimento manual.',
    tag: 'SVRN_CRM_02',
    icon: 'Ω'
  },
  {
    id: 'FIDUCIARY',
    title: 'Fiduciary Backoffice',
    subtitle: 'Real-time Audit',
    description: 'Agentes de auditoria e reconciliação financeira em tempo real. Precisão determinística em operações de tesouraria.',
    tag: 'FIN_AUDIT_03',
    icon: 'Δ'
  },
  {
    id: 'GOV',
    title: 'Trustware',
    subtitle: 'Protocol Layer',
    description: 'Protocolos de confiança que certificam a integridade de cada execução agêntica no ecossistema corporativo.',
    tag: 'PROTOCOL_04',
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
            <span className="t-mono text-[11px] text-moss uppercase tracking-[0.3em]">
              [ 05 // Asset Portfolio ]
            </span>
            <div className="h-16 w-[0.5px] bg-moss/30" />
          </div>
          <h2 className="t-display text-6xl md:text-8xl text-ink leading-[0.9] tracking-tighter">
            O Ecossistema de <br />
            <span className="italic font-light text-moss">Produtos Elysian.</span>
          </h2>
          <p className="t-editorial text-xl text-ink/60 leading-relaxed italic max-w-xl mx-auto">
            Soluções de engenharia desenhadas para escalar a governação e a eficiência operacional em ambientes de alto risco.
          </p>
        </div>

        {/* BENTO GRID */}
        <div className="portfolio-grid grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-full md:min-h-[650px]">
          
          {/* ELYSIAN LEX - BIG CELL (2x2) */}
          <div className="bento-item md:col-span-2 md:row-span-2 bg-white/60 backdrop-blur-md border border-ink/5 p-12 flex flex-col justify-between group hover:bg-black transition-all duration-700 relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <span className="t-mono text-[11px] text-moss group-hover:text-moss transition-colors uppercase tracking-[0.2em]">Vertical: Legal Tech</span>
              <div className="t-display text-[12rem] text-ink/[0.03] group-hover:text-moss/[0.05] transition-colors absolute -top-12 -right-8 pointer-events-none">{PRODUCTS[0].icon}</div>
              <h3 className="t-display text-6xl text-ink group-hover:text-parchment-text transition-colors font-bold">{PRODUCTS[0].title}</h3>
              <p className="t-editorial text-lg text-ink/70 group-hover:text-parchment-text/60 transition-colors max-w-xs">{PRODUCTS[0].description}</p>
            </div>
            <div className="flex items-center justify-between relative z-10">
              <span className="t-mono text-[10px] text-moss group-hover:text-moss tracking-widest">{PRODUCTS[0].tag}</span>
              <div className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center group-hover:border-moss/30 group-hover:bg-moss/10 transition-all duration-500">
                <svg className="w-4 h-4 text-ink group-hover:text-moss transition-colors" fill="none" viewBox="0 0 12 12"><path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

          {/* SILENT OPERATOR (2x1) */}
          <div className="bento-item md:col-span-2 bg-white/40 backdrop-blur-md border border-ink/5 p-12 flex flex-col justify-between group hover:bg-black transition-all duration-700 relative overflow-hidden">
             <div className="flex justify-between items-start relative z-10">
               <div className="space-y-2">
                 <h3 className="t-display text-4xl text-ink group-hover:text-parchment-text transition-colors font-bold">{PRODUCTS[1].title}</h3>
                 <p className="t-mono text-[11px] text-ink/40 group-hover:text-moss/50 transition-colors uppercase tracking-widest">{PRODUCTS[1].subtitle}</p>
               </div>
               <span className="t-display text-5xl text-ink/10 group-hover:text-moss/10 transition-colors">{PRODUCTS[1].icon}</span>
             </div>
             <p className="t-editorial text-base text-ink/60 group-hover:text-parchment-text/60 transition-colors max-w-sm relative z-10">{PRODUCTS[1].description}</p>
          </div>

          {/* AGENT FORGE (1x1) */}
          <div className="bento-item bg-white/40 backdrop-blur-md border border-ink/5 p-12 flex flex-col justify-between group hover:bg-black transition-all duration-700 relative overflow-hidden">
             <h3 className="t-display text-3xl text-ink group-hover:text-parchment-text transition-colors leading-none font-bold">{PRODUCTS[2].title}</h3>
             <p className="t-mono text-[10px] text-ink/40 group-hover:text-moss/50 transition-colors leading-tight uppercase tracking-widest">{PRODUCTS[2].subtitle}</p>
          </div>

          {/* SOVEREIGN VAULT (1x1) */}
          <div className="bento-item bg-white/40 backdrop-blur-md border border-ink/5 p-12 flex flex-col justify-between group hover:bg-black transition-all duration-700 relative overflow-hidden">
             <h3 className="t-display text-3xl text-ink group-hover:text-parchment-text transition-colors leading-none font-bold">{PRODUCTS[3].title}</h3>
             <p className="t-mono text-[10px] text-ink/40 group-hover:text-moss/50 transition-colors leading-tight uppercase tracking-widest">{PRODUCTS[3].subtitle}</p>
          </div>

        </div>
      </div>

      {/* Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02] halftone-noise" />
    </section>
  );
};
