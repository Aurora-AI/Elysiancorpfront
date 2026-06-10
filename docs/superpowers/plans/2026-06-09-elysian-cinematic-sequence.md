# Elysian Cinematic Sequence — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild all sections below the Hero as a cinematic "Plano-Sequência / One-Shot" camera experience — scroll moves a camera through 5 governed chambers, alternating dark/light worlds, driven by a single GSAP ScrollTrigger spine.

**Architecture:** Phase 1 creates two constitutional skills via the Agent Forge factory (each requires SKILL.md + agent.json + PromotionGate) and uses them to generate reviewed HTML prototypes for all 5 chambers. Phase 2 ports those approved prototypes into the Astro/React repo as a single `SequenceRig` island that replaces the 7 loose `client:visible` sections currently in `index.astro`.

**Tech Stack:** Astro 6 + React 19, GSAP 3.12 + ScrollTrigger (pin/scrub/snap), Lenis (inertia scroll), @react-three/fiber + drei (R3F, Chamber 03 only), framer-motion 12 (spring physics), Tailwind v4, Aurora Agent Forge (SES pipeline).

**Spec:** `docs/superpowers/specs/2026-06-09-elysian-cinematic-sequence-design.md`

**Design System source:** `C:\Users\rodri\OneDrive\Pessoal\Desktop\Elysian Design System\`

---

## Phase 1 — Constitutional Skills (repo: `C:\Projetos\MadLabAurora`)

### Task 1: Add Elysian Design System to open-design catalog

**Repo:** `C:\Projetos\MadLabAurora`

**Files:**
- Create: `integrations/open-design/design-systems/elysian/DESIGN.md`

- [ ] **Step 1.1: Create the design system folder**

```powershell
New-Item -ItemType Directory -Path "C:\Projetos\MadLabAurora\integrations\open-design\design-systems\elysian" -Force
```

- [ ] **Step 1.2: Write DESIGN.md from the generated Design System**

Create `integrations/open-design/design-systems/elysian/DESIGN.md` with this exact content (extracted from `Desktop/Elysian Design System/readme.md` and `tokens/`):

```markdown
# Elysian Design System

> Category: Elysian
> Governed AI infrastructure — dual-world cyber-industrial-meets-luxury-editorial. Validated Operational Memory, fail-closed agents, deterministic gates.

## 1. Visual Theme & Atmosphere

Two worlds. **Luminous (light):** parchment canvas `#F8F7F3`, ink text `#1A1A17`, warm neutrals. **Sovereign (dark):** pure black `#000000`, paper `#F2F2F2` text, silver/gold metallics. The sole accent in both worlds is **Elysian Moss `#4E5B4B`** (lifted to `#6B7A66` on black). Sections alternate worlds to create rhythm. No neon, no emerald, no purple gradients. Imagery is black-and-white / grayscale. Halftone grain at ~2% opacity is the connective tissue.

## 2. Color Palette

| Token | Value | Role |
|---|---|---|
| `--parchment` | `#F8F7F3` | Primary light canvas |
| `--obsidian` | `#000000` | Primary dark canvas |
| `--ink` | `#1A1A17` | Primary text on light |
| `--parchment-text` | `#F2F2F2` | Primary text on dark |
| `--moss` | `#4E5B4B` | The only brand accent |
| `--moss-bright` | `#6B7A66` | Moss lifted for dark bg |
| `--silver-glimmer` | `#E5E7EB` | Dark world only — metallic highlight |
| `--silver-technical` | `#9CA3AF` | Dark world only — muted metadata |
| `--gold-sovereign` | `#D4AF37` | Dark world only — ceremonial |
| `--rust` | `#984731` | Diagnostic critical |
| `--amber` | `#D97706` | Diagnostic caution |

## 3. Typography

Four voices only. Fibonacci scale on 21px base: 8 · 13 · 21 · 34 · 55 · 89 · 144.

| Voice | Family | Weight | Use |
|---|---|---|---|
| Brand (`t-brand`) | Lanche → Instrument Serif fallback | 400 | Wordmark, monumental headlines |
| Display (`t-display`) | Instrument Serif | 400 | Editorial headlines, accent word in *italic + moss* |
| Body (`t-editorial`) | Public Sans | 300–400 | Running text |
| Mono (`t-mono`) | JetBrains Mono | 500 | Metadata, labels, coordinates, build IDs — UPPERCASE, tracked 0.18em |
| Legal (`t-legal`) | Crimson Pro | 600 | Lex vertical only |

Serifs shine at regular weight. Mono is **always** uppercase + tracked. Never use system fonts (Inter, Roboto, Arial) as display voices.

## 4. Spacing & Layout

Fibonacci on 8px base: 8 · 13 · 21 · 34 · 55 · 64 · 104 · 168 · 272. Grids are asymmetric 13-column CSS Grid. Never 3-equal-column card grids. Never centered hero text columns (the wordmark is the one centered exception). Radii near-zero: 0 for CTAs/imagery, 3–5px for cards, 9999px only for status dots.

## 5. Interaction & Motion

"Liquid" — long durations (1.2s default), monumental easing. Signature: `expo.inOut` for world transitions. Hover: slow tonal crossfade to moss/black (~0.4–0.7s). No bounce, no spring jitter, no CRT scanlines, no character scramble on visible UI.

## 6. Voice & Copy

Sober, technical, authoritative. Institutional third person + imperative. Short sentences. Brackets on labels: `[ 02 // The Integrity Gap ]`, `[ DEPLOY SOVEREIGNTY ]`. Vocabulary: Determinism, Auditability, Sovereignty, Governance, Validated Operational Memory. Avoid: "chatbot", "AI-powered", "innovation", military cosplay, exclamation marks, emoji.

## 7. Dark World Rules

Depth on black via hairline borders (`rgba(255,255,255,0.08)`) and 5%-white top-edge highlights — shadows vanish on black. Metallics (silver, gold) appear **only** in the dark world.

## 8. Component Signatures

- **Buttons:** `rounded-sm` (2px), moss fill, `t-mono` label, `[ DEPLOY_SOVEREIGNTY ]` editorial bracket style.
- **Cards:** deep lifted shadow (`0 34px 89px -21px rgba(0,0,0,.15)`) on light; hairline border on dark.
- **MetaLabel:** `[ 02 // ... ]` mono wayfinder pattern.
- **Status dot:** 5–7px round, diagnostic color, pulsing, beside mono label.

## 9. Anti-Patterns (banned)

