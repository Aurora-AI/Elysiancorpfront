import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ConsequenceBlockProps {
  label: string;
  status: string;
  body: string;
  signal: string;
  index: number;
  icon: React.ReactNode;
  statusColor: string;
}

const ConsequenceBlock: React.FC<ConsequenceBlockProps> = ({ label, status, body, signal, index, icon, statusColor }) => {
  return (
    <div
      className="consequence-block relative bg-[#121212] border border-white/5 border-t-white/10 p-8 lg:p-10 max-w-md ml-auto backdrop-blur-md group rounded-sm flex items-start gap-8 active:scale-[0.98] active:bg-white/[0.05] cursor-pointer shadow-2xl overflow-hidden"
      style={{ zIndex: 10 + index, opacity: 0, visibility: 'hidden' as const }}
    >
      {/* Visual Entry Node */}
      <div className="absolute -left-[37px] top-1/2 -translate-y-1/2 w-4 h-4 hidden lg:flex items-center justify-center">
        <div className={`w-2 h-2 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)] bg-white/60 block-node-${index}`} />
      </div>

      {/* Icon Box */}
      <div className="flex-shrink-0 w-14 h-14 lg:w-16 lg:h-16 bg-white/[0.03] border border-white/10 flex items-center justify-center rounded-sm group-hover:border-white/30 transition-colors shadow-inner">
        <div className="text-white/40 group-hover:text-white transition-colors duration-500">
          {icon}
        </div>
      </div>
      
      <div className="flex-grow space-y-4 relative">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="t-mono text-[9px] text-white/30 tracking-widest uppercase">{index + 1} // {label}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white/20 group-hover:translate-x-1 transition-transform">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h4 className="t-technical text-2xl lg:text-3xl leading-tight tracking-widest uppercase font-bold" style={{ color: statusColor }}>{status}</h4>
        </div>
        
        <p className="t-editorial text-dim-text text-base lg:text-lg leading-relaxed opacity-90">
          {body}
        </p>
        
        <div className="pt-4 border-t border-white/5 flex items-center gap-3">
          <div className="relative">
             <div className={`w-2 h-2 rounded-full animate-ping absolute inset-0`} style={{ backgroundColor: statusColor, opacity: 0.4 }}></div>
             <div className={`w-2 h-2 rounded-full relative z-10`} style={{ backgroundColor: statusColor }}></div>
          </div>
          <span className="t-mono text-[9px] text-white/40 uppercase tracking-tighter font-medium">{signal}</span>
        </div>
      </div>
    </div>
  );
};

