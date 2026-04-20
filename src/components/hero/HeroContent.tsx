import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const HeroContent: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const taglineRef = useRef<HTMLParagraphElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 0.8 }); // Rule of Silence delay

        // Title Reveal
        tl.fromTo(titleRef.current, 
            { opacity: 0, y: 30, filter: 'blur(10px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 2, ease: "expo.out" }
        );

        // Tagline Reveal
        tl.fromTo(taglineRef.current, 
            { opacity: 0, x: -20 },
            { opacity: 0.8, x: 0, duration: 1.5, ease: "power2.out" },
            "-=1.2"
        );

        // Scroll Hint reveal
        tl.fromTo(scrollRef.current,
            { opacity: 0, y: 10 },
            { opacity: 0.4, y: 0, duration: 2, ease: "power2.out" },
            "-=0.5"
        );

        // Continuous pulse for scroll hint
        gsap.to(scrollRef.current, {
            y: 10,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-6">
            <div className="text-center">
                <h1 
                    ref={titleRef}
                    className="text-[clamp(3rem,10vw,8rem)] font-extrabold text-[#F4F1EA] tracking-tighter leading-[0.9] mb-4"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                >
                    ELYSIAN<br />CORP
                </h1>
                
                <p 
                    ref={taglineRef}
                    className="text-[clamp(1rem,2vw,1.5rem)] italic text-[#F4F1EA] opacity-0 max-w-[600px] mx-auto"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                    Sovereign Intelligence. Absolute Determinism.
                </p>
            </div>

            <div 
                ref={scrollRef}
                className="absolute bottom-12 flex flex-col items-center opacity-0"
            >
                <span className="text-[0.6rem] uppercase tracking-[0.4em] text-[#D4AF37] mb-2" style={{ fontFamily: 'DM Mono, monospace' }}>
                    Descend
                </span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-[#D4AF37] to-transparent" />
            </div>
        </div>
    );
};
