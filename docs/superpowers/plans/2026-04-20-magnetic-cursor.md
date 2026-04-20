# Magnetic Cursor + Enhanced Liquid Semantic — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar cursor editorial personalizado com dual ring magnético e tornar o efeito Liquid Semantic visivelmente dramático na rota `/industrial-hero`.

**Architecture:** Singleton `mouse-state.ts` compartilha posição e velocidade do mouse entre `MagneticCursor.tsx` (canvas overlay z-50 com rings lerp-animados) e `ScrambleBackground.tsx` (física de zona dupla: atração interna + repulsão externa). Dois loops `requestAnimationFrame` independentes, zero React state compartilhado.

**Tech Stack:** React 18, TypeScript, Canvas 2D API, Astro `client:only="react"`

---

## File Map

| Ação | Arquivo |
|---|---|
| CREATE | `src/utils/mouse-state.ts` |
| CREATE | `src/components/cursor/MagneticCursor.tsx` |
| MODIFY | `src/components/hero/ScrambleBackground.tsx` |
| MODIFY | `src/pages/industrial-hero.astro` |

---

## Task 1: Criar `mouse-state.ts`

**Files:**
- Create: `src/utils/mouse-state.ts`

- [ ] **Step 1: Criar o módulo singleton**

```ts
// src/utils/mouse-state.ts
export const mouseState = {
  x: -1000,
  y: -1000,
  vx: 0,
  vy: 0,
};
```

- [ ] **Step 2: Verificar compilação TypeScript**

```bash
cd ElysianCorp && npx tsc --noEmit
```

Expected: sem erros relacionados ao novo arquivo.

- [ ] **Step 3: Commit**

```bash
git add src/utils/mouse-state.ts
git commit -m "feat: add mouse-state singleton for shared cursor position"
```

---

## Task 2: Criar `MagneticCursor.tsx` — scaffold base

**Files:**
- Create: `src/components/cursor/MagneticCursor.tsx`

- [ ] **Step 1: Criar o componente com canvas fixo**

```tsx
// src/components/cursor/MagneticCursor.tsx
import { useEffect, useRef } from 'react';
import { mouseState } from '../../utils/mouse-state';

export default function MagneticCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseState.vx = e.clientX - mouseState.x;
      mouseState.vy = e.clientY - mouseState.y;
      mouseState.x = e.clientX;
      mouseState.y = e.clientY;
    };

    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      raf = requestAnimationFrame(step);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resize);
    resize();
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
}
```

- [ ] **Step 2: Verificar compilação**

```bash
cd ElysianCorp && npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/cursor/MagneticCursor.tsx
git commit -m "feat: scaffold MagneticCursor canvas component"
```

---

## Task 3: Adicionar dot + crosshair ao `MagneticCursor`

**Files:**
- Modify: `src/components/cursor/MagneticCursor.tsx`

- [ ] **Step 1: Adicionar estado de idle e renderização do dot + crosshair**

Substituir o conteúdo completo de `MagneticCursor.tsx`:

