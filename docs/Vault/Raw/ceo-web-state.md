---
name: ceo-web-state
version: 1.1.0
type: living-document
updated: 2026-04-24
owner: site-builder
consumers: [ceo-web, ceo-copy, ceo-effects, landing-page-architect]
description: >
  Documento de estado vivo do site Aurora institucional. Registra O QUE
  está implementado, como se chama, em qual arquivo, e qual função narrativa
  cobre. NÃO toma decisões arquiteturais — reflete o estado atual do código.
  Atualizado pelo site-builder após cada OS de implementação. Consultado
  por qualquer agente que precise saber "o que existe hoje" antes de propor
  mudanças.
---

# CEO-WEB-STATE — Mapa de Implementação

> Este documento descreve o que **existe** no código hoje.
> Para decisões sobre o que **deveria existir**, consultar `ceo-web`.

---

## Como usar este documento

| Se você quer saber... | Consulte |
| --- | --- |
| O que está implementado hoje | Este documento ✓ |
| Como se chama o componente do hero | Este documento ✓ |
| O que está no index.astro | Este documento ✓ |
| Se a estrutura atual serve ao argumento | ceo-web |
| O que deveria ir em cada seção | ceo-web |
| Como reescrever a arquitetura | ceo-web |

---

## Protocolo de Atualização

**Quem atualiza:** site-builder, após cada OS de implementação concluída.

**Quando atualizar:**

- Nova seção criada ou removida
- Componente renomeado
- Ordem de seções alterada
- Arquivo de entrada modificado

**Como atualizar:** editar as seções abaixo e registrar a OS que gerou
a mudança no CHANGELOG ao final do documento.

**O que NÃO vai aqui:**

- Decisões de por que algo foi estruturado assim → BRIEFING DE ARQUITETURA (ceo-web)
- Copy das seções → documentação do ceo-copy
- Tokens visuais → DESIGN.md

---

## Estado Atual — Site Institucional Aurora

**Arquivo de entrada:** `src/pages/index.astro`
**Framework:** Astro
**Data do último update:** 2026-04-23
**OS de referência:** [preencher com OS que gerou a implementação atual]

---

## Resultados da Auditoria (v1.1.0)

| Seção | Componente Atual | Status vs. Briefing | Ação Necessária |
| --- | --- | --- | --- |
| 1. HERO | `GazeForensicHero` | ⚠️ Alinhado (Visual) / Divergente (Copy) | Tweak copy para "Filtro Técnico" |
| 2. REALITY | `TrustwareClients` | ❌ Divergente | Substituir por demo ElysianLex |
| 3. ARCH | `TrustwareProblem` | ❌ Divergente | Substituir por Arquitetura MCP/Agents |
| 4. PORTFOLIO | `TrustwareAnswer` | ❌ Divergente | Substituir por Bento Portfolio |
| 5. FOUNDER | (None) | ❌ Ausente | Criar seção Founder (Repurposing `TrustwareClients`) |
| 6. CTA | `ForensicFooter` | ⚠️ Alinhado | Tweak CTA para alvo técnico/evaluator |

---

## Mapa de Seções (Implementação Atual)

### SEÇÃO 1

**Componente:** `GazeForensicHero`
**Arquivo:** `src/components/hero/GazeForensicHero.tsx`
**Status:** ⚠️ AUDITADO - Requer ajuste de copy subheadline.
**Notas:** O visual é S-Tier, mas o sub-texto precisa ser menos poético e mais posicional.

---

### SEÇÃO 2 (LEGACY)

**Componente:** `TrustwareClients`
**Arquivo:** `src/components/sections/TrustwareClients.tsx`
**Status:** ❌ DEPRECATED - Será movido para Seção 5.
**Notas:** Atualmente funciona como prova social genérica. O briefing exige Prova de Realidade técnica aqui.

---

### SEÇÃO 3 (LEGACY)

**Componente:** `TrustwareProblem`
**Arquivo:** `src/components/sections/TrustwareProblem.tsx`
**Status:** ❌ DEPRECATED - Será removido/fundido.
**Notas:** Foca em "dor", briefing exige "Arquitetura Proprietária" (Solução Técnica).

---

### SEÇÃO 4 (LEGACY)

**Componente:** `TrustwareAnswer`
**Arquivo:** `src/components/sections/TrustwareAnswer.tsx`
**Status:** ❌ DEPRECATED - Será removido.
**Notas:** Muito abstrato. Requer substituição por Portfólio de Produtos (Bento Grid).

---

### SEÇÃO 5

**Componente:** `ForensicFooter`
**Arquivo:** `src/components/sections/ForensicFooter.tsx`
**Status:** ⚠️ AUDITADO - Requer ajuste de CTA.
**Notas:** O layout está correto, mas o texto do CTA deve ser focado em "Technical Evaluator".

---

## Gaps Identificados

| Gap | Briefing prevê | Implementado | Ação |
| --- | --- | --- | --- |
| Seção 2 | Reality Proof (Demo) | Clients (Logos) | Criar `TrustwareReality.tsx` |
| Seção 3 | Architecture (MCP) | Problem (Tension) | Criar `TrustwareArchitecture.tsx` |
| Seção 4 | Portfolio (Bento) | Answer (Abstract) | Criar `TrustwarePortfolio.tsx` |
| Seção 5 | Founder | N/A | Criar `TrustwareFounder.tsx` |


> ⚠️ Gaps acima são observações preliminares baseadas em comparação de nomes.
> Auditoria real requer leitura do conteúdo de cada componente.

---

## Configuração Técnica

```text
Framework: Astro
Styling: Tailwind CSS v3
Motion: GSAP 3 / ScrollTrigger
Deploy: TBD
Repositório: MadLabAurora/ElysianCorp
Branch principal: main
```

---

## Paleta de Temperatura (EQ de Frequências)

Sistema de alternância de temperatura aplicado às seções:

| Temperatura | Nome | Uso |
| --- | --- | --- |
| Dark (alta densidade) | Ink | Seções de tensão, diagnóstico, CTA |
| Light (baixa densidade) | Parchment | Seções de prova, resposta, confiança |


**Sequência atual:** Dark → Light → Dark → Light → Dark

---

## CHANGELOG

```text
[2026-04-23] v1.0.0 — Documento criado. Estado inicial mapeado a partir
             de resposta do agente sobre seções implementadas. Requer
             auditoria para confirmar alinhamento com briefing ceo-web.
```

---

## Próxima Auditoria Recomendada

**Ação imediata:** Comparar conteúdo real de cada componente com a função
narrativa do briefing `ceo-web`. Preencher coluna "Status" da tabela de
seções acima.

**Quem executa:** site-builder ou product-integrity-engineer
**Output esperado:** Lista de seções alinhadas vs. divergentes com ação
por seção
