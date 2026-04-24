import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAnimationDefaults } from '../../lib/animations';


gsap.registerPlugin(ScrollTrigger);

// Social proof data — update with real clients when available
const METRICS = [
  { value: '99.8%', label: 'Integridade Verificada' },
  { value: '< 40ms', label: 'Latência de Auditoria' },
  { value: '27 anos', label: 'Inteligência Operacional' },
] as const;

const TESTIMONIAL = {
  quote:
    'A Elysian não entrega relatórios — entrega certeza. É a única infraestrutura que elimina o custo cognitivo de verificar cada dado antes de agir.',
  author: 'Rodrigo Cesar Winhaski',
  role: 'Fundador, Mad Lab Aurora',
  tag: 'AURV8.LEX.001',
} as const;

export const TrustwareClients: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const anim = getAnimationDefaults();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label + divider entrance
      gsap.from('.clients-label', {
        opacity: 0,
        y: anim.duration > 0.1 ? 12 : 0,
        duration: anim.duration * 0.6,
        ease: anim.ease,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });

      // Metrics — staggered clip-path reveal
      gsap.from('.metric-item', {
        clipPath: anim.duration > 0.1 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 0)',
        opacity: 0,
        duration: anim.duration,
        stagger: anim.stagger,
        ease: anim.ease,
        scrollTrigger: {
          trigger: '.metrics-row',
          start: 'top 75%',
        },
      });

      // Testimonial block — sovereign fade
      gsap.from('.testimonial-block', {
        opacity: 0,
        y: anim.duration > 0.1 ? 24 : 0,
        duration: anim.duration * 1.2,
        delay: anim.duration > 0.1 ? 0.3 : 0,
        ease: anim.ease,
        scrollTrigger: {
          trigger: '.testimonial-block',
          start: 'top 80%',
        },
      });

      const metrics = document.querySelectorAll('.metric-value');
      metrics.forEach(metric => {
        const target = parseFloat(metric.getAttribute('data-target') || "0");
        const isInt = !metric.getAttribute('data-target')?.includes('.');

        gsap.fromTo(metric,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: metric,
              start: "top 90%",
            },
            snap: { innerText: isInt ? 1 : 0.1 },
            onUpdate: function () {
              const val = parseFloat(this.targets()[0].innerText);
              metric.innerHTML = (isInt ? Math.floor(val) : val.toFixed(1)) + (metric.getAttribute('data-suffix') || "");
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-shell relative overflow-hidden halftone-noise"
      aria-label="Prova Social"
    >
      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-20">

        {/* Label */}
        <div className="clients-label flex items-center gap-5">
          <span className="t-mono text-[10px] text-aureate mb-0">
            Validação Operacional
          </span>
          <div className="h-[1px] w-12 bg-aureate/30" />
        </div>

        {/* Metrics Row */}
        <div className="metrics-row grid grid-cols-1 sm:grid-cols-3 gap-0">
          <div className="metric-item border-l border-ink/10 pl-8 py-6 first:border-l-0 first:pl-0">
            <div className="metric-value t-headline text-ink text-5xl md:text-6xl leading-none mb-4" data-target="99.8" data-suffix="%">
              99.8%
            </div>
            <div className="t-mono text-[10px] text-ink/40">
              Integridade Verificada
            </div>
          </div>

          <div className="metric-item border-l border-ink/10 pl-8 py-6 first:border-l-0 first:pl-0">
            <div className="metric-value t-headline text-ink text-5xl md:text-6xl leading-none mb-4" data-target="40" data-suffix="ms">
              &lt; 40ms
            </div>
            <div className="t-mono text-[10px] text-ink/40">
              Latência de Auditoria
            </div>
          </div>

          <div className="metric-item border-l border-ink/10 pl-8 py-6 first:border-l-0 first:pl-0">
            <div className="metric-value t-headline text-ink text-5xl md:text-6xl leading-none mb-4" data-target="27" data-suffix=" anos">
              27 anos
            </div>
            <div className="t-mono text-[10px] text-ink/40">
              Inteligência Operacional
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="testimonial-block border border-ink/10 p-12 md:p-16 max-w-4xl relative bg-white/40 backdrop-blur-sm">
          {/* Forensic tag */}
          <span className="absolute top-6 right-6 forensic-tag">
            {TESTIMONIAL.tag}
          </span>

          <blockquote className="t-editorial text-2xl md:text-3xl text-ink leading-relaxed mb-12 italic">
            &ldquo;{TESTIMONIAL.quote}&rdquo;
          </blockquote>

          <div className="flex items-center gap-6">
            <div className="relative">
                <img
                src="/assets/rodrigo-portrait.png"
                alt={TESTIMONIAL.author}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full border border-ink/10 object-cover object-top grayscale hover:grayscale-0 transition-all duration-700 shadow-sm"
                />
                <div className="absolute inset-0 rounded-full border border-aureate/20 pointer-events-none"></div>
            </div>
            <div>
              <div className="t-headline text-xl text-ink flex items-center gap-3">
                {TESTIMONIAL.author}
                <span className="t-mono text-[8px] opacity-30">v2.2.1-SECURE</span>
              </div>
              <div className="t-mono text-[10px] text-aureate mt-1">
                {TESTIMONIAL.role}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Decorative ∑ */}
      <div className="absolute -bottom-10 -right-10 p-8 opacity-[0.03] pointer-events-none">
        <div className="t-display text-[180px] leading-none text-ink select-none">
          ∑
        </div>
      </div>
    </section>
  );
};
