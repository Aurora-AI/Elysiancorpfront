import { useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// @ts-ignore
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
  const [camState, setCamState] = useState<CameraProgress>({
    progress: 0,
    activeChamber: 0,
    worldTone: 'light',
  });

  const anim = getAnimationDefaults();
  const isReduced = anim.duration < 0.2;

  useEffect(() => {
    if (isReduced) return;

    const lenis = new Lenis();
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
          duration: { min: 0.3, max: 0.6 },
          ease: 'expo.inOut',
          delay: 0.1,
        },
      });
    });

    return () => {
      ctx.revert();
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
