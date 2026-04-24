import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IdentityFragmenter } from '../fx/IdentityFragmenter';

gsap.registerPlugin(ScrollTrigger);

export const SectionGap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the left section while right scrolls
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftRef.current,
        pinSpacing: false,
        scrub: true,
      });

      // Gradient transition bg: Parchment → Ink-ish
      gsap.to(containerRef.current, {
        backgroundColor: "#2A2A27", 
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        }
      });

      // Change text color on transition
      gsap.to([leftRef.current], {
        color: "#F4F1EA",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 20%",
          end: "top -20%",
          scrub: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-parchment overflow-hidden halftone-noise"
      id="gap"
    >
      <div className="flex flex-col md:flex-row min-h-[200vh]">
        {/* Left: Identity (40%) */}
        <div 
          ref={leftRef}
          className="w-full md:w-[40%] h-screen flex flex-col justify-center px-10 md:px-20 z-10"
        >
          <span className="t-mono text-[10px] text-aureate mb-10">
            02 // O GAP DETERMINÍSTICO
          </span>
          <h2 className="t-headline text-5xl md:text-7xl text-ink leading-[1.05] mb-12">
            A Verdade não é <br />
            <span className="italic">relativa</span>, <br />
            é binária.
          </h2>
          <div className="w-12 h-px bg-aureate/30 mb-10" />
          <p className="t-editorial text-lg md:text-xl text-ink/70 max-w-sm mb-16">
            No vácuo entre o dado bruto e a sentença jurídica, o Elysian Lex reconstrói a cadeia de custódia com precisão atômica.
          </p>
          <a 
            href="#mechanism" 
            className="group relative inline-flex items-center t-mono text-[11px] text-ink py-2"
          >
            <span className="relative z-10">ENTRAR NO MECANISMO</span>
            <div className="absolute bottom-0 left-0 w-full h-px bg-aureate scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            <span className="ml-4 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
          </a>
        </div>

        {/* Right: Content/Effect (60%) */}
        <div className="w-full md:w-[60%] relative flex flex-col items-center">
          <div className="sticky top-0 w-full h-screen flex items-center justify-center p-10 md:p-20">
            <div className="w-full h-[60vh] md:h-[75vh] overflow-hidden grayscale contrast-125 transition-all duration-1000">
              <IdentityFragmenter 
                imageSrc="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
              />
            </div>
            
            {/* Metadata Overlays */}
            <div className="absolute top-1/4 right-10 t-mono text-[9px] text-ink/20 space-y-3 pointer-events-none mix-blend-difference">
              <div className="flex justify-between w-40 border-b border-ink/10 pb-1 text-white"><span>X-COORD</span><span>42.001</span></div>
              <div className="flex justify-between w-40 border-b border-ink/10 pb-1 text-white"><span>Y-COORD</span><span>-12.884</span></div>
              <div className="flex justify-between w-40 border-b border-ink/10 pb-1 text-white"><span>HASH</span><span>SHA-256</span></div>
            </div>
          </div>
          
          <div className="h-screen"></div>
        </div>
      </div>
    </section>
  );
};
