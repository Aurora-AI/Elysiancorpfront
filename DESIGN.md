# DESIGN.md — ElysianCorp Trustware
Este documento define as diretrizes determinísticas de design para a ElysianCorp, 
integrado ao **Elysian Design System v1.2.0**.

---
design-tokens:
  project: "ElysianCorp Trustware"
  version: "1.2.0"
  source: "C:\Projetos\Aurora\ElysianLex\docs\Elysian Design System"
  governance: "./docs/brand/ELYSIAN_BRAND_KIT_v1.1.md"
  
  colors:
    base:
      white: "#FFFFFF"
      off-white: "#F8F7F3" # Papel Premium / Mundo Luminoso
      fog: "#F2F1ED"
      black: "#000000" # Preto Absoluto / Mundo Dark
      obsidian: "#0A0A0A"
      obsidian-technical: "#0D0D0D"
      
    accent:
      emerald: "#10B981" # Integrity Emerald
      emerald-hover: "#059669"
      emerald-muted: "rgba(16, 185, 129, 0.08)"
      
    verticals:
      crm:
        paper: "#fbf9f5"
        rust: "#984731"
        steel: "#535f6f"
        navy: "#041627"
      lex:
        sovereign: "#000000"
        emerald: "#10B981"
      madlab:
        amber: "#D97706"

  typography:
    family:
      brand: "'Lanche', 'Plus Jakarta Sans', sans-serif"
      display: "'Plus Jakarta Sans', system-ui, sans-serif"
      body: "'Plus Jakarta Sans', system-ui, sans-serif"
      technical: "'JetBrains Mono', monospace"
      lex-serif: "'Crimson Pro', Georgia, serif"
    weights:
      light: 300
      regular: 400
      medium: 500
      bold: 700
      black: 800
    tracking:
      tighter: "-0.04em"
      tight: "-0.02em"
      wide: "0.18em"

  spacing:
    scale: [4, 8, 16, 24, 40, 64, 96, 128]
    unit: "px"

  hero:
    style: "Cinema / Scramble Architecture"
    background: "#F8F7F3" # Mundo Luminoso
    elements: ["Scramble Portrait", "Industrial Grid", "Technical Rain"]
    reveal-duration: "3s"

  motion:
    resting-state: "0.8s" # R6: Silêncio obrigatório antes de qualquer movimento
    
---

## 1. Princípios de Implementação

### 1.1 A Lei dos Dois Mundos
O Mad Lab Aurora opera no **Mundo Luminoso** (#F8F7F3) e no **Mundo Dark** (#000000) com igual autoridade. A alternância entre mundos define a profundidade da marca.
*   **Mundo Luminoso (`world-luminous`):** Seções de realidade, impacto comercial e visão humana (Reality, Portfolio, Founder).
*   **Mundo Dark (`world-dark`):** Seções técnicas, arquitetura profunda e forense (Architecture, Footer).

### 1.2 A Doutrina do Ar
O espaço negativo é um elemento ativo. Use margens generosas (`128px` entre seções de alto impacto). Nada deve parecer apertado.

### 1.3 Dark Editorial Earned
O fundo preto é reservado para momentos de revelação técnica e autoridade sistêmica. Não é um estado passivo; é uma declaração de poder.

### 1.4 Acento de Integridade
O **Integrity Emerald** (#10B981) é o único acento permitido. Singularidade por seção.

## 2. Componentes Críticos

### 2.1 Hero Cinema Architecture (Original)
O Hero utiliza o sistema de Scramble Portrait e Industrial Grid sobre fundo Luminoso (#F8F7F3). É o ponto de entrada primário e imutável.

### 2.2 Forensic Stop-Motion Section (v1.1.0)
Seção secundária de alto impacto (Stop-Motion) que alterna entre retratos abstratos e wordmark. Utiliza a sequência original de letras e fotos (Protocolo Gaze Forensic). Transiciona do Dark para o Luminous (#F8F7F3) para manter a coerência narrativa.

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

