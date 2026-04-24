# Ingestion Matrix

Contrato canonico da Matriz de Decisao de Ingestao.

## Campos obrigatorios

- `Documento`: titulo ou fonte compreensivel por humano.
- `Hash SHA-256`: identificador deterministico do conteudo bruto.
- `Classificacao`: `Material Cognitivo`, `Nova Skill` ou `Hibrido`.
- `Ruido detectado`: resumo da redundancia encontrada.
- `Ganho estimado`: impacto percentual em uma dimensao concreta.
- `Skills impactadas`: lista de skills, produtos ou dominios enriquecidos.
- `Nova skill`: nome proposto quando a classificacao exigir.
- `Decisao sugerida`: `INGERIR`, `DESCARTAR` ou `AGUARDAR`.
- `Status Pipeline`: [Stage 1/3: Avaliação Finalizada | Aguardando Gate]

## Heuristicas de decisao

- `INGERIR`: conhecimento novo, util e conectado a uma capacidade ativa da fabrica.
- `DESCARTAR`: redundancia alta, fonte fraca, hype sem aplicabilidade ou valor marginal.
- `AGUARDAR`: material promissor, mas dependente de contexto, validacao ou aprovacao adicional.

## Regra de ganho estimado

O ganho deve sempre responder:
- em que parte da fabrica o material muda comportamento
- para qual skill, produto ou decisao o ganho se aplica
- por que esse delta nao existia no corpus atual

---

> [!CAUTION]
> **GATE OPERACIONAL**: A aprovação desta matriz autoriza apenas a **Ingestão Cognitiva** (Custo e Evolução). Toda e qualquer proposição de código resultante da Stage 3 (Cientista) exigirá uma nova aprovação explícita do Comandante.
