import React from 'react';
import type { Claim } from '@/data/evidence.types';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';

interface Props {
  claim: Claim;
  lang: 'en' | 'pt';
  onOpen: (id: string) => void;
}

// Static so Tailwind sees each literal class.
const SPAN: Record<number, string> = {
  4: 'md:col-span-4', 5: 'md:col-span-5', 6: 'md:col-span-6',
  7: 'md:col-span-7', 8: 'md:col-span-8', 12: 'md:col-span-12',
};

export function ClaimCard({ claim, lang, onOpen }: Props) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const badgeOk = claim.status === 'OK';
  const badgeStyle = badgeOk
    ? 'border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)] bg-white/5'
    : 'border-white/20 text-white/50 bg-black/50';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={claim.title[lang]}
      onMouseMove={handleMouseMove}
      onClick={() => onOpen(claim.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(claim.id);
        }
      }}
      className={`group relative ${SPAN[claim.colSpan] ?? 'md:col-span-6'} cursor-pointer overflow-hidden bg-[#020202]/60 backdrop-blur-xl border-t-4 border-t-white/10 border-x-0 border-b-0 p-fib-34 md:p-fib-55 flex flex-col justify-between transition-all duration-500 hover:border-t-white/40 hover:bg-[#020202]/80 min-h-[280px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40`}
    >
      {/* Magnetic Spotlight Edge (Amber Light connection) */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.06),
              transparent 70%
            )
          `,
        }}
      />

      {/* Giant Structural Watermark (The Ledger Weight) */}
      <div className="absolute -bottom-4 -right-4 text-[100px] md:text-[140px] font-display font-black leading-none text-white/[0.02] group-hover:text-white/[0.04] transition-colors duration-700 select-none pointer-events-none z-0 tracking-tighter">
        {claim.index}
      </div>
      
      {/* Subtle top reflection simulating heavy metal block edge */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        
        {/* Top Telemetry / Badges */}
        <div className="flex justify-between items-start w-full">
          {/* Small technical index to keep the structural anchor */}
          <span className="font-technical-sm text-technical-sm text-white/40 font-bold tracking-widest group-hover:text-white/80 transition-colors duration-300">
            [{claim.index}]
          </span>

          <div className="flex items-center gap-fib-8">
            <span className={`font-technical-sm text-[10px] uppercase tracking-widest px-3 py-1.5 border backdrop-blur-md transition-all duration-300 ${badgeStyle}`}>
              {badgeOk ? 'SECURE' : claim.status}
            </span>
            <span className="font-technical-sm text-[10px] uppercase tracking-widest px-3 py-1.5 border border-white/10 text-white/40 bg-black/40 backdrop-blur-md group-hover:bg-white/10 group-hover:text-white/90 group-hover:border-white/30 transition-all duration-300">
              {claim.source.label}
            </span>
          </div>
        </div>
        
        {/* Authoritative Claim Title */}
        <div className="mt-12 font-body font-semibold text-[20px] md:text-[24px] text-white/70 group-hover:text-white transition-colors duration-300 leading-snug tracking-tight max-w-[90%]">
          {claim.title[lang]}
        </div>
        
      </div>
    </div>
  );
}