Symmetric linear layouts without axis breaks · System fonts as display voices · Neon SaaS gradients (purple→blue→green) · Commercial template border-radius/shadows · Bounce/elastic motion without reason · `#000000` as dark-mode substitute without narrative posture · Emoji · `snake_case` in UI copy.
```

- [ ] **Step 1.3: Verify catalog picks it up**

Open `integrations/open-design/catalog_design_systems.json` and confirm the catalog format, then add the entry if it's hand-maintained (check the file first — some catalogs auto-discover by folder scan).

```powershell
Get-Content "C:\Projetos\MadLabAurora\integrations\open-design\catalog_design_systems.json" | Select-Object -First 30
```

- [ ] **Step 1.4: Commit**

```powershell
cd "C:\Projetos\MadLabAurora"
git add integrations/open-design/design-systems/elysian/
git commit -m "feat(open-design): add Elysian Design System to catalog"
```

---

### Task 2: Author `elysian-chamber-prototype` skill

**Repo:** `C:\Projetos\MadLabAurora`

**Files:**
- Create: `integrations/open-design/skills/elysian-chamber-prototype/SKILL.md`
- Create: `integrations/open-design/skills/elysian-chamber-prototype/agent.json`

This skill generates a self-contained HTML prototype for a single Elysian chamber, using the Elysian Design System tokens.

- [ ] **Step 2.1: Create skill folder**

```powershell
New-Item -ItemType Directory -Path "C:\Projetos\MadLabAurora\integrations\open-design\skills\elysian-chamber-prototype" -Force
```

- [ ] **Step 2.2: Write SKILL.md**

Create `integrations/open-design/skills/elysian-chamber-prototype/SKILL.md`:

```markdown
---
name: elysian-chamber-prototype
version: 0.1.0
class: A
risk: LOW
mode: generative / on-demand
trigger: explicit human request with chamber spec
promotion_gate: PROMOTION_ALLOWED
inputs:
  - chamber_id: "C01|C02|C03|C04|C05"
  - world: "light|dark"
  - headline: string
  - body_copy: string
  - density: "low|medium|high"
  - special: optional — "spring-fragments|fail-closed-gate|r3f-placeholder|remotion-island|boot-down"
outputs:
  - file: "elysian-chamber-{id}.html"
  - type: self-contained HTML with inline CSS using Elysian Design System tokens
anti_hallucination:
  - MUST read DESIGN.md from design-systems/elysian/ before generating
  - MUST NOT invent colors outside the palette
  - MUST NOT use border-radius > 5px on cards
  - MUST NOT use bounce/spring motion
  - MUST NOT use system fonts as display voices
  - MUST include halftone-noise overlay at 2% opacity
  - MUST alternate worlds per EQ: low→med/high→high→low/med→high
limits:
  - does not write to repo directly
  - does not approve QA
  - does not generate TSX/React code
  - prototype is reviewed by human before porting
---

# elysian-chamber-prototype

Generates a self-contained HTML prototype for one chamber of the Elysian Cinematic Sequence.

## Purpose

Translate an approved chamber spec (from the Cinematic Sequence design doc) into a reviewable HTML prototype using the Elysian Design System. The prototype is the human-reviewable artifact before porting to TSX.

## Input

Caller supplies:
- `chamber_id`: which chamber (C01–C05)
- `world`: `light` or `dark`
- `headline`: the main copy block
- `body_copy`: supporting copy
- `density`: visual density — drives how much whitespace vs. content
- `special` (optional): chamber-specific staging mechanic (see anti-patterns for exclusions)

## Output

A single HTML file `elysian-chamber-{id}.html` that:
- Loads Elysian fonts (Google Fonts CDN: Instrument Serif, Public Sans, JetBrains Mono, Crimson Pro)
- Embeds the Elysian color tokens as CSS custom properties
- Renders the chamber at 100vh
- Includes the correct world (light/dark) as a body class
- Includes halftone-noise grain texture at 2% opacity
- Uses asymmetric layout (never 3-equal-column grid)
- Includes a `[ STAGE: {chamber_id} ]` HUD label in the top-left (t-mono, 13px)

## Anti-patterns (hard stops)

The generator MUST refuse and flag if asked to produce:
- Neon gradients (purple, blue, green)
- `border-radius` > 5px on cards
- System fonts (Inter, Roboto, Arial) as display
- Bounce or elastic animation
- Symmetric centered text column layouts
- Emoji

## Modes

**Single chamber:** generate one HTML file for a specified chamber ID.
**Batch review:** generate C01–C05 sequentially, outputting one file per chamber for side-by-side review.

## Usage example

```
Generate chamber C02 (dark, high density):
- chamber_id: C02
- world: dark
- headline: "A inteligência não é deixar a IA decidir mais. É definir exatamente o que ela não pode decidir."
- body_copy: "We study controlled agency: systems that can reason, plan and simulate, but cannot mutate production without deterministic gates."
- density: high
- special: fail-closed-gate
```
```

- [ ] **Step 2.3: Write agent.json**

Create `integrations/open-design/skills/elysian-chamber-prototype/agent.json`:

```json
{
  "name": "elysian-chamber-prototype",
  "version": "0.1.0",
  "class": "A",
  "risk": "LOW",
  "mode": "generative",
  "trigger": "explicit_human_request",
  "promotion_gate": "PROMOTION_ALLOWED",
  "constitution": {
    "reads": [
      "integrations/open-design/design-systems/elysian/DESIGN.md"
    ],
    "writes": [],
    "executes": [],
    "approves": []
  },
  "inputs": {
    "required": ["chamber_id", "world", "headline", "body_copy", "density"],
    "optional": ["special"]
  },
  "outputs": {
    "type": "html_file",
    "pattern": "elysian-chamber-{chamber_id}.html"
  },
  "limits": [
    "no_repo_writes",
    "no_qa_approval",
    "no_tsx_generation",
    "no_autonomous_trigger"
  ]
}
```

- [ ] **Step 2.4: Commit draft**

```powershell
cd "C:\Projetos\MadLabAurora"
git add integrations/open-design/skills/elysian-chamber-prototype/
git commit -m "feat(agent-forge): draft elysian-chamber-prototype skill"
```

---

### Task 3: Run SES validation on `elysian-chamber-prototype`

**Repo:** `C:\Projetos\MadLabAurora`

- [ ] **Step 3.1: Check Python environment**

```powershell
cd "C:\Projetos\MadLabAurora\aurora-agents\skill-evolution-system"
python --version
pip install -r requirements.txt
```

Expected: Python 3.10+ installed, dependencies resolved.

- [ ] **Step 3.2: Run SES pipeline on the skill**

```powershell
python src/pipeline.py --skill "C:\Projetos\MadLabAurora\integrations\open-design\skills\elysian-chamber-prototype"
```

Expected output: rubric scores across 5 dimensions + `PromotionGate` verdict. Target: `PROMOTION_ALLOWED`.

- [ ] **Step 3.3: Fix any rubric failures**

If `PromotionGate = PROMOTION_BLOCKED`, read the rubric failure report and fix the SKILL.md or agent.json. Common failures:
- `rubric-trigger-clarity`: add more specific trigger language in frontmatter
- `rubric-anti-hallucination`: ensure all `MUST NOT` constraints are explicit
- `rubric-reference-integrity`: verify the `reads` path in agent.json exists physically

Re-run Step 3.2 after each fix until `PROMOTION_ALLOWED`.

- [ ] **Step 3.4: Commit validated skill**

```powershell
git add integrations/open-design/skills/elysian-chamber-prototype/
git commit -m "feat(agent-forge): elysian-chamber-prototype — PromotionGate ALLOWED"
```

---

### Task 4: Author and validate `elysian-sequence-rig` skill

**Repo:** `C:\Projetos\MadLabAurora`

**Files:**
- Create: `integrations/open-design/skills/elysian-sequence-rig/SKILL.md`
- Create: `integrations/open-design/skills/elysian-sequence-rig/agent.json`

This skill generates the GSAP SequenceRig TSX scaffold — the camera spine. It outputs a skeleton, not a finished component; the developer fills in chamber wiring.

- [ ] **Step 4.1: Create skill folder and SKILL.md**

Create `integrations/open-design/skills/elysian-sequence-rig/SKILL.md`:

```markdown
---
name: elysian-sequence-rig
version: 0.1.0
class: A
risk: LOW
mode: generative / on-demand
trigger: explicit human request to scaffold SequenceRig
promotion_gate: PROMOTION_ALLOWED
inputs:
  - chamber_count: integer (default: 5)
  - snap: boolean (default: true)
