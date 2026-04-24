import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const Header: React.FC = () => {
    const headerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        gsap.fromTo(headerRef.current,
            { opacity: 0, y: -20 },
            {
                opacity: 1,
                y: 0,
                duration: 1.5,
                delay: 1.2,
                ease: "power4.out"
            }
        );
    }, { scope: headerRef });

    return (
        <header ref={headerRef} className="fixed top-0 left-0 w-full z-[100] px-px py-8 flex justify-between items-center mix-blend-difference pointer-events-none">
            {/* LOGO AREA */}
            <div className="flex items-center gap-12 pointer-events-auto">
                <div className="w-8 h-8 bg-emerald rounded-sm flex items-center justify-center">
                    <span className="text-obsidian font-bold text-xs">E</span>
                </div>
                <span className="t-display text-xl tracking-tight text-white uppercase">ELYSIAN</span>
            </div>

            {/* NAVIGATION AREA */}
            <nav className="hidden md:flex items-center gap-12 pointer-events-auto">
                {['Trustware', 'Architecture', 'Elysian Lex', 'Silent Ops'].map((item) => (
                    <a 
                        key={item} 
                        href="#" 
                        className="t-mono text-[10px] text-white/60 hover:text-emerald transition-colors duration-300 uppercase"
                    >
                        {item}
                    </a>
                ))}
                <button className="px-5 py-2 bg-emerald text-obsidian t-mono text-[10px] hover:bg-emerald-hover transition-all duration-300 rounded-sm uppercase font-bold">
                    Protocolo
                </button>
            </nav>

            {/* METADATA AREA */}
            <div className="flex gap-4 items-center pointer-events-auto">
                <div className="w-12 h-[1px] bg-emerald/30 hidden sm:block" />
                <span className="text-[0.65rem] font-mono text-dim-text tracking-tighter uppercase">EST. 2026 // SVRN</span>
            </div>
        </header>
    );
};
