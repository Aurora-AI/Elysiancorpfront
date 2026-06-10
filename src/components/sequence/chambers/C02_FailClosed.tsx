import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useChamberWindow } from '../useChamberWindow';
import { useCameraProgress } from '../useCameraProgress';

const HUD_PILLARS = ['fail-closed', 'human approval', 'auditability', 'evaluation gates', 'bounded autonomy'];

function FailGate({ isFocused }: { isFocused: boolean }) {
  const attemptRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const attempt = attemptRef.current;
    const lock = lockRef.current;
    if (!attempt || !lock) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3.5, paused: true });
    tl.to(attempt, { x: 55, duration: 0.9, ease: 'power2.inOut' })
      .to(lock, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2)' }, '-=0.1')
      .to(attempt, { x: 0, opacity: 0.4, duration: 0.6, ease: 'power3.in' }, '+=0.6')
      .set([attempt, lock], { opacity: 1, scale: 1 })
      .to(lock, { opacity: 0, scale: 0.8, duration: 0.1 });

    tlRef.current = tl;
    return () => { tl.kill(); };
  }, []);

  useEffect(() => {
    if (!tlRef.current) return;
    if (isFocused) { tlRef.current.play(); } else { tlRef.current.pause(); }
  }, [isFocused]);

  return (
    <div className="relative flex items-center gap-3 mt-[34px]">
      <div ref={attemptRef} className="flex items-center gap-2">
        <div className="w-[7px] h-[7px] rounded-full" style={{ background: '#D97706', boxShadow: '0 0 6px #D97706' }} />
        <span className="t-mono text-[11px]" style={{ color: 'var(--silver-technical)' }}>DECISION_CANDIDATE</span>
      </div>
      <div style={{ width: '1px', height: '28px', background: 'rgba(156,163,175,0.2)' }} />
      <span
        ref={lockRef}
        className="t-mono text-[11px] px-3 py-1"
        style={{
          color: '#984731',
          border: '1px solid rgba(152,71,49,0.4)',
          borderRadius: '2px',
          opacity: 0,
          transform: 'scale(0.8)',
          display: 'inline-block',
        }}
      >
        FAIL_CLOSED
      </span>
    </div>
  );
}

export function C02_FailClosed() {
  const { scale, blur, opacity, isFocused } = useChamberWindow(1);

  return (
    <div
      className="absolute inset-0 flex items-center"
      style={{
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
        willChange: 'transform, filter, opacity',
        backgroundColor: '#000000',
      }}
    >
      <div className="absolute left-[8%] top-1/2 -translate-y-1/2 max-w-[600px] space-y-[21px]">
        <span className="t-label text-[13px] block" style={{ color: 'rgba(156,163,175,0.5)', letterSpacing: '0.4em' }}>
          [ 02 // THE METHOD ]
        </span>

        <h2 className="t-display leading-[1.05]" style={{ fontSize: 'clamp(2rem,4.5vw,3.4rem)', color: '#E5E7EB' }}>
          A inteligência não é deixar a IA decidir mais.{' '}
          <span className="t-accent" style={{ color: 'var(--moss-bright)' }}>
            É definir exatamente o que ela não pode decidir.
          </span>
        </h2>

        <p className="t-mono text-[13px] leading-relaxed" style={{ color: 'rgba(156,163,175,0.6)', maxWidth: '560px', textTransform: 'none', letterSpacing: 'normal' }}>
          We study controlled agency: systems that can reason, plan and simulate,
          but cannot mutate production without deterministic gates.
        </p>

        <div className="flex flex-wrap gap-[13px] pt-[8px]">
          {HUD_PILLARS.map((p) => (
            <span
              key={p}
              className="t-label text-[9px] px-3 py-1"
              style={{
                color: 'var(--moss-bright)',
                border: '1px solid rgba(78,91,75,0.4)',
                borderRadius: '2px',
              }}
            >
              {p}
            </span>
          ))}
        </div>

        <FailGate isFocused={isFocused} />
      </div>
    </div>
  );
}
