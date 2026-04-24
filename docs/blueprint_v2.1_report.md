# RELATÓRIO DE ARQUITETURA — ELYSIAN CORP v2.1

**Mandato:** Light World v2.1 | **DNA:** Alquimista Forense
**Agentes Acionados:** `agente-awwwards`, `landing-page-architect`, `ceo-design`, `ceo-effects`, `ceo-copy`

---

## 1. SÍNTESE DE CURADORIA (agente-awwwards)

Com base nas referências locais (**Exo Ape**, **Aino**, **R-K**, **Lusion**) e no padrão **Dark Editorial**, sintetizamos o DNA visual para o ambiente Light World:

| Atributo | Origem | Aplicação Elysian |
| :--- | :--- | :--- |
| **Tipografia como Arquitetura** | Aino / R-K | Cormorant Garamond 300 servindo como âncora estrutural do layout. |
| **Transição de Camadas** | Exo Ape | Uso de `IdentityFragmenter` para revelar o "gap" entre o dado e a verdade. |
| **Grids de Diagnóstico** | R-K | Bordas de 0.5px e coordenadas cartesianas para emoldurar métricas. |
| **Silêncio Autoritário** | Exo Ape | Margens de 128px+ (Fibonacci) para descompressão visual absoluta. |

**Veredicto Awwwards:** APPROVED (6/6). A transição para Light World mantém a autoridade sem depender do drama do preto puro.

---

## 2. AUDIT DO ESQUELETO (landing-page-architect)

### Mapa de Densidade (EQ de Frequências)

| Seção | Nome | Densidade | Função Narrativa |
| :--- | :--- | :--- | :--- |
| 01 | Hero (Preservado) | ALTA | Impacto Emocional / Mistério |
| 02 | Validação Forense | **BAIXA** | Descompressão / Prova Social Passiva |
| 03 | Gap Determinístico | MÉDIA | Proposta de Valor / Revelação |
| 04 | Mecanismo Alquímico | **ALTA** | Tensão / Complexidade Técnica |
| 05 | Conquista Narrativa | ALTA | Ação / Conversão |

**Status do Audit:** [APROVADO]. A sequência respeita a lei de não adjacência de altas densidades (exceto na transição final para o CTA, permitida por "conquista narrativa").

---

## 3. ESPECIFICAÇÕES POR SEÇÃO

### SEÇÃO 02: VALIDAÇÃO FORENSE

- **Função:** Validar a promessa do hero sem esforço argumentativo.
- **Layout:** Grid de 3 colunas, centralizado horizontalmente mas com ancoragem periférica (labels nos cantos).
- **Fundo:** `#F8F7F3` (Parchment).
- **Tipografia:**
    - **Valores:** Voz 1 (Cormorant Garamond), 120px, Light 300.
    - **Labels:** Voz 2 (DM Mono), 10px, Capslock, Tracking 0.4em.
- **Efeito:** Counter animation suave (GSAP) ao entrar no viewport.
- **Media:** Nenhuma (Tipografia pura).

### SEÇÃO 03: O GAP DETERMINÍSTICO

- **Função:** Apresentar a proposta de valor através da fragmentação da realidade.
- **Layout:** **Split Assimétrico 40/60**.
    - **Esq (Fixed):** Headline editorial + Label de Seção.
    - **Dir (Scroll):** Conteúdo operacional com o efeito `IdentityFragmenter`.
- **Fundo:** Transition Gradient (#F8F7F3 -> #EAE8E3).
- **Efeito:** `IdentityFragmenter` (WebGL). A imagem se fragmenta conforme o scroll, revelando metadados por baixo.
- **CTA:** Inline-underline ("Ver Auditoria").

### SEÇÃO 04: MECANISMO ALQUÍMICO

- **Função:** Provar a superioridade técnica do Elysian Lex.
- **Layout:** **Grid Brutalista 2x2** com bordas finas (#111110 @ 10%).
- **Fundo:** `#EAE8E3` (Stone).
- **Tipografia:** Voz 3 (EB Garamond) para parágrafos curtos, Voz 2 para índices de grid (01, 02...).
- **Media:** 4 instâncias de `ScramblePortrait` (ASCII/Halftone) processando imagens de documentos forenses.
- **Motion:** Staggered reveal dos cards (delay 0.1s entre cada).

### SEÇÃO 05: CONQUISTA NARRATIVA (CTA)

- **Função:** Conversão final.
- **Layout:** **Pinned Statement**. A frase principal fica fixa enquanto o botão "Certificar Ativo" emerge de um gradiente.
- **Fundo:** Transição Vertical para Dark (conquista narrativa permitida).
- **CTA:** **Ghost Button** (Borda 1px, tipografia Voz 2).
- **Motion:** Parallax reverso no fundo, criando profundidade de "túnel".

---

## 4. BRIEFING PARA CEOs ESPECIALISTAS

### [CEO-DESIGN]

- **Paleta:** Substituir todo o sistema de cores legatário pela escala Light World v2.1.
- **Espaçamento:** Padding vertical de 160px entre seções principais.
- **Bordas:** Usar 0.5px para todos os divisores estruturais.

### [CEO-EFFECTS]

- **Scroll:** Implementar `Lenis` ou GSAP `ScrollSmoother` para garantir a fluidez de Exo Ape.
- **Easing:** Obrigatório `cubic-bezier(0.23, 1, 0.32, 1)` para todas as transições.

### [CEO-COPY]

- **Voz:** Autoritativa, técnica, sem adjetivos de marketing ("revolucionário", etc.).
- **Estrutura:** Focar em "Mecanismo" antes de "Benefício".

---

## 5. CHECKLIST DE APROVAÇÃO (landing-page-architect)

| Critério | Status | Observação |
| :--- | :--- | :--- |
| Layout não-centralizado? | ✅ | Split Assimétrico e Grids Brutalistas. |
| Fonte Display S-Tier? | ✅ | Cormorant Garamond 300. |
| Máx 1 CTA por seção? | ✅ | Respeitado. |
| Sem Dark System sistêmico? | ✅ | Apenas na seção final por conquista narrativa. |
| Vetor de diferenciação? | ✅ | `IdentityFragmenter` e `ScramblePortrait` como arte forense. |

**Relatório completo. Aguardando aprovação para avançar para a fase de especificação técnica (refinar-cognicao).**
