# Elysian Design System
**Version:** 1.1.0 | **Date:** April 24, 2026 | **Domain:** www.elysian.ai.br

---

## Company Overview

**Elysian** is a Brazilian AI-native digital product factory — giving superpowers to people and professionals. The brand operates under a single parent identity (Elysian) with three product verticals:

| Vertical | Product | Accent | Promise |
|---|---|---|---|
| Commercial | CRM Aurora + Silent Operator | Indigo `#4F46E5` | Commercial intelligence that acts |
| Legal | Elysian Lex | Emerald `#10B981` | Legal precision without friction |
| Creative | Mad Lab Aurora | Amber `#D97706` | Digital experiences that are impossible |

---

## Sources

- **Brand Kit:** `uploads/ELYSIAN_BRAND_KIT_v1.1.md` (canonical brand constitution)
- **Agency Manual:** `uploads/MANUAL_DA_AGENCIA.md` (Mad Lab Aurora creative law)
- **Design Tokens:** `uploads/Tokens.txt` (JSON token set v1.1.0)
- **Codebase:** `Aurora/` (mounted via File System Access API — may need re-attachment)
  - CRM Aurora Frontend: `Aurora/CRM/apps/chronos-backoffice/` (Next.js, Tailwind)
  - Elysian Lex Frontend: `Aurora/ElysianLex/frontend/lex_web/` (Next.js, shadcn/ui)
  - Elysian Lex Design System: `Aurora/ElysianLex/DESIGN_SYSTEM.md`
- **Moodboard Screenshots:** `uploads/Captura de tela 2026-04-24 11*.png` (double exposure, editorial fragmentation, typography-as-object references)

---

## CONTENT FUNDAMENTALS

### Language
- **Primary language:** Brazilian Portuguese (products), English (technical identifiers, code, labels)
- **Voice:** Direct, confident, technical without being hermetic. Provocative without aggression.

### Tone Principles
- Short sentence BEFORE long sentence. Ideas open in 6 words, expand after.
- Concrete before abstract: "Reduces 70% of commercial response time" before "increases efficiency"
- The **client is always the hero.** Elysian is the mentor, never the protagonist.
- No startup hype. No corporate distance. No apology for technology.

### Dark Editorial Writing (for dark-world sections)
- Fragmented sentences. Pause. Weight.
- Silence before the phrase lands.
- Technical text as visual element: `AURORA_V8`, `ARTIFACT: 2026.Q2.CERT`, `SVRN_OPERATOR: ACTIVE`

### Casing
- Product UI labels: `UPPERCASE` + monospace + extreme tracking (`VERTICAL: LEX`)
- Headlines: Title Case or ALL CAPS depending on world (dark = all caps, luminous = sentence case)
- Body: sentence case
- Technical identifiers: ALL_CAPS_WITH_UNDERSCORES

### Emoji
- **Never** used in brand communications or product UI
- Exception: internal operational emoji (`◉`, `•`, `◦`) as geometric wayfinding elements in CRM backoffice

---

## VISUAL FOUNDATIONS

### The Two Worlds
Elysian operates two visual worlds with **equal authority**:

| World | Background | Vibe | Purpose |
|---|---|---|---|
| **Dark** | `#000000` absolute black | Machine. Tension. Weight. System. | Before the human enters — the problem they haven't named |
| **Luminous** | `#F8F7F3` warm off-white | Peace. Air. Human. Proportion. | After transformation — what becomes possible |

The journey Dark → Luminous = Machine → Human = Tension → Peace.

### Colors
See `colors_and_type.css` for full CSS vars. Key values:
- **Off-white:** `#F8F7F3` (slightly warm; never substitute with cold whites)
- **Absolute black:** `#000000` (not dark gray — absolute)
- **Integrity Emerald:** `#10B981` (sole accent, used once per section maximum)
- **CRM warm paper palette:** `#fbf9f5 → #f5f4ee → #efeee8` (editorial warmth)
- **CRM rust accent:** `#984731` (used in ControlRoom/editorial headings)

### Typography
- **Primary:** Söhne (Klim Type Foundry) — **paid license required**
  - Prototype substitute (sanctioned): **Plus Jakarta Sans** (Google Fonts)
  - Fallback stack: `system-ui, -apple-system, 'Helvetica Neue', sans-serif`
- **Technical/Mono:** JetBrains Mono (open source, OFL) — use directly
- **Elysian Lex authority serif:** Crimson Pro (Google Fonts) — used for sovereign headlines in the Lex product
- **Tracking rule:** Display text → negative tracking (-0.03em to -0.06em). Technical labels → positive tracking (+0.15em to +0.25em). Never mix.
- **Weight rule:** Body = 300 (Book). UI = 500 (Medium). Headlines = 600-700. Hero display = 800 (ExtraBold).

### Spacing
8px baseline grid. Scale: 4 / 8 / 16 / 24 / 40 / 64 / 96 / 128px. Container max: 1280px.

### Border Radius
Almost none: `none (0px)`, `sm (2px)`, `md (4px)`, `lg (8px)`. Elysian Lex uses 0-2px only (veto on rounding). CRM Aurora backoffice uses up to 24px (glassmorphism cards).

