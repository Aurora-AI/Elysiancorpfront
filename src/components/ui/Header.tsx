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
                delay: 1.2, // Slightly after the Hero background starts reveal
                ease: "expo.out" 
            }
        );
    }, { scope: headerRef });

    return (
        <header ref={headerRef} className="fixed top-0 left-0 w-full z-[100] px-8 py-6 flex justify-between items-center mix-blend-difference pointer-events-none">
            <div className="logo flex flex-col pointer-events-auto">
                <span className="text-[1.5rem] font-bold tracking-tighter leading-none text-[#D4AF37]" style={{ fontFamily: 'Syne, sans-serif' }}>
                    ELYSIAN
                </span>
                <span className="text-[0.6rem] uppercase tracking-[0.3em] font-light opacity-60 text-[#F4F1EA]" style={{ fontFamily: 'DM Mono, monospace' }}>
                    Sovereign Intelligence
                </span>
            </div>

            <nav className="hidden md:flex gap-12 pointer-events-auto">
                {['PRODUCT', 'INTEL', 'MANIFESTO'].map((item) => (
                    <a 
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        className="text-[0.7rem] tracking-[0.2em] font-medium text-[#F4F1EA] hover:text-[#D4AF37] transition-colors duration-300"
                        style={{ fontFamily: 'DM Mono, monospace' }}
                    >
                        {item}
                    </a>
                ))}
            </nav>

            <div className="flex gap-4 pointer-events-auto">
                <div className="w-10 h-[1px] bg-[#D4AF37] mt-[0.6rem] opacity-50 hidden sm:block" />
                <span className="text-[0.7rem] font-mono text-[#F4F1EA] opacity-40">v2.0.26</span>
            </div>
        </header>
    );
};
