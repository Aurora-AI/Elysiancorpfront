# Evidence Ledger Console — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the cinematic `SequenceRigFull` section below the hero with an interactive, evidence-backed "Evidence Ledger" console whose every claim links to a real, sanitized artifact harvested from the Aurora factory repo.

**Architecture:** A human-authored bilingual claim manifest (`evidence.ts`) feeds a local dev-time `harvest-evidence` tool that verifies each claim's source file exists in the sibling Aurora repo, computes its git commit + sha256, extracts a sanitized excerpt, runs a fail-closed secret scan, and emits committed assets (`public/evidence/*`) + a provenance JSON. A React island (`EvidenceConsole`) renders the prototype's Sovereign-Black grid + an accessible provenance modal. The site ships only the committed, self-contained evidence — Vercel never needs the Aurora repo.

**Tech Stack:** Astro v6 (static) · React 19 islands · Tailwind v4 (`@theme` in `globals.css`) · Vitest + @testing-library/react (added by this plan) · Node ≥22 ESM scripts · Remotion (video, separate follow-up plan).

**Reference design (canonical):** Stitch export "Forense Evidence Ledger" (see spec §12). **Spec:** `docs/superpowers/specs/2026-06-14-forensic-proof-console-design.md`.

**Path facts (verified):**
- ElysianCorp site repo: `C:/Projetos/MadLabAurora/ElysianCorp` (this repo).
- Aurora factory repo: `C:/Projetos/Aurora` — a **sibling**, reached as `../../Aurora` from this repo. Harvest reads it via env `AURORA_REPO_ROOT` (default `../../Aurora`).
- Suggested feature branch: `feat/evidence-ledger-console`.

---

## File Structure

| File | Responsibility | Created/Modified |
|---|---|---|
| `src/data/evidence.types.ts` | TS contracts (Bilingual, Claim, Provenance…) | Create |
| `src/data/evidence.ts` | Authored bilingual claim manifest (6 primary + 1 secondary + products). Source of truth for copy + source anchors. No provenance. | Create |
| `src/data/evidence.provenance.json` | **Generated** by harvest: per-claim provenance + asset path. | Create (generated) |
| `public/evidence/*` | **Generated** sanitized excerpts/images shipped to Vercel. | Create (generated) |
| `scripts/lib/harvest-core.mjs` | Pure, testable functions: `resolveSource`, `scanSecrets`, `extractExcerpt`, `sanitize`. | Create |
| `scripts/harvest-evidence.mjs` | Runner: iterate claims, verify, emit assets + provenance, fail-closed. | Create |
| `src/components/proof/ClaimCard.tsx` | One presentational claim card (bilingual, status badge, hover-invert). | Create |
| `src/components/proof/EvidenceModal.tsx` | Accessible `<dialog>`-style modal: excerpt + provenance. Focus-trap, ESC. | Create |
| `src/components/proof/EvidenceConsole.tsx` | React island: grid, language toggle, reduced-motion, modal state. | Create |
| `src/components/proof/ProofSection.astro` | Section wrapper (label + headline + island). | Create |
| `src/pages/index.astro` | Mount `ProofSection`, unmount `SequenceRigFull`. | Modify |
| `src/styles/globals.css` | Add `@theme` tokens for prototype vocabulary + `.bg-halftone-grain`. | Modify |
| `vitest.config.ts`, `vitest.setup.ts` | Test runner config. | Create |
| `package.json` | Add test + harvest scripts and dev deps. | Modify |

---

## Task 1: Test tooling (Vitest + Testing Library)

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`, `vitest.setup.ts`, `src/data/__tests__/smoke.test.ts`

- [ ] **Step 1: Install dev dependencies**

Run:
```bash
npm i -D vitest@^2 @testing-library/react@^16 @testing-library/jest-dom@^6 jsdom@^25
```
Expected: packages added to `devDependencies`.

- [ ] **Step 2: Add scripts to `package.json`**

In the `"scripts"` block add:
```json
"test": "vitest run",
"test:watch": "vitest",
"harvest:evidence": "node scripts/harvest-evidence.mjs",
"prebuild": "node scripts/harvest-evidence.mjs"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.mjs'],
  },
  resolve: { alias: { '@': path.resolve('./src') } },
});
```

- [ ] **Step 4: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: Write smoke test** — `src/data/__tests__/smoke.test.ts`

```ts
import { describe, it, expect } from 'vitest';

describe('test harness', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run it**

Run: `npm test`
Expected: PASS (1 passed).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts src/data/__tests__/smoke.test.ts
git commit -m "test: add vitest + testing-library harness"
```

---

## Task 2: Tailwind `@theme` tokens for the prototype vocabulary

The prototype uses class names (`bg-sovereign-bg`, `text-display-lg`, `p-fib-34`…) not present in the current `@theme`. Tailwind v4 generates utilities from `@theme` CSS variables. Add only what's missing; reuse existing where identical.

**Files:**
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Add tokens inside the existing `@theme { … }` block** (append before its closing `}`)

```css
  /* ── Evidence Ledger vocabulary (prototype Stitch) ───────────────── */
  --color-sovereign-bg: #000000;
  --color-sovereign-ink: #F2F2F2;
  --color-parchment-bg: #F8F7F3;
  --color-parchment-ink: #1A1A17;
  --color-elysian-moss-light: #4E5B4B;
  --color-elysian-moss-dark: #6B7A66;

  /* Fibonacci spacing (px) */
  --spacing-fib-1: 1px;  --spacing-fib-2: 2px;  --spacing-fib-3: 3px;
  --spacing-fib-5: 5px;  --spacing-fib-8: 8px;  --spacing-fib-13: 13px;
  --spacing-fib-21: 21px; --spacing-fib-34: 34px; --spacing-fib-55: 55px;
  --spacing-fib-89: 89px;

  /* Named font sizes */
  --text-technical-sm: 13px;
  --text-technical-sm--line-height: 120%;
  --text-technical-sm--letter-spacing: 0.05em;
  --text-body-md: 16px;
  --text-body-md--line-height: 150%;
  --text-body-lg: 18px;
  --text-body-lg--line-height: 160%;
  --text-headline-md: 34px;
  --text-headline-md--line-height: 110%;
  --text-display-lg: 55px;
  --text-display-lg--line-height: 100%;
  --text-display-lg--letter-spacing: -0.02em;
  --text-legal-xs: 12px;
  --text-legal-xs--line-height: 140%;

  /* Font-family utilities reused by prototype names */
  --font-display-xl: 'Instrument Serif', serif;
  --font-display-lg: 'Instrument Serif', serif;
  --font-headline-md: 'Instrument Serif', serif;
  --font-body-lg: 'Public Sans', sans-serif;
  --font-body-md: 'Public Sans', sans-serif;
  --font-technical-sm: 'JetBrains Mono', monospace;
  --font-legal-xs: 'Crimson Pro', serif;
