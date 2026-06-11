# Elysian Cinematic Sequence — Polish & Refinements Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all remaining visual and behavioral issues in the cinematic scroll sequence — chamber crossover overlap, WorldTone flickering, snap skipping chambers, reduced-motion layout collapse, C03 static stage, and add the R3F FactoryCorridor.

**Architecture:** Targeted surgical fixes within existing files. No new architectural patterns. Opacity math sharpened in `useChamberWindow`, WorldTone gets a debounce, snap config tuned in `SequenceRig`, C03 derives active stage from scroll progress, all 5 chambers get a reduced-motion layout path, and C03 gets a lazy-loaded R3F corridor component.

**Tech Stack:** GSAP 3.12 + ScrollTrigger, React 19, @studio-freight/lenis, @react-three/fiber + @react-three/drei (T6 only), TypeScript 5, Tailwind 4, Astro 6

---

## File Map

| File | What changes |
|---|---|
| `src/components/sequence/useChamberWindow.ts` | T1 — quadratic opacity, separate raw for scale/blur |
| `src/components/sequence/WorldTone.tsx` | T2 — debounce 200ms before committing world change |
| `src/components/sequence/SequenceRig.tsx` | T3 — snap delay, duration, ease tuning |
| `src/components/sequence/chambers/C03_GovernedFactory.tsx` | T4 + T6 — dynamic stage + R3F import |
| `src/components/sequence/CameraStage.tsx` | T5 — reduced-motion flex column layout |
| `src/components/sequence/chambers/C01_Dispersion.tsx` | T5 — reduced-motion height |
| `src/components/sequence/chambers/C02_FailClosed.tsx` | T5 — reduced-motion height |
| `src/components/sequence/chambers/C04_TruthReturned.tsx` | T5 — reduced-motion height |
| `src/components/sequence/chambers/C05_Category.tsx` | T5 — reduced-motion height |
| `src/components/sequence/r3f/FactoryCorridor.tsx` | T6 — NEW R3F component |

---

## Task 1: Sharpen chamber opacity falloff

**Problem:** At the crossover between two adjacent chambers (e.g., C01→C02 at `progress=0.2`), both chambers render at 44% opacity simultaneously. The linear curve makes crossovers muddy and the transition feel slow.

**Fix:** Apply a power of 1.8 to the opacity only, keeping scale and blur on the raw linear value so they remain subtle and smooth.

**Files:**
- Modify: `src/components/sequence/useChamberWindow.ts`

**Current file for reference:**
```typescript
const TOTAL = 5;
const FADE_BAND = 0.08;

export function useChamberWindow(chamberIndex: number): ChamberWindow {
  const { progress } = useCameraProgress();

  return useMemo(() => {
    const center = (chamberIndex + 0.5) / TOTAL;
    const halfWindow = 0.5 / TOTAL;
    const distFromCenter = Math.abs(progress - center);
    const normalized = Math.max(0, 1 - distFromCenter / (halfWindow + FADE_BAND));
    const isFocused = distFromCenter < halfWindow * 0.4;
    const scale   = 0.95 + normalized * 0.05;
    const blur    = (1 - normalized) * 12;
    const opacity = normalized;
    return { visibility: normalized, isFocused, scale, blur, opacity };
  }, [progress, chamberIndex]);
}
```

- [ ] **Step 1: Replace `useChamberWindow.ts` with the sharpened curve**

```typescript
import { useMemo } from 'react';
import { useCameraProgress } from './useCameraProgress';

export interface ChamberWindow {
  visibility: number;
  isFocused: boolean;
  scale: number;
  blur: number;
  opacity: number;
}

const TOTAL = 5;
const FADE_BAND = 0.08;

export function useChamberWindow(chamberIndex: number): ChamberWindow {
  const { progress } = useCameraProgress();

  return useMemo(() => {
    const center = (chamberIndex + 0.5) / TOTAL;
    const halfWindow = 0.5 / TOTAL;
    const distFromCenter = Math.abs(progress - center);

    // raw: linear 0→1 over the visibility window
    const raw = Math.max(0, 1 - distFromCenter / (halfWindow + FADE_BAND));

    // opacity uses a power curve so crossovers are crisp (44% → 22% at midpoint)
    const normalized = raw ** 1.8;

    const isFocused = distFromCenter < halfWindow * 0.4;
    const scale = 0.95 + raw * 0.05;   // subtle scale on raw (smooth)
    const blur  = (1 - raw) * 12;       // blur on raw (smooth)
    const opacity = normalized;          // opacity on powered curve (sharp)

    return { visibility: normalized, isFocused, scale, blur, opacity };
  }, [progress, chamberIndex]);
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: exit 0, no TypeScript errors, no Vite errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sequence/useChamberWindow.ts
git commit -m "fix(sequence): quadratic opacity curve — crisp crossovers, smooth scale/blur"
```

