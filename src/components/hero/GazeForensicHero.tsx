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

export function GazeForensicHero({ lang = 'pt-br' }: { lang?: string }) {
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

    // Sovereign Reveal e content animations — sem ScrollTrigger interno,
    // que conflitaria com o Lenis do SequenceRig.
    const isReduced = anim.duration < 0.2;

    // 1. Sovereign Reveal: Transition to Light (Parchment)
    gsap.to(section, {
      backgroundColor: '#F8F7F3',
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
  }, [isFinalState]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center transition-colors duration-1000"
      style={{ backgroundColor: '#0D0D0C' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ForensicCodeCascade isHovered={isHovered} isFinalState={isFinalState} />

      {/* Top Header Label - Adaptive Color */}
      <div className={`absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-13 transition-colors duration-1000 ${isFinalState ? 'text-ink/40' : 'text-[var(--silver-technical)]'}`}>
        <div className="flex items-center gap-13">
          <span className="t-mono text-[13px] uppercase tracking-widest">
            [ PROTOCOL: TRUSTWARE ]
          </span>
          <div className={`w-21 h-px transition-colors duration-1000 ${isFinalState ? 'bg-ink/10' : 'bg-[var(--gold-muted)]/30'}`} />
          <span className="t-mono text-[13px] uppercase">
            [ EXECUTION: HYBRID ZERO-TRUST ]
          </span>
        </div>
        <span className="t-mono text-[13px]">
          ELYSIAN CORP © 2026
        </span>
      </div>

      <div
        ref={flickerRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center"
        style={{ opacity: 0 }}
      >
        <div className="absolute top-34 left-8 z-50">
          <span className={`t-mono text-[13px] transition-colors duration-1000 ${isFinalState ? 'text-ink/30' : 'text-[var(--gold-sovereign)]'}`}>
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
                    className="t-display text-[34vw] md:text-[21vw] select-none text-[var(--silver-glimmer)]"
                    style={{ filter: 'contrast(1.2) brightness(1.2) drop-shadow(0 0 55px rgba(229, 231, 235, 0.2))' }}
                  >
                    {frame.value}
                  </div>
                ) : (
                  <img
                    src={frame.value}
                    alt="Forensic Frame"
                    className="h-full w-full object-cover grayscale contrast-[2] brightness-125 mix-blend-screen opacity-30"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {isFinalState && (
          <div className="flex flex-col items-center justify-center w-full max-w-7xl px-8">
            <div
              ref={finalRef}
              className="t-brand text-[21vw] md:text-[144px] select-none tracking-tighter"
              style={{
                opacity: 0,
                color: '#1A1A17', // Ink
                filter: 'drop-shadow(0 13px 34px rgba(0,0,0,0.05))',
              }}
            >
              ELYSIAN
            </div>

            <div
              ref={subtitleRef}
              className="mt-8 flex flex-col items-center"
              style={{ opacity: 0 }}
            >
              <p className="t-editorial text-[21px] md:text-[34px] text-ink/80 font-light max-w-4xl text-center leading-tight md:leading-relaxed">
                {lang === 'pt-br' ? (
                  <>
                    O mercado aprendeu a escalar respostas.<br />
                    Nós construímos controle.
                  </>
                ) : (
                  <>
                    The market optimized for output.<br />
                    We engineered for integrity.
                  </>
                )}
              </p>
              
              <button className="mt-13 px-8 py-4 bg-moss text-white t-mono text-sm hover:bg-moss/90 transition-all duration-300 rounded-sm uppercase tracking-widest font-bold">
                [ DEPLOY_SOVEREIGNTY ]
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Forensic Metadata - Adaptive Color */}
      <div className={`absolute bottom-13 right-8 z-30 text-right transition-colors duration-1000 ${isFinalState ? 'text-ink/40' : 'text-[var(--silver-technical)]'}`}>
        <div className="t-mono text-[13px] leading-loose">
          <p>INDUSTRIAL INTELLIGENCE // AURORA_V8</p>
          <p>STRATEGY: MAD LAB AURORA</p>
          <p>ARTIFACT: 2026.Q2.CERT</p>
          <p className={isFinalState ? 'text-moss/60' : 'text-[var(--gold-sovereign)]/70'}>{isHovered ? `FACTORY_ID: ${SEQUENCE[frameIndex].factoryId}` : 'SVRN_OPERATOR: ACTIVE'}</p>
        </div>
      </div>
    </section>
  );
}
