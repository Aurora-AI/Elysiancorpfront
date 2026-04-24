# Design System: ElysianCorp

## 1. Visual Theme & Atmosphere

The atmosphere is **Fluid Editorial** — a premium gallery experience that prioritizes organic elegance over industrial utility. The design is airy, sophisticated, and narratively driven. It blurs the boundary between art and technology, feeling like a well-lit editorial spread from a luxury architecture magazine.

The Hero is the visual anchor. Every other section inherits its grammar: warm parchment light, large asymmetric serif headlines, and a single precise accent against restrained neutrals.

- **Density:** 3 (Art Gallery Airy)
- **Variance:** 7 (Asymmetric & Composed)
- **Motion:** 8 (Liquid — long durations, Power4 ease, no spring jitter)

---

## 2. Color Palette & Roles

- **Warm Parchment** (`#F4F1EA`) — Primary canvas for all light sections. Warm, not cold.
- **Deep Obsidian** (`#0A0A0B`) — Primary canvas for all dark sections. Near-black with blue undertone.
- **Ink Black** (`#0D0D0D`) — Body text on light sections. Not pure black.
- **Parchment White** (`#F4F1EA`) — Primary text on dark sections.
- **Whisper Ink** (`rgba(13,13,13,0.4)`) — Secondary/muted text on light sections.
- **Whisper White** (`rgba(244,241,234,0.4)`) — Secondary/muted text on dark sections.
- **Hairline Light** (`rgba(13,13,13,0.08)`) — Dividers and structural borders on light sections.
- **Hairline Dark** (`rgba(255,255,255,0.05)`) — Dividers and structural borders on dark sections.
- **Sapphire Accent** (`#1B4DA0`) — Single accent color for light sections. Used on italic headline words, active states, and links on parchment. Never oversaturated.
- **Sapphire Bright** (`#4A7FD4`) — Accent variant for dark sections. Readable on Obsidian. Same hue family, elevated luminosity.

**Banned:** `#000000` pure black. `#10B981` or any emerald. Any neon/electric saturations. Gold or warm metallics. More than one accent hue.

---

## 3. Typography Rules

- **Display (Headlines):** `Cormorant Garamond` — Elegant modern serif. Weight 300 (light) for normal words, italic for accent words. Uppercase. Tracking tight (`letter-spacing: -0.01em`). Scale: `clamp(3rem, 8vw, 9rem)`.
- **Label / Body:** `Syne` — Sophisticated sans-serif. Uppercase for labels (tracking `0.3–0.5em`, size `0.625rem`). Regular case for body at `1.1rem`, leading `1.7`.
- **Metadata only:** `DM Mono` — Strictly confined to version numbers, coordinates, and build IDs. Never for navigation, body text, or section labels.

**Type Hierarchy:**
1. Ghost Word — decorative background text, `opacity: 0.07`, `font-display`, `12–20vw`
2. Section Label — Syne uppercase, `0.625rem`, `tracking-[0.5em]`, `opacity: 0.4`
3. Display Headline — Cormorant Garamond, `8–10vw`, weight 300 uppercase + italic accent word in Sapphire
4. Subtitle — Syne, `1.25–1.75rem`, uppercase, weight 700, full ink color
5. Body — Syne, `1rem–1.1rem`, normal case, `opacity: 0.6`, `leading-relaxed`

**Banned:** `Inter`, `Roboto`, `Times New Roman`, `Georgia`, `Garamond`. DM Mono outside metadata. Gradient text on large headers. All-caps body paragraphs.

---

## 4. Component Stylings

**Sections:**
- Light sections: `bg-[#F4F1EA]`, text `#0D0D0D`. Min-height `100dvh`.
- Dark sections: `bg-[#0A0A0B]`, text `#F4F1EA`. Min-height `100dvh`.
- Vertical padding: `py-40` (`10rem`). Horizontal: `px-[8vw]`.

**Images:**
- Always in a container with `overflow-hidden` and `aspect-ratio` set.
- Subtle scale-down on hover: `scale-110 → scale-100`, duration `2000ms`, ease-out.
- No border-radius except `0` (sharp edges per editorial standard).
- No glows. No drop shadows on images.

**Ghost Words (Decorative Background):**
- Positioned `absolute`, non-interactive, `pointer-events-none`, `select-none`.
- Font: Cormorant Garamond. Color: same as section text. Opacity: `0.07`.
- Size: `12–20vw`. Placement: top or right edge, never overlapping content.

