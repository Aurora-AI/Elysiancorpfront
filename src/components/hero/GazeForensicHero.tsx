import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SEQUENCE = [
  { vertical: 'SVRN_ID', factoryId: 'AURORA_V8_LEX', image: '/assets/portraits/portrait_1.png' },
  { vertical: 'LEGAL',   factoryId: 'AURORA_V8_LEX', image: '/assets/portraits/portrait_2.png' },
  { vertical: 'CRM',     factoryId: 'AURORA_V8_CRM', image: '/assets/portraits/portrait_3.png' },
  { vertical: 'LAB',     factoryId: 'AURORA_V8_LAB', image: '/assets/portraits/portrait_4.png' },
  { vertical: 'ARCH',    factoryId: 'AURORA_V8_LEX', image: '/assets/portraits/portrait_5.png' },
  { vertical: 'CORE',    factoryId: 'AURORA_V8_AI',  image: '/assets/portraits/portrait_6.png' },
];

export function GazeForensicHero() {
  const containerRef = useRef<HTMLElement>(null);
  const darkLayerRef = useRef<HTMLDivElement>(null);
  const lightLayerRef = useRef<HTMLDivElement>(null);
  const wordmarkRef  = useRef<HTMLDivElement>(null);
  const subtitleRef  = useRef<HTMLDivElement>(null);

  const [frameIndex, setFrameIndex] = useState(0);
  const [isFinalState, setIsFinalState] = useState(false);

  // 1. DUAL-PHASE ORCHESTRATION
  useEffect(() => {
    // Phase 1: Dark World (5s)
    const stopMotionInterval = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % SEQUENCE.length);
    }, 150); // Fast stop-motion flicker

    // Phase 2: Transition (after 5s)
    const transitionTimer = setTimeout(() => {
      clearInterval(stopMotionInterval);
      setIsFinalState(true);
    }, 5000);

    return () => {
      clearInterval(stopMotionInterval);
      clearTimeout(transitionTimer);
    };
  }, []);

  // 2. GSAP TRANSITIONS
  useLayoutEffect(() => {
    if (!isFinalState) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // The Sovereign Jump (2s Transition)
      tl.to(containerRef.current, {
        backgroundColor: '#F8F7F3',
        duration: 2,
        ease: "power4.inOut"
      })
      .to(darkLayerRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: "power4.inOut"
      }, "<")
      .to(lightLayerRef.current, {
        opacity: 1,
        duration: 2,
        ease: "power4.inOut"
      }, "<")
      
      // Wordmark Reveal (Lanche Font)
      .fromTo(wordmarkRef.current, 
        { opacity: 0, y: 40, filter: 'blur(20px)' },
        { 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)', 
          duration: 2.2, 
          ease: "expo.out" 
        }, "-=0.5"
      )
      
      // Subtitle Reveal (Jakarta Sans)
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.5, 
          ease: "power3.out" 
        }, "-=1.5"
      );

      // Scroll Fade Out
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -100,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "bottom 90%",
          end: "bottom top",
          scrub: true
        }
      });
    });

    return () => ctx.revert();
  }, [isFinalState]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center world-dark"
      style={{ backgroundColor: '#000000' }}
    >
      {/* ─── PHASE 1: DARK WORLD LAYER ─── */}
      <div 
        ref={darkLayerRef}
        className="absolute inset-0 z-20 flex items-center justify-center bg-black"
        style={{ opacity: isFinalState ? 0 : 1 }}
      >
        {/* Stop-Motion Portraits */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {SEQUENCE.map((frame, idx) => (
            <img
              key={idx}
              src={frame.image}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-75 mix-blend-screen transition-opacity duration-75 ${
                frameIndex === idx ? 'opacity-20' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        {/* Forensic Metadata (Dark) */}
        <div className="absolute top-12 left-12 z-30 t-mono text-[10px] text-emerald/40">
          <p>SVRN_ID: {SEQUENCE[frameIndex].factoryId}</p>
          <p>VERTICAL: {SEQUENCE[frameIndex].vertical}</p>
        </div>
        
        <div className="absolute bottom-12 right-12 z-30 t-mono text-[10px] text-white/20 text-right">
          <p>ELYSIAN_TRUSTWARE // R6_ACTIVE</p>
          <p>© 2026 MAD LAB AURORA</p>
        </div>

        {/* The "Tension" Scramble (S-Tier Detail) */}
        <div className="z-10 t-display text-[15vw] text-white/5 select-none pointer-events-none">
          {SEQUENCE[frameIndex].vertical}
        </div>
      </div>

      {/* ─── PHASE 2: LUMINOUS WORLD LAYER ─── */}
      <div 
        ref={lightLayerRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-12"
        style={{ opacity: 0 }}
      >
        <div className="max-w-7xl w-full flex flex-col items-center">
          {/* Brand Wordmark (Lanche Font) */}
          <div
            ref={wordmarkRef}
            className="t-brand text-[22vw] md:text-[16vw] text-ink select-none"
            style={{ 
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.03))',
              willChange: 'transform, opacity'
            }}
          >
            ELYSIAN
          </div>

          {/* Subtitle & CTA (Jakarta Sans) */}
          <div ref={subtitleRef} className="flex flex-col items-center -mt-8">
            <div className="t-mono text-[11px] text-emerald mb-8 tracking-[0.4em] font-semibold">
              [ INTELIGÊNCIA SOBERANA // V1.2.0 ]
            </div>
            <p className="t-editorial text-2xl md:text-3xl text-ink/60 max-w-2xl text-center">
              Construindo infraestrutura invisível para <br />
              <span className="text-ink font-medium">humanos extraordinários.</span>
            </p>
            
            {/* Emerald Indicator */}
            <div className="mt-16 w-px h-24 bg-emerald/20 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_10px_#10B981]" />
            </div>
          </div>
        </div>

        {/* Forensic Metadata (Light) */}
        <div className="absolute bottom-12 left-12 z-30 t-mono text-[10px] text-ink/20">
          <p>FACTORY: MAD LAB AURORA</p>
          <p>STATUS: OPERATIONAL_SVRN</p>
        </div>
      </div>

      {/* Grain / Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] halftone-noise" />
    </section>
  );
}