---

## Task 2: WorldTone debounce — prevent mid-scroll flicker

**Problem:** `WorldTone.tsx` fires the body background animation every time `worldTone` changes. During fast scroll, `activeChamber` (and therefore `worldTone`) can flip multiple times before the user settles on a chamber, causing the background to flicker between parchment and black.

**Fix:** Debounce the GSAP body animation by 200ms. The world only commits after scroll intent has paused.

**Files:**
- Modify: `src/components/sequence/WorldTone.tsx`

**Current file for reference:**
```typescript
export function WorldTone() {
  const { worldTone } = useCameraProgress();
  const prevTone = useRef<WorldToneType>('light');
  const anim = getAnimationDefaults();

  useEffect(() => {
    if (prevTone.current === worldTone) return;
    prevTone.current = worldTone;

    const { bg, color } = WORLD_COLORS[worldTone];
    const isReduced = anim.duration < 0.2;

    gsap.to(document.body, {
      backgroundColor: bg,
      color,
      duration: isReduced ? 0.01 : 1.8,
      ease: 'expo.inOut',
    });
  }, [worldTone, anim.duration]);
```

- [ ] **Step 1: Replace `WorldTone.tsx` with debounced version**

```typescript
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCameraProgress, type WorldTone as WorldToneType } from './useCameraProgress';
import { getAnimationDefaults } from '../../lib/animations';

const WORLD_COLORS: Record<WorldToneType, { bg: string; color: string }> = {
  light: { bg: '#F8F7F3', color: '#1A1A17' },
  dark:  { bg: '#000000', color: '#F2F2F2' },
};

const DEBOUNCE_MS = 200;

export function WorldTone() {
  const { worldTone } = useCameraProgress();
  const prevTone = useRef<WorldToneType | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const anim = getAnimationDefaults();
  const isReduced = anim.duration < 0.2;

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      if (prevTone.current === worldTone) return;
      prevTone.current = worldTone;

      const { bg, color } = WORLD_COLORS[worldTone];
      gsap.to(document.body, {
        backgroundColor: bg,
        color,
        duration: isReduced ? 0.01 : 1.8,
        ease: 'expo.inOut',
      });
    }, isReduced ? 0 : DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [worldTone, isReduced]);

  return null;
}
```

Key changes:
- `prevTone` starts as `null` (no longer 'light') so the first fire always commits, even if it's 'light'.
- The 200ms debounce window means rapid scroll through multiple chambers only fires the final world state.
- `isReduced` path uses 0ms debounce (fires immediately).

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/sequence/WorldTone.tsx
git commit -m "fix(worldtone): debounce 200ms — no flicker on fast scroll between worlds"
```

---

## Task 3: Snap behavior — prevent chamber skipping

**Problem:** The snap animation with `delay: 0.1` is too short. On quick flicks, GSAP projects the velocity forward and can snap past the nearest chamber (e.g., from C02 directly to C04, skipping C03). `ease: 'expo.inOut'` is too aggressive — the snap decelerates almost instantaneously at the end, making it feel like it "clicked" rather than "settled."

**Fix:** Increase delay to 0.25s, extend duration, change ease to `power2.inOut`.

**Files:**
- Modify: `src/components/sequence/SequenceRig.tsx` (lines 57–62)

**Current snap config:**
```typescript
snap: {
  snapTo: [0.1, 0.3, 0.5, 0.7, 0.9],
  duration: { min: 0.3, max: 0.6 },
  ease: 'expo.inOut',
  delay: 0.1,
},
```

- [ ] **Step 1: Update the snap config in `SequenceRig.tsx`**

Find and replace the snap block:

```typescript
snap: {
  snapTo: [0.1, 0.3, 0.5, 0.7, 0.9],
  duration: { min: 0.5, max: 0.9 },
  ease: 'power2.inOut',
  delay: 0.25,
},
```

`power2.inOut` decelerates smoothly, making the chamber "land" with weight. `delay: 0.25` gives the user enough time to express multi-chamber intent (two quick flicks) before the snap locks in.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/sequence/SequenceRig.tsx
git commit -m "fix(sequence): snap delay 0.25s, power2.inOut — prevents chamber skipping"
```

