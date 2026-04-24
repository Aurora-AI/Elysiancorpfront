# AURORA DESIGN MANUAL — POST-HERO SECTION ARCHITECTURE
**Version:** 1.0.0  
**Scope:** Landing Pages de Alto Impacto — Sequência Narrativa de Seções  
**Contexto:** Otimizado para alimentar skills e agentes Aurora  
**Produto de referência:** Elysian Trustware Corp

---

## 0. PRINCÍPIO FUNDADOR

> **A seção abaixo do hero não é uma segunda venda. É uma pausa dramática.**

O hero carrega o peso emocional máximo de uma página. A seção imediatamente seguinte existe para que o usuário processe o que acabou de ver — e confie o suficiente para continuar descendo. Violar esse princípio é o erro mais comum e mais destrutivo no design de landing pages de alto impacto.

---

## 1. LEI DA CONTINUIDADE DIRECIONAL

### Definição
A seção pós-hero deve **continuar a direção visual em que o hero terminou** — não contrastar com ela.

### Regra operacional
```
IDENTIFIQUE o estado visual final do hero (cor, peso, energia)
→ A próxima seção parte DESSE estado
→ Nunca do estado inicial do hero
```

### Aplicação ao caso Elysian
O hero da Elysian opera em duas fases:
- **Fase 1:** Preto absoluto + rosto cinematográfico (peso máximo)
- **Fase 2:** Branco + tipografia "ELYSIAN" massiva + data matrix (inversão, leveza, revelação)

**O hero termina no BRANCO. A próxima seção começa no BRANCO.**

Retornar ao preto imediatamente após a fase branca é uma regressão narrativa — o usuário sente que o hero reiniciou. A jornada emocional quebra.

### Anti-padrão documentado (Elysian v2.0.26)
❌ Hero termina branco → Seção 1 preto absoluto idêntico ao hero fase 1  
✅ Hero termina branco → Seção 1 branco / off-white → transição gradual para dark

---

## 2. SISTEMA DE DENSIDADE VISUAL (EQ DE FREQUÊNCIAS)

A página inteira deve ser tratada como um equalizador emocional. Nunca duas seções de alta densidade adjacentes.

```
CAMADA          DENSIDADE    COR BASE         FUNÇÃO
─────────────────────────────────────────────────────────────────
Hero Fase 1     ALTA         Preto / drama    Impacto emocional
Hero Fase 2     MÉDIA        Branco / reveal  Revelação da marca
─────────────────────────────────────────────────────────────────
Seção 1         BAIXA        Branco / off-white  Descompressão + prova
Seção 2         MÉDIA        Transição          Proposta de valor
Seção 3         ALTA         Dark system        Tensão / problema
Seção 4         BAIXA        Neutro             Depoimentos / respiro
Seção Final     ALTA         Cor forte / CTA    Urgência + ação
─────────────────────────────────────────────────────────────────
```

**Regra:** Quando a densidade sobe, o conteúdo aprofunda. Quando a densidade desce, o usuário respira e processa.

---

## 3. ARQUITETURA DA SEÇÃO 1 (IMEDIATAMENTE ABAIXO DO HERO)

### 3.1 Função primária
Validar a promessa do hero. Não criar uma nova promessa.

### 3.2 Padrões aprovados para Seção 1

