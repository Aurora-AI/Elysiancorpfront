# Deteccao de Ambiente — Master Skill

## Ordem efetiva

1. `AURORA_AGENT`
2. Hint de runtime do agente ativo
3. Marcadores de diretorio no home do usuario
4. Fallback manual persistido

## Valores aceitos em `AURORA_AGENT`

- `antigravity`
- `claude-code`
- `codex`

## Runtime hints

Em hosts multi-agente, os marcadores de diretorio podem coexistir. Para evitar deteccao errada, a `master-skill` considera variaveis de runtime antes da heuristica por diretorio.

Hints atualmente suportados:

- Codex: `CODEX_SHELL`, `CODEX_THREAD_ID`, `CODEX_INTERNAL_ORIGINATOR_OVERRIDE`
- Claude Code: `CLAUDE_CODE_GIT_BASH_PATH`

## Fallback manual

Se nenhum criterio automatico resolver o agente ativo, o usuario pode forcar a deteccao com:

```text
python C:\Aurora\.skills\master-skill\scripts\master_skill.py init --agent codex --project <cwd>
```

O valor forçado e persistido em `user-config.json`.
