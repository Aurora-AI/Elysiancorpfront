import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * EXO_FLUID_HERO: The Emotive Intelligence Interface
 * Philosophy: Liquid Editorial / Sophisticated Storytelling
 * Standard: Exo Ape S-Tier
 */
export function ExoFluidHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. INITIAL ENRANCE (The Rule of Silence: 0.8s)
            const tl = gsap.timeline({ delay: 0.8 });

            tl.from(".char", {
                yPercent: 100,
                opacity: 0,
                rotateX: 45,
                duration: 1.8,
                stagger: 0.05,
                ease: "power4.out"
            })
            .from(".hero-subtext", {
                opacity: 0,
                y: 20,
                duration: 1.5,
                ease: "power3.out"
            }, "-=1.2")
            .from(".hero-image-mask", {
                scale: 1.2,
                opacity: 0,
                duration: 2.5,
                ease: "expo.out"
            }, "-=2");

            // 2. PARALLAX & COLOR TRANSITION ON SCROLL
            gsap.to(bgRef.current, {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            gsap.to(containerRef.current, {
                backgroundColor: "#0A0A0B",
                duration: 1,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "center top",
                    end: "bottom top",
                    scrub: true
                }
            });

            // 3. PERPETUAL LIQUID FLOAT
            gsap.to(".hero-title", {
                y: -15,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const splitText = (text: string) => {
        return text.split("").map((char, i) => (
            <span key={i} className="char inline-block">
                {char === " " ? "\u00A0" : char}
            </span>
        ));
    };

    return (
        <section 
            ref={containerRef}
            className="relative min-h-screen w-full overflow-hidden bg-[#F4F1EA] flex flex-col items-center justify-center transition-colors duration-1000"
        >
            {/* BACKGROUND IMAGE - FLUID PARALLAX */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <div ref={bgRef} className="hero-image-mask relative w-[80vw] h-[70vh] overflow-hidden grayscale contrast-[1.1] hover:grayscale-0 transition-all duration-1000">
                    <img 
                        src="/assets/editorial/hero_fluid.png" 
                        alt="Elysian Fluidity" 
                        className="w-full h-full object-cover scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#F4F1EA]/20 via-transparent to-[#F4F1EA]/40" />
                </div>
            </div>

            {/* OVERLAY CONTENT */}
            <div className="relative z-10 w-full px-[8vw] flex flex-col items-center text-center">
                <div className="space-y-12">
                    <div className="flex flex-col items-center space-y-4">
                        <span className="hero-subtext font-mono text-[10px] text-slate-500 uppercase tracking-[0.6em]">
                            Sovereign Intelligence
                        </span>
                        <div className="h-[1px] w-12 bg-slate-300" />
                    </div>

                    <h1 ref={textRef} className="hero-title font-display text-[15vw] lg:text-[12vw] text-black leading-[0.8] uppercase flex flex-wrap justify-center overflow-hidden mix-blend-difference invert">
                        {splitText("ELYSIAN")}
                    </h1>

                    <div className="hero-subtext max-w-lg mx-auto space-y-6">
                        <p className="font-label text-lg lg:text-xl text-black/60 uppercase tracking-tight leading-tight">
                            The transformation of probability into deterministic truth.
                        </p>
                        <button className="px-10 py-4 border border-black/10 bg-transparent text-black text-[10px] font-mono uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-500">
                            Explore Protocol
                        </button>
                    </div>
                </div>
            </div>

            {/* DECORATIVE ELEMENTS */}
            <div className="absolute bottom-12 left-12 flex flex-col space-y-2 opacity-30">
                <span className="font-mono text-[8px] text-slate-500 uppercase">Artifact_01</span>
                <span className="font-mono text-[8px] text-slate-500 uppercase">2026 // Mad Lab</span>
            </div>
            
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/[0.03] -translate-y-1/2 pointer-events-none" />
        </section>
    );
}
