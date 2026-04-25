import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAnimationDefaults } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

const AUDIT_LOGS = [
  { time: '0.00ms', action: 'INIT_SOVEREIGN_ID', status: 'OK' },
  { time: '1.24ms', action: 'SCAN_CORPUS_MAPPING', status: 'OK' },
  { time: '2.50ms', action: 'DETECT_HALLUCINATION_DRIFT', status: '0%' },
  { time: '4.12ms', action: 'VERIFY_TRUSTWARE_SHA', status: 'VALID' },
  { time: '5.89ms', action: 'CERTIFY_OUTPUT_ELITE', status: 'READY' },
];

export const TrustwareReality: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [activeLog, setActiveLog] = useState(0);
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

      // Cycle logs
      const logTl = gsap.timeline({
        scrollTrigger: {
          trigger: terminalRef.current,
          start: 'top 60%',
        },
        repeat: -1,
        repeatDelay: 3
      });

      AUDIT_LOGS.forEach((_, i) => {
        logTl.call(() => setActiveLog(i), [], i * 0.4);
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
                [ 02 // Prova de Realidade ]
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
            className="w-full aspect-video bg-black rounded-sm border border-white/5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col relative group"
          >
            {/* TERMINAL HEADER */}
            <div className="h-12 bg-white/5 border-b border-white/10 flex items-center justify-between px-6">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-moss/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-moss/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-moss/10" />
              </div>
              <span className="t-mono text-[10px] text-white/20 uppercase tracking-[0.2em]">ElysianLex_Sovereign_Viewer_v2.1</span>
            </div>

            {/* TERMINAL BODY */}
            <div className="flex-1 p-10 font-mono text-[11px] space-y-5">
              <div className="text-moss/60 pb-5 border-b border-white/5 mb-5 tracking-widest uppercase">
                {">"} INITIALIZING FORENSIC_AUDIT_SEQUENCE...
              </div>
              
              <div className="space-y-3">
                {AUDIT_LOGS.map((log, i) => (
                  <div 
                    key={i} 
                    className={`flex justify-between transition-all duration-500 ${i <= activeLog ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  >
                    <span className="text-white/40">[{log.time}] {log.action}</span>
                    <span className={log.status === 'OK' || log.status === 'VALID' ? 'text-moss' : 'text-moss/80'}>{log.status}</span>
                  </div>
                ))}
              </div>

              {activeLog === AUDIT_LOGS.length - 1 && (
                <div className="mt-12 p-8 bg-moss/5 border border-moss/20 rounded-sm animate-pulse">
                  <div className="text-moss text-[11px] mb-4 uppercase tracking-[0.3em]">Integrity Verified</div>
                  <div className="text-white/90 t-editorial italic text-xl md:text-2xl leading-tight">
                    "O especialista decide, o sistema governa, o modelo apenas processa."
                  </div>
                </div>
              )}
            </div>

            {/* GRID OVERLAY */}
            <div className="absolute inset-0 bg-[url('/assets/textures/grid-dark.svg')] opacity-[0.05] pointer-events-none" />
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
