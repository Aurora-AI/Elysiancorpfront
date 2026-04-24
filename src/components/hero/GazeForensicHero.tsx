import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ForensicCodeCascade } from './ForensicCodeCascade';
import { getAnimationDefaults } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

const SEQUENCE = [
  { type: 'letter', value: 'E', vertical: 'LEX',     factoryId: 'AURORA_V8_LEX' },
  { type: 'photo',  value: '/assets/portraits/portrait_1.png', vertical: 'LEX', factoryId: 'AURORA_V8_LEX' },
  { type: 'letter', value: 'L', vertical: 'CRM',     factoryId: 'AURORA_V8_CRM' },
  { type: 'photo',  value: '/assets/portraits/portrait_2.png', vertical: 'CRM', factoryId: 'AURORA_V8_CRM' },
  { type: 'letter', value: 'Y', vertical: 'MAD LAB', factoryId: 'AURORA_V8_LAB' },
  { type: 'photo',  value: '/assets/portraits/portrait_3.png', vertical: 'MAD LAB', factoryId: 'AURORA_V8_LAB' },
  { type: 'letter', value: 'S', vertical: 'LEX',     factoryId: 'AURORA_V8_LEX' },
  { type: 'photo',  value: '/assets/portraits/portrait_4.png', vertical: 'LEX', factoryId: 'AURORA_V8_LEX' },
  { type: 'letter', value: 'I', vertical: 'CRM',     factoryId: 'AURORA_V8_CRM' },
  { type: 'photo',  value: '/assets/portraits/portrait_5.png', vertical: 'CRM', factoryId: 'AURORA_V8_CRM' },
  { type: 'letter', value: 'A', vertical: 'MAD LAB', factoryId: 'AURORA_V8_LAB' },
  { type: 'photo',  value: '/assets/portraits/portrait_6.png', vertical: 'MAD LAB', factoryId: 'AURORA_V8_LAB' },
  { type: 'letter', value: 'N', vertical: 'LEX',     factoryId: 'AURORA_V8_LEX' },
  { type: 'photo',  value: '/assets/portraits/portrait_7.png', vertical: 'LEX', factoryId: 'AURORA_V8_LEX' },
];

