import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAnimationDefaults } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

interface NarrativeBlockProps {
  label: string;
  body: string;
  footerSignal: string;
  index: number;
  gradient: string;
}

const NarrativeBlock: React.FC<NarrativeBlockProps> = ({ label, body, footerSignal, index, gradient }) => {
  return (
    <div 
      className="narrative-block relative group will-change-[filter,transform]"
      style={{ zIndex: 10 + index }}
    >
      {/* Rainbow Glow Layer - Kinetic shimmer */}
      <div 
        className="absolute -inset-[1px] rounded-[1.2rem] opacity-30 group-hover:opacity-100 transition-opacity duration-700 blur-[2px] animate-gradient-shimmer"
        style={{ 
          background: gradient,
          backgroundSize: '200% 200%'
        }}
      />
      
      {/* Outer Blur Glow (Spill) */}
      <div 
        className="absolute -inset-[34px] rounded-[3rem] opacity-10 blur-[55px] pointer-events-none transition-opacity duration-700 group-hover:opacity-40"
        style={{ background: gradient }}
      />

      {/* Main Card Body */}
      <div className="narrative-content relative bg-white border border-ink/20 rounded-[13px] p-[34px] shadow-[0_34px_89px_-21px_rgba(0,0,0,0.15)] flex flex-col gap-[21px] min-w-[320px] md:min-w-[440px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-[13px]">
            <div className="w-[21px] h-[21px] rounded-[3px] bg-ink/5 flex items-center justify-center border border-ink/5">
              <span className="t-mono text-[8px] text-ink/60 font-bold">{index + 1}</span>
            </div>
            <span className="t-mono text-[13px] text-ink font-semibold tracking-[0.2em] uppercase">{label}</span>
          </div>
          <div className="w-[13px] h-[13px] rounded-full shadow-[0_0_21px_rgba(0,0,0,0.2)]" style={{ background: gradient }} />
        </div>

        <p className="t-editorial text-[21px] text-ink leading-relaxed font-normal">
          {body}
        </p>

        <div className="flex items-center justify-between pt-[13px] border-t border-ink/10">
          <div className="flex items-center gap-[8px]">
            <div className="w-[5px] h-[5px] rounded-full bg-moss/40 animate-pulse" />
            <span className="t-mono text-[8px] text-ink/40 uppercase tracking-[0.2em]">
              System Trace // {footerSignal}
            </span>
          </div>
          <span className="t-mono text-[8px] text-ink/20">FID: {21 + index * 13}</span>
        </div>
      </div>
    </div>
  );
};

const GlitchLine: React.FC = () => {
  const lineRef = useRef<SVGLineElement>(null);
  
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    tl.to(lineRef.current, {
      strokeDashoffset: 100,
      duration: 5,
      ease: "none"
    });
    
    // Random glitch jumps
    const glitch = () => {
      if (Math.random() > 0.8) {
        gsap.to(lineRef.current, {
          opacity: Math.random(),
          x: (Math.random() - 0.5) * 5,
          duration: 0.1,
          onComplete: () => {
            gsap.to(lineRef.current, { opacity: 1, x: 0, duration: 0.1 });
          }
        });
      }
      setTimeout(glitch, 100 + Math.random() * 2000);
    };
    glitch();
  }, []);

  return (
    <svg width="100%" height="20" className="overflow-visible opacity-30">
      <line 
        ref={lineRef}
        x1="0" y1="10" x2="100%" y2="10" 
        stroke="currentColor" 
        strokeWidth="1" 
        strokeDasharray="4 12"
      />
    </svg>
  );
};