---

## Task 4: C03 dynamic stage highlight

**Problem:** `C03_GovernedFactory.tsx` has `i === 2` hardcoded, meaning VALIDAÇÃO is permanently highlighted in gold. The stage should animate from CAPTURA → APRENDIZADO as the user scrolls through C03's 20% of the scroll space.

**Fix:** Derive `activeStage` from the global `progress` mapped into C03's band (`0.4` to `0.6`).

**Files:**
- Modify: `src/components/sequence/chambers/C03_GovernedFactory.tsx`

**Current file for reference** (key section):
```typescript
const STAGES = ['CAPTURA', 'ESTRUTURAÇÃO', 'VALIDAÇÃO', 'PERSISTÊNCIA', 'EXECUÇÃO', 'APRENDIZADO'];

export function C03_GovernedFactory() {
  const { scale, blur, opacity } = useChamberWindow(2);
  // ...
  {STAGES.map((stage, i) => (
    <div
      style={{
        border: `1px solid ${i === 2 ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.2)'}`,
        color: i === 2 ? '#D4AF37' : 'rgba(156,163,175,0.5)',
        backgroundColor: i === 2 ? 'rgba(212,175,55,0.04)' : 'transparent',
      }}
    >
```

- [ ] **Step 1: Update `C03_GovernedFactory.tsx` to compute `activeStage`**

Replace the entire file:

```typescript
import { useChamberWindow } from '../useChamberWindow';
import { useCameraProgress } from '../useCameraProgress';

const STAGES = ['CAPTURA', 'ESTRUTURAÇÃO', 'VALIDAÇÃO', 'PERSISTÊNCIA', 'EXECUÇÃO', 'APRENDIZADO'];

const CHAMBER_INDEX = 2;
const TOTAL = 5;
const BAND_START = CHAMBER_INDEX / TOTAL;       // 0.4
const BAND_END = (CHAMBER_INDEX + 1) / TOTAL;   // 0.6

