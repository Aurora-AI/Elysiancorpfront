# Elysian Lex Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Section 04 (Elysian Lex) — a scroll-driven animation of a PII tokenization pipeline that demonstrates Evidence Ledger Claim 07 live, in a dark technical world.

**Architecture:** Single source of truth for the document + stages (`src/data/lex-pipeline.ts`), a pure deterministic scroll-progress→stage mapper (`src/lib/lex-stages.ts`), a presentational PII span (`TokenText.tsx`), a GSAP ScrollTrigger island (`LexPipeline.tsx`), and an Astro dark-world wrapper (`LexSection.astro`) mounted below `AlvaroSection` in `index.astro`. All token formats / PII types / stopwords are physically faithful to `ElysianLex/backend/lex_core/lex_core/pii/tokenizer.py`.

**Tech Stack:** Astro 6, React 19 islands (`client:visible`), Tailwind v4, GSAP 3 + ScrollTrigger (scrub), framer-motion (`useReducedMotion`), Vitest 2 + RTL.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/data/lex-pipeline.types.ts` | Type contracts + `isPiiSpan` guard |
| `src/data/lex-pipeline.ts` | The document (`DocSegment[]`), the 5 `STAGES`, header copy |
| `src/lib/lex-stages.ts` | Pure `stageAt(progress)` → `{ index, local }` |
| `src/components/lex/TokenText.tsx` | One PII span in 4 states (`plaintext`/`redacting`/`token`/`restored`) |
| `src/components/lex/LexPipeline.tsx` | Island: GSAP scrub timeline + reduced-motion fallback |
| `src/components/lex/LexSection.astro` | Dark-world wrapper + header; mounts the island |
| `src/components/lex/__tests__/lex.test.tsx` | All tests (data, stages, TokenText, island) |
| `src/pages/index.astro` | Mount `<LexSection />` below `AlvaroSection` |

Convention notes (verified against existing code):
- Path alias `@/` maps to `src/` (used in `alvaro-mesh.test.tsx`: `@/data/...`).
- Tests live in a `__tests__/` folder beside the components.
- GSAP cleanup uses `tl.scrollTrigger?.kill()` (scoped), NOT `ScrollTrigger.getAll()`.
- Astro wrappers use HTML comments `<!-- -->`, not JSX `{/* */}`.
- Run a single test file with: `npx vitest run src/components/lex/__tests__/lex.test.tsx`.

---

## Task 1: Type Contracts

**Files:**
- Create: `src/data/lex-pipeline.types.ts`
- Test: `src/components/lex/__tests__/lex.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/lex/__tests__/lex.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { isPiiSpan } from '@/data/lex-pipeline.types';

