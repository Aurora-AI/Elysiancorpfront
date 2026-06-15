# Design — Console de Prova Forense ("The Evidence Ledger")

**Data:** 2026-06-14
**Projeto:** ElysianCorp (MadLab Aurora)
**Autor:** Comandante Rodrigo + malha de agentes
**Status:** Aprovado para escrita de plano

---

## 1. Contexto e objetivo

O site `ElysianCorp` é o ativo institucional usado para **candidatura aos programas de incentivo da Anthropic, Gemini e similares**. A hero declara a tese:

> *"O mercado aprendeu a escalar respostas. Nós construímos controle. Empresas não sofrem por falta de dados. Sofrem por perda de contexto."*

O foco do avaliador desses programas não é estética — é **evidência de que o sistema é real, está pronto e foi testado**. O repositório Aurora transborda essa prova (protocolo OS com evidência persistida, gates Trustware, QA formal, observabilidade), mas hoje o site **narra** a tese sem **amarrar cada afirmação a um artefato verificável**.

**Objetivo:** substituir a sequência cinematográfica atual (`SequenceRigFull`), logo abaixo da hero, por um **Console de Prova Forense** — uma grade interativa onde cada afirmação de capacidade abre uma evidência real, curada e sanitizada. O eixo narrativo é **safety/governança** (fail-closed, human-in-the-loop, auditabilidade), que é o que Anthropic/Gemini mais pesam.

### Não-objetivos (YAGNI)
- Não documentar "como se constrói o site" (processo de build).
- Não manter a sequência R3F na home (será desmontada do `index.astro`, não deletada).
- Não expor segredos, paths locais brutos, prompts ou código sensível ao avaliador externo.

---

## 2. Decisões travadas (do brainstorming)

1. **Abordagem:** Dashboard de prova interativo (não vídeo linear como entregável primário).
2. **Posição:** Substitui a seção atual, **logo abaixo da hero**. `GazeForensicHero` permanece.
3. **Eixo dos claims:** **Foco máximo em safety/governança**. Produtos (CRM/ElysianLex) são secundários.
4. **Vídeo:** Incluído no escopo. MP4 portátil derivado do próprio console (screen-capture guiado ou Remotion reusando `evidence.ts`).
5. **Preservação:** `SequenceRigFull` e câmaras R3F são desmontadas do `index.astro` mas **não deletadas** (git preserva; rota `/cinema` opcional). Spine de 6 estágios e a tese do Álvaro sobrevivem como estrutura organizadora.
6. **Anti-Alucinação:** Toda métrica/contagem é **colhida fisicamente do repo**, nunca inventada (princípio constitucional Aurora).

---

## 3. Conjunto de claims (safety/governança primeiro)

Cada claim é uma afirmação verificável no **presente/passado** ("está", "foi"), nunca futuro. Cada um mapeia para um artefato físico real, a ser confirmado pelo `harvest-evidence` antes de publicar.

### Cards primários — governança & controle
| # | Claim | Por que importa pro avaliador | Evidência-fonte (a confirmar) |
|---|---|---|---|
| 1 | **Nenhuma mutação de estado crítico sem gate determinístico não-LLM.** | "Controle" literal; guardrail fora do LLM | lib `trustware`, `stories_builder_gate_report.json` |
| 2 | **Promoção à produção exige aprovação humana explícita.** | Human-in-the-loop / oversight | commit OS-025 "gate humano explícito", `HumanPromotionGate` |
| 3 | **Nenhuma ação encerra sem evidência persistida e rastreável.** | Auditabilidade total | OS-019 evidence files, `QA_REPORT.md` |
| 4 | **Toda entrega passa por QA formal adversarial antes de fechar.** | Avaliação independente / testes | skill `qa-review`, `QA_REPORT.md`, benchmark OS-027 |
| 5 | **A fábrica é observável read-only — sem escrita, replay ou auto-reparo.** | Oversight com poder limitado | gateway de observabilidade, limites read-only |
| 6 | **Execução em micro-etapas com blast radius limitado e parada obrigatória.** | Contenção de risco | protocolo OS, regra da parada |