const ControlFailure: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const isMobile = window.innerWidth < 1024;

    // Initial State — deve rodar ANTES da criação da timeline
    gsap.set(".consequence-block", {
      opacity: 0,
      x: (i) => isMobile ? 0 : (i * 30 + 30),
      visibility: "hidden"
    });
    gsap.set(".connector-path", { strokeDasharray: 800, strokeDashoffset: 800 });
    gsap.set(".hub-content", { opacity: 0, scale: 0.95 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        once: true,
      }
    });

    // 1. Frame Reveal (Snappy)
    tl.fromTo(frameRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );

    // 2. Hub Activation
    tl.to(".hub-content", { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)" }, "-=0.2");
    tl.to(".hub-ring", { rotation: 360, duration: 30, repeat: -1, ease: "none" }, 0);

    // 3. Connectors & Blocks Cascade (Agressivo)
    const blocks = gsap.utils.toArray<HTMLElement>(".consequence-block");
    blocks.forEach((block, i) => {
      tl.to(`.path-${i}`, { strokeDashoffset: 0, opacity: 0.4, duration: 0.4 }, "-=0.3");
      tl.to(block, { 
        opacity: 1, 
        visibility: "visible",
        x: isMobile ? 0 : (i * 30), 
        duration: 0.4, 
        ease: "power2.out" 
      }, "-=0.3");
    });

    // Micro-glitch light
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        gsap.to(".hub-content", {
          opacity: 0.7,
          duration: 0.05,
          yoyo: true,
          repeat: 1
        });
      }
    }, 3000);

    return () => clearInterval(glitchInterval);

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-[100dvh] bg-[#0a0a0a] py-[120px] px-4 lg:px-12 flex items-center overflow-hidden"
      id="section-03-control-failure"
    >
      {/* Background Grid — Mais leve */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.1]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      
      <div 
        ref={frameRef}
        className="max-w-[1440px] mx-auto w-full bg-[#0d0d0d] border border-white/5 relative overflow-hidden flex flex-col rounded-sm shadow-2xl"
      >
        {/* Atmospheric Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(78,91,75,0.05)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 p-8 lg:p-20 items-center flex-grow">
          
          {/* Left Column — Editorial */}
          <div className="lg:col-span-5 space-y-10 z-20">
            <div className="space-y-6">
              <span className="t-mono text-[10px] text-moss tracking-[0.4em] block uppercase opacity-70">
                [ 03 // THE CONTROL FAILURE ]
              </span>
              <h2 className="t-brand text-off-white text-5xl lg:text-[84px] leading-[0.9] tracking-tighter">
                AI Rarely Fails <br />at Output. <br />
                <span className="text-moss italic italic-serif">It Fails at Control.</span>
              </h2>
            </div>

            <div className="space-y-6 max-w-lg">
              <p className="t-editorial text-[19px] text-dim-text leading-relaxed font-light opacity-80">
                The most dangerous systems do not fail visibly. They continue to operate while records drift, decisions decay, and auditability collapses.
              </p>
            </div>

            <div className="pt-8 border-t border-white/5">
              <p className="t-editorial text-moss text-2xl lg:text-[36px] leading-tight tracking-tight">
                The cost of unguided intelligence <span className="text-white/20 font-mono text-[11px] block mt-1">is not error.</span>
                <span className="text-off-white font-semibold">It is institutional drift.</span>
              </p>
            </div>
          </div>

          {/* Center Hub — Otimizado */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-visible">
            <svg className="w-full h-full" viewBox="0 0 1440 800">
              <path className="connector-path path-0" d="M650,400 C700,400 750,150 850,150" stroke="rgba(136,176,75,0.2)" strokeWidth="1" fill="none" opacity="0" />
              <path className="connector-path path-1" d="M650,400 C700,400 750,400 850,400" stroke="rgba(245,158,11,0.2)" strokeWidth="1" fill="none" opacity="0" />
              <path className="connector-path path-2" d="M650,400 C700,400 750,650 850,650" stroke="rgba(152,71,49,0.2)" strokeWidth="1" fill="none" opacity="0" />
            </svg>

            <div 
              ref={hubRef}
              className="absolute left-[45%] top-1/2 -translate-y-1/2 w-80 h-80 flex items-center justify-center opacity-30"
            >
              <div className="hub-ring absolute inset-0 border border-white/5 rounded-full" />
              <div className="hub-content relative z-10 text-center p-10 bg-black/60 backdrop-blur-xl border border-white/5 rounded-full w-48 h-48 flex flex-col justify-center items-center">
                <span className="t-mono text-[7px] text-moss tracking-[0.4em] uppercase">INITIATION</span>
                <div className="mt-4 w-px h-10 bg-moss/30" />
              </div>
            </div>
          </div>

          {/* Right Column — Consequence Blocks */}
          <div className="lg:col-span-7 flex flex-col gap-6 lg:gap-8 relative z-20">
            <ConsequenceBlock 
              index={0}
              label="SYSTEM RECORD"
              status="Misaligned"
              statusColor="#88B04B"
              body="Output was recorded. System state no longer matches operational truth."
              signal="Source Integrity: Degraded"
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 7V17C4 18.6569 7.58172 20 12 20C16.4183 20 20 18.6569 20 17V7M4 7C4 8.65685 7.58172 10 12 10C16.4183 10 20 8.65685 20 7M4 7C4 5.34315 7.58172 4 12 4C16.4183 4 20 5.34315 20 7M4 12C4 13.6569 7.58172 15 12 15C16.4183 15 20 13.6569 20 12" /></svg>}
            />
            <ConsequenceBlock 
              index={1}
              label="WORKFLOW LOGIC"
              status="Diverging"
              statusColor="#F59E0B"
              body="Downstream actions continue from assumptions no longer verifiable."
              signal="Decision Basis: Unstable"
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3H5V7H9V3Z"/><path d="M19 3H15V7H19V3Z"/><path d="M9 17H5V21H9V17Z"/><path d="M7 7V17"/><path d="M17 7V11C17 12.1046 16.1046 13 15 13H9"/></svg>}
            />
            <ConsequenceBlock 
              index={2}
              label="GOVERNANCE LAYER"
              status="Escalated"
              statusColor="#984731"
              body="The system remains active. Operational trust no longer exists."
              signal="Control State: Compromised"
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 9V14M12 17.01L12.01 16.9989M10.29 3.86L1.82 18C1.64531 18.3024 1.55299 18.6452 1.55197 18.9945C1.55095 19.3437 1.64127 19.6871 1.81451 19.9913C1.98775 20.2954 2.23785 20.5498 2.5414 20.7303C2.84495 20.9108 3.19121 21.0113 3.546 21.022L20.454 21.022C20.8088 21.0113 21.155 20.9108 21.4586 20.7303C21.7621 20.5498 22.0122 20.2954 22.1855 19.9913C22.3587 19.6871 22.441 19.3437 22.448 18.9945C22.447 18.6452 22.3547 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32319 12.9812 3.15449C12.6817 2.98579 12.3437 2.89697 12 2.89697C11.6563 2.89697 11.3183 2.98579 11.0188 3.15449C10.7193 3.32319 10.4683 3.56611 10.29 3.86V3.86Z"/></svg>}
            />
          </div>

        </div>

        {/* FOOTER METADATA */}
        <div className="border-t border-white/5 p-6 lg:px-20 flex flex-wrap justify-between items-center gap-8 bg-black/20 relative z-30">
          <div className="flex gap-12">
            <div className="space-y-1">
              <span className="t-mono text-[8px] text-white/20 block uppercase tracking-widest">Diagnostic Pattern</span>
              <span className="t-mono text-[10px] text-off-white font-medium">Silent Divergence</span>
            </div>
            <div className="space-y-1">
              <span className="t-mono text-[8px] text-white/20 block uppercase tracking-widest">Control State</span>
              <span className="t-mono text-[10px] text-rust flex items-center gap-2">
                CRITICAL_DECAY
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 opacity-30">
            <span className="t-brand text-xl text-white tracking-[0.3em] uppercase">Elysian</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ControlFailure;
