import { useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import {
  CameraProgressContext,
  progressToChamber,
  chamberToWorldTone,
  type CameraProgress,
} from './useCameraProgress';
import { CameraStage } from './CameraStage';
import { WorldTone } from './WorldTone';
import { HudTelemetry } from './HudTelemetry';
import { getAnimationDefaults } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

const CHAMBER_COUNT = 5;
const WORLD_TONE_STOPS = [
  { progress: 0, background: '#F8F7F3', color: '#1A1A17' },
  { progress: 0.2, background: '#000000', color: '#F2F2F2' },
  { progress: 0.6, background: '#F8F7F3', color: '#1A1A17' },
  { progress: 0.8, background: '#000000', color: '#F2F2F2' },
] as const;

function interpolateWorldTone(progress: number) {
  const nextIndex = WORLD_TONE_STOPS.findIndex((stop) => stop.progress >= progress);
  if (nextIndex <= 0) return WORLD_TONE_STOPS[0];
  if (nextIndex === -1) return WORLD_TONE_STOPS[WORLD_TONE_STOPS.length - 1];

  const previous = WORLD_TONE_STOPS[nextIndex - 1];
  const next = WORLD_TONE_STOPS[nextIndex];
  const localProgress = (progress - previous.progress) / (next.progress - previous.progress);

  return {
    background: gsap.utils.interpolate(previous.background, next.background, localProgress),
    color: gsap.utils.interpolate(previous.color, next.color, localProgress),
  };
}

interface SequenceRigProps {
  children: ReactNode;
}

export function SequenceRig({ children }: SequenceRigProps) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const [camState, setCamState] = useState<CameraProgress>({
    progress: 0,
    activeChamber: 0,
    worldTone: 'light',
  });

  // client:only="react" no Astro garante que este componente NUNCA roda
  // no servidor — window sempre existe, sem hydration mismatch.
  const anim = getAnimationDefaults();
  const isReduced = anim.duration < 0.2;

  useEffect(() => {
    if (isReduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    // ── CONTRATO CRÍTICO: scrollerProxy conecta Lenis ao ScrollTrigger ──
    // Sem isso, ScrollTrigger lê window.scrollY enquanto Lenis intercepta
    // os eventos, causando travamento total do scroll.
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
    });

    lenis.on('scroll', ScrollTrigger.update);
    const rafCallback = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: spacerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const progress = self.progress;
          const activeChamber = progressToChamber(progress, CHAMBER_COUNT);
          const worldTone = chamberToWorldTone(activeChamber);

          // Drive the world colors from absolute scroll progress so the body and
          // chamber crossfades share the same frame and cannot expose a stale canvas.
          const tone = interpolateWorldTone(progress);
          gsap.set(document.body, {
            backgroundColor: tone.background,
            color: tone.color,
          });

          setCamState({ progress, activeChamber, worldTone });
        },
        snap: {
          snapTo: [0.1, 0.3, 0.5, 0.7, 0.9],
          duration: { min: 0.5, max: 0.9 },
          ease: 'power2.inOut',
          delay: 0.25,
        },
      });
    });

    // Duplo setTimeout garante layout estabilizado após montagem
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 100);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ctx.revert();
      ScrollTrigger.scrollerProxy(document.documentElement, undefined as any);
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
    };
  }, [isReduced]);

  if (isReduced) {
    return (
      <CameraProgressContext.Provider value={camState}>
        <div>{children}</div>
      </CameraProgressContext.Provider>
    );
  }

  return (
    <CameraProgressContext.Provider value={camState}>
      <CameraStage active={camState.progress > 0}>
        <WorldTone />
        <HudTelemetry />
        {children}
      </CameraStage>
      <div
        ref={spacerRef}
        style={{ height: `${CHAMBER_COUNT * 100}vh` }}
        aria-hidden="true"
      />
    </CameraProgressContext.Provider>
  );
}
