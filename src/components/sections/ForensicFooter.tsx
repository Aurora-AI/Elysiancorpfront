import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ForensicFooter: React.FC = () => {
    const footerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 80%",
                }
            });

            tl.from(".char", {
                yPercent: 100,
                opacity: 0,
                rotateX: 45,
                duration: 1.2,
                stagger: 0.03,
                ease: "power4.out"
            })
            .from(".footer-cta", {
                opacity: 0,
                y: 20,
                duration: 1,
                ease: "power3.out"
            }, "-=0.8")
            .from(".footer-link", {
                opacity: 0,
                x: -5,
                stagger: 0.02,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.5");

        }, footerRef);

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
        <footer
            ref={footerRef}
            className="section-shell world-dark py-32 px-px overflow-hidden relative border-t border-moss/10"
        >
            <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center text-center space-y-24">

                {/* FINAL STATEMENT: Monumental Voice */}
                <div className="space-y-12">
                    <h2 className="t-display text-[clamp(4rem,10vw,10rem)] text-white leading-[0.85] font-light">
                        <span className="block italic opacity-30 text-8xl md:text-[6vw]">A autoridade é</span>
                        <span className="block text-moss mt-4 font-bold">{splitText("DEMONSTRADA.")}</span>
                    </h2>

                    <div className="footer-cta flex flex-col items-center gap-10">
                        <button className="group relative px-24 py-8 bg-moss text-black t-mono text-[11px] tracking-[0.4em] overflow-hidden transition-all duration-700 hover:text-white uppercase font-bold rounded-sm">
                            <span className="relative z-10">[ DEPLOY_SOVEREIGNTY ]</span>
                            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-monumental" />
                        </button>
                        
                        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 t-mono text-[10px] text-moss/60 tracking-[0.4em] uppercase font-mono">
                            <span>LOCAL VAULT: SECURED</span>
                            <span>AGENTIC MESH: ACTIVE</span>
                            <span>SOVEREIGNTY: 100%</span>
                        </div>
                    </div>
                </div>

                {/* NAVIGATION ARCHITECTURE */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-24 pt-32 border-t border-white/10 text-left">
                    <div className="space-y-12">
                        <span className="t-mono text-[11px] text-moss uppercase tracking-[0.3em]">Sistemas</span>
                        <div className="flex flex-col space-y-5">
                            {["Elysian Lex", "CRM Aurora", "Fiduciary Backoffice", "Mad Lab Aurora"].map((link, i) => (
                                <a key={i} href="#" className="footer-link t-editorial text-lg text-white/40 hover:text-moss transition-colors duration-500">
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-12">
                        <span className="t-mono text-[11px] text-moss uppercase tracking-[0.3em]">Rede</span>
                        <div className="flex flex-col space-y-5">
                            {["Instagram", "Twitter", "LinkedIn", "GitHub"].map((link, i) => (
                                <a key={i} href="#" className="footer-link t-editorial text-lg text-white/40 hover:text-moss transition-colors duration-500">
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-12 md:text-right">
                        <span className="t-mono text-[11px] text-moss uppercase tracking-[0.3em]">[ 08 // Conclusion ]</span>
                        <div className="space-y-6">
                            <p className="t-mono text-[10px] text-white/30 leading-loose uppercase tracking-tight font-mono">
                                © 2026 ELYSIAN CORP. <br />
                                TODOS OS DIREITOS RESERVADOS. <br />
                                PARTE DO ECOSSISTEMA MAD LAB AURORA.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Noise Overlay */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] halftone-noise" />
        </footer>
    );
};
