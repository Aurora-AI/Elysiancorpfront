import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAnimationDefaults } from '../../lib/animations';
import { FloatingPaths } from '../ui/background-paths';

gsap.registerPlugin(ScrollTrigger);

export const TrustwareProblem: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const anim = getAnimationDefaults();

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                }
            });

            tl.from(".problem-element", {
                opacity: 0,
                y: 30,
                duration: anim.duration * 1.2,
                ease: "power2.out",
                stagger: 0.15
            });

        }, sectionRef);

        return () => ctx.revert();
    }, [anim.duration]);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-[100dvh] bg-ink py-32 px-[8vw] overflow-hidden flex flex-col halftone-noise"
        >
            {/* BACKGROUND ASSET: WHISPER MOTION (Deep Contrast) */}
            <div className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none text-parchment">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            {/* TOP METADATA BAR */}
            <div className="relative z-10 w-full flex justify-between items-center mb-24 border-b border-parchment/10 pb-8">
                <div className="flex items-center gap-4">
                    <span className="t-mono text-[10px] text-aureate">
                        Análise Sistêmica // ELY-INFRA-001
                    </span>
                </div>
                <div className="t-mono text-[9px] text-parchment/30">
                    Sovereign_Protocol_v2.0
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start flex-grow">
                
                {/* LEFT COLUMN: THE HOOK */}
                <div className="lg:col-span-5 space-y-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 problem-element">
                            <span className="t-mono text-[10px] text-aureate">
                                01 // O Desafio
                            </span>
                            <div className="h-[1px] w-12 bg-aureate/30" />
                        </div>
                        
                        <h2 className="problem-element t-headline text-6xl md:text-8xl text-parchment leading-[0.9] tracking-tighter">
                            O Gap <br />
                            <span className="italic">Determi-</span> <br />
                            <span className="italic text-aureate">nístico</span>
                        </h2>
                    </div>

                    <div className="space-y-6 max-w-sm pt-10 border-t border-parchment/10">
                        <p className="problem-element t-mono text-[11px] leading-relaxed text-parchment/60">
                            Probabilistic inference requires a deterministic security layer.
                        </p>
                        <div className="t-mono text-[9px] text-aureate/40">REF_ID: 0x42_17 // Mad Lab Aurora</div>
                    </div>
                </div>

                {/* VERTICAL HAIRLINE SEPARATOR (LG ONLY) */}
                <div className="hidden lg:flex lg:col-span-1 h-full justify-center">
                    <div className="w-[1px] h-full bg-parchment/10" />
                </div>

                {/* RIGHT COLUMN: DIAGNOSIS & STATS */}
                <div className="lg:col-span-6 space-y-20">
                    <div className="space-y-10">
                        <div className="flex justify-between items-center border-b border-parchment/10 pb-6 problem-element">
                            <span className="t-mono text-[10px] text-parchment/40">Diagnóstico Crítico</span>
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                <span className="t-mono text-[10px] text-red-500/80">Active Threat: Hallucination</span>
                            </div>
                        </div>

                        <div className="space-y-10 text-parchment text-xl md:text-2xl t-editorial leading-relaxed tracking-tight max-w-2xl">
                            <p className="problem-element italic opacity-95">
                                A dependência de modelos probabilísticos para validar a própria integridade representa um risco sistêmico inaceitável.
                            </p>
                            <p className="problem-element text-parchment/70">
                                Modelos de fundação não podem certificar o próprio output — tratar a alucinação como problema de <span className="text-parchment italic">prompt tuning</span> ignora a falha arquitetural.
                            </p>
                            <p className="problem-element text-parchment/70">
                                A ElysianCorp implementa uma camada de <span className="text-aureate italic">Trustware Soberano</span> que opera como um hypervisor determinístico. Desacoplamos a inferência da verificação, garantindo que infraestruturas críticas operem sobre ativos de dados certificados.
                            </p>
                        </div>
                    </div>

                    {/* KPI BENTO GRID */}
                    <div className="grid grid-cols-2 border border-parchment/10 problem-element bg-parchment/[0.02]">
                        <div className="p-10 border-r border-b border-parchment/10 space-y-4 group hover:bg-parchment/[0.05] transition-colors">
                            <div className="text-5xl t-headline text-aureate">100%</div>
                            <div className="t-mono text-[9px] text-parchment/40 leading-tight">Outputs <br /> Auditáveis</div>
                        </div>
                        <div className="p-10 border-b border-parchment/10 space-y-4 group hover:bg-parchment/[0.05] transition-colors">
                            <div className="text-5xl t-headline text-aureate">0×</div>
                            <div className="t-mono text-[9px] text-parchment/40 leading-tight">Dependência <br /> de LLM Nativo</div>
                        </div>
                        <div className="p-10 border-r border-parchment/10 space-y-4 group hover:bg-parchment/[0.05] transition-colors">
                            <div className="text-5xl t-headline text-aureate flex items-center leading-none">
                                <span className="text-6xl -mt-2">∞</span>
                            </div>
                            <div className="t-mono text-[9px] text-parchment/40 leading-tight">Escala <br /> Enterprise</div>
                        </div>
                        <div className="p-10 space-y-4 group hover:bg-parchment/[0.05] transition-colors">
                            <div className="text-5xl t-headline text-aureate">SHA</div>
                            <div className="t-mono text-[9px] text-parchment/40 leading-tight">Certificação <br /> Imutável</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM METADATA BAR */}
            <div className="relative z-10 w-full flex justify-between items-center mt-24 border-t border-parchment/10 pt-8 opacity-40">
                <span className="t-mono text-[9px]">Elysian Trustware Corp — Mad Lab Aurora 2026</span>
                <div className="flex gap-8">
                    <span className="t-mono text-[9px]">SEC_LVL // 09</span>
                    <span className="t-mono text-[9px]">v2.0.26-ELITE</span>
                </div>
            </div>
        </section>
    );
};