**Padrão A — Âncora de Confiança**
- Logos de clientes / parceiros
- Peso visual: mínimo
- Fundo: branco ou off-white (#F5F4F0)
- Sem CTA, sem venda

**Padrão B — Números Sociais**
- 3 estatísticas honestas em tipografia grande
- Peso visual: baixo-médio
- Fundo: branco
- Sem texto de suporte — os números falam sozinhos

**Padrão C — Citação Singular**
- Uma citação de cliente, grande, centralizada
- Peso visual: baixo
- Fundo: quase branco
- Nome + cargo pequenos abaixo

### 3.3 Regras tipográficas da Seção 1

| Elemento | Hero | Seção 1 |
|---|---|---|
| Headline display | 64–120px | 32–48px máximo |
| Corpo de texto | raro | 14–16px |
| Capslock labels | presentes | ausentes ou sutis |
| Peso | Black / ExtraBold | Regular / Light |

**A queda de escala tipográfica é obrigatória.** Ela sinaliza ao olho que a intensidade baixou.

### 3.4 Regras de cor da Seção 1

- Se o hero termina **claro** → Seção 1 é branca ou off-white
- Se o hero termina **escuro** → Seção 1 é dark com tom diferenciado (nunca idêntico)
- A cor de acento do hero pode aparecer com 30–40% de opacidade como elemento decorativo
- Sem novos sistemas de cor na Seção 1 — apenas extensão do vocabulário do hero

---

## 4. GESTÃO DA FRONTEIRA (A "COSTURA" ENTRE SEÇÕES)

A transição entre hero e seção 1 é onde 90% dos designs falha. Existem 4 técnicas válidas:

### Técnica 1 — Continuidade de fundo (seamless)
Mesmo fundo entre hero e seção 1. A mudança é apenas de conteúdo.  
**Quando usar:** Hero com fundo sólido claro ou escuro sem imagem.

### Técnica 2 — Corte limpo
Mudança de fundo abrupta mas intencional — funciona apenas quando há contraste suficiente e o corte é justificado pela narrativa.  
**Quando usar:** Hero termina com imagem fotográfica full-bleed; seção 1 começa em branco puro.

### Técnica 3 — Gradiente de transição
Gradiente vertical de ~200px que dissolve o fundo do hero no fundo da seção 1.  
**Quando usar:** Mudança de escuro para claro ou vice-versa dentro da mesma narrativa.

### Técnica 4 — Elemento de ancoragem
Um elemento visual do hero (ícone, linha, forma geométrica) aparece no topo da seção 1 como ponte.  
**Quando usar:** Hero e Seção 1 têm fundos diferentes mas precisam de continuidade de linguagem.

### Anti-padrões de fronteira
❌ Sombra pesada entre seções sem intenção  
❌ Border de cor arbitrária  
❌ Repetição idêntica de elemento decorativo do hero (ex: coordenadas X:Y aparecem igual em ambas as seções — parece copy-paste, não sistema)

---

## 5. QUANDO O DARK PODE VOLTAR

O sistema dark de uma marca premium pode e deve retornar — mas precisa ser **conquistado narrativamente**.

### Regra de retorno ao dark

```
Hero termina CLARO
→ Seção 1: CLARO (continuidade obrigatória)
→ Seção 2: TRANSIÇÃO (gradiente ou elemento de ponte)
→ Seção 3+: DARK (quando a narrativa pede tensão)
```

### Diferenciação de dark entre seções
Se o hero usa preto puro (#000000 ou #0A0A0A), as seções dark subsequentes **devem usar um tom diferente** para criar hierarquia:

| Contexto | Tom | Efeito adicional |
|---|---|---|
| Hero cinematográfico | #000000 | Fotografia, dramatismo |
| Seção de problema/tensão | #0D0D0D + noise grain sutil | Densidade técnica |
| Seção de produto | #060810 (azul-noite) | Precisão, tecnologia |
| CTA final | Cor de acento sólida | Urgência |

---

## 6. SISTEMA DE ELEMENTOS DECORATIVOS ENTRE SEÇÕES

Elementos como coordenadas (X: 182 Y: 286), wireframes geométricos, grids e data matrix criam a linguagem visual da marca. Regras de uso entre seções:

### 6.1 Evolução, não repetição
Cada seção deve **evoluir** o elemento decorativo, não repeti-lo.

```
Hero:     coordenadas + quadrado simples (fundação)
Seção 1:  apenas coordenadas, sem quadrado (redução)
Seção 2:  grid expandido, coordenadas ausentes (mutação)
Seção 3:  elemento em negativo / invertido (tensão)
```

### 6.2 Opacidade por seção
A intensidade dos elementos decorativos segue a densidade da seção:

| Seção | Opacidade do elemento decorativo |
|---|---|
| Hero | 100% (fundação) |
| Seção 1 (respiro) | 20–30% |
| Seção 2 (valor) | 40–50% |
| Seção 3 (tensão) | 60–70% |

---

## 7. ESTRUTURA NARRATIVA CANÔNICA DE LANDING PAGE DE ALTO IMPACTO

Sequência validada para produtos tech/B2B premium:

```
01. HERO           → Impacto + identidade + promessa
02. DESCOMPRESSÃO  → Prova social passiva (logos, stats)
03. O PROBLEMA     → Nomear a dor com precisão cirúrgica
04. A SOLUÇÃO      → Mecanismo único, não feature list
05. PROVA          → Cases, antes/depois, dados reais
06. OBJEÇÕES       → FAQ ou seção de desconstrução de dúvidas
07. CTA FINAL      → Uma ação. Sem ruído.
```

**Regra da seção 03 (O Problema):**
Esta seção pode (e deve) ser dark se a narrativa é de tensão. Mas é a **terceira** seção — não a primeira. O usuário já respirou, já confiou, já está pronto para sentir o peso do problema.

---

## 8. CHECKLIST DE VALIDAÇÃO — SEÇÃO PÓS-HERO

Use este checklist antes de aprovar qualquer seção imediatamente abaixo do hero:

```
[ ] O fundo da seção continua a direção visual FINAL do hero?
[ ] O tamanho da tipografia é menor que o menor texto do hero?
[ ] Existe espaço negativo generoso no topo da seção?
[ ] A seção valida a promessa do hero (não cria uma nova)?
[ ] A fronteira entre hero e seção é intencional (não acidental)?
[ ] Os elementos decorativos evoluem (não repetem) os do hero?
[ ] A densidade visual desta seção é BAIXA (respiro)?
[ ] Não há dois CTAs visíveis ao mesmo tempo (hero + seção 1)?
[ ] O sistema de cor é extensão do hero (não um novo sistema)?
[ ] A seção pode existir sem o hero e ainda fazer sentido?
        → Se SIM: a seção está brigando, não continuando.
        → Se NÃO: a seção está corretamente ancorada ao hero.
```

---

## 9. REGRAS ESPECÍFICAS PARA O SISTEMA ELYSIAN

Baseadas na análise visual das screenshots v2.0.26:

### 9.1 Vocabulário visual da marca
- **Tipografia display:** Serif editorial pesado (estilo didone/modern)
- **Tipografia técnica:** Monospace capslock em tracking extremo
- **Elementos decorativos:** Coordenadas cartesianas, wireframes geométricos, data matrix vertical
- **Paleta:** Preto puro ↔ Branco puro + acento dourado/âmbar (#C9A96E ou similar)

### 9.2 Sequência correta para o hero dual-phase da Elysian

```
Hero Fase 1 (preto + rosto)
    ↓
Hero Fase 2 (branco + ELYSIAN + matrix)
    ↓
Seção "O Desafio" → DEVE começar em BRANCO
    Background: #FFFFFF ou #F8F7F3
    Tipografia: preta, serifa, menor que o hero
    Label "O DESAFIO": dourado/âmbar, capslock, tracking alto
    Texto corpo: cinza escuro #1A1A1A, 16px, centralizado
    Transição para dark: gradiente no rodapé desta seção
    ↓
Dark system retorna a partir da seção seguinte
```

### 9.3 O título "O Gap Determinístico" no contexto correto
Este título tem poder. Mas ele precisa ser apresentado após a descompressão. A hierarquia correta:

1. **Label de seção:** `O DESAFIO` — âmbar, capslock, 11px tracking extremo
2. **Headline:** `O Gap Determinístico` — serifa, ~72px, preto sobre branco
3. **Subtítulo técnico:** `PROBABILISTIC ENGINES IN DETERMINISTIC ENVIRONMENTS...` — monospace, capslock, menor
4. **Corpo:** parágrafo explicativo

Essa hierarquia funciona em **branco**. Em preto, o label some, o subtítulo briga com o headline, e o corpo desaparece na massa escura.

---

## 10. GLOSSÁRIO OPERACIONAL PARA AGENTES

Termos utilizados neste manual com definição precisa para uso em prompts:

| Termo | Definição |
|---|---|
| **Descompressão** | Seção de baixa densidade imediatamente após o hero |
| **Continuidade Direcional** | Princípio de que a seção pós-hero continua o estado visual final do hero |
| **EQ de Frequências** | Metáfora para o ritmo de densidade visual ao longo da página |
| **Fronteira / Costura** | A transição visual entre duas seções adjacentes |
| **Dark System** | Conjunto de fundos escuros com variações de tom e textura de uma marca |
| **Âncora de Confiança** | Seção de prova social passiva (logos, stats) com peso visual mínimo |
| **Conquista Narrativa** | Princípio de que elementos de alta intensidade (dark, CTA, tensão) devem ser precedidos por contexto que os justifique |
| **Regressão Visual** | Erro de retornar ao estado inicial do hero após a fase final — quebra a jornada |
| **Evolução de Elemento** | Uso progressivo de elementos decorativos com variação intencional entre seções |

---

*Manual gerado por Aurora Design Intelligence — Mad Lab Aurora 2026*  
*Baseado em análise do Elysian Trustware Corp v2.0.26*  
*Para uso interno em skills e agentes da plataforma Aurora*