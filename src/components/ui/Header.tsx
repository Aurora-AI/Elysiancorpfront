import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export const Header: React.FC = () => {
    const headerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        gsap.fromTo(headerRef.current,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 1.5, delay: 1.2, ease: "power4.out" }
        );
    }, { scope: headerRef });

    return (
        <header ref={headerRef} className="fixed top-0 left-0 w-full z-[100] px-8 py-10 flex justify-between items-center mix-blend-difference pointer-events-none">
            {/* LOGO AREA */}
            <div className="flex items-center gap-16 pointer-events-auto">
                <div className="w-8 h-8 bg-moss rounded-sm flex items-center justify-center">
                    <span className="text-obsidian font-bold text-xs">E</span>
                </div>
            </div>

            {/* NAVIGATION AREA */}
            <nav className="hidden md:flex items-center gap-16 pointer-events-auto">
                {['Trustware', 'Architecture', 'Elysian Lex', 'Silent Ops'].map((item) => (
                    <a 
                        key={item} 
                        href="#" 
                        className="t-mono text-[13px] text-white/80 hover:text-moss transition-colors duration-300 uppercase tracking-wider"
                    >
                        {item}
                    </a>
                ))}
                <button className="px-5 py-2 bg-moss text-obsidian t-mono text-[13px] hover:bg-moss/90 transition-all duration-300 rounded-sm uppercase font-bold">
                    Protocolo
                </button>
            </nav>

            {/* METADATA AREA */}
            <div className="flex gap-8 items-center pointer-events-auto">
                <div className="w-16 h-[1px] bg-moss/40 hidden sm:block" />
                <span className="text-[13px] font-mono text-white/60 tracking-tighter uppercase">EST. 2026 // SVRN</span>
            </div>
        </header>
    );
};
