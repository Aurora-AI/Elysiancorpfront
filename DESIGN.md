# DESIGN.md — ElysianCorp Trustware
Este documento define as diretrizes determinísticas de design para a ElysianCorp, 
integrado ao **Elysian Design System v1.2.3 (Metallic Architecture)**.

---
design-tokens:
  project: "ElysianCorp Trustware"
  version: "1.2.3"
  source: "C:\Projetos\Aurora\MadLabAurora\ElysianCorp\docs\brand\Elysian Design System"
  governance: "./docs/brand/ELYSIAN_BRAND_KIT_v1.1.md"
  
  colors:
    base:
      white: "#FFFFFF"
      off-white: "#F9F8F6" # Papel Premium / Mundo Luminoso
      fog: "#F1EFEA"
      border: "#E5E3DF"
      black: "#000000" # Preto Absoluto / Mundo Dark
      obsidian: "#0D0D0D"
      obsidian-technical: "#121212"
      
    accent:
      moss: "#4E5B4B" # Organic Authority Moss
      moss-muted: "rgba(78, 91, 75, 0.1)"
      silver-glimmer: "#E5E7EB" # Prata para elementos de alto impacto
      silver-technical: "#9CA3AF" # Prata para metadados técnicos
      gold-sovereign: "#D4AF37" # Ouro de Autoridade (Acento)
      
    verticals:
      crm:
        paper: "#fbf9f5"
        rust: "#984731"
        steel: "#535f6f"
        navy: "#041627"
      lex:
        sovereign: "#000000"
      madlab:
        amber: "#D97706"

  typography:
    family:
      brand: "'Lanche', 'Instrument Serif', serif"
      display: "'Instrument Serif', serif"
      body: "'Public Sans', sans-serif"
      technical: "'JetBrains Mono', monospace"
      lex-serif: "'Crimson Pro', Georgia, serif"
    weights:
      light: 300
      regular: 400
      medium: 500
      bold: 700
      black: 800
    tracking:
      micro: "0.15em"
      tighter: "-0.04em"
      tight: "-0.02em"
      wide: "0.18em"
    scale:
      meta: "13px"
      base: "21px"
      md: "34px"
      lg: "55px"
      xl: "89px"
      "2xl": "144px"

  spacing:
    scale: [8, 16, 24, 40, 64, 104, 168, 272]
    unit: "px"
    philosophy: "Proporção Áurea / Sequência de Fibonacci"

  hero:
    style: "Forensic Stop-Motion Architecture (v1.1.0)"
    background: "#000000" # Mundo Dark (Initial)
    elements: ["Gaze Forensic Sequence", "B&W Portraits", "Elysian Wordmark"]
    reveal-duration: "4s"

  motion:
    resting-state: "0.8s" # R6: Silêncio obrigatório antes de qualquer movimento
    
---

## 1. Princípios de Implementação

### 1.1 A Lei dos Dois Mundos
O Mad Lab Aurora opera no **Mundo Luminoso** (#F8F7F3) e no **Mundo Dark** (#000000) com igual autoridade. A alternância entre mundos define a profundidade da marca.
*   **Mundo Dark (`world-dark`):** Ponto de entrada (Hero), seções técnicas, arquitetura profunda e forense.
*   **Mundo Luminoso (`world-luminous`):** Seções de realidade, impacto comercial e visão humana (Reality, Portfolio, Founder).

### 1.2 A Doutrina do Ar
O espaço negativo é um elemento ativo. Use margens generosas (`128px` entre seções de alto impacto). Nada deve parecer apertado.

### 2.2 Acento Cromático: Elysian Moss
O **Elysian Moss** (#4E5B4B) é a cor de autoridade orgânica da ElysianCorp. 
- **Uso**: Metadados, labels técnicas, botões boutique.
- **Doutrina**: A cor representa a transição da tecnologia para a autoridade orgânica e editorial.

---

## 3. Arquitetura do Hero (Imutabilidade v1.1.0)
O Hero Section é regido pela **Doutrina da Revelação Forense**.

### 3.1 GazeForensicHero (Canonical)
- **Estado Inicial (Mundo Dark)**: Stop-motion em preto e branco com fotos de rostos (Gaze) e letras da palavra ELYSIAN. 
- **Cromatismo**: Letras e metadados em **Elysian Moss** (#4E5B4B).
- **Transição**: Mudança fluida para o **Mundo Luminoso** (#F9F8F6).
- **Finalização**: Revelação da marca ELYSIAN em Ink, com subtítulo editorial.

### 3.2 Componentes Depreciados (Legacy)
- `CinemaHero`: Removido por não atender aos requisitos de impacto forense e imutabilidade estrutural.
- `ExoFluidHero`: Mantido em repositório apenas para estudo de shaders, não autorizado para produção.
- `ScrambleArchitecture`: Antigo sistema de entrada. **Status: Deprecated** em favor da soberania do Stop-Motion v1.1.0.

### 2.3 Resting State (Silêncio Operacional)
Todo componente interativo ou animado deve respeitar um estado de repouso mínimo de **0.8s** antes de iniciar qualquer movimento. O silêncio precede o impacto.

### 2.4 Typography Adaptive
*   **Display:** Sempre `t-display` com peso black/bold e tracking `tighter`.
*   **Editorial:** Sempre `t-editorial` com peso light e itálico quando apropriado.
*   **Technical:** Sempre `t-mono` para metadados e tags.

### 2.4 Rain System (Sistema Técnico)
Presente em ambas as fases do hero e em seções de transição. É evidência de sistema, não decoração.

---
**Nota:** Este arquivo é a verdade técnica do design ElysianCorp. Qualquer desvio deve ser auditado pelo `qa-review`.