export function C03_GovernedFactory() {
  const { scale, blur, opacity } = useChamberWindow(CHAMBER_INDEX);
  const { progress } = useCameraProgress();

  // chamberProgress: 0 at C03 entry (progress=0.4), 1 at C03 exit (progress=0.6)
  const chamberProgress = Math.max(0, Math.min(1, (progress - BAND_START) / (BAND_END - BAND_START)));
  const activeStage = Math.min(
    Math.floor(chamberProgress * STAGES.length),
    STAGES.length - 1
  );

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
      {/* Left: Álvaro narrative */}
      <div className="absolute left-[8%] top-1/2 -translate-y-1/2 z-10 max-w-[380px] space-y-[21px]">
        <span className="t-label text-[13px] block" style={{ color: 'rgba(156,163,175,0.5)', letterSpacing: '0.4em' }}>
          [ 03 // THE GOVERNED FACTORY ]
        </span>
        <h2 className="t-display leading-[1.05]" style={{ fontSize: 'clamp(2rem,4.5vw,3.4rem)', color: '#E5E7EB' }}>
          Álvaro observa, planeja,<br />
          simula e{' '}
          <span className="t-accent" style={{ color: 'var(--moss-bright)' }}>propõe.</span>
        </h2>
        <p className="t-editorial text-[16px] leading-relaxed" style={{ color: 'rgba(156,163,175,0.6)' }}>
          A produção só muda com gates determinísticos, QA formal e aprovação humana.
        </p>
      </div>

      {/* Right: factory corridor */}
      <div className="absolute right-[8%] top-1/2 -translate-y-1/2 flex flex-col items-center gap-[13px]">
        {STAGES.map((stage, i) => {
          const isActive = i === activeStage;
          return (
            <div key={stage} className="relative flex flex-col items-center">
              <div
                className="t-mono text-[11px] flex items-center justify-center"
                style={{
                  width: '220px',
                  height: '44px',
                  border: `1px solid ${isActive ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.2)'}`,
                  color: isActive ? '#D4AF37' : 'rgba(156,163,175,0.5)',
                  backgroundColor: isActive ? 'rgba(212,175,55,0.04)' : 'transparent',
                  transition: 'all 0.5s ease',
                }}
              >
                {stage}
              </div>
              {i < STAGES.length - 1 && (
                <div style={{ width: '1px', height: '13px', background: 'rgba(212,175,55,0.2)' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 3: Visual check**

Open http://localhost:4321, scroll into C03. Scroll slowly through it — the gold highlight should move from CAPTURA to APRENDIZADO as you scroll from the start to end of C03's section.

- [ ] **Step 4: Commit**

```bash
git add src/components/sequence/chambers/C03_GovernedFactory.tsx
git commit -m "feat(C03): dynamic stage highlight driven by chamberProgress"
```

---

## Task 5: Reduced-motion layout fix

**Problem:** All 5 chambers use `className="absolute inset-0"`. When `prefers-reduced-motion: reduce` is active, `CameraStage` renders `position: relative` (not fixed), so the children's `absolute inset-0` collapses them to height 0 — the page is blank.

**Fix:**
1. `CameraStage` reduced-motion path: `display: flex; flex-direction: column` so chambers stack vertically.
2. Each chamber: detect `isReduced` and switch to `position: relative; height: 100vh` instead of `absolute inset-0`.

**Files:**
- Modify: `src/components/sequence/CameraStage.tsx`
- Modify: `src/components/sequence/chambers/C01_Dispersion.tsx`
- Modify: `src/components/sequence/chambers/C02_FailClosed.tsx`
- Modify: `src/components/sequence/chambers/C03_GovernedFactory.tsx`
- Modify: `src/components/sequence/chambers/C04_TruthReturned.tsx`
- Modify: `src/components/sequence/chambers/C05_Category.tsx`

### Step 1 — Fix CameraStage reduced-motion path

- [ ] **Edit `src/components/sequence/CameraStage.tsx`**

Change the reduced-motion return (lines 12–17) from:
```typescript
  if (isReduced) {
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        {children}
      </div>
    );
  }
```

To:
```typescript
  if (isReduced) {
    return (
      <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    );
  }
```

### Step 2 — Add reduced-motion style to each chamber

The pattern is identical across all 5 chambers. Each gets a `getAnimationDefaults()` call and a conditional style object. Apply it to each file:

- [ ] **Edit `src/components/sequence/chambers/C01_Dispersion.tsx`**

Add import at top:
```typescript
import { getAnimationDefaults } from '../../../lib/animations';
```

Inside `C01_Dispersion()`, add after the `useChamberWindow` call:
```typescript
const isReduced = getAnimationDefaults().duration < 0.2;
```

Replace the outer `<div` style from:
```typescript
      className="absolute inset-0 flex items-center"
      style={{
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
        willChange: 'transform, filter, opacity',
        backgroundColor: '#F8F7F3',
      }}
```

To:
```typescript
      className="flex items-center"
      style={isReduced ? {
        position: 'relative',
        height: '100vh',
        width: '100%',
        flexShrink: 0,
        backgroundColor: '#F8F7F3',
      } : {
        position: 'absolute',
        inset: 0,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
        willChange: 'transform, filter, opacity',
        backgroundColor: '#F8F7F3',
      }}
```

- [ ] **Edit `src/components/sequence/chambers/C02_FailClosed.tsx`**

Add import at top (already has `useCameraProgress` import — add the lib one):
```typescript
import { getAnimationDefaults } from '../../../lib/animations';
```

Inside `C02_FailClosed()`, add:
```typescript
const isReduced = getAnimationDefaults().duration < 0.2;
```

Replace outer `<div` style:
```typescript
      className="flex items-center"
      style={isReduced ? {
        position: 'relative',
        height: '100vh',
        width: '100%',
        flexShrink: 0,
        backgroundColor: '#000000',
      } : {
        position: 'absolute',
        inset: 0,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
        willChange: 'transform, filter, opacity',
        backgroundColor: '#000000',
      }}
```

- [ ] **Edit `src/components/sequence/chambers/C03_GovernedFactory.tsx`**

(Already modified in T4.) Add import:
```typescript
import { getAnimationDefaults } from '../../../lib/animations';
```

Inside `C03_GovernedFactory()`, add after `useCameraProgress()`:
```typescript
const isReduced = getAnimationDefaults().duration < 0.2;
```

Replace outer `<div` style:
```typescript
      className="flex items-center"
      style={isReduced ? {
        position: 'relative',
        height: '100vh',
        width: '100%',
        flexShrink: 0,
        backgroundColor: '#000000',
      } : {
        position: 'absolute',
        inset: 0,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
        willChange: 'transform, filter, opacity',
        backgroundColor: '#000000',
      }}
```

- [ ] **Edit `src/components/sequence/chambers/C04_TruthReturned.tsx`**

Add import:
```typescript
import { getAnimationDefaults } from '../../../lib/animations';
```

Inside `C04_TruthReturned()`, add:
```typescript
const isReduced = getAnimationDefaults().duration < 0.2;
```

Replace outer `<div` style:
```typescript
      className="flex items-center"
      style={isReduced ? {
        position: 'relative',
        height: '100vh',
        width: '100%',
        flexShrink: 0,
        backgroundColor: '#F8F7F3',
      } : {
        position: 'absolute',
        inset: 0,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
        willChange: 'transform, filter, opacity',
        backgroundColor: '#F8F7F3',
      }}
```

- [ ] **Edit `src/components/sequence/chambers/C05_Category.tsx`**

Add import:
```typescript
import { getAnimationDefaults } from '../../../lib/animations';
```

Inside `C05_Category()`, add:
```typescript
const isReduced = getAnimationDefaults().duration < 0.2;
```

Replace outer `<div` style (note: C05 uses `justify-center` too):
```typescript
      className="flex items-center justify-center"
      style={isReduced ? {
        position: 'relative',
        height: '100vh',
        width: '100%',
        flexShrink: 0,
        backgroundColor: '#000000',
      } : {
        position: 'absolute',
        inset: 0,
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
        willChange: 'transform, filter, opacity',
        backgroundColor: '#000000',
      }}
```

### Step 3 — Verify build

- [ ] **Run build**

Run: `npm run build`
Expected: exit 0, zero TypeScript errors.

### Step 4 — Commit

- [ ] **Commit**

```bash
git add \
  src/components/sequence/CameraStage.tsx \
  src/components/sequence/chambers/C01_Dispersion.tsx \
  src/components/sequence/chambers/C02_FailClosed.tsx \
  src/components/sequence/chambers/C03_GovernedFactory.tsx \
  src/components/sequence/chambers/C04_TruthReturned.tsx \
  src/components/sequence/chambers/C05_Category.tsx
git commit -m "fix(sequence): reduced-motion layout — chambers stack 100vh vertically"
```

---

## Task 6: R3F FactoryCorridor — 3D corridor for C03

**Problem:** C03 uses a flat 2D list. The original spec called for a real R3F first-person corridor where 6 stage nodes are visible in 3D space and the camera travels through them as `chamberProgress` goes 0→1.

**Files:**
- Create: `src/components/sequence/r3f/FactoryCorridor.tsx`
- Modify: `src/components/sequence/chambers/C03_GovernedFactory.tsx`

### Step 1 — Install R3F dependencies

- [ ] **Install packages**

Run: `npm install @react-three/fiber @react-three/drei three`

Then:

Run: `npm install --save-dev @types/three`

Expected: packages appear in `package.json`, no peer dep errors.

### Step 2 — Create `FactoryCorridor.tsx`

- [ ] **Create `src/components/sequence/r3f/FactoryCorridor.tsx`**

```typescript
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const STAGES = ['CAPTURA', 'ESTRUTURAÇÃO', 'VALIDAÇÃO', 'PERSISTÊNCIA', 'EXECUÇÃO', 'APRENDIZADO'];
const GOLD = '#D4AF37';
const GOLD_DIM = 'rgba(212,175,55,0.3)';
const CORRIDOR_DEPTH = 30; // total Z span of the corridor

interface StageNodeProps {
  label: string;
  index: number;
  total: number;
  activeIndex: number;
}

function StageNode({ label, index, total, activeIndex }: StageNodeProps) {
  const z = -((index / (total - 1)) * CORRIDOR_DEPTH);
  const isActive = index === activeIndex;

  return (
    <group position={[0, 0, z]}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[4, 0.8, 0.04]} />
        <meshBasicMaterial
          color={isActive ? GOLD : '#1A1A17'}
          transparent
          opacity={isActive ? 0.12 : 0.06}
        />
      </mesh>
      {/* Border lines — top */}
      <mesh position={[0, 0.4, 0.02]}>
        <boxGeometry args={[4, 0.01, 0.01]} />
        <meshBasicMaterial color={isActive ? GOLD : '#333'} transparent opacity={isActive ? 0.8 : 0.3} />
      </mesh>
      {/* Border lines — bottom */}
      <mesh position={[0, -0.4, 0.02]}>
        <boxGeometry args={[4, 0.01, 0.01]} />
        <meshBasicMaterial color={isActive ? GOLD : '#333'} transparent opacity={isActive ? 0.8 : 0.3} />
      </mesh>
      {/* Label */}
      <Text
        position={[0, 0, 0.05]}
        fontSize={0.18}
        color={isActive ? GOLD : '#4A4A4A'}
        font="/fonts/JetBrainsMono-Regular.ttf"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        {label}
      </Text>
    </group>
  );
}

interface CameraRigProps {
  chamberProgress: number;
}

function CameraRig({ chamberProgress }: CameraRigProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    // Camera travels from z=5 (before first node) to z=-(CORRIDOR_DEPTH+2)
    const targetZ = 5 - chamberProgress * (CORRIDOR_DEPTH + 7);
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      0.08
    );
  });

  return <group ref={groupRef} />;
}

interface FactoryCorridorProps {
  chamberProgress: number;
  activeStage: number;
}

export function FactoryCorridor({ chamberProgress, activeStage }: FactoryCorridorProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 55 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <CameraRig chamberProgress={chamberProgress} />
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 5]} intensity={0.8} color={GOLD} />

      {STAGES.map((stage, i) => (
        <StageNode
          key={stage}
          label={stage}
          index={i}
          total={STAGES.length}
          activeIndex={activeStage}
        />
      ))}

      {/* Corridor floor grid lines */}
      <gridHelper
        args={[40, 20, '#1A1A17', '#111']}
        position={[0, -1.2, -CORRIDOR_DEPTH / 2]}
        rotation={[0, 0, 0]}
      />
    </Canvas>
  );
}
```

> **Note on font path:** `Text` from `@react-three/drei` needs a font file. If `/fonts/JetBrainsMono-Regular.ttf` doesn't exist in `public/fonts/`, either download it or replace with a fallback. You can use a Google Fonts URL directly: `font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxd.woff"`. Alternatively, drop `font` prop entirely and `Text` will use its built-in Roboto.

### Step 3 — Integrate FactoryCorridor into C03

- [ ] **Update `src/components/sequence/chambers/C03_GovernedFactory.tsx`**

Add lazy import at the top of the file (after existing imports):
```typescript
import { lazy, Suspense } from 'react';

const FactoryCorridor = lazy(() =>
  import('../r3f/FactoryCorridor').then((m) => ({ default: m.FactoryCorridor }))
);
```

In the JSX, replace the flat 2D corridor div (the `right-[8%]` block) with:

```tsx
      {/* Right: R3F factory corridor */}
      <div
        className="absolute right-0 top-0"
        style={{ width: '50%', height: '100%', pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <FactoryCorridor chamberProgress={chamberProgress} activeStage={activeStage} />
        </Suspense>
      </div>
```

The left narrative block (`Álvaro observa...`) stays unchanged.

### Step 4 — Verify build

- [ ] **Run build**

Run: `npm run build`
Expected: exit 0. If `Text` font fetch fails at build time, add `font` prop override or drop it.

### Step 5 — Visual check

Open http://localhost:4321. Scroll to C03 (approximately 40%–60% of the sequence). Verify:
- 3D corridor visible on right half of chamber
- Camera slowly tracks forward through the nodes as you scroll
- Active stage glows gold
- Lazy-load doesn't cause layout shift (Suspense fallback is null)

### Step 6 — Commit

- [ ] **Commit**

```bash
git add \
  src/components/sequence/r3f/FactoryCorridor.tsx \
  src/components/sequence/chambers/C03_GovernedFactory.tsx \
  package.json package-lock.json
git commit -m "feat(C03): R3F FactoryCorridor — 3D corridor with chamberProgress camera"
```

---

## Self-Review

**Spec coverage:**
- T1 ✅ Crossover overlap fix
- T2 ✅ WorldTone flicker fix
- T3 ✅ Snap skipping fix
- T4 ✅ C03 dynamic stages
- T5 ✅ Reduced-motion layout
- T6 ✅ R3F FactoryCorridor (deferred in M1)
- Header mix-blend-difference — verified as working-as-intended by visual inspection during testing; not a code change.

**Placeholder scan:** No TBDs, no "handle edge cases" phrases, no missing code blocks.

**Type consistency:**
- `chamberProgress: number` used consistently between T4 and T6
- `activeStage: number` computed in C03 and passed to FactoryCorridor
- `ChamberWindow` interface in `useChamberWindow.ts` unchanged — `visibility`, `isFocused`, `scale`, `blur`, `opacity` all preserved

**Execution order:** T1→T2→T3→T4→T5→T6. T6 depends on T4 (shares C03 file). All others are independent.
