---
name: [skill-slug]
version: 1.0.0
updated: [YYYY-MM-DD]
classification: [global-agents|local-skills|planned]
status: [production|beta|planned]
domain: [marketing|design|product|code|infra]
description: |
  Breve descrição da skill em 2-3 linhas. Foco no valor entregue e
  no gatilho de ativação primário.
---

# [Nome Amigável da Skill]

Descrição detalhada da identidade do agente e seu propósito no ecossistema Aurora.

## Comandos

### `/[comando-principal]`
**Quando usar:** Descrição do cenário ideal.
**O que faz:** Passo a passo da lógica de execução.
**Output esperado:** Formato da resposta ao usuário.

---

## Semantic Triggers

### Keywords (tool_search)
- [primary-keyword-1], [primary-keyword-2], [synonym-1]
- [functional-area-1], [functional-area-2]

### Context Patterns
- [descrever o cenário de intenção do usuário que deve disparar esta skill]
- [exemplo: "usuário solicita auditoria de X usando Y"]
- [exemplo: "necessidade de converter A em B"]

### Negations (não disparar quando)
- [descrever cenários de confusão comum com outras skills]
- [exemplo: "a dúvida é sobre design (CEO-Design) e não sobre copy"]

### Agent Affinity
- Compatível com: [skill-a, skill-b]
- Informa: [skill-c]
- Requerido por: [skill-d]

### Observability
- Custo estimado por invocação: [BAIXO|MÉDIO|ALTO]
- Token budget recomendado: [N]
- Latência típica: [BAIXA|MÉDIA|ALTA]

---

## Restrições Negativas
- NUNCA [fazer X]
- SEMPRE [garantir Y]

---

## No de Ingestão (JSON)
```json
{
  "agent": "[skill-slug]",
  "node_type": "[NodeType]",
  "domain": "[domain]",
  "core_insight": "",
  "action": {
    "what": "",
    "deadline_days": 1,
    "owner": "rodrigo"
  },
  "tags": []
}
```
