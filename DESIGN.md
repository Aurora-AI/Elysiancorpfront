# DESIGN.md — ElysianCorp Trustware
Este documento define as diretrizes determinísticas de design para a ElysianCorp, 
agora sob a constituição do **Elysian Brand Kit v1.1.0**.

---
design-tokens:
  project: "ElysianCorp Trustware"
  version: "1.1.1"
  governance: "./docs/brand/ELYSIAN_BRAND_KIT_v1.1.md"
  
  colors:
    base:
      white: "#FFFFFF"
      off-white: "#F8F7F3" # Papel Premium / Identidade Luminosa
      fog: "#F2F1ED"
      obsidian: "#000000" # Preto Absoluto / Identidade Dark
      obsidian-deep: "#0A0A0A"
      obsidian-technical: "#0D0D0D"
      
    accent:
      emerald: "#10B981" # Integrity Emerald
      emerald-hover: "#059669"
      
    text:
      primary: "#0A0A0A" # Ink
      secondary: "#1A1A1A"
      on-dark: "#F2F2F2"
      on-dark-muted: "rgba(242, 242, 242, 0.7)"
      on-dark-meta: "rgba(242, 242, 242, 0.4)"

  typography:
    display:
      family: "'Söhne', 'Plus Jakarta Sans', system-ui"
      weights: [700, 800]
      tracking: "-0.04em"
    body:
      family: "'Söhne', 'Plus Jakarta Sans', system-ui"
      weights: [300, 500]
    data:
      family: "'JetBrains Mono', 'Space Mono', monospace"
      tracking: "0.18em"

  spacing:
    scale: [4, 8, 16, 24, 40, 64, 96, 128]
    unit: "px"

  hero:
    dark-phase:
      duration: "5s"
      rain-opacity: "0.18"
    luminous-phase:
      wordmark-tracking: "-0.04em"
      wordmark-weight: 800
    transition:
      duration: "2s"
      easing: "cubic-bezier(0.76, 0, 0.24, 1)"

  motion:
    resting-state: "0.8s" # R6: Silêncio obrigatório antes de qualquer movimento
    hero-transition: "2s"
    
---

## 1. Princípios de Implementação

### 1.1 A Lei dos Dois Mundos
O Mad Lab Aurora opera no **Mundo Luminoso** (#F8F7F3) e no **Mundo Dark** (#000000) com igual autoridade. Nenhum mundo é secundário. A transição entre eles é a narrativa central.

### 1.2 A Doutrina do Ar
O espaço negativo é um elemento ativo. Use margens generosas (`128px` entre seções de alto impacto). Nada deve parecer apertado.

### 1.3 Dark Editorial Earned
O fundo preto deve ser **conquistado narrativamente**. O dark é uma arma cirúrgica, não um estado padrão. O fluxo ideal: **Luminoso -> Luminoso -> Dark (Tensão) -> Retorno ao Luminoso**.

### 1.4 Acento de Integridade
O **Integrity Emerald** (#10B981) é o único acento permitido. Singularidade por seção.

## 2. Componentes Críticos

### 2.1 Hero Stop-Motion Architecture
O Hero executa o fluxo **Máquina → Humano**. Inicia em **Dark (#000000)** com o Rain System técnico e transiciona para o **Luminoso (#F8F7F3)** com o wordmark ELYSIAN massivo.

### 2.2 Resting State (Silêncio Operacional)
Todo componente interativo ou animado deve respeitar um estado de repouso mínimo de **0.8s** antes de iniciar qualquer movimento. O silêncio precede o impacto.

### 2.3 Typography Adaptive
Em seções Dark, use `on-dark-muted` para corpo. Em seções Luminosas, use `primary` (#0A0A0A) para display e `secondary` (#1A1A1A) para corpo.

### 2.3 Rain System (Sistema Técnico)
Presente em ambas as fases do hero e em seções de transição. Opacidade 15-25% no dark e 6-12% no luminoso. É evidência de sistema, não decoração.


---
**Nota:** Este arquivo é gerado e mantido em sincronia com o Brand Kit Global. 
Qualquer desvio deve ser auditado pelo `qa-review`.