### Card secundário — safety de dados
| # | Claim | Evidência-fonte |
|---|---|---|
| 7 | **PII nunca alcança o LLM em plaintext** (ElysianLex). | `backend/lex_core/pii/tokenizer.py`, regras de domínio |

### Faixa secundária — produtos reais (compacta, sem modal individual)
CRM, ElysianLex, fábrica de síntese de frontend — apenas logos/labels com status "em produção", para mostrar que a governança opera sobre sistemas reais, não brinquedos.

---

## 4. Arquitetura de componentes (unidades isoladas)

Cada unidade tem propósito único, interface definida e dependências explícitas.

| Unidade | Propósito | Tipo | Depende de |
|---|---|---|---|
| `src/data/evidence.ts` | Manifesto tipado: claims + evidências + proveniência. Fonte única de verdade. | módulo TS | (nada) |
| `src/components/proof/ProofSection.astro` | Wrapper da seção: copy de transição + monta a ilha. Vai no `index.astro` no lugar do `SequenceRigFull`. | Astro | `EvidenceConsole`, `evidence.ts` |
| `src/components/proof/EvidenceConsole.tsx` | Ilha React (`client:visible`): grade + ledger header + estado do modal aberto. | React island | `ClaimCard`, `EvidenceModal`, `evidence.ts` |
| `src/components/proof/ClaimCard.tsx` | Card apresentacional de um claim (claim + chip de status + métrica + CTA). | React (puro) | tipos de `evidence.ts` |
| `src/components/proof/EvidenceModal.tsx` | `<dialog>` com evidência renderizada + faixa de proveniência + "o que isto prova". Focus-trap, ESC, scroll-lock. | React | tipos de `evidence.ts` |
| `scripts/harvest-evidence.mjs` | Colhe artefatos reais do repo Aurora, sanitiza, emite `public/evidence/*` + valida `evidence.ts`. Scan de segredos fail-closed. | Node script | repo Aurora |

### Contrato do manifesto (`evidence.ts`)
```ts
export type ClaimStatus = 'VERIFIED' | 'IN_PRODUCTION' | 'TESTED';
export type EvidenceKind = 'image' | 'code' | 'report' | 'metric';

export interface Provenance {
  sourcePath: string;   // caminho-fonte sanitizado (rótulo, não path local bruto)
  sha256?: string;      // hash do artefato
  commit?: string;      // SHA curto do commit que registrou
  timestamp: string;    // ISO
}

export interface Evidence {
  kind: EvidenceKind;
  asset: string;        // path em /evidence/* (imagem) ou conteúdo inline (excerto)
  caption: string;      // "o que isto prova"
  provenance: Provenance;
}

export interface Bilingual { en: string; pt: string; }  // EN primário, PT secundário

export interface Claim {
  id: string;
  index: string;        // "01", "02"... (label forense)
  title: Bilingual;     // a afirmação (bilíngue)
  status: ClaimStatus;
  tier: 'primary' | 'secondary';
  evidence: Evidence;   // evidence.caption também bilíngue
}
```

> **Idioma:** bilíngue com **EN primário** e PT secundário (toggle de idioma na seção; PT renderizado como sub-linha ou via toggle — decisão de UI no plano). Toda copy do console (`title`, `caption`, header, strip) carrega `{en, pt}`. **Stats row: REMOVIDA** (decisão do usuário) — o console vai direto da headline para o grid de claims.

---

## 5. Fluxo de dados + gate de publicação

```
artefatos do repo Aurora
   │
   ▼
scripts/harvest-evidence.mjs
   ├─ copia/curaa screenshots, excertos de QA, gate reports, trace summaries
   ├─ SANITIZA: remove paths locais brutos, prompts, código sensível, chaves
   ├─ SCAN DE SEGREDOS (fail-closed): se padrão sensível detectado → exit ≠ 0 → build falha
   └─ emite public/evidence/* + valida coerência com evidence.ts
   │
   ▼
src/data/evidence.ts  (fonte única, versionada)
   │
   ▼
EvidenceConsole (ilha) → ClaimCard[] → EvidenceModal
```