const VacuumGrid: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(78,91,75,0.1) 1px, transparent 1px)`,
          backgroundSize: '34px 34px',
          maskImage: 'linear-gradient(to bottom, black 10%, transparent 40%, transparent 60%, black 90%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 40%, transparent 60%, black 90%)'
        }}
      />
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(90deg, transparent, transparent 33px, rgba(152,71,49,0.3) 33px, rgba(152,71,49,0.3) 34px)'
        }}
      />
    </div>
  );
};

export const IntegrityGap: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  
  const anim = getAnimationDefaults();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Atmospheric Pulse
      gsap.to(glowRef.current, {
        opacity: 0.4,
        scale: 1.2,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Left Content Entry
      gsap.from(leftColumnRef.current?.children || [], {
        opacity: 0,
        x: -40,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      });

      // Per-Block Narrative Reveal (Staggered Storytelling)
      const blocks = gsap.utils.toArray<HTMLElement>(".narrative-block");
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        }
      });

      blocks.forEach((block, index) => {
        const textElements = block.querySelectorAll(".narrative-content *");
        
        // 1. Unified Entry (Card + Text)
        tl.fromTo(block, 
          { opacity: 0, y: 55, filter: 'blur(13px)' },
          { 
            opacity: 1, 
            y: 0, 
            filter: 'blur(0px)',
            duration: 1.3,
            ease: "expo.out",
            onStart: () => {
              gsap.to(".glitch-line", {
                x: index % 2 === 0 ? 21 : -21,
                opacity: 0.8,
                duration: 0.2,
                yoyo: true,
                repeat: 3
              });
            }
          },
          index * 0.5 // Sequential entry "writing a story"
        );

        tl.fromTo(textElements,
          { opacity: 0, y: 8 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.08, 
            ease: "power2.out" 
          }, 
          (index * 0.5) + 0.3
        );

        // 2. Continuous idle motion (Nested to prevent conflict)
        gsap.to(block, {
          y: "-=8",
          duration: 3 + (index * 0.5),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: (index * 0.5) + 1.5
        });
      });

      // 2. Storytelling cascade
      tl.fromTo(".narrative-block", 
        { opacity: 0, y: 30, filter: "blur(4px)", scale: 0.98 },
        { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, duration: 0.6, stagger: 0.08, ease: "power2.out" },
        "-=0.4"
      );

      // 3. Digital Rain Cascade (Standardized Atmospheric)
      const spawnLetter = () => {
        const centerCol = document.getElementById('center-effect-zone');
        if (!centerCol) return;

        const chars = "01$₿ΞΣΩΓΔ";
        const char = chars.charAt(Math.floor(Math.random() * chars.length));
        
        const letter = document.createElement('div');
        letter.className = 'absolute t-mono text-[11px] text-moss/50 pointer-events-none select-none';
        letter.textContent = char;
        letter.style.left = `${Math.random() * 100}%`;
        letter.style.top = '-21px';
        
        // Randomize size and opacity for depth (Invisible Correctness)
        const scale = 0.8 + Math.random() * 1.2;
        letter.style.transform = `scale(${scale})`;
        letter.style.opacity = (0.05 + Math.random() * 0.45).toString();
        
        centerCol.appendChild(letter);

        gsap.to(letter, {
          y: window.innerHeight, 
          opacity: 0,
          duration: 4 + Math.random() * 6,
          ease: "linear",
          onComplete: () => letter.remove()
        });
      };

      const cascadeInterval = setInterval(spawnLetter, 250);

      // Refresh ScrollTrigger after a long delay to sync with Layout preloader (1s)
      setTimeout(() => ScrollTrigger.refresh(), 1200);

      return () => {
        clearInterval(cascadeInterval);
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="section-02-integrity-gap"
      ref={sectionRef} 
      className="relative min-h-[144px] bg-white text-ink py-[144px] overflow-hidden"
    >
      <div 
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[160px] opacity-20 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(78,91,75,0.2) 0%, rgba(217,119,6,0.1) 40%, transparent 70%)"
        }}
      />
      <div className="max-w-[1440px] mx-auto grid grid-cols-13 gap-[34px] relative z-10">
        
        {/* Left Column: Context (Left Aligned) */}
        <div ref={leftColumnRef} className="col-span-13 md:col-span-5 flex flex-col justify-start gap-[55px] px-[21px] md:px-0">
          <div className="space-y-[13px]">
            <span className="t-mono text-[8px] text-ink/40 tracking-[0.5em] block uppercase">
              [ 02 // THE INTEGRITY GAP ]
            </span>
            <h2 className="t-brand text-[55px] md:text-[89px] text-ink leading-[0.85] tracking-tighter">
              AI Has an <br />
              <span className="text-ink">Integrity</span> Problem
              <span className="block mt-[21px] text-moss italic font-light text-[34px] md:text-[55px] tracking-tight opacity-80">
                Not an Adoption Problem
              </span>
            </h2>
          </div>

          <div className="w-[34px] h-[1px] bg-moss/30" />

          <div className="space-y-[21px] max-w-[433px]">
            <p className="t-editorial text-[21px] text-ink/80 leading-relaxed font-light">
              The enterprise barrier to AI was never usability. It was <span className="text-rust italic font-medium">reliability, auditability, and control.</span>
            </p>
            <p className="t-editorial text-[13px] text-ink/50 leading-relaxed uppercase tracking-widest">
              The market scaled probabilistic systems into regulated environments without deterministic safeguards or operational governance.
            </p>
          </div>

          <div className="pt-[34px] border-t border-ink/5 w-full relative">
            <p className="t-editorial text-[34px] text-ink font-semibold leading-[1.1] tracking-tight">
              The missing layer was never intelligence.<br />
              <span className="text-moss italic">It was integrity.</span>
            </p>
            <div className="mt-[5px] glitch-line">
              <GlitchLine />
            </div>
          </div>
        </div>

        {/* Center Column: Effects Container (The Vacuum) */}
        <div id="center-effect-zone" className="hidden lg:flex col-span-3 items-center justify-center h-full relative overflow-visible">
          <VacuumGrid />
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-moss/20 to-transparent relative z-10" />
          
          {/* Central Diagnostic Point */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-32 h-32 rounded-full bg-amber/5 blur-3xl animate-pulse" />
             <div className="w-[1px] h-[144px] bg-rust/30 blur-[2px] animate-pulse" />
          </div>
        </div>

        {/* Right Column: Rainbow Narrative Blocks (Right Aligned) */}
        <div ref={rightColumnRef} className="col-span-13 md:col-span-5 flex flex-col items-center lg:items-end gap-[34px] py-[21px]">
          <NarrativeBlock 
            index={0}
            label="Operational Output"
            body="Response generated successfully. No validation path attached. Operational risk: High."
            footerSignal="Traceability Null"
            gradient="linear-gradient(135deg, #4E5B4B 0%, #88B04B 50%, #D4AF37 100%)"
          />
          
          <NarrativeBlock 
            index={1}
            label="Compliance Review"
            body="Sensitive entities processed externally. No deterministic masking layer detected."
            footerSignal="PII Boundary Violation"
            gradient="linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #984731 100%)"
          />
          
          <NarrativeBlock 
            index={2}
            label="Audit Integrity"
            body="System produced output. No verifiable control path exists between inference and execution."
            footerSignal="Operational Trust Unresolved"
            gradient="linear-gradient(135deg, #984731 0%, #D4AF37 33%, #4E5B4B 66%, #1A1A17 100%)"
          />
          
          {/* Subtle status feed */}
          <div className="mt-[55px] flex gap-[13px] t-mono text-[8px] text-ink/20 uppercase tracking-widest">
            <span>// Reliability &lt; 0.40</span>
            <span>// Status: Ungoverned</span>
            <span>// Layer: 02</span>
          </div>
        </div>

      </div>

      {/* Atmospheric Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02] halftone-noise" />
    </section>
  );
};
