---
name: elysian-design
description: Use this skill to generate well-branded interfaces and assets for Elysian — the Brazilian AI-native product factory. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping across all three verticals (CRM Aurora, Elysian Lex, Mad Lab Aurora).
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick Reference

**Brand:** Elysian — AI-native product factory, Brazil. Parent of CRM Aurora, Elysian Lex, Mad Lab Aurora.

**Two Worlds:**
- Dark `#000000` — machine, tension, system, before the human enters
- Luminous `#F8F7F3` — peace, air, human, proportion

**Key Colors:**
- Off-white: `#F8F7F3` (warm, never substitute with cold whites)
- Sole accent: `#10B981` Integrity Emerald (once per section max)
- CRM steel: `#535f6f`, rust: `#984731`, navy: `#041627`
- Verticals: CRM `#4F46E5`, Lex `#10B981`, Mad Lab `#D97706`

**Fonts (prototype):**
- Display/Body: `Plus Jakarta Sans` (Google Fonts — Söhne substitute, sanctioned)
- Technical/Mono: `JetBrains Mono` (Google Fonts — open source)
- Elysian Lex serif: `Crimson Pro` (Google Fonts)

**Icons:** Lucide Icons, stroke-width 1–1.5, thin-line style

**Do not:**
- Use gradients between two colors
- Use border-radius > 2px on Lex components
- Use shadows on dark-world or Lex components
- Use Inter font (too generic for Elysian positioning)
- Invent new accent colors — Emerald is the only accent

**UI Kits:**
- `ui_kits/elysian-lex/index.html` — dark sovereign legal platform
- `ui_kits/crm-aurora/index.html` — warm editorial commercial backoffice