**Trustware aplicado à própria vitrine:** o site que vende "fail-closed" é ele mesmo fail-closed. O scan de segredos é um gate determinístico não-LLM; se ele falha, o build não passa. Isto é coerência narrativa *e* segurança real.

---

## 6. Design visual (on-brand forense)

- Reusa tokens existentes: dark, `--moss-bright`, labels mono em bracket (`[ 02 // THE EVIDENCE LEDGER ]`), display editorial, hairlines.
- Copy de transição da hero → prova: **"Não pedimos confiança. Mostramos o rastro."**
- Ledger header com contagens agregadas **reais** (colhidas).
- Grade responsiva; cards primários maiores, secundários compactos; faixa de produtos como logos.
- Hover sutil; respeita `prefers-reduced-motion` (codebase já usa `useReducedMotion` / `getAnimationDefaults`).

---

## 7. Erros & edge cases

| Caso | Comportamento |
|---|---|
| Evidência ausente no harvest | Card em estado "evidence pending" (meta: zero); harvest loga o gap |
| Segredo detectado no scan | Build **bloqueia** (fail-closed) |
| `prefers-reduced-motion` | Sem animação de hover/entrada |
| Modal | `role="dialog"`, focus-trap, ESC fecha, scroll-lock, retorna foco ao card |
| Asset de imagem quebrado | Fallback para excerto textual + aviso no build |

---

## 8. Estratégia de testes

Reusa Playwright + Vitest (já presentes no repo).
1. **Render:** console renderiza todos os claims de `evidence.ts`.
2. **Interação:** clicar cada card abre o modal com a evidência correta; ESC fecha.
3. **Gate (crítico):** `harvest-evidence` rejeita um segredo plantado (teste com fixture).
4. **A11y:** dialog tem role e foco corretos; navegação por teclado.
5. **Anti-regressão visual:** screenshot da seção (Playwright) comparado a baseline.

---

## 9. Entregável vídeo (MP4)

Derivado do console, **após** o console estar pronto:
- **Opção rápida:** screen-capture guiado (Playwright) do console + faixas de legenda → MP4.
- **Opção robusta:** composição Remotion reusando `evidence.ts` como fonte de dados (skill `remotion-best-practices`), narrando problema → mecanismo → prova → pedido.
- Decisão de qual opção fica para o plano de implementação.

---

## 10. Riscos & mitigação

| Risco | Mitigação |
|---|---|
| Exposição de dados sensíveis de clientes (CRM/ElysianLex) | Faixa de produtos só com label/status; nenhum dado de cliente; gate de sanitização |
| Métrica inventada (alucinação) | `harvest-evidence` colhe do repo; nenhum número entra em `evidence.ts` sem fonte |
| Perda do trabalho R3F | Desmontar do `index.astro`, **não deletar**; rota `/cinema` opcional |
| Evidência "envelhecer" (artefato muda) | Proveniência com commit/timestamp; re-harvest documentado |

---

## 12. Reconciliação com o protótipo Stitch ("Forense Evidence Ledger")

O protótipo HTML exportado (projeto `10342576978434415842`, tela `597c0d5e…`) é a **referência visual canônica**. Foi desenhado a partir do Elysian Brand Kit v1.2.1; tokens batem com `src/styles/tokens.css` e `tailwind.config.mjs`.

**Adotamos do protótipo:** apenas a `<section id="evidence-ledger">` (mundo Sovereign Black + halftone grain) e o modal de proveniência.
**Descartamos:** o hero próprio do protótipo (mantemos `GazeForensicHero`) e o footer (site já tem o seu).

**Estrutura visual travada:**
- Mundo da seção: `sovereign-bg #000` + `sovereign-ink #F2F2F2` + textura `bg-halftone-grain` (SVG fractalNoise, opacity 0.02).
- Label: `[ 02 // THE EVIDENCE LEDGER ]`; headline "We Don't Ask for Trust. We Show the *Trace*." (italic moss).
- ~~Stats row~~ **REMOVIDA** — headline vai direto para o grid.
- Grade assimétrica 12-col (col-span 5/7/4/8/6/6) com 6 cards primários, strip Data Privacy, linha de produtos.
- Hover invert (`hover-invert-card`): fundo vira `sovereign-ink`, texto vira `sovereign-bg`.
- Modal: code artifact (esq.) + lista de metadados (dir.): Commit SHA, Source, Timestamp, Signature.