outputs:
  - files:
      - SequenceRig.tsx
      - CameraStage.tsx
      - WorldTone.tsx
      - HudTelemetry.tsx
      - useCameraProgress.ts
anti_hallucination:
  - MUST NOT use any scroll library other than Lenis + GSAP ScrollTrigger
  - MUST NOT use CSS scroll-snap — only ScrollTrigger snap
  - MUST degrade to static vertical layout under prefers-reduced-motion
  - MUST export CameraProgressContext for chamber consumption
  - MUST include ScrollSpacer with height = chamber_count × 100vh
  - MUST NOT auto-mount R3F canvas — R3F is chamber-scoped and lazy
limits:
  - outputs TSX scaffold only — no chamber content
  - does not write to repo
  - does not approve QA
---

# elysian-sequence-rig

Generates the GSAP ScrollTrigger camera spine for the Elysian Cinematic Sequence.

## Purpose

Produce the infrastructure TSX files that turn the Astro page into a pinned camera traversal. Chambers are children — this skill generates the rig, not the chambers.

## Architecture the scaffold must implement

```
<SequenceRig>
  CameraStage (position:fixed, 100vh) ← viewfinder
  WorldTone (bg interpolation dark↔light by progress)
  HudTelemetry (diegetic header, updates label per chamber)
  ScrollSpacer (height = N × 100vh)
```

CameraProgressContext publishes `{ progress: number, activeChamber: number, worldTone: 'dark'|'light' }`.

Chamber windows are evenly distributed: chamber K occupies scroll progress `[K/N, (K+1)/N]`.

World tone map (5 chambers): C01=light, C02=dark, C03=dark, C04=light, C05=dark.

## Lenis wiring

```ts
const lenis = new Lenis()
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

## Reduced-motion degradation

Under `prefers-reduced-motion`:
- `CameraStage` renders as `position: relative` (no pin, no fixed)
- WorldTone renders static background per active chamber (no interpolation)
- All GSAP animations collapse to `duration: 0.01` via `getAnimationDefaults()`
- R3F chambers render their 2D fallback

## Modes

**Full scaffold:** generate all 5 files.
**Single file:** generate one specified file (e.g. only `useCameraProgress.ts`).
```

- [ ] **Step 4.2: Write agent.json**

Create `integrations/open-design/skills/elysian-sequence-rig/agent.json`:

```json
{
  "name": "elysian-sequence-rig",
  "version": "0.1.0",
  "class": "A",
  "risk": "LOW",
  "mode": "generative",
  "trigger": "explicit_human_request",
  "promotion_gate": "PROMOTION_ALLOWED",
  "constitution": {
    "reads": [
      "ElysianCorp/src/lib/animations.ts",
      "ElysianCorp/src/styles/tokens.css"
    ],
    "writes": [],
    "executes": [],
    "approves": []
  },
  "inputs": {
    "required": [],
    "optional": ["chamber_count", "snap"]
  },
  "outputs": {
    "type": "tsx_scaffold",
    "files": [
      "SequenceRig.tsx",
      "CameraStage.tsx",
      "WorldTone.tsx",
      "HudTelemetry.tsx",
      "useCameraProgress.ts"
    ]
  },
  "limits": [
    "scaffold_only",
    "no_repo_writes",
    "no_qa_approval",
    "no_autonomous_trigger"
  ]
}
```

- [ ] **Step 4.3: Run SES validation**

```powershell
cd "C:\Projetos\MadLabAurora\aurora-agents\skill-evolution-system"
python src/pipeline.py --skill "C:\Projetos\MadLabAurora\integrations\open-design\skills\elysian-sequence-rig"
```

Fix rubric failures same as Task 3.3. Target: `PromotionGate = PROMOTION_ALLOWED`.

- [ ] **Step 4.4: Commit validated skill**

```powershell
cd "C:\Projetos\MadLabAurora"
git add integrations/open-design/skills/elysian-sequence-rig/
git commit -m "feat(agent-forge): elysian-sequence-rig — PromotionGate ALLOWED"
```

---

### Task 5: Generate and review chamber HTML prototypes (C01–C05)

**Repo:** `C:\Projetos\MadLabAurora` (output staging)

**Files:**
- Create: `creative-area-manifest.json` entry for the Elysian Cinematic prototype batch
- Output dir: `projects/elysian-cinematic-prototypes/` (create it)

- [ ] **Step 5.1: Create staging directory**

```powershell
New-Item -ItemType Directory -Path "C:\Projetos\MadLabAurora\projects\elysian-cinematic-prototypes" -Force
```

- [ ] **Step 5.2: Generate C01 prototype**

Using the `elysian-chamber-prototype` skill, generate with these exact inputs:

```
chamber_id: C01
world: light
density: low
headline: "O mercado aprendeu a escalar respostas. Nós construímos controle."
body_copy: "Empresas não sofrem por falta de dados. Sofrem por perda de contexto. O conhecimento existe — mas vaza entre reuniões, planilhas, e-mails e cabeças."
special: spring-fragments
```

Save output as `projects/elysian-cinematic-prototypes/elysian-chamber-C01.html`.

- [ ] **Step 5.3: Generate C02 prototype**

```
chamber_id: C02
world: dark
density: high
headline: "A inteligência não é deixar a IA decidir mais. É definir exatamente o que ela não pode decidir."
body_copy: "We study controlled agency: systems that can reason, plan and simulate, but cannot mutate production without deterministic gates."
special: fail-closed-gate
hud_pillars: ["fail-closed", "human approval", "auditability", "evaluation gates", "bounded autonomy"]
```

Save as `projects/elysian-cinematic-prototypes/elysian-chamber-C02.html`.

- [ ] **Step 5.4: Generate C03 prototype**

```
chamber_id: C03
world: dark
density: high
headline: "Captura → Estruturação → Validação → Persistência → Execução → Aprendizado"
body_copy: "Álvaro observa, planeja, simula e propõe. A produção só muda com gates determinísticos, QA formal e aprovação humana."
special: r3f-placeholder
note: "R3F FactoryCorridor renders here — prototype shows a 2D flat version of the conveyor stages with diegetic HUD labels"
```

Save as `projects/elysian-cinematic-prototypes/elysian-chamber-C03.html`.

- [ ] **Step 5.5: Generate C04 prototype**

