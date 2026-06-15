# GUIA DE GATES DE VALIDAÇÃO — MAD LAB AURORA

Este documento define os critérios práticos de avaliação e conformidade obrigatórios antes de qualquer entrega ou promoção de código do Mad Lab Aurora. Toda interface, animação, estrutura ou redação deve passar em seus respectivos gates.

---

## 1. Design Gate (Validação Visual)

**Foco:** Garantir intenção visual, composição, hierarquia estrutural e a ausência absoluta de aparência de IA ou padrões genéricos.

### Critérios de Aceite:
1. **Intenção Visual / Gesto Autoral:** O design deve demonstrar uma escolha deliberada e autoral de estilo (ex: minimalista, brutalista, editorial, etc.). Se parecer com um template padrão de mercado, é rejeitado.
2. **Composição & Grid:** Uso intencional do espaço nulo (respiração) para conferir peso visual aos elementos dominantes (máximo 1 elemento dominante por seção).
3. **Tipografia de Duas Vozes:** Contraste marcante entre a Voz Monumental (títulos em escala extrema com fontes serifadas/sinalizadoras fortes) e a Voz Editorial/Operacional (limpa, para wayfinding e corpo de texto).
4. **Paletas com Temperatura e Memória:** Tons com textura histórica e orgânica (ex: terra, pergaminho, dourado envelhecido, azul tempestade). A paleta deve se adaptar livremente ao tema do projeto, sendo proibido exigir fundos pretos (#000000) por padrão.
5. **Anti-Genericidade (Sinais Bloqueantes - REJEIÇÃO IMEDIATA):**
   - Hero centralizado clássico (Headline genérica + Subtítulo de 2 linhas + botão primário).
   - Grades paralelas de 3 colunas com Lucide Icons padrão.
   - Gradientes roxos/azuis estilo "SaaS genérico".
   - Glassmorphism decorativo sem propósito físico.
   - CTAs genéricos como "Saiba mais", "Começar" ou "Clique aqui".

---

## 2. Effects Gate (Validação Cinética)

**Foco:** Sincronizar o motion com a física real, intenção narrativa, fallback de acessibilidade e budgets estritos de performance.

### Critérios de Aceite:
1. **Função Cognitiva:** Todo efeito deve possuir um propósito claro (guiar leitura, dar feedback de interação ou ambientação narrativa). Se for meramente decorativo e puder ser removido sem perda de sentido, deve ser descartado.
2. **Silêncio de Repouso (0.8s):** Ativos e animações devem possuir um delay de repouso mínimo de **0.8 segundos** antes do início para garantir que o usuário perceba a arquitetura espacial primeiro.
3. **Física e Gravidade Real:** Transições com desaceleração natural (ease-out acentuado). Evitar easings elásticos ou de bounce que parecem infantis ou artificiais, a menos que justificados.
4. **Fallback e Acessibilidade:**
   - Suporte nativo à query CSS `prefers-reduced-motion`.
   - Fallback funcional em mobile (versão simplificada ou desabilitada).
5. **Performance Budgets (Hardware Comum/CPU-First):**
   - Desktop: **60fps** estáveis em GPU integrada (ex: Intel Iris Xe).
   - Mobile: **30fps** estáveis com fallback.
   - Proibição de bibliotecas de IA/GPU pesadas (CUDA, nvidia-*, torch) no client.
6. **Feature Flags Mínimas:**
   ```ts
   enabled: boolean
   quality: 'low' | 'med' | 'high'
   reducedMotion: boolean
   ```

---

## 3. Web Gate (Validação Técnica)

**Foco:** Responsividade, semântica correta, acessibilidade, performance de renderização e integridade dos estados da interface.

### Critérios de Aceite:
1. **Responsividade Mobile-First:** Transição fluida de grids e tipografia entre Desktop e Mobile sem quebras de layout.
2. **HTML5 Semântico:** Estruturação correta das páginas utilizando `<header>`, `<main>`, `<section>`, `<nav>`, `<footer>` e hierarquia correta de headings com apenas um `<h1>` por página.
3. **Acessibilidade Web:** Uso de Aria labels em botões e elementos interativos, contraste de texto acessível e navegação por teclado.
4. **Estados Reais Completos:** Implementação e validação visual de todos os estados de interação:
   - Hover e Focus
   - Active e Disabled
   - Loading e validação de erros de inputs
5. **Integridade:** Zero trechos de código incompletos, layouts mockados ou placeholders genéricos.

---

## 4. Copy Gate (Validação de Texto)

**Foco:** Especificidade, densidade de palavras e CTAs concretos.

### Critérios de Aceite:
1. **Densidade de Palavra:** Cada palavra deve ter o peso de uma sentença. Evitar parágrafos longos explicativos; priorizar sínteses monumentais.
2. **Ausência de Clichês:** Eliminar jargões de startups, termos genéricos de "transformação digital" ou textos gerados automaticamente.
3. **CTAs Concretos:** Substituir botões vagos por ações explícitas orientadas a valor real do produto (ex: "Verificar Contrato" em vez de "Saiba mais").
4. **Coerência de Tom (ICP):** Adequação exata do tom para o público-alvo do vertical (ex: sobriedade e autoridade jurídica no Elysian Lex; clareza numérica no Silent Operator/CRM).
