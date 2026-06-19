# Design — Section 04: Elysian Lex (Live PII Tokenization Pipeline)

**Data:** 2026-06-19
**Projeto:** ElysianCorp (MadLab Aurora)
**Status:** Aprovado para escrita de plano
**Antecede:** Cognitive Mesh (`[ 03 ]`). Esta é a `[ 04 ]`, montada abaixo do `AlvaroSection`.

---

## 1. Contexto e objetivo

A home hoje é: `GazeForensicHero` (tese) → `Evidence Ledger` (prova) → `Cognitive Mesh` (a mente do Álvaro). Falta a seção que mostra **a mente governada aplicada a um domínio real e de alto risco**: o jurídico (Elysian Lex).

A navegação (`Header.tsx`) já promete quatro âncoras — `Trustware · Architecture · Elysian Lex · Silent Ops`. As duas primeiras existem (Ledger = Trustware, Mesh = Architecture). **Elysian Lex é a próxima na ordem declarada.**

O requisito do cliente: trazer movimento à seção (sem vídeo — não há nenhum arquivo de vídeo no repo) para tirar a "cara de revista" do site e ecoar a energia técnica/forense do Hero. A solução: **não animar uma foto, e sim animar a própria lógica do produto** — o pipeline de tokenização de PII, ao vivo.

Esta seção é a **demonstração viva do Claim 07 do Evidence Ledger** (`pii-tokenization`): *"PII never reaches the LLM in plaintext — tokenized in transit, sealed by Trustware."*

### Não-objetivos (YAGNI)
- Sem faixa de telemetria/cockpit (rotas LLM, contadores avançados, status detalhado).
- Sem mundo híbrido split (transição parchment↔escuro durante o scrub) — dobra complexidade de implementação e legibilidade.
- Sem dados reais de HMAC — o hex dos tokens é ilustrativo; o **formato** é fisicamente real.
- Sem reuso do efeito de flicker do Hero aqui (esse efeito é reservado para a futura seção do Fundador).

---

## 2. Decisões travadas (do brainstorming)

1. **Trigger:** scroll-driven (GSAP ScrollTrigger scrub), consistente com o Cognitive Mesh.
2. **Documento:** petição jurídica realista e curta (4–5 linhas), com PII real e o detalhe da stopword inteligente.
3. **Profundidade:** 5 estágios (o arco completo do Claim 07), sem telemetria lateral.
4. **Mundo visual:** escuro técnico (como o Evidence Ledger) — restabelece o ritmo claro→escuro depois do Mesh e conecta visualmente Lex↔Ledger (são a mesma prova).
5. **Título:** foco na garantia — *"The LLM never sees your client."* / *"O LLM nunca vê seu cliente."*
6. **Anti-Alucinação:** todo formato de token, tipo de PII e stopword é fisicamente verificado contra `ElysianLex/backend/lex_core/lex_core/pii/tokenizer.py`.

---

## 3. Fonte de verdade física (tokenizer.py)

Verificado em `C:\Projetos\Aurora\ElysianLex\backend\lex_core\lex_core\pii\tokenizer.py`:

- **Formato do token:** `f"TOK_{pii_type.upper()}_{sig}"`, onde `sig` = 16 caracteres hex (HMAC-SHA256 truncado). No output, vem entre colchetes: `[TOK_CPF_a1b2c3d4e5f6a7b8]`.
- **Tipos de PII detectados:** `cpf`, `cnpj`, `email`, `phone`, `rg`, `cnh`, `address`, `processo` (CNJ), `oab`, `name`.
- **Isolamento por tenant:** salt HMAC derivado do `tenant_id` → o mesmo PII gera tokens diferentes por tenant.
- **Stopwords jurídicas (`_LEGAL_STOPWORDS`):** nomes como `"Justiça Federal"`, `"Ministério Público"`, `"Tribunal Superior"` casam o regex de `name`, mas são **excluídos** da tokenização. Esse é o "detalhe-ouro".
- **Destokenização** (`detokenize_text`) só substitui `[tok]` → original; no produto, ocorre **apenas no output final** ao usuário, nunca em armazenamento intermediário.
- **Selo Trustware** obrigatório antes de persistir qualquer análise (regra de domínio do `CLAUDE.md` do ElysianLex).

> O plano deve re-confirmar essas âncoras antes de fixar (mesma disciplina do harvest do Ledger).

---

## 4. O documento que atravessa o pipeline

Petição fictícia mas verossímil, calibrada para exercitar 4 tipos de PII + 2 stopwords:

> "Intima-se **João Carlos da Silva**, CPF **123.456.789-00**, **OAB/SP 187.432**, nos autos do processo **0034567-89.2025.4.03.6100**, em trâmite na Justiça Federal, com vista ao Ministério Público, para manifestação no prazo legal."

