import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScramblePortrait } from '../fx/ScramblePortrait';

gsap.registerPlugin(ScrollTrigger);

export const SectionMechanism: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll('.mechanism-card');
      if (cards) {
        gsap.fromTo(cards, 
          { scale: 0.95, opacity: 0 },
          { 
            scale: 1, 
            opacity: 1, 
            duration: 1, 
            stagger: 0.15, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 70%",
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      id: "01",
      title: "Criptografia de Custódia",
      desc: "Cada evidência é selada em um vault quântico com timestamp determinístico.",
      img: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2032&auto=format&fit=crop"
    },
    {
      id: "02",
      title: "Análise de Frequência",
      desc: "Identificação de anomalias em padrões contratuais através de redes neurais proprietárias.",
      img: "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: "03",
      title: "Protocolo Sovereign",
      desc: "Nenhum dado deixa o perímetro local sem autorização biométrica multifatorial.",
      img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: "04",
      title: "Elysian Lex GPT-5",
      desc: "Geração de relatórios forenses automatizados com validade jurídica internacional.",
      img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section 
      ref={containerRef}
      className="relative w-full py-32 bg-stone"
      id="mechanism"
    >
      <div className="container mx-auto px-6 md:px-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] font-mono text-gold tracking-[0.4em] mb-8 block uppercase">
              03 // O MECANISMO ALQUÍMICO
            </span>
            <h2 className="text-5xl md:text-6xl font-display text-ink leading-tight">
              A Engenharia da <br /> <span className="italic">Providência Digital</span>.
            </h2>
          </div>
          <p className="text-[12px] font-mono text-ink/60 max-w-[240px] uppercase tracking-wider text-right">
            Sistemas Brutalistas para tempos de incerteza informacional.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 border border-ink/10">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="mechanism-card group relative p-12 md:p-16 border-b md:border-b-0 md:border-r border-ink/10 flex flex-col justify-between min-h-[500px] overflow-hidden bg-parchment/30 hover:bg-parchment/80 transition-colors duration-700"
            >
              <div>
                <span className="text-4xl font-display text-gold/30 group-hover:text-gold transition-colors duration-500 mb-8 block">
                  {feature.id}
                </span>
                <h3 className="text-2xl font-display text-ink mb-6">{feature.title}</h3>
                <p className="text-md font-editorial text-ink/70 leading-relaxed max-w-sm">
                  {feature.desc}
                </p>
              </div>

              {/* Scramble Portrait as Forensic Art */}
              <div className="mt-12 w-full h-[240px] relative">
                <ScramblePortrait imageSrc={feature.img} />
                <div className="absolute inset-0 border border-ink/5 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background Decorator */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
        <div className="font-mono text-[80px] leading-none text-ink select-none">
          ∑
        </div>
      </div>
    </section>
  );
};