**Mapeamento de tokens (protótipo → real):** `elysian-moss-light→--moss`, `elysian-moss-dark→--moss-bright`, `parchment-bg→--parchment`, `sovereign-ink→--text-primary-dark`. Os nomes do protótipo serão adicionados ao `tailwind.config.mjs` para preservar o markup exportado com mínimo retrabalho.

**Upgrade obrigatório vs. protótipo:** o protótipo usa `onclick` global + `openModal` solto, sem a11y. Reimplementar como ilha React `EvidenceConsole` com focus-trap, retorno de foco, ESC, scroll-lock e `prefers-reduced-motion`.

---

## 13. Inventário Mock → Real (CRÍTICO — Anti-Alucinação)

O protótipo tem **todos os dados fabricados**. Nenhum destes valores pode chegar à produção sem fonte física verificada. Esta é a tarefa central de credibilidade.

| Local no protótipo | Valor mock | Ação obrigatória |
|---|---|---|
| Stats row inteira | `142GB` / `100%` / `07` | **REMOVIDA** (decisão do usuário) |
| Card 1 source | `/backend/gate.py` | `libs/trustware/…` (path real) |
| Card 2 source | `/ops/deploy.yml` | `HumanPromotionGate` real + commit OS-025 |
| Card 3 source | `/docs/audit/QA_REPORT.md` | `QA_REPORT.md` real (frontend_synthesis) |
| Card 4 source | `/src/qa/adversarial.ts` | skill `qa-review` + benchmark OS-027 |
| Card 5 source | `/infra/auth/gateway.go` | `observability_mcp_gateway/server.py` (**não existe Go no repo**) |
| Card 6 source | `/core/execution/step.rs` | protocolo OS / OS_TEMPLATE (**não existe Rust no repo**) |
| Commit SHAs | `e2f8a1` etc. | SHAs reais via `git log` |
| Modal code | `verify_state_mutation` hardcoded (igual em todos) | excerto real e sanitizado por claim |
| Data Privacy strip | "zero-knowledge proofs" | **overclaim** → corrigir para tokenização (`tokenizer.py`) + Trustware seal |
| Produto | "Fiduciary (BETA)" | **SUBSTITUÍDO** pela malha agêntica (Álvaro / Fábrica Governada Aurora) — meta-diferencial real e spine da narrativa. Linha final: **CRM Aurora · ElysianLex · Álvaro (Agentic Mesh)**. Fallback reversível: "Living Document" (feature do ElysianLex) |
| Footer | "©2024" | `2026` |
| Modal "Signature: Verified by Elysian Core" | implica assinatura | mapear para mecanismo real (hash/seal Trustware) ou suavizar a copy |

**Regra de gate:** `harvest-evidence` falha o build se um card referenciar artefato cuja fonte física não foi confirmada (fail-closed).

---

## 14. Decisões resolvidas + abertas

**Resolvidas:**
1. ✅ **Idioma:** bilíngue, **EN primário** + PT secundário (toggle/sub-linha — UI no plano).
2. ✅ **Stats row:** removida.
3. ✅ **Produto fantasma:** Fiduciary → malha agêntica (Álvaro). Linha: CRM Aurora · ElysianLex · Álvaro.

**Abertas (para o plano):**
1. **Vídeo MP4:** screen-capture guiado (rápido) vs. Remotion reusando `evidence.ts` (robusto).
2. **UI bilíngue:** toggle de idioma vs. PT como sub-linha permanente.
3. **Métrica real do harvest:** quais números reais existem para eventual reuso no vídeo.

---

## 11. Definição de pronto

- [ ] `evidence.ts` populado só com evidências de fonte real confirmada.
- [ ] Console montado abaixo da hero; `SequenceRigFull` desmontado (preservado).
- [ ] Gate de sanitização fail-closed funcionando e testado.
- [ ] Modais acessíveis; reduced-motion respeitado.
- [ ] Testes (render, interação, gate, a11y) passando.
- [ ] MP4 gerado.
- [ ] Build de produção verde.
