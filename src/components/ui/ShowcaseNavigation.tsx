import React from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollToPlugin);
}

interface Category {
    id: string;
    label: string;
}

const categories: Category[] = [
    { id: 'heroes', label: 'Heroes' },
    { id: 'backgrounds', label: 'Backgrounds' },
    { id: 'interactions', label: 'Interactions' },
    { id: 'typography', label: 'Typography' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'effects', label: 'Shaders_&_Effects' },
];

export const ShowcaseNavigation: React.FC = () => {
    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: { y: element, offsetY: 80 },
                ease: "power4.inOut"
            });
        }
    };

    return (
        <nav className="fixed right-12 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col gap-6 items-end pointer-events-none">
            {categories.map((cat, i) => (
                <button
                    key={cat.id}
                    onClick={() => scrollTo(cat.id)}
                    className="group flex items-center gap-4 text-[#F4F1EA]/20 hover:text-[#F4F1EA] transition-all duration-700 pointer-events-auto"
                >
                    <span className="font-mono text-[9px] opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-700 uppercase tracking-widest">
                        {cat.label}
                    </span>
                    <div className="flex items-center">
                        <span className="font-mono text-[8px] mr-2 opacity-10 group-hover:opacity-100">0{i + 1}</span>
                        <div className="w-8 h-[1px] bg-[#F4F1EA]/10 group-hover:bg-[#D4AF37] group-hover:w-12 transition-all duration-700"></div>
                    </div>
                </button>
            ))}
            
            <div className="absolute right-0 top-[-60px] mono text-[9px] opacity-20 vertical-text tracking-[0.5em]">
                SCROLL_INDEX
            </div>
        </nav>
    );
};