export function GazeForensicHero() {
  const containerRef = useRef<HTMLElement>(null);
  const flickerRef   = useRef<HTMLDivElement>(null);
  const finalRef     = useRef<HTMLDivElement>(null);
  const subtitleRef  = useRef<HTMLDivElement>(null);

  const [frameIndex, setFrameIndex]   = useState(0);
  const [isHovered, setIsHovered]     = useState(false);
  const [isFinalState, setIsFinalState] = useState(false);

  const anim = getAnimationDefaults();

  useEffect(() => {
    if (anim.duration < 0.2) { setIsFinalState(true); return; }
    const t = setTimeout(() => setIsFinalState(true), 4000);
    return () => clearTimeout(t);
  }, [anim.duration]);

  useEffect(() => {
    if (isFinalState) return;
    if (anim.duration < 0.2) { setFrameIndex(0); return; }
    const speed = isHovered ? 300 : 120;
    const id = setInterval(() => setFrameIndex(p => (p + 1) % SEQUENCE.length), speed);
    return () => clearInterval(id);
  }, [isHovered, isFinalState, anim.duration]);

  useLayoutEffect(() => {
    const el = flickerRef.current;
    if (!el) return;
    const reduced = anim.duration < 0.2;
    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { opacity: 0, scale: reduced ? 1 : 1.02 },
      {
        opacity: 1,
        scale: 1,
        duration: reduced ? 0 : 1.2,
        delay: reduced ? 0 : 0.5,
        ease: "power4.out",
      }
    );
  }, []);

  useEffect(() => {
    if (!isFinalState) return;
    const elFinal    = finalRef.current;
    const elSubtitle = subtitleRef.current;
    const section    = containerRef.current;
    if (!elFinal || !elSubtitle || !section) return;

    const isReduced = anim.duration < 0.2;

    // 1. Sovereign Reveal: Transition to Light (Parchment)
    gsap.to(section, {
      backgroundColor: '#F4F1EA',
      duration: isReduced ? 0.01 : 1.8,
      ease: "expo.inOut",
    });

    // 2. Content Reveal: Elysian on Light
    gsap.fromTo(
      elFinal,
      { opacity: 0, y: isReduced ? 0 : 40, filter: 'blur(20px)' },
      { 
        opacity: 1, 
        y: 0, 
        filter: 'blur(0px)',
        duration: isReduced ? 0.01 : 2.2, 
        ease: "power4.out", 
        delay: 0.5 
      }
    );
    gsap.fromTo(
      elSubtitle,
      { opacity: 0, y: isReduced ? 0 : 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: isReduced ? 0.01 : 1.5, 
        ease: "power3.out", 
        delay: 1.2 
      }
    );

    // 3. Scroll effects
    const ctx = gsap.context(() => {
      gsap.to(flickerRef.current, {
        opacity: 0,
        y: -150,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, [isFinalState]);

  const photoForMask = SEQUENCE.find(f => f.type === 'photo')?.value ?? '';

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center transition-colors duration-1000"
      style={{ backgroundColor: '#0A0A0B' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ForensicCodeCascade isHovered={isHovered} isFinalState={isFinalState} />

      {/* Top Header Label - Adaptive Color */}
      <div className={`absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-px py-12 transition-colors duration-1000 ${isFinalState ? 'text-obsidian/40' : 'text-parchment-text/40'}`}>
        <div className="flex items-center gap-12">
          <span className="t-mono text-[11px] uppercase tracking-widest">
            ELYSIAN TRUSTWARE // SVRN_ID
          </span>
          <div className={`w-16 h-px transition-colors duration-1000 ${isFinalState ? 'bg-obsidian/10' : 'bg-emerald/20'}`} />
          <span className="t-mono text-[10px] uppercase">
            INTELIGÊNCIA SOBERANA PARA OPERAÇÕES DE ALTO IMPACTO
          </span>
        </div>
        <span className="t-mono text-[10px]">
          MAD LAB AURORA © 2026
        </span>
      </div>

      <div
        ref={flickerRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center"
        style={{ opacity: 0 }}
      >
        <div className="absolute top-32 left-px z-50">
          <span className={`t-mono text-[11px] transition-colors duration-1000 ${isFinalState ? 'text-obsidian/30' : 'text-emerald'}`}>
            VERTICAL: {SEQUENCE[frameIndex].vertical}
          </span>
        </div>

        {!isFinalState && (
          <div className="absolute inset-0 flex items-center justify-center">
            {SEQUENCE.map((frame, idx) => (
              <div
                key={idx}
                style={{ opacity: frameIndex === idx ? 1 : 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {frame.type === 'letter' ? (
                  <div
                    className="t-display text-[28vw] md:text-[22vw] select-none text-emerald"
                    style={{ filter: 'contrast(1.1) brightness(1.2) drop-shadow(0 0 40px rgba(16, 185, 129, 0.15))' }}
                  >
                    {frame.value}
                  </div>
                ) : (
                  <img
                    src={frame.value}
                    alt="Forensic Frame"
                    className="h-full w-full object-cover grayscale contrast-[1.8] brightness-110 mix-blend-screen opacity-20"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {isFinalState && (
          <div className="flex flex-col items-center justify-center w-full max-w-7xl">
            <div
              ref={finalRef}
              className="t-display text-[25vw] md:text-[18vw] select-none tracking-tighter"
              style={{
                opacity: 0,
                color: '#0A0A0A', // Ink
                filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.05))',
              }}
            >
              ELYSIAN
            </div>

            <div
              ref={subtitleRef}
              className="mt-6 flex flex-col items-center"
              style={{ opacity: 0 }}
            >
              <div className="t-mono text-[12px] text-emerald mb-6 tracking-[0.3em] font-bold">
                [ PROTOCOLO DE CREDENCIAMENTO TÉCNICO ATIVO ]
              </div>
              <div className="w-24 h-[0.5px] bg-obsidian/10 mb-10" />
              <p className="t-editorial text-2xl md:text-3xl text-obsidian/60 font-light max-w-3xl text-center leading-relaxed">
                Dar superpoderes a pessoas usando <span className="text-emerald font-medium">IA como infraestrutura invisível</span>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Forensic Metadata - Adaptive Color */}
      <div className={`absolute bottom-12 right-px z-30 text-right transition-colors duration-1000 ${isFinalState ? 'text-obsidian/40' : 'text-parchment-text/40'}`}>
        <div className="t-mono text-[10px] leading-loose">
          <p>INDUSTRIAL INTELLIGENCE // AURORA_V8</p>
          <p>STRATEGY: MAD LAB AURORA</p>
          <p>ARTIFACT: 2026.Q2.CERT</p>
          <p className={isFinalState ? 'text-emerald/60' : 'text-parchment-text/40'}>{isHovered ? `FACTORY_ID: ${SEQUENCE[frameIndex].factoryId}` : 'SVRN_OPERATOR: ACTIVE'}</p>
        </div>
      </div>
    </section>
  );
}