**Section Labels:**
- Format: `THE [CONCEPT]` — two words, Syne uppercase, tracking `0.5em`, `text-[0.625rem]`.
- Always accompanied by a `h-[1px]` hairline divider, `w-12`.
- Color: `text-black/40` on light, `text-white/30` on dark.

**Accent Word in Headline:**
- Last word or key word of the display headline.
- `italic` + `text-[#1B4DA0]` on light sections.
- `italic` + `text-[#4A7FD4]` on dark sections.
- Never underlined, never animated independently.

**Statistics / Metrics:**
- Label: Syne, `0.625rem`, uppercase, tracking `0.4em`, `opacity: 0.3`.
- Value: Cormorant Garamond, `1.5rem`. Accent color for key values.
- Separated by a `border-t hairline` at `pt-8`.
- Label names use natural language: `Integrity Rate`, `Protocol Status`. No underscores.

**CTA Button:**
- Shape: `0` border-radius (sharp rectangle). No rounded corners.
- Rest state: `bg-white`, `text-black`, `text-[0.75rem]`, Syne, uppercase, `tracking-[0.4em]`.
- Hover: background slides to `#1B4DA0`, text becomes white. Duration `700ms`.
- No outer glow, no box-shadow, no border.

**Navigation Links:**
- Font: Syne, not DM Mono.
- Size: `0.7rem`, tracking `0.2em`, uppercase.
- Default: `text-[#F4F1EA]` (on dark/hero with mix-blend-difference).
- Hover: `text-[#4A7FD4]` (sapphire bright).

---

## 5. Layout Principles

- **Grid-first:** CSS Grid for all multi-column layouts. `lg:grid-cols-12` splits. Never flexbox percentage math.
- **Hero-inherited Asymmetry:** Light sections → image left (5 cols), text right (7 cols). Dark sections → text left (7 cols), image right (5 cols). Alternates rhythm.
- **Max-width containment:** All content inside `max-w-7xl mx-auto w-full`.
- **Generous whitespace:** `gap-24` between grid columns. `space-y-12` or `space-y-16` between content blocks.
- **No overlapping elements.** Every element occupies its own clean spatial zone.
- **No 3-equal-column card grids.** Footer navigation uses 3 cols only for distinct content categories (Explore / Network / Legal).

---

## 6. Motion & Interaction

- **Entrance:** GSAP timeline, `scrollTrigger` at `top 60%`. Words/spans animate with `yPercent: 100 → 0`, `rotateX: -45 → 0`, `opacity: 0 → 1`. Duration `1.5–1.8s`, `stagger: 0.1`, `ease: power4.out`.
- **Image entrance:** `opacity: 0 → 1`, `scale: 0.9 → 1`, duration `2s`, `ease: expo.out`.
- **Image clip reveal (dark sections):** `clipPath: inset(0 100% 0 0) → inset(0 0% 0 0)`, `scale: 1.2 → 1`, `ease: expo.inOut`.
- **Parallax:** Images move at `yPercent: ±15–20` opposite to scroll direction. `scrub: true`, `ease: none`.
- **Image hover:** `scale: 1.1 → 1.0`. Duration `2000ms`. `ease-out`. CSS transition (not GSAP).
- **No spring physics jitter.** No bounce. All easing is `power3–4` or `expo`.
- **No CRT flicker, no character scramble, no code cascade on visible UI layers.**

---

## 7. Anti-Patterns (Banned)

- No emerald, green, or gold accent colors.
- No CRT scanlines or retro glitch effects.
- No industrial grids or dot-matrix backgrounds.
- No terminal logs, telemetry streams, or diagnostic overlays visible in the UI.
- No ASCII art or cyberpunk aesthetics.
- No underscore naming in UI copy (`Integrity_Rate` → `Integrity Rate`).
- No tactical/military copy ("GENEVA_CLUSTER_01", "FACTORY_ID", "FORENSIC", "Vulnerability Detected").
- No pure black `#000000`.
- No rounded corners except explicitly required.
- No outer glows or neon box-shadows.
- No custom mouse cursors (MagneticCursor is a legacy component — do not expand).
- No `DM Mono` outside version numbers and metadata.
- No centered hero sections.
- No filler scroll indicators ("Scroll to explore", bouncing chevrons).
- No `Inter` font in any context.
- No `h-screen` — always `min-h-[100dvh]`.