```tsx
// src/components/cursor/MagneticCursor.tsx
import { useEffect, useRef } from 'react';
import { mouseState } from '../../utils/mouse-state';

export default function MagneticCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let lastMoveTime = 0;
    let crosshairOpacity = 0;
    let coordsOpacity = 0;

    const IDLE_MS = 400;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseState.vx = e.clientX - mouseState.x;
      mouseState.vy = e.clientY - mouseState.y;
      mouseState.x = e.clientX;
      mouseState.y = e.clientY;
      lastMoveTime = performance.now();
    };

    function step(now: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const idleMs = now - lastMoveTime;
      const speed = Math.sqrt(mouseState.vx ** 2 + mouseState.vy ** 2);
      const moving = speed > 1.5 || idleMs < 80;

      // Fade crosshair in/out
      const crosshairTarget = moving ? 0 : 0.35;
      const coordsTarget = idleMs > IDLE_MS && !moving ? 0.45 : 0;
      crosshairOpacity += (crosshairTarget - crosshairOpacity) * 0.1;
      coordsOpacity += (coordsTarget - coordsOpacity) * 0.08;

      // Decay velocity each frame
      mouseState.vx *= 0.75;
      mouseState.vy *= 0.75;

      const mx = mouseState.x;
      const my = mouseState.y;

      // Dot
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.fill();

      // Crosshair
      if (crosshairOpacity > 0.01) {
        ctx.strokeStyle = `rgba(255,255,255,${crosshairOpacity.toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(mx - 50, my); ctx.lineTo(mx - 8, my); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx + 8, my); ctx.lineTo(mx + 50, my); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx, my - 50); ctx.lineTo(mx, my - 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx, my + 8); ctx.lineTo(mx, my + 50); ctx.stroke();
      }

      // Coordinates
      if (coordsOpacity > 0.01) {
        ctx.font = `9px 'DM Mono', 'Courier New', monospace`;
        ctx.fillStyle = `rgba(255,255,255,${coordsOpacity.toFixed(3)})`;
        ctx.fillText(`X: ${Math.round(mx)}  Y: ${Math.round(my)}`, mx + 12, my + 16);
      }

      raf = requestAnimationFrame(step);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resize);
    resize();
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
}
```

- [ ] **Step 2: Verificar compilação**

```bash
cd ElysianCorp && npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/cursor/MagneticCursor.tsx
git commit -m "feat: add dot, crosshair and coordinates to MagneticCursor"
```

---

## Task 4: Adicionar dual ring com lerp ao `MagneticCursor`

**Files:**
- Modify: `src/components/cursor/MagneticCursor.tsx`

- [ ] **Step 1: Substituir conteúdo completo com dual ring + click pulse**

```tsx
// src/components/cursor/MagneticCursor.tsx
import { useEffect, useRef } from 'react';
import { mouseState } from '../../utils/mouse-state';

const INNER_LERP = 0.18;
const OUTER_LERP = 0.055;
const INNER_BASE_R = 22;
const INNER_IDLE_R = 18;
const OUTER_BASE_R = 52;
const IDLE_MS = 400;

