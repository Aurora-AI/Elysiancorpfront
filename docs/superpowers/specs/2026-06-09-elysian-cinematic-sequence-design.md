# Elysian Cinematic Sequence — Design Spec

**Date:** 2026-06-09
**Status:** Approved (design); pending implementation plan
**Scope:** Rebuild everything below the Hero as a single cinematic "Plano-Sequência / One-Shot" camera experience. The Hero is KEPT.

---

## 1. Purpose & Audience

This page exists to **generate authority to apply for incentive programs (Anthropic, Google, and similar)**. It is NOT a sales-conversion page.

- **Audience:** technical grant/program reviewers.
- **Positioning to land:** *builders of a new category* — "Validated Operational Memory" / "Governed Evolution".
- **Protagonist:** **Álvaro** — the meta-agent *over everything*: over the factory (Ozzmosis), over the other agents, over the products. The page's center of gravity is the **care, determinism, and ethics** of how Álvaro is built. The central tension is **against what the Brazilian market chases** (autonomous agents / output without governance).
- Product verticals matter but are **supporting proof, not the climax**.

### Entity model (background truth)
- **Aurora** — internal name; the thesis/dream: *Infraestrutura de Memória Operacional Validada*.
- **Álvaro** — internal name; the protagonist meta-agent / methodology face.
- **Elysian** — the commercial brand sold publicly.
- **"CRM"** — the product, but not really a CRM: it intercepts company information → structures it → turns it into applied intelligence → gives managers their time back. "Damos voz à sua empresa. Vendemos a verdade — a história da sua empresa preservada."

> **Public-copy rule:** never reference Anthropic or "safety alignment" explicitly — it reads as opportunistic signaling. Let the safety/evaluation themes (fail-closed, gates, human approval) speak for themselves.

---

## 2. Design Framework — The 5 Pillars

1. **Camera, not scrollbar** — scroll moves a camera forward on the Z axis; scroll = timeline of a traversal.
2. **Câmaras de contenção (100vh absolute)** — no half-scrolled sections; the camera pins and locks each chamber at center.
3. **Diegetic UI** — buttons/cards/text react to the environment (refraction, HUD visors), not HTML pasted over video.
4. **Lighting as narrative** — DARK world = MAD LAB cyber-industrial (the governed machine / Álvaro); LIGHT world = LEX luxury (the human / truth returned). Tone toggled by scroll.
5. **Organic spring physics** — spring/bouncy motion and cursor-velocity reactions, never the generic fade-in-from-bottom.

---

## 3. System Architecture

A single island, `SequenceRig` (`client:load`), replaces the seven loose `client:visible` islands in `src/pages/index.astro`.

```
<SequenceRig>                              ← 1 master ScrollTrigger, global pin
  ├─ <CameraStage>  position:fixed, 100vh, overflow:hidden   ← the "viewfinder"
  │    └─ chambers travel here (translateZ/scale/opacity by progress)
  ├─ <WorldTone>    bg + base-text color interpolated dark↔light by scroll
  ├─ <HudTelemetry> diegetic header; label updates per active chamber
  └─ <ScrollSpacer> height = N×100vh   ← generates scroll travel
```

### Camera mechanic (approved: hybrid pinned-2D + pontual R3F)
- **Lenis** provides inertia. Remove CSS `scroll-smooth` from `src/layouts/Layout.astro`; wire `lenis.on('scroll', ScrollTrigger.update)` and drive Lenis from GSAP's ticker.
- The master ScrollTrigger **pins** `CameraStage` and maps `progress 0→1` into per-chamber windows `[enter, focus, exit]`.
- **Fake-depth:** a chamber enters from `scale 1.15 + blur + far translateZ`, locks at focus (`scale 1`, sharp), and exits receding/blurring. This is the "Z-axis camera" without WebGL cost.
- **Snap:** ScrollTrigger snap so each chamber locks at center (Pillar 2).

### The two worlds (Pillar 4)
- `WorldTone` interpolates `background-color` and base text color by `progress`, reusing the `expo.inOut` easing the Hero already uses for the parchment turn.
- DARK = `#000000` + silver/mono/gold. LIGHT = `#F8F7F3` + serif/moss.

### Diegetic header
The Hero's `[ PROTOCOL: TRUSTWARE ]` becomes a persistent HUD that updates its label per active chamber (e.g. `[ STAGE: GOVERNANCE ]`). The camera has telemetry.

### Degradation (quality gate — non-negotiable)
Under `prefers-reduced-motion`: `SequenceRig` disables the pin and renders chambers as normal stacked 100vh sections; R3F becomes a static image. Hook already exists in `src/lib/animations.ts` (`getAnimationDefaults`).

---

## 4. The Chambers (narrative → world/density → staging)

Continuity law: the Hero ends in parchment with "ELYSIAN"; chamber 01 is born in parchment. Density EQ across the page: `Hero(high→med) → 01 low → 02 med/high → 03 high → 04 low/med → 05 high`. Never two highs adjacent, except the deliberate 02→03 crescendo (immersion into the machine is one rising movement).

### Câmara 00 — Hero seam (not a chamber)
The camera does not cut. It begins to recede from the "ELYSIAN" wordmark; the Hero subtitle ("O mercado aprendeu a escalar respostas. Nós construímos controle.") slides up and becomes the title of Chamber 01. Pure directional continuity.

### Câmara 01 — "The Category Problem" · LIGHT · density LOW
- **Message:** the market optimized for *output*; nobody governs operational *truth*. The Brazilian market chases autonomy; we chose control. A company's knowledge exists but leaks across meetings, spreadsheets, email, people's heads. *(from the Aurora thesis: "empresas não sofrem por falta de dados, sofrem por perda de contexto")*
- **Staging:** wide parchment, near-silence. A massive editorial (serif) sentence at left. At right, shards of "dispersed knowledge" — small text fragments (`reunião`, `planilha`, `e-mail`) drifting with spring physics, never connecting. Cursor generates ripple/wind on them (Pillar 5).
- **Function:** decompression + plant the pain.