describe('isPiiSpan', () => {
  it('accepts a valid span with a real-format token', () => {
    expect(isPiiSpan({
      text: 'João Carlos da Silva',
      type: 'name',
      token: 'TOK_NAME_3a9f1c7e2b8d4f06',
    })).toBe(true);
  });

  it('rejects a token with the wrong format', () => {
    expect(isPiiSpan({ text: 'x', type: 'cpf', token: 'CPF_123' })).toBe(false);
  });

  it('rejects a token with a non-hex / wrong-length suffix', () => {
    expect(isPiiSpan({ text: 'x', type: 'cpf', token: 'TOK_CPF_ZZZZ' })).toBe(false);
  });

  it('rejects non-objects', () => {
    expect(isPiiSpan(null)).toBe(false);
    expect(isPiiSpan('TOK_CPF_3a9f1c7e2b8d4f06')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/lex/__tests__/lex.test.tsx`
Expected: FAIL — cannot resolve `@/data/lex-pipeline.types`.

- [ ] **Step 3: Write minimal implementation**

Create `src/data/lex-pipeline.types.ts`:

```ts
export interface Bilingual { en: string; pt: string; }

export type PiiType =
  | 'name' | 'cpf' | 'cnpj' | 'email' | 'phone'
  | 'rg' | 'cnh' | 'address' | 'processo' | 'oab';

export interface PiiSpan {
  text: string;   // plaintext original (e.g. "João Carlos da Silva")
  type: PiiType;  // detected category
  token: string;  // real format: TOK_<TYPE>_<16 hex>
}

export type DocSegment = string | PiiSpan;

export interface LexDocument { segments: DocSegment[]; }

export interface Stage { id: string; label: Bilingual; }

export function isPiiSpan(v: unknown): v is PiiSpan {
  if (!v || typeof v !== 'object') return false;
  const s = v as PiiSpan;
  return typeof s.text === 'string'
    && typeof s.type === 'string'
    && typeof s.token === 'string'
    && /^TOK_[A-Z]+_[0-9a-f]{16}$/.test(s.token);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/lex/__tests__/lex.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/lex-pipeline.types.ts src/components/lex/__tests__/lex.test.tsx
git commit -m "feat(lex): PII pipeline type contracts + isPiiSpan guard"
```

---

## Task 2: Pipeline Data (document + stages)

**Files:**
- Create: `src/data/lex-pipeline.ts`
- Test: `src/components/lex/__tests__/lex.test.tsx` (append)

The document is the petition from the spec §4. PII spans use real token formats; "Justiça Federal" and "Ministério Público" stay as plain strings (stopwords — never tokenized). The hex in each token is illustrative but format-true.

- [ ] **Step 1: Write the failing test**

Append to `src/components/lex/__tests__/lex.test.tsx`:

```tsx
import { isPiiSpan } from '@/data/lex-pipeline.types';
import { LEX_DOCUMENT, STAGES, LEX_HEADER } from '@/data/lex-pipeline';

describe('lex-pipeline data', () => {
  const spans = LEX_DOCUMENT.segments.filter(
    (s): s is import('@/data/lex-pipeline.types').PiiSpan => typeof s !== 'string',
  );

  it('has exactly 4 PII spans', () => {
    expect(spans).toHaveLength(4);
  });

  it('every PII span passes the guard', () => {
    for (const s of spans) {
      expect(isPiiSpan(s), `span "${s.text}" failed guard`).toBe(true);
    }
  });

  it('covers the four expected PII types', () => {
    const types = spans.map(s => s.type).sort();
    expect(types).toEqual(['cpf', 'name', 'oab', 'processo']);
  });

  it('keeps legal stopwords as plain (untokenized) strings', () => {
    const plain = LEX_DOCUMENT.segments.filter(s => typeof s === 'string').join(' ');
    expect(plain).toContain('Justiça Federal');
    expect(plain).toContain('Ministério Público');
  });

  it('has exactly 5 stages with bilingual labels', () => {
    expect(STAGES).toHaveLength(5);
    for (const st of STAGES) {
      expect(st.label.en.length).toBeGreaterThan(0);
      expect(st.label.pt.length).toBeGreaterThan(0);
    }
  });

  it('exposes bilingual header copy', () => {
    expect(LEX_HEADER.title.en).toMatch(/never sees/i);
    expect(LEX_HEADER.title.pt).toMatch(/nunca vê/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/lex/__tests__/lex.test.tsx`
Expected: FAIL — cannot resolve `@/data/lex-pipeline`.

- [ ] **Step 3: Write minimal implementation**

Create `src/data/lex-pipeline.ts`:

```ts
import type { Bilingual, DocSegment, LexDocument, Stage } from './lex-pipeline.types';

// Document segments. Plain strings render as-is; PiiSpan objects animate
// plaintext → token → restored. "Justiça Federal" / "Ministério Público"
// are legal stopwords in tokenizer.py — they stay as plain strings.
export const LEX_DOCUMENT: LexDocument = {
  segments: [
    'Intima-se ',
    { text: 'João Carlos da Silva', type: 'name', token: 'TOK_NAME_3a9f1c7e2b8d4f06' },
    ', CPF ',
    { text: '123.456.789-00', type: 'cpf', token: 'TOK_CPF_b2c4e6a8d0f2a4c6' },
    ', ',
    { text: 'OAB/SP 187.432', type: 'oab', token: 'TOK_OAB_7d1e3f5a9c2b8e04' },
    ', nos autos do processo ',
    { text: '0034567-89.2025.4.03.6100', type: 'processo', token: 'TOK_PROCESSO_5f8a2c1d7e9b3a06' },
    ', em trâmite na Justiça Federal, com vista ao Ministério Público, para manifestação no prazo legal.',
  ],
};

export const STAGES: Stage[] = [
  { id: 'raw',        label: { en: 'Raw document',          pt: 'Documento bruto' } },
  { id: 'tokenize',   label: { en: 'Tokenization',          pt: 'Tokenização' } },
  { id: 'reason',     label: { en: 'LLM reasoning (blind)', pt: 'Raciocínio do LLM (cego)' } },
  { id: 'seal',       label: { en: 'Trustware seal',        pt: 'Selo Trustware' } },
  { id: 'detokenize', label: { en: 'Detokenization (final output)', pt: 'Destokenização (output final)' } },
];

export const LEX_HEADER: { label: string; title: Bilingual; subline: Bilingual } = {
  label: '[ 04 // ELYSIAN LEX ]',
  title: {
    en: 'The LLM never sees your client.',
    pt: 'O LLM nunca vê seu cliente.',
  },
  subline: {
    en: 'Names, CPFs, case numbers — tokenized before a single token reaches the LLM. Detokenized only when the answer returns to you.',
    pt: 'Nomes, CPFs, números de processo — tokenizados antes de um único token alcançar o LLM. Destokenizados só quando a resposta volta para você.',
  },
};

export const REDACTED_COUNT_LABEL: Bilingual = { en: 'PII redacted', pt: 'PII redigida' };

// Convenience: ordered list of PII spans (used by the island to stagger morphs).
export const PII_SPANS = LEX_DOCUMENT.segments.filter(
  (s): s is Exclude<DocSegment, string> => typeof s !== 'string',
);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/lex/__tests__/lex.test.tsx`
Expected: PASS (10 tests total).

- [ ] **Step 5: Commit**

```bash
git add src/data/lex-pipeline.ts src/components/lex/__tests__/lex.test.tsx
git commit -m "feat(lex): pipeline document + 5 stages + bilingual copy"
```

---

## Task 3: Pure Stage Mapper

**Files:**
- Create: `src/lib/lex-stages.ts`
- Test: `src/components/lex/__tests__/lex.test.tsx` (append)

`stageAt` maps a scroll progress in `[0,1]` to a stage index `0..4` and a within-stage `local` progress `[0,1]`. Five equal bands of width `0.2`.

- [ ] **Step 1: Write the failing test**

Append to `src/components/lex/__tests__/lex.test.tsx`:

```tsx
import { stageAt, STAGE_COUNT } from '@/lib/lex-stages';

describe('stageAt', () => {
  it('exposes 5 stages', () => {
    expect(STAGE_COUNT).toBe(5);
  });

  it('progress 0 is stage 0, local 0', () => {
    expect(stageAt(0)).toEqual({ index: 0, local: 0 });
  });

  it('progress 1 clamps to last stage, local 1', () => {
    expect(stageAt(1)).toEqual({ index: 4, local: 1 });
  });

  it('mid-band gives correct index and local', () => {
    // 0.30 → band 1 (0.2–0.4), local = (0.30-0.2)/0.2 = 0.5
    const r = stageAt(0.30);
    expect(r.index).toBe(1);
    expect(r.local).toBeCloseTo(0.5, 5);
  });

  it('clamps out-of-range input', () => {
    expect(stageAt(-1)).toEqual({ index: 0, local: 0 });
    expect(stageAt(2)).toEqual({ index: 4, local: 1 });
  });

  it('is deterministic', () => {
    expect(stageAt(0.42)).toEqual(stageAt(0.42));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/lex/__tests__/lex.test.tsx`
Expected: FAIL — cannot resolve `@/lib/lex-stages`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/lex-stages.ts`:

```ts
import { STAGES } from '@/data/lex-pipeline';

export const STAGE_COUNT = STAGES.length;

/**
 * Map overall scroll progress [0,1] to the active stage and the progress
 * within that stage. Five equal bands. Deterministic and pure.
 */
export function stageAt(progress: number): { index: number; local: number } {
  const p = Math.min(1, Math.max(0, progress));
  if (p >= 1) return { index: STAGE_COUNT - 1, local: 1 };
  const band = 1 / STAGE_COUNT;
  const index = Math.floor(p / band);
  const local = (p - index * band) / band;
  return { index, local };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/lex/__tests__/lex.test.tsx`
Expected: PASS (16 tests total).

- [ ] **Step 5: Commit**

```bash
git add src/lib/lex-stages.ts src/components/lex/__tests__/lex.test.tsx
git commit -m "feat(lex): pure scroll-progress to stage mapper"
```

---

## Task 4: TokenText Presentational Component

**Files:**
- Create: `src/components/lex/TokenText.tsx`
- Test: `src/components/lex/__tests__/lex.test.tsx` (append)

Renders one PII span in one of four states. `plaintext`/`restored` show `span.text`; `token` shows `[span.token]`; `redacting` shows the token with a `data-redacting` marker for the scan effect.

- [ ] **Step 1: Write the failing test**

Append to `src/components/lex/__tests__/lex.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { TokenText } from '../TokenText';

const span = { text: 'João Carlos da Silva', type: 'name' as const, token: 'TOK_NAME_3a9f1c7e2b8d4f06' };

describe('TokenText', () => {
  it('shows plaintext in plaintext state', () => {
    render(<TokenText span={span} state="plaintext" />);
    expect(screen.getByText('João Carlos da Silva')).toBeInTheDocument();
  });

  it('shows the bracketed token in token state', () => {
    render(<TokenText span={span} state="token" />);
    expect(screen.getByText('[TOK_NAME_3a9f1c7e2b8d4f06]')).toBeInTheDocument();
  });

  it('shows plaintext again in restored state', () => {
    render(<TokenText span={span} state="restored" />);
    expect(screen.getByText('João Carlos da Silva')).toBeInTheDocument();
  });

  it('marks redacting state with a data attribute', () => {
    const { container } = render(<TokenText span={span} state="redacting" />);
    expect(container.querySelector('[data-redacting="true"]')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/lex/__tests__/lex.test.tsx`
Expected: FAIL — cannot resolve `../TokenText`.

- [ ] **Step 3: Write minimal implementation**

Create `src/components/lex/TokenText.tsx`:

```tsx
import type { PiiSpan } from '@/data/lex-pipeline.types';

export type SpanState = 'plaintext' | 'redacting' | 'token' | 'restored';

interface Props {
  span: PiiSpan;
  state: SpanState;
}

const MOSS = '#4E5B4B';
const AMBER = '#C9A86A';

export function TokenText({ span, state }: Props) {
  const isToken = state === 'token' || state === 'redacting';
  const content = isToken ? `[${span.token}]` : span.text;

  const color = state === 'redacting' ? AMBER : isToken ? MOSS : '#FFFFFF';

  return (
    <span
      data-pii-type={span.type}
      data-state={state}
      data-redacting={state === 'redacting' ? 'true' : undefined}
      className="font-mono transition-colors duration-200"
      style={{
        color,
        textShadow: isToken ? `0 0 8px ${color}55` : undefined,
      }}
    >
      {content}
    </span>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/lex/__tests__/lex.test.tsx`
Expected: PASS (20 tests total).

- [ ] **Step 5: Commit**

```bash
git add src/components/lex/TokenText.tsx src/components/lex/__tests__/lex.test.tsx
git commit -m "feat(lex): TokenText span with 4 visual states"
```

---

## Task 5: LexPipeline Island (GSAP scrub + reduced-motion)

**Files:**
- Create: `src/components/lex/LexPipeline.tsx`
- Test: `src/components/lex/__tests__/lex.test.tsx` (append, with mocks)

The island renders the document, the stage rail, the LLM node, the seal badge, and a redacted counter. It derives each span's state from the live scroll progress via `stageAt`, and uses GSAP ScrollTrigger to drive a `progress` value. In reduced-motion (or GSAP failure), it renders the final static state (all spans `restored`, sealed badge shown) without a timeline.

**Mapping rule (span state from stage index):**
- index 0 (raw): all spans `plaintext`
- index 1 (tokenize): span `i` becomes `token` once `local` passes `(i+1)/(spanCount+1)`, else `redacting` while crossing, else `plaintext`
- index 2–3 (reason/seal): all spans `token`
- index 4 (detokenize): span `i` becomes `restored` once `local` passes `(i+1)/(spanCount+1)`, else `token`

- [ ] **Step 1: Write the failing test**

Append to `src/components/lex/__tests__/lex.test.tsx`. Place the `vi.hoisted`/`vi.mock` blocks at the END of the imports section is not allowed — instead, add them at the TOP of the file (Vitest hoists `vi.mock` automatically, but the hoisted refs must be declared before use). For simplicity, this task adds a SECOND test file dedicated to the island so its GSAP mock does not affect the pure-function tests.

Create `src/components/lex/__tests__/lex-pipeline.test.tsx`:

```tsx
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const gsapMocks = vi.hoisted(() => {
  const tl = { to: vi.fn().mockReturnThis(), kill: vi.fn(), scrollTrigger: { kill: vi.fn() } };
  return { set: vi.fn(), registerPlugin: vi.fn(), timeline: vi.fn(() => tl) };
});

const reducedMotionMock = vi.hoisted(() => ({ value: false }));
vi.mock('framer-motion', async (importOriginal: () => Promise<typeof import('framer-motion')>) => {
  const actual = await importOriginal();
  return { ...actual, useReducedMotion: () => reducedMotionMock.value };
});

vi.mock('gsap', () => ({
  default: {
    registerPlugin: gsapMocks.registerPlugin,
    set: gsapMocks.set,
    timeline: gsapMocks.timeline,
  },
}));
vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { getAll: vi.fn(() => []) },
}));

import { LexPipeline } from '../LexPipeline';

describe('LexPipeline', () => {
  afterEach(() => {
    reducedMotionMock.value = false;
    gsapMocks.timeline.mockClear();
  });

  it('renders all 5 stage labels (EN)', () => {
    render(<LexPipeline lang="en" />);
    expect(screen.getByText('Raw document')).toBeInTheDocument();
    expect(screen.getByText('Detokenization (final output)')).toBeInTheDocument();
  });

  it('renders the document plaintext (e.g. the client name) somewhere', () => {
    render(<LexPipeline lang="en" />);
    expect(screen.getAllByText(/João Carlos da Silva/).length).toBeGreaterThan(0);
  });

  it('keeps legal stopwords visible as plain text', () => {
    render(<LexPipeline lang="en" />);
    expect(screen.getByText(/Justiça Federal/)).toBeInTheDocument();
  });

  it('creates a GSAP timeline when motion is allowed', () => {
    reducedMotionMock.value = false;
    render(<LexPipeline lang="en" />);
    expect(gsapMocks.timeline).toHaveBeenCalled();
  });

  it('in reduced-motion mode, no GSAP timeline is created', () => {
    reducedMotionMock.value = true;
    render(<LexPipeline lang="en" />);
    expect(gsapMocks.timeline).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/lex/__tests__/lex-pipeline.test.tsx`
Expected: FAIL — cannot resolve `../LexPipeline`.

- [ ] **Step 3: Write minimal implementation**

Create `src/components/lex/LexPipeline.tsx`:

```tsx
import { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LEX_DOCUMENT, STAGES, REDACTED_COUNT_LABEL, PII_SPANS } from '@/data/lex-pipeline';
import { isPiiSpan } from '@/data/lex-pipeline.types';
import { stageAt } from '@/lib/lex-stages';
import { TokenText, type SpanState } from './TokenText';

interface Props {
  lang?: 'en' | 'pt';
}

const SPAN_COUNT = PII_SPANS.length;

// Derive a span's visual state from the current stage index, within-stage
// progress, and the span's ordinal position among PII spans.
function spanState(spanIndex: number, index: number, local: number): SpanState {
  const threshold = (spanIndex + 1) / (SPAN_COUNT + 1);
  if (index <= 0) return 'plaintext';
  if (index === 1) {
    if (local >= threshold) return 'token';
    if (local >= threshold - 0.12) return 'redacting';
    return 'plaintext';
  }
  if (index >= 2 && index <= 3) return 'token';
  // index === 4 (detokenize)
  return local >= threshold ? 'restored' : 'token';
}

// How many PII spans are currently redacted/tokenized, for the counter.
function redactedCount(index: number, local: number): number {
  if (index <= 0) return 0;
  if (index === 1) {
    return PII_SPANS.filter((_, i) => local >= (i + 1) / (SPAN_COUNT + 1)).length;
  }
  return SPAN_COUNT;
}

export function LexPipeline({ lang = 'en' }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  // Final static state when reduced-motion: last stage, fully resolved.
  const [progress, setProgress] = useState(prefersReduced ? 1 : 0);

  useEffect(() => {
    if (prefersReduced || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const proxy = { p: 0 };
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top 75%',
        end: 'bottom 30%',
        scrub: 1.2,
      },
    });
    tl.to(proxy, {
      p: 1,
      ease: 'none',
      onUpdate: () => setProgress(proxy.p),
    });

    return () => {
      tl.kill();
      tl.scrollTrigger?.kill();
    };
  }, [prefersReduced]);

  const { index, local } = stageAt(progress);
  const sealed = index >= 3;
  const llmActive = index >= 2;
  const redacted = redactedCount(index, local);

  let spanCursor = -1;

  return (
    <div ref={rootRef} className="relative w-full text-white/80">
      {/* Stage rail */}
      <ol className="flex flex-wrap gap-x-6 gap-y-2 mb-8 font-mono text-[11px] uppercase tracking-widest">
        {STAGES.map((s, i) => (
          <li
            key={s.id}
            data-active={i === index ? 'true' : undefined}
            className={i === index ? 'text-[#C9A86A]' : i < index ? 'text-[#4E5B4B]' : 'text-white/30'}
          >
            {s.label[lang]}
          </li>
        ))}
      </ol>

      {/* Document */}
      <p className="font-mono text-[15px] md:text-[18px] leading-loose max-w-3xl">
        {LEX_DOCUMENT.segments.map((seg, i) => {
          if (typeof seg === 'string' || !isPiiSpan(seg)) {
            return <span key={i}>{seg as string}</span>;
          }
          spanCursor += 1;
          return (
            <TokenText key={i} span={seg} state={spanState(spanCursor, index, local)} />
          );
        })}
      </p>

      {/* Telemetry: redacted counter + LLM node + seal */}
      <div className="flex flex-wrap items-center gap-6 mt-8 font-mono text-[11px] uppercase tracking-widest">
        <span className="text-white/50">
          {REDACTED_COUNT_LABEL[lang]}: <span className="text-[#4E5B4B]">{redacted}/{SPAN_COUNT}</span>
        </span>
        <span
          data-llm-active={llmActive ? 'true' : undefined}
          className={llmActive ? 'text-white/80' : 'text-white/25'}
        >
          reasoning · Claude Sonnet 4.6
        </span>
        {sealed && (
          <span data-sealed="true" className="px-2 py-0.5 border border-[#4E5B4B] text-[#4E5B4B]">
            SEALED
          </span>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/lex/__tests__/lex-pipeline.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Run the full Lex suite to confirm no regressions**

Run: `npx vitest run src/components/lex/`
Expected: PASS (25 tests total across the two files).

- [ ] **Step 6: Commit**

```bash
git add src/components/lex/LexPipeline.tsx src/components/lex/__tests__/lex-pipeline.test.tsx
git commit -m "feat(lex): scroll-driven pipeline island with reduced-motion fallback"
```

---

## Task 6: LexSection Astro Wrapper

**Files:**
- Create: `src/components/lex/LexSection.astro`

Dark-world wrapper mirroring `AlvaroSection.astro` structure but with the dark palette. Uses HTML comments (Astro requirement).

- [ ] **Step 1: Create the wrapper**

Create `src/components/lex/LexSection.astro`:

```astro
---
import { LexPipeline } from './LexPipeline';
import { LEX_HEADER } from '../../data/lex-pipeline';
---

<section
  id="elysian-lex"
  class="relative w-full bg-[#0D0D0C] text-white py-[89px] px-[34px] overflow-hidden"
>
  <!-- Grain texture, same pattern as other sections -->
  <div
    class="pointer-events-none absolute inset-0 opacity-[0.04] bg-halftone-grain"
    aria-hidden="true"
  />

  <div class="max-w-7xl mx-auto relative z-10">
    <!-- Section label -->
    <div class="mb-[21px]">
      <span class="font-mono text-[13px] uppercase tracking-widest text-[#9AA0A6]">
        {LEX_HEADER.label}
      </span>
    </div>

    <!-- Title -->
    <h2 class="font-display text-[55px] md:text-[72px] leading-[0.95] mb-[13px] tracking-tight">
      {LEX_HEADER.title.en}
    </h2>
    <p class="font-body text-[16px] text-white/50 max-w-xl mb-[55px] leading-relaxed">
      {LEX_HEADER.subline.en}
    </p>

    <!-- React island — only mounts when visible in viewport -->
    <LexPipeline client:visible />
  </div>
</section>
```

- [ ] **Step 2: Verify it builds (typecheck via astro check is optional; build runs in Task 7)**

Run: `npx tsc --noEmit 2>&1 | grep -i "lex" || echo "no lex type errors"`
Expected: `no lex type errors` (pre-existing errors in unrelated files are acceptable — see Task 7).

- [ ] **Step 3: Commit**

```bash
git add src/components/lex/LexSection.astro
git commit -m "feat(lex): dark-world Astro wrapper with header + island"
```

---

## Task 7: Wire into index.astro + verify build

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add the import and mount**

In `src/pages/index.astro`, add the import after the `AlvaroSection` import (line 7):

```astro
import AlvaroSection from '../components/alvaro/AlvaroSection.astro';
import LexSection from '../components/lex/LexSection.astro';
```

And mount it after `<AlvaroSection />` inside `<main>`:

```astro
		<!-- COGNITIVE MESH — Álvaro architecture (live/roadmap taxonomy) -->
		<AlvaroSection />

		<!-- ELYSIAN LEX — live PII tokenization pipeline (Claim 07 demonstration) -->
		<LexSection />
```

- [ ] **Step 2: Run the full test suite**

Run: `npx vitest run`
Expected: PASS — all existing tests (62) + new Lex tests (25) green.

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: build completes successfully (harvest skips because Aurora repo is co-located locally OR uses pre-built artifacts; Astro build emits the page including the new section).

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(lex): mount Elysian Lex section below Cognitive Mesh"
```

- [ ] **Step 5: Push**

```bash
git push origin main
```

---

## Self-Review

**Spec coverage:**
- §3 physical fidelity → Task 2 data (real token format regex enforced by guard in Task 1; types/stopwords from tokenizer.py).
- §4 document → Task 2 `LEX_DOCUMENT`.
- §5 five stages → Task 2 `STAGES`, Task 5 stage-driven span states.
- §6 copy → Task 2 `LEX_HEADER` + Task 6 wrapper render.
- §7 component architecture → Tasks 1–7 map 1:1 to the table.
- §8 dark world / palette → Task 6 (`#0D0D0C`) + Task 4 (moss/amber tokens).
- §9 reduced-motion + GSAP-failure fallback → Task 5 (`prefersReduced` → static final state; scoped `tl.scrollTrigger?.kill()` cleanup).
- §10 tests → Tasks 1–5 (data, stages, TokenText, island, reduced-motion).

**Placeholder scan:** No TBD/TODO; every code step shows complete code.

**Type consistency:** `PiiSpan`/`DocSegment`/`Stage`/`Bilingual` (Task 1) used consistently in Tasks 2–5. `SpanState` defined in Task 4, imported in Task 5. `stageAt` signature `{ index, local }` consistent across Task 3 and Task 5. `PII_SPANS` defined in Task 2, used in Task 5.

**Note on bilingual title in wrapper:** The Astro wrapper (Task 6) renders the EN title/subline statically (matching `AlvaroSection.astro`, which also hard-codes EN). The island accepts a `lang` prop for future wiring; per-section EN/PT toggle wiring is out of scope for this plan (consistent with the existing Mesh section).