| Trecho | Tipo | Token (formato real, hex ilustrativo) |
|---|---|---|
| João Carlos da Silva | `name` | `[TOK_NAME_3a9f1c7e2b8d4f06]` |
| 123.456.789-00 | `cpf` | `[TOK_CPF_b2c4e6a8d0f2a4c6]` |
| OAB/SP 187.432 | `oab` | `[TOK_OAB_7d1e3f5a9c2b8e04]` |
| 0034567-89.2025.4.03.6100 | `processo` | `[TOK_PROCESSO_5f8a2c1d7e9b3a06]` |
| Justiça Federal | stopword | **(intacto — não tokenizado)** |
| Ministério Público | stopword | **(intacto — não tokenizado)** |

---

## 5. Os 5 estágios (scroll scrub)

| # | Estágio (EN / PT) | O que acontece visualmente |
|---|---|---|
| 1 | Raw document / Documento bruto | Texto branco, PII em plaintext, sutil destaque nos spans sensíveis |
| 2 | Tokenization / Tokenização | Scan-line forense varre o texto; cada span PII morfa de plaintext → token hex; stopwords ficam intactas; contador de "PII redigida" sobe (4) |
| 3 | LLM reasoning (blind) / Raciocínio do LLM (cego) | O texto tokenizado "alimenta" um nó de modelo rotulado `reasoning · Claude Sonnet 4.6`; ênfase visual de que só tokens entram |
| 4 | Trustware seal / Selo Trustware | Gate determinístico carimba/sela o output antes de persistir (badge "SEALED") |
| 5 | Detokenization (final output) / Destokenização (output final) | Os tokens voltam ao valor real **só na entrega ao advogado**; output limpo e legível |

---

## 6. Copy (bilíngue, EN-primário, herda o toggle EN/PT)

- **Label:** `[ 04 // ELYSIAN LEX ]`
- **Título:** EN **"The LLM never sees your client."** / PT **"O LLM nunca vê seu cliente."**
- **Sub-linha:** EN **"Names, CPFs, case numbers — tokenized before a single token reaches the LLM. Detokenized only when the answer returns to you."** / PT **"Nomes, CPFs, números de processo — tokenizados antes de um único token alcançar o LLM. Destokenizados só quando a resposta volta para você."**
- **Labels de estágio:** bilíngues, conforme tabela §5.
- **Legenda do contador:** EN "PII redacted" / PT "PII redigida".

---

## 7. Arquitetura de componentes (unidades isoladas)

| Unidade | Propósito | Tipo | Depende de |
|---|---|---|---|
| `src/data/lex-pipeline.types.ts` | Contratos + guards: `PiiSpan` (`text`, `type`, `token`), `DocSegment` (`string \| PiiSpan`), `LexDocument`, `Stage` (`id`, `label{en,pt}`). Guard `isPiiSpan`. | módulo TS | — |
| `src/data/lex-pipeline.ts` | Fonte única: o documento como `DocSegment[]`, o `STAGES` (5), e a copy. Tokens no formato real. | módulo TS | types |
| `src/lib/lex-stages.ts` | Pura/testável: `stageAt(progress: number): { index: number; local: number }` mapeia scroll 0–1 → estágio atual + progresso interno (0–1). Determinística. | módulo TS | types |
| `src/components/lex/TokenText.tsx` | Apresentacional: um span PII renderizado em um de 4 estados — `plaintext`, `redacting`, `token`, `restored`. Sem lógica de scroll. | React | types |
| `src/components/lex/LexPipeline.tsx` | Ilha (`client:visible`): timeline GSAP ScrollTrigger scrub; deriva estado de cada span/estágio via `lex-stages`; reduced-motion → estático. | React island | data, lib, TokenText |
| `src/components/lex/LexSection.astro` | Wrapper mundo escuro + header (label/título/sub-linha) + grão; monta a ilha. | Astro | LexPipeline, lex-pipeline.ts |
| `src/pages/index.astro` | Montar `<LexSection />` **abaixo do `AlvaroSection`**. | Astro | LexSection |

### Contrato (lex-pipeline.types.ts)
```ts
export interface Bilingual { en: string; pt: string; }

export type PiiType = 'name' | 'cpf' | 'cnpj' | 'email' | 'phone'
  | 'rg' | 'cnh' | 'address' | 'processo' | 'oab';

export interface PiiSpan {
  text: string;   // plaintext original (ex: "João Carlos da Silva")
  type: PiiType;  // tipo detectado
  token: string;  // formato real: TOK_<TYPE>_<16hex>
}

export type DocSegment = string | PiiSpan;

export interface LexDocument { segments: DocSegment[]; }

export interface Stage { id: string; label: Bilingual; }

export function isPiiSpan(v: unknown): v is PiiSpan {
  if (!v || typeof v !== 'object') return false;
  const s = v as PiiSpan;
  return typeof s.text === 'string'
    && typeof s.token === 'string'
    && /^TOK_[A-Z]+_[0-9a-f]{16}$/.test(s.token);
}
```