### Shadows
- Elysian brand: no shadows (veto in Lex, not used in dark world)
- CRM backoffice: soft shadows (`0 20px 60px rgba(15,23,42,0.08)`) on glass cards
- Elysian Lex: no box-shadows (structural stress engineering rule)

### Backgrounds
- Dark world: solid `#000000` or `#0A0A0A` — never colorful, never gradient between two colors
- Luminous world: `#F8F7F3` — warm off-white paper
- CRM backoffice: `radial-gradient(circle_at_top, rgba(217,233,243,0.85), rgba(247,244,236,1))` — subtle warm-cool atmospheric gradient
- Gradients of opacity are allowed (same color, 0%→100% opacity), but never between two hues

### Animations / Motion
- **Easing:** `cubic-bezier(0.76, 0, 0.24, 1)` (hero transitions), `cubic-bezier(0.16, 1, 0.3, 1)` (section enter), `cubic-bezier(0.4, 0, 0.2, 1)` (hover)
- **Rest before motion:** 0.8s minimum — silence before effect
- **Hero dark phase:** 5s. Hero transition: 2s.
- CRM backoffice uses Framer Motion with `duration: 0.6, ease: [0.22, 1, 0.36, 1]`

### Hover States
- Luminous: opacity reduction or darker tone
- Dark: invert (white card → white bg, black text on hover — see Elysian Lex `highlight-flip`)
- CRM: subtle bg color shift (`bg-slate-200`, `hover:bg-stone-50`)
- Buttons: opacity or bg toggle; never dramatic scale

### Press States
- Buttons: `active:scale-[0.99]` subtle shrink
- Links: no special press state — hover is sufficient

### Cards
- Elysian brand: no rounding, thin border `#E8E7E2`, no shadow
- Elysian Lex: `border border-white` on `#000000`, 0px radius, hover inverts bg
- CRM backoffice: rounded `rounded-[24px]`, `bg-white/40`, `backdrop-blur-3xl`, `ring-1 ring-slate-900/5`

### Iconography
See **ICONOGRAPHY** section below.

### Imagery Style
- **Double exposure:** human silhouette containing city/system/architecture. Fundo sempre branco/off-white.
- **Fragmented collage:** editorial strip cuts, geometric displacement
- **Typography-as-object:** massive letterforms, person walks through/behind text
- **Dark world photography:** single dramatic light source, subexposed, film grain, near-monochrome
- **Prohibited:** stock team photos, laptops, handshakes, cloud metaphors, AI brain robots, generic backgrounds

---

## ICONOGRAPHY

- **System used:** [Lucide Icons](https://lucide.dev) — stroke weight 1 to 1.5, consistent thin-line style
- **Usage in Elysian Lex:** `Shield`, `Lock`, `Gavel`, `Fingerprint`, `Activity`, `ScrollText`, `UserCheck` — all at `strokeWidth={1}` or `1.5`
- **Usage in CRM Aurora sidebar:** single-letter icons (`A`, `S`, `N`, `V`, `C`) as typographic identifiers in rounded squares
- **Elysian Lex nav:** icons at 16px with `text-sidebar-primary-foreground`
- **CRM uses Lucide** via `lucide-react` package
- **No icon fonts.** No PNG icons. No emoji icons in product UI.
- **CDN link (design system use):** `https://unpkg.com/lucide@latest/dist/umd/lucide.js`

### Assets Available
- `assets/` — logo SVGs and wordmark SVGs (created for this design system)

---

## FILES INDEX

```
/
├── README.md                     ← This file
├── colors_and_type.css           ← CSS custom properties (all tokens)
├── SKILL.md                      ← Agent skill definition
│
├── assets/
│   ├── elysian-wordmark-dark.svg   ← ELYSIAN wordmark on black
│   ├── elysian-wordmark-light.svg  ← ELYSIAN wordmark on off-white
│   └── elysian-icon.svg            ← E monogram icon
│
├── preview/
│   ├── colors-luminous.html        ← Luminous palette swatches
│   ├── colors-dark.html            ← Dark palette swatches
│   ├── colors-text.html            ← Text color system
│   ├── colors-accent-verticals.html← Emerald + vertical colors
│   ├── type-display.html           ← Hero/display type scale
│   ├── type-body-ui.html           ← Body + UI type scale
│   ├── type-technical.html         ← Monospace/technical/dark
│   ├── spacing-tokens.html         ← Spacing scale
│   ├── spacing-radius-motion.html  ← Radius + easing tokens
│   ├── components-buttons.html     ← Button variants (both worlds)
│   ├── components-badges.html      ← Badges + technical labels
│   ├── components-cards.html       ← Card variants (brand + CRM + Lex)
│   ├── brand-logo.html             ← Wordmark in both worlds
│   ├── brand-two-worlds.html       ← Dark ↔ Luminous concept
│   ├── brand-crm-palette.html      ← CRM Aurora warm editorial palette
│   └── brand-lex-palette.html      ← Elysian Lex sovereign dark palette
│
└── ui_kits/
    ├── elysian-lex/
    │   └── index.html              ← Elysian Lex app (dark sovereign)
    └── crm-aurora/
        └── index.html              ← CRM Aurora backoffice
```