```
chamber_id: C04
world: light
density: low
headline: "Damos voz à sua empresa. Vendemos a verdade — a história da sua empresa preservada."
body_copy: "O produto que não é um CRM. Ele intercepta a informação, estrutura, transforma em inteligência aplicada e devolve o tempo ao gestor."
special: remotion-island
```

Save as `projects/elysian-cinematic-prototypes/elysian-chamber-C04.html`.

- [ ] **Step 5.6: Generate C05 prototype**

```
chamber_id: C05
world: dark
density: high
headline: "Memória Operacional Validada. Uma categoria nova."
body_copy: "Não somos CRM, copiloto ou plataforma de IA. Construímos a infraestrutura que transforma conhecimento confiável em execução confiável."
special: boot-down
cta: "[ REQUEST PARTNERSHIP ]"
```

Save as `projects/elysian-cinematic-prototypes/elysian-chamber-C05.html`.

- [ ] **Step 5.7: Review C01–C05 against the 4 AGENTS.md gates**

Open each HTML in browser. For each, verify:

```
Gate 1 — Estética: zero dos 6 sinais de alerta?
  [ ] Sem simetria linear crua
  [ ] Sem fonte de sistema como display
  [ ] Sem gradiente neon
  [ ] Sem border-radius comercial
  [ ] Motion tem gravidade
  [ ] Dark não é #000 genérico — é postura narrativa

Gate 2 — Continuidade: o mundo (light/dark) está correto para a câmara?
  [ ] C01=light, C02=dark, C03=dark, C04=light, C05=dark

Gate 3 — Copy: copy original preservada sem truncagem?
  [ ] C02: headline pt-br exata + body en exato
  [ ] HUD pillars C02: todos 5 presentes

Gate 4 — Densidade EQ: a densidade alternância está respeitada?
  [ ] low → high → high → low → high (sem duas baixas adjacentes nas câmaras dark)
```

- [ ] **Step 5.8: Commit prototypes**

```powershell
cd "C:\Projetos\MadLabAurora"
git add projects/elysian-cinematic-prototypes/
git commit -m "feat(elysian): chamber HTML prototypes C01-C05 reviewed + approved"
```

---

## Phase 2 — Site Implementation (repo: `C:\Projetos\MadLabAurora\ElysianCorp`)

---

### Task 6: Foundation setup — Lenis + token expansion

**Repo:** `C:\Projetos\MadLabAurora\ElysianCorp`

**Files:**
- Modify: `package.json`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/styles/tokens.css`

- [ ] **Step 6.1: Install Lenis**

```powershell
cd "C:\Projetos\MadLabAurora\ElysianCorp"
npm install @studio-freight/lenis
```

Expected: `@studio-freight/lenis` appears in `package.json` dependencies.

- [ ] **Step 6.2: Remove CSS scroll-smooth from Layout.astro**

In `src/layouts/Layout.astro`, change:

```html
<!-- Before -->
<html lang="pt-br" class="scroll-smooth">

<!-- After -->
<html lang="pt-br">
```

- [ ] **Step 6.3: Add semantic color aliases to tokens.css**

Append to the end of `src/styles/tokens.css`:

```css
/* SEMANTIC ALIASES — reach for these in SequenceRig components */

/* Light world */
--surface-page:      var(--off-white);
--surface-card:      var(--white);
--surface-sunken:    var(--fog);
--text-primary:      var(--ink);
--text-secondary:    rgba(13, 13, 13, 0.60);
--text-muted:        rgba(13, 13, 13, 0.40);
--border-hairline:   rgba(13, 13, 13, 0.08);

/* Dark world */
--surface-page-dark:    var(--obsidian);
--surface-card-dark:    var(--obsidian-technical);
--text-primary-dark:    #F2F2F2;
--text-secondary-dark:  rgba(242, 242, 242, 0.60);
--text-muted-dark:      rgba(242, 242, 242, 0.40);
--border-hairline-dark: rgba(255, 255, 255, 0.08);
--moss-bright:          #6B7A66;

/* Motion */
--ease-monumental: cubic-bezier(0.85, 0, 0.15, 1);
--ease-luxury:     cubic-bezier(0.19, 1, 0.22, 1);
```

- [ ] **Step 6.4: Commit**

```powershell
git add package.json package-lock.json src/layouts/Layout.astro src/styles/tokens.css
git commit -m "feat(foundation): Lenis + semantic tokens for SequenceRig"
```

---

### Task 7: Camera context — `useCameraProgress`

**Files:**
- Create: `src/components/sequence/useCameraProgress.ts`

- [ ] **Step 7.1: Create the sequence folder and context file**

```powershell
New-Item -ItemType Directory -Path "C:\Projetos\MadLabAurora\ElysianCorp\src\components\sequence" -Force
New-Item -ItemType Directory -Path "C:\Projetos\MadLabAurora\ElysianCorp\src\components\sequence\chambers" -Force
New-Item -ItemType Directory -Path "C:\Projetos\MadLabAurora\ElysianCorp\src\components\sequence\r3f" -Force
```

- [ ] **Step 7.2: Write useCameraProgress.ts**

Create `src/components/sequence/useCameraProgress.ts`:

```typescript
import { createContext, useContext } from 'react';

export type WorldTone = 'dark' | 'light';

export interface CameraProgress {
  progress: number;       // 0→1 across full scroll travel
  activeChamber: number;  // 0–4
  worldTone: WorldTone;
}

const WORLD_MAP: Record<number, WorldTone> = {
  0: 'light', // C01 — The Category Problem
  1: 'dark',  // C02 — Fail Closed
  2: 'dark',  // C03 — Governed Factory
  3: 'light', // C04 — Truth Returned
  4: 'dark',  // C05 — The Category
};

export function progressToChamber(progress: number, total = 5): number {
  return Math.min(Math.floor(progress * total), total - 1);
}

export function chamberToWorldTone(chamber: number): WorldTone {
  return WORLD_MAP[chamber] ?? 'dark';
}

export const CameraProgressContext = createContext<CameraProgress>({
  progress: 0,
  activeChamber: 0,
  worldTone: 'light',
});

export function useCameraProgress(): CameraProgress {
  return useContext(CameraProgressContext);
}
```

- [ ] **Step 7.3: Verify types compile**

```powershell
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7.4: Commit**

```powershell
git add src/components/sequence/useCameraProgress.ts
git commit -m "feat(sequence): CameraProgressContext + useCameraProgress hook"
```

---

### Task 8: CameraStage + WorldTone + HudTelemetry

**Files:**
- Create: `src/components/sequence/CameraStage.tsx`
- Create: `src/components/sequence/WorldTone.tsx`
- Create: `src/components/sequence/HudTelemetry.tsx`

- [ ] **Step 8.1: Write CameraStage.tsx**