### Mapeamento de estado por estágio (TokenText)
- Estágio 1 (Documento bruto): todos os spans em `plaintext`.
- Estágio 2 (Tokenização): spans transicionam `plaintext` → `redacting` → `token` conforme `local` (progresso interno) cruza o índice do span. Stopwords permanecem texto normal (não são `PiiSpan`).
- Estágios 3–4: spans permanecem `token`.
- Estágio 5 (Destokenização): spans transicionam `token` → `restored` (mostram `text` de novo).

---

## 8. Mundo visual & gramática (Cinematic Grammar)

- **Paleta:** fundo `#0D0D0C`/obsidian (igual mundo escuro do Hero/Ledger); texto `white/80`; tokens em **moss `#4E5B4B`** e âmbar técnico (acendendo no escuro); stopwords em `white/50`; scan-line em moss translúcido.
- **Tipografia:** mono (JetBrains) no documento/tokens (sensação de terminal forense); display serif no título; mono nos labels de estágio.
- **Grão analógico** sutil (consistente com as outras seções).
- **Scan-line:** uma faixa horizontal que varre o documento no estágio 2 (tokenização), revelando os tokens conforme passa.
- **Nó LLM (estágio 3):** bloco mono simples rotulado `reasoning · Claude Sonnet 4.6`, recebendo só tokens.
- **Selo (estágio 4):** badge "SEALED" carimbando com escala/opacidade.

### Motion (primitivos)
- **Scrub:** ScrollTrigger `scrub` (igual Mesh), `start: 'top 75%'`, `end: 'bottom 30%'` (ajustável no plano).
- **Morph de token:** transição de `plaintext` → `token` com fade/blur curto por span, escalonado.
- **`prefers-reduced-motion`:** sem timeline; renderiza estado final estático (ver §9).

---

## 9. Degradação graciosa & edge cases

- **`prefers-reduced-motion`:** renderiza o **estado final estático** — documento totalmente tokenizado + badge "SEALED" + o output destokenizado mostrado lado a lado (ou empilhado). A prova completa, sem animação.
- **GSAP/ScrollTrigger ausente (falha de import):** renderizar estado estático (mesma variante reduced-motion). Degradação graciosa.
- **SSR:** ilha `client:visible` (sem SSR da animação), como Ledger/Mesh.
- **Cleanup GSAP:** usar `tl.scrollTrigger?.kill()` escopado à própria timeline (NÃO `ScrollTrigger.getAll()`), conforme lição do `AlvaroMesh`.
- **Span sem token válido:** o guard `isPiiSpan` rejeita; teste de integridade de dados garante que todo `PiiSpan` tem formato `TOK_<TYPE>_<16hex>`.

---

## 10. Testes (Vitest + RTL, mock de GSAP)

1. `lex-stages.stageAt`: fronteiras determinísticas — `progress` 0→1 mapeia para índices 0–4 com `local` correto (snapshot de valores-chave).
2. `TokenText`: renderiza corretamente cada um dos 4 estados (`plaintext`, `redacting`, `token`, `restored`).
3. Integridade de dados (`lex-pipeline.ts`): todo `PiiSpan` passa `isPiiSpan`; o documento contém ao menos 1 stopword como string pura (não-`PiiSpan`); contagem de spans PII = 4.
4. `LexPipeline` reduced-motion → variante estática (sem timeline GSAP).
5. `LexPipeline` renderiza todos os segmentos do documento e os 5 labels de estágio.
6. Build de produção verde.

Mock de GSAP: factory `vi.mock('gsap', ...)` retornando `timeline()` → `{ to, set, kill }`, como no `alvaro-mesh.test.tsx`.

---

## 11. Riscos & mitigação

| Risco | Mitigação |
|---|---|
| Alegar token/tipo inexistente | Verificar tudo contra `tokenizer.py` antes de fixar; formato regex no guard |
| Animação competir com leitura | Documento curto (4–5 linhas); morph escalonado, não simultâneo |
| Scrub conflitar com Lenis/outros ScrollTriggers | Cleanup escopado (`tl.scrollTrigger?.kill()`), lição do AlvaroMesh |
| Legibilidade de tokens hex no escuro | Tokens em moss/âmbar com contraste alto; mono |
| Dois mundos escuros seguidos (Ledger longe, mas Mesh é claro antes) | Mesh claro intervém entre Ledger e Lex — ritmo preservado |

---

## 12. Definição de pronto

- [ ] `lex-pipeline.ts` com documento + tokens verificados contra `tokenizer.py` (formato real, stopwords corretas).
- [ ] Pipeline renderiza os 5 estágios no mundo escuro, abaixo do AlvaroSection.
- [ ] Scroll scrub: plaintext → tokenização → LLM cego → selo → destokenização.
- [ ] Stopwords permanecem intactas durante a tokenização (detalhe-ouro visível).
- [ ] Título/sub-linha bilíngues; contador de PII redigida.
- [ ] reduced-motion → estado final estático.
- [ ] Testes (stages, TokenText, integridade de dados, reduced-motion, render) verdes.
- [ ] Build de produção verde.
