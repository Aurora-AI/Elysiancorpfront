# Design Spec: Magnetic Cursor + Enhanced Liquid Semantic
**Date:** 2026-04-20
**Scope:** `ElysianCorp/src/` — `industrial-hero.astro` e componentes de cursor/hero

---

## 1. Objetivo

Substituir o cursor nativo e tornar o efeito Liquid Semantic visualmente impactante. O resultado deve ser imediatamente perceptível: ao mover o mouse, uma cratera de dados se abre no grid de caracteres, com um cursor editorial próprio que comunica precisão e controle.

---

## 2. Arquitetura

Três arquivos modificados, um novo criado:

```
src/
  utils/
    mouse-state.ts             ← NOVO: singleton de estado do mouse
  components/
    cursor/
      MagneticCursor.tsx       ← NOVO: canvas overlay do cursor + dual ring
    hero/
      ScrambleBackground.tsx   ← MODIFICADO: física reforçada
  pages/
    industrial-hero.astro      ← MODIFICADO: adiciona MagneticCursor como layer z-50
```

### 2.1 `mouse-state.ts`

Módulo singleton puro (sem React), importado por ambos os componentes:

```ts
export const mouseState = { x: -1000, y: -1000, vx: 0, vy: 0 };
```

`MagneticCursor` escreve `x`, `y` a cada `mousemove`, e calcula `vx`/`vy` como delta entre frames:
```ts
mouseState.vx = e.clientX - mouseState.x;
mouseState.vy = e.clientY - mouseState.y;
mouseState.x = e.clientX;
mouseState.y = e.clientY;
```
`ScrambleBackground` lê todos os campos em cada frame do loop de animação.
Zero overhead de Context ou state management.

---

## 3. `MagneticCursor.tsx`

Canvas transparente `position: fixed`, `z-index: 50`, cobrindo a viewport inteira.

### 3.1 Elementos visuais

| Elemento | Tamanho | Stroke | Opacidade base | Lag (lerp factor) |
|---|---|---|---|---|
| Dot central | 3px radius | fill white | 1.0 | 0 (colado no mouse) |
| Linhas crosshair | 50px cada lado | 0.8px white | 0.35 | 0 (colado no mouse) |
| Inner ring | 22px radius | 1px white | 0.75 | 0.18 (rápido) |
| Outer ring | 52px radius | 0.6px white | 0.25 | 0.055 (lento) |
| Coordenadas XY | 9px DM Mono | — | 0 → 0.45 | — |

### 3.2 Estados comportamentais

**Em movimento** (velocidade > threshold ~1.5px/frame):
- Crosshair e dot fazem fade-out (lerp opacity → 0)
- Somente rings permanecem visíveis
- Outer ring radius cresce proporcionalmente à velocidade (máx +20px), leve elipse na direção do movimento

**Parado** (+400ms sem movimento):
- Crosshair e coordenadas fazem fade-in (lerp opacity → alvo)
- Inner ring contrai levemente (22px → 18px) — efeito de "relaxar"
- Coordenadas XY exibidas em `DM Mono 9px` a ~12px do dot central

**Click:**
- Inner ring expande de 22px → 38px e retorna (pulse easing out, 200ms)

### 3.3 Posicionamento das coordenadas

```
X: {mouseX}  Y: {mouseY}
```
Exibido abaixo-direita do dot central, com offset de 12px.

### 3.4 Loop de animação

`requestAnimationFrame` próprio, independente do ScrambleBackground.
Posições dos rings atualizam via lerp a cada frame:
```
ringX += (targetX - ringX) * lerpFactor
ringY += (targetY - ringY) * lerpFactor
```

---

## 4. `ScrambleBackground.tsx` — Física Reforçada

### 4.1 Zona dupla de influência

| Zona | Raio | Comportamento | Força base |
|---|---|---|---|
| Inner (atração) | 0 – 50px | Chars puxados em direção ao cursor | 8.0 |
| Outer (repulsão) | 50 – 260px | Chars empurrados para fora com falloff linear | 5.0 |

Falloff outer: `force = baseForce * (1 - (dist - innerRadius) / (outerRadius - innerRadius))`

### 4.2 Parâmetros alterados

| Parâmetro | Antes | Depois |
|---|---|---|
| STRENGTH | 1.4 | — (substituído pela zona dupla) |
| RADIUS | 180 | 260 (outer) |
| FRICTION | 0.88 | 0.78 |
| Displacement cap | ~3px implícito | 18px explícito |

### 4.3 Velocity multiplier

```ts
const speed = Math.sqrt(mouseState.vx ** 2 + mouseState.vy ** 2);
const velMult = Math.min(1 + speed * 0.12, 2.5);
```
Multiplicado sobre a força calculada em cada célula. Movimento rápido cria ondas visíveis no grid.

### 4.4 Leitura do mouse

Remove o listener `mousemove` interno do componente. Passa a ler `mouseState.x / mouseState.y` diretamente no loop de animação.

---

## 5. `industrial-hero.astro` — Integração

Adicionar import e uso do `MagneticCursor`:

```astro
import MagneticCursor from '../components/cursor/MagneticCursor';
```

```astro
<!-- Level 4: Magnetic Cursor -->
<MagneticCursor client:only="react" />
```

Alterar CSS:
```css
body { cursor: none; } /* era cursor: crosshair */
```

---

## 6. Limites de escopo

- Esta spec cobre apenas `industrial-hero.astro`. O `CinemaHero.astro` e outras páginas não são afetados.
- `MagneticCursor` é um componente isolado — pode ser adicionado a outras páginas futuramente via import simples.
- Nenhuma mudança em sistema de design, tokens, ou outras rotas.
