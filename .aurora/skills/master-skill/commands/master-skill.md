# /master skill

Comando operacional da `master-skill`.

Repositorio central: `C:\Aurora\.skills`

Script deterministico: `C:\Aurora\.skills\master-skill\scripts\master_skill.py`

## Contrato

- Ler `C:\Aurora\.skills\catalog.json` como fonte unica de verdade.
- Ler `C:\Aurora\.skills\master-skill\config\agents.json` para destinos globais.
- Persistir `user-config.json` no diretorio da `master-skill`.
- Persistir `project-manifest.json` no projeto alvo.

## Comandos suportados

```text
/master skill init
/master skill status
/master skill list
/master skill list --tag strategy
/master skill info loop-balance-analyzer
/master skill install loop-balance-analyzer
/master skill install --status production
/master skill update loop-balance-analyzer
/master skill update --all
/master skill remove loop-balance-analyzer
/master skill installed
/master skill check-updates
```

## Mapeamento deterministico

```text
python C:\Aurora\.skills\master-skill\scripts\master_skill.py init --project <cwd>
python C:\Aurora\.skills\master-skill\scripts\master_skill.py status --project <cwd>
python C:\Aurora\.skills\master-skill\scripts\master_skill.py list [--tag <tag>]
python C:\Aurora\.skills\master-skill\scripts\master_skill.py info <skill>
python C:\Aurora\.skills\master-skill\scripts\master_skill.py install <skill> [<skill> ...] --project <cwd>
python C:\Aurora\.skills\master-skill\scripts\master_skill.py install --status production --project <cwd>
python C:\Aurora\.skills\master-skill\scripts\master_skill.py update <skill> [<skill> ...] --project <cwd>
python C:\Aurora\.skills\master-skill\scripts\master_skill.py update --all --project <cwd>
python C:\Aurora\.skills\master-skill\scripts\master_skill.py remove <skill> [<skill> ...] --project <cwd>
python C:\Aurora\.skills\master-skill\scripts\master_skill.py installed --project <cwd>
python C:\Aurora\.skills\master-skill\scripts\master_skill.py check-updates --project <cwd>
```

## Efeitos esperados

- `init`: gera `user-config.json` e `project-manifest.json`.
- `install`: copia a skill para `.aurora/skills/` e registra versao.
- `update`: sincroniza versoes instaladas com o catalogo central.
- `remove`: remove a skill do projeto sem tocar no catalogo central.
