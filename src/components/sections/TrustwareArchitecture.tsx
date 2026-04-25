import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAnimationDefaults } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

export const TrustwareArchitecture: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const anim = getAnimationDefaults();

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                }
            });

            tl.from(".arch-element", {
                opacity: 0,
                y: 30,
                duration: anim.duration,
                ease: "power4.out",
                stagger: 0.1
            });

            // Animate lines
            gsap.from(".arch-line", {
                scaleX: 0,
                duration: 1.5,
                ease: "expo.inOut",
                stagger: 0.2,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 60%",
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, [anim.duration]);

    return (
        <section
            ref={sectionRef}
            className="section-shell world-dark py-32 px-px overflow-hidden flex flex-col relative"
            style={{ backgroundColor: '#000000' }}
        >
            {/* TOP METADATA BAR */}
            <div className="relative z-10 w-full flex justify-between items-center mb-24 border-b border-parchment-text/10 pb-8">
                <div className="flex items-center gap-6">
                    <span className="t-mono text-[11px] text-moss uppercase tracking-[0.3em]">
                        Cognitive Operating System // COS_SVRN_V8.0
                    </span>
                </div>
                <div className="t-mono text-[10px] text-parchment-text/40 tracking-tighter uppercase font-mono">
                    Agentic_Governance_Layer
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-24 items-start flex-grow">
                
                {/* LEFT COLUMN: THE DIFFERENTIATOR */}
                <div className="lg:col-span-5 space-y-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-6 arch-element">
                            <span className="t-mono text-[11px] text-moss tracking-[0.2em]">
                                03 // Arquitetura
                            </span>
                            <div className="h-[0.5px] w-16 bg-moss/30" />
                        </div>
                        
                        <h2 className="arch-element t-display text-6xl md:text-8xl text-parchment-text leading-[0.9] tracking-tighter">
                            O Pipeline de <br />
                            <span className="italic font-light">Ingestão</span> <br />
                            <span className="italic font-light text-moss">Cognitiva (CIP).</span>
                        </h2>
                    </div>

                    <div className="space-y-8 text-parchment-text/60 t-editorial text-xl leading-relaxed max-w-sm arch-element">
                        <p>
                            A infraestrutura Elysian não consome apenas dados; ela metaboliza conhecimento. O nosso pipeline processa inputs complexos — de contratos a registos de áudio.
                        </p>
                        <p className="text-base text-parchment-text/40">
                            Através de um barramento de eventos (NATS) de alta performance, eliminamos o preenchimento manual do CRM e criamos uma memória corporativa viva e auditável.
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: THE BLUEPRINT GRID */}
                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-px bg-moss/10 border border-moss/10">
                    
                    {/* GRID CELL 1: SILENT INGESTION */}
                    <div className="bg-black p-12 space-y-8 arch-element relative group hover:bg-moss/[0.02] transition-colors duration-500">
                        <div className="t-mono text-[10px] text-moss uppercase mb-4 tracking-[0.3em]">Metabolização</div>
                        <h3 className="t-display text-4xl text-parchment-text font-bold">Silent Ingestion</h3>
                        <p className="t-mono text-[10px] text-parchment-text/40 leading-relaxed font-mono">
                            Captura e estruturação automática de dados heterogéneos sem intervenção ou fricção humana.
                        </p>
                        <div className="arch-line absolute bottom-0 left-0 w-full h-[0.5px] bg-moss/40 origin-left" />
                    </div>

                    {/* GRID CELL 2: EVENT BUS (NATS) */}
                    <div className="bg-black p-12 space-y-8 arch-element relative group hover:bg-moss/[0.02] transition-colors duration-500">
                        <div className="t-mono text-[10px] text-moss uppercase mb-4 tracking-[0.3em]">Orquestração</div>
                        <h3 className="t-display text-4xl text-parchment-text font-bold">Event Bus (NATS)</h3>
                        <p className="t-mono text-[10px] text-parchment-text/40 leading-relaxed font-mono">
                            Barramento de eventos de baixa latência para orquestração reativa de agentes em tempo real.
                        </p>
                        <div className="arch-line absolute bottom-0 left-0 w-full h-[0.5px] bg-moss/40 origin-left" />
                    </div>

                    {/* GRID CELL 3: DETERMINISTIC LOGIC */}
                    <div className="bg-black p-12 space-y-8 arch-element relative group hover:bg-moss/[0.02] transition-colors duration-500">
                        <div className="t-mono text-[10px] text-moss uppercase mb-4 tracking-[0.3em]">Segurança</div>
                        <h3 className="t-display text-4xl text-parchment-text font-bold">Deterministic Logic</h3>
                        <p className="t-mono text-[10px] text-parchment-text/40 leading-relaxed font-mono">
                            Validação rigorosa de tokens via HMAC e filtros semânticos antes de qualquer interação com modelos de linguagem.
                        </p>
                    </div>

                    {/* GRID CELL 4: COGNITIVE MEMORY */}
                    <div className="bg-black p-12 space-y-8 arch-element relative group hover:bg-moss/[0.02] transition-colors duration-500">
                        <div className="t-mono text-[10px] text-moss uppercase mb-4 tracking-[0.3em]">Persistence</div>
                        <h3 className="t-display text-4xl text-parchment-text font-bold">Local Vault</h3>
                        <p className="t-mono text-[10px] text-parchment-text/40 leading-relaxed font-mono">
                            Armazenamento local encriptado de segredos industriais e memória corporativa de longo prazo.
                        </p>
                    </div>

                </div>
            </div>


            {/* BACKGROUND SCHEMATIC */}
            <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none select-none flex items-center justify-center">
                <div className="w-[80%] aspect-square border border-moss/20 rounded-full animate-slow-spin" />
                <div className="absolute w-px h-full bg-moss/20 left-1/2 -translate-x-1/2" />
                <div className="absolute w-full h-px bg-moss/20 top-1/2 -translate-y-1/2" />
            </div>

            {/* Grain / Noise Overlay */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02] halftone-noise" />
        </section>
    );
};