### Câmara 02 — "The Method: Fail Closed" · DARK · density MED/HIGH · **MOST IMPORTANT for technical grant**
- **Locked copy:**
  - Headline (PT): *"A inteligência não é deixar a IA decidir mais. É definir exatamente o que ela não pode decidir."*
  - Sub (EN): *"We study controlled agency: systems that can reason, plan and simulate, but cannot mutate production without deterministic gates."*
  - HUD pillars: `fail-closed` · `human approval` · `auditability` · `evaluation gates` · `bounded autonomy`
- **Staging:** the camera plunges into black (the dramatic world toggle). Monospace, technical silver, `ForensicCodeCascade` reused. A central diegetic "gate" attempts to pass a decision and **locks** (`FAIL_CLOSED`) with a seal.
- **Constraint:** no explicit Anthropic/safety-brand references; themes speak for themselves.

### Câmara 03 — "The Governed Factory" · DARK (deeper) · density HIGH · **hero R3F moment**
- **Message:** Álvaro *over the factory*. The canonical lifecycle: `Captura → Estruturação → Validação → Persistência → Execução → Aprendizado`. He observes, plans, simulates, proposes — but cannot mutate production without gates. This is where the *care of construction* is the argument.
- **Staging:** the ONLY real 3D moment (R3F, `FactoryCorridor`). The camera travels a corridor/conveyor where each stage is a lit station passing through the lens — HTML-in-canvas (`drei/Html`) with real refraction (Pillar 3 at its peak). "Piloting the camera inside the infrastructure," literal.
- **Function:** proof of engineering rigor; density peak.

### Câmara 04 — "Truth Returned" · LIGHT (light bursts in) · density LOW/MED
- **Message:** the product that is **not a CRM**. It intercepts information, structures it, turns it into applied intelligence, and **gives the manager's time back**. "Damos voz à sua empresa." Verticals (Lex, the "CRM") appear here as supporting proof, lighter weight than 02–03.
- **Staging:** the camera bursts into light after the technical plunge — organic relief, luxury serif, soft shadows, moss. The contrast with 03 is the argument: the dark machine exists *for* this luminous human result. Optional Remotion island (`MotionViewer`) as living proof.
- **Function:** humanize; close the problem→solution loop.

### Câmara 05 — "The Category" · DARK (close) · density HIGH
- **Message:** the declaration — not CRM/copilot/AI platform, but **Validated Operational Memory / Governed Evolution. A new category.** Constitutional phrase + authority CTA (partnership/conversation, aligned to the grant goal — not "buy").
- **Staging:** forensic boot-down; the camera recedes to the absolute black where it all began, closing the one-shot in a circle. Final metadata (`ARTIFACT`, Álvaro's real maturity table as a credibility seal).

---

## 5. Components, Data Flow & Files

New file tree (replaces the seven loose islands):

```
src/components/sequence/
  SequenceRig.tsx        ← single client:load island; master ScrollTrigger + Lenis + pin
  CameraStage.tsx        ← fixed 100vh viewfinder; applies scale/blur/translateZ by progress
  WorldTone.tsx          ← interpolates bg/text dark↔light by progress
  HudTelemetry.tsx       ← diegetic header; swaps label per active chamber
  useCameraProgress.ts   ← hook/context: { progress, activeChamber, worldTone }
  chambers/
    C01_Dispersion.tsx
    C02_FailClosed.tsx
    C03_GovernedFactory.tsx
    C04_TruthReturned.tsx
    C05_Category.tsx
  r3f/
    FactoryCorridor.tsx  ← isolated R3F scene (client:only="react"), lazy
```

### Data flow
- `SequenceRig` owns the master ScrollTrigger and publishes `progress (0→1)` via a light context (`useCameraProgress`). No prop drilling — each chamber subscribes and computes its own `[enter, focus, exit]` window.
- `worldTone` derives from `activeChamber` (static chamber→world map). `WorldTone` and `HudTelemetry` react to it.
- R3F (`FactoryCorridor`) mounts only while Chamber 03 is active and unmounts on exit → **one canvas, on demand, never resident**.

### Reuse (keep what's good)
- Reused: `ForensicCodeCascade`, `MagneticCursor`, `IndustrialGrid`, tokens (`tokens.css`), `getAnimationDefaults`.
- The old seven sections (`IntegrityGap`, etc.) stay in the repo but are removed from `index.astro` — dead code until the rebuild is validated, then deleted.

### Performance budget (gate)
- Max 1 `<canvas>` R3F, on demand. `will-change` only on active elements. Heavy `public/assets` textures lazy/preload-selective. Lenis + ScrollTrigger is the single scroll source (no competing libs).
- Target: 60fps desktop; mobile degrades R3F to an animated 2D fallback (no WebGL on weak mobile).

### Accessibility
`prefers-reduced-motion` → pin off, chambers become static stacked 100vh sections, R3F becomes a static image.

---

## 6. Open Decisions (do not block design)

1. **Language:** grant reviewers are anglophone. **Recommendation: EN-primary**, technical terms in EN (Chamber 02 already is), optional PT toggle (Hero already supports `lang`).
2. **Remotion in Chamber 04:** keep the `MotionViewer` island as living proof, or cut it to reduce weight. **Recommendation: keep, lazy-loaded.**

---

## 7. Out of Scope

- No backend/API changes (`src/pages/api/chat.ts` untouched).
- No new content/copy beyond the chambers above; final long-form copy is an implementation concern.
- No rework of the Hero itself.
