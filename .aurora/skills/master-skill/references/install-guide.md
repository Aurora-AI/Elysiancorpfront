# Install Guide — Master Skill Aurora

## Instalação Global (executar uma vez por máquina)

### Antigravity
```
xcopy "C:\Aurora\.skills\master-skill" "%USERPROFILE%\.gemini\antigravity\skills\master-skill\" /E /I
```

### Claude Code
```
xcopy "C:\Aurora\.skills\master-skill" "%USERPROFILE%\.claude\skills\master-skill\" /E /I
```

### Codex
```
xcopy "C:\Aurora\.skills\master-skill" "%USERPROFILE%\.codex\skills\master-skill\" /E /I
```

## Inicialização
Após instalar, rodar em cada agente:
```
/master skill init
```

## Atualização
Quando .skills for atualizado:
```
/master skill update --all
```