export default function MagneticCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let lastMoveTime = 0;

    // Lerp targets for rings
    const inner = { x: -1000, y: -1000 };
    const outer = { x: -1000, y: -1000 };
    let innerRadius = INNER_BASE_R;
    let crosshairOpacity = 0;
    let coordsOpacity = 0;
    let clickPulseT = -1;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseState.vx = e.clientX - mouseState.x;
      mouseState.vy = e.clientY - mouseState.y;
      mouseState.x = e.clientX;
      mouseState.y = e.clientY;
      lastMoveTime = performance.now();
    };

    const handleClick = () => { clickPulseT = 0; };

    function step(now: number) {
      const dt = Math.min((now - (step as any)._last ?? now) / 1000, 0.05);
      (step as any)._last = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const idleMs = now - lastMoveTime;
      const speed = Math.sqrt(mouseState.vx ** 2 + mouseState.vy ** 2);
      const moving = speed > 1.5 || idleMs < 80;

      mouseState.vx *= 0.75;
      mouseState.vy *= 0.75;

      // Opacity transitions
      crosshairOpacity += ((moving ? 0 : 0.35) - crosshairOpacity) * 0.1;
      coordsOpacity += ((idleMs > IDLE_MS && !moving ? 0.45 : 0) - coordsOpacity) * 0.08;

      // Ring lerp
      inner.x += (mouseState.x - inner.x) * INNER_LERP;
      inner.y += (mouseState.y - inner.y) * INNER_LERP;
      outer.x += (mouseState.x - outer.x) * OUTER_LERP;
      outer.y += (mouseState.y - outer.y) * OUTER_LERP;

      // Inner radius: idle shrink + click pulse
      let pulseR = 0;
      if (clickPulseT >= 0) {
        clickPulseT += dt;
        const t = Math.min(clickPulseT / 0.2, 1);
        pulseR = (38 - INNER_BASE_R) * (1 - t);
        if (t >= 1) clickPulseT = -1;
      }
      const innerRadiusTarget = (moving ? INNER_BASE_R : INNER_IDLE_R) + pulseR;
      innerRadius += (innerRadiusTarget - innerRadius) * 0.2;

      // Outer radius: expand with speed
      const outerRadius = OUTER_BASE_R + Math.min(speed * 2, 20);

      const mx = mouseState.x;
      const my = mouseState.y;

      // Dot
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.fill();

      // Crosshair
      if (crosshairOpacity > 0.01) {
        ctx.strokeStyle = `rgba(255,255,255,${crosshairOpacity.toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(mx - 50, my); ctx.lineTo(mx - 8, my); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx + 8, my); ctx.lineTo(mx + 50, my); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx, my - 50); ctx.lineTo(mx, my - 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx, my + 8); ctx.lineTo(mx, my + 50); ctx.stroke();
      }

      // Inner ring
      ctx.beginPath();
      ctx.arc(inner.x, inner.y, Math.max(1, innerRadius), 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Outer ring
      ctx.beginPath();
      ctx.arc(outer.x, outer.y, outerRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // Coordinates
      if (coordsOpacity > 0.01) {
        ctx.font = `9px 'DM Mono', 'Courier New', monospace`;
        ctx.fillStyle = `rgba(255,255,255,${coordsOpacity.toFixed(3)})`;
        ctx.fillText(`X: ${Math.round(mx)}  Y: ${Math.round(my)}`, mx + 12, my + 16);
      }

      raf = requestAnimationFrame(step);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', resize);
    resize();
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    />
  );
}
```

- [ ] **Step 2: Verificar compilação**

```bash
cd ElysianCorp && npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/cursor/MagneticCursor.tsx
git commit -m "feat: add dual ring with lerp, idle states and click pulse to MagneticCursor"
```

---

## Task 5: Modificar `ScrambleBackground.tsx` — física de zona dupla

**Files:**
- Modify: `src/components/hero/ScrambleBackground.tsx`

- [ ] **Step 1: Importar `mouseState` e remover listener interno**

No topo do arquivo, adicionar o import após os imports existentes:

```ts
import { mouseState } from '../../utils/mouse-state';
```

- [ ] **Step 2: Remover `const mouse` e `handleMouse`**

Localizar e remover estas linhas dentro do `useEffect`:

```ts
// Mouse Physics Config
const mouse = { x: -1000, y: -1000 };
const RADIUS = 180;    // Raio de influência
const STRENGTH = 1.4;  // Força do empuxo
const FRICTION = 0.88; // Suavidade da volta
```

E remover o handler e listener:

```ts
const handleMouse = (e: MouseEvent) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

window.addEventListener('mousemove', handleMouse);
```

E no cleanup do `return`:
```ts
window.removeEventListener('mousemove', handleMouse);
```

- [ ] **Step 3: Adicionar novas constantes de física após `let spawnClock = 2.4;`**

```ts
// Dual-zone physics constants
const INNER_R = 50;     // attraction radius
const OUTER_R = 260;    // repulsion radius
const INNER_FORCE = 8.0;
const OUTER_FORCE = 5.0;
const FRICTION = 0.78;
const MAX_OFFSET = 18;
```

- [ ] **Step 4: Substituir o bloco de physics dentro do loop de células**

Localizar o bloco atual (dentro do `for r... for c...`):

```ts
// 2. Physics: Displacement Map (Liquid Motion)
const cellX = stripX + c * CELL_W + CELL_W / 2;
const dx = cellX - mouse.x;
const dy = cellY - mouse.y;
const distSq = dx * dx + dy * dy;

if (distSq < RADIUS * RADIUS) {
  const dist = Math.sqrt(distSq);
  const force = (RADIUS - dist) / RADIUS;
  const angle = Math.atan2(dy, dx);
  // Empuxo sutil
  cell.offX += Math.cos(angle) * force * STRENGTH;
  cell.offY += Math.sin(angle) * force * STRENGTH;
}

// Return force (Elasticity)
cell.offX *= FRICTION;
cell.offY *= FRICTION;
```

Substituir por:

```ts
// 2. Dual-zone physics
const cellX = stripX + c * CELL_W + CELL_W / 2;
const dx = cellX - mouseState.x;
const dy = cellY - mouseState.y;
const dist = Math.sqrt(dx * dx + dy * dy);

if (dist < OUTER_R && dist > 0) {
  const speed = Math.sqrt(mouseState.vx ** 2 + mouseState.vy ** 2);
  const velMult = Math.min(1 + speed * 0.12, 2.5);
  const angle = Math.atan2(dy, dx);

  if (dist < INNER_R) {
    // Attraction: pull toward cursor
    const force = INNER_FORCE * (1 - dist / INNER_R) * velMult;
    cell.offX -= Math.cos(angle) * force;
    cell.offY -= Math.sin(angle) * force;
  } else {
    // Repulsion: push away with falloff
    const t = (dist - INNER_R) / (OUTER_R - INNER_R);
    const force = OUTER_FORCE * (1 - t) * velMult;
    cell.offX += Math.cos(angle) * force;
    cell.offY += Math.sin(angle) * force;
  }
}

// Return force (Elasticity) + cap
cell.offX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, cell.offX * FRICTION));
cell.offY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, cell.offY * FRICTION));
```

- [ ] **Step 5: Verificar compilação**

```bash
cd ElysianCorp && npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 6: Commit**

```bash
git add src/components/hero/ScrambleBackground.tsx
git commit -m "feat: dual-zone magnetic physics in ScrambleBackground, reads from mouseState"
```

---

## Task 6: Integrar `MagneticCursor` no `industrial-hero.astro`

**Files:**
- Modify: `src/pages/industrial-hero.astro`

- [ ] **Step 1: Adicionar import no frontmatter**

No bloco `---` do arquivo, adicionar após os imports existentes:

```ts
import MagneticCursor from '../components/cursor/MagneticCursor';
```

- [ ] **Step 2: Adicionar o layer do cursor antes do `</main>`**

```astro
<!-- Level 4: Magnetic Cursor -->
<MagneticCursor client:only="react" />
```

- [ ] **Step 3: Mudar `cursor: crosshair` para `cursor: none` no `<style>`**

```css
body {
  margin: 0;
  padding: 0;
  cursor: none;
}
```

- [ ] **Step 4: Verificar compilação**

```bash
cd ElysianCorp && npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 5: Commit**

```bash
git add src/pages/industrial-hero.astro
git commit -m "feat: integrate MagneticCursor into industrial-hero, hide native cursor"
```

---

## Task 7: Verificação visual

- [ ] **Step 1: Iniciar o servidor de desenvolvimento**

```bash
cd ElysianCorp && npm run dev
```

Expected: servidor rodando em `http://localhost:4321` (ou porta configurada).

- [ ] **Step 2: Abrir `/industrial-hero` no browser**

Navegar para `http://localhost:4321/industrial-hero`.

- [ ] **Step 3: Checklist de verificação**

| Comportamento | Esperado |
|---|---|
| Cursor nativo | Invisível (substituído) |
| Dot branco | Visível, colado ao mouse |
| Crosshair | Aparece ~400ms parado, some ao mover |
| Coordenadas XY | Aparecem após idle, desaparecem ao mover |
| Inner ring | Segue mouse com lag suave, pulsa no click |
| Outer ring | Segue com lag maior, expande ao mover rápido |
| Grid em repouso | Caracteres dourados visíveis no fundo escuro |
| Mouse no grid | Cratera visível: chars colapsam no centro, explodem na borda |
| Mouse em movimento rápido | Ondas de distorção propagam pelo grid |

- [ ] **Step 4: Se algo não renderizar, checar console do browser**

Erros comuns:
- `mouseState is not defined`: verificar path do import em ambos os componentes
- Canvas em branco: verificar `client:only="react"` no MagneticCursor
- Física sem efeito: verificar se `ScrambleBackground` removeu o listener interno e não está mais usando `mouse.x`

---

## Notas de Implementação

**Ordem obrigatória:** Tasks 1 → 2 → 3 → 4 → 5 → 6 → 7. Cada task depende dos arquivos criados na anterior.

**`(step as any)._last`:** O timestamp inicial é `undefined` na primeira chamada do `requestAnimationFrame`. O `?? now` garante `dt = 0` no primeiro frame. Alternativa: usar uma variável de closure `let lastT = 0` fora da função `step` (igualmente válido, evita o `any`).

**Velocidade decai no `MagneticCursor`:** `mouseState.vx *= 0.75` é aplicado no loop do cursor. O `ScrambleBackground` lê os valores já decaídos no mesmo frame. Isso é correto — evita que picos de velocidade persistam por frames demais.