```

- [ ] **Step 2: Add the halftone grain utility** (after the `@theme` block, anywhere in `globals.css`)

```css
/* ── Evidence Ledger: halftone grain texture ───────────────────────── */
.bg-halftone-grain { position: relative; }
.bg-halftone-grain::before {
  content: "";
  position: absolute; inset: 0;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%25" height="100%25" filter="url(%23n)"/></svg>');
  opacity: 0.02; pointer-events: none; z-index: 10;
}
```

- [ ] **Step 3: Verify the dev build compiles the new utilities**

Run: `npm run dev` (let it boot, then Ctrl-C)
Expected: no Tailwind/CSS errors in console.

- [ ] **Step 4: Commit**

```bash
git add src/styles/globals.css
git commit -m "style: add Evidence Ledger @theme tokens + halftone grain"
```

---

## Task 3: Evidence type contracts

**Files:**
- Create: `src/data/evidence.types.ts`
- Test: `src/data/__tests__/evidence.types.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import type { Claim } from '../evidence.types';
import { isClaim } from '../evidence.types';

describe('isClaim', () => {
  it('accepts a well-formed claim', () => {
    const c: Claim = {
      id: 'x', index: '01', tier: 'primary', colSpan: 5, status: 'OK',
      title: { en: 'E', pt: 'P' },
      source: { path: 'a/b.py', label: 'lib/x' },
    };
    expect(isClaim(c)).toBe(true);
  });
  it('rejects missing bilingual title', () => {
    expect(isClaim({ id: 'x', index: '01', tier: 'primary', colSpan: 5, status: 'OK', source: { path: 'a', label: 'b' } } as unknown)).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- evidence.types`
Expected: FAIL ("Cannot find module '../evidence.types'").

- [ ] **Step 3: Implement `src/data/evidence.types.ts`**

```ts
export type ClaimStatus = 'OK' | 'INFO';
export type EvidenceKind = 'code' | 'report' | 'image';

export interface Bilingual { en: string; pt: string; }

/** Authored input: where the proof lives in the Aurora repo. */
export interface ClaimSource {
  /** repo-relative path from AURORA_REPO_ROOT */
  path: string;
  /** optional [startLine, endLine] (1-based, inclusive) excerpt window */
  lines?: [number, number];
  /** short badge label, e.g. "lib/trustware" */
  label: string;
}

/** Generated by harvest. */
export interface Provenance {
  sourcePath: string;
  sha256: string;
  commit: string;     // short SHA
  timestamp: string;  // ISO; last-commit date of the file
  asset: string;      // path under /evidence/*
  kind: EvidenceKind;
}

export interface Claim {
  id: string;
  index: string;            // "01".."06"
  title: Bilingual;
  status: ClaimStatus;
  tier: 'primary' | 'secondary';
  colSpan: number;          // md grid span: 5,7,4,8,6,6
  source: ClaimSource;
  caption?: Bilingual;      // "what this proves"
}

export function isBilingual(v: unknown): v is Bilingual {
  return !!v && typeof v === 'object'
    && typeof (v as Bilingual).en === 'string'
    && typeof (v as Bilingual).pt === 'string';
}

export function isClaim(v: unknown): v is Claim {
  if (!v || typeof v !== 'object') return false;
  const c = v as Claim;
  return typeof c.id === 'string'
    && typeof c.index === 'string'
    && (c.tier === 'primary' || c.tier === 'secondary')
    && typeof c.colSpan === 'number'
    && (c.status === 'OK' || c.status === 'INFO')
    && isBilingual(c.title)
    && !!c.source && typeof c.source.path === 'string' && typeof c.source.label === 'string';
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- evidence.types`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/evidence.types.ts src/data/__tests__/evidence.types.test.ts
git commit -m "feat: evidence type contracts"
```

---

## Task 4: Authored claim manifest (`evidence.ts`)

Uses the **verified** real anchors (spec §13). Bilingual EN-primary. Provenance is NOT authored here — harvest fills it.

**Files:**
- Create: `src/data/evidence.ts`
- Test: `src/data/__tests__/evidence.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { CLAIMS, PRODUCTS } from '../evidence';
import { isClaim } from '../evidence.types';

describe('evidence manifest', () => {
  it('has 6 primary + 1 secondary claim, all valid', () => {
    expect(CLAIMS.every(isClaim)).toBe(true);
    expect(CLAIMS.filter(c => c.tier === 'primary')).toHaveLength(6);
    expect(CLAIMS.filter(c => c.tier === 'secondary')).toHaveLength(1);
  });
  it('uses unique ids and indices', () => {
    expect(new Set(CLAIMS.map(c => c.id)).size).toBe(CLAIMS.length);
  });
  it('lists 3 real products incl. the agentic mesh', () => {
    expect(PRODUCTS.map(p => p.id)).toEqual(['crm-aurora', 'elysian-lex', 'alvaro-mesh']);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- evidence.test`
Expected: FAIL ("Cannot find module '../evidence'").

- [ ] **Step 3: Implement `src/data/evidence.ts`**

```ts
import type { Claim, Bilingual } from './evidence.types';

export interface Product { id: string; label: string; beta?: boolean; }

export const HEADER: { label: string; title: Bilingual } = {
  label: '[ 02 // THE EVIDENCE LEDGER ]',
  title: {
    en: "We Don't Ask for Trust. We Show the Trace.",
    pt: 'Não pedimos confiança. Mostramos o rastro.',
  },
};

export const CLAIMS: Claim[] = [
  {
    id: 'deterministic-gate', index: '01', tier: 'primary', colSpan: 5, status: 'OK',
    title: {
      en: 'No critical state mutation without a non-LLM deterministic gate.',
      pt: 'Nenhuma mutação de estado crítico sem gate determinístico não-LLM.',
    },
    source: { path: 'CRM/libs/trustware', label: 'lib/trustware' },
    caption: { en: 'The guardrail runs outside the model.', pt: 'O guardrail roda fora do modelo.' },
  },
  {
    id: 'human-approval', index: '02', tier: 'primary', colSpan: 7, status: 'INFO',
    title: {
      en: 'Production promotion requires explicit human approval.',
      pt: 'Promoção à produção exige aprovação humana explícita.',
    },
    source: {
      path: 'AuroraOS/factory/frontend_synthesis/run_os019_m3_rendered_candidate_gate.py',
      label: 'HumanPromotionGate',
    },
    caption: { en: 'Human-in-the-loop, by construction.', pt: 'Human-in-the-loop, por construção.' },
  },
  {
    id: 'persisted-evidence', index: '03', tier: 'primary', colSpan: 4, status: 'OK',
    title: {
      en: 'No action concludes without persisted, traceable evidence.',
      pt: 'Nenhuma ação encerra sem evidência persistida e rastreável.',
    },
    source: {
      path: 'AuroraOS/factory/frontend_synthesis/output_synthesis/OS-019/M3_QA_REVIEW.md',
      label: 'QA_REVIEW',
    },
    caption: { en: 'Total auditability.', pt: 'Auditabilidade total.' },
  },
  {
    id: 'adversarial-qa', index: '04', tier: 'primary', colSpan: 8, status: 'OK',
    title: {
      en: 'Every delivery undergoes formal adversarial QA before closing.',
      pt: 'Toda entrega passa por QA formal adversarial antes de fechar.',
    },
    source: {
      path: 'AuroraOS/factory/frontend_synthesis/output_synthesis/OS-019/M4.1_QA_REVIEW.md',
      label: 'skill/qa-review',
    },
    caption: { en: 'Independent verification.', pt: 'Verificação independente.' },
  },
  {
    id: 'readonly-observability', index: '05', tier: 'primary', colSpan: 6, status: 'INFO',
    title: {
      en: 'The factory is observable read-only — no write, replay, or auto-repair.',
      pt: 'A fábrica é observável read-only — sem escrita, replay ou auto-reparo.',
    },
    source: {
      path: 'Ozzmosis/apps/aurora-observability-mcp-gateway/src/aurora/observability_mcp_gateway/server.py',
      label: 'observability gateway',
    },
    caption: { en: 'Oversight with bounded power.', pt: 'Oversight com poder limitado.' },
  },
  {
    id: 'micro-steps', index: '06', tier: 'primary', colSpan: 6, status: 'OK',
    title: {
      en: 'Micro-step execution with limited blast radius and a mandatory stop.',
      pt: 'Execução em micro-etapas com blast radius limitado e parada obrigatória.',
    },
    source: { path: 'Ozzmosis/docs/AGENTS/OS_TEMPLATE.md', label: 'OS Protocol' },
    caption: { en: 'Risk containment.', pt: 'Contenção de risco.' },
  },
  {
    id: 'pii-tokenization', index: '07', tier: 'secondary', colSpan: 12, status: 'OK',
    title: {
      en: 'PII never reaches the LLM in plaintext — tokenized in transit, sealed by Trustware.',
      pt: 'PII nunca alcança o LLM em plaintext — tokenizada em trânsito, selada pelo Trustware.',
    },
    source: { path: 'ElysianLex/backend/lex_core/pii/tokenizer.py', label: 'pii/tokenizer' },
    caption: { en: 'Data safety, not data luck.', pt: 'Segurança de dados, não sorte.' },
  },
];

export const PRODUCTS: Product[] = [
  { id: 'crm-aurora', label: 'CRM Aurora' },
  { id: 'elysian-lex', label: 'ElysianLex' },
  { id: 'alvaro-mesh', label: 'Álvaro · Agentic Mesh' },
];
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- evidence.test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/evidence.ts src/data/__tests__/evidence.test.ts
git commit -m "feat: authored bilingual claim manifest with real anchors"
```

---

## Task 5: Harvest core — source resolution & hashing

Pure functions, no side effects beyond reading files. The runner (Task 8) wires them.

**Files:**
- Create: `scripts/lib/harvest-core.mjs`
- Test: `scripts/lib/harvest-core.resolve.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest';
import { sha256, classifyKind } from './harvest-core.mjs';

describe('harvest-core hashing', () => {
  it('hashes deterministically', () => {
    expect(sha256('abc')).toBe(sha256('abc'));
    expect(sha256('abc')).not.toBe(sha256('abd'));
    expect(sha256('abc')).toHaveLength(64);
  });
  it('classifies file kind by extension', () => {
    expect(classifyKind('a/b.py')).toBe('code');
    expect(classifyKind('a/b.md')).toBe('report');
    expect(classifyKind('a/b.png')).toBe('image');
    expect(classifyKind('a/dir-no-ext')).toBe('code');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- harvest-core.resolve`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `scripts/lib/harvest-core.mjs`**

```js
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, statSync, readFileSync } from 'node:fs';
import path from 'node:path';

export function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

export function classifyKind(p) {
  const ext = path.extname(p).toLowerCase();
  if (ext === '.md') return 'report';
  if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) return 'image';
  return 'code';
}

/** Resolve a claim source against the Aurora repo root. Throws if missing. */
export function resolveSource(repoRoot, source) {
  const abs = path.resolve(repoRoot, source.path);
  if (!existsSync(abs)) {
    throw new Error(`MISSING_SOURCE: ${source.path} (resolved ${abs})`);
  }
  const isDir = statSync(abs).isDirectory();
  return { abs, isDir, kind: isDir ? 'code' : classifyKind(source.path) };
}

/** Last commit short SHA + ISO date for a path (git). Falls back gracefully. */
export function gitProvenance(repoRoot, relPath) {
  try {
    const out = execFileSync(
      'git', ['-C', repoRoot, 'log', '-1', '--format=%h|%cI', '--', relPath],
      { encoding: 'utf8' },
    ).trim();
    const [commit, timestamp] = out.split('|');
    if (!commit) throw new Error('no commit');
    return { commit, timestamp };
  } catch {
    return { commit: 'UNTRACKED', timestamp: new Date(statSync(path.resolve(repoRoot, relPath)).mtime).toISOString() };
  }
}

export { readFileSync };
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- harvest-core.resolve`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/harvest-core.mjs scripts/lib/harvest-core.resolve.test.mjs
git commit -m "feat: harvest-core source resolution + hashing"
```

---

## Task 6: Secret scan (fail-closed gate)

The publishing guardrail — the site that sells "fail-closed" is itself fail-closed.

**Files:**
- Modify: `scripts/lib/harvest-core.mjs`
- Test: `scripts/lib/harvest-core.secrets.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest';
import { scanSecrets } from './harvest-core.mjs';

describe('scanSecrets', () => {
  it('passes clean text', () => {
    expect(scanSecrets('def gate(): return True')).toEqual([]);
  });
  it('flags an AWS-style key', () => {
    expect(scanSecrets('key=AKIAIOSFODNN7EXAMPLE').length).toBeGreaterThan(0);
  });
  it('flags a private key header', () => {
    expect(scanSecrets('-----BEGIN RSA PRIVATE KEY-----').length).toBeGreaterThan(0);
  });
  it('flags long hex secrets and bearer tokens', () => {
    expect(scanSecrets('Authorization: Bearer abcdefghijklmnopqrstuvwxyz0123').length).toBeGreaterThan(0);
  });
  it('does NOT flag the literal placeholder label SECRET_KEY in a comment', () => {
    // guard against the OS-019 SECRET_KEY_LABEL false positive
    expect(scanSecrets('# set SECRET_KEY via env')).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- harvest-core.secrets`
Expected: FAIL (`scanSecrets` is not a function).

- [ ] **Step 3: Implement `scanSecrets` (append to `scripts/lib/harvest-core.mjs`)**

```js
const SECRET_PATTERNS = [
  { name: 'aws-access-key', re: /AKIA[0-9A-Z]{16}/ },
  { name: 'private-key-header', re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/ },
  { name: 'bearer-token', re: /Bearer\s+[A-Za-z0-9._-]{24,}/ },
  { name: 'generic-assigned-secret', re: /(?:api[_-]?key|secret|token|password)\s*[:=]\s*['"][A-Za-z0-9/+_-]{16,}['"]/i },
  { name: 'long-hex', re: /\b[0-9a-f]{40,}\b/i },
];

export function scanSecrets(text) {
  const hits = [];
  for (const { name, re } of SECRET_PATTERNS) {
    const m = text.match(re);
    if (m) hits.push({ name, match: m[0].slice(0, 12) + '…' });
  }
  return hits;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- harvest-core.secrets`
Expected: PASS (all 5).

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/harvest-core.mjs scripts/lib/harvest-core.secrets.test.mjs
git commit -m "feat: fail-closed secret scan for evidence harvest"
```

---

## Task 7: Excerpt extraction + sanitize

**Files:**
- Modify: `scripts/lib/harvest-core.mjs`
- Test: `scripts/lib/harvest-core.excerpt.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest';
import { extractExcerpt, sanitize } from './harvest-core.mjs';

const SAMPLE = ['line1', 'line2', 'line3', 'line4', 'line5'].join('\n');

describe('extractExcerpt', () => {
  it('returns the requested 1-based inclusive window', () => {
    expect(extractExcerpt(SAMPLE, [2, 4])).toBe('line2\nline3\nline4');
  });
  it('caps an unbounded excerpt to 40 lines', () => {
    const big = Array.from({ length: 100 }, (_, i) => `l${i}`).join('\n');
    expect(extractExcerpt(big).split('\n')).toHaveLength(40);
  });
});

describe('sanitize', () => {
  it('strips absolute Windows paths to repo-relative-ish labels', () => {
    expect(sanitize('see C:\\\\Projetos\\\\Aurora\\\\x.py here')).not.toContain('C:\\\\Projetos');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- harvest-core.excerpt`
Expected: FAIL.

- [ ] **Step 3: Implement (append to `scripts/lib/harvest-core.mjs`)**

```js
const MAX_EXCERPT_LINES = 40;

export function extractExcerpt(text, lines) {
  const all = text.split(/\r?\n/);
  if (lines) {
    const [start, end] = lines;
    return all.slice(start - 1, end).join('\n');
  }
  return all.slice(0, MAX_EXCERPT_LINES).join('\n');
}

export function sanitize(text) {
  return text
    .replace(/[A-Za-z]:\\\\[^\s'"]+/g, '‹path›')   // Windows abs paths
    .replace(/[A-Za-z]:\/[^\s'"]+/g, '‹path›')
    .replace(/\/(?:home|Users)\/[^\s'"]+/g, '‹path›'); // *nix home paths
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- harvest-core.excerpt`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/harvest-core.mjs scripts/lib/harvest-core.excerpt.test.mjs
git commit -m "feat: excerpt extraction + path sanitization"
```

---

## Task 8: Harvest runner (orchestration + fail-closed)

**Files:**
- Create: `scripts/harvest-evidence.mjs`
- Test: `scripts/harvest-evidence.test.mjs`

- [ ] **Step 1: Write the failing test** (uses a temp fake repo)

```js
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runHarvest } from './harvest-evidence.mjs';

let repo, out;
beforeAll(() => {
  repo = mkdtempSync(path.join(tmpdir(), 'aurora-'));
  mkdirSync(path.join(repo, 'pkg'), { recursive: true });
  writeFileSync(path.join(repo, 'pkg', 'gate.py'), 'def gate():\n    return True\n');
  out = mkdtempSync(path.join(tmpdir(), 'site-'));
  mkdirSync(path.join(out, 'public', 'evidence'), { recursive: true });
  mkdirSync(path.join(out, 'src', 'data'), { recursive: true });
});
afterAll(() => { rmSync(repo, { recursive: true, force: true }); rmSync(out, { recursive: true, force: true }); });

const claims = [{ id: 'c1', source: { path: 'pkg/gate.py', label: 'gate' } }];

describe('runHarvest', () => {
  it('emits asset + provenance for a valid claim', () => {
    const res = runHarvest({ repoRoot: repo, siteRoot: out, claims });
    expect(res.ok).toBe(true);
    expect(existsSync(path.join(out, 'public', 'evidence', 'c1.txt'))).toBe(true);
    const prov = JSON.parse(readFileSync(path.join(out, 'src', 'data', 'evidence.provenance.json'), 'utf8'));
    expect(prov.c1.sourcePath).toBe('pkg/gate.py');
    expect(prov.c1.sha256).toHaveLength(64);
  });
  it('FAILS CLOSED when a source is missing', () => {
    const bad = [{ id: 'x', source: { path: 'pkg/nope.py', label: 'n' } }];
    expect(() => runHarvest({ repoRoot: repo, siteRoot: out, claims: bad })).toThrow(/MISSING_SOURCE/);
  });
  it('FAILS CLOSED when a secret is present', () => {
    writeFileSync(path.join(repo, 'pkg', 'leak.py'), 'KEY=AKIAIOSFODNN7EXAMPLE\n');
    const leak = [{ id: 'l', source: { path: 'pkg/leak.py', label: 'l' } }];
    expect(() => runHarvest({ repoRoot: repo, siteRoot: out, claims: leak })).toThrow(/SECRET_DETECTED/);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- harvest-evidence`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `scripts/harvest-evidence.mjs`**

```js
import { writeFileSync, copyFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {
  resolveSource, gitProvenance, sha256, extractExcerpt, sanitize, scanSecrets,
} from './lib/harvest-core.mjs';

/** Pure-ish orchestration; throws on any violation (fail-closed). */
export function runHarvest({ repoRoot, siteRoot, claims }) {
  const provenance = {};
  for (const claim of claims) {
    const { abs, isDir, kind } = resolveSource(repoRoot, claim.source);
    let assetName, assetBody = null;

    if (kind === 'image') {
      assetName = `${claim.id}${path.extname(abs)}`;
      copyFileSync(abs, path.join(siteRoot, 'public', 'evidence', assetName));
    } else {
      // For directories, read a representative file or list; here read dir marker.
      const raw = isDir ? `// directory: ${claim.source.path}` : readFileSync(abs, 'utf8');
      const secrets = scanSecrets(raw);
      if (secrets.length) {
        throw new Error(`SECRET_DETECTED in ${claim.source.path}: ${secrets.map(s => s.name).join(',')}`);
      }
      assetBody = sanitize(extractExcerpt(raw, claim.source.lines));
      assetName = `${claim.id}.txt`;
      writeFileSync(path.join(siteRoot, 'public', 'evidence', assetName), assetBody, 'utf8');
    }

    const { commit, timestamp } = gitProvenance(repoRoot, claim.source.path);
    provenance[claim.id] = {
      sourcePath: claim.source.path,
      sha256: sha256(assetBody ?? readFileSync(abs)),
      commit, timestamp,
      asset: `/evidence/${assetName}`,
      kind,
    };
  }
  writeFileSync(
    path.join(siteRoot, 'src', 'data', 'evidence.provenance.json'),
    JSON.stringify(provenance, null, 2) + '\n', 'utf8',
  );
  return { ok: true, count: Object.keys(provenance).length };
}

// CLI entry
if (import.meta.url === `file://${process.argv[1]}`) {
  const siteRoot = process.cwd();
  const repoRoot = path.resolve(siteRoot, process.env.AURORA_REPO_ROOT ?? '../../Aurora');
  const { CLAIMS } = await import(path.join(siteRoot, 'src', 'data', 'evidence.ts'))
    .catch(async () => await import('../src/data/evidence.ts'));
  try {
    const res = runHarvest({ repoRoot, siteRoot, claims: CLAIMS });
    console.log(`✓ harvested ${res.count} evidence artifacts`);
  } catch (err) {
    console.error(`✗ harvest failed (fail-closed): ${err.message}`);
    process.exit(1);
  }
}
```

> **Note:** the CLI importing `evidence.ts` (a TS file) requires Node's TS stripping (Node ≥22.6 `--experimental-strip-types`) or running via the Astro/Vite pipeline. If direct import fails at execution time, the engineer should run harvest through `npx tsx scripts/harvest-evidence.mjs` (add `tsx` as a dev dep) — decide at execution and update `package.json` scripts accordingly. Tests import the runner directly and pass plain JS claim objects, so they are unaffected.

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- harvest-evidence`
Expected: PASS (3 tests, incl. both fail-closed paths).

- [ ] **Step 5: Run the real harvest against the Aurora repo**

Run: `npm run harvest:evidence` (with `AURORA_REPO_ROOT` defaulting to `../../Aurora`; use `npx tsx` per the note if the TS import fails)
Expected: `✓ harvested 7 evidence artifacts`; files appear in `public/evidence/` and `src/data/evidence.provenance.json`.

- [ ] **Step 6: Eyeball the harvested excerpts** — open 2-3 files in `public/evidence/` and confirm they are real, readable, secret-free.

- [ ] **Step 7: Commit** (commit the generated artifacts so Vercel ships them without the Aurora repo)

```bash
git add scripts/harvest-evidence.mjs scripts/harvest-evidence.test.mjs public/evidence src/data/evidence.provenance.json
git commit -m "feat: evidence harvest runner + first real harvest (7 artifacts)"
```

---

## Task 9: `ClaimCard` component

**Files:**
- Create: `src/components/proof/ClaimCard.tsx`
- Test: `src/components/proof/__tests__/ClaimCard.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClaimCard } from '../ClaimCard';
import type { Claim } from '@/data/evidence.types';

const claim: Claim = {
  id: 'deterministic-gate', index: '01', tier: 'primary', colSpan: 5, status: 'OK',
  title: { en: 'No critical mutation without a gate.', pt: 'Sem gate, sem mutação.' },
  source: { path: 'CRM/libs/trustware', label: 'lib/trustware' },
};

describe('ClaimCard', () => {
  it('renders index, EN title and badge label', () => {
    render(<ClaimCard claim={claim} lang="en" onOpen={() => {}} />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText(/No critical mutation/)).toBeInTheDocument();
    expect(screen.getByText('lib/trustware')).toBeInTheDocument();
  });
  it('renders PT title when lang=pt', () => {
    render(<ClaimCard claim={claim} lang="pt" onOpen={() => {}} />);
    expect(screen.getByText(/Sem gate/)).toBeInTheDocument();
  });
  it('calls onOpen with the claim id when activated', () => {
    const onOpen = vi.fn();
    render(<ClaimCard claim={claim} lang="en" onOpen={onOpen} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onOpen).toHaveBeenCalledWith('deterministic-gate');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- ClaimCard`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `src/components/proof/ClaimCard.tsx`**

Tailwind only generates classes it sees as literal strings, so `md:col-span-${n}` is built from a static lookup map (never string-interpolated).

```tsx
import type { Claim } from '@/data/evidence.types';

interface Props {
  claim: Claim;
  lang: 'en' | 'pt';
  onOpen: (id: string) => void;
}

// Static so Tailwind sees each literal class.
const SPAN: Record<number, string> = {
  4: 'md:col-span-4', 5: 'md:col-span-5', 6: 'md:col-span-6',
  7: 'md:col-span-7', 8: 'md:col-span-8', 12: 'md:col-span-12',
};

export function ClaimCard({ claim, lang, onOpen }: Props) {
  const badge = claim.status === 'OK'
    ? 'border-elysian-moss-light text-elysian-moss-light'
    : 'border-sovereign-ink/50 text-sovereign-ink/80';
  return (
    <button
      type="button"
      onClick={() => onOpen(claim.id)}
      className={`${SPAN[claim.colSpan] ?? 'md:col-span-6'} hover-invert-card text-left border border-sovereign-ink/20 p-fib-34 flex flex-col justify-between cursor-pointer`}
    >
      <span className="flex justify-between items-start mb-fib-55 w-full">
        <span className="font-technical-sm text-technical-sm text-sovereign-ink/40">{claim.index}</span>
        <span className="flex items-center gap-fib-8">
          <span className={`font-technical-sm text-[10px] px-2 py-1 border ${badge}`}>{claim.status}</span>
          <span className="font-technical-sm text-[10px] px-2 py-1 border border-sovereign-ink/30 text-sovereign-ink/60">{claim.source.label}</span>
        </span>
      </span>
      <span className="font-body-lg text-body-lg text-sovereign-ink">{claim.title[lang]}</span>
    </button>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- ClaimCard`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/proof/ClaimCard.tsx src/components/proof/__tests__/ClaimCard.test.tsx
git commit -m "feat: ClaimCard component (bilingual, static span map)"
```

---

## Task 10: `EvidenceModal` component (accessible)

**Files:**
- Create: `src/components/proof/EvidenceModal.tsx`
- Test: `src/components/proof/__tests__/EvidenceModal.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EvidenceModal } from '../EvidenceModal';

const prov = {
  sourcePath: 'pkg/gate.py', sha256: 'a'.repeat(64), commit: 'abc1234',
  timestamp: '2026-06-10T00:00:00Z', asset: '/evidence/c1.txt', kind: 'code' as const,
};

describe('EvidenceModal', () => {
  it('renders provenance + claim title + excerpt', () => {
    render(<EvidenceModal open title="No mutation without a gate." excerpt="def gate(): return True" provenance={prov} onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('abc1234')).toBeInTheDocument();
    expect(screen.getByText('pkg/gate.py')).toBeInTheDocument();
    expect(screen.getByText(/def gate/)).toBeInTheDocument();
  });
  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(<EvidenceModal open title="t" excerpt="" provenance={prov} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
  it('renders nothing when closed', () => {
    render(<EvidenceModal open={false} title="t" excerpt="" provenance={prov} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- EvidenceModal`
Expected: FAIL.

- [ ] **Step 3: Implement `src/components/proof/EvidenceModal.tsx`**

```tsx
import { useEffect, useRef } from 'react';
import type { Provenance } from '@/data/evidence.types';

interface Props {
  open: boolean;
  title: string;
  excerpt: string;
  provenance: Provenance;
  onClose: () => void;
}

export function EvidenceModal({ open, title, excerpt, provenance, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = 'auto'; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-parchment-ink/90 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative bg-sovereign-bg border border-sovereign-ink w-full max-w-2xl mx-fib-21 p-fib-34 shadow-2xl"
      >
        <button type="button" onClick={onClose} aria-label="Close"
          className="absolute top-fib-21 right-fib-21 text-sovereign-ink/50 hover:text-sovereign-ink">✕</button>
        <div className="font-technical-sm text-technical-sm text-elysian-moss-light mb-fib-21 uppercase tracking-widest">
          Provenance Metadata
        </div>
        <h4 className="font-headline-md text-headline-md text-sovereign-ink mb-fib-34 border-b border-sovereign-ink/20 pb-fib-21">
          {title}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-fib-34">
          <pre className="border border-sovereign-ink/20 bg-sovereign-ink/5 p-fib-13 font-technical-sm text-[11px] text-sovereign-ink/70 leading-relaxed overflow-x-auto whitespace-pre-wrap">{excerpt}</pre>
          <dl className="flex flex-col gap-fib-13">
            {[
              ['Commit SHA', provenance.commit],
              ['Source', provenance.sourcePath],
              ['SHA-256', provenance.sha256.slice(0, 16) + '…'],
              ['Timestamp', provenance.timestamp.slice(0, 10)],
            ].map(([k, v]) => (
              <div key={k} className="border-b border-sovereign-ink/20 pb-fib-8 flex justify-between gap-fib-8">
                <dt className="font-technical-sm text-technical-sm text-sovereign-ink/50">{k}</dt>
                <dd className="font-technical-sm text-technical-sm text-sovereign-ink text-right break-all">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- EvidenceModal`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/proof/EvidenceModal.tsx src/components/proof/__tests__/EvidenceModal.test.tsx
git commit -m "feat: accessible EvidenceModal (dialog, ESC, scroll-lock)"
```

---

## Task 11: `EvidenceConsole` island

Wires CLAIMS + provenance + excerpts; grid, language toggle, reduced-motion; loads excerpts from `/evidence/*` on open.

**Files:**
- Create: `src/components/proof/EvidenceConsole.tsx`
- Test: `src/components/proof/__tests__/EvidenceConsole.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EvidenceConsole } from '../EvidenceConsole';

beforeEach(() => {
  // @ts-expect-error test stub
  global.fetch = vi.fn(() => Promise.resolve({ text: () => Promise.resolve('def gate(): return True') }));
});

describe('EvidenceConsole', () => {
  it('renders the header and all primary claims', () => {
    render(<EvidenceConsole />);
    expect(screen.getByText('[ 02 // THE EVIDENCE LEDGER ]')).toBeInTheDocument();
    expect(screen.getByText(/We Show the Trace/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /No critical|Production promotion|persisted|adversarial|observable|Micro-step/i }).length).toBeGreaterThanOrEqual(6);
  });
  it('toggles language to PT', () => {
    render(<EvidenceConsole />);
    fireEvent.click(screen.getByRole('button', { name: /PT/ }));
    expect(screen.getByText(/Mostramos o rastro/)).toBeInTheDocument();
  });
  it('opens the modal with fetched excerpt on card click', async () => {
    render(<EvidenceConsole />);
    fireEvent.click(screen.getByRole('button', { name: /No critical/i }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith('/evidence/c1.txt'.replace('c1', 'deterministic-gate'));
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test -- EvidenceConsole`
Expected: FAIL.

- [ ] **Step 3: Implement `src/components/proof/EvidenceConsole.tsx`**

```tsx
import { useState } from 'react';
import { CLAIMS, HEADER, PRODUCTS } from '@/data/evidence';
import provData from '@/data/evidence.provenance.json';
import type { Provenance } from '@/data/evidence.types';
import { ClaimCard } from './ClaimCard';
import { EvidenceModal } from './EvidenceModal';

const PROV = provData as Record<string, Provenance>;

export function EvidenceConsole() {
  const [lang, setLang] = useState<'en' | 'pt'>('en');
  const [openId, setOpenId] = useState<string | null>(null);
  const [excerpt, setExcerpt] = useState('');

  const open = async (id: string) => {
    const p = PROV[id];
    setOpenId(id);
    if (p?.kind === 'image') { setExcerpt(''); return; }
    try { setExcerpt(await (await fetch(p.asset)).text()); }
    catch { setExcerpt('// evidence unavailable'); }
  };

  const current = openId ? CLAIMS.find(c => c.id === openId) : null;
  const primary = CLAIMS.filter(c => c.tier === 'primary');
  const secondary = CLAIMS.find(c => c.tier === 'secondary');

  return (
    <section id="evidence-ledger" className="relative w-full bg-sovereign-bg text-sovereign-ink bg-halftone-grain py-fib-89 px-fib-34 min-h-screen border-t border-parchment-ink">
      <div className="max-w-7xl mx-auto">
        <header className="mb-fib-89 flex flex-col gap-fib-21">
          <div className="flex justify-between items-center">
            <span className="font-technical-sm text-technical-sm text-sovereign-ink/60 tracking-widest uppercase">{HEADER.label}</span>
            <span className="flex gap-fib-8 font-technical-sm text-technical-sm">
              <button type="button" onClick={() => setLang('en')} className={lang === 'en' ? 'text-elysian-moss-light' : 'text-sovereign-ink/40'}>EN</button>
              <span className="text-sovereign-ink/20">/</span>
              <button type="button" onClick={() => setLang('pt')} className={lang === 'pt' ? 'text-elysian-moss-light' : 'text-sovereign-ink/40'}>PT</button>
            </span>
          </div>
          <h2 className="font-display-lg text-display-lg md:text-[72px] md:leading-[0.95] max-w-4xl text-sovereign-ink">{HEADER.title[lang]}</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-fib-21 md:gap-fib-34 mb-fib-89">
          {primary.map(c => <ClaimCard key={c.id} claim={c} lang={lang} onOpen={open} />)}
        </div>

        {secondary && (
          <div className="flex flex-col md:flex-row items-center gap-fib-21 border border-sovereign-ink/20 p-fib-21 mb-fib-55">
            <span className="font-technical-sm text-technical-sm px-3 py-1 bg-sovereign-ink text-sovereign-bg uppercase tracking-widest shrink-0">Data Privacy</span>
            <p className="font-body-md text-body-md text-sovereign-ink/80">{secondary.title[lang]}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-fib-13 border-t border-sovereign-ink/20 pt-fib-34">
          {PRODUCTS.map(p => (
            <span key={p.id} className="flex items-center gap-fib-8 border border-sovereign-ink/20 px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-elysian-moss-light" />
              <span className="font-technical-sm text-technical-sm text-sovereign-ink uppercase tracking-wider">{p.label}</span>
            </span>
          ))}
        </div>
      </div>

      {current && (
        <EvidenceModal
          open={!!openId}
          title={current.title[lang]}
          excerpt={excerpt}
          provenance={PROV[current.id]}
          onClose={() => setOpenId(null)}
        />
      )}
    </section>
  );
}
```

> **Test alignment note:** the test stubs one claim's asset as `deterministic-gate`. The real `evidence.provenance.json` (from Task 8) maps `deterministic-gate` → `/evidence/deterministic-gate.txt`, so `fetch` is called with that path. Confirm the assertion matches the real asset path; adjust the test's expected URL to `/evidence/deterministic-gate.txt`.

- [ ] **Step 4: Run to verify it passes**

Run: `npm test -- EvidenceConsole`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/proof/EvidenceConsole.tsx src/components/proof/__tests__/EvidenceConsole.test.tsx
git commit -m "feat: EvidenceConsole island (grid, lang toggle, modal)"
```

---

## Task 12: `ProofSection.astro` + mount in `index.astro` (unmount SequenceRigFull)

**Files:**
- Create: `src/components/proof/ProofSection.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/proof/ProofSection.astro`**

```astro
---
import { EvidenceConsole } from './EvidenceConsole';
---
<EvidenceConsole client:visible />
```

- [ ] **Step 2: Modify `src/pages/index.astro`** — replace the `SequenceRigFull` import and usage

Change the import line:
```astro
import { SequenceRigFull } from '../components/sequence/SequenceRigFull';
```
to:
```astro
import ProofSection from '../components/proof/ProofSection.astro';
```

And replace the block:
```astro
		{/* CINEMATIC SEQUENCE — client:only skips SSR entirely, preventing
		    Suspense streaming corruption and hydration mismatch with the
		    500vh spacer and position:fixed CameraStage */}
		<SequenceRigFull client:only="react" />
```
with:
```astro
		{/* EVIDENCE LEDGER — interactive proof console (replaces cinematic sequence).
		    SequenceRigFull preserved in repo history / optional /cinema route. */}
		<ProofSection />
```

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: build succeeds (note: `prebuild` runs the harvest first — needs `AURORA_REPO_ROOT` reachable, or run `npm run harvest:evidence` once and temporarily skip prebuild if the Aurora repo isn't present in CI).

- [ ] **Step 4: Visual check** — `npm run preview`, open the site, scroll past hero

Confirm: Sovereign-Black section, label `[ 02 // THE EVIDENCE LEDGER ]`, 6 cards in asymmetric grid, hover-invert works, EN/PT toggle switches copy, clicking a card opens the modal with a real excerpt + commit SHA.

- [ ] **Step 5: Commit**

```bash
git add src/components/proof/ProofSection.astro src/pages/index.astro
git commit -m "feat: mount Evidence Ledger below hero; unmount SequenceRigFull"
```

---

## Task 13: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Full test suite green**

Run: `npm test`
Expected: all suites PASS.

- [ ] **Step 2: Production build green** with real harvest

Run: `npm run build`
Expected: `✓ harvested 7 evidence artifacts` then a successful Astro build.

- [ ] **Step 3: Confirm shipped evidence is self-contained** — verify `dist/` (or `.vercel/output`) contains `/evidence/*.txt` so a reviewer without the Aurora repo sees real artifacts.

- [ ] **Step 4: Anti-hallucination spot check** — open the live modal for cards 02, 05, 06 and confirm the source paths shown are the real verified anchors (no `gateway.go`/`step.rs`, no `142GB`, real commit SHAs).

- [ ] **Step 5: prefers-reduced-motion** — in devtools, emulate reduced motion; confirm no hover/entrance animation jank (hover-invert color transition is acceptable; no transforms required).

- [ ] **Step 6: Final commit / branch ready for PR**

```bash
git add -A
git commit -m "chore: evidence ledger console — verification pass"
```

---

## Out of scope (separate follow-up plan)

**Video MP4** (`docs/superpowers/plans/<date>-evidence-ledger-video.md`): a Remotion composition (Remotion is already a dependency) that reuses `evidence.ts` + `evidence.provenance.json` as its data source, narrating problem → mechanism → proof → ask, EN primary with PT captions. Depends on a working console; plan it after Task 13 passes.

**Optional `/cinema` route:** re-expose the preserved `SequenceRigFull` at `src/pages/cinema.astro` if the cinematic sequence should remain reachable.
