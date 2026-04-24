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
            { opacity: 0.4, x: 0, duration: 1.5, ease: "power2.out" },
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
            <div className="flex flex-col items-center space-y-4 mb-24">
                <span ref={taglineRef} className="t-mono text-[10px] text-ink/40 tracking-[0.6em] opacity-0">
                    Sovereign Intelligence
                </span>
                <h1 ref={titleRef} className="t-brand text-[15vw] lg:text-[12vw] text-ink text-center opacity-0">
                    ELYSIAN
                </h1>
            </div>

            <div 
                ref={scrollRef}
                className="absolute bottom-12 flex flex-col items-center opacity-0"
            >
                <span className="t-mono text-[8px] text-ink/40 mb-2">
                    Descend
                </span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-emerald to-transparent" />
            </div>
        </div>
    );
};
