---
name: master-skill
description: |
  Orquestrador global de skills da Aurora. Descobre o catalogo central, detecta o agente ativo, instala skills no projeto atual e mantem manifestos de sincronizacao sem copia manual ad-hoc. Deve ser acionada sempre que o usuario pedir para instalar, listar, atualizar, remover ou inspecionar skills.
---

# Master Skill — Orquestrador Global Aurora

Voce e o ponto de entrada unico para todas as skills da fabrica Aurora.

Em vez de copiar skills manualmente para cada projeto, voce usa o repositorio central `C:\Aurora\.skills` como fonte de verdade para discovery, instalacao e atualizacao.

Arquivos de referencia:
- `..\catalog.json` - catalogo canonico de skills e versoes
- `config/agents.json` - mapa de ambientes e destinos de instalacao
- `references/env-detection.md` - protocolo de deteccao de ambiente
- `commands/master-skill.md` - contrato operacional dos comandos

---

## Responsabilidades

- Detectar o agente ativo sem pedir input desnecessario.
- Ler somente o `catalog.json` da raiz para listar, informar e versionar skills.
- Persistir `user-config.json` para configuracao do usuario e `project-manifest.json` para instalacoes do projeto.
- Instalar skills em `.aurora/skills/` no projeto atual.
- Atualizar ou remover skills sem tocar no catalogo central.

## Artefatos gerados

- `master-skill/user-config.json`
- `<projeto>/project-manifest.json`
- `<projeto>/.aurora/skills/<nome-da-skill>/`

---

## Deteccao de Ambiente

Leia `references/env-detection.md` para o protocolo completo.

Ordem aplicada:

```
1. Variável de ambiente AURORA_AGENT
2. Hints de runtime do agente ativo (ex.: CODEX_SHELL, CLAUDE_CODE_*)
3. Marcadores de diretorio no home do usuario
4. Fallback manual persistido em user-config.json
```

---

## Comandos Disponiveis

### `/master skill init`
- Detecta o agente ativo
- Persiste `user-config.json`
- Garante `project-manifest.json`
- Confirma o repositorio central e o catalogo

### `/master skill list`
- Lista skills do `catalog.json`
- Suporta filtro por `--tag`

### `/master skill install [nome-da-skill]`
- Copia a skill da raiz central para `.aurora/skills/`
- Registra versao no `project-manifest.json`
- Suporta multiplos nomes e `--status production`

### `/master skill update [nome-da-skill | --all]`
- Atualiza skill especifica ou todas as instaladas
- Compara versao instalada contra o `catalog.json`

### `/master skill remove [nome-da-skill]`
- Remove do projeto atual e atualiza o manifesto

### `/master skill info [nome-da-skill]`
- Exibe metadados da skill no `catalog.json`

---

## Implementacao Deterministica

- O contrato operacional dos comandos esta em `commands/master-skill.md`.
- A automacao deterministica esta em `scripts/master_skill.py`.
- Se o ambiente suportar slash commands, use o documento de comando.
- Se precisar de execucao direta, use o script Python.

---

## Regras de Ouro

- Nunca usar catalogo local duplicado.
- Nunca referenciar `install-guide.md`; ele nao existe neste contrato.
- Nunca instalar uma skill planejada como se fosse producao.
- Nunca copiar skills direto de um produto para outro; sempre partir de `C:\Aurora\.skills`.

---

## Semantic Triggers

### Keywords (tool_search)
- skill install, skill init, skill list, carregar skill, qual skill usar
- listar skills, instalar skill, atualizar skill, remover skill, inspecionar skill
- discovery de ferramentas, sincronizar skills, catalogo de skills

### Context Patterns
- usuário pede para instalar ferramenta ou nova funcionalidade
- usuário quer ver lista de skills disponíveis no sistema
- usuário pergunta qual skill usar para uma tarefa específica
- inicialização de ambiente ou projeto novo

### Negations (não disparar quando)
- uma skill específica já foi solicitada nominalmente (ex: "use qa-review")
- a tarefa é puramente técnica sem relação com o ecossistema de skills

### Agent Affinity
- Requerida por: todos os agentes da Aurora (bootstrap de ambiente)
- Compatível com: ingestor, bibliotecario, skill-creator
- Incompatível com: nenhuma

### Observability
- Custo estimado por invocação: BAIXO
- Token budget recomendado: 500
- Latência típica: RÁPIDA <5s
