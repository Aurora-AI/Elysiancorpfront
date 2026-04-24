import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAnimationDefaults } from '../../lib/animations';
import { FloatingPaths } from '../ui/background-paths';

gsap.registerPlugin(ScrollTrigger);

export const TrustwareAnswer: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const determinismRef = useRef<HTMLDivElement>(null);
    const latencyRef = useRef<HTMLSpanElement>(null);
    const anim = getAnimationDefaults();

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 60%",
                }
            });

            tl.from(".char", {
                yPercent: anim.duration > 0.1 ? 100 : 0,
                opacity: 0,
                rotateX: anim.duration > 0.1 ? -45 : 0,
                duration: anim.duration,
                stagger: anim.stagger,
                ease: "expo.out"
            })
            .from(".answer-content", {
                opacity: 0,
                y: anim.duration > 0.1 ? 20 : 0,
                duration: anim.duration * 0.8,
                ease: "expo.out"
            }, "-=0.8")
            .from(".answer-image", {
                opacity: 0,
                scale: anim.duration > 0.1 ? 0.98 : 1,
                duration: anim.duration * 1.2,
                ease: "expo.out"
            }, "-=1.2");

            // COUNTER ANIMATIONS
            const counterObj = { value: 0, latency: 1.2 };
            
            gsap.to(counterObj, {
                value: 100,
                duration: 2.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: determinismRef.current,
                    start: "top 90%",
                },
                onUpdate: () => {
                    if (determinismRef.current) {
                        determinismRef.current.innerText = `${Math.floor(counterObj.value)}%`;
                    }
                }
            });

            gsap.to(counterObj, {
                latency: 0.4,
                duration: 2,
                ease: "power3.inOut",
                scrollTrigger: {
                    trigger: latencyRef.current,
                    start: "top 90%",
                },
                onUpdate: () => {
                    if (latencyRef.current) {
                        latencyRef.current.innerText = `${counterObj.latency.toFixed(1)}ms`;
                    }
                }
            });

            if (anim.duration > 0.1) {
                gsap.to(".answer-image", {
                    yPercent: -10,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const splitText = (text: string) => {
        return text.split("").map((char, i) => (
            <span key={i} className="char inline-block will-change-transform">
                {char === " " ? "\u00A0" : char}
            </span>
        ));
    };

    return (
        <section
            ref={sectionRef}
            className="section-shell bg-parchment overflow-hidden"
        >
            {/* WHISPER MOTION: TOP (REDUCED DENSITY) */}
            <div className="absolute top-0 left-0 right-0 h-[20dvh] opacity-[0.03] pointer-events-none rotate-180">
                <FloatingPaths position={-1} />
            </div>

            <div className="relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--s20)] items-start">

                    {/* LEFT: IMAGE (ASSET) - ASYMMETRIC 5/12 */}
                    <div className="lg:col-span-5 order-2 lg:order-1 lg:sticky lg:top-[var(--s20)]">
                        <div className="answer-image relative aspect-[4/5] bg-ink/5 overflow-hidden border border-ink/10">
                            <img
                                src="/assets/editorial/sculpture.png"
                                alt="Deterministic Integrity"
                                className="w-full h-full object-cover scale-110 grayscale"
                            />
                            {/* OVERLAY GRID */}
                            <div className="absolute inset-0 bg-[url('/assets/textures/grid-light.svg')] opacity-[0.03]" />
                            
                            {/* FORENSIC MARKER */}
                            <div className="absolute bottom-4 left-4 t-mono text-[8px] text-ink/40 uppercase tracking-widest">
                                [ REF: ELY-INT-003 // INTEGRITY_CHECK ]
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: OPERATIONAL NARRATIVE - 7/12 */}
                    <div className="lg:col-span-7 order-1 lg:order-2 space-y-[var(--s16)]">
                        <div className="space-y-[var(--s6)]">
                            <div className="flex items-center gap-4">
                                <span className="t-mono text-aureate text-[10px] tracking-[0.3em] uppercase">
                                    [ ELY-003: Core Architecture ]
                                </span>
                                <div className="h-[0.5px] flex-1 bg-ink/10" />
                            </div>

                            <h2 className="t-headline text-ink leading-[1.05]">
                                <span className="block">ARQUITETURA</span>
                                <span className="block text-ink/40 italic">DETERMINÍSTICA</span>
                            </h2>
                        </div>

                        <div className="answer-content max-w-xl space-y-[var(--s12)]">
                            <div className="space-y-[var(--s8)]">
                                <p className="t-editorial text-ink text-2xl leading-tight">
                                    Sistemas operacionais soberanos exigem veracidade matemática em nível de infraestrutura.
                                </p>
                                <p className="t-body text-ink/70 leading-relaxed">
                                    O protocolo Elysian impõe governança determinística em todos os nós de processamento, eliminando o <span className="italic">drift</span> cognitivo em ambientes de missão crítica. Não é uma promessa de agilidade, é uma garantia de execução invariante.
                                </p>
                            </div>

                            {/* DIAGNOSTIC GRID (MICRO) */}
                            <div className="grid grid-cols-2 gap-[var(--s8)] py-[var(--s8)] border-y border-ink/5">
                                <div className="space-y-2">
                                    <span className="t-mono text-[9px] text-ink/40 tracking-widest uppercase">Determinism</span>
                                    <div ref={determinismRef} className="t-headline text-3xl italic text-ink">0%</div>
                                </div>
                                <div className="space-y-2">
                                    <span className="t-mono text-[9px] text-ink/40 tracking-widest uppercase">Auth_Status</span>
                                    <div className="t-headline text-3xl italic text-aureate">Sovereign</div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-[var(--s4)]">
                                <div className="flex items-center gap-8">
                                    <button className="group relative flex items-center gap-6 px-10 py-5 bg-ink text-parchment t-mono text-[10px] tracking-[0.3em] transition-all duration-500 hover:bg-aureate overflow-hidden uppercase">
                                        <span className="relative z-10">Executar Protocolo</span>
                                        <svg className="w-4 h-4 relative z-10 group-hover:translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 12 12">
                                            <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    
                                    <div className="hidden sm:block">
                                        <span className="t-mono text-ink/40 text-[9px] uppercase tracking-tighter block">
                                            Latency: <span ref={latencyRef} className="text-ink">1.2ms</span>
                                        </span>
                                        <span className="t-mono text-ink/40 text-[9px] uppercase tracking-tighter block">
                                            Throughput: 10PB/s
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* GHOST WORD - VOZ 2 */}
            <div className="absolute bottom-8 right-8 opacity-[0.02] pointer-events-none select-none">
                <span className="t-display text-[15vw] text-ink leading-none">FORENSIC</span>
            </div>
        </section>
    );
};

