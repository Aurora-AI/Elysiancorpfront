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
            className="relative min-h-screen bg-obsidian py-32 px-px overflow-hidden flex flex-col halftone-noise"
        >
            {/* TOP METADATA BAR */}
            <div className="relative z-10 w-full flex justify-between items-center mb-24 border-b border-parchment-text/10 pb-8">
                <div className="flex items-center gap-6">
                    <span className="t-mono text-[11px] text-emerald uppercase tracking-[0.3em]">
                        Arquitetura Sistêmica // MCP_SVRN_V8
                    </span>
                </div>
                <div className="t-mono text-[10px] text-dim-text tracking-tighter uppercase font-mono">
                    Proprietary_Stack_2026
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-24 items-start flex-grow">
                
                {/* LEFT COLUMN: THE DIFFERENTIATOR */}
                <div className="lg:col-span-5 space-y-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-6 arch-element">
                            <span className="t-mono text-[11px] text-emerald tracking-[0.2em]">
                                03 // Diferenciação Técnica
                            </span>
                            <div className="h-[0.5px] w-16 bg-emerald/30" />
                        </div>
                        
                        <h2 className="arch-element t-headline text-6xl md:text-8xl text-parchment-text leading-[0.9] tracking-tighter">
                            Além do <br />
                            <span className="italic">Prompt</span> <br />
                            <span className="italic text-emerald">Engin-</span> <br />
                            <span className="italic text-emerald">eering</span>
                        </h2>
                    </div>

                    <div className="space-y-8 text-parchment-text/70 t-editorial text-xl leading-relaxed max-w-sm arch-element">
                        <p>
                            Não construímos camadas de conversa. Construímos camadas de <span className="text-parchment-text italic font-medium">execução determinística</span>.
                        </p>
                        <p className="text-base text-dim-text">
                            Utilizamos o protocolo MCP para desacoplar a lógica de negócio do modelo de fundação, garantindo que a Aurora opere como um sistema operacional, não um chatbot.
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: THE BLUEPRINT GRID */}
                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-px bg-emerald/10 border border-emerald/10">
                    
                    {/* GRID CELL 1: MCP */}
                    <div className="bg-obsidian p-12 space-y-8 arch-element relative group hover:bg-obsidian-alt transition-colors duration-500">
                        <div className="t-mono text-[10px] text-emerald uppercase mb-4 tracking-[0.3em]">Protocol Layer</div>
                        <h3 className="t-headline text-4xl text-parchment-text">MCP Sovereign</h3>
                        <p className="t-mono text-[10px] text-dim-text leading-relaxed font-mono">
                            Integração nativa com Model Context Protocol para acesso seguro a ferramentas e dados locais sem exposição de corpus.
                        </p>
                        <div className="arch-line absolute bottom-0 left-0 w-full h-[0.5px] bg-emerald/40 origin-left" />
                    </div>

                    {/* GRID CELL 2: AGENTIC LOGIC */}
                    <div className="bg-obsidian p-12 space-y-8 arch-element relative group hover:bg-obsidian-alt transition-colors duration-500">
                        <div className="t-mono text-[10px] text-emerald uppercase mb-4 tracking-[0.3em]">Logic Engine</div>
                        <h3 className="t-headline text-4xl text-parchment-text">Aurora-Agents</h3>
                        <p className="t-mono text-[10px] text-dim-text leading-relaxed font-mono">
                            Orquestração multi-agente com estados de memória persistentes e validação de saída via Pydantic Schemas.
                        </p>
                        <div className="arch-line absolute bottom-0 left-0 w-full h-[0.5px] bg-emerald/40 origin-left" />
                    </div>

                    {/* GRID CELL 3: SECURITY */}
                    <div className="bg-obsidian p-12 space-y-8 arch-element relative group hover:bg-obsidian-alt transition-colors duration-500">
                        <div className="t-mono text-[10px] text-emerald uppercase mb-4 tracking-[0.3em]">Security Layer</div>
                        <h3 className="t-headline text-4xl text-parchment-text">Trustware Guard</h3>
                        <p className="t-mono text-[10px] text-dim-text leading-relaxed font-mono">
                            Camada de firewall semântico que detecta e bloqueia drifts cognitivos e tentativas de injeção de prompt.
                        </p>
                    </div>

                    {/* GRID CELL 4: INFRA */}
                    <div className="bg-obsidian p-12 space-y-8 arch-element relative group hover:bg-obsidian-alt transition-colors duration-500">
                        <div className="t-mono text-[10px] text-emerald uppercase mb-4 tracking-[0.3em]">Infra Layer</div>
                        <h3 className="t-headline text-4xl text-parchment-text">Mad Lab Core</h3>
                        <p className="t-mono text-[10px] text-dim-text leading-relaxed font-mono">
                            Infraestrutura otimizada para execução local e edge, reduzindo latência operacional para {"<"} 20ms.
                        </p>
                    </div>

                </div>
            </div>

            {/* BOTTOM METADATA BAR */}
            <div className="relative z-10 w-full flex justify-between items-center mt-24 border-t border-parchment-text/10 pt-8 opacity-40">
                <span className="t-mono text-[10px] tracking-tight">ELYSIAN ARCHITECTURE // SYSTEM_BLUEPRINT_V8</span>
                <div className="flex gap-8">
                    <span className="t-mono text-[10px]">SVRN_CORE // ACTIVE</span>
                    <span className="t-mono text-[10px]">AUTH: MAD_LAB</span>
                </div>
            </div>

            {/* BACKGROUND SCHEMATIC */}
            <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none select-none flex items-center justify-center">
                <div className="w-[80%] aspect-square border border-emerald/20 rounded-full animate-slow-spin" />
                <div className="absolute w-px h-full bg-emerald/20 left-1/2 -translate-x-1/2" />
                <div className="absolute w-full h-px bg-emerald/20 top-1/2 -translate-y-1/2" />
            </div>
        </section>
    );
};