```typescript
// src/components/sequence/CameraStage.tsx
import { type ReactNode } from 'react';
import { useCameraProgress } from './useCameraProgress';
import { getAnimationDefaults } from '../../lib/animations';

interface CameraStageProps {
  children: ReactNode;
}

export function CameraStage({ children }: CameraStageProps) {
  const anim = getAnimationDefaults();
  const isReduced = anim.duration < 0.2;

  if (isReduced) {
    // Degraded: no pin, chambers stack vertically
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        {children}
      </div>
    );
  }

  return (
    <div
      id="camera-stage"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 10,
      }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 8.2: Write WorldTone.tsx**

```typescript
// src/components/sequence/WorldTone.tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCameraProgress, type WorldTone } from './useCameraProgress';
import { getAnimationDefaults } from '../../lib/animations';

const WORLD_COLORS: Record<WorldTone, { bg: string; text: string }> = {
  light: { bg: '#F9F8F6', text: '#0D0D0D' },
  dark:  { bg: '#000000', text: '#F2F2F2' },
};

export function WorldTone() {
  const { worldTone } = useCameraProgress();
  const prevTone = useRef<WorldTone>('light');
  const anim = getAnimationDefaults();

  useEffect(() => {
    if (prevTone.current === worldTone) return;
    prevTone.current = worldTone;

    const { bg, text } = WORLD_COLORS[worldTone];
    const isReduced = anim.duration < 0.2;

    gsap.to(document.body, {
      backgroundColor: bg,
      color: text,
      duration: isReduced ? 0.01 : 1.8,
      ease: 'expo.inOut',
    });
  }, [worldTone, anim.duration]);

  return null;
}
```

- [ ] **Step 8.3: Write HudTelemetry.tsx**

```typescript
// src/components/sequence/HudTelemetry.tsx
import { useCameraProgress } from './useCameraProgress';

const CHAMBER_LABELS: Record<number, string> = {
  0: 'STAGE: CONTEXT',
  1: 'STAGE: GOVERNANCE',
  2: 'STAGE: FACTORY',
  3: 'STAGE: TRUTH',
  4: 'STAGE: CATEGORY',
};

export function HudTelemetry() {
  const { activeChamber, worldTone } = useCameraProgress();
  const label = CHAMBER_LABELS[activeChamber] ?? 'STAGE: INIT';

  return (
    <div
      className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 pointer-events-none"
      aria-hidden="true"
    >
      <div className="flex items-center gap-8">
        <span
          className="t-mono text-[13px] transition-colors duration-700"
          style={{ color: worldTone === 'dark' ? 'var(--silver-technical)' : 'var(--ink)' }}
        >
          [ PROTOCOL: TRUSTWARE ]
        </span>
        <div
          className="w-16 h-px transition-colors duration-700"
          style={{ background: worldTone === 'dark' ? 'rgba(166,138,70,0.3)' : 'rgba(13,13,13,0.1)' }}
        />
        <span
          className="t-mono text-[13px] transition-colors duration-700"
          style={{ color: worldTone === 'dark' ? 'var(--gold-sovereign)' : 'var(--ink)' }}
        >
          [ {label} ]
        </span>
      </div>
      <span
        className="t-mono text-[13px] transition-colors duration-700"
        style={{ color: worldTone === 'dark' ? 'var(--silver-technical)' : 'rgba(13,13,13,0.4)' }}
      >
        ELYSIAN CORP © 2026
      </span>
    </div>
  );
}
```

- [ ] **Step 8.4: Verify types compile**

```powershell
npx tsc --noEmit
```

- [ ] **Step 8.5: Commit**

```powershell
git add src/components/sequence/CameraStage.tsx src/components/sequence/WorldTone.tsx src/components/sequence/HudTelemetry.tsx
git commit -m "feat(sequence): CameraStage + WorldTone + HudTelemetry"
```

---

### Task 9: SequenceRig — the master ScrollTrigger + Lenis spine

**Files:**
- Create: `src/components/sequence/SequenceRig.tsx`

- [ ] **Step 9.1: Write SequenceRig.tsx**

```typescript
// src/components/sequence/SequenceRig.tsx
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
const SCROLL_HEIGHT = `${CHAMBER_COUNT * 100}vh`;

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

    // Lenis smooth scroll
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Master ScrollTrigger: pin the camera stage
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: spacerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: '#camera-stage',
        pinSpacing: false,
        onUpdate: (self) => {
          const progress = self.progress;
          const activeChamber = progressToChamber(progress, CHAMBER_COUNT);
          const worldTone = chamberToWorldTone(activeChamber);
          setCamState({ progress, activeChamber, worldTone });
        },
        snap: {
          snapTo: 1 / (CHAMBER_COUNT - 1),
          duration: { min: 0.3, max: 0.6 },
          ease: 'expo.inOut',
          delay: 0.1,
        },
      });
    });

    return () => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, [isReduced]);

  if (isReduced) {
    return (
      <CameraProgressContext.Provider value={camState}>
        <div style={{ position: 'relative' }}>
          {children}
        </div>
      </CameraProgressContext.Provider>
    );
  }

  return (
    <CameraProgressContext.Provider value={camState}>
      <CameraStage>
        <WorldTone />
        <HudTelemetry />
        {children}
      </CameraStage>
      {/* ScrollSpacer: generates the scroll travel */}
      <div ref={spacerRef} style={{ height: SCROLL_HEIGHT }} aria-hidden="true" />
    </CameraProgressContext.Provider>
  );
}
```

- [ ] **Step 9.2: Verify types compile**

```powershell
npx tsc --noEmit
```

- [ ] **Step 9.3: Commit**

```powershell
git add src/components/sequence/SequenceRig.tsx
git commit -m "feat(sequence): SequenceRig master ScrollTrigger + Lenis spine"
```

---

### Task 10: Chamber utility — per-chamber window and fake-depth

**Files:**
- Create: `src/components/sequence/useChamberWindow.ts`

Each chamber uses this hook to calculate its own `[enter, focus, exit]` window and drive its fake-depth transform (scale/blur/opacity) without knowing the global progress.

- [ ] **Step 10.1: Write useChamberWindow.ts**

```typescript
// src/components/sequence/useChamberWindow.ts
import { useMemo } from 'react';
import { useCameraProgress } from './useCameraProgress';

export interface ChamberWindow {
  /** 0=invisible, 1=fully focused */
  visibility: number;
  isFocused: boolean;
  isEntering: boolean;
  isExiting: boolean;
  /** CSS scale for fake-depth (1 = focused) */
  scale: number;
  /** CSS blur in px */
  blur: number;
  /** CSS opacity */
  opacity: number;
}

const TOTAL = 5;
const FADE_BAND = 0.08; // fraction of total progress for enter/exit fade

