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

interface SequenceRigProps {
  children: ReactNode;
}

export function SequenceRig({ children }: SequenceRigProps) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [camState, setCamState] = useState<CameraProgress>({
    progress: 0,
    activeChamber: 0,
    worldTone: 'light',
  });

  // Garante que a lógica de scroll e o spacer de 500vh só existem no cliente.
  // Sem isso, o React/Astro renderiza o spacer no SSG e tenta hidratar
  // um DOM que `window` não pode existir — causando mismatch silencioso.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const anim = getAnimationDefaults();
    const isReduced = anim.duration < 0.2;

    if (isReduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    // ── CONTRATO CRÍTICO: scrollerProxy conecta Lenis ao ScrollTrigger ──
    // Sem isso, ScrollTrigger lê window.scrollY enquanto Lenis intercepta
    // os eventos, causando travamento total do scroll em produção SSG.
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

    // Duplo setTimeout garante que o layout está estabilizado após hidratação
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
  }, [isMounted]);

  // Antes de montar no cliente: retorna placeholder sem scroll nem spacer
  if (!isMounted) {
    return (
      <CameraProgressContext.Provider value={camState}>
        <div style={{ minHeight: '100vh' }} suppressHydrationWarning />
      </CameraProgressContext.Provider>
    );
  }

  const anim = getAnimationDefaults();
  const isReduced = anim.duration < 0.2;

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
