---
name: agent-reflexion-code
description: |
  Skill de Reflexion para qualidade de código. Captura padrões
  de falha após erros/correções, os persiste como KIs no Vault,
  e os injeta como contexto preventivo em futuras OSs de código.
  DEVE ser acionada: após qualquer erro de código corrigido,
  antes de OSs de código em domínios com histórico de falhas,
  e ao final de OSs concluídas para registro de qualidade.
---

# agent-reflexion-code

Skill de memória ativa de qualidade de código da fábrica Aurora.

Opera como camada de inteligência sobre o RLM existente —
não substitui logs nem KIs genéricos, mas destila
especificamente padrões de falha e anti-patterns de código.

---

## Comandos

### `/reflexion-capture`

**Quando usar:** Após qualquer erro de código corrigido,
ou ao final de uma OS onde houve desvio do resultado esperado.

**O que faz:**
1. Analisa o contexto da sessão atual (erro + correção)
2. Classifica o tipo de falha (ver Taxonomia abaixo)
3. Verifica se o padrão já existe em `anti-patterns.md`
   — se sim: incrementa ocorrências e adiciona contexto
   — se não: cria novo card de anti-pattern
4. Persiste KI em `docs/Vault/Reflexion/KIs/`
5. Atualiza `docs/Vault/Reflexion/anti-patterns.md`

**Output obrigatório:**
```
REFLEXION CAPTURADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Produto:          [ElysianLex / CRM / Ozzmosis / ...]
Domínio:          [ASGI / Auth / Schema / Docker / ...]
Padrão:           [nome-do-anti-pattern]
É recorrente?:    [Sim (Nª vez) / Não (1ª ocorrência)]
KI persistido:    [caminho no Vault]
Injeção futura:   [Sim — será incluído no /reflexion-digest]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### `/reflexion-digest`

**Quando usar:** No início de qualquer OS de código em
domínio com histórico de falhas registrado.

**O que faz:**
1. Lê `docs/Vault/Reflexion/anti-patterns.md`
2. Filtra os 3-5 mais relevantes para o domínio da OS atual
3. Gera seção `⚠️ Anti-Patterns Conhecidos` para ser
   adicionada ao cabeçalho da OS antes da execução

**Output obrigatório:**
```
⚠️ ANTI-PATTERNS CONHECIDOS — [Domínio]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Para cada anti-pattern relevante:]

🔴 [NOME DO PADRÃO]
   Contexto:    [quando aparece]
   Causa raiz:  [por que acontece]
   Prevenção:   [o que verificar antes de codar]
   Última vez:  [data + produto]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### `/reflexion-review`

**Quando usar:** Após conclusão de uma OS de código,
antes de marcar como CONCLUÍDA.

**O que faz:**
1. Lê anti-patterns do domínio da OS encerrada
2. Verifica se o código entregue evitou os padrões conhecidos
3. Registra em `quality-deltas.md` se houve melhoria
   observável em relação a execuções anteriores

**Output obrigatório:**
```
REFLEXION REVIEW — [OS ID]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Anti-patterns verificados: [N]
Evitados com sucesso:      [N] ✅
Regressões detectadas:     [N] ❌
Delta de qualidade:        [+/- ou neutro]
Registro em Vault:         [Sim / Não]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Taxonomia de Falhas

Todo anti-pattern é classificado em uma dessas categorias:

| Categoria | Sigla | Exemplos |
|---|---|---|
| Contrato de Interface | CI | Schema inválido, tipo errado, campo ausente |
| Inicialização de Runtime | IR | Missing app instance, import circular, entry point |
| Configuração de Ambiente | CA | Hardcoded path, env var ausente, porta conflitante |
| Dependência Transitiva | DT | CUDA puxado indiretamente, versão incompatível |
| Isolamento entre Apps | IA | Import direto entre apps, path cross-repo |
| Concorrência | CC | Race condition, lock ausente, estado compartilhado |
| Persistência | PE | Dado não commitado, rollback não executado |

---

## Schema do KI de Qualidade

Ver `schema/reflexion-ki.schema.json`

Campos obrigatórios:
- `pattern_id`: slug único (ex: `asgi-subclass-missing-app`)
- `category`: uma das 7 categorias da Taxonomia
- `product`: produto onde ocorreu
- `first_seen`: data ISO
- `occurrences`: contador
- `description`: o que é o padrão
- `prevention_rule`: regra preventiva em 1 frase
- `example_fix`: snippet de código da correção (opcional)

---

## Semantic Triggers

### Keywords (tool_search)
- agent-reflexion-code, qualidade de código, anti-patterns, reflexão técnica
- auditoria de falhas, lições aprendidas, Knowledge Item, KI, prevenção de regressão
- taxonomia de falhas, captura de erro, quality-delta, auditoria de código

### Context Patterns
- após a correção de um bug, erro de runtime ou falha de infraestrutura (captura de lição aprendida)
- necessidade de registrar um padrão de falha recorrente para evitar que ele se repita (anti-pattern)
- solicitação de auditoria de qualidade rigorosa pós-execução de uma Ordem de Serviço (review)
- desejo de ler erros passados em um domínio específico (ex: Docker, ASGI) antes de iniciar nova tarefa (digest)
- análise de causas raízes e geração de regras preventivas de engenharia

### Negations (não disparar quando)
- a intenção é revisão estética ou de design system (CEO-Design)
- a dúvida é sobre a redação de copy ou mensagens ao usuário (CEO-Copy)
- trata-se de planejamento estratégico ou administrativo (CEO-Business Partner / CEO-Product Owner)

### Agent Affinity
- Compatível com: qa-review (trabalham em conjunto na validação final), product-integrity-engineer
- Informa: bibliotecario (para persistência de KIs no Vault), cientista (alimenta o delta de evolução técnica)
- Requerido por: site-builder (em domínios críticos)

### Observability
- Custo estimado por invocação: MÉDIO (envolve análise de causa raiz)
- Token budget recomendado: 800
- Latência típica: BAIXA 5-8s