export function useChamberWindow(chamberIndex: number): ChamberWindow {
  const { progress } = useCameraProgress();

  return useMemo(() => {
    const center = (chamberIndex + 0.5) / TOTAL;
    const halfWindow = 0.5 / TOTAL;

    const distFromCenter = Math.abs(progress - center);
    const normalized = Math.max(0, 1 - distFromCenter / (halfWindow + FADE_BAND));

    const isFocused = distFromCenter < halfWindow * 0.4;
    const isEntering = progress < center && normalized > 0 && normalized < 1;
    const isExiting  = progress > center && normalized > 0 && normalized < 1;

    const scale   = 0.95 + normalized * 0.05;  // 0.95 → 1.0
    const blur    = (1 - normalized) * 12;      // 12px → 0px
    const opacity = normalized;

    return { visibility: normalized, isFocused, isEntering, isExiting, scale, blur, opacity };
  }, [progress, chamberIndex]);
}
```

- [ ] **Step 10.2: Commit**

```powershell
git add src/components/sequence/useChamberWindow.ts
git commit -m "feat(sequence): useChamberWindow — fake-depth per chamber"
```

---

### Task 11: Chamber C01 — "The Category Problem" (LIGHT)

**Files:**
- Create: `src/components/sequence/chambers/C01_Dispersion.tsx`

Reference prototype: `C:\Projetos\MadLabAurora\projects\elysian-cinematic-prototypes\elysian-chamber-C01.html`

- [ ] **Step 11.1: Write C01_Dispersion.tsx**

```typescript
// src/components/sequence/chambers/C01_Dispersion.tsx
import { useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useChamberWindow } from '../useChamberWindow';

const FRAGMENTS = ['reunião', 'planilha', 'e-mail', 'decisão', 'contexto', 'memória', 'processo'];

function DispersionFragment({ word, index }: { word: string; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 40, damping: 18 });
  const springY = useSpring(y, { stiffness: 40, damping: 18 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      x.set((e.clientX - cx) * 0.04 * (index % 3 === 0 ? 1 : -0.6));
      y.set((e.clientY - cy) * 0.04 * (index % 2 === 0 ? 1 : -0.8));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [index, x, y]);

  const baseLeft = 55 + (index * 37) % 38;
  const baseTop  = 15 + (index * 53) % 65;

  return (
    <motion.span
      className="absolute t-mono text-[13px] pointer-events-none select-none"
      style={{
        left: `${baseLeft}%`,
        top: `${baseTop}%`,
        color: 'var(--ink)',
        opacity: 0.15 + (index * 0.07),
        x: springX,
        y: springY,
      }}
    >
      {word}
    </motion.span>
  );
}

export function C01_Dispersion() {
  const { scale, blur, opacity } = useChamberWindow(0);

  return (
    <div
      className="absolute inset-0 flex items-center"
      style={{
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
        willChange: 'transform, filter, opacity',
        backgroundColor: 'var(--off-white)',
      }}
    >
      {/* Left: editorial headline */}
      <div className="px-[8vw] max-w-[55%] space-y-[34px]">
        <span className="t-mono text-[13px] text-ink/40 block tracking-[0.4em]">
          [ 01 // THE CATEGORY PROBLEM ]
        </span>
        <h2 className="t-display text-[55px] md:text-[89px] text-ink leading-[0.95] tracking-tighter">
          O mercado aprendeu a<br />
          escalar respostas.<br />
          <span className="italic text-moss font-light">Nós construímos controle.</span>
        </h2>
        <p className="t-editorial text-[21px] text-ink/60 max-w-[440px] leading-relaxed">
          Empresas não sofrem por falta de dados.<br />
          Sofrem por <span className="text-ink font-medium">perda de contexto</span>.
        </p>
      </div>

      {/* Right: drifting fragments */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FRAGMENTS.map((word, i) => (
          <DispersionFragment key={word} word={word} index={i} />
        ))}
      </div>

      {/* Halftone grain */}
      <div className="absolute inset-0 pointer-events-none halftone-noise opacity-[0.02]" />
    </div>
  );
}
```

- [ ] **Step 11.2: Compare with approved C01 prototype**

Open `C:\Projetos\MadLabAurora\projects\elysian-cinematic-prototypes\elysian-chamber-C01.html` in a browser side-by-side. Verify: world correct (parchment), fragments present, headline copy matches exactly.

- [ ] **Step 11.3: Commit**

```powershell
git add src/components/sequence/chambers/C01_Dispersion.tsx
git commit -m "feat(chambers): C01 Dispersion — light world, spring fragments"
```

---

### Task 12: Chamber C02 — "Fail Closed" (DARK)

**Files:**
- Create: `src/components/sequence/chambers/C02_FailClosed.tsx`

Reference prototype: `elysian-chamber-C02.html`

- [ ] **Step 12.1: Write C02_FailClosed.tsx**

```typescript
// src/components/sequence/chambers/C02_FailClosed.tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useChamberWindow } from '../useChamberWindow';
import { ForensicCodeCascade } from '../../hero/ForensicCodeCascade';

const HUD_PILLARS = ['fail-closed', 'human approval', 'auditability', 'evaluation gates', 'bounded autonomy'];

function FailGate() {
  const gateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gateRef.current;
    if (!el) return;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 4 });
    tl.to(el.querySelector('.gate-attempt'), {
      x: 60,
      duration: 1.2,
      ease: 'power2.inOut',
    })
    .to(el.querySelector('.gate-lock'), {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'back.out(3)',
    }, '-=0.1')
    .to(el.querySelector('.gate-attempt'), {
      x: 0,
      opacity: 0.3,
      duration: 0.8,
      ease: 'power3.in',
    }, '+=0.5')
    .set(el.querySelector('.gate-attempt'), { opacity: 1 })
    .set(el.querySelector('.gate-lock'), { opacity: 0, scale: 0.8 });
    return () => tl.kill();
  }, []);

  return (
    <div ref={gateRef} className="relative flex items-center gap-4 mt-[55px]">
      <div className="gate-attempt flex items-center gap-2">
        <div className="w-[8px] h-[8px] rounded-full bg-amber/80 animate-pulse" />
        <span className="t-mono text-[11px] text-silver-technical/70">DECISION_CANDIDATE</span>
      </div>
      <div className="w-[1px] h-[34px] bg-silver-technical/20" />
      <div
        className="gate-lock t-mono text-[11px] text-rust px-3 py-1 border border-rust/40 rounded-[2px]"
        style={{ opacity: 0, transform: 'scale(0.8)' }}
      >
        FAIL_CLOSED
      </div>
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
      <ForensicCodeCascade isHovered={isFocused} isFinalState={false} />

      <div className="relative z-20 px-[8vw] max-w-[900px]">
        <span className="t-mono text-[13px] text-silver-technical/50 block tracking-[0.4em] mb-[34px]">
          [ 02 // THE METHOD ]
        </span>

        <h2 className="t-display text-[34px] md:text-[55px] text-white leading-[1.05] tracking-tight mb-[21px]">
          A inteligência não é deixar a IA decidir mais.
          <br />
          <span className="italic text-silver-glimmer/80">
            É definir exatamente o que ela não pode decidir.
          </span>
        </h2>

        <p className="t-mono text-[13px] text-silver-technical/60 max-w-[640px] leading-relaxed normal-case tracking-normal mb-[34px]">
          We study controlled agency: systems that can reason, plan and simulate,
          but cannot mutate production without deterministic gates.
        </p>

        <div className="flex flex-wrap gap-[13px]">
          {HUD_PILLARS.map((p) => (
            <span
              key={p}
              className="t-mono text-[8px] px-3 py-[6px] border border-silver-technical/20 text-silver-technical/50"
            >
              {p}
            </span>
          ))}
        </div>

        <FailGate />
      </div>

      <div className="absolute inset-0 pointer-events-none halftone-noise opacity-[0.02]" />
    </div>
  );
}
```

- [ ] **Step 12.2: Verify C02 copy against spec**

Open `src/components/sequence/chambers/C02_FailClosed.tsx` and confirm:
- PT headline matches exactly: *"A inteligência não é deixar a IA decidir mais. É definir exatamente o que ela não pode decidir."*
- EN body matches exactly: *"We study controlled agency: systems that can reason, plan and simulate, but cannot mutate production without deterministic gates."*
- All 5 HUD pillars present: `fail-closed`, `human approval`, `auditability`, `evaluation gates`, `bounded autonomy`.

- [ ] **Step 12.3: Commit**

```powershell
git add src/components/sequence/chambers/C02_FailClosed.tsx
git commit -m "feat(chambers): C02 FailClosed — dark world, governance gate"
```

---

### Task 13: Chamber C03 — "Governed Factory" (DARK + R3F)

**Files:**
- Create: `src/components/sequence/chambers/C03_GovernedFactory.tsx`
- Create: `src/components/sequence/r3f/FactoryCorridor.tsx`

- [ ] **Step 13.1: Write FactoryCorridor.tsx (R3F scene)**

```typescript
// src/components/sequence/r3f/FactoryCorridor.tsx
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const STAGES = [
  { label: 'CAPTURA',        z: -0   },
  { label: 'ESTRUTURAÇÃO',   z: -4   },
  { label: 'VALIDAÇÃO',      z: -8   },
  { label: 'PERSISTÊNCIA',   z: -12  },
  { label: 'EXECUÇÃO',       z: -16  },
  { label: 'APRENDIZADO',    z: -20  },
];

