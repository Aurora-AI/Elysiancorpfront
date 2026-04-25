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
                    <span className="t-mono text-[10px] text-moss">
                        Análise Sistêmica // ELY-INFRA-001
                    </span>
                </div>
                <div className="t-mono text-[9px] text-parchment/30">
                    Sovereign_Protocol_v8.0
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start flex-grow">
                
                {/* LEFT COLUMN: THE HOOK */}
                <div className="lg:col-span-5 space-y-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 problem-element">
                            <span className="t-mono text-[10px] text-moss">
                                05 // Fosso Tecnológico
                            </span>
                            <div className="h-[1px] w-12 bg-moss/30" />
                        </div>
                        
                        <h2 className="problem-element t-display text-6xl md:text-8xl text-parchment leading-[0.9] tracking-tighter">
                            Hibridismo <br />
                            <span className="italic">Determi-</span> <br />
                            <span className="italic text-moss">nístico.</span>
                        </h2>
                    </div>

                    <div className="space-y-6 max-w-sm pt-10 border-t border-parchment/10">
                        <p className="problem-element t-mono text-[11px] leading-relaxed text-parchment/60 uppercase">
                            Não acreditamos em autonomia total sem controlo absoluto. Fusão de LLMs com contratos de engenharia.
                        </p>
                        <div className="t-mono text-[9px] text-moss/40 font-mono">REF_ID: 0x42_17 // Mad Lab Aurora</div>
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
                            <span className="t-mono text-[10px] text-parchment/40 uppercase">Infraestrutura Crítica</span>
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-moss animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="t-mono text-[10px] text-moss uppercase font-mono">Status: Secure Edge</span>
                            </div>
                        </div>

                        <div className="space-y-10 text-parchment text-xl md:text-2xl t-editorial leading-relaxed tracking-tight max-w-2xl">
                            <p className="problem-element italic opacity-95">
                                A nossa vantagem reside na fusão de modelos probabilísticos com lógica determinística rigorosa.
                            </p>
                            <p className="problem-element text-parchment/70">
                                A Matriz de Operações Elysian garante que cada decisão da IA seja validada por contratos de engenharia, impedindo desvios cognitivos e garantindo a soberania total dos dados sensíveis.
                            </p>
                            <p className="problem-element text-parchment/70">
                                O resultado é uma infraestrutura que escala a inteligência sem comprometer a previsibilidade, transformando a IA numa ferramenta de governação institucional e não apenas num gerador de texto.
                            </p>
                        </div>
                    </div>

                    {/* KPI BENTO GRID */}
                    <div className="grid grid-cols-2 border border-parchment/10 problem-element bg-parchment/[0.02]">
                        <div className="p-10 border-r border-b border-parchment/10 space-y-4 group hover:bg-moss/[0.05] transition-colors">
                            <div className="text-5xl t-display text-moss">70%</div>
                            <div className="t-mono text-[9px] text-parchment/40 leading-tight uppercase font-mono">Lógica <br /> Determinística</div>
                        </div>
                        <div className="p-10 border-b border-parchment/10 space-y-4 group hover:bg-moss/[0.05] transition-colors">
                            <div className="text-5xl t-display text-moss">30%</div>
                            <div className="t-mono text-[9px] text-parchment/40 leading-tight uppercase font-mono">Inferência <br /> Probabilística</div>
                        </div>
                        <div className="p-10 border-r border-b border-parchment/10 space-y-4 group hover:bg-moss/[0.05] transition-colors">
                            <div className="text-5xl t-display text-moss">100%</div>
                            <div className="t-mono text-[9px] text-parchment/40 leading-tight uppercase font-mono">Validação <br /> Humana (Gate)</div>
                        </div>
                        <div className="p-10 space-y-4 group hover:bg-moss/[0.05] transition-colors">
                            <div className="text-5xl t-display text-moss">Local</div>
                            <div className="t-mono text-[9px] text-parchment/40 leading-tight uppercase font-mono">Soberania <br /> de Dados (Vault)</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM METADATA BAR */}
            <div className="relative z-10 w-full flex justify-between items-center mt-24 border-t border-parchment/10 pt-8 opacity-40">
                <span className="t-mono text-[9px]">Elysian Trustware Corp // Agentic Governance Layer 2026</span>
                <div className="flex gap-8">
                    <span className="t-mono text-[9px]">SEC_LVL // 09</span>
                    <span className="t-mono text-[9px]">v8.0.0-SVRN</span>
                </div>
            </div>

        </section>
    );
};