function StageNode({ label, z }: { label: string; z: number }) {
  return (
    <group position={[0, 0, z]}>
      <mesh>
        <boxGeometry args={[2, 0.8, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" wireframe />
      </mesh>
      <Html center>
        <div className="t-mono text-[10px] text-silver-technical/80 tracking-widest pointer-events-none">
          {label}
        </div>
      </Html>
    </group>
  );
}

function CorridorCamera({ progress }: { progress: number }) {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  useFrame(() => {
    if (!camRef.current) return;
    camRef.current.position.z = THREE.MathUtils.lerp(4, -18, progress);
  });
  return <PerspectiveCamera ref={camRef} makeDefault fov={60} position={[0, 0, 4]} />;
}

interface FactoryCorridorProps {
  progress: number;
}

export function FactoryCorridor({ progress }: FactoryCorridorProps) {
  return (
    <Canvas style={{ width: '100%', height: '100%', background: 'transparent' }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 2, 2]} intensity={0.8} color="#D4AF37" />
      <CorridorCamera progress={progress} />
      {STAGES.map((s) => (
        <StageNode key={s.label} label={s.label} z={s.z} />
      ))}
    </Canvas>
  );
}
```

- [ ] **Step 13.2: Write C03_GovernedFactory.tsx**

```typescript
// src/components/sequence/chambers/C03_GovernedFactory.tsx
import { lazy, Suspense } from 'react';
import { useChamberWindow } from '../useChamberWindow';
import { useCameraProgress } from '../useCameraProgress';

const FactoryCorridor = lazy(() =>
  import('../r3f/FactoryCorridor').then((m) => ({ default: m.FactoryCorridor }))
);

export function C03_GovernedFactory() {
  const { scale, blur, opacity, isFocused } = useChamberWindow(2);
  const { progress } = useCameraProgress();

  // Normalize progress to 0→1 within this chamber's window
  const chamberProgress = Math.max(0, Math.min(1, (progress - 0.4) / 0.2));

  return (
    <div
      className="absolute inset-0"
      style={{
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
        willChange: 'transform, filter, opacity',
        backgroundColor: '#000000',
      }}
    >
      {/* R3F canvas — only mounts when chamber is visible */}
      {opacity > 0.1 && (
        <Suspense fallback={null}>
          <FactoryCorridor progress={chamberProgress} />
        </Suspense>
      )}

      {/* HUD overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end px-[8vw] pb-[8vh] pointer-events-none">
        <span className="t-mono text-[13px] text-silver-technical/50 block tracking-[0.4em] mb-[21px]">
          [ 03 // THE GOVERNED FACTORY ]
        </span>
        <h2 className="t-display text-[34px] md:text-[55px] text-white leading-[1.0] tracking-tight mb-[21px]">
          Álvaro observa, planeja,<br />
          simula e <span className="italic text-gold-sovereign/80">propõe</span>.
        </h2>
        <p className="t-mono text-[11px] text-silver-technical/50 max-w-[480px] normal-case tracking-normal leading-relaxed">
          A produção só muda com gates determinísticos, QA formal e aprovação humana.
        </p>
      </div>

      <div className="absolute inset-0 pointer-events-none halftone-noise opacity-[0.02]" />
    </div>
  );
}
```

- [ ] **Step 13.3: Commit**

```powershell
git add src/components/sequence/chambers/C03_GovernedFactory.tsx src/components/sequence/r3f/FactoryCorridor.tsx
git commit -m "feat(chambers): C03 GovernedFactory — R3F corridor + Alvaro staging"
```

---

### Task 14: Chambers C04 + C05

**Files:**
- Create: `src/components/sequence/chambers/C04_TruthReturned.tsx`
- Create: `src/components/sequence/chambers/C05_Category.tsx`

- [ ] **Step 14.1: Write C04_TruthReturned.tsx**

```typescript
// src/components/sequence/chambers/C04_TruthReturned.tsx
import { useChamberWindow } from '../useChamberWindow';

export function C04_TruthReturned() {
  const { scale, blur, opacity } = useChamberWindow(3);

  return (
    <div
      className="absolute inset-0 flex items-center"
      style={{
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity,
        willChange: 'transform, filter, opacity',
        backgroundColor: 'var(--off-white)',
      }}
    >
      <div className="px-[8vw] max-w-[900px] space-y-[34px]">
        <span className="t-mono text-[13px] text-ink/40 block tracking-[0.4em]">
          [ 04 // TRUTH RETURNED ]
        </span>

        <h2 className="t-display text-[55px] md:text-[89px] text-ink leading-[0.95] tracking-tighter">
          Damos voz<br />
          <span className="italic text-moss">à sua empresa.</span>
        </h2>

        <p className="t-editorial text-[21px] text-ink/70 max-w-[520px] leading-relaxed">
          O produto que não é um CRM. Ele intercepta a informação,
          estrutura, transforma em inteligência aplicada e{' '}
          <span className="text-ink font-medium">devolve o tempo ao gestor</span>.
        </p>

        <p className="t-editorial text-[16px] text-ink/50 max-w-[520px] leading-relaxed">
          Vendemos a verdade — a história da sua empresa preservada.
        </p>
      </div>

      <div className="absolute inset-0 pointer-events-none halftone-noise opacity-[0.02]" />
    </div>
  );
}
```

- [ ] **Step 14.2: Write C05_Category.tsx**

```typescript
// src/components/sequence/chambers/C05_Category.tsx
import { useChamberWindow } from '../useChamberWindow';

export function C05_Category() {
  const { scale, blur, opacity } = useChamberWindow(4);

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
      <div className="px-[8vw] max-w-[900px] space-y-[34px]">
        <span className="t-mono text-[13px] text-silver-technical/40 block tracking-[0.4em]">
          [ 05 // THE CATEGORY ]
        </span>

        <h2 className="t-display text-[55px] md:text-[89px] text-white leading-[0.95] tracking-tighter">
          Memória Operacional<br />
          <span className="italic text-moss-bright">Validada.</span>
        </h2>

        <p className="t-editorial text-[21px] text-white/60 max-w-[520px] leading-relaxed">
          Não somos CRM, copiloto ou plataforma de IA.
          Construímos a infraestrutura que transforma{' '}
          <span className="text-white/90">conhecimento confiável</span>{' '}
          em <span className="text-white/90">execução confiável</span>.
        </p>

        <div className="pt-[34px] border-t border-white/10">
          <p className="t-mono text-[11px] text-silver-technical/40 mb-[21px] normal-case tracking-normal">
            A Aurora impede que conhecimento ruim se transforme em decisão.
          </p>
          <button className="px-8 py-4 bg-moss text-white t-mono text-sm hover:bg-moss/90 transition-all duration-500 rounded-sm uppercase tracking-widest">
            [ REQUEST PARTNERSHIP ]
          </button>
        </div>

        <div className="pt-[34px] flex gap-[21px] t-mono text-[8px] text-silver-technical/20 normal-case tracking-widest">
          <span>ARTIFACT: 2026.Q2.CERT</span>
          <span>//</span>
          <span>STRATEGY: MAD LAB AURORA</span>
          <span>//</span>
          <span>INDUSTRIAL INTELLIGENCE</span>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none halftone-noise opacity-[0.02]" />
    </div>
  );
}
```

- [ ] **Step 14.3: Commit**

```powershell
git add src/components/sequence/chambers/C04_TruthReturned.tsx src/components/sequence/chambers/C05_Category.tsx
git commit -m "feat(chambers): C04 TruthReturned + C05 Category"
```

---

### Task 15: Wire up index.astro

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 15.1: Update index.astro**

Replace the entire `<main>` block in `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import { GazeForensicHero } from '../components/hero/GazeForensicHero';
import { MagneticCursor } from '../components/cursor/MagneticCursor';
import { Header } from '../components/ui/Header';
import { SequenceRig } from '../components/sequence/SequenceRig';
import { C01_Dispersion } from '../components/sequence/chambers/C01_Dispersion';
import { C02_FailClosed } from '../components/sequence/chambers/C02_FailClosed';
import { C03_GovernedFactory } from '../components/sequence/chambers/C03_GovernedFactory';
import { C04_TruthReturned } from '../components/sequence/chambers/C04_TruthReturned';
import { C05_Category } from '../components/sequence/chambers/C05_Category';
---

<Layout title="ElysianCorp | Sovereign Intelligence Architecture">
  <MagneticCursor client:load />
  <Header client:load />

  <main>
    {/* HERO — kept, not touched */}
    <GazeForensicHero client:load />

    {/* CINEMATIC SEQUENCE — one camera, 5 chambers */}
    <SequenceRig client:load>
      <C01_Dispersion />
      <C02_FailClosed />
      <C03_GovernedFactory />
      <C04_TruthReturned />
      <C05_Category />
    </SequenceRig>
  </main>
</Layout>

<style>
  main {
    width: 100%;
  }
</style>
```

- [ ] **Step 15.2: Start dev server and verify no JS errors**

```powershell
npm run dev
```

Open `http://localhost:4321`. Verify in the browser console: no import errors, no missing module errors. The Hero should still render; the SequenceRig spacer should add scroll space below it.

- [ ] **Step 15.3: Commit**

```powershell
git add src/pages/index.astro
git commit -m "feat(index): wire SequenceRig into index.astro, remove old sections"
```

---

### Task 16: Verification — motion regression + performance

**Files:**
- Reference: `scripts/motion-regression-check.js`
- Reference: `scripts/hydration-integrity-check.js`
- Reference: `scripts/visual-performance-harness.js`

- [ ] **Step 16.1: Run hydration integrity check**

```powershell
node scripts/hydration-integrity-check.js
```

Expected: no hydration mismatch warnings.

- [ ] **Step 16.2: Run motion regression check**

```powershell
node scripts/motion-regression-check.js
```

Expected: no motion regressions flagged.

- [ ] **Step 16.3: Manual reduced-motion test**

In Chrome DevTools → Rendering tab → check "Emulate CSS media feature prefers-reduced-motion → reduce". Reload. Verify:
- No pinning — chambers stack vertically as static 100vh sections
- No GSAP animations fire
- R3F does not mount (C03 shows only the HUD overlay)
- Page is fully readable

- [ ] **Step 16.4: Verify 5 AGENTS.md anti-patterns are absent**

Read `AGENTS.md` Gate 1. For each rendered chamber, confirm none of these are present:
- [ ] Simetria linear crua sem quebra de eixo
- [ ] Tipografia de sistema como Voz Display
- [ ] Gradiente neon SaaS
- [ ] Border-radius comercial em cards
- [ ] Motion decorativo sem gravidade
- [ ] Background #000 sem postura narrativa

- [ ] **Step 16.5: Commit verification evidence**

```powershell
git add -A
git commit -m "verify: motion regression + hydration + reduced-motion + anti-pattern gates"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| Hero kept, hero seam (C00) | Hero untouched in T15; seam is CSS/scroll continuity (no code needed) |
| Lenis + remove scroll-smooth | T6 |
| Semantic token aliases | T6 |
| SequenceRig + CameraStage + pin | T9 |
| WorldTone interpolation dark↔light | T8 |
| HudTelemetry diegetic header | T8 |
| useCameraProgress context | T7 |
| useChamberWindow fake-depth | T10 |
| C01 spring fragments | T11 |
| C02 fail-closed gate + exact copy + 5 HUD pillars | T12 |
| C03 R3F FactoryCorridor | T13 |
| C04 light world / truth returned | T14 |
| C05 dark world / category + CTA | T14 |
| Reduced-motion degradation | T9 (SequenceRig), T8 (WorldTone), T16 (verification) |
| Constitutional skills (Agent Forge) | T1–T5 |
| Performance: 1 canvas on-demand | T13 (Suspense + opacity gate) |
| Open decisions (EN-primary, Remotion) | EN-primary applied throughout; Remotion omitted in C04 (lazy add later) |

**Placeholder scan:** no TBDs, no "add error handling later", no "similar to above" — all steps contain full code.

**Type consistency:** `WorldTone`, `CameraProgress`, `useCameraProgress`, `useChamberWindow` — all defined in T7/T10 and consumed identically in T8/T9/T11–T14.

**Gap found and fixed:** `FactoryCorridor` uses `lazy()` with a named export — the `then((m) => ({ default: m.FactoryCorridor }))` pattern in T13 handles this correctly.
